---
title: "快照（Snapshot）"
description: "把一次分析的结果存下来复用，第二次就不重新导入和分析了。"
---

# 快照（Snapshot）

## 一句话

分析结果的落盘缓存，按「目标 + 分析配置」的身份区分。

## 打个比方

体检报告的复印件。下次问别的问题，不用重新抽血。

## 在 REA 里

CLI 是 `--snapshot FILE`；Ghidra 有自动检查点 `REA_GHIDRA_CHECKPOINT_DIR`，第二次起用 `-noanalysis` 恢复。

## 常见误区

以为换了引擎还能复用。身份里包含引擎和分析配置，换了就重新来。
