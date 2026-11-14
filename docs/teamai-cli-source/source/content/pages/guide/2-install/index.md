---
title: "安装：CLI 和 skill"
description: "两种装法各自适合谁，装完怎么确认，以及之后怎么升级。"
---

# 安装：CLI 和 skill

## 装 CLI（本体）

```bash
npm install -g teamai-cli
teamai --version
```

`teamai` 就是全部功能：`init`、`pull`、`push`、`doctor`、`dashboard` 都在它身上。

## 装 skill（省事的嘴）

`skills/teamai` 是官方提供的一个技能，装进 AI 工具之后，你可以用中文说话，它负责敲命令：

```text
安装 teamai skill：https://github.com/Tencent/teamai-cli/tree/main/skills/teamai ，然后加载它。
```

装好之后常用的四句：

```text
/teamai 帮我从零搭建团队的 TeamAI
/teamai 帮我加入团队的 TeamAI，仓库地址是 <repo>
/teamai 帮我把 xxx skill 分享给团队
/teamai 帮我打开 TeamAI 看板
```

==skill 不是必需品。== 它只是把「你记不住的那些命令」换成「你说人话」。CLI 装好，一切都照样能干。

## 装完的诊断

```bash
teamai doctor
```

它会告诉你：Node 版本、已识别的 AI 工具、钩子装没装、配置在哪、有没有遗留锁文件。
`init` 之前看到"未初始化"是正常的。

## 升级

```bash
teamai update --check     # 只看有没有新版
teamai update             # 升级
```

升级不需要重跑 `init`，配置和资源都在原地。

## 你应该看到什么

`teamai --version` 有版本号，`teamai doctor` 能跑完并给出分区报告，而不是报错退出。

## 不对怎么办

- **全局装完命令找不到**：npm 全局 bin 不在 PATH。`npm prefix -g` 看目录，把它加进 PATH。
- **权限错误 `EACCES`**：别用 `sudo npm -g`，改用 nvm 或改 npm 的 prefix。
- **装了两个版本**：`teamai doctor` 会提"其他安装"。团队仓库里可以打开 `updateOtherInstallations` 让它们一起更新。

## 下一步

[init：管理员建团队 / 成员加入](/guide/3-init/)。
