---
title: "覆盖（Coverage）"
description: "这次查询到底看到了多少。比结论本身更该先看的一个字段。"
---

# 覆盖（Coverage）

## 一句话

`complete` / `partial` / `truncated` / `unknown` / `unavailable`，五个值描述「这次看到多少」。

## 打个比方

手电筒照房间。照到的部分很清楚，没照到的地方不是「没有东西」，是「没照到」。

## 在 REA 里

工具返回的 `coverage` 字段。`partial` 时不能说「没有别的」；`truncated` 时要翻页或缩小范围；`unavailable` 说明这项能力压根没跑。

## 常见误区

把空列表当结论。「没搜到调用者」在 `partial` 下只意味着范围内没有。
