---
title: "让钩子在 Windows 上生效"
description: "Windows 上钩子要跑命令，缺口通常在 shell 与路径；先确认哪一环断了。"
---

# 让钩子在 Windows 上生效

## 症状

在 Windows 上 `init` 成功、`list` 有内容，但开会话时不会自动同步；或者钩子报"命令不存在"。

## 排查顺序

```bash
teamai doctor
teamai hooks list
teamai hooks inject --dry-run
```

## 三个常见原因

1. **没有可用的 shell 环境。** 钩子命令要被执行器调用。Git Bash 或 WSL 存在时最稳。
2. **路径里有空格或中文。** 安装目录带空格时，钩子里的命令容易被截断。换一个纯英文路径更省事。
3. **工具配置里写的是反斜杠路径。** 部分工具配置文件里要正斜杠；teamai 写入时会转，但你自己改过就会被覆盖回去。

## 值得先做的两件事

```bash
# 用 Git Bash 跑一次，确认命令本身没问题
teamai pull

# 重新注入钩子，让它按当前 shell 重写配置
teamai hooks inject
```

## 官方文档

Windows 的钩子与 shell 配置有单独一页说明：`docs/guide/zh-CN/windows.md`。
本站不复制它的正文，遇到具体报错去那里对一遍。

## 实在不行

会话启动同步不是必须的。手动跑 `teamai pull` 效果完全相同，只是要你自己记得。

```bash
teamai pull --dry-run
teamai pull
```

## 注意

- Windows 上的默认目录和 Linux/macOS 不同（例如 Hermes 在 `%LOCALAPPDATA%\hermes`）。
- `teamai doctor` 会说明它认到的是哪个主目录，对不上就是这里是问题。
