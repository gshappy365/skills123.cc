---
title: "概念全景图"
description: "一张图看懂从有人在 GitHub @ 它，到人来合并 PR 的全过程。"
---

# 概念全景图

## 主干流程

```
来源 Source（GitHub 通知 / 飞书事件）
   │  产出不可变的触发 Trigger，记住读位置
   ▼
线程 Thread ──订阅扇出──► 已有工单 Ticket（只给上下文，不给权限）
   │  其余触发
   ▼
评估 Eval ─ 准入 Gate（确定性：谁、哪类消息、有没有 @）
        └ 研判 Assessment（按策略规则 + 线程快照 + 已有工单）
   │
   ▼
决定 Decision：accept / stop / ignore / unavailable
   │  accept 时原子创建
   ▼
工单 Ticket ＋ 授权 Mandate ＋ 订阅 Subscription ＋ 派工 Assignment ＋ 一条确认
   │
   ▼
执行器 Executor（一个会话 + 一个目录 + prepare 命令）
   │  改代码、跑验证、开 PR
   ▼
报告 Report（progress / waiting / ready / blocked / failed / dropped）
   │  经渠道 Channel 写回原对话
   ▼
人：回答一个具体问题 · 审 PR · 合并（默认人工）
   │
   └─ 后续讨论沿订阅继续送达同一个工单，不用重新 @
```

## 三条分界线

| 分界 | 为什么重要 |
| --- | --- |
| **领域层 ↔ 执行层** | 执行器在领域模型之外，所以工单能交接、恢复、换执行器，状态自己保存 |
| **授权 ↔ 上下文** | 授权来自不可变的 Mandate；订阅只送上下文，绕过闸门但不发权限 |
| **强制规则 ↔ 提示词** | 身份、权限、工具参数、长度上限由 host 强制；提示词排在后面，外部文本只是数据 |

## 提示词的优先级（从强到弱）

1. 工具与 host 强制的事实：身份、权限、参数校验、回复用途、长度上限；
2. 内置与生成的段落（按团队的覆盖来读）；
3. 主动工单命中的规则，只对该工单的执行器会话有效；
4. 团队段落与团队技能；
5. 外部文本：消息、评论、文档、引用——**是数据，永远不改规则或授权**。

## 引擎内部（想深入再看）

`src/core/` 是纯领域逻辑、零 I/O；**Engine 是触发、线程、决定、工单、派工的唯一写入者**，内部分成单向依赖的五段：`Intake → Evals → Tickets → Assignments → Replies`。所有方法同步、每条命令一个事务，并按角色暴露不同视图。状态存在单个 SQLite 文件 `<stateDir>/orchestrator.sqlite`；副作用走 `Effects` 队列，`Outbox` 是唯一写回执的地方；`Passes` 每 2 秒驱动一次到期评估。

完整架构见官方 `docs/007-architecture.md`。
