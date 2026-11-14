---
title: "引擎超时怎么办"
description: "分清楚是启动超时、分析超时还是反编译超时，三种改法不一样。"
---

# 引擎超时怎么办

## 先分清是哪一种

| 现象 | 阶段 | 改哪个 |
| --- | --- | --- |
| 一直 `starting`，最后失败 | 引擎启动 + 导入 | `REA_*_STARTUP_TIMEOUT_MS` |
| 单个函数反编译很久 | 反编译 | `REA_GHIDRA_DECOMPILE_TIMEOUT_SECONDS` |
| 整个工具调用超时但引擎还活着 | 传输 / 客户端 | 分页、摘要、拆任务 |

## 三个可调项

```
REA_GHIDRA_STARTUP_TIMEOUT_MS=1800000      # 默认 330000
REA_HOPPER_STARTUP_TIMEOUT_MS=300000       # 默认 120000
REA_GHIDRA_DECOMPILE_TIMEOUT_SECONDS=600   # 默认不限制
```

MCP 里也能改：`update_analysis_settings` 的 `ghidra.startup_timeout_ms`、`hopper.startup_timeout_ms`。

<div class="tu-note tu-note--warn">
<strong>这些是启动期读的</strong><p>环境变量要在启动 MCP 服务器之前生效，改完要重启客户端。用 <code>update_analysis_settings</code> 改的不受影响。</p>
</div>

## 比调超时更有效的三招

1. **复用到分析结果。** Ghidra 的自动检查点（`REA_GHIDRA_CHECKPOINT_DIR`）第二次跳过导入分析；CLI 用 `--snapshot`。
2. **缩小目标。** 不要一次分析整个 `.app`，先 `open_bundle_resources` 看结构，再挑主二进制。
3. **换引擎。** Hopper 打开大文件通常比 Ghidra 快。

## 超时之后

工具会返回 `recovery.kind: "inspect_timeout_state"`。别急着重试：先看有没有部分证据，以及清理状态（`binary_session` 里的 `cleanup_pending`）。
