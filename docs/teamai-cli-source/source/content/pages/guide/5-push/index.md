---
title: "把资源分享给团队"
description: "从本地写一个 skill 到同事收到它，中间经历什么，以及命名空间怎么选。"
---

# 把资源分享给团队

## 一条最小路径

你在本地写了个好用的 skill，想让同事也用。

```bash
# 1. 它本来就在你的工具目录里
~/.claude/skills/release-check/SKILL.md

# 2. 推上去
teamai push --skill ~/.claude/skills/release-check

# 3. 它会：补全 frontmatter → 推一个分支 → 在团队仓库开 PR
```

4. 团队仓库的评审人合并这个 PR。
5. 同事下一次开会话就自动拉到了。合并之前，`teamai list skills --source repo` 其实已经能看到它。

`push` 不带参数时，会从它在你的 AI 工具里找到的资源里让你挑。

## push 会顺手做三件事

- **补 frontmatter。** 没有 `name` / `description` 的 `SKILL.md`，它会补上——否则这个技能在工具里没名字、没描述，等于不存在。
- **只发有变化的。** 没有新内容时它会直接说 `no new resources detected`。
- **更新已有的 PR。** 同一个资源再推一次，改的是原来那个 PR，不会撒一地。

## 选目录：三种放置

| 参数 | 放到哪 | 谁收到 |
| --- | --- | --- |
| 不写 | 团队共享根目录 | 所有人 |
| `--role <ns>` | `skills/<ns>/…` | 设了该角色的成员 |
| `--project <id>` | 该项目的命名空间 | 激活了该项目的成员 |
| `--shared true` | 强制放共享根（不能和上面两个同用） | 所有人 |

不确定就放共享根。**加了命名空间就等于开始做分发治理**，得配合 [角色与项目](/guide/6-scope/) 才完整。

## 推一个文件，不是推一个技能

有时候你只想把某个配置文件放进仓库：

```bash
teamai push --file ./ci/template.yml --path rules/ci/template.md
```

逐字节推送，不做任何转换。

## 删除已推送的资源

```bash
teamai remove skills release-check
teamai remove rules ci-style
```

它会同时从团队仓库和所有本地 AI 工具里删掉。==别用 `rm` 手动删本地副本==——那样下一次 `pull` 会把它又装回来。

## 一条团队约定（建议写进仓库）

```text
一个 PR 只改一类资源；改 skill 的 PR 不夹带 rules。
新增资源在 PR 描述里写清「什么时候用」，方便别人判断要不要装。
```

这不是工具强制的，但能省掉大量"这个 skill 干嘛的"追问。

## 你应该看到什么

`push` 结束会打印分支名和 PR 链接。平台上能看到改动预览，评审人合完，别人 `pull` 一次就有了。

## 不对怎么办

- **`no new resources detected`**：本地没有新东西，或者你改的是落地副本而不是源。改完记得保存。
- **提示"将覆盖队友的改动"**：说明有人在你之后改过同一个文件。它会停下来并打印一个值，确认要看那份 diff 再用 `--carried <值>`。
- **没有 PR 权限**：`--provider git` 模式下它只推分支，PR 要你自己去网页上开。
- **同一分支推了两次**：会更新原 PR，不会开第二个。

## 下一步

[角色、项目、标签：谁收到什么](/guide/6-scope/)。
