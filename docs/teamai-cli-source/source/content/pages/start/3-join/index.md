---
title: "第一次接入"
description: "用一句话加入团队，然后按三个检查点确认资源真的到了你机器上。"
---

# 第一次接入

## 先要一样东西：仓库地址

找团队管理员要团队仓库地址，形如 `https://github.com/your-org/your-team-teamai`。
你可能不是管理员，只需要读权限就能接入；要分享资源才需要能推分支。

## 一句话接入

在你要用 AI 的项目目录里打开 AI 工具，说：

```text
/teamai 帮我加入团队的 TeamAI，仓库地址是 https://github.com/your-org/your-team-teamai
```

它背后执行的是这条：

```bash
cd /path/to/my-workspace
teamai init https://github.com/your-org/your-team-teamai
```

==默认是项目级（workspace）==：资源装进当前项目目录，只有这个项目看得见。
想让整台机器都用，加一句：

```bash
teamai init https://github.com/your-org/your-team-teamai --scope user
```

两种范围的取舍见 [安装范围](/wiki/scope/)。

## init 到底做了什么

它不只是"下载一个仓库"，还顺手做了五件事：

1. 认出仓库在哪个 Git 平台，需要登录时带你登录；
2. 把本机登记成团队成员；
3. 给检测到的 AI 工具装上[[会话钩子|SessionStart hook：开会话时自动触发 teamai pull，你什么都不用记]]；
4. 做一次完整的 `pull`，把资源落到各工具目录；
5. 写下配置文件：团队仓库的 `teamai.yaml` 与你本机的 `~/.teamai/…`。

## 三个检查点

**第一，诊断每一行都通过。**

```bash
teamai doctor
```

**第二，刚 init 完，本地差异应该是空的。**

```bash
teamai status
```

**第三，能列出团队的东西。**

```bash
teamai list          # 团队仓库里的 skills、rules、docs、env、agents、hooks、mcp
teamai list skills --source repo
```

三条都对上，说明你已经跟团队在同一个版本上了。

## 以后你不用再管同步

打开 AI 工具，会话启动钩子会做一次 `pull`。Git 团队在 60 秒内会复用刚刷新的仓库，所以连着开几个会话不会反复拉。

想立刻同步（或者你的工具没有钩子支持）：

```bash
teamai pull
teamai pull --dry-run     # 只看看会改什么
```

++`pull` 不会覆盖你改过的副本++。团队成员改过的 skill、rule、agent 会被保留并提示出来，
这是它和「一键覆盖」最大的不同。

## 你应该看到什么

- `teamai list` 里出现团队共享的 skill 名字。
- 你的 AI 工具的 skills 目录里多出对应文件夹（例如 `~/.claude/skills/<名字>/SKILL.md`）。
- 开一个新会话，AI 能说出团队规则里的内容。

## 不对怎么办

- **`teamai list` 是空的**：团队仓库还没有内容。让管理员先 `push` 一份，或者自己去 [分享一个 skill](/howto/share-skill/)。
- **列表有、工具里没有**：`init` 时没选中你的工具。用 `teamai init --agent <工具id> --force` 补，或直接 `teamai pull --force`。
- **每次开会话都提示没同步**：钩子没装上。`teamai hooks list` 看状态，`teamai hooks inject` 重装。Windows 上还要额外配置，见 [让钩子在 Windows 上生效](/howto/windows-hooks/)。
- **拉下来但不是最新**：`teamai pull --force` 强制全量同步一次。

## 下一步

到这里你已经能用了。想搞清楚"为什么这么设计、还能怎么管"，去 [完整教程](/guide/0-what/)；
只想解决眼前一件事，去 [How-to 实操](/howto/)，或者直接看 [10 个常见的坑](/reference/pitfalls/)。
