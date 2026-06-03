# Source Management — Enterprise Search Plugin

> 所属插件：[Enterprise Search](/plugins/enterprise-search) · 来源：Anthropic knowledge-work-plugins · 兼容：Cowork + Claude Code

---

## 概述

Source Management 是 Enterprise Search 插件的基础设施技能，负责感知当前可用的 MCP 数据源、指导用户连接新源、管理不同查询类型下的源优先级排序，以及优雅处理速率限制问题。它解决了企业搜索中最根本的挑战——信息散落在数十个工具中，用户不知道哪些工具已连接、哪些可以搜索、以及如何扩展搜索范围。

---

## 基本信息

| 属性 | 值 |
|---|---|
| **技能名称** | `source-management` |
| **插件** | Enterprise Search |
| **触发方式** | auto（由 `/search` 和 `/digest` 命令自动调用） |
| **Slash 命令** | `/search`, `/digest` |
| **用户可调用** | 否（内部技能，自动运行） |
| **官方源码** | [GitHub](https://github.com/anthropics/knowledge-work-plugins/tree/main/enterprise-search) |

### 触发短语
- "search for [X]"（自动检测可用源）
- "connect [tool]"（引导用户配置新源）
- "why can't I search [source]"（解释源不可用的原因）

---

## 架构设计

```
+------------------------------------------------------------------+
|                    SOURCE MANAGEMENT                                |
+------------------------------------------------------------------+
|  STANDALONE (always works)                                        |
|  +  Source Availability Detection (通过 MCP 工具前缀检测)          |
|  +  Query-Type Priority Ordering (不同查询类型的源优先级)         |
|  +  User Guidance (引导用户连接新源)                              |
|  +  Rate Limit Handling (优雅处理限流)                            |
+------------------------------------------------------------------+
|  SUPERCHARGED (when MCP sources are connected)                    |
|  +  ~~chat: 检测 Slack MCP 是否可用                               |
|  +  ~~knowledge base: 检测 Wiki MCP 是否可用                      |
|  +  ~~project tracker: 检测项目管理工具 MCP 是否可用              |
|  +  ~~email: 检测邮件 MCP 是否可用                                |
|  +  ~~cloud storage: 检测云存储 MCP 是否可用                      |
|  +  ~~CRM: 检测 CRM MCP 是否可用                                  |
+------------------------------------------------------------------+
```

---

## 核心能力

### 1. 源可用性检测（Source Availability Detection）

通过检查 MCP 工具前缀来判断哪些源已连接并可搜索。

| 源类型 | 关键 MCP 工具 | 检测方式 |
|---|---|---|
| **~~chat** | 搜索消息、读取频道和线程 | 检查 chat 相关 MCP 工具是否存在 |
| **~~email** | 搜索邮件、读取单封邮件 | 检查 email 相关 MCP 工具是否存在 |
| **~~cloud storage** | 搜索文件、获取文档内容 | 检查 storage 相关 MCP 工具是否存在 |
| **~~project tracker** | 搜索任务、类型感知搜索 | 检查 project 相关 MCP 工具是否存在 |
| **~~CRM** | 查询账户、联系人、商机 | 检查 CRM 相关 MCP 工具是否存在 |
| **~~knowledge base** | 语义搜索、关键词搜索 | 检查 knowledge base 相关 MCP 工具是否存在 |

### 2. 查询类型优先级排序（Query-Type Priority Ordering）

不同查询类型应优先搜索不同的源，以权重影响结果排序而非跳过源。

| 查询类型 | 优先级排序（从高到低） |
|---|---|
| **Decision** | ~~chat > ~~email > ~~cloud storage > Wiki > 任务跟踪器 |
| **Status** | 任务跟踪器 > ~~chat > ~~cloud storage > ~~email > Wiki |
| **Document** | ~~cloud storage > Wiki > ~~email > ~~chat > 任务跟踪器 |
| **People** | ~~chat > 任务跟踪器 > ~~cloud storage > CRM > ~~email |
| **Factual/Policy** | Wiki > ~~cloud storage > ~~email > ~~chat |
| **通用查询** | ~~chat > ~~email > ~~cloud storage > Wiki > 任务跟踪器 > CRM |

### 3. 速率限制处理（Rate Limit Handling）

当 MCP 源返回限流响应时，优雅降级而非阻塞整个搜索。

| 限流阶段 | 处理策略 |
|---|---|
| 检测 | 识别 HTTP 429、速率限制错误消息、节流响应 |
| 处理 | 不立即重试，继续使用其他源搜索 |
| 通知 | 告知用户哪些源被限流以及何时重试 |
| 预防 | 避免不必要的 API 调用，使用定向查询而非广度扫描 |

---

## 输出格式

```markdown
## 搜索结果：[查询主题]

已搜索以下源：
- ~~chat: 可用
- ~~email: 可用
- ~~cloud storage: 可用
- ~~project tracker: 未连接
- ~~CRM: 未连接
- ~~knowledge base: 暂不可用（速率限制，2 分钟后重试）

[综合搜索结果...]

注意：如您希望搜索更全面的范围，可以连接更多源。当前未连接的源包括项目管理工具和 CRM。
```

---

## 使用场景与案例

### 场景一：源缺失时的用户引导

**输入**：用户首次使用 `/search`，只有 ~~chat 已连接

**Source Management 输出**：
```
You currently have 1 source(s) connected: ~~chat.

To expand your search, you can connect additional sources in your MCP settings:
- ~~email — emails, conversations, attachments
- ~~cloud storage — docs, sheets, slides
- ~~project tracker — tasks, projects, milestones
- ~~CRM — accounts, contacts, opportunities
- ~~knowledge base — wiki pages, knowledge base articles

The more sources you connect, the more complete your search results.
```

**关键价值**：用户无需猜测如何扩展搜索能力，系统主动提供清晰的配置路径和每个源的能力说明。

### 场景二：特定源不可用时的优雅降级

**输入**：用户搜索 "What's the status of Project Aurora?"，但 ~~project tracker 未连接

**Source Management 输出**：
```
Project Aurora isn't currently connected. To add it:
1. Open your MCP settings
2. Add the project tracker MCP server configuration
3. Authenticate when prompted

Once connected, it will be automatically included in future searches.

Meanwhile, I'll search the sources currently available (~~chat, ~~email, ~~cloud storage)
for information about Project Aurora.
```

**关键价值**：系统不会因为某个源不可用而拒绝搜索，而是继续使用可用源提供部分答案，同时给出清晰的配置指引。

---

## 与其他工具对比

| 维度 | Source Management (本技能) | Elastic Workplace Search | Google Cloud Search | 手动管理源 |
|---|---|---|---|---|
| 源检测方式 | 自动检测 MCP 工具前缀 | 管理员手动配置连接器 | 管理员配置数据源 | 用户自行记忆哪些工具有账号 |
| 优先级排序 | 按查询类型动态调整 6 类源优先级 | 统一索引，无查询级优先级 | 统一索引，支持结果提升规则 | 用户自行决定先搜哪个工具 |
| 限流处理 | 优雅降级 + 用户通知 + 预防策略 | 连接器级重试机制 | API 配额管理 | 无，遇到限流需手动等待 |
| 用户引导 | 主动提示未连接源及其配置方法 | 管理员界面配置 | GWS Admin 控制台配置 | 无 |
| 源健康监控 | 会话级跟踪状态 | 管理面板监控 | 管理控制台 | 无 |
| 扩展新源 | 自动识别新增 MCP 工具 | 需安装和配置新连接器 | 需管理员添加新数据源 | 需手动注册和登录 |

---

## 连接工具后的增强能力

| MCP 连接 | 增强能力 |
|---|---|
| ~~chat (Slack) | 自动检测消息搜索能力是否可用 |
| ~~knowledge base | 自动检测 Wiki 语义搜索是否可用 |
| ~~project tracker (Linear/Asana) | 自动检测任务搜索能力是否可用 |
| ~~email (Gmail/O365) | 自动检测邮件搜索能力是否可用 |
| ~~cloud storage (Google Drive) | 自动检测文档搜索能力是否可用 |
| ~~CRM | 自动检测客户记录查询能力是否可用 |

---

## 最佳实践

1. **尽早引导用户连接核心源**：当检测到用户只有 1-2 个源时，主动推荐连接 ~~chat、~~email 和 ~~cloud storage 这三个最高频使用的源，它们覆盖了日常工作中 80% 以上的信息检索需求。

2. **限流时不要阻塞整体搜索**：当某个源被限流时，继续使用其他可用源执行搜索，并在结果中明确告知用户哪些源未覆盖到。用户宁可得部分答案也不愿意等待。

3. **源健康状态会话级缓存**：在一个会话中缓存源的可用性和限流状态，避免重复检测相同的 MCP 工具，减少不必要的 API 调用。

4. **优先级排序影响权重而非跳过源**：即使某个源在特定查询类型中优先级较低，也不应完全跳过它。优先级应影响结果排序的权重，确保低优先级源中高度相关的结果仍能被用户看到。

5. **自定义源的自动适配**：Enterprise Search 插件可以适配任何 MCP 连接的源。当新增 MCP 服务器时，Source Management 会自动检测并纳入搜索范围，无需修改插件代码。

---

## 参考链接

- [Plugin docs](/plugins/enterprise-search)
- [GitHub source](https://github.com/anthropics/knowledge-work-plugins/tree/main/enterprise-search)
