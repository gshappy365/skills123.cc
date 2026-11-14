---
title: "在 CI 里跑"
description: "静态分析进流水线的三个动作：装对、跑对、把 JSON 留下来。"
---

# 在 CI 里跑

## 最小可用的一条流水线

```
- uses: actions/setup-node@v4
  with: { node-version: '22.23.4' }

- run: sudo apt-get update && sudo apt-get install -y procps   # Linux 必需

- run: npx -y rea-agents@latest analyze-javascript-application ./dist --json > app-graph.json

- run: npx -y rea-agents@latest audit-release-exposure ./dist --fail_on high --json > exposure.json

- uses: actions/upload-artifact@v4
  if: always()
  with: { name: rea-evidence, path: '*.json' }
```

## 三个要点

**一、Node 版本要卡准。** 22.23.4 以下直接不支持。用 `22.23.4` 或更高的 22/24，别写 `22`。

**二、Linux 要 procps。** 缺了 `ps`，Ghidra、JADX、静态 JS 分析会在子进程启动前被拒。

**三、JSON 要留下。** 终端日志会被截断、会过期；JSON 才能事后对比。

## 需要引擎的话

CI 里跑原生分析成本高：

| 方案 | 代价 |
| --- | --- |
| 装 Ghidra + JDK | 镜像大，冷启动慢 |
| 用快照复用 | 第一次贵，之后便宜 |
| 只在需要时跑 | 用路径过滤触发 |

Ghidra 在 Linux 无人值守可以跑 demo 模式；Hopper 在 macOS 需要同一用户会话点掉首次对话框，不适合无人值守。

## 时间预算

按「导入 + 分析」给，不是按「执行一个命令」给。一个 50 MB 的二进制，Ghidra 可能吃掉十几分钟。

```
env:
  REA_GHIDRA_STARTUP_TIMEOUT_MS: '1800000'
```

## 示例仓库

官方仓库里有 `examples/github-actions`，是一个可重复的静态分析例子，可以直接拿去改。

## 下一步

排错看 [没装引擎怎么办](/howto/no-engine/)。
