---
title: "把自己的 skill 分享给团队"
description: "从本地工具目录推到团队仓库，中间会开一个 PR；合并后才对别人生效。"
---

# 把自己的 skill 分享给团队

## 什么时候用这篇

你写了个顺手的技能，或者被要求"把这条规矩沉淀下来"。

## 命令

```bash
# 它在你的工具目录里，比如
#   ~/.claude/skills/release-check/SKILL.md
teamai push --skill ~/.claude/skills/release-check
```

不带参数会从本地找到的资源里让你挑：

```bash
teamai push
```

## 流程与边界

1. `push` 补全 `SKILL.md` 缺失的 frontmatter（`name`、`description`）。
2. 推一个 `teamai/push/…` 分支。
3. 在团队仓库开 PR。
4. **评审人合并**之后，同事下一次开会话才拉到。在那之前 `teamai list skills --source repo` 已经能看到它。

## 放哪个目录

| 目的 | 加什么 |
| --- | --- |
| 所有人可用（默认） | 不加参数 |
| 只给某个角色 | `--role frontend` |
| 只给某个项目 | `--project checkout` |

不确定就放共享根。加了命名空间，就要有人维护角色和项目，否则会出现"谁都收不到"。

## 规则、智能体、MCP 也一样

```bash
teamai push --file ~/.claude/rules/api-style.md --path rules/api-style.md
teamai push --role pm
```

## 你应该看到什么

命令结束会打印分支名和 PR 链接；平台上能看到 diff。合并后别人 `pull` 一次就有了。

## 注意

- **不要用 `rm` 删已分发的副本**，`pull` 会装回来；要删就 `teamai remove skills <名字>`。
- 提示 "no new resources detected" 说明本地没变化，不用推。
- 提示"将覆盖队友的改动"时它会停下来，先看清楚那份 diff 再用 `--carried`。
