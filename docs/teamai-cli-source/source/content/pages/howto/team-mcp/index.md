---
title: "给团队挂一个 MCP server"
description: "单文件与目录型两种写法，token 怎么走，以及为什么脚本要用 ${TEAMAI_MCP_DIR}。"
---

# 给团队挂一个 MCP server

## 最简单的：一个远程服务

```yaml
# mcp/mcp.yaml
servers:
  - name: gpu-analysis
    description: GPU 存量与价格查询
    transport: http
    url: https://example.com/api/mcp
    headers:
      Authorization: Bearer ${GPU_ANALYSIS_TOKEN}
    timeout: 600000
```

`${GPU_ANALYSIS_TOKEN}` 在 `env/secrets.yaml` 里声明，值由每个人自己设：

```yaml
# env/secrets.yaml
secrets:
  - key: GPU_ANALYSIS_TOKEN
    description: GPU 查询服务的 token
    url: https://example.com/tokens
```

```bash
teamai env set GPU_ANALYSIS_TOKEN      # 交互输入，值只留在本机
```

## 带脚本的：目录型

```text
mcp/jira-lite/
├─ MCP.yaml
├─ server.py
└─ queries.sql
```

```yaml
# mcp/jira-lite/MCP.yaml
description: 只读的 Jira 查询
transport: stdio
command: uv
args: ["run", "--script", "${TEAMAI_MCP_DIR}/server.py"]
requires: [uv]
```

- 目录型只支持 `stdio`。
- `${TEAMAI_MCP_DIR}` 替换成目录路径，脚本和 `queries.sql` 一起走。
- `requires` 声明 PATH 上需要的运行器，`teamai mcp inject` 会提示缺什么。

依赖的三种稳妥写法：PEP 723 脚本（`uv run --script`）、打包好的 `.mjs`（`node`）、固定版本 runner（`npx -y pkg@1.4.0`）。

## 注入与卸载

```bash
teamai mcp list
teamai mcp inject --dry-run
teamai mcp inject
teamai mcp remove
```

`teamai pull` 时也会同步。要覆盖和用户自有条目冲突的 server，加 `--force`。

## 某个人不想装

```bash
teamai skill exclude add jira-lite
teamai pull
```

排除列表**按名字**生效，不分类型：排掉叫 `jira-lite` 的 MCP，也会排掉同名的 skill。

## 注意

- 密钥只写 `${VAR}`，值永远不进仓库。团队仓库是公开的，别赌。
- Claude Code 不展开 `.mcp.json` 里的 `$CLAUDE_PROJECT_DIR`，所以各工具的 MCP 文件写的是 worktree 绝对路径，每个 worktree 不同。
- 每个人机器上的 path 不同，脚本里不要用绝对路径。
