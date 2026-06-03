# Roadmap Update — Product Management Plugin

> 所属插件：[Product Management](/plugins/product-management) · 来源：Anthropic knowledge-work-plugins · 兼容：Cowork + Claude Code

---

## 概述

Roadmap Update 技能用于创建、更新和重新排定产品路线图的优先级，支持 Now/Next/Later、Quarterly Themes（季度主题）、OKR-Aligned（OKR 对齐）和 Timeline/Gantt 四种视图格式。它解决了产品路线图管理的三大核心挑战：如何在新增项目时决定移除什么、如何在新信息出现时理性调整优先级、以及如何将路线图变化有效地传达给不同受众。内置 RICE、MoSCoW、ICE 和 Value vs Effort 四种优先级框架，以及 Dependency Mapping（依赖关系映射）和 Capacity Planning（容量规划）机制。

---

## 基本信息

| 属性 | 值 |
|---|---|
| **技能名称** | `roadmap-update` |
| **插件** | Product Management |
| **触发方式** | slash command |
| **Slash 命令** | `/roadmap-update` |
| **用户可调用** | 是 |
| **官方源码** | [GitHub](https://github.com/anthropics/knowledge-work-plugins/tree/main/product-management) |

### 触发短语
- "Update the roadmap"
- "Add [initiative] to the roadmap"
- "Reprioritize Q3 roadmap"
- "Create a roadmap for next quarter"
- "What's on the roadmap?"

---

## 架构设计

```
+------------------------------------------------------------------+
|                    ROADMAP UPDATE                                   |
+------------------------------------------------------------------+
|  STANDALONE (always works)                                        |
|  +  Roadmap Creation (Now/Next/Later, Quarterly Themes, OKR)      |
|  +  Prioritization Frameworks (RICE, MoSCoW, ICE, Value vs Effort)|
|  +  Dependency Mapping (技术/团队/外部/知识/顺序依赖)              |
|  +  Capacity Planning (70% 功能 + 20% 技术债 + 10% 缓冲)          |
|  +  Change Communication (变化原因 + 取舍 + 新计划 + 影响)        |
+------------------------------------------------------------------+
|  SUPERCHARGED (when MCP connectors are available)                 |
|  +  ~~project tracker: 拉取当前路线图项的状态和日期               |
|  +  ~~chat: 搜索团队讨论和决策上下文                               |
|  +  ~~meeting transcription: 拉取会议记录和决策                    |
|  +  ~~knowledge base: 搜索决策文档和设计评审                       |
+------------------------------------------------------------------+
```

---

## 核心能力

### 1. 优先级框架（Prioritization Frameworks）

支持四种主流优先级框架，适应不同场景和团队偏好。

| 框架 | 计算公式 | 适用场景 | 数据需求 |
|---|---|---|---|
| RICE | (Reach x Impact x Confidence) / Effort | 需要量化、可辩护的优先级排序 | Reach（用户数）、Impact（1-3 分）、Confidence（%）、Effort（人月） |
| MoSCoW | Must / Should / Could / Won't | 发布范围确定、利益相关者谈判 | 对每个需求的定性判断 |
| ICE | Impact x Confidence x Ease | 早期产品或快速优先级排序 | 三项 1-10 分制评分 |
| Value vs Effort | 2x2 矩阵：高/低价值 x 高/低投入 | 团队规划会议中的可视化讨论 | 相对价值排序和投入估算 |

### 2. 路线图视图格式（Roadmap Frameworks）

支持四种视图格式，适应不同的沟通场景和受众需求。

| 视图格式 | 结构 | 最佳用途 | 注意事项 |
|---|---|---|---|
| Now/Next/Later | 当前 sprint / 下 1-3 月 / 3-6+ 月 | 大多数团队日常使用，对外沟通友好 | 避免在日期上给出虚假精度 |
| Quarterly Themes | 每季度 2-3 个战略主题 + 具体项目 | 展示战略对齐，适合规划会议和高管沟通 | 需映射到公司或团队 OKR |
| OKR-Aligned | 每个 Key Result 下的项目列表 | OKR 驱动型组织 | 确保每个项目都有清晰的"为什么" |
| Timeline/Gantt | 日历时间线上的项目起止时间 | 工程执行计划、资源冲突识别 | 不适合对外沟通（制造虚假精度预期） |

### 3. 容量规划（Capacity Planning）

确保路线图承诺与团队实际交付能力匹配。

| 分配类别 | 建议比例 | 说明 |
|---|---|---|
| Planned Features（规划功能） | 70% | 推进战略目标的路线图项目 |
| Technical Health（技术健康） | 20% | 技术债、可靠性、性能、开发者体验 |
| Unplanned（未规划缓冲） | 10% | 紧急问题、快速赢、其他团队请求 |

---

## 输出格式

```markdown
## Roadmap Update: [Period]

### Status Overview
[X] items in progress, [Y] completed this period, [Z] at risk.

### Roadmap Items

**Now (Current Sprint/Month)**
| Item | Status | Owner | Target Date | Dependencies |
|---|---|---|---|---|
| [Item] | On Track | [Owner] | [Date] | [None / Blocked by X] |

**Next (1-3 Months)**
| Item | Status | Owner | Target Date | Dependencies |
|---|---|---|---|---|
| [Item] | Planned | [Owner] | [Date] | [None] |

**Later (3-6+ Months)**
| Item | Status | Notes |
|---|---|---|
| [Item] | Exploring | Strategic bet — scope and timing flexible |

### Risks and Dependencies
- [Risk]: [Mitigation]. [Ask if needed].

### Changes This Update
- Added: [Item]
- Removed: [Item]
- Moved: [Item] from [timeframe] to [timeframe]
```

---

## 使用场景与案例

### 场景一：新增项目时的优先级调整

**输入**：产品经理说 "We need to add SSO support to the Q3 roadmap. A major deal depends on it."

**Roadmap Update 输出**（使用 RICE 框架分析后）：
```
## Roadmap Update: Q3 2026

### Current State Analysis
- Total committed capacity: 120% of team capacity
- Adding SSO requires identifying what moves or slips

### RICE Score Comparison
| Initiative | Reach | Impact | Confidence | Effort | RICE Score |
|---|---|---|---|---|---|
| SSO Support | 50 enterprise accounts | 3 (massive) | 90% | 6 weeks | 22.5 |
| Dashboard v2 | 2,000 users | 1 (medium) | 70% | 4 weeks | 5.8 |
| Mobile App Push | 500 users | 0.5 (low) | 50% | 3 weeks | 1.7 |

### Recommended Action
Add SSO Support to Now (P0). Move Dashboard v2 to Next. Remove Mobile App Push from Q3.

### Changes This Update
- Added: SSO Support (Now, P0) — driven by enterprise deal dependency
- Moved: Dashboard v2 (Now -> Next) — makes room for SSO
- Removed: Mobile App Push (Q3) — lowest RICE score, revisit in Q4 planning

### Communication
- Dashboard v2 stakeholders: Inform that the project has moved to Q4 due to strategic SSO commitment
- Sales team: Communicate SSO timeline commitment for the enterprise deal
```

**关键价值**：产品经理不仅获得了新增项目的建议，还得到了基于 RICE 框架的定量对比、具体的移除建议、以及针对不同利益相关者的沟通方案。路线图是零和博弈，新增必须伴随移除。

### 场景二：依赖关系导致的延期处理

**输入**：产品经理说 "The infrastructure team's API gateway upgrade is delayed by 3 weeks. Our SSO feature depends on it."

**Roadmap Update 输出**：
```
## Roadmap Update: SSO Support — Dependency Slip

### Impact Analysis
- Blocked item: SSO Support (P0, Now)
- Dependency: API Gateway v2 upgrade (Infrastructure team)
- Slip: 3 weeks (now targeting Aug 15 vs Jul 25)

### Downstream Impacts
- SSO launch: Slips from Aug 1 to Aug 22 (3 weeks + 1 week buffer)
- Enterprise deal close: At risk — customer expected Aug delivery
- Dashboard v2: Unaffected (Next, starts after SSO)

### Mitigation Plan
1. [This week] Meet with Infrastructure team to confirm Aug 15 date
2. [This week] Inform Sales of updated SSO timeline; prepare customer communication
3. [Next week] Explore parallel work: SSO frontend work can proceed while API gateway is in progress
4. [Contingency] If API gateway slips further, consider scoping down SSO to SAML-only (drop OIDC for v1)

### Recommended Communication
- Engineering: SSO backend work blocked until Aug 15; frontend work continues
- Sales: SSO now targeting Aug 22 launch; prepare customer update
- Executive: Yellow status — mitigation in place, contingency identified
```

**关键价值**：系统不仅记录了延期的事实，还自动分析了下游影响、提出了缓解方案和 contingency plan，并针对不同受众生成了差异化的沟通建议。

---

## 与其他工具对比

| 维度 | Roadmap Update (本技能) | Productboard | Aha! | 手动 Excel/文档 |
|---|---|---|---|---|
| 优先级框架 | 内置 RICE/MoSCoW/ICE/Value vs Effort 四种 | 自定义评分模型 | 自定义评分 + 战略对齐 | 取决于 PM 选择的框架 |
| 路线图视图 | 四种视图格式（Now/Next/Later, Quarterly, OKR, Gantt） | Now/Next/Later + 自定义 | 多种视图模板 | 手动创建和维护 |
| 依赖关系映射 | 五大类依赖（技术/团队/外部/知识/顺序） | 无原生依赖管理 | 依赖关系图 | 手动跟踪 |
| 容量规划 | 70/20/10 建议分配 + 过量预警 | 无 | 资源规划模块 | 手动计算 |
| 变更沟通 | 自动生成差异化沟通建议（工程/销售/高管） | 无 | 无 | 手动编写 |
| 项目跟踪器集成 | 连接后自动拉取状态和日期 | 深度集成 | 深度集成 | 无 |

---

## 连接工具后的增强能力

| MCP 连接 | 增强能力 |
|---|---|
| ~~project tracker (Linear/Asana) | 拉取当前路线图项的状态、负责人和日期；识别逾期、风险项和最近完成项 |
| ~~chat (Slack) | 搜索团队讨论和决策上下文；发现频道中提出的阻塞问题 |
| ~~meeting transcription (Fireflies) | 拉取最近会议记录和讨论摘要；找到相关会议中的决策和行动项 |
| ~~knowledge base | 搜索决策文档和设计评审 |

---

## 最佳实践

1. **路线图是沟通工具，不是项目计划**：保持适当的高度——主题和成果，而非任务。Now/Next/Later 格式对大多数团队来说是最有效的，因为它避免了在日期上制造虚假精度。

2. **重新排定时总是问"什么变了"**：优先级调整应该由新信息驱动，而非心血来潮。每次重新排定时，记录驱动变化的新信息是什么（客户反馈、技术发现、战略转向、竞争动态）。

3. **容量问题不能靠假装人能做更多来解决**：如果路线图的承诺超过了团队的实际容量，必须削减范围。新增项目时，永远问"什么会被移除或推迟"。

4. **依赖关系是路线图最大的风险**：明确列出所有依赖关系，为每个依赖指定负责人和"需要日期"。在依赖周围设置缓冲时间——它们是路线图上风险最高的项目。

5. **不要为每一条新信息改变路线图**：设定变化阈值。除非真正紧急，否则在自然节奏（月度、季度）下批量更新路线图。频繁变化可能意味着战略不清晰，而非响应迅速。

---

## 参考链接

- [Plugin docs](/plugins/product-management)
- [GitHub source](https://github.com/anthropics/knowledge-work-plugins/tree/main/product-management)
