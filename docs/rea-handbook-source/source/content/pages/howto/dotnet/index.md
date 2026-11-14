---
title: "看一个 .NET 程序集"
description: "不用引擎、不用运行：读程序集身份、成员清单，按类型钻进去。"
---

# 看一个 .NET 程序集

## 什么时候用

目标是 `.dll` / `.exe`，加壳不重，你想知道它有哪些类型、哪些方法、部署成什么形式（单文件？AOT？）。

## 照抄这段话

```
检查 <程序集路径>：
1. 它的身份（名字、版本、目标框架）和部署形式；
2. 列出一级类型，按命名空间分组；
3. 我关心 <某个功能>，找出最可能承载它的类型，并列出它的成员。
```

## 命令行等价物

```
rea inspect-managed-artifact /绝对路径/Assembly.dll --json
rea inspect-managed-members /绝对路径/Assembly.dll --json
rea inspect-managed-members /绝对路径/Assembly.dll --type Example.Parser --json
```

## 你会看到什么

| 层次 | 内容 |
| --- | --- |
| 身份 | 程序集名、版本、目标运行时 |
| 部署形式 | 普通 DLL / 单文件 bundle / NativeAOT |
| 类型 | 命名空间 + 类型名 + 基类 |
| 成员 | 方法签名、字段、属性 |

## 判断点

- **单文件 bundle。** 成员能列，但要拆出内部程序集才能逐个看。
- **NativeAOT。** 元数据大部分没了，得走原生分析那一路。
- **混淆过。** 类型名是 `A.B.C`，靠字符串和调用来找。

## 下一步

要比较两个版本，去 [比较两个版本](/howto/compare-versions/)。
