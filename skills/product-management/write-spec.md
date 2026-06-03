# Write Spec — Product Management Plugin

> 所属插件：[Product Management](/plugins/product-management) · 来源：Anthropic knowledge-work-plugins · 兼容：Cowork + Claude Code

---

## 概述

Write Spec 技能用于从问题陈述或功能想法出发，生成结构化的 Feature Spec 或 PRD（Product Requirements Document，产品需求文档）。它解决了产品经理最核心的挑战：将模糊的想法转化为团队可执行的结构化文档，包含清晰的问题定义、目标和边界、用户故事、需求优先级、成功度量和验收标准。通过 MoSCoW 框架和 Scope Management（范围管理）机制，帮助 PM 在文档阶段就预防范围蔓延。

---

## 基本信息

| 属性 | 值 |
|---|---|
| **技能名称** | `write-spec` |
| **插件** | Product Management |
| **触发方式** | slash command |
| **Slash 命令** | `/write-spec` |
| **用户可调用** | 是 |
| **官方源码** | [GitHub](https://github.com/anthropics/knowledge-work-plugins/tree/main/product-management) |

### 触发短语
- "Write a spec for [feature]"
- "Create a PRD for [problem]"
- "Spec out [idea]"
- "Draft requirements for [feature]"

---

## 架构设计

```
+------------------------------------------------------------------+
|                      WRITE SPEC                                     |
+------------------------------------------------------------------+
|  STANDALONE (always works)                                        |
|  +  Problem Definition (用户问题、受众、不解决的代价)              |
|  +  Goals & Non-Goals (3-5 个可衡量的目标和明确排除项)            |
|  +  User Stories (标准格式，按角色分组，含边界情况)               |
|  +  Requirements Categorization (MoSCoW: P0/P1/P2)               |
|  +  Success Metrics (Leading + Lagging Indicators)                |
|  +  Acceptance Criteria (Given/When/Then 格式)                    |
|  +  Scope Management (范围蔓延预防机制)                            |
+------------------------------------------------------------------+
|  SUPERCHARGED (when MCP connectors are available)                 |
|  +  ~~project tracker: 搜索相关工单、史诗和已有需求               |
|  +  ~~knowledge base: 搜索研究文档、历史规格和设计文档            |
|  +  ~~design (Figma): 拉取相关设计稿和组件库                      |
+------------------------------------------------------------------+
```

---

## 核心能力

### 1. 需求分类与优先级（Requirements Categorization - MoSCoW）

使用 MoSCoW 框架对需求进行分级，确保团队聚焦于最核心的功能。

| 优先级 | 定义 | 判断标准 | 占比建议 |
|---|---|---|---|
| Must-Have (P0) | 没有这些功能，特性不可用 | "如果砍掉这个，特性还能解决核心问题吗？" | 30-40% |
| Should-Have (P1) | 重要但不阻塞发布 | 核心功能可用后的高优先级迭代 | 20-30% |
| Could-Have (P2) | 有时间再做 | 期望但不承诺 | 15-20% |
| Won't-Have (本次不做) | 明确排除 | 记录在案防止未来被误认为遗漏 | 10-15% |

### 2. 用户故事编写（User Story Writing）

生成符合 INVEST 原则的用户故事：Independent（独立）、Negotiable（可协商）、Valuable（有价值）、Estimable（可估算）、Small（够小）、Testable（可测试）。

| 用户故事要素 | 正确示例 | 常见错误 |
|---|---|---|
| 用户角色 | "As a team admin" | "As a user"（太泛） |
| 能力描述 | "I want to configure SSO for my organization" | "I want a dropdown menu"（方案导向） |
| 价值说明 | "so that my team members can log in with their corporate credentials" | "so that I can click a button"（无价值） |
| 粒度控制 | 单个用户故事可在 1 个 sprint 完成 | "As a user, I want to manage my team"（太大） |

### 3. 成功度量定义（Success Metrics Definition）

区分 Leading Indicators（领先指标）和 Lagging Indicators（滞后指标），并设定具体的成功阈值。

| 指标类型 | 示例 | 变化速度 | 目标设定 |
|---|---|---|---|
| Leading（领先） | Adoption rate, Activation rate, Task completion rate | 天到周 | "50% adoption within 30 days" |
| Lagging（滞后） | Retention impact, Revenue impact, NPS change | 周到月 | "Improve 30-day retention by 5%" |

---

## 输出格式

```markdown
## PRD: [Feature Name]

### Problem Statement
[2-3 句描述用户问题、受影响的用户群体、不解决的代价]

### Goals
1. [可衡量的目标 1]
2. [可衡量的目标 2]

### Non-Goals
1. [明确排除项 1] — [排除理由]
2. [明确排除项 2] — [排除理由]

### User Stories
- As a [用户类型], I want [能力] so that [价值]

### Requirements
**Must-Have (P0)**
- [需求描述] — [验收标准]

**Nice-to-Have (P1)**
- [需求描述]

**Future (P2)**
- [需求描述]

### Success Metrics
- Leading: [指标] — [目标值]
- Lagging: [指标] — [目标值]

### Open Questions
- [问题] — [需要谁来回答]

### Timeline Considerations
- [硬性截止日期、依赖关系、分阶段建议]
```

---

## 使用场景与案例

### 场景一：从问题陈述到完整 PRD

**输入**：产品经理说 "Enterprise customers keep asking for centralized auth. We need SSO support."

**Write Spec 输出**（经过对话式需求收集后）：
```
## PRD: Single Sign-On (SSO) Support

### Problem Statement
Enterprise customers with 50+ users are increasingly requiring SSO as a condition for purchase.
Our sales team reports that 40% of enterprise deals in Q1 were delayed or lost due to the lack
of SSO. Without this feature, we are losing revenue and cannot compete with established
enterprise vendors.

### Goals
1. Enable SSO login for all enterprise plan customers within 6 weeks
2. Support SAML 2.0 and OIDC protocols at launch
3. Achieve 80% adoption among existing enterprise customers within 90 days

### Non-Goals
1. SCIM provisioning — out of scope for v1, will address in Q3
2. Custom SAML attribute mapping — standard attributes only for initial release
3. Social login (Google/GitHub) via SSO — separate initiative

### User Stories
- As a team admin, I want to configure SSO for my organization so that my team members
  can log in with their corporate credentials
- As a team member, I want to be automatically redirected to my company's SSO login
  so that I do not need to remember a separate password

### Requirements (Must-Have P0)
- Admin can enter SSO provider URL in organization settings
- Team members see "Log in with SSO" button on login page
- Failed SSO attempts show a clear error message

### Success Metrics
- Leading: 60% of enterprise customers configure SSO within 30 days of launch
- Lagging: Enterprise deal close rate improves from 60% to 80%

### Open Questions
- [Legal] Do we need to support data residency requirements for EU customers? — Legal
```

**关键价值**：产品经理无需从空白页面开始构思 PRD。系统通过对话式需求收集逐步完善文档，确保每个必要部分都被覆盖，同时通过 Non-Goals 明确界定范围。

### 场景二：范围蔓延预防

**输入**：在 PRD 评审会议上，有利益相关者说 "既然做 SSO，顺便把 SCIM provisioning 也做了吧"

**Write Spec 应对**：系统通过 PRD 中已明确的 Non-Goals 提供防御：
- Non-Goal: "SCIM provisioning — out of scope for v1, will address in Q3"
- 如果强行加入，系统会提示容量影响："Adding SCIM would extend the timeline by 4-6 weeks. Would you like to move a P0 item to P1 to accommodate?"

**关键价值**：Non-Goals 是范围管理的核心工具。在文档阶段就明确排除项，可以避免在开发阶段被不断新增的需求拖垮。

---

## 与其他工具对比

| 维度 | Write Spec (本技能) | Notion AI (PRD 模板) | Productboard | 手动编写 |
|---|---|---|---|---|
| 需求收集方式 | 对话式逐步引导，先问最重要的问题 | 模板填空 | 基于用户反馈和记分卡 | 完全依赖 PM 经验 |
| 优先级框架 | 内置 MoSCoW 框架，含判断标准 | 无内置框架 | 自定义评分模型 | 取决于 PM 熟悉的框架 |
| 用户故事质量 | INVEST 原则检查 + 反模式检测 | 基础模板 | 链接到用户反馈 | 取决于 PM 写作能力 |
| 成功度量 | 区分领先/滞后指标，含目标设定引导 | 无 | 关联 OKR 和指标 | 取决于 PM 的数据素养 |
| 范围管理 | Non-Goals + 范围蔓延预防机制 | 无 | 优先级排序功能 | 需人工维护 |
| 连接器集成 | 项目跟踪器、知识库、设计工具 | Notion 内部集成 | 深度反馈集成 | 无 |

---

## 连接工具后的增强能力

| MCP 连接 | 增强能力 |
|---|---|
| ~~project tracker (Linear/Asana) | 搜索相关工单、史诗和已有需求；识别对其他工作项的依赖 |
| ~~knowledge base | 搜索研究文档、历史 PRD 和设计文档；引用相关用户研究发现 |
| ~~design (Figma) | 拉取相关设计稿、线框图和设计探索；搜索设计系统组件 |

---

## 最佳实践

1. **对范围要有明确立场**：一个紧凑、定义清晰的 PRD 远胜于一个膨胀、模糊的 PRD。如果 PM 的想法太大，建议拆分为多个阶段，只对第一阶段进行详细规格说明。

2. **Non-Goals 和 Goals 同样重要**：Non-Goals 是范围蔓延的第一道防线。为每个排除项注明理由（"不够影响大"、"太复杂"、"属于独立项目"、"时机不成熟"），这样在评审时经得起质疑。

3. **验收标准覆盖快乐路径、错误路径和边界情况**：使用 Given/When/Then 格式编写验收标准，确保开发、测试和产品三方对"完成"的定义一致。

4. **P0 要足够少**：如果所有需求都是 P0，那就没有 P0。对每个 Must-Have 提出挑战："如果没有这个，我们真的不能发布吗？" 越严格的 P0 筛选意味着越快的交付和学习。

5. **开放问题要真正开放**：不要包含那些可以从上下文中回答的问题。标注每个问题需要谁来回答（工程、设计、法务、数据），并区分阻塞性（必须在开发前回答）和非阻塞性（可在开发过程中解决）。

---

## 参考链接

- [Plugin docs](/plugins/product-management)
- [GitHub source](https://github.com/anthropics/knowledge-work-plugins/tree/main/product-management)
