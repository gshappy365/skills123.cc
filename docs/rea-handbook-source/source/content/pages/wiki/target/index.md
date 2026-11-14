---
title: "目标（Target）"
description: "被分析的那个东西：一个可执行文件、一个 .app、一个 APK、一个目录、一个网站。"
---

# 目标（Target）

## 一句话

用 `open_binary` 选中的分析对象，有生命周期：打开、使用、关闭。

## 打个比方

把一份样本放到实验台上。放上去、看、收起来。

## 在 REA 里

`open_binary` 打开，`binary_session` 看状态，`close_binary` 释放引擎和缓存。还有 `open_bundle_resources` 只读资源根，不解析可执行文件。

## 常见误区

以为 `close_binary` 会删证据。不会，只释放引擎和回放缓存。
