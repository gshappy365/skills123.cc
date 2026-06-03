# Knowledge Synthesis — Enterprise Search Plugin

> 所属插件：[Enterprise Search](/plugins/enterprise-search) · 来源：Anthropic knowledge-work-plugins · 兼容：Cowork + Claude Code

---

## 概述

Knowledge Synthesis 是 Enterprise Search 插件的"最后一公里"技能，负责将来自多个数据源的原始搜索结果转化为连贯、可信且有完整来源归因的综合答案。它解决了跨源信息重复、来源权威性不一致、大量结果难以消化等核心问题，通过 Deduplication（去重）、Confidence Scoring（置信度评分）和 Adaptive Summarization（自适应摘要）三大机制，确保用户获得的是可直接使用的答案而非原始数据列表。

---

## 基本信息

| 属性 | 值 |
|---|---|
| **技能名称** | `knowledge-synthesis` |
| **插件** | Enterprise Search |
| **触发方式** | auto（由 `/search` 和 `/digest` 命令自动调用） |
| **Slash 命令** | `/search`, `/digest` |
| **用户可调用** | 否（内部技能，由 Search Strategy 触发） |
| **官方源码** | [GitHub](https://github.com/anthropics/knowledge-work-plugins/tree/main/enterprise-search) |

### 触发短语
- 所有 `/search` 查询的结果呈现阶段
- 所有 `/digest` 摘要的生成阶段

---

## 架构设计

```
+------------------------------------------------------------------+
|                    KNOWLEDGE SYNTHESIS                              |
+------------------------------------------------------------------+
|  STANDALONE (always works)                                        |
|  +  Cross-Source Deduplication (合并相同信息的不同来源)            |
|  +  Thematic Clustering (按主题分组相关结果)                       |
|  +  Confidence Assessment (时效性 x 权威性 x 一致性)              |
|  +  Narrative Synthesis (生成连贯叙述而非逐源罗列)                |
|  +  Adaptive Summarization (根据结果数量选择摘要粒度)             |
+------------------------------------------------------------------+
|  SUPERCHARGED (when MCP sources are connected)                    |
|  +  ~~chat: 提取消息线程上下文和结论信号                          |
|  +  ~~knowledge base: 引用官方文档作为权威来源                    |
|  +  ~~project tracker: 关联任务状态作为时效性证据                 |
|  +  ~~email: 提取正式确认信息作为高置信度来源                     |
+------------------------------------------------------------------+
```

---

## 核心能力

### 1. 跨源去重（Cross-Source Deduplication）

同一信息往往出现在多个工具中，本技能通过信号检测自动识别并合并重复内容。

| 去重信号 | 说明 | 合并策略 |
|---|---|---|
| 文本内容高度相似 | 相同或几乎相同的描述 | 合并为单一叙述，引用所有来源 |
| 相同作者 + 相近时间戳 | 同一人在同一天/相邻天发布 | 使用最完整版本为主文本 |
| 引用同一实体 | 项目名、文档名、决策编号一致 | 合并实体信息，标注多个来源 |
| 源间相互引用 | "as discussed in ~~chat", "per the email" | 建立时间线，合并为连贯叙事 |

### 2. 置信度评估（Confidence Assessment）

并非所有结果都同等可信，系统根据时效性和权威性两个维度动态评估置信度。

| 时效性 | 置信度影响 | 权威性层级 | 权威度 |
|---|---|---|---|
| 今天/昨天 | 当前状态高置信度 | 官方 Wiki / 知识库 | 最高 |
| 本周 | 良好置信度 | 共享文档（最终版） | 高 |
| 本月 | 中等，可能已变化 | 邮件公告 | 高 |
| 超过一个月 | 较低，标记为可能过时 | 会议记录 | 中高 |
| - | - | 聊天记录（线程结论） | 中等 |
| - | - | 聊天记录（进行中讨论） | 较低 |
| - | - | 草稿文档 | 低 |

### 3. 自适应摘要（Adaptive Summarization）

根据结果集的大小动态调整信息呈现的粒度和结构。

| 结果数量 | 呈现策略 | 输出结构 |
|---|---|---|
| 1-5 条 | 逐一呈现，无需摘要 | 直接答案 + 各源详情 + 完整来源列表 |
| 5-15 条 | 按主题分组，每组摘要 | 总体答案 + 主题分组 + Top 来源 |
| 15+ 条 | 高层综合，提供下钻入口 | 总体答案 + 关键发现（含支持源数）+ Top 来源 + 下钻邀请 |

---

## 输出格式

```markdown
## [综合答案标题]

[直接答案，基于多个来源的综合叙述]

### 关键发现
- [发现 1]（来自 N 个来源）
- [发现 2]（来自 N 个来源）
- [发现 3]（来自 N 个来源）

### 来源
- [源类型]: [具体位置] — [日期] — [描述]
- [源类型]: [具体位置] — [日期] — [描述]

注意：[如需进一步深入某个方面，在此提供下钻邀请]
```

---

## 使用场景与案例

### 场景一：决策追溯与多方验证

**输入**：Search Strategy 返回的原始结果
- ~~chat 结果: "Sarah said in #eng: 'let's go with REST, GraphQL is overkill for our use case'"
- ~~email 结果: "Subject: API Decision — Sarah's email confirming REST approach with rationale"
- ~~cloud storage 结果: "API Design Doc v3 — updated section 2 to reflect REST decision"
- ~~project tracker 结果: "Task: Finalize API approach — marked complete by Sarah"

**Knowledge Synthesis 输出**：
```
The team decided to go with REST over GraphQL for the API redesign. Sarah made the
call, noting that GraphQL was overkill for the current use case. This was discussed
in #engineering on Tuesday, confirmed via email Wednesday, and the design doc has
been updated to reflect the decision. The related ~~project tracker task is marked complete.

Sources:
- ~~chat: #engineering thread (Jan 14)
- ~~email: "API Decision" from Sarah Chen (Jan 15) — formal confirmation
- ~~cloud storage: "API Design Doc v3" (updated Jan 15) — updated specification
- ~~project tracker: "Finalize API approach" (completed Jan 15)
```

**关键价值**：用户获得的是一个完整的决策故事线，而非四个孤立的搜索结果。所有信息被去重合并、按时间线组织、并标注了每个来源的角色。

### 场景二：冲突信息处理

**输入**：关于 API 方案存在矛盾的搜索结果
- ~~chat 讨论（1月10日）建议 GraphQL
- Sarah 的邮件（1月15日）确认 REST
- 设计文档（1月15日更新）反映 REST

**Knowledge Synthesis 输出**：
```
I found conflicting information about the API approach:
- The ~~chat discussion on Jan 10 suggested GraphQL
- But Sarah's email on Jan 15 confirmed REST
- The design doc (updated Jan 15) reflects REST

The most recent sources indicate REST was the final decision,
but the earlier ~~chat discussion explored GraphQL first.
```

**关键价值**：系统不会默默选择一个版本，而是主动呈现冲突并解释时间线和最终结论，让用户理解决策的演进过程。

---

## 与其他工具对比

| 维度 | Knowledge Synthesis (本技能) | Mem | Notion AI Q&A | 手动汇总 |
|---|---|---|---|---|
| 跨源去重 | 基于文本相似度、作者、时间戳、实体引用的多信号检测 | 基于向量相似度的自动去重 | 仅限 Notion 内部，无跨源去重 | 完全依赖人工记忆和判断 |
| 置信度评分 | 时效性 x 权威性 x 一致性的三维评分 | 仅时效性排序 | 无显式置信度评分 | 依赖个人对来源的主观判断 |
| 冲突处理 | 主动呈现冲突，解释时间线和结论演进 | 返回最相关结果，不处理冲突 | 返回相关页面列表 | 需人工对比不同来源 |
| 摘要粒度 | 三级自适应（小/中/大结果集） | 固定摘要长度 | 无自适应摘要 | 取决于个人总结能力 |
| 来源归因 | 内联引用 + 文末来源列表，含具体位置和日期 | 结果列表式归因 | 页面链接引用 | 需手动记录来源 |
| 反模式防护 | 明确禁止逐源罗列、掩埋答案、忽略冲突等行为 | 无显式规则 | 无显式规则 | 无 |

---

## 连接工具后的增强能力

| MCP 连接 | 增强能力 |
|---|---|
| ~~chat (Slack) | 提取线程上下文和结论性消息作为权威依据 |
| ~~knowledge base | 引用 Wiki 页面作为高权威来源，提供精确章节引用 |
| ~~project tracker | 关联任务完成状态作为时效性证据 |
| ~~email | 提取正式确认邮件作为高置信度来源 |
| ~~cloud storage | 获取文档最新版本和修改历史 |

---

## 最佳实践

1. **始终以答案开头**：综合答案的第一句应该是用户问题的直接回答，而非搜索过程的描述。用户关心的是答案，不是你如何找到答案。

2. **按主题分组，而非按来源罗列**：最严重的反模式是"From ~~chat: ... From ~~email: ... From ~~cloud storage: ..."的逐源罗列。正确的做法是将所有来源中关于同一主题的信息合并叙述。

3. **主动呈现冲突而非掩盖**：当不同来源的信息存在矛盾时，不要默默选择其中一个版本。主动呈现冲突，解释时间线和最终的结论演进，让用户了解全貌。

4. **置信度决定表述方式**：高置信度时使用直接陈述（"The team decided..."），中等置信度时使用条件性表述（"Based on... the team was leaning toward..."），低置信度时明确标注不确定性（"I found a reference... but couldn't find a formal decision..."）。

5. **大量结果时提供下钻入口**：当结果超过 15 条时，提供高层综合后主动邀请用户深入某个具体方面，避免信息过载。

---

## 参考链接

- [Plugin docs](/plugins/enterprise-search)
- [GitHub source](https://github.com/anthropics/knowledge-work-plugins/tree/main/enterprise-search)
