---
title: "结果太大怎么办"
description: "上下文被一次工具返回撑爆：summary、分页、保留引用，三招止血。"
---

# 结果太大怎么办

## 症状

- 客户端报 `resource_constraint`；
- 一次工具调用之后，模型开始忘事、答非所问；
- 一个 `.app` 分析完，上下文只剩一半。

## 第一招：第一次就用 summary

```
用 summary 模式打开 <目标>，先给我轮廓，不要全文。
```

`detail: "summary"` 会返回摘要 + 一个 `parent_evidence_id`，完整记录留在会话里。

## 第二招：分页看

```
按 view: native, facet: pseudocode, offset: 0, limit: 200 分页给我这个函数的伪代码。
```

需要什么看什么，不要一次拉全文。

## 第三招：传引用，不传内容

工具之间传大结果用：

```
{"kind": "retained-evidence", "evidence_id": "ev_..."}
```

不要把它复制进 prompt。

## 三个习惯

| 习惯 | 省多少 |
| --- | --- |
| 大目标第一次 summary | 常常是 10 倍以上 |
| 一次只问一个函数 | 稳定 |
| 中间结果落文件（`export_evidence_bundle`），下一轮用文件选择器 | 大量 |

## 已经超了怎么办

1. `reset_investigation` 之前先 `export_evidence_bundle` 存下来；
2. 换新会话，从文件导入需要的部分；
3. 或者直接开新会话，用 `{"kind": "evidence-file", "path": ...}` 引用。

## 预算可以调，但别乱调

```
REA_MCP_MAX_RESPONSE_BYTES   # 默认 10 MiB
REA_MCP_MAX_INPUT_ELEMENTS   # 默认 1024
```

调大只是把问题推给客户端。真正的解法是少拿。
