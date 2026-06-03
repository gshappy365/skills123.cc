# Search Strategy — Enterprise Search Plugin

> 所属插件：[Enterprise Search](/plugins/enterprise-search) · 来源：Anthropic knowledge-work-plugins · 兼容：Cowork + Claude Code

---

## 概述

Search Strategy 是 Enterprise Search 插件的核心智能层，负责将用户的自然语言问题分解为针对多个数据源的并行搜索请求，并最终产出经过排序、去重和相关性评分的结果。它解决了知识工作者每天花费数小时在 Slack、邮件、文档、Wiki 等多个工具之间切换搜索的核心痛点，通过 Query Decomposition（查询分解）、Source-Specific Query Translation（跨源查询翻译）和 Ambiguity Handling（歧义处理）三大机制，让一次查询就能覆盖所有信息源。

---

## 基本信息

| 属性 | 值 |
|---|---|
| **技能名称** | `search-strategy` |
| **插件** | Enterprise Search |
| **触发方式** | auto（由 `/search` 和 `/digest` 命令自动调用） |
| **Slash 命令** | `/search`, `/digest` |
| **用户可调用** | 否（内部技能，通过 slash 命令间接触发） |
| **官方源码** | [GitHub](https://github.com/anthropics/knowledge-work-plugins/tree/main/enterprise-search) |

### 触发短语
- "What did we decide about [X]?"
- "What's the status of [project]?"
- "Where's the doc for [topic]?"
- "Who's working on [project]?"
- "What's our policy on [topic]?"

---

## 架构设计

```
+------------------------------------------------------------------+
|                      SEARCH STRATEGY                               |
+------------------------------------------------------------------+
|  STANDALONE (always works)                                        |
|  +  Query Type Classification (Decision / Status / Document ...)  |
|  +  Query Decomposition (keywords, entities, intent, constraints) |
|  +  Sub-Query Generation per Source                               |
|  +  Result Ranking (relevance scoring + authority hierarchy)      |
|  +  Fallback Strategies (broadening, source skipping)             |
+------------------------------------------------------------------+
|  SUPERCHARGED (when MCP sources are connected)                    |
|  +  ~~chat: semantic + keyword search with Slack-native filters   |
|  +  ~~knowledge base: semantic search on wiki pages               |
|  +  ~~project tracker: task search with status/assignee filters   |
|  +  ~~email: message search with date/author filters              |
|  +  ~~cloud storage: document content search                      |
|  +  ~~CRM: record query on accounts, contacts, opportunities      |
+------------------------------------------------------------------+
```

---

## 核心能力

### 1. 查询分解（Query Decomposition）

将用户的自然语言问题拆解为结构化的搜索组件，并针对不同查询类型采用差异化的搜索策略。

| 查询类型 | 示例 | 策略 |
|---|---|---|
| Decision | "What did we decide about X?" | 优先搜索聊天记录和邮件，寻找结论性信号 |
| Status | "What's the status of Project Y?" | 优先搜索任务跟踪器和近期活动 |
| Document | "Where's the spec for Z?" | 优先搜索云存储和 Wiki |
| Person | "Who's working on X?" | 搜索任务分配、消息作者、文档协作者 |
| Factual | "What's our policy on X?" | 优先搜索 Wiki 和官方文档 |
| Temporal | "When did X happen?" | 使用宽泛日期范围搜索，寻找时间戳 |
| Exploratory | "What do we know about X?" | 跨所有源广泛搜索并综合 |

### 2. 跨源查询翻译（Source-Specific Query Translation）

针对每个数据源生成其原生查询语法的子查询，确保搜索意图被准确传达。

| 源类型 | 语义搜索 | 关键词搜索 | 特有过滤器 |
|---|---|---|---|
| ~~chat | 自然语言问题 | 关键词 + 频道/日期过滤 | `from:`, `in:`, `after:`, `before:`, `is:thread`, `has:file` |
| ~~knowledge base | 概念性描述查询 | 精确短语匹配 | 无特殊语法 |
| ~~project tracker | 不支持 | 文本搜索 + workspace 限定 | `assignee_any`, `completed`, `resource_subtype` |
| ~~email | 自然语言问题 | 关键词 + 主题行搜索 | `from:`, `after:`, `before:` |

### 3. 结果排序与相关性评分（Result Ranking & Relevance Scoring）

根据查询类型动态调整评分权重，确保最相关的结果排在前面。

| 评分因子 | Decision 权重 | Status 权重 | Document 权重 | Factual 权重 |
|---|---|---|---|---|
| 关键词匹配 | 0.3 | 0.2 | 0.4 | 0.3 |
| 时效性 | 0.3 | 0.4 | 0.2 | 0.1 |
| 权威性 | 0.2 | 0.1 | 0.3 | 0.4 |
| 完整性 | 0.2 | 0.3 | 0.1 | 0.2 |

---

## 输出格式

```markdown
## 搜索结果：[查询主题]

根据您在 [源列表] 中的搜索，以下是综合结果：

[直接答案，基于最相关的 1-3 个来源]

### 详细发现
- [来源 A]：[关键信息]
- [来源 B]：[关键信息]

### 来源
- [源类型]: [具体位置] — [日期]
- [源类型]: [具体位置] — [日期]

注意：[如有源不可用或结果受限，在此说明]
```

---

## 使用场景与案例

### 场景一：追踪项目决策

**输入**：用户提问 "What did we decide about the API migration timeline?"

**Search Strategy 处理过程**：
1. 分类为 Decision 查询类型
2. 提取关键词：API migration, timeline, decision
3. 并行生成子查询：
   - ~~chat: "API migration timeline decision" (语义) + "API migration" in:#engineering after:2025-01-01
   - ~~knowledge base: 语义搜索 "API migration timeline decision"
   - ~~project tracker: 文本搜索 "API migration"
4. 结果排序：优先采用聊天记录的结论性消息和邮件确认
5. 去重合并后输出综合答案

**关键价值**：无需手动翻查多个工具，一次查询即可获得决策的完整时间线和证据链。

### 场景二：模糊查询的歧义处理

**输入**：用户提问 "search for the migration"

**Search Strategy 处理过程**：
1. 检测到 "migration" 存在多种可能含义
2. 生成一个聚焦的澄清问题而非盲目猜测：
   - "I found references to a few migrations. Are you looking for: 1) The database migration (Project Phoenix), 2) The cloud migration (AWS -> GCP), 3) The email migration (Exchange -> O365)"
3. 用户选择后，针对性地生成子查询

**关键价值**：避免在歧义场景下返回大量无关结果，通过一次精准的澄清大幅提升搜索效率。

---

## 与其他工具对比

| 维度 | Search Strategy (本技能) | Glean | Coveo | 手动搜索 |
|---|---|---|---|---|
| 查询理解 | 自动分类 7 种查询类型，动态调整策略 | 基础 NLP 分类，支持自然语言 | AI 驱动查询理解，支持意图识别 | 依赖用户自行选择搜索工具和关键词 |
| 跨源查询 | 并行执行，总耗时约等于最慢源 | 统一索引后查询，速度较快 | 统一索引 + 源级联查询 | 逐个工具搜索，手动汇总 |
| 查询翻译 | 为每个源生成原生语法子查询 | 统一查询语言，无需翻译 | 连接器自动翻译 | 用户需掌握每个工具的搜索语法 |
| 歧义处理 | 主动提出聚焦的澄清问题 | 返回模糊匹配结果 | 提供建议性搜索词 | 无，需用户自行重试 |
| 降级策略 | 四级降级：跳过、放宽、建议、重试 | 统一索引降级为源级搜索 | 缓存 + 源级回退 | 无 |
| 部署方式 | MCP 插件，零基础设施 | SaaS 平台，需索引配置 | SaaS 平台，需连接器配置 | 无需部署 |

---

## 连接工具后的增强能力

| MCP 连接 | 增强能力 |
|---|---|
| ~~chat (Slack) | 支持语义搜索、频道过滤 (`in:#engineering`)、消息作者过滤 (`from:`) |
| ~~knowledge base | 支持语义搜索和精确短语匹配，自动检索 Wiki 页面 |
| ~~project tracker (Linear/Asana) | 支持任务状态过滤、负责人过滤、workspace 限定 |
| ~~email (Gmail/O365) | 支持日期范围、作者、主题行搜索 |
| ~~cloud storage (Google Drive) | 支持文档内容全文搜索 |
| ~~CRM | 支持客户记录查询（账户、联系人、商机） |

---

## 最佳实践

1. **优先使用语义搜索**：对于概念性问题（"What do we think about..."）或不确定关键词的查询，语义搜索的效果远优于关键词搜索。仅在已知确切术语、项目名或缩写时使用关键词搜索。

2. **善用查询放宽策略**：当搜索结果过少时，按顺序放宽约束——先移除日期过滤，再移除源限定，最后保留核心实体词。不要一次性放宽所有条件。

3. **避免不必要的澄清**：只有当存在真正不同的解释且会显著影响搜索范围时才向用户提问。如果轻微歧义可以通过返回多个角度的结果来解决，直接执行搜索而非追问。

4. **利用多查询变体覆盖别名**：对于可能被不同方式提及的主题（如 "Kubernetes" / "k8s" / "cluster"），同时生成多个查询变体以提高召回率。

5. **监控源健康状态**：在会话中跟踪每个源的可用性和速率限制状态。当某个源被限流时，继续使用其他源搜索，并在结果中明确告知用户哪些源未覆盖到。

---

## 参考链接

- [Plugin docs](/plugins/enterprise-search)
- [GitHub source](https://github.com/anthropics/knowledge-work-plugins/tree/main/enterprise-search)
