---
title: "换一个团队 / 换一个仓库"
description: "force 重新 init，pull 一次换血；哪些副本会被删、哪些会留下。"
---

# 换一个团队 / 换一个仓库

## 命令

```bash
teamai init https://github.com/your-org/platform-team --agent claude,codex --force
teamai pull
```

## 这次 pull 会做什么

| 之前（frontend 团队） | 之后（platform 团队） |
| --- | --- |
| `.claude/skills/react-review` | 删除（旧团队发的，你没改过） |
| `.claude/skills/storybook`（你改过） | 保留，并提示 |
| `.codex/skills/storybook` | 删除 |
| `.claude/rules/frontend-style.md` | 删除 |
| — | 新增 `.claude/skills/terraform-plan` 等 |

一句话：==旧团队下发、你没动过的会清掉；你动过的会留着并点名==。

## 两个例外

- **Hermes / OpenClaw**：全机共用一个技能目录（`~/.hermes/skills`），旧团队的技能会留下，要手动确认后删。
- **self 模式**：资源写在仓库的 `.teamai/` 里，换团队等于换那个仓库的内容。

## 想先试新团队，不动老配置

```bash
teamai pull --team-ref feature/review-skill
teamai pull --team-ref main        # 解除固定
```

`--team-ref` 适合"团队发了个新分支，我想先试试"，要求 workspace 安装，且该团队没装在 user scope。

## 你应该看到什么

`pull` 输出里同时出现 `Removed N skill(s) no longer delivered here` 和 `Kept …` 两种行。前者是清理，后者是保护你的改动。

## 注意

- 别删 `~/.teamai/` 来"重置"——那会丢掉角色、项目选择和密钥引用。
- 换团队前先 `teamai status --all` 看一眼有哪些分区。
