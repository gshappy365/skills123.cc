---
title: "环境准备"
description: "Node 版本、平台差异、Linux 的 ps、磁盘与权限，以及哪些坑是环境造成的而不是 REA 坏了。"
---

# 环境准备

## Node.js：版本是硬门槛

| 要求 | 说明 |
| --- | --- |
| 22.x | ≥ 22.23.4 |
| 24.x | ≥ 24.22.1 |
| 26.x | ≥ 26.12.1 |

低于这些直接不支持，不是「可能有问题」。仓库里有 `.nvmrc`，从源码跑时按它的版本。

```
node -v
```

<div class="tu-note tu-note--tip">
<strong>为什么卡这么细</strong><p>它用了较新的 Node 内置能力（原生 test runner、较新的模块解析）。22.0 和 22.23 之间就有差异，所以不要用「22 就行」这种判断。</p>
</div>

## 平台：能跑，但能力不一样

| 平台 | 原生分析 | 说明 |
| --- | --- | --- |
| macOS 12+ | Hopper / Ghidra / IDA / Kuna | Hopper 最省事；arm64 的 Ghidra 需要自己编原生反编译器 |
| Linux x86_64 | Hopper / Ghidra / IDA / Kuna | Hopper 官方包只给 x86_64；其他架构走 Ghidra |
| Linux arm64 | Ghidra（要 arm64 反编译器） | Hopper 官方包不支持 |
| Windows | Ghidra（实验性）/ IDA | Hopper 在 Windows 上不可用；Ghidra 的 Windows 支持标着实验性 |

## Linux 特有的一个前置

Ghidra、JADX、固件工具、静态 JS 分析，都要用一个**procps 兼容的 `ps`** 来做进程归属检查。

```
ps -o pid= -p $$
```

报错或者没有输出，就装 `procps`（Debian/Ubuntu）或 `procps-ng`（Fedora/RHEL）。缺了它的表现不是「REA 坏了」，而是子进程在启动前就被拒，错误码可能是 `capability_unavailable`、`provider_unavailable` 或 `execution_failure`，取决于从哪个入口进来。

## 磁盘和内存

| 目标 | 大概要多少 |
| --- | --- |
| 一个 20 MB 的 Electron 应用（静态） | 几百 MB 临时空间 |
| 一个 50 MB 的原生二进制（Ghidra） | 2–4 GB，导入后分析还要时间 |
| 一批固件镜像 | 按解出来的体积算，可能翻几倍 |

临时目录和 `/tmp` 不要放在很小的分区上。Ghidra 每个会话用独立临时项目，中断了不会自动清。

## 权限：macOS 的两个系统弹窗

- **自动化权限。**REA 要驱动 Hopper，会触发「想控制 Hopper」的授权。去「系统设置 → 隐私与安全性 → 自动化」里允许。
- **首次运行对话框。**Hopper 第一次启动会让你选 demo 模式或者激活许可。这个要在**同一个用户会话**里点掉，否则无人值守任务会一直卡在等它。

## 客户端这边

| 要求 | 说明 |
| --- | --- |
| 支持 MCP | 二十多个已支持，见 [第 2 步](/guide/2-install/) |
| 能重启 | 注册在启动时读 |
| 上下文够大 | 大目标的工具返回很占地方，见 [结果太大](/howto/context-bloat/) |

## 一次自查，三十秒

```
node -v
npm -v
rea --version --json      # 或者 npx rea-agents --version --json
rea doctor --json | head -40
```

`--version --json` 会顺带告诉你运行时和平台信息，而且它不会去初始化任何引擎，很快。

## 不对怎么办

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| `rea: command not found` | 只用了 npx，没全局装 | 用 `npx rea-agents ...`，或者 `npm i -g rea-agents` |
| `--version` 就很慢 | PATH 上有奇怪的包装脚本 | `which rea` 看指向哪里 |
| doctor 里 `host` 一项失败 | 系统版本过低或识别不出 | 先确认平台在支持列表里 |
| Linux 上所有引擎都启动失败 | 缺 `ps` | 装 procps |
| macOS 上 Hopper 起不来 | 自动化权限没给 | 系统设置里放行 |

## 下一步

[第 2 步：安装与注册](/guide/2-install/)。
