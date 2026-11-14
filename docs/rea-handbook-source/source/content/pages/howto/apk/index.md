---
title: "看一个安卓 APK"
description: "清单、资源、界面文案、代码四条线；哪些不用真机，哪些必须真机。"
---

# 看一个安卓 APK

## 什么时候用

你有一个 `.apk` / `.xapk`，想知道它的界面结构、权限、用到的服务，或者某个界面是怎么拼出来的。

## 照抄这段话

```
分析 <apk 路径>：
1. 包名、版本、权限、声明的组件（activity/service/receiver/provider）；
2. 资源里有没有可疑的硬编码地址或密钥；
3. 按界面文案找 <某个功能> 落在哪个 activity；
4. 告诉我哪些结论需要真机验证。
先不要脱壳，也不要跑它。
```

## 不需要真机能拿到什么

| 内容 | 怎么拿 |
| --- | --- |
| 清单 | `inspect_artifact` / Apktool 解出来的 `AndroidManifest.xml` |
| 资源 | Apktool 还原的 `res/` |
| 代码结构 | JADX（要 `REA_JADX_MCP_JAR`） |
| 原生库 | 解出来的 `lib/<abi>/*.so`，再走原生分析 |

## 需要真机 / 模拟器的

- 运行时才决定的逻辑（动态加载的 dex、服务端下发的配置）；
- 加固 / 脱壳后的真实代码；
- 真实网络请求与证书固定行为。

工具：`inspect_adb_client`、`inspect_apktool_client`、`capture_process_scenario`。

## 判断点

- **有没有 `lib/` 目录。** 有 `.so`，核心逻辑可能在原生层。
- **Flutter / RN / Unity。** 目录结构会露馅，纯 Java 逆向收益很低。
- **加固壳。** `assets/` 里通常有明显特征，先判断值不值得继续。

## 下一步

原生库那部分，看 [定位一个功能](/howto/native-feature/)。
