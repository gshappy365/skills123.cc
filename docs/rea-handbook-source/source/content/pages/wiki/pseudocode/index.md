---
title: "伪代码（Pseudocode）"
description: "反编译出来的、接近 C 的中间表示。能读懂逻辑，不等于原始源码。"
---

# 伪代码（Pseudocode）

## 一句话

引擎把汇编翻译成人类可读的形式，变量名、类型、结构都是猜的。

## 打个比方

把一首诗翻译成另一种语言。意思在，韵律和原文的措辞没了。

## 在 REA 里

`procedure_pseudo_code`、`decompile`、`batch_decompile`，以及 `inspect_analysis_view` 的 `native/pseudocode` 视图。

## 常见误区

把伪代码当源码抄。类型宽度、循环边界、副作用顺序都可能被编译器改写；重建必须靠对拍验证。
