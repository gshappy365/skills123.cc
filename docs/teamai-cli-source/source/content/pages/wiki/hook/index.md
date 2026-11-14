---
title: "会话钩子（hook）"
description: "团队能分发的「事件发生时跑什么」，也是自动同步发生的地方。"
---

# 会话钩子（hook）

## 一句话

AI 工具在特定时刻（开会话、调工具、结束）会执行的命令，团队可以统一分发。

## 打个比方

像公司门禁：刷卡进门（SessionStart）自动开灯，离开（Stop）自动关。

## 在这个项目里

`init` 会装四个内置钩子，其中一个就是 `SessionStart` → `teamai pull`，这就是"每次开会话自动同步"的来源。

团队自己写的钩子放在 `hooks/hooks.yaml` 或 `hooks/<id>/HOOK.yaml`：

```yaml
description: 提交前扫密钥
event: PreToolUse
matcher: Bash
command: bash "${TEAMAI_HOOK_DIR}/scan.sh"
timeout: 15
```

## 常见误区

- **以为钩子是只读的提醒。** 它会真的执行命令，`exit 2` 能拦下工具调用。
- **把 `${TEAMAI_HOOK_DIR}` 写进 `hooks.yaml`。** 那个变量只在目录型 hook 里有效，写在单文件里会让全部团队 hook 停掉。
