---
title: "命令速查"
description: "按「接入 / 日常 / 分发 / 资源 / 诊断」分组，只列最常用的那些。"
---

# 命令速查

## 接入

| 命令 | 用途 |
| --- | --- |
| `teamai init <repo>` | 项目级接入（默认） |
| `teamai init <repo> --scope user` | 整机级接入 |
| `teamai init . --agent claude,codex` | 业务仓库自托管，指定工具 |
| `teamai init --http <url> --token <key>` | 只读接入，不用 Git |
| `teamai init <repo> --provider git` | 用现有 Git 凭据，PR 自己开 |
| `teamai init <repo> --force` | 已初始化时覆盖 |
| `teamai bind-project` | HTTP 接入的工作区绑定到项目 |

## 日常

| 命令 | 用途 |
| --- | --- |
| `teamai pull` | 立即同步 |
| `teamai pull --dry-run` | 预览，不改文件 |
| `teamai pull --force` | 全量重算 |
| `teamai pull --team-ref <ref>` | 固定到团队某个版本 |
| `teamai push` | 推送本地资源（开 PR） |
| `teamai push --skill <path>` | 指定技能 |
| `teamai status` | 本地与仓库的差异 |
| `teamai status --all` | 所有项目分区 |
| `teamai list [type]` | 列资源（skills / rules / docs / env / agents / hooks / mcp / workflows） |
| `teamai list skills --source repo` | 只看仓库里的 |

## 分发治理

| 命令 | 用途 |
| --- | --- |
| `teamai roles list` / `roles set <id>` | 看 / 设角色 |
| `teamai roles add\|update\|remove` | 管理员改 `roles.yaml` |
| `teamai projects list` / `projects set <ids>` | 看 / 设项目 |
| `teamai projects add\|update\|remove` | 管理员改 `projects.yaml` |
| `teamai tags list` / `subscribe` / `unsubscribe` | 标签 |
| `teamai tags add\|remove` | 管理员打标 |

## 资源

| 命令 | 用途 |
| --- | --- |
| `teamai remove <type> <name…>` | 从仓库和所有工具移除 |
| `teamai env list` / `env set <KEY>` | 环境变量与密钥 |
| `teamai env exec -- <cmd>` | 带着团队 env 跑命令 |
| `teamai mcp list` / `inject` / `remove` | MCP server |
| `teamai hooks list` / `inject` / `remove` | 钩子 |
| `teamai models list` / `switch` / `restore` | 模型网关 |
| `teamai packages` | 装 `teamai.yaml` 声明的 npm 包与插件 |
| `teamai skill list` / `show` / `exclude` | 技能查看与个人排除 |

## 上下文与改进（beta）

| 命令 | 用途 |
| --- | --- |
| `teamai recall "查询"` | 搜团队经验 |
| `teamai recall enable` / `disable` / `status` | 开关自动召回 |
| `teamai contribute` | 贡献一份经验 |
| `teamai import --dir .` / `--from-repo <url>` | 导入代码知识 |
| `teamai dashboard` | 本地看板 |
| `teamai session save` / `migrate` / `search` | 会话归档与迁移 |
| `teamai digest` | 团队周报 |
| `teamai workflow start <wf>` | 创建工作流运行 |
| `teamai benchmark run <suite>` | 跑基准套件 |
| `teamai score --session <id> --scorer <name>` | 给会话打分 |

## 诊断与维护

| 命令 | 用途 |
| --- | --- |
| `teamai doctor` | 诊断 |
| `teamai doctor --json` | 机器可读 |
| `teamai doctor --fix` | 清理能安全清理的 |
| `teamai update --check` / `update` | 升级 |
| `teamai uninstall --dry-run` | 预览卸载 |
| `teamai uninstall [--force] [--agent <id>]` | 卸载 |
| `teamai --help` / `teamai <命令> --help` | 查当前版本的真实参数 |

++参数以 `--help` 为准++。上面这张表按 `0.30.0` 整理，beta 命令加得快，
用之前先 `teamai <命令> --help` 对一眼。
