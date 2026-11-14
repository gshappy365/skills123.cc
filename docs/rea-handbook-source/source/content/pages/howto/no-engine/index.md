---
title: "没装引擎怎么办"
description: "一个引擎都没有时，你依然能做完的六件事，以及哪一类目标必须等引擎。"
---

# 没装引擎怎么办

## 先看你能用什么

```
rea providers --json
```

返回里 `capabilities` 每一项带 `available`。不需要引擎就能用的通常是这几个：

| provider | 能干什么 |
| --- | --- |
| `native-macos` | Mach-O / plist / 签名 / 架构 / 反混淆 Swift 名 |
| `rea-artifact-graph` | 拆归档、container 清单 |
| `rea-dotnet-static` | .NET 程序集与成员 |
| `sqlite` | 读数据库快照 |

## 六件不需要引擎的事

1. 判断一个应用是什么做的（Electron / Tauri / Qt / 原生）；
2. 看前端的模块结构与导出形状；
3. 读 .NET 程序集的类型和成员；
4. 拆 `.asar`、`.zip`、`.pkg`、`app.asar.unpacked`；
5. 读 plist、签名、架构列表；
6. 做发布暴露审计。

## 必须等引擎的

- 反编译（`decompile` / `procedure_pseudo_code`）；
- 原生函数级搜索与调用图；
- 原生二进制里的算法还原。

## 错误长什么样

```
{"error": {"code": "capability_unavailable",
           "details": {"selection_reason": "provider_unavailable",
                       "candidate_ids": ["ghidra", "hopper"]}}}
```

读法：这事需要 provider，但候选的都不可用。修哪一个都行，去 [选引擎](/guide/3-engine/)。

## 临时替代

只看汇编的话，`objdump` / Rizin 这条路不需要装引擎：

```
rea instructions /绝对路径/程序 --json
```
