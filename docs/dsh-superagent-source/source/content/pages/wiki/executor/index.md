---
title: "执行器 Executor"
description: "真正改代码的那个会话与目录，在领域模型之外。"
---

# 执行器 Executor

## 一句话

==执行器是干活的那个端口==：每个工单一个 DSH 会话、一个目录。它在领域模型**之外**，通过[[派工|Assignment：工单绑定到某个执行器实例]]接进来。

## 打个比方

像外包的施工队：办公室里那张维修单管的是「批没批、做到哪」，施工队管的是「怎么拧螺丝」。换一支队伍，维修单还是那张。

## 在这个项目里

- 一个[[工单|Ticket]]可以有多次派工；派工状态 `pending → running → ended`，和工单状态互不相干；
- 目录默认在 `<stateDir>/work/<简称>`，开工前先跑一次 prepare 命令（常见是 `git worktree`，给每个工单独立工作树）；
- 执行器读 DSH 的编码提示词和仓库的 `AGENTS.md`；**主会话不读**，主会话只路由，不做技术决定；
- 无人值守：它的工具里去掉了 `ask_user_question`、`present`、`plugin_manager` 这类会找人、开界面或改 profile 的工具；
- 预设叫 `dsh-superagent-worker`，主会话用 `dsh-superagent-router`；配置里这两行在会话使用期间不能删；
- 安全上要清楚：它以 `danger-full-access`、以操作者的系统用户运行，CLI 包装不是隔离边界。

## 常见误区

- 把执行器当成领域对象或「主会话」：它是外部端口，主会话只做路由。
- 以为工单会跟着某个会话一起消失：工单状态自己保存。
