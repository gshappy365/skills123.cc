---
title: "把工具用对"
description: "工具族的划分、summary/complete 怎么选、分页视图怎么翻、保留引用怎么传。"
---

# 把工具用对

## 别背工具名，记七族

几十个工具硬背没有意义。记住「一次调查会经过哪几族」，需要时再查名字：

| 族 | 什么时候用 |
| --- | --- |
| 目标与会话 | 开始、结束、切换目标、清空 |
| 代码与函数 | 大部分时间在这里：搜、看、追 |
| 比对 | 想回答「改了什么」 |
| 工件检查 | 目标是个容器、镜像、归档 |
| 应用图 | 目标是完整的应用，要模块和边界 |
| 运行时 | 静态看不到，得跑起来抓 |
| 账本与设置 | 收尾、导证据、改超时 |

族名和具体工具在 [工具与命令速查](/reference/commands/)。

## 会话：一个连接一本账

| 工具 | 干什么 | 注意 |
| --- | --- | --- |
| `open_binary` | 打开目标 | 换目标不丢旧记录 |
| `binary_session` | 看当前状态、可用能力、清理是否挂起 | 排错第一站 |
| `close_binary` | 释放引擎和缓存 | 记录**不会**被删 |
| `reset_investigation` | 清空记录和 unknown | 清之前先导出 |
| `open_bundle_resources` | 只读资源根（不解析可执行文件） | 看 `.app` 里的资源用这个 |

==`cleanup_pending` 为 true 但 `open` 已经 false，是正常的==：引擎放掉了，临时资源还在收尾。等条件满足再调一次 `close_binary`。

## summary 还是 complete

| 情况 | 选哪个 |
| --- | --- |
| 目标大（Electron Framework、几十万行的库） | 第一次就 `summary` |
| 要读原文、要自己再算 | `complete` |
| 要喂给另一个工具 | 传保留引用，不要重发大记录 |
| 客户端报了 `resource_constraint` | 改 `summary`，或分页 |

一个具体建议：**大目标第一次调用永远用 `summary`**。这是官方文档里的原话级建议，也是省上下文最有效的一招。

## 分页：`inspect_analysis_view`

摘要记录里有个 `parent_evidence_id`，拿它翻页：

```
{"view": {"kind": "native", "facet": "pseudocode", "offset": 0, "limit": 200}}
```

常见视图：

| 视图 | 看什么 |
| --- | --- |
| `native` | 伪代码、汇编、指令 |
| `inventory` | 产物清单 |
| `capture` | 抓到的运行时数据 |
| `managed-members` | .NET 成员 |
| `feature-trace` | 功能追踪结果 |
| `api-surface` | 接口清单 |

两点要记住：文本页按 **UTF-16 code unit** 计数（不是字符数）；分页==只暴露已经保留的事实，不会重启引擎，也不会因此建立一个「完整发现」==。

## 保留引用怎么传

工具之间传大结果，不要复制粘贴，用引用：

```
{"kind": "retained-evidence", "evidence_id": "ev_..."}
```

或者传文件选择器：

```
{"kind": "evidence-file", "path": "./evidence/app.json"}
```

混用是常见错误：摘要记录本身不能被需要完整档案的工具消费，得传父记录。

## 工具调用也有预算

| 限制 | 默认 | 改法 |
| --- | --- | --- |
| 单个数组/对象元素数 | 1024 | `REA_MCP_MAX_INPUT_ELEMENTS`（要重启） |
| 单次响应接收缓冲 | 10 MiB | `REA_MCP_MAX_RESPONSE_BYTES`（要重启） |
| 输入 schema 详细度 | 紧凑 | `REA_MCP_INPUT_SCHEMA_PROFILE=full` |
| 输出 schema | 完整 | `REA_MCP_OUTPUT_SCHEMA_PROFILE=compact\|off` |
| 工具族 | 全部 | `REA_MCP_TOOL_FAMILIES` |

超了会拿到 `resource_constraint`，且**记录还在会话里**，按 `reported_limits.evidence_reference` 取回来。

## 出错时先读 recovery

| `recovery.kind` | 意思 | 怎么办 |
| --- | --- | --- |
| `inspect_input_contract` | 参数不合 schema | 按 schema 改，**不要原样重试** |
| `inspect_timeout_state` | 超时了，可能有部分证据 | 看部分结果和清理状态，再决定放不放弃 |
| `retry_cleanup` | 清理没完成 | 再调一次不带参数的 `close_binary` |

## 三个高频好习惯

1. **先 summary 后 detail**：永远是先看轮廓。
2. **一次只问一件事**：把「它怎么做的、谁调它、有没有别的入口」拆成三次，比一次问清更准。
3. **每轮结束记 unknown**：下一轮（哪怕换了会话）能接上。

## 下一步

[第 7 步：命令行与管道](/guide/7-cli/)。
