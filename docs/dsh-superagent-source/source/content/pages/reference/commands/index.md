---
title: "命令与配置速查"
description: "一页放齐版本要求、配置路径、启停命令、退出码和面板地址。"
---

# 命令与配置速查

## 环境要求

| 项 | 值 |
| --- | --- |
| Node.js | `^22.19.0 \|\| >=24.0.0` |
| pnpm | `pnpm@11.7.0` |
| git | 2.32+ |
| DSH | `engines.dsh: ^0.2.1-alpha.2` |
| 安装示例中的 DSH | `@deepseek-ai/dsh@0.2.1-rc.3` |
| GitHub CLI | 2.48+ |
| 其他 | tmux、Python 3.8+；可选 `git-lfs`、`lark-cli` |

## 一次性安装

```
npm install -g @deepseek-ai/dsh@0.2.1-rc.3
git clone https://github.com/deepseek-ai/dsh-superagent-prototype dsh-superagent
cd dsh-superagent
pnpm install && pnpm build
dsh superagent --from-default-profile web --dump-config > /dev/null
dsh plugin --profile superagent add "link:$PWD"
pnpm check          # typecheck + test + build
```

## 默认配置

| 项 | 默认值 |
| --- | --- |
| profile | `superagent`（DSH Web profile 的副本） |
| 面板 | `http://127.0.0.1:3082` → 侧栏 **Superagent** |
| 管理 API | `/orchestrator/api/`，需 `x-orchestrator-request: 1`，host 必须是 `127.0.0.1:<port>` / `localhost:<port>` |
| 状态目录 | `<home>/.dsh/state/superagent`（绝对路径） |
| 分支前缀 | `agent/` |
| 接单模式 | `observe` |
| 自动合并 | 关 |
| 配置文件 | `$DSH_HOME/profiles/<profile>/cordis.patch.yml`（模板：`examples/profile.cordis.patch.yml`） |

`cordis.patch.yml` 最小内容：

```yaml
- id: webserver
  config:
    host: 127.0.0.1
    port: 3082
- id: dsh-superagent
  config:
    stateDir: /home/me/.dsh/state/superagent
# - id: dsh-superagent-feishu
#   disabled: false
```

## 启停与体检

```
scripts/dsh-superagent start | status | stop | restart
scripts/dsh-superagent --profile superagent status
scripts/dsh-superagent --profile superagent --respect-stop restart
```

| `status` 退出码 | 含义 |
| --- | --- |
| 0 | 正常 |
| 1 | 没运行 / 双实例 / 无响应 |
| 2 | 某组件报错，重启无用 |
| 3 | 还有安装步骤没做完 |

状态目录里：`orchestrator.sqlite`（唯一数据库）、`lock`、`worker-bin`、`worker-gitconfig`、`work`。启动日志在 `.artifacts/`，保留最近 20 个。

## 升级

```
cp <stateDir>/orchestrator.sqlite <stateDir>/orchestrator.sqlite.bak
git pull && pnpm install && pnpm build
scripts/dsh-superagent restart
```

## 发起工作

```
@<agent login> <目标>。<做完的标准>。<做完给我看什么>。
```

必须发成**新的 Issue 或评论**；编辑已有 Issue 正文补 @ 无效。

## 本站核对依据

官方 `README.md`、`SETUP.md`、`docs/000`–`008`、`package.json`、`examples/profile.cordis.patch.yml`。上游更新后请逐条复核本页。
