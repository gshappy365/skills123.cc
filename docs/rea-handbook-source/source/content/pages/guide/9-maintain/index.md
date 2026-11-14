---
title: "更新、排错、卸载"
description: "rea update 更新什么、doctor 怎么分范围查、常见故障怎么定位、卸载会留下什么。"
---

# 更新、排错、卸载

## 更新：三种安装三种办法

| 怎么装的 | 怎么更新 |
| --- | --- |
| `npm i -g` 或 `bun add -g` | `rea update`（`rea --update` 是别名） |
| `npx rea-agents ...` | 重新 `npx rea-agents@latest setup` |
| 源码 checkout | `git pull && npm ci && npm run build:cached` |

`rea update` 只更新「拥有当前 CLI 的那个全局安装」，而且只验证 CLI 版本，不保证可选的 Frida 之类原生依赖也好了。更新完它会打印一条 setup 命令，跑一遍刷新注册和技能，然后重启客户端。

Bun 用户注意：`bun info` 要 1.2.17+，更老的 Bun 会直接报错让你先升 Bun。

## 排错：分范围查，不要全量查

`rea doctor` 不带参数是**大范围审计**，`healthy: false` 很常见，也说明不了什么。按你的任务缩小：

| 你要做的事 | 查什么 |
| --- | --- |
| 静态 JS 分析 | 直接跑一次 `analyze-javascript-application`，能出结果就是好的 |
| 某个引擎 | `rea doctor --provider ghidra --json` |
| 某个客户端注册 | `rea doctor --client codex --json` |
| 技能装没装 | `rea doctor --skill --json` |
| 桌面环境构建 | `rea doctor --provider desktop_build --client claude_code --json` |

限定范围后报告里有 `scope.mode: "explicit"`，`healthy` 只看范围内的检查；其他检查进 `informational_checks`，不参与判定。

## 本机真实报告长什么样

在一台 macOS 14 上跑 `rea doctor --json`：

```
healthy: false
node         ok     22.22.2
host         ok     14.7.3
hopper       ok     /Users/…/Hopper Disassembler.app/Contents/MacOS/hopper
ghidra       false  GHIDRA_INSTALL_DIR is not set
ida          false  IDA MCP registration is not configured
jadx         false  REA_JADX_MCP_JAR 未设置
kuna         false  REA_KUNA_COMMAND 未设置
registration:{20+ 个客户端}  false  config_drift
```

读法：**能用的能力都在**（Node、Hopper、静态解析），缺的是没配的引擎和一堆客户端注册。`config_drift` 的意思是「配置里那条注册和当前版本对不上」，多半是别的工具改过那个文件。它不影响你已经配好的那个客户端。

## 六个高频故障

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 客户端里没有工具 | 没重启 / 注册被覆盖 | 重启；`rea doctor --client <id> --json` |
| `ERR_MODULE_NOT_FOUND` | npx 缓存缺文件 | 见下 |
| Hopper 起不来 | 首次运行对话框没点、自动化权限没给 | 手动开一次 Hopper；系统设置放行 |
| Linux 上引擎全挂 | 缺 procps 的 `ps` | 装 procps |
| 超时 | 大文件 + 默认期限 | `REA_*_STARTUP_TIMEOUT_MS` |
| `cleanup_incomplete` | 资源没收干净 | 看返回里保留的路径，条件好了重试 |

### npx 缺文件的正确修法

`npm cache verify` **不会**修复已解压的 npx 安装。要重装那一个条目：

```
npm config get cache
npm cache npx ls
npm cache npx info <那个 key>
npm cache npx rm <那个 key>
npx --yes rea-agents@<版本> doctor --json
```

==不要==把 `index.cjs` 改名成 `index.mjs`，也不要关掉完整性检查凑合跑。修好之后重启受影响的客户端。

## 卸载

```
rea uninstall                  # 只删 REA 自己的注册和技能
rea uninstall --purge-data     # 再加上缓存和状态
```

| 会被删 | 不会被删 |
| --- | --- |
| REA 写进客户端配置的条目 | Hopper、Node.js |
| 装进技能目录的那一份 | 你导出的证据文件、抓取数据 |
| `--purge-data` 时的 `~/.rea` 缓存 | 其他 MCP 服务器、无关技能 |

符号链接的清理路径会被保留并报告，不会跟随。共享的注册存储（比如 `~/.agents/mcp.json`）如果无法确认所有权，会原样保留。

## 想彻底干净

1. `rea uninstall --purge-data`
2. 手动检查 `~/.claude.json`、`~/.cursor/mcp.json` 等文件里有没有残留 `rea` 条目（local scope 的注册 `uninstall` 不管）
3. 删掉你建的证据目录

## 下一步

回头看看 [How-to](/howto/)，把你手上的活对号入座。
