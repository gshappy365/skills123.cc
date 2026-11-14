---
title: "pull（同步）"
description: "把仓库里的事实，投影到你这台机器的各个工具目录；它保留你的改动。"
---

# pull（同步）

## 一句话

`teamai pull` 是「仓库 → 你的机器」这一步。

## 打个比方

像把共享文档的最新版下载到本地——但你本地批注过的段落，它会留着并提醒你。

## 在这个项目里

会话启动时自动跑（靠 `SessionStart` 钩子）；也可以手动：

```bash
teamai pull
teamai pull --dry-run
teamai pull --force
teamai pull --team-ref v2.3.0
```

## 常见误区

- **以为它是一键覆盖。** 你改过的副本会保留并提示；同名冲突它两边都不投。
- **以为它能创建工具目录。** 缺失的工具根目录不会自动建，要用 `init --agent <id>` 补。
