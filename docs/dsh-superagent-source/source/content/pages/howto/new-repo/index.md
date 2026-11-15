---
title: "接手陌生仓库：先别改代码"
description: "让它只做调查，交一份能看懂的地图，再由你决定动不动手。"
---

# 接手陌生仓库：先别改代码

## 把调查和改动拆成两次

```
@<agent login> 先不要改任何代码。把 <模块> 讲清楚：
入口在哪、主要调用关系、数据怎么流动、你觉得最容易出问题的两处。
做完请给我：一页说明，以及你依据的文件路径。
```

它自己的规矩里就有「主会话只路由、执行器读原始来源并判断范围」，以及「按影响停止」：需要设计决策时停下来问，而不是一路改下去。你明确说「先别改」，等于把这条边界提前写死。

## 官方示例里的 prepare 命令

每个工单开工前会先跑一次 prepare 命令。官方文档给的样子是两行——它给每个工单一份独立工作树，也顺带解释了常见的 `agent/` 前缀从哪来：

```
git -C <clone> fetch origin
git -C <clone> worktree add -b "agent/$DSH_SUPERAGENT_NAME" <dir> origin/HEAD
```

命令和提示词共用同一套执行环境变量。**写错变量名不会报错，只会静默拿到空值**，所以改 prepare 命令时先核对变量：

| 变量 | 含义 |
| --- | --- |
| `DSH_SUPERAGENT_DIR` | 这个工单的工作目录 |
| `DSH_SUPERAGENT_NAME` | 工单简称（也决定分支名与 PR 归属） |
| `DSH_SUPERAGENT_TICKET` | 工单 id |
| `DSH_SUPERAGENT_BLOCKED_COMMANDS` | 这台机器上禁止执行的命令 |
| `DSH_SUPERAGENT_GITHUB_REPOSITORY` | `owner/name` |

另有 GitHub 与飞书的凭证类变量，完整清单以 `docs/006-deployment.md` 的 Execution environment 表为准。

## 你应该看到什么

一份带文件路径的说明，没有 PR。等你确认方向，再在同一条线程里发第二句——订阅会把它送到同一个工单，不用重新解释背景。

## 不对怎么办

它还是开了 PR：回一句「这次只要说明，把 PR 关掉」，并检查 `Ticket scope` 段落是不是写得太宽。
