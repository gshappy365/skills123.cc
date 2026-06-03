# Memory Management — Productivity Plugin

> 所属插件：[Productivity](/plugins/productivity) · 来源：Anthropic knowledge-work-plugins · 兼容：Cowork + Claude Code

---

## 概述

Memory Management 是 Productivity 插件的核心系统。它赋予 Claude 一种"工作场所记忆"——能记住你的同事、项目、术语和工作方式。在没有记忆系统的情况下，"ask todd to do the PSR for oracle" 是一句无法理解的话；有了它，Claude 能自动解析：Todd = Todd Martinez（VP Engineering），PSR = Production Stability Review（生产稳定性评审），Oracle = Project Oracle（Oracle 数据库迁移项目）。

---

## 基本信息

| 属性 | 值 |
|---|---|
| **技能名称** | `memory-management` |
| **插件** | Productivity |
| **触发方式** | 自动（背景知识，无 slash 命令） |
| **用户可调用** | 否（系统内部自动运行） |
| **官方源码** | [GitHub](https://github.com/anthropics/knowledge-work-plugins/tree/main/productivity/skills/memory-management) |

### 触发短语

当以下场景出现时，技能自动激活：

- 用户提到昵称、缩写或项目代号
- 对话中出现不熟悉的术语
- 需要查找某人的联系方式或角色信息

---

## 架构设计

记忆系统采用**双层架构**，兼顾速度和容量：

```
┌─────────────────────────────────────────────────────────────────┐
│                   MEMORY MANAGEMENT                              │
├─────────────────────────────────────────────────────────────────┤
│  HOT CACHE: CLAUDE.md（常驻内存）                                │
│  ✓ ~30 个人物映射（昵称 → 全名、角色）                           │
│  ✓ ~30 个术语表（缩写 → 全称）                                   │
│  ✓ 5-15 个活跃项目（代号 → 描述）                                │
│  ✓ 用户偏好（沟通风格、习惯）                                     │
├─────────────────────────────────────────────────────────────────┤
│  DEEP STORAGE: memory/（按需加载）                               │
│  ✓ glossary.md — 完整术语表                                     │
│  ✓ people/ — 个人档案（沟通偏好、上下文）                        │
│  ✓ projects/ — 项目详情（范围、状态、预算）                      │
│  ✓ context/ — 公司级上下文（团队、工具、流程）                   │
├─────────────────────────────────────────────────────────────────┤
│  分级查询                                                        │
│  1. 查 Hot Cache（~100 词）                                      │
│  2. 查 Deep Storage（按需）                                      │
│  3. 上下文推断                                                   │
│  4. 直接询问用户                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 核心能力

### 1. 双层记忆架构

**Hot Cache（CLAUDE.md）**：目标 50-80 行，覆盖最频繁需要的上下文。

| 章节 | 内容 | 目标大小 |
|---|---|---|
| **Me** | 姓名、角色、团队、一句话摘要 | 1-2 行 |
| **People** | 昵称 → 全名、角色映射 | ~30 条 |
| **Terms** | 缩写 → 全称映射 | ~30 条 |
| **Projects** | 代号 → 描述 | 5-15 条 |
| **Preferences** | 沟通风格、会议习惯 | 3-5 行 |

**Deep Storage（memory/）**：当 Hot Cache 不够用时，按需深入。

```
memory/
├── glossary.md          ← 完整术语表
├── people/
│   ├── todd-martinez.md ← 个人档案：沟通偏好、关系
│   └── sarah-chen.md
├── projects/
│   ├── project-phoenix.md
│   └── project-horizon.md
└── context/
    └── company.md       ← 公司级上下文
```

### 2. 分级查询流程

```
用户: "ask todd to do the PSR for oracle"
                    │
    ┌───────────────▼───────────────┐
    │ Level 1: Hot Cache            │
    │ CLAUDE.md 中查找 "todd"       │
    │ → Todd Martinez, VP Eng      │
    │ 查找 "PSR"                    │
    │ → Production Stability Review│
    │ 查找 "oracle"                 │
    │ → Project Oracle (DB迁移)     │
    └───────────────┬───────────────┘
                    │ 全部命中，无需继续
                    ▼
    ┌───────────────▼───────────────┐
    │ Claude:                        │
    │ "给 Todd Martinez 发消息，     │
    │  请求他完成 Oracle 数据库      │
    │  迁移项目的生产稳定性评审。"   │
    └───────────────────────────────┘
```

90% 的请求在 Level 1 就能完全解析。只有 niche 术语才需要深入到 Deep Storage 或直接询问。

### 3. 自动晋升与降级

记忆不是静态的——它会自动在层级之间流动：

| 操作 | 条件 | 动作 |
|---|---|---|
| **晋升** | 某术语在 3 次不同对话中被查询 | 从 Deep Storage 移到 Hot Cache |
| **降级** | 某术语 30 天未被使用 | 从 Hot Cache 移到 Deep Storage |
| **创建** | 用户解释一个新缩写 | 写入 Deep Storage + Hot Cache |
| **更新** | 项目状态变化 | 更新 Deep Storage 中的详情 |

---

## 使用场景与案例

### 场景 1：缩写解析

**输入**：
```
把 QBR 材料发给 Todd，他需要在周五前准备好。
```

**输出**：Claude 知道 QBR = Quarterly Business Review（季度业务评审），Todd = Todd Martinez，周五前 = 这周五。

**关键价值**：不需要每次都写全称，日常沟通习惯被 AI 无缝理解。

### 场景 2：项目上下文

**输入**：
```
Phoenix 的进度怎么样了？
```

**输出**：Claude 查找 Project Phoenix 的档案，获取负责人、截止日期、当前状态，给出完整回答。

**关键价值**：项目代号在公司内部广泛使用，但 AI 原本无法理解，记忆系统消除了这个鸿沟。

---

## 与其他工具对比

| 维度 | Memory Management（本技能） | ChatGPT Memory | 传统笔记工具 | 无记忆 AI |
|---|---|---|---|---|
| 工作场所上下文 | 专门设计 | 通用 | 需手动维护 | 无 |
| 自动激活 | ✅ | ⚠️ 有限 | ❌ | ❌ |
| 分级查询 | Hot Cache + Deep Storage | 扁平 | 扁平 | 无 |
| 自动维护 | 晋升/降级/创建 | 有限 | ❌ | 无 |
| 文件可见性 | 纯 Markdown，用户可编辑 | 黑盒 | 可见 | 无 |

---

## 最佳实践

1. **保持 Hot Cache 精简** — 超过 80 行的 CLAUDE.md 会降低查询效率，确保只放最常用的信息
2. **用自然语言描述人物** — "Todd, VP Engineering, 偏好 Slack 沟通" 比结构化数据更容易被理解
3. **定期清理** — 项目结束或人员变动后，及时更新或删除相关条目
4. **鼓励团队共享** — 记忆文件可以作为团队 onboarding 的一部分

---

## 参考链接

- [Productivity Plugin 完整文档](/plugins/productivity)
- [Anthropic 官方源码](https://github.com/anthropics/knowledge-work-plugins/tree/main/productivity/skills/memory-management)
- [Skill vs Plugin](/concepts/skill-vs-plugin)
