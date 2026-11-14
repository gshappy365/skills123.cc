---
title: "运行时捕获"
description: "真的跑起来，抓一次交互。静态看不到的东西只能这么拿，但它有副作用。"
---

# 运行时捕获

## 一句话

用你的权限运行或驱动目标，记录它实际做了什么。

## 打个比方

不是看菜谱，是站到厨房里看厨师怎么做。

## 在 REA 里

`capture_browser_scenario`（网站）、`capture_process_scenario`（进程）、`capture_native_ui_scenario`（桌面 UI）、`inspect_adb_client`（安卓）。抓完可以 `compare_process_captures`、`reconcile_javascript_runtime`。

## 常见误区

以为抓取是无害的。它会发出真实请求、写文件、有时会弹窗。抓第三方生产环境前先想清楚。
