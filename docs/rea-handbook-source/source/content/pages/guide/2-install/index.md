---
title: "安装与注册"
description: "setup 的完整行为、它能怎么被脚本化、以及「限定到一个项目」这条容易被忽略的路线。"
---

# 安装与注册

## setup 做四件事

```
npx rea-agents setup
```

1. 探测客户端；
2. 为选中的客户端写 [[MCP 注册|告诉客户端「怎么启动这个服务器」的一条配置]]；
3. 把工作流说明装进技能目录；
4. 检查分析引擎，缺的列出来（不擅自装，除了你点过头的 Hopper）。

## 全部平台无关的参数

| 参数 | 作用 |
| --- | --- |
| `--client <id>`（可重复） | 指定客户端，跳过交互选择 |
| `--all-detected` | 所有检测到的客户端都配 |
| `--skill=false` | 只注册 MCP，不装工作流说明 |
| `--dry-run` | 只出计划，状态 `planned`，退出码 0 |
| `--yes` | 非交互批准，但必须配合明确范围（`--client` 或 `--all-detected`） |
| `--install-hopper` | 同意安装 Hopper（仍在支持的平台上） |
| `--json` | 结构化输出，含精简的 doctor 投影 |
| `--accessible` | 纵向逐项的 yes/no 提示，适合读屏 |

例子：

```
rea setup --client codex --client cursor --skill=false --dry-run
rea setup --yes --all-detected --install-hopper --json
```

<div class="tu-note tu-note--warn">
<strong>交互式 setup 需要三个都连着终端</strong><p>stdin、stdout、stderr 任一被重定向，它就不进交互模式，只出计划。在脚本、CI、或者被 GUI 包裹的终端里跑，记得显式加 <code>--yes</code> 和范围，否则会拿到 <code>needs_confirmation</code>（退出码 1）。</p>
</div>

## 客户端 id 对照

常用的这些，`--client` 后面就填第二列：

| 客户端 | id | 客户端 | id |
| --- | --- | --- | --- |
| Claude Code | `claude_code` | Cursor | `cursor` |
| Claude Desktop | `claude_desktop` | Codex | `codex` |
| Gemini CLI | `gemini_cli` | GitHub Copilot CLI | `copilot_cli` |
| Windsurf | `windsurf` | OpenCode | `opencode` |
| CodeBuddy | `codebuddy` | WorkBuddy | `workbuddy` |
| Qwen Code | `qwen_code` | Kimi Code | `kimi` |
| Trae | `trae` | Qoder | `qoder` |
| Factory Droid | `droid` | DeepSeek Harness | `dsh` |

完整名单（二十多个，还在增加）看官方 installation 文档。`droid`、`dsh`、`kimi`、`qoder`、`trae`、`workbuddy`、`zcode` 需要 6.5.0 以上。

## 技能装到哪

| 情况 | 目标目录 |
| --- | --- |
| 选了具体客户端 | 那个客户端的个人技能目录 |
| 只装技能、没选客户端 | `~/.agents/skills` |
| 混合选择 | 每个不同目标各装一份 |

技能目录如果是符号链接会被拒绝（和卸载时的所有权规则一致）。不想纠结就 `--skill=false`。

## 插件方式：另一种装法

有些客户端有自己的插件市场，装插件等于「注册 + 技能」一起办。读官方 installation 文档里的 marketplace 一节，按你用的客户端选一条；不要和 setup 对同一个客户端都做一遍，会出现两份注册。

只想装技能：

```
npx skills add morluto/rea --skill reverse-engineer-anything
```

## 手动注册（客户端不在名单里）

任何支持本地 stdio MCP 的客户端都能手动加。要点只有三个：

```
command: node（或绝对路径的 node）
args:    /绝对路径/rea/scripts/rea.mjs  mcp
env:     HOPPER_LAUNCHER_PATH=/绝对路径/Hopper（可选）
```

`rea mcp add --agent <id> --command '<启动命令>' --json` 可以帮你写进已知客户端的配置。

## 限定到一个项目

默认 setup 是**用户级**的：每个项目都能用。想只在一个项目里出现，两条路：

**路线 A：独立 profile。** 让 setup 认一个独立的配置目录：

```
CLAUDE_CONFIG_DIR=~/.claude-rea npx rea-agents setup --client claude_code
CLAUDE_CONFIG_DIR=~/.claude-rea claude
```

之后所有检查、更新、卸载都要带同一个前缀。

**路线 B：项目级 local scope。**

```
claude mcp add --scope local rea -- "/绝对路径/node" "/绝对路径/rea/scripts/rea.mjs" mcp
```

注意三点：local scope 存在 `~/.claude.json` 里按目录分节、其他项目读不到；这条路线**不装技能**；`rea doctor` 和 `rea uninstall` 只读用户级条目，看不到它。

<div class="tu-note tu-note--warn">
<strong>别用 <code>--scope project</code></strong><p>它会把条目写进仓库里的 <code>.mcp.json</code>，这个文件很容易被提交、被复制给别人，等于把你的本机路径发出去。</p>
</div>

这两条路线都只控制「哪些会话能发现 REA」，**不是安全边界**：同一个系统用户下的程序照样能跑 `rea`、能读别的输出。要真隔离，用独立的系统账号或容器。

## 装完必须重启

配置是启动时读的。重启之后可以这样验证：

```
rea doctor --client claude_code --json
rea doctor --skill --json
```

限定范围时报告里会出现 `scope.mode: "explicit"`，`healthy` 只由范围内的检查决定，其他检查降为参考信息。

## 不对怎么办

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 计划里没有你的客户端 | 没检测到 | 用 `--client <id>` 显式指定 |
| `needs_confirmation` | 非交互环境里没批准 | 加 `--yes` 和明确范围 |
| `conflict` | 批准后文件被改 | 重新跑，重新审阅 |
| 技能没装上 | 目录是符号链接 | 换回普通目录，或 `--skill=false` |
| 注册了但工具不出现 | 没重启 / 客户端读的是另一个配置 | 重启，确认 `CLAUDE_CONFIG_DIR` 这类变量一致 |

## 下一步

[第 3 步：选一个分析引擎](/guide/3-engine/)。
