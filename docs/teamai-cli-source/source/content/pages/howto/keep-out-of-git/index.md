---
title: "让分发的文件不进入 git"
description: "一个开关，把 pull 下来的副本写进 .git/info/exclude，git status 就干净了。"
---

# 让分发的文件不进入 git

## 为什么需要

项目级（workspace）安装会把技能、规则落到项目目录里。这些东西是团队分发的产物，不该进你的业务仓库。

## 开关

团队仓库的 `teamai.yaml`：

```yaml
sharing:
  gitExclude:
    enabled: true
```

或者本机项目配置里的 `gitExcludeEnabled: true`（本机优先）。

下一次 `pull` 生效。它写的是 `.git/info/exclude`，==不改 `.gitignore`==——因为这是"我这台机器的事"，不该提交给全团队。

## self 模式的例外

团队仓库就是业务仓库（`teamai init .`）时，有些工具的 hook 配置文件是提交进仓库的。
这时 teamai 只保留自己的内置钩子，团队自己的钩子写进旁边那个"个人文件"：

| 工具 | 提交的文件 | 团队 hook 去哪 |
| --- | --- | --- |
| Claude Code | `.claude/settings.json` | `.claude/settings.local.json` |
| CodeBuddy | `.codebuddy/settings.json` | `.codebuddy/settings.local.json` |
| Qoder | `.qoder/settings.json` | `.qoder/settings.local.json` |

## 你应该看到什么

`git status` 里看不到 `.claude/skills/…` 这类分发副本，但 AI 工具照常加载它们。

## 注意

- `gitExclude` 只管"别再冒出来"，已经 `git add` 过的文件不会被它移出暂存区，要自己 `git rm --cached`。
