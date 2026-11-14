---
title: "加入一个已有团队"
description: "只要仓库地址，三条命令确认你真的和团队在同一个版本上。"
---

# 加入一个已有团队

## 什么时候用这篇

你入职、换项目、或者刚被拉进一个已经在用 TeamAI 的团队。

## 三步

```bash
# 1. 装 CLI（已经装了就跳过）
npm install -g teamai-cli

# 2. 在你要干活的目录里接入
cd /path/to/my-workspace
teamai init https://github.com/your-org/your-team-teamai

# 3. 检查
teamai doctor
teamai status          # 刚 init 完应该是空的
teamai list            # 能看到团队的 skills / rules / agents / hooks / mcp
```

想让整台机器都能用（不只是这个项目）：

```bash
teamai init https://github.com/your-org/your-team-teamai --scope user
```

## 你可能要先设两样东西

```bash
teamai roles list
teamai roles set frontend      # 团队统一分配时会被拒绝，那是正常的
teamai projects set checkout   # 只有团队用多项目分发时才需要
```

==不设角色，你会同步全部技能==。团队资源多的时候，先问管理员你要不要设。

## 你应该看到什么

`teamai list` 有内容，工具目录里出现对应的 `skills/<名字>/SKILL.md`，新开一次 AI 会话能说出团队规则。

## 注意

- 在 Git 仓库里，`init` 用的是仓库根目录，不是当前子目录。
- 团队成员只需要读权限；要分享资源才需要分支写权限。
