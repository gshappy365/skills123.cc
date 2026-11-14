---
title: "升级与卸载不留垃圾"
description: "update 不用重装，uninstall 能预览；两条命令加上正确的顺序，收尾干净。"
---

# 升级与卸载不留垃圾

## 升级

```bash
teamai update --check
teamai update
```

不用重跑 `init`。配置、资源、角色选择都在原地。

多份全局安装（nvm 下多个 Node）想让它们一起更新：

```yaml
# ~/.teamai/config.yaml
updateOtherInstallations: true
```

## 卸载：先预览

```bash
teamai uninstall --dry-run
```

它会逐条列出"将移除的受管路径"，==不改任何东西==。看完确认清单里没有你手写的文件，再执行：

```bash
teamai uninstall              # 交互确认
teamai uninstall --force      # 脚本 / CI
teamai uninstall --agent claude   # 只卸一个工具
```

## 删除规则

- 你自己建的文件**留下**。
- teamai 写进去的部分去掉后，如果整份文件空了，才删整份。
- 整机级卸载会保留仍登记的项目数据。想彻底干净：**先逐个卸载项目，再在任何项目之外跑一次**。

## 钩子留在别处的情况

卸载预览里出现 "Kept for other teamai installs"，说明还有别的安装在用这些钩子。
确认没有别的 workspace 还在用之后：

```bash
# 在仍配置了 TeamAI 的工作区里
teamai hooks remove
# 然后在工作区之外
teamai uninstall
```

## 最后清 npm 包

```bash
npm uninstall -g teamai-cli
```

`uninstall` 只删注册和资源，不删 npm 包。

## 想回来

```bash
teamai init --repo https://github.com/your-org/your-team --scope user --force
```

## 注意

备份只需要两样：**团队仓库**（Git 本身就是备份）和 **`~/.teamai/`**。
各工具目录里的副本是投影，`pull` 就有，不用备份。
