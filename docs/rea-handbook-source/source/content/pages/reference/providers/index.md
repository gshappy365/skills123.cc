---
title: "引擎对照表"
description: "五个引擎 + 几个自带解析器：能力、平台、门槛、适合谁。"
---

# 引擎对照表

## 外部引擎

| | Hopper | Ghidra | IDA | Kuna | objdump / Rizin |
| --- | --- | --- | --- | --- | --- |
| 花钱 | 商业（demo 有限制） | 免费 | 商业 | 自带 | 免费 |
| macOS | ✅ 12+ | ✅ x64/arm64（需原生反编译器） | 你有就行 | 你有就行 | ✅ |
| Linux | ✅ x86_64 | ✅ x64/arm64 | 你有就行 | 你有就行 | ✅ |
| Windows | ❌ | 实验性 | ✅ | — | ✅ |
| 反编译 | ✅ | ✅ | ✅ | ✅ | ❌ 只有汇编 |
| 16 位 DOS | — | ✅ | — | — | 部分 |
| 门槛 | 最低 | 中（JDK + 反编译器） | 高 | 中 | 最低 |
| 大文件速度 | 快 | 慢（导入 + 分析） | 快 | 中 | 快 |

## 选哪个：三条判据

1. **平台**。Windows 上别想 Hopper；arm64 Linux 只能用 Ghidra（或 IDA）。
2. **愿不愿意花钱**。不愿，Ghidra；愿意省事，Hopper。
3. **要不要反编译**。只要看汇编，objdump / Rizin 就够。

## 自带解析器（不用装）

| provider | 干什么 |
| --- | --- |
| `native-macos` | Mach-O、plist、签名、架构、Swift 名反混淆 |
| `rea-artifact-graph` | 归档 / 容器清单、Interface Builder、dylib 解析 |
| `rea-dotnet-static` | .NET 程序集与成员 |
| `sqlite` | 数据库快照 |

这些在 `rea providers --json` 里通常直接 `available: true`。

## 安卓侧

| 工具 | 干什么 | 要求 |
| --- | --- | --- |
| JADX | 反编译 dex → Java | `REA_JADX_MCP_JAR` |
| Apktool | 还原资源与清单 | 本机有 apktool |
| adb | 设备检查与拉取 | 本机有 adb |
| Frida | 运行时插桩 | 版本敏感 |

## 一个现实的组合

- **macOS 用户**：Hopper（省事）+ 自带解析器。要看 16 位 DOS 再加 Ghidra。
- **Linux 用户**：Ghidra + objdump。
- **只想看前端/Electron**：什么都不用装。
- **安卓**：JADX + Apktool（+ 原生库再走 Ghidra）。

验证：

```
rea providers --json
rea doctor --provider <id> --json
```
