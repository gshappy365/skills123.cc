---
title: "init：管理员建团队 / 成员加入"
description: "同一个命令的四种场景：建团队、加入、业务仓库自托管、只读接入，以及它会动哪些文件。"
---

# init：管理员建团队 / 成员加入

## 四种场景，一个命令

| 场景 | 命令 | 结果 |
| --- | --- | --- |
| 管理员从零搭建 | `teamai init <repo>` | 在本项目建好配置，收一次资源，之后你负责 push |
| 成员加入 | `teamai init <repo>` 或加 `--scope user` | 只收，不推；想分享再 push |
| 业务仓库自己当团队仓库 | `teamai init . --agent claude,codebuddy` | 资源写进仓库的 `.teamai/` |
| 只读接入，不碰 Git | `teamai init --http <地址> --token <key>` | 只需要一个 key |

## 管理员这一路

1. 建好空仓库，给同事分支写权限，主干开保护。
2. 在你要干活的项目里：

```bash
cd /path/to/my-workspace
teamai init https://github.com/your-org/your-team-teamai
```

3. 先放一个文件进去，免得第一次 `pull` 是空的：

```bash
mkdir -p ~/.claude/skills/team-style
cat > ~/.claude/skills/team-style/SKILL.md << 'EOF'
---
name: team-style
description: 团队代码风格与提交约定
---
# 团队风格
1. 提交前跑 lint 与测试
2. 一次提交只做一件事
EOF

teamai push
```

4. 去平台上合并它开出的 PR。合并之后，所有人下一次开会话就都有了。

## 成员这一路

```bash
cd /path/to/my-workspace
teamai init https://github.com/your-org/your-team-teamai
```

想整台机器都用：

```bash
teamai init https://github.com/your-org/your-team-teamai --scope user
```

==在 Git 仓库里，init 会用仓库根目录==，即使你在子目录执行。普通子文件夹不能单独配置，
`--force` 也覆盖不了父配置。嵌套仓库和 linked worktree 各自用各自的根。

## 常用开关

| 开关 | 用途 |
| --- | --- |
| `--scope user` | 装到 `~/`，所有项目可见 |
| `--agent <ids>` | 只给指定工具装（`claude`、`codex`、`cursor`、`codebuddy`…） |
| `--provider git` | 用现有 Git 凭据，不配平台 token（PR 自己开） |
| `--role <id>` | 非交互指定主角色 |
| `--project <ids>` | 激活一个或多个项目，`all` 表示全部 |
| `--force` | 已初始化时直接覆盖，跳过确认 |
| `--inherit-user-scope` | 项目级安装同时继承整机级的安全资源 |

## init 会动哪些文件

- 团队仓库的 `teamai.yaml`（管理员第一次 init 时写入）
- 本机 `~/.teamai/` 下的配置、仓库克隆、projects 分区
- 各 AI 工具目录里的 hooks 配置（SessionStart 等）
- 团队资源的落地副本（skills / rules / agents / mcp / env 注入）

++它不会复制团队的 skills 到你的项目里当源码。++ 那些是"投影"，被 `.git/info/exclude` 挡在版本控制之外（可以开）。

## 你应该看到什么

`teamai doctor` 每行通过；`teamai status` 是空的；`teamai list` 能列出团队资源。

## 不对怎么办

- **提示"已初始化"**：交互模式输 `y`，或者用 `--force`。
- **成员注册失败 / `teamai-reports` 分支被占用**：本地初始化仍然会完成。修好原因后再跑一次同样的命令即可。
- **`Cannot acquire lock`**：不是等别的进程，而是文件系统问题（权限、磁盘满、父路径是文件）。先修那个。
- **没生成 `.claude/` 目录**：非交互环境下没带 `--agent`，它不会猜。补 `teamai init --agent claude --force`。

## 下一步

[ pull 之后，文件落在哪 ](/guide/4-pull/)。
