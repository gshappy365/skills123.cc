---
title: "pull 之后，文件落在哪"
description: "每类资源在仓库里长什么样、在你机器上变成什么，以及 pull 什么时候会「保留你的改动」。"
---

# pull 之后，文件落在哪

## 落点总表

| 资源 | 团队仓库 | 你机器上 |
| --- | --- | --- |
| 技能 | `skills/<名字>/SKILL.md` | 各工具 `skills/<名字>/SKILL.md` |
| 规则 | `rules/<名字>.md` | 各工具 `rules/<名字>.md` |
| 目录型规则 | `rules/<名字>/RULE.md` + 附件 | `.teamai/delivered/rules/<名字>/`（或 `~/.teamai/rules/`） |
| 智能体 | `agents/<名字>.yaml` | 各工具格式：`.md` / `.toml` / `.agent.md` / `.json` |
| 钩子 | `hooks/hooks.yaml` | 写进工具 hook 配置，脚本落 `~/.teamai/hooks/<id>.<ver>/` |
| MCP | `mcp/mcp.yaml` | 写进工具 MCP 配置，目录落 `.teamai/delivered/mcp/<名字>.<ver>/` |
| 环境变量 | `env/env.yaml` | shell 启动文件里注入，`cd` 到目录自动切换 |
| 模型 | `models/models.yaml` | 只有 `teamai models switch` 之后才改 agent |
| 文档 | `docs/` | 随 pull 同步到成员仓库 |

==同一个仓库，不同工具拿到不同格式。== 你不用管，`pull` 负责翻译。

## 自动同步是怎么来的

`init` 会给每个检测到的工具装一个 `SessionStart` 钩子。你打开 AI 工具、开始一次会话，钩子就触发一次 `pull`。

- Git 团队：60 秒内复用刚刷新过的仓库，连开几个会话不会重复拉。
- 并发启动：会排队等同一个安装范围的同步锁，再从已经刷新的克隆检查落地。
- 失败了不算刷新：下一次启动会重试。

想立刻同步，或者工具不支持钩子：

```bash
teamai pull
```

## pull 的三种脾气

1. **你改过的副本，它不覆盖。** 会明确告诉你「这个副本你改过，teamai 不再投递，留着还是删掉你自己定」。
2. **同名冲突，它两边都不投。** 比如 `skills/greet.md` 和 `skills/greet/` 同时存在，直接报错而不是猜。
3. **`--force` 才全量重算。** 仓库没变化时它会跳过，强制一次才从头对一遍。

## 手动 pull 的三个用法

```bash
teamai pull --dry-run     # 只预览，不动文件
teamai pull --force       # 忽略"仓库没变化"，全量同步
teamai pull --silent      # 给钩子用的静默模式
```

还有一条容易被忽略的：**把 workspace 固定到团队某个版本**。

```bash
teamai pull --team-ref v2.3.0     # 试团队的新版本
teamai pull --team-ref main       # 解除固定
```

固定期间 `push` 不会发东西，适合"先试试这个分支能不能用"。

## 你应该看到什么

`pull` 结束会打印一份小结：新增几个 skill、更新几个、保留了哪些你改过的、删掉了哪些不再投递的。
认真看"保留"和"删除"这两行，其他都是好消息。

## 不对怎么办

- **拉了但工具里看不到**：工具根目录不存在。`teamai pull` 不会主动创建缺失的工具目录，用 `init --agent <id>` 补。
- **Codex 的技能跑到 `.agents/skills` 了**：正常。Codex 两个目录都读，teamai 把同一团队的技能放一处，好让技能之间能互相引用。
- **rules 目录型资源找不到附件**：用 `${TEAMAI_RULE_DIR}` 引用，pull 时会替换成真实路径。

## 下一步

[把资源分享给团队](/guide/5-push/)。
