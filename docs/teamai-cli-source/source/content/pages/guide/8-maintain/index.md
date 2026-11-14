---
title: "诊断、升级、换团队、卸载"
description: "出问题先 doctor，升级不用重装，换团队要 force，卸载能预览。四条命令覆盖后半程。"
---

# 诊断、升级、换团队、卸载

## 出问题先做这一步

```bash
teamai doctor
```

它会点名：钩子缺了、工具没识别到、token 没设、配置在哪、有没有遗留锁文件、run 模式是什么。
`--json` 给机器看，`--fix` 清理能安全清理的东西（已死进程的锁、失败的运行分支、过期残留）。

++`doctor --fix` 只删确定没人用的东西++：仍被活进程持有的锁、没记录所有者的锁，它不动。

## 升级

```bash
teamai update --check
teamai update
```

升级不需要重新 `init`。多份全局安装（比如 nvm 下有好几个 Node）可以在配置里打开
`updateOtherInstallations: true` 一起更新。

## 换团队

用新仓库 `init` 并加 `--force`，再 `pull` 一次：

```bash
teamai init https://github.com/your-org/platform-team --agent claude,codex --force
teamai pull
```

这次 pull 会从每个工具里删掉**旧团队发的、你没改过的**技能和规则。你改过的副本会留下，并明确指出来。

Hermes 和 OpenClaw 是例外：它们全机共用一个技能目录，旧团队的技能会留在那儿，需要你自己确认后删除。

## 卸载

```bash
teamai uninstall --dry-run     # 先看会删哪些路径
teamai uninstall               # 交互确认
teamai uninstall --force       # 脚本里用
teamai uninstall --agent claude  # 只卸某一个工具
```

规则很简单：**你自己建的文件留下**；teamai 写进去的部分去掉后如果整份文件空了，才删整份。

整机级（`--scope user`）卸载会保留仍登记的项目数据。想彻底干净：先把各个项目逐个卸载，
再在任何项目之外跑一次 `teamai uninstall`。

## 钩子单独处理

```bash
teamai hooks list
teamai hooks inject --dry-run
teamai hooks inject
teamai hooks remove
```

卸载时如果预览里出现 "Kept for other teamai installs"，说明别的安装还在用这些钩子。
确认没有别的 workspace 还在用，就先在仍配置 TeamAI 的工作区里 `teamai hooks remove`，再卸载。

## 备份什么

真正值得备份的只有两处：

- **团队仓库**（它就是全部资源，Git 本身就是备份）；
- **`~/.teamai/`**（你的本地配置、projects 分区、模型密钥的引用）。

++不要备份各工具目录里 pull 下来的副本++。它们是投影，重新 `pull` 就有了。

## 你应该看到什么

`teamai uninstall --dry-run` 会逐条列出"将移除的受管路径"，并且**不改任何东西**。
确认清单里没有你手写的文件，再真卸。

## 不对怎么办

- **卸载后 `teamai` 命令还在**：那只删了注册，没删 npm 包。`npm uninstall -g teamai-cli`。
- **重装后连不上**：旧配置还在 `~/.teamai/`。`init` 时会问要不要覆盖，或者直接 `--force`。
- **项目分区残留**：`teamai status --all` 能看到所有分区，逐个卸载后再整机清理。

## 看完这九步之后

- 想解决具体一件事：去 [How-to 实操](/howto/)。
- 想避开别人踩过的坑：去 [10 个常见的坑](/reference/pitfalls/)。
- 想查某个参数：去 [命令速查](/reference/commands/)。
