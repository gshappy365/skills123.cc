---
title: "比较两个版本"
description: "「这次更新改了什么」：产物比对、函数匹配、导出形状比对，三种粒度。"
---

# 比较两个版本

## 三种粒度，先选一种

| 你想知道 | 用什么 | 粒度 |
| --- | --- | --- |
| 多了/少了哪些文件 | `compare_artifacts` | 产物 |
| 哪些函数变了 | `match_native_functions` / `compare_functions` | 函数 |
| 接口/导出变了没 | `compare_javascript_export_shapes` | 形状 |
| 整体行为变了吗 | `compare_application_versions` / `find_changed_behavior` | 行为 |

## 照抄这段话

```
比较 <旧版本> 和 <新版本>：
1. 先做产物级比对，列出新增/删除/改动的文件；
2. 在 <某个模块> 上做函数级匹配，列出新增、删除、改签名的函数；
3. 只把「可能影响行为」的改动挑出来，其余归到「结构性变化」。
最后告诉我：这次更新像是在修 bug、加功能，还是只改了资源。
```

## 你会看到什么

- 一张差异表，带匹配依据（哈希、签名、调用图相似度）。
- 明确标出「匹配不上」的部分——那通常是真正变化最大的地方。

## 判断点

- **函数匹配是启发式的。** 匹配不上 ≠ 新增，可能是重排或内联。
- **改资源不算改行为。** 图片、文案变了，逻辑可能一模一样。
- **版本号变了但代码没变**：可能是重新打包。

## 命令行做法

```
rea compare old.json new.json --json
rea compare-artifacts '{"left":{"kind":"evidence-file","path":"old.json"},"right":{"kind":"evidence-file","path":"new.json"}}' --json
```

## 下一步

如果差异落在发布配置上，去看 [发布暴露审计](/howto/release-exposure/)。
