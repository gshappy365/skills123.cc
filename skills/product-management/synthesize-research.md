# Synthesize Research — Product Management Plugin

> 所属插件：[Product Management](/plugins/product-management) · 来源：Anthropic knowledge-work-plugins · 兼容：Cowork + Claude Code

---

## 概述

Synthesize Research 技能用于将来自用户访谈、问卷调查、支持工单等渠道的原始研究数据转化为结构化的洞察和可执行的建议。它解决了产品经理最耗时的工作之一——从数十份访谈记录或数百条反馈中提炼出有价值的主题和优先级。通过 Thematic Analysis（主题分析）、Affinity Mapping（亲和图）和 Opportunity Sizing（机会量化）三种方法论，帮助 PM 从定性数据中做出基于证据的产品决策。

---

## 基本信息

| 属性 | 值 |
|---|---|
| **技能名称** | `synthesize-research` |
| **插件** | Product Management |
| **触发方式** | slash command |
| **Slash 命令** | `/synthesize-research` |
| **用户可调用** | 是 |
| **官方源码** | [GitHub](https://github.com/anthropics/knowledge-work-plugins/tree/main/product-management) |

### 触发短语
- "Synthesize these interview notes"
- "Analyze survey responses"
- "Make sense of this user feedback"
- "Identify themes from our research"

---

## 架构设计

```
+------------------------------------------------------------------+
|                   SYNTHESIZE RESEARCH                                |
+------------------------------------------------------------------+
|  STANDALONE (always works)                                        |
|  +  Research Input Processing (粘贴文本、上传文件)                 |
|  +  Thematic Analysis (编码 -> 主题 -> 发现 -> 报告)              |
|  +  Affinity Mapping (聚类 -> 标签 -> 组织 -> 主题)               |
|  +  Triangulation (多源交叉验证)                                  |
|  +  Opportunity Sizing (影响 x 频率 x 严重性评分)                 |
|  +  Persona Development (基于行为的角色构建)                      |
+------------------------------------------------------------------+
|  SUPERCHARGED (when MCP connectors are available)                 |
|  +  ~~knowledge base: 搜索研究文档、访谈记录、调查结果            |
|  +  ~~user feedback (Intercom): 拉取支持工单和功能请求            |
|  +  ~~product analytics (Amplitude): 拉取使用数据和漏斗指标        |
|  +  ~~meeting transcription (Fireflies): 拉取访谈录音和会议摘要    |
+------------------------------------------------------------------+
```

---

## 核心能力

### 1. 主题分析（Thematic Analysis）

从定性数据中系统性地提取主题和模式，这是用户研究综合的核心方法。

| 阶段 | 操作 | 输出 |
|---|---|---|
| Familiarization（熟悉数据） | 通读所有数据，了解整体情况 | 初步印象和假设 |
| Initial Coding（初始编码） | 逐条标记观察、引用和数据点 | 编码标签列表 |
| Theme Development（主题开发） | 将相关编码归组为候选主题 | 主题候选列表 |
| Theme Review（主题审核） | 检查主题是否有充分证据支撑 | 验证后的主题集 |
| Theme Refinement（主题精炼） | 清晰定义和命名每个主题 | 每个主题的 1-2 句描述 |
| Report（报告） | 将主题作为发现写入报告 | 结构化研究综合报告 |

### 2. 优先级矩阵（Priority Matrix）

根据频率和影响两个维度对发现进行排序，帮助团队聚焦于最重要的问题。

| 象限 | 频率 | 影响 | 处理策略 |
|---|---|---|---|
| 高频率 + 高影响 | 高 | 高 | Top priority，立即行动 |
| 低频率 + 高影响 | 低 | 高 | 对特定用户群重要，针对性解决 |
| 高频率 + 低影响 | 高 | 低 | 体验优化类改进 |
| 低频率 + 低影响 | 低 | 低 | 记录但暂缓处理 |

### 3. 机会量化（Opportunity Sizing）

对每个研究发现或机会领域进行量化评估，为优先级决策提供数据支撑。

| 评分维度 | 评估方式 | 数据来源 |
|---|---|---|
| Addressable Users（可触达用户数） | 有多少用户可能受益 | 产品分析、调查数据、市场数据 |
| Frequency（发生频率） | 用户多久遇到这个问题 | 访谈频率、支持工单量 |
| Severity（严重性） | 问题对用户的影响程度 | 用户情绪、workaround 复杂度 |
| Strategic Alignment（战略一致性） | 与公司战略的契合度 | 产品愿景和 OKR |

---

## 输出格式

```markdown
## Research Synthesis: [Topic]

### Research Overview
- **Methodology**: [研究类型、参与者数量]
- **Research Question**: [研究要回答的问题]
- **Timeframe**: [研究时间]

### Key Findings
1. **[Finding statement]**
   - Evidence: [支持引用和数据点]
   - Frequency: [多少参与者支持此发现]
   - Impact: [对用户体验或业务的影响]
   - Confidence: [High / Medium / Low]

### User Segments / Personas
- [Segment name]: [描述、特征、独特需求]

### Opportunity Areas
- [机会描述] — [潜在影响]

### Recommendations
1. [具体可执行的建议] — [关联的发现编号]
2. [具体可执行的建议] — [关联的发现编号]

### Open Questions
- [未回答的问题] — [建议的后续研究方法]
```

---

## 使用场景与案例

### 场景一：用户访谈综合

**输入**：产品经理粘贴 8 份用户访谈记录，说 "Synthesize these interviews about our onboarding experience"

**Synthesize Research 输出**：
```
## Research Synthesis: Onboarding Experience

### Research Overview
- **Methodology**: 8 user interviews (30-45 min each)
- **Participants**: Mix of new users (<30 days) and churned users
- **Timeframe**: March 2026

### Key Findings

1. **Users feel lost after account creation**
   - Evidence: "I created my account but had no idea what to do next" (5 of 8 participants)
   - "There's a blank dashboard with no guidance" (4 of 8)
   - Frequency: 6/8 participants
   - Impact: High — 3 of the 6 who felt lost did not return after Day 1
   - Confidence: High

2. **The setup wizard is skipped by power users**
   - Evidence: "I know what I'm doing, I just want to get started" (3 of 8)
   - "The wizard asks too many questions upfront" (3 of 8)
   - Frequency: 4/8 participants
   - Impact: Medium — creates friction for experienced users
   - Confidence: Medium

### Opportunity Areas
1. **Guided first-run experience**: Replace blank dashboard with contextual onboarding
2. **Role-based onboarding paths**: Different flows for beginners vs. power users

### Recommendations
1. [High] Add a guided first-run experience that activates within 30 seconds of account creation
   — addresses Finding #1 (6/8 participants affected)
2. [Medium] Add a "skip wizard" option for experienced users
   — addresses Finding #2 (4/8 participants affected)
```

**关键价值**：产品经理无需手动整理 8 份访谈笔记。系统自动识别主题、计算频率、评估影响，并给出具体的产品建议，每个建议都关联到特定的研究发现。

### 场景二：定性 + 定量数据综合

**输入**：产品经理提供访谈记录 + 产品分析数据 + 支持工单，说 "Why is our retention dropping?"

**Synthesize Research 输出**：
```
## Research Synthesis: Retention Drop Analysis

### Combined Evidence
- **Quantitative**: 30-day retention dropped from 45% to 32% after the v3.0 redesign
- **Qualitative**: 12 user interviews, 47 support tickets related to "can't find" or "confusing"
- **Behavioral**: Analytics show 60% of new users do not complete the setup flow

### Key Finding
The v3.0 redesign moved the settings menu from the sidebar to a top-level hamburger menu.
This change caused a 28% drop in settings discovery (analytics), and 47 support tickets
in 2 weeks mentioned "can't find settings" (support data). Interviews revealed users
feel the product is "less intuitive than before" (8 of 12 participants).

### Recommendation
Restore the settings menu to the sidebar or add a persistent navigation indicator.
A/B test the fix with 10% of users before full rollout.
```

**关键价值**：系统将定量数据（分析、工单量）和定性数据（访谈引语）结合在一起，揭示出 retention drop 的根本原因，并给出具体的修复方案和验证方法。

---

## 与其他工具对比

| 维度 | Synthesize Research (本技能) | Dovetail | Condens | 手动综合 |
|---|---|---|---|---|
| 数据处理方式 | 粘贴文本/上传文件后自动分析 | 导入转录后手动标记 | 导入后手动编码 | 完全手动 |
| 主题分析 | 六阶段自动化主题分析 | 手动编码 + AI 辅助 | 手动编码 | 白板 + 便利贴 |
| 优先级矩阵 | 自动按频率 x 影响四象限分类 | 手动标记优先级 | 无 | 手动整理 |
| 机会量化 | Addressable Users x Frequency x Severity | 无 | 无 | 凭经验估算 |
| 多源三角验证 | 方法学/来源/时间三维三角验证 | 手动关联 | 手动关联 | 手动对比 |
| 定性+定量综合 | 自动关联定性和定量数据 | 无原生定量集成 | 无 | 手动整合 |

---

## 连接工具后的增强能力

| MCP 连接 | 增强能力 |
|---|---|
| ~~knowledge base | 搜索研究文档、访谈记录、调查结果 |
| ~~user feedback (Intercom) | 拉取支持工单、功能请求、Bug 报告 |
| ~~product analytics (Amplitude) | 拉取使用数据、漏斗指标、行为数据 |
| ~~meeting transcription (Fireflies) | 拉取访谈录音、会议摘要、讨论笔记 |

---

## 最佳实践

1. **让数据说话**：不要将研究发现强行塞入预设的叙事框架。如果数据指向与预期不同的方向，接受它并报告它。预设结论的研究综合没有价值。

2. **区分用户说的和用户做的**：行为数据比陈述偏好更可靠。如果用户说"我想要功能 X"但行为数据显示他们从未使用过类似功能，这个矛盾本身就是重要的发现。

3. **引用要慷慨，归因要准确**：直接引语是最有力的证据。大量引用参与者原话，按参与者类型归因（"企业管理员，200 人团队"而非"Sarah"），不要按姓名归因。

4. **5-8 个强发现胜过 20 个弱发现**：不要追求发现的数量。每个发现都应该有充分的证据支撑、明确的频率和影响力评估。弱发现会稀释强发现的说服力。

5. **明确标注置信度**：来自 2 个访谈的发现是假设（hypothesis）而非结论（conclusion）。在报告中明确标注每个发现的置信度（High / Medium / Low），让读者了解证据的强度。

---

## 参考链接

- [Plugin docs](/plugins/product-management)
- [GitHub source](https://github.com/anthropics/knowledge-work-plugins/tree/main/product-management)
