---
title: "术语表：一句话、一个比方、一个误区"
description: "来源、触发、线程、评估、授权、工单、订阅、策略、执行器、报告，逐条讲清。"
---

# 术语表：一句话、一个比方、一个误区

## 怎么用这份术语表

正文里带虚线的词，悬停就有一句大白话解释。下面每一条都按同一套写法：**一句话 → 打个比方 → 在这个项目里 → 常见误区**。忘了哪个词，直接在上边搜索框（⌘K）里打英文或中文都行。

## 完整对照表

| 术语 | 中文 | 一句话 |
| --- | --- | --- |
| Source | 来源 | 一条事件流：种类是可复用实现，实例是一份配置 |
| Trigger | 触发 | 一条不可变事件，审计与幂等的单位 |
| Thread | 线程 | 时间有序的触发，同一时间只跑一个评估 |
| Correlation | 关联 | 几条线程共享过同一条触发，只加上下文、不路由 |
| Channel | 渠道 | 线程的写侧，定义回复地址；确认、回复、PR、评审都是写 |
| Policy | 策略 | 版本化的接单规则，加每个来源的名单与准入表 |
| Policy version | 策略版本 | 规则 + 来源部分 + 接单模式的一个组合编号 |
| Eval | 评估 | 把一批触发变成一个决定，两层：准入 + 研判 |
| Gate | 准入 | 评估的确定性第一层：谁可以发起、强度多大 |
| Assessment | 研判 | 评估里模型的那一层判断 |
| Decision | 决定 | `accept` 接单 · `stop` 停止 · `ignore` 忽略 · `unavailable` 未完成 |
| Mandate | 授权 | 接单授予的范围、强度、策略版本；不可变 |
| Ticket | 工单 | 一个被授权的工作单元，自己定义状态 |
| Assignment | 派工 | 工单绑定到某个执行器实例；一个工单可有多次 |
| Subscription | 订阅 | 工单与线程的多对多关系，只送上下文 |
| Fan-out | 扇出 | 把订阅线程上的触发送给工单当上下文 |
| Executor | 执行器 | 干活的一个会话 + 一个目录，在领域模型之外 |
| Execution environment | 执行环境 | 执行器会话与 prepare 命令能用的变量，各有键、值、说明 |
| Channel / Report | 渠道 / 报告 | 回复写回哪里 / 派工报给工单的结构化状态 |
| Attention | 待人工决定 | 工单上一个等人回答的结构化具体问题 |
| Disposition | 去向 | 一条触发被过滤、评估或扇出的记录 |
| Input | 输入 | 送给工单的上下文：扇出的触发、策略变更、恢复、文本 |
| Scope | 范围 | 一份授权允许做的工作边界 |
| Strength | 强度 | 授权或评估的依据有多强：`explicit` 明确 / `inferred` 推断 |
| Main Session | 主 Session | 评估触发、接单派工、回复的那个会话；代码里叫 `orchestrator` |
| Executor Session | 执行器 Session | 一个工单一个，代码里叫 `worker` |
| Agent | 智能体 | 这套系统跑起来的那个自动团队成员 |

## 取值速查

| 组 | 取值 |
| --- | --- |
| 决定 Decision | `accept` 接单 · `stop` 停止 · `ignore` 忽略 · `unavailable` 未完成 |
| 强度 Strength | `explicit` 明确 · `inferred` 推断 |
| 派工 Assignment | `pending` 待启动 · `running` 执行中 · `ended` 已结束 |
| 报告 Report | `progress` · `waiting` · `ready` · `blocked` · `failed` · `dropped` |
| 接单模式 | `off` · `observe`（默认） · `auto` |

## 先读哪几条

第一次来，建议按这个顺序：[来源](/wiki/source/) → [触发](/wiki/trigger/) → [评估](/wiki/eval/) → [工单](/wiki/ticket/) → [订阅](/wiki/subscription/)。这五条串起来就是 [概念全景图](/reference/flow/)。
