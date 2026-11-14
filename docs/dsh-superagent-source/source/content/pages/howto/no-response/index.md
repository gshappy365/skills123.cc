---
title: "@ 了没反应，照这张表查"
description: "从消息写法一路查到来源、名单、评估和暂停，五分钟定位。"
---

# @ 了没反应，照这张表查

## 按顺序查，别乱改设置

| # | 查什么 | 在哪看 | 常见结果 |
| --- | --- | --- | --- |
| 1 | 是不是发成了**新评论** | 原 Issue | 编辑正文补 @ 收不到，必须发新评论 |
| 2 | 发消息的人在不在允许名单 | Settings → Eval → On each Source | 名单为空则任何请求都成不了工单 |
| 3 | 来源开着吗、有没有 setup 问题 | Source 页 | 开关、账号、CLI 登录 |
| 4 | 是不是被暂停了 | Execution 页 | `Pause processing` |
| 5 | 触发到底进没进来 | Trigger 页 | 没有触发＝问题在前四步 |
| 6 | 决定是什么 | Eval 页 | `ignore`（含 observe 的「本来会接」）/ `unavailable` |
| 7 | 工单是不是失败了 | Execution 页 | prepare 命令（克隆路径）失败最常见，改好 `Retry` |

## 几个高频答案

- **「有触发但没工单」**：`observe` 模式下推断出来的工作只记「本来会接」。想让它接，要么明确点名，要么以后切 `auto`。
- **「决定是 unavailable」**：评估超时或不可用，触发会重新排队；面板上可以 `Evaluate again`。
- **「机器人 @ 了没用」**：机器人只能产生推断候选，不能 explicit，也不能叫停。
- **「面板显示 restarting」**：保存设置返回 `restarting: true` 会重启，等 `status` 不再退出 1 再继续。

## 还查不出来

去 `.artifacts/` 看启动日志（保留最近 20 个），或翻 [踩坑清单](/reference/pitfalls/)。部署相关的完整排查表在官方 `docs/006-deployment.md` 的 Troubleshooting。
