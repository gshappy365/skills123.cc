---
title: "doctor 说了什么，怎么修"
description: "诊断输出的常见条目、对应原因，以及哪些能 --fix、哪些必须人处理。"
---

# doctor 说了什么，怎么修

## 先跑它

```bash
teamai doctor
teamai doctor --json | head -40      # 机器可读
```

它会打印运行模式（attended / unattended）及其来源，然后是各分区检查。

## 常见条目对照

| 提示大意 | 原因 | 怎么修 |
| --- | --- | --- |
| 未初始化 / no repo | 还没 `init` | `teamai init <repo>` |
| hook 缺失 | 钩子没注入，或被工具升级冲掉 | `teamai hooks inject` |
| 工具未识别 | 工具装在不常见的位置 | 用 `--agent` 显式指定，或设工具自己的目录变量 |
| token 未设置 | 声明了 secret 但没给值 | `teamai env set <KEY>` |
| 遗留锁文件 | 上次进程被 kill | `teamai doctor --fix` |
| 其他安装 | 机器上有多份全局 teamai | 配置 `updateOtherInstallations` |
| workspace 子项被排除（left out） | 那个仓库用的是别的团队仓库 | 在它里面 `init` 同一个团队，或保持独立 |

## `--fix` 会做什么，不会做什么

会：清理死进程遗留的锁、删除失败的运行分支、按保留策略清理过期残留。

不会：删掉仍被活进程持有的锁、删掉没记录所有者的锁、改你的业务文件。

## 锁的两种错误别混

- **`Cannot acquire lock`**：文件系统问题（权限、磁盘满、父路径是文件）。等别的进程没用，先修文件系统。
- **崩溃后留下的锁**：锁里记了 PID。所有者已死的锁，下一个命令会自动回收，`doctor --fix` 也能清。

## 你应该看到什么

每一行前面是 ✓ 或明确的 ⚠ + 一句修法。它不会只说"出错了"。

## 注意

`doctor` 报告的是它所在 workspace 的情况。换目录再跑一次，可能是另一套配置。
