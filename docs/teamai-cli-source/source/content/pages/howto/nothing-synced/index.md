---
title: "团队资源拉不下来 / 工具里看不到"
description: "按「配置 → 钩子 → 工具目录 → 冲突」四层排查，每层一条命令。"
---

# 团队资源拉不下来 / 工具里看不到

## 先分清是哪一层出了问题

| 现象 | 大概是哪一层 |
| --- | --- |
| `teamai list` 就是空的 | 团队仓库没内容，或你没连上 |
| `list` 有，工具里没有 | 工具根目录不存在，或没选中那个工具 |
| 昨天有，今天没了 | 有人在仓库里删了它，或者你换了团队 |
| 提示 skipped / held | 同名冲突，或两个仓库给了不同内容 |

## 第 1 层：配置与仓库

```bash
teamai doctor
teamai status
teamai config show 2>/dev/null || true   # 不确定就打开 ~/.teamai/ 看
teamai pull --dry-run
```

`pull --dry-run` 只预览不落盘，能立刻看出它认为该做什么。

## 第 2 层：钩子

会话启动时的自动同步靠钩子。它没了，就只有手动 `pull`。

```bash
teamai hooks list
teamai hooks inject --dry-run
teamai hooks inject
```

Windows 上钩子需要额外配置，看 [让钩子在 Windows 上生效](/howto/windows-hooks/)。

## 第 3 层：工具目录

`pull` **不会**凭空创建缺失的工具根目录。如果你 `init` 时没选那个工具，它就不建。

```bash
teamai init --agent claude --force
teamai pull --force
```

工具 id 写小写，例如 `claude`、`codex`、`cursor`、`codebuddy`。

## 第 4 层：冲突与被跳过

`pull` 的输出里出现这些词，含义不一样：

- **Kept**：这个副本你改过，它不再投递，留不留你定。
- **Skipped**：同名技能只送一份，你的角色收到了另一份。
- **Held**：workspace 里两个仓库给了同名但内容不同的东西，它暂缓，等你统一。

## 你应该看到什么

`teamai pull` 的小结里出现 `Synced N skills`，且工具目录里有对应文件。

## 注意

- `teamai pull --force` 会忽略"仓库没变化"，全量对一遍，多数"看不到"的问题它能解决。
- 真的搞不清楚就先 `teamai pull --dry-run`，它不改文件，只说实话。
