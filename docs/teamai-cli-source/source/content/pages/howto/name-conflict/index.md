---
title: "同名资源被跳过（Skipped / Held）"
description: "两种冲突：同一仓库里同名技能，和 workspace 里两个仓库给了不同内容。"
---

# 同名资源被跳过（Skipped / Held）

## 先看是哪种

## 情况一：同一团队仓库里，多个命名空间有同名技能

```text
skills/release/SKILL.md            共享根
skills/dev/release/SKILL.md        角色 dev 的
skills/sre/oncall/SKILL.md         角色 sre 的
```

一个技能名只落一个目录，所以只能给你一份。规则：

- 有角色 → 拿你角色收到的命名空间里的那份；
- 共享根那份只能通过标签到达；
- 两个命名空间都有 → 按名字排序靠前的胜出；
- `pull` 会逐条说被跳过的是哪一份、要哪个角色才能拿到。

**解法**：真要让所有人同时拿到两份，就改名，比如 `skills/dev/release-staging/`。

## 情况二：workspace 里两个仓库给了同名但内容不同的东西

```text
⚠ [workspace] Held skills/lint: differs between svc-a and svc-b
```

teamai 暂缓它，之前装的那份保持不变。**每个仓库自己仍然收它那一份。**

**解法**：在团队仓库里把两份内容改成一致，或者给其中一个改名。

## 情况三：单文件与目录同名

```text
skills/greet.md
skills/greet/SKILL.md
```

两边都不投递，直接报错。删掉其中一个。

## 情况四：你自己的技能和团队的撞名

团队副本会放到另一个目录（比如 `.codex/skills`），并在每次完整 pull 时打印冲突提示。
你自己那份不会被改动。

## 应该看到什么

`teamai pull` 的输出里，每个被跳过的条目都跟着"要哪个角色才能拿到"的提示。

## 注意

如果某台机器的检出已经是团队最新提交，它会保留现有副本，直到团队有新提交。想立刻切换：`teamai pull --force`。
