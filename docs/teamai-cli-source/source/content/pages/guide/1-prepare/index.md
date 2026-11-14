---
title: "动手前先准备好四样东西"
description: "仓库、权限、Node 与 AI 工具：缺哪样会卡在哪一步，怎么用最小代价补齐。"
---

# 动手前先准备好四样东西

## 一、一个团队仓库

新建一个空仓库就行，名字用 `<团队名>-teamai` 比较好认。位置随你：

- GitHub / GitLab / GitCode / CNB / 工蜂
- 私有 Git 服务（`--provider git`，只用你现有的 SSH Key 或凭据）
- 或者**业务仓库自己就是团队仓库**（`teamai init .`，资源写进 `.teamai/`）

还没有仓库？官方维护了一个 [teamai-hub](https://github.com/teamai-hub) 组织，里面是带了成套 skills、rules、评审 agents 的模板。
Fork 一个，再对它 `init`，比自己从零写快得多。

## 二、权限：分支能写，主干保护

| 角色 | 需要什么 | 为什么 |
| --- | --- | --- |
| 管理员 | 主干合并权限 | 别人 push 的 PR 得有人合 |
| 成员 | 分支写权限 | `push` 会推一个分支出去 |
| 只读者 | 读权限，或一个 HTTP key | `init --http` 不需要 Git |

主干建议开保护。不是因为工具会乱来，而是因为==这个仓库会往所有人的机器上装东西==，值得一道人工闸门。

## 三、Node.js ≥ 20

只有用 npm 装 CLI 才需要。查一下：

```bash
node -v      # 需要 v20 或更高
npm -v
```

装：

```bash
npm install -g teamai-cli
teamai --version
```

不想装 Node 也可以：让 AI 工具去装 `teamai` skill，skill 走的是工具自己的安装通道。

## 四、一个 AI 工具（其实可以很多个）

同一个团队仓库可以分发给多个工具，各按各的格式落盘。官方支持的范围很宽，常见的有：

Claude Code、Codex、Cursor、CodeBuddy、WorkBuddy、GitHub Copilot CLI、OpenCode、
Pi Coding Agent、Oh My Pi、OpenClaw、Hermes、DeepSeek Harness、Qoder、Kiro、Trae、ZCode、JoyCode、Muse Code、Antigravity。

不用提前纠结选哪个：`init` 会检测已安装的工具，你也可以用 `--agent` 指定。

## 顺便决定三件事

1. **装到哪。** 项目级（默认，只在当前目录生效）还是整机级（`--scope user`）。
2. **谁合并。** 团队仓库的 `teamai.yaml` 里有个 `reviewers` 字段，写上名字，评审时心里有数。
3. **要不要现在开 recall。** beta 能力，默认关。先别开，等第一层跑顺了再说。

## 你应该看到什么

四样都齐：仓库地址有、权限够、`teamai --version` 有输出、至少一个 AI 工具在 `teamai doctor` 的检测列表里。

## 不对怎么办

- **公司 Git 走不通**：用 `--provider git`，它直接用你现有的 Git 凭据推分支，PR 你自己去网页上开。
- **完全没有 Git**：走 HTTP 只读路子，能收资源，但推不了东西。
- **团队用 GitHub Enterprise Server**：官方说明里没有把它列进支持范围，先确认再投入。

## 下一步

[安装：CLI 和 skill](/guide/2-install/)。
