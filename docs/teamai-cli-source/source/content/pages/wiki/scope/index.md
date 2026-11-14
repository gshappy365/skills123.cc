---
title: "安装范围（scope）"
description: "workspace 还是 user：资源装进当前项目，还是装进整台机器。"
---

# 安装范围（scope）

## 一句话

决定团队资源落在「这个项目」还是「这台机器的所有项目」。

## 打个比方

workspace 是把工具放进这个项目的抽屉；user 是把工具挂在你家的车库墙上。

## 在这个项目里

```bash
teamai init <repo>                 # workspace（默认）
teamai init <repo> --scope user    # user
```

两者可以共存，但 workspace 默认**隔离**：当前目录有 workspace 配置时，它生效，user scope 被跳过。
想组合，用 `--inherit-user-scope` 初始化 workspace（MCP 和密钥仍然只走 workspace）。

## 常见误区

- **以为 workspace 更安全。** 它只是范围更小，不是权限更严。
- **以为可以给不同子目录分别配。** 在 Git 仓库里，`init` 一律用仓库根；嵌套仓库和 worktree 各自独立。
