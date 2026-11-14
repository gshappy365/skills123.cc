---
title: "只接 GitHub 的最小配置"
description: "第一次跑通就用一个来源、一个仓库、一个允许的人。"
---

# 只接 GitHub 的最小配置

## 最小可跑的一套

| 项 | 建议值 |
| --- | --- |
| 来源 | 只开 GitHub；飞书保持注释状态 |
| 仓库 | 一个 github.com 仓库（不支持 GHES） |
| 智能体账号 | 单独新建，别用你的 |
| 允许名单 | 先只填你自己的 GitHub 登录名 |
| 接单模式 | `observe` |
| 自动合并 | 关 |
| 分支前缀 | `agent/` |

配置文件里飞书那段保持注释即可：

```yaml
# - id: dsh-superagent-feishu
#   disabled: false
```

## 为什么先别开「接收全部」

GitHub 来源有可开关的「接收新 Issue / 新 PR / 评论 / 默认分支 CI 全部事件」这类选项。全开会把很多噪声送进评估，先只订阅你实际要的那些，等判断准了再放宽——和允许名单的思路一样。

## 你应该看到什么

`scripts/dsh-superagent status` 退出 0；Source 页只有 GitHub 一行且状态正常；Overview 没有 setup 问题。

## 相关

[加飞书](/howto/feishu/) · [谁能叫它干活](/guide/3-policy/) · [@ 了没反应](/howto/no-response/)
