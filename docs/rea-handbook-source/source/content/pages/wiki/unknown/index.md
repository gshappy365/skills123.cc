---
title: "未知项（Unknown）"
description: "明确记录「这里我没查清」，带严重程度和下一步怎么试。"
---

# 未知项（Unknown）

## 一句话

一个被显式记下来的问题，而不是一个被忘掉的缺口。

## 打个比方

病历上的「待查」。写下来，下次接着查；不写，下次重新猜。

## 在 REA 里

`list_unknowns` / `record_unknown` / `update_unknown` / `unknown_verify`。字段有 `question`、`severity`、`probes`、`status`、`resolution`。修订有版本，可以追「什么时候从不知道变成知道」。

## 常见误区

把 unknown 当成失败的证据。恰恰相反——一份有五条真实 unknown 的报告，比一份「全查清了」的可信得多。
