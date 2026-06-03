# Draft Offer — Human Resources Plugin

> 所属插件：[Human Resources](/plugins/human-resources) · 来源：Anthropic knowledge-work-plugins · 兼容：Cowork + Claude Code

---

## 概述

Draft Offer 技能用于为候选人起草完整的 Offer Letter（录用通知书），包含薪酬方案、股权结构、签约奖金、福利摘要和正式录用文本。它解决了招聘流程中 Offer 环节的三大痛点：总薪酬包的全面呈现、股权细节的准确表述、以及录用文本的个性化定制。配合 HRIS 和 ATS 连接器后，可自动填充薪酬带宽数据和候选人信息，大幅减少手动录入工作。

---

## 基本信息

| 属性 | 值 |
|---|---|
| **技能名称** | `draft-offer` |
| **插件** | Human Resources |
| **触发方式** | slash command |
| **Slash 命令** | `/draft-offer` |
| **用户可调用** | 是 |
| **官方源码** | [GitHub](https://github.com/anthropics/knowledge-work-plugins/tree/main/human-resources) |

### 触发短语
- "Draft an offer for [candidate]"
- "Prepare offer letter for [role]"
- "Create compensation package for [candidate]"

---

## 架构设计

```
+------------------------------------------------------------------+
|                      DRAFT OFFER                                    |
+------------------------------------------------------------------+
|  STANDALONE (always works)                                        |
|  +  Compensation Package Assembly (base + equity + bonus + total) |
|  +  Offer Letter Text Generation (formal offer language)          |
|  +  Benefits Summary (relevant highlights)                        |
|  +  Hiring Manager Notes (negotiation guidance, comp band context)|
+------------------------------------------------------------------+
|  SUPERCHARGED (when MCP connectors are available)                 |
|  +  ~~HRIS: Pull comp band data, verify headcount approval        |
|  +  ~~ATS: Pull candidate details, update pipeline status         |
+------------------------------------------------------------------+
```

---

## 核心能力

### 1. 薪酬方案组装（Compensation Package Assembly）

将基本薪资、股权、签约奖金、目标奖金等组件整合为完整的薪酬方案。

| 薪酬组件 | 说明 | 关键考量 |
|---|---|---|
| Base Salary（基本薪资） | 年度现金薪酬 | 根据级别、地点、市场数据确定 |
| Equity（股权） | RSU 或股票期权 | 股数、估值方法、归属时间表 |
| Signing Bonus（签约奖金） | 一次性现金奖励 | 用于弥补旧公司未归属股权或竞对 Offer |
| Target Bonus（目标奖金） | 基于绩效的年度奖金 | 通常为基本薪资的百分比 |
| Total First-Year Comp（首年总薪酬） | 所有组件的首年总和 | 候选人最常对比的数字 |

### 2. 录用文本生成（Offer Letter Text Generation）

生成正式的录用通知书文本，包含职位信息、条款和个性化内容。

| 文本段落 | 内容 | 个性化程度 |
|---|---|---|
| 开头致意 | 候选人姓名 + 职位 + 公司名 | 高（需引用面试过程） |
| 职位信息 | 头衔、汇报关系、地点、雇佣类型 | 中（基于输入参数） |
| 薪酬条款 | 基本薪资、股权、奖金的具体数字和条件 | 低（标准法律语言） |
| 福利摘要 | 健康保险、休假政策、其他福利亮点 | 中（基于公司配置） |
| 结尾与签名 | 接受截止日期、联系方式 | 低（标准格式） |

### 3. 招聘经理备注（Hiring Manager Notes）

为招聘经理提供谈判指导、薪酬带宽上下文和注意事项。

| 备注类型 | 内容 | 用途 |
|---|---|---|
| Negotiation Guidance | 预期的谈判空间和策略 | 帮助经理准备 Offer 电话 |
| Comp Band Context | 该级别和角色的薪酬带宽 | 确保 Offer 在合理范围内 |
| Flags & Considerations | 特殊注意事项（如竞业限制、签证问题） | 避免后续意外 |

---

## 输出格式

```markdown
## Offer Letter Draft: [Role] — [Level]

### Compensation Package
| 组件 | 详情 |
|---|---|
| **Base Salary** | $[X]/year |
| **Equity** | [X shares/units], [vesting schedule] |
| **Signing Bonus** | $[X] (if applicable) |
| **Target Bonus** | [X]% of base (if applicable) |
| **Total First-Year Comp** | $[X] |

### Terms
- **Start Date**: [Date]
- **Reports To**: [Manager]
- **Location**: [Office / Remote / Hybrid]
- **Employment Type**: [Full-time, Exempt]

### Benefits Summary
[Key benefits highlights relevant to the candidate]

### Offer Letter Text

Dear [Candidate Name],

[Complete offer letter text]

### Notes for Hiring Manager
- [Negotiation guidance if needed]
- [Comp band context]
- [Any flags or considerations]
```

---

## 使用场景与案例

### 场景一：从零起草完整 Offer

**输入**：招聘经理说 "Draft an offer for Sarah Chen for Senior Software Engineer, SF office, starting June 15"

**Draft Offer 输出**：
```
## Offer Letter Draft: Senior Software Engineer — Senior

### Compensation Package
| 组件 | 详情 |
|---|---|
| **Base Salary** | $185,000/year |
| **Equity** | 15,000 RSUs, 4-year vest with 1-year cliff |
| **Signing Bonus** | $30,000 |
| **Target Bonus** | 15% of base |
| **Total First-Year Comp** | $242,750 |

### Offer Letter Text
Dear Sarah,

We are pleased to offer you the position of Senior Software Engineer at [Company]...

[Complete offer letter with all terms and conditions]

### Notes for Hiring Manager
- Sarah's current comp is approximately $170K based on our market intel
- The signing bonus is designed to cover unvested equity at her current company
- Comp band for Senior Engineer in SF: $160K - $210K base; this offer is at the 60th percentile
- She mentioned interest in AI/ML work during interviews — consider mentioning our ML platform team in the offer call
```

**关键价值**：招聘经理无需手动拼接薪酬数据和模板文本，一次对话即可获得完整的 Offer 草案，包含谈判策略建议。

### 场景二：快速调整已有 Offer（连接 ATS 后）

**输入**：招聘经理说 "Update Sarah's offer to include a $20K signing bonus — she has a competing offer from Google"

**Draft Offer（已连接 ATS）输出**：
```
Updated Offer Letter Draft: Senior Software Engineer — Senior

Changes from previous version:
- Added Signing Bonus: $20,000
- Updated Total First-Year Comp: $232,750 (was $212,750)
- Updated offer letter text to reference the signing bonus terms

ATS Status: Offer updated in pipeline. Status remains "Offer Extended."
```

**关键价值**：连接 ATS 后，系统不仅更新 Offer 内容，还自动同步候选人在招聘管道中的状态，避免了手动更新多个系统的繁琐操作。

---

## 与其他工具对比

| 维度 | Draft Offer (本技能) | Gem | Lever Offer Module | 手动起草 |
|---|---|---|---|---|
| 薪酬方案组装 | 自动计算总薪酬，含股权归属时间表 | 内置薪酬基准，自动填充 | 基于模板的组件式输入 | 需手动计算和核对 |
| 股权表述 | 支持 RSU/期权，含归属条款和估值说明 | 标准股权模板 | 基础股权字段 | 需 HR 熟悉股权条款 |
| 谈判指导 | 自动生成谈判空间分析和策略建议 | 无内置谈判指导 | 无 | 依赖招聘经理经验 |
| ATS 集成 | 连接后自动拉取候选人信息和更新状态 | 深度集成 | 原生 Lever 集成 | 需手动录入 ATS |
| HRIS 集成 | 连接后自动填充薪酬带宽和审批状态 | 无 HRIS 集成 | 基础集成 | 需切换系统查询 |
| 个性化程度 | 可引用面试过程信息增强温度 | 模板化为主 | 模板化 | 取决于起草人 |

---

## 连接工具后的增强能力

| MCP 连接 | 增强能力 |
|---|---|
| ~~HRIS (Workday/BambooHR) | 拉取该级别/角色的薪酬带宽数据；验证 headcount 审批状态；自动填充福利详情 |
| ~~ATS (Greenhouse/Lever) | 从申请中拉取候选人详细信息；更新 Offer 状态至招聘管道 |

---

## 最佳实践

1. **始终展示总薪酬（Total Comp）**：候选人对比 Offer 时看的是总薪酬而非基本薪资。在 Offer 草案中突出 Total First-Year Compensation 这个数字，并清晰拆解各组件占比。

2. **股权描述要具体**：不要只说 "equity grant"，要明确股数、当前估值方法（409A 估值或最近融资估值）、归属时间表（4年归属、1年 cliff）、以及行权价（如果是期权）。这些细节是候选人做决策的关键信息。

3. **个性化开头**：在 Offer 信中引用面试过程中的某个具体细节（"Your deep-dive on distributed systems during the system design round was impressive"），这会让候选人感受到诚意，显著提升接受率。

4. **为谈判留出空间**：在 Hiring Manager Notes 中标注当前 Offer 在薪酬带宽中的百分位、候选人的当前薪酬水平、以及已知的竞对 Offer 情况，帮助经理在谈判时做出 informed decision。

5. **确认 headcount 审批**：在发出 Offer 前，确保该 headcount 已获得正式审批。如果连接了 HRIS，系统应自动验证；如果未连接，在草案中提醒经理确认。

---

## 参考链接

- [Plugin docs](/plugins/human-resources)
- [GitHub source](https://github.com/anthropics/knowledge-work-plugins/tree/main/human-resources)
