---
title: "概念全景图"
description: "一张图看懂：谁写、谁审、谁收，以及每一层失败时你会看到什么。"
---

# 概念全景图

## 全景

```text
【团队仓库】Git
  teamai.yaml            团队配置
  skills/ rules/ agents/ 资源
  hooks/ mcp/ env/       运行时接入
  models/                模型网关
  manifest/              角色、项目、成员
  learnings/ teamwiki/   beta：上下文
  workflows/ scorers/    beta：改进
        │
        │  push（分支 + PR）↑  评审合并
        ↓  pull（自动 / 手动）
【你的机器】
  ~/.teamai/             配置、projects 分区、按 scope 的缓存
  各 AI 工具目录          skills/ rules/ agents/ hooks/ mcp 配置
  shell                   env 变量（按目录切换）
```

## 两个方向的规则不一样

| 方向 | 触发 | 会不会覆盖你 |
| --- | --- | --- |
| 仓库 → 机器（`pull`） | 会话启动钩子、手动 | 不覆盖你改过的副本 |
| 机器 → 仓库（`push`） | 你手动 | 要覆盖队友改动会先停下问你 |

## 每一层失败，你会看到什么

| 层 | 失败的样子 | 第一件事 |
| --- | --- | --- |
| 配置 | `teamai` 不认识你的团队 | `teamai doctor` |
| 仓库权限 | `push` 推不上去 | `--provider git` 或配 token |
| 同步 | 开会话没反应 | `teamai hooks list` |
| 落地 | 列表有、工具里没有 | `init --agent <id> --force` |
| 冲突 | Skipped / Held | 看 [同名冲突](/howto/name-conflict/) |

## 决定「谁收到什么」的三把尺

1. **命名空间**（目录名）——资源怎么分组；
2. **角色 / 项目**——成员怎么声明自己要什么；
3. **标签**——成员自愿额外订阅。

前两个是减法，第三个是加法。混着用是大部分"我为什么没收到"的来源。

## 三层能力分别要什么

| 层 | 要什么 | 能不能不用 |
| --- | --- | --- |
| Team Execution | 一个仓库 + 成员 `init` | 不能，这是本体 |
| Team Context | 打开 recall，有人写 learnings | 能，默认关 |
| Team Improvement | 评分器、工作流、模型额度 | 能，beta |
