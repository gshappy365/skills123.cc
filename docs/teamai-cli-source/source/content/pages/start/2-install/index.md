---
title: "装上它"
description: "两条安装路径：一句话让你的 AI 工具装好 skill，或者用 npm 装 CLI。"
---

# 装上它

## 官方推荐：让 AI 工具自己装

TeamAI 有一个 `teamai` 技能，装进 AI 工具之后，你只要用中文说话，它负责敲命令。
把下面这句原样发过去（Claude Code、Cursor、CodeBuddy、WorkBuddy 都行）：

```text
帮我装好 teamai skill：https://github.com/Tencent/teamai-cli/tree/main/skills/teamai
加载 teamai skill，然后从零搭建团队的 TeamAI。
```

GitHub 打不开时，用国内镜像那句：

```text
请根据 https://skillhub.cn/install/skillhub.md，安装 @user_7be6e993/teamai。
然后加载 teamai skill，并从零初始化我的团队 teamai。
```

==这两句话的区别只是 skill 从哪来==，装完的效果一样。

## 另一条路：自己装 CLI

喜欢命令行就自己装。要求 Node.js ≥ 20：

```bash
npm install -g teamai-cli
teamai --version
```

装出来的 `teamai` 命令就是本体。AI 里的 `teamai` skill 只是「帮你敲命令的嘴」，两者不冲突，
你可以只装 CLI 一直手动敲，也可以两个都装。

## 三条接入路，先认清

| 你想要的 | 命令 | 需要什么 |
| --- | --- | --- |
| 只在当前项目用团队资源 | `teamai init <repo>` | 仓库地址 + Git 登录 |
| 整台机器所有项目都用 | `teamai init <repo> --scope user` | 同上 |
| 不碰 Git，只读收资源 | `teamai init --http <地址> --token <key>` | 管理员给你的地址和 key |

`init` 是后面所有事情的前提：没有它，`pull`、`status`、`push` 都不知道该对哪个仓库说话。

## 装完先跑一次诊断

```bash
teamai doctor
```

++这时候报"未初始化"是正常的++——还没 `init`，它当然不知道你的团队是谁。
这一步只是确认 CLI 本身能跑、Node 版本够、有哪些 AI 工具被认出来了。

## 你应该看到什么

- `teamai --version` 打出版本号（本文核对到 `0.30.0`，2026-11）。
- `teamai doctor` 能列出它检测到的 AI 工具，以及"尚未初始化"这类提示，而不是命令找不到。

## 不对怎么办

- **`teamai: command not found`**：npm 全局目录不在 PATH 上。看 `npm bin -g` 的输出，把它加进 `PATH`，或者用 `npx teamai-cli`。
- **`EBADENGINE` 或版本报错**：Node 低于 20。用 `node -v` 确认，升级后再装。
- **公司镜像装不上**：`npm install -g teamai-cli --registry=<公司源>`。
- **AI 工具说不会装 skill**：换一条路，直接用命令行装 CLI，效果一样。

## 下一步

去 [第 3 课：第一次接入](/start/3-join/)，把仓库连上，然后确认你真的收到了东西。
