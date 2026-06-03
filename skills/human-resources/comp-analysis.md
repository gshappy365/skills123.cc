# Comp Analysis — Human Resources Plugin

> 所属插件：[Human Resources](/plugins/human-resources) · 来源：Anthropic knowledge-work-plugins · 兼容：Cowork + Claude Code

---

## 概述

Comp Analysis 技能用于薪酬数据的分析和决策支持，涵盖市场基准对比（Market Benchmarking）、薪酬带宽定位（Band Placement）和股权建模（Equity Modeling）三大核心场景。它解决了薪酬管理中三个关键问题：Offer 是否具有竞争力、现有员工的薪酬是否在合理区间内、以及股权授予的长期价值如何计算。支持单角色快速查询和批量数据上传分析两种工作模式。

---

## 基本信息

| 属性 | 值 |
|---|---|
| **技能名称** | `comp-analysis` |
| **插件** | Human Resources |
| **触发方式** | slash command |
| **Slash 命令** | `/comp-analysis` |
| **用户可调用** | 是 |
| **官方源码** | [GitHub](https://github.com/anthropics/knowledge-work-plugins/tree/main/human-resources) |

### 触发短语
- "What should we pay a [role] in [location]?"
- "Is this offer competitive?"
- "Model this equity grant"
- "Analyze our comp bands for outliers"

---

## 架构设计

```
+------------------------------------------------------------------+
|                     COMP ANALYSIS                                   |
+------------------------------------------------------------------+
|  STANDALONE (always works)                                        |
|  +  Single Role Benchmarking (按角色、级别、地点查询市场数据)      |
|  +  Band Placement Analysis (上传 CSV 分析带宽定位)               |
|  +  Equity Modeling (RSU/期权授予的长期价值计算)                  |
|  +  Percentile Reporting (25th/50th/75th/90th 百分位)             |
+------------------------------------------------------------------+
|  SUPERCHARGED (when MCP connectors are available)                 |
|  +  ~~compensation data: 拉取经过验证的市场基准数据               |
|  +  ~~HRIS: 拉取当前员工薪酬数据，自动识别异常值和离职风险        |
+------------------------------------------------------------------+
```

---

## 核心能力

### 1. 单角色市场基准对比（Single Role Market Benchmarking）

针对特定角色、级别和地点，提供市场薪酬的百分位分布数据。

| 百分位 | Base 薪资 | 股权价值 | 总薪酬 | 市场定位含义 |
|---|---|---|---|---|
| 25th | $[X] | $[X] | $[X] | 低于市场平均水平，通常用于预算受限场景 |
| 50th | $[X] | $[X] | $[X] | 市场中位数，有竞争力的基础水平 |
| 75th | $[X] | $[X] | $[X] | 高于市场平均，用于吸引顶尖人才 |
| 90th | $[X] | $[X] | $[X] | 市场顶级水平，用于关键岗位或竞对激烈场景 |

### 2. 薪酬带宽定位分析（Band Placement Analysis）

上传公司现有薪酬数据，分析每个员工在薪酬带宽中的位置，识别异常值和留存风险。

| 分析维度 | 计算方式 | 决策价值 |
|---|---|---|
| Compa-Ratio（薪酬比率） | 当前薪资 / 带宽中点 | <0.8 偏低，0.8-1.2 正常，>1.2 偏高 |
| 带宽位置 | (当前薪资 - 带宽下限) / (带宽上限 - 下限) | 识别接近带宽上限或已超越上限的员工 |
| 内部公平性 | 同级别/同角色员工的薪资对比 | 发现同工不同酬的潜在问题 |
| 外部竞争力 | 当前薪资 vs 市场 50th/75th 百分位 | 识别留存风险（薪资低于市场） |

### 3. 股权建模（Equity Modeling）

计算股权授予的长期价值，支持 RSU 和期权两种类型。

| 股权类型 | 关键参数 | 输出 |
|---|---|---|
| RSU（限制性股票单位） | 股数、当前股价、归属时间表 | 每年归属价值、归属时间线 |
| Stock Options（股票期权） | 股数、行权价、当前估值、归属时间表 | 潜在收益（基于不同退出估值假设） |
| Refresh Grant（追加授予） | 授予时间、归属时间表、叠加效果 | 累计持股和归属时间线 |

---

## 输出格式

```markdown
## Compensation Analysis: [Role/Scope]

### Market Benchmarks
| Percentile | Base | Equity | Total Comp |
|---|---|---|---|
| 25th | $[X] | $[X] | $[X] |
| 50th | $[X] | $[X] | $[X] |
| 75th | $[X] | $[X] | $[X] |
| 90th | $[X] | $[X] | $[X] |

**Sources:** [Web research, compensation data tools, or user-provided data]

### Band Analysis (if data provided)
| Employee | Current Base | Band Min | Band Mid | Band Max | Position |
|---|---|---|---|---|---|
| [Name] | $[X] | $[X] | $[X] | $[X] | [Below/At/Above] |

### Recommendations
- [Specific compensation recommendations]
- [Equity considerations]
- [Retention risks if applicable]
```

---

## 使用场景与案例

### 场景一：Offer 竞争力评估

**输入**：招聘经理说 "What should we pay a Senior Software Engineer in San Francisco?"

**Comp Analysis 输出**：
```
## Compensation Analysis: Senior Software Engineer — San Francisco

### Market Benchmarks
| Percentile | Base | Equity (4yr) | Total Comp |
|---|---|---|---|
| 25th | $160,000 | $120,000 | $190,000 |
| 50th | $185,000 | $200,000 | $235,000 |
| 75th | $210,000 | $320,000 | $290,000 |
| 90th | $240,000 | $500,000 | $365,000 |

**Sources:** Levels.fyi, Radford 2025 Tech Salary Survey, Blind community data

### Key Variables
- **Company stage**: Growth stage (Series C, 200 employees)
- **Industry**: Enterprise SaaS
- **Location**: San Francisco (highest cost market)

### Recommendations
- For a strong hire at the Senior level, target the 50th-60th percentile: $185K-$195K base + $200K-$250K equity (4yr)
- Consider a $20K-$30K signing bonus if the candidate has competing offers
- Equity-heavy packages (higher equity, slightly lower base) are common at growth-stage companies
```

**关键价值**：招聘经理无需在 Levels.fyi、Radford 和 Blind 等多个数据源之间手动交叉对比，一次查询即可获得结构化的市场数据和建议。

### 场景二：现有团队薪酬带宽分析

**输入**：HRBP 上传公司工程团队的薪酬 CSV，说 "Analyze our comp bands for outliers and retention risks"

**Comp Analysis（数据上传模式）输出**：
```
## Band Analysis: Engineering Team

### Overview
| Metric | Value |
|---|---|
| Total employees analyzed | 24 |
| Above band max | 2 (8.3%) |
| Below band min | 3 (12.5%) |
| Compa-Ratio < 0.85 | 4 (16.7%) |

### Outliers Identified
| Employee | Role | Current Base | Band Range | Compa-Ratio | Risk |
|---|---|---|---|---|---|
| Alex Chen | Sr. Engineer | $155,000 | $160K-$210K | 0.84 | Retention risk — below band min and below market 25th |
| Priya Singh | Engineer | $195,000 | $120K-$180K | 1.30 | Above band max — consider promotion to Senior |
| ... | ... | ... | ... | ... | ... |

### Retention Risk Summary
- 4 employees below market 50th percentile
- 2 employees below band minimum
- Engineering team average compa-ratio: 0.92 (slightly below midpoint)

### Recommendations
1. Adjust Alex Chen to at least $170K (band min) to address retention risk
2. Review Priya Singh for promotion — performance supports Senior level
3. Consider market adjustment for the 4 below-median employees to prevent attrition
```

**关键价值**：HRBP 无需手动在 Excel 中计算 compa-ratio 和筛选异常值，系统自动完成分析并给出可操作的调整建议。

---

## 与其他工具对比

| 维度 | Comp Analysis (本技能) | Pave | Radford | 手动 Excel 分析 |
|---|---|---|---|---|
| 市场数据获取 | 连接后自动拉取，未连接时基于网络研究 | 实时市场数据平台 | 年度薪酬调查报告 | 需购买报告并手动录入 |
| 带宽分析 | 自动计算 compa-ratio、带宽位置、异常值 | 内置带宽分析仪表盘 | 无，需自行计算 | 手动公式计算 |
| 股权建模 | 支持 RSU 和期权，含多种退出假设 | 股权管理模块 | 无 | 手动建模 |
| 批量分析 | 上传 CSV 自动处理 | 平台原生支持 | 无 | 手动处理 |
| 数据保密 | 结果仅在当前对话中 | 企业级数据安全 | 报告级别保密 | 取决于文件管理 |
| 集成深度 | MCP 连接器模式 | 原生 HRIS 集成 | 咨询驱动 | 无 |

---

## 连接工具后的增强能力

| MCP 连接 | 增强能力 |
|---|---|
| ~~compensation data (Pave/Radford) | 拉取经过验证的角色/级别/地点市场基准数据；将公司带宽与实时市场数据对比 |
| ~~HRIS (Workday/BambooHR) | 拉取当前员工薪酬数据；自动识别带宽异常值和留存风险 |

---

## 最佳实践

1. **地点是基准分析的关键变量**：旧金山、奥斯汀、伦敦的薪酬水平差异巨大。在进行任何基准分析时，务必明确指定候选人或员工的工作地点。

2. **关注总薪酬而非基本薪资**：股权和奖金在高科技公司薪酬中占比越来越大。在 Offer 评估和留存风险分析中，总薪酬（Base + Equity + Bonus）是更有意义的对比指标。

3. **薪酬数据高度敏感，结果留在对话内**：薪酬分析涉及公司最敏感的数据。确保分析结果仅存储在当前的对话上下文中，不写入持久化存储或共享文档。

4. **Compa-Ratio 是带宽分析的起点而非终点**：Compa-Ratio 低于 0.85 并不一定意味着需要加薪——可能员工刚入职或在试用期。需要结合 tenure、绩效和晋升历史综合判断。

5. **注意数据的新鲜度**：市场薪酬数据变化快速，尤其是股权价值。在报告中标注数据来源和时间，区分"最新数据"和"可能需要更新"的参考点。

---

## 参考链接

- [Plugin docs](/plugins/human-resources)
- [GitHub source](https://github.com/anthropics/knowledge-work-plugins/tree/main/human-resources)
