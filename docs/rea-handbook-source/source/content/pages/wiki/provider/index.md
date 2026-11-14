---
title: "引擎（Provider）"
description: "真正干活的那个反汇编器：Hopper、Ghidra、IDA、Kuna，或自带的解析器。"
---

# 引擎（Provider）

## 一句话

REA 自己不反汇编，它调用你已经装好的引擎。

## 打个比方

REA 是包工头，引擎是各个工种的师傅。包工头不砌墙。

## 在 REA 里

`rea providers --json` 列出所有 provider 和可用性。`--provider` 指定用哪个。原生分析需要外部引擎；JavaScript、.NET、容器拆解用自带解析器就够。

## 常见误区

以为「装了 REA 就能反编译」。装 REA 只是有了工具，反编译能力来自引擎。
