# Performance Review — Human Resources Plugin

> 所属插件：[Human Resources](/plugins/human-resources) · 来源：Anthropic knowledge-work-plugins · 兼容：Cowork + Claude Code

---

## 概述

Performance Review 技能用于生成绩效评估的全套文档，包括自评模板（Self-Assessment）、经理评价模板（Manager Review）和校准准备文档（Calibration Prep）。它解决了绩效评估季最常见的三大问题：反馈过于笼统缺乏具体事例、不同经理的评估标准不一致导致校准困难、以及评估文档的格式和结构不统一。通过结构化的模板和提示，帮助管理者和员工产出具体、可衡量、以行为为导向的反馈。

---

## 基本信息

| 属性 | 值 |
|---|---|
| **技能名称** | `performance-review` |
| **插件** | Human Resources |
| **触发方式** | slash command |
| **Slash 命令** | `/performance-review` |
| **用户可调用** | 是 |
| **官方源码** | [GitHub](https://github.com/anthropics/knowledge-work-plugins/tree/main/human-resources) |

### 触发短语
- "Prepare performance review for [employee]"
- "Generate self-assessment template"
- "Prep calibration document for [cycle]"
- "Review season is coming up"

---

## 架构设计

```
+------------------------------------------------------------------+
|                    PERFORMANCE REVIEW                                |
+------------------------------------------------------------------+
|  STANDALONE (always works)                                        |
|  +  Self-Assessment Template (关键成就、目标回顾、成长领域)         |
|  +  Manager Review Template (评分、优势、发展领域、补偿建议)       |
|  +  Calibration Prep Template (团队概览、评级分布、晋升候选人)    |
|  +  Feedback Structuring (将模糊反馈转化为具体行为描述)            |
+------------------------------------------------------------------+
|  SUPERCHARGED (when MCP connectors are available)                 |
|  +  ~~HRIS: 拉取历史评估记录、目标追踪数据                        |
|  +  ~~project tracker: 拉取完成的工作项作为评估证据                |
+------------------------------------------------------------------+
```

---

## 核心能力

### 1. 自评模板生成（Self-Assessment Template Generation）

为员工提供结构化的自我评估框架，引导他们用具体事例和数据支撑自己的评价。

| 自评模块 | 内容 | 引导方式 |
|---|---|---|
| Key Accomplishments（关键成就） | Top 3-5 成就，含情境、贡献和影响 | STAR 框架（Situation, Task, Action, Result） |
| Goals Review（目标回顾） | 上一周期目标的状态和证据 | 目标 vs 状态 vs 证据的三列表格 |
| Growth Areas（成长领域） | 新技能、范围扩展、领导力时刻 | 开放式提示 |
| Challenges（挑战） | 遇到的困难、不同做法 | 反思式引导 |
| Goals for Next Period（下期目标） | 3 个具体可衡量的目标 | SMART 框架引导 |
| Feedback for Manager（给经理的反馈） | 对管理支持的期望 | 安全、建设性的表达引导 |

### 2. 经理评价模板生成（Manager Review Template Generation）

为经理提供结构化的下属评估框架，确保反馈具体、平衡且可操作。

| 评价模块 | 内容 | 关键要求 |
|---|---|---|
| Overall Rating（总体评分） | Exceeds / Meets / Below Expectations | 必须有具体事例支撑 |
| Performance Summary（绩效摘要） | 2-3 句总体评估 | 概括核心贡献和整体表现 |
| Key Strengths（关键优势） | 每个优势附带具体事例 | "Great job" 不是反馈，"You reduced deploy time 40% by..." 才是 |
| Areas for Development（发展领域） | 具体、可行动的发展建议 | 关注行为而非人格 |
| Goal Achievement（目标达成） | 每个目标的评分和评语 | 基于数据的客观评价 |
| Development Plan（发展计划） | 技能、当前水平、目标水平、行动计划 | 可衡量的进步路径 |
| Compensation Recommendation（薪酬建议） | 晋升/股权调整/薪资调整 | 必须有充分理由 |

### 3. 校准准备文档生成（Calibration Prep Template Generation）

为校准会议准备结构化的团队评估概览，确保评级的一致性和公平性。

| 校准模块 | 内容 | 用途 |
|---|---|---|
| Team Overview（团队概览） | 所有成员的评级和关键背景 | 校准会议讨论的基础 |
| Rating Distribution（评级分布） | 各评级的人数和占比 vs 公司目标 | 检查评级是否符合公司分布要求 |
| Calibration Discussion Points（校准讨论点） | 需要特别讨论的成员和原因 | 聚焦校准会议的讨论时间 |
| Promotion Candidates（晋升候选人） | 当前级别、建议级别、理由 | 为晋升决策提供证据 |
| Compensation Actions（薪酬行动） | 建议的薪酬调整和理由 | 关联绩效与薪酬 |

---

## 输出格式

```markdown
## Performance Review: [Employee Name]
**Period:** [Date range] | **Manager:** [Your name]

### Overall Rating: [Exceeds / Meets / Below Expectations]

### Performance Summary
[2-3 sentence overall assessment]

### Key Strengths
- [Strength with specific example]
- [Strength with specific example]

### Areas for Development
- [Area with specific, actionable guidance]
- [Area with specific, actionable guidance]

### Goal Achievement
| Goal | Rating | Comments |
|------|--------|----------|
| [Goal] | [Rating] | [Specific observations] |

### Development Plan
| Skill | Current | Target | Actions |
|-------|---------|--------|---------|
| [Skill] | [Level] | [Level] | [How to get there] |

### Compensation Recommendation
[Promotion / Equity refresh / Adjustment / No change — with justification]
```

---

## 使用场景与案例

### 场景一：经理为下属撰写绩效评估

**输入**：经理说 "Write a performance review for Alex Chen, Senior Engineer. He led the API migration project, delivered ahead of schedule, but his documentation has been inconsistent."

**Performance Review 输出**：
```
## Performance Review: Alex Chen
**Period:** Q1 2026 | **Manager:** [Your name]

### Overall Rating: Meets Expectations

### Performance Summary
Alex delivered strong results on the API migration project, completing it two weeks ahead of schedule. His technical execution was excellent. However, documentation quality has been inconsistent across the quarter, which affected the team's ability to maintain the new systems.

### Key Strengths
- Technical execution: Led the API migration from REST to GraphQL, completing the core migration two weeks ahead of the projected timeline. The migration was executed with zero downtime.
- Cross-team collaboration: Coordinated effectively with the infrastructure team to manage the database migration dependency, unblocking the project two weeks earlier than planned.

### Areas for Development
- Documentation consistency: Three of the six technical documents submitted this quarter required significant revisions from the tech lead before they could be published. Moving forward, Alex should use the team's documentation template and request peer review before submission.

### Development Plan
| Skill | Current | Target | Actions |
|-------|---------|--------|---------|
| Technical Writing | Developing | Proficient | Complete the internal technical writing workshop; pair with Priya on the next design doc |

### Compensation Recommendation
On track for promotion consideration in Q3. Recommend equity refresh at standard cycle.
```

**关键价值**：经理无需从空白页面开始构思，系统提供了结构化的框架和具体的引导提示，确保反馈既有正面事例也有建设性建议，且全部基于具体行为而非泛泛评价。

### 场景二：校准会议准备

**输入**：HRBP 说 "Prep calibration for Q1 review cycle, my team has 8 people"

**Performance Review（Calibration 模式）输出**：
```
## Calibration Prep: Q1 2026
**Manager:** [Your name] | **Team:** Platform Engineering | **Period:** Q1 2026

### Team Overview
| Employee | Role | Level | Tenure | Proposed Rating | Notes |
|---|---|---|---|---|---|
| Alex Chen | Sr. Engineer | Senior | 2 years | Meets | Strong technical delivery, inconsistent docs |
| Priya Singh | Engineer | Mid | 1 year | Exceeds | Exceeded all goals, mentored two juniors |
| ... | ... | ... | ... | ... | ... |

### Rating Distribution
| Rating | Count | % of Team | Company Target |
|---|---|---|---|
| Exceeds Expectations | 2 | 25% | ~15-20% |
| Meets Expectations | 5 | 62.5% | ~60-70% |
| Below Expectations | 1 | 12.5% | ~10-15% |

### Calibration Discussion Points
1. **Alex Chen** — Strong delivery but documentation gap. Borderline between Meets and Exceeds.
2. **Jordan Lee** — First review at Senior level. Needs discussion on ramp-up expectations.

### Promotion Candidates
| Employee | Current Level | Proposed Level | Justification |
|---|---|---|---|
| Priya Singh | Mid | Senior | Consistently operating at Senior level for 6+ months; mentored 2 junior engineers |
```

**关键价值**：HRBP 和经理无需在 Excel 中手动整理校准数据，系统自动生成结构化的校准文档，包含评级分布分析、需要特别讨论的案例、以及晋升候选人的完整理由。

---

## 与其他工具对比

| 维度 | Performance Review (本技能) | Culture Amp | Lattice | 手动文档 |
|---|---|---|---|---|
| 模板生成 | 三种模式（自评/经理/校准）自动生成 | 可配置模板库 | 标准化模板 | 完全依赖个人创建 |
| 反馈结构化 | STAR 框架引导 + 反模式检测 | 内置反馈框架 | 反馈提示功能 | 无引导 |
| 校准准备 | 自动计算评级分布、标注讨论点 | Calibration 模块 | 校准工作流 | 手动整理 Excel |
| HRIS 集成 | 连接后拉取历史记录和目标 | 深度 HRIS 集成 | 深度集成 | 无 |
| 项目数据关联 | 连接后拉取完成的工作项 | 无原生项目工具集成 | 部分集成 | 无 |
| 反模式检测 | 明确禁止"Great job"类模糊反馈 | 反馈质量评分 | 反馈提示 | 无 |

---

## 连接工具后的增强能力

| MCP 连接 | 增强能力 |
|---|---|
| ~~HRIS (Workday/BambooHR) | 拉取历史绩效评估记录和目标追踪数据；预填员工基本信息和当前职位 |
| ~~project tracker (Linear/Asana) | 拉取评估周期内完成的工作项；引用具体任务和项目里程碑作为评估证据 |

---

## 最佳实践

1. **反馈必须具体**："Great job" 不是反馈。"You reduced deploy time 40% by implementing the new CI pipeline" 才是。每个优势和发展领域都必须附带具体的行为事例。

2. **正面与建设性反馈并重**：两者都不可或缺，且都不应该让员工感到意外。如果在评估中提出的问题员工从未听说过，说明经理的日常反馈机制出了问题。

3. **关注行为而非人格**：说 "Your documentation has been incomplete" 是可接受的，说 "You're careless" 是人格攻击。前者描述行为，后者贴标签。

4. **发展建议必须可行动**："Improve communication" 太模糊。"Present at the next team all-hands" 才是可行动的建议。每个发展领域都应附带具体的行动路径。

5. **校准讨论要聚焦**：校准会议的时间有限，只讨论边界案例（borderline cases）和特殊情况。表现明确达标或未达标的成员不需要在校准会议上花时间讨论。

---

## 参考链接

- [Plugin docs](/plugins/human-resources)
- [GitHub source](https://github.com/anthropics/knowledge-work-plugins/tree/main/human-resources)
