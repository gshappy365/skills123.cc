---
title: "10 个常见的坑"
description: "每一个都真实发生过：从「没设角色反而收全部」到「删本地副本它又回来」。"
---

# 10 个常见的坑

## 1. 没设角色，收了一堆用不上的技能

命名空间只对**设了角色**的成员生效。没设角色 = 全同步。
→ 要么设角色，要么让团队用 `manifest/members.yaml` 分配。

## 2. 设了角色，共享根的还在

角色是减法，但减的是"命名空间之外的"，不是"共享根之外的"。
共享根（`skills/xxx/`）永远所有人可见。想彻底分开，就得把共享根的东西分流到命名空间。

## 3. 用 `rm` 删本地副本，下次开会话它又回来了

删副本不是删除资源。→ `teamai remove skills <名字>`。

## 4. `push` 之后同事还是旧的，以为坏了

`push` 只开 PR，==合并之后才对别人生效==。合并前 `teamai list skills --source repo` 已经能看到，但不会装到工具里。

## 5. 项目的 `.claude/` 目录压根没生成

非交互环境里 `init` 没带 `--agent`，它不会猜你要哪个工具。
→ `teamai init --agent claude --force`。

## 6. 把 `scope` 写进 teamai.yaml，发现没用

装到哪由成员执行 `init --scope` 决定，团队配置里的 `scope` 会被忽略。

## 7. 密钥写进了仓库

`env/secrets.yaml` 只声明 key；`models` 的 `api_key` 必须写 `${API_KEY}`。
团队仓库常常是全员可见的，一次误提交就是一次轮换。

## 8. 两个仓库给了同名资源，`pull` 说 Held

workspace 里 `svc-a` 和 `svc-b` 都提供了 `skills/lint` 但内容不同，它会暂缓并点名。
→ 在仓库里让两份一致，或给其中一个改名。

## 9. 把团队 hook 写进 `hooks.yaml` 却引用了 `${TEAMAI_HOOK_DIR}`

那个变量只在目录型 hook（`hooks/<id>/HOOK.yaml`）里有效。写在单文件里会**停掉全部团队 hook**，而且不报错。

## 10. 卸载前没看 `--dry-run`

`teamai uninstall --dry-run` 会逐条列出将移除的路径，且不改任何东西。
直接 `--force` 卸掉，会有一种"我的 dotfiles 怎么少了一段"的惊喜。

## 还有一条，算不上坑但值得记住

**`teamai doctor` 报告的是它所在目录的情况。** 换个目录再跑，可能是另一套配置——特别是你同时用 workspace 和 user scope 时。
