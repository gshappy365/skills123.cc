---
title: "选一个分析引擎"
description: "Hopper、Ghidra、IDA、Kuna、objdump、Rizin 怎么选，各自的门槛和验证命令。"
---

# 选一个分析引擎

## 先判断：你真的需要引擎吗

| 你要分析的东西 | 需要引擎吗 |
| --- | --- |
| Electron 应用、打包过的前端 JS | 不需要 |
| .NET 程序集（`.dll` / `.exe`） | 不需要 |
| APK 的资源和清单 | 不需要（Apktool） |
| 网站的运行时行为 | 不需要（浏览器抓取） |
| 原生二进制（Mach-O / ELF / PE）的功能与算法 | **需要** |
| 固件里的裸机代码 | 需要（Ghidra 为主） |

不需要的那几行，先跑起来再说。引擎是最容易让人半途放弃的一步。

## 五个选项

| 引擎 | 平台 | 花钱 | 门槛 | 适合 |
| --- | --- | --- | --- | --- |
| **Hopper** | macOS 12+、Linux x86_64 | 商业软件，有 demo | 最低：装完就能用 | macOS 上想马上开始 |
| **Ghidra** | Linux/macOS x64+arm64、Windows 实验性 | 免费 | 中：要 JDK + 对应架构原生反编译器 | 不想花钱、跨平台、要 16 位 DOS |
| **IDA** | 你有 IDA 的平台上 | 商业 | 高：要自己的 IDA + 官方 MCP 桥 | 已经有 IDA 授权 |
| **Kuna** | 你自己准备的平台 | 自带 | 中：要指定可执行文件路径，版本校验 | 想换一个反编译器 |
| **objdump / Rizin** | 跨平台 | 免费 | 低：系统里有就行 | 离线、轻量、只看汇编 |

## Hopper

REA 会复用你已经装好的 Hopper，不会覆盖它。

装：`rea setup`（交互里选装）或 `rea setup --yes --install-hopper`。macOS 上它下载官方 DMG、校验、装到 `~/Applications`，然后用你的许可或 demo 模式跑。

路径找不到时手动指：

```
export HOPPER_LAUNCHER_PATH=/绝对路径/Hopper
rea doctor --provider hopper --json
```

大文件启动慢，放宽启动期限：

```
export REA_HOPPER_STARTUP_TIMEOUT_MS=300000
```

## Ghidra

三个条件，缺一不可：

1. **Ghidra 12.1 或更高**（12.x 系列）。
2. **对应版本的 JDK**：12.1 要 21+，12.2 要 25+。64 位。
3. **主机架构的原生反编译器**在 `Ghidra/Features/Decompiler/os/<平台>/` 下。

```
export GHIDRA_INSTALL_DIR=/绝对路径/ghidra_12.1.4_PUBLIC
export JAVA_HOME=/绝对路径/jdk-21        # java 在 PATH 上时可不设
rea doctor --json
```

arm64 的 mac 常常缺 `mac_arm_64` 那一份，需要自己编：

```
cd "$GHIDRA_INSTALL_DIR/Ghidra/Features/Decompiler/src/decompile/cpp"
make ghidra_opt ARCH_TYPE="-arch arm64" OSDIR=mac_arm_64
install -m 755 ghidra_opt "$GHIDRA_INSTALL_DIR/Ghidra/Features/Decompiler/os/mac_arm_64/decompile"
```

Ghidra 默认启动期限 330 秒（导入 + 分析 + 桥接 + 就绪）。大二进制放宽：

```
REA_GHIDRA_STARTUP_TIMEOUT_MS=1800000 rea analyze /绝对路径/程序 --provider ghidra --json
```

还有两个省时间的开关：自动检查点（`REA_GHIDRA_CHECKPOINT_DIR`，第二次起跳过分析），和复用你已有的 Ghidra 项目（`REA_GHIDRA_PROJECT_PATH` + `REA_GHIDRA_PROGRAM_NAME`，只读）。

## IDA 和 Kuna

| | IDA | Kuna |
| --- | --- | --- |
| 配置 | `REA_IDA_MCP_CONFIG` 指向上游 IDA MCP 注册 JSON | `REA_KUNA_COMMAND` 指向 kuna 可执行文件 |
| REA 会不会帮你装 | 不会 | 不会 |
| 验证 | `rea doctor --provider ida --json` | `rea doctor --provider kuna --json` |

这两条都是「你已经有了才用」。

## objdump / Rizin

不装引擎也能看汇编，代价是只有汇编、没有反编译。

```
rea inspect_with_objdump ...    # MCP 工具
rea instructions ...            # CLI
rea debug-with-rizin ...
```

适合：确认一段字节是不是某条指令、看一个函数有多大、在没有图形界面的机器上做初筛。

## 多个引擎都有时怎么选

工具会让你选，或者用 `provider_id` 指定。选择时看两个信号：

- `capability_unavailable` + `details.selection_reason: "ambiguous"`：都能干，得你从 `candidate_ids` 里挑一个。
- `provider_unavailable`：那个引擎本身有问题，换一个或者修它。

## 验证清单

```
rea providers --json          # 有哪些、各自可用不可用
rea doctor --provider ghidra --json
rea doctor --provider hopper --json
```

本机实测的输出长这样（截选）：

```
hopper   ok    /Users/…/Hopper Disassembler.app/Contents/MacOS/hopper
ghidra   false GHIDRA_INSTALL_DIR is not set
jadx     false REA_JADX_MCP_JAR 未设置
kuna     false REA_KUNA_COMMAND 未设置
```

`rea providers --json` 里还会告诉你哪些**不需要引擎**的 provider 是可用的——比如 `native-macos`、`rea-artifact-graph`、`rea-dotnet-static`。有这些就能干不少事。

## 不对怎么办

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| `incompatible_host_version` | 系统版本低于引擎要求 | 换引擎或升级系统 |
| Ghidra 一直 `starting` | 大文件 + 默认 330 秒不够 | 放宽 `REA_GHIDRA_STARTUP_TIMEOUT_MS` |
| `decompile` 超时 | 单个函数太大 | 设 `REA_GHIDRA_DECOMPILE_TIMEOUT_SECONDS` |
| Hopper 卡在 demo 对话框 | 首次运行没点掉 | 同一会话里手动打开 Hopper 点一次 |
| 引擎可用但工具说没有 | 注册里没带环境变量 | `rea setup --client <id> --dry-run` 看计划 |

## 下一步

[第 4 步：完整走一个案子](/guide/4-first-case/)。
