---
title: "装上它"
description: "一条 npx 命令，三个独立的批准，装完怎么确认真的装上了。"
---

# 装上它

## 一条命令

前提只有一个：机器上已经有 Node.js 和 npm，版本对得上（22.x / 24.x / 26.12.1+）。

```
npx rea-agents setup
```

就这一条。它做的事情比看上去多：探测你装了哪些 AI 客户端、为选中的客户端写 MCP 注册、把配套的工作流说明装进技能目录、检查有没有可用的分析引擎。但==它不会悄悄改你的配置==——动手之前先把计划给你看。

<details>
<summary>想先看它打算干什么，不写任何文件</summary>

```
npx rea-agents setup --dry-run
```

返回状态是 `planned`，退出码 0，什么都不改。适合先确认它认不认识你用的那个客户端。

</details>

## 它会问你什么

1. **选客户端。**多选列表。已经注册过 REA 的默认勾上；新检测到的**能看到但不默认勾**——检测到不等于替你同意。没检测到的也能手动选。
2. **审阅计划。**会列出：要改哪个配置文件、技能装到哪个目录、有没有要装的 Hopper、要跑什么包管理器命令。看清楚再批准。
3. **Hopper 是单独一件事。**它默认不装。要装得单独点同意，或者命令行加 `--install-hopper`。

<div class="tu-note tu-note--tip">
<strong>三个批准，不是一个</strong><p>npm 下载包、REA 写配置、安装 Hopper，是三件独立的事，各有各的同意。看到「已批准」别以为全批了。拒绝或者 Ctrl-C 不会留下任何改动。</p>
</div>

## 装完之后，它落在哪里

| 落点 | 是什么 | 想反悔怎么办 |
| --- | --- | --- |
| 客户端的 MCP 配置 | 一条指向 REA 的注册，带启动命令 | `rea uninstall` 只删它自己的条目 |
| 客户端技能目录 | 一份工作流说明（告诉 AI 该怎么用这些工具） | `rea uninstall` 一起删；`--skill=false` 可以不装 |
| 备份文件 | 改之前留的 `.rea.backup` | 手动恢复，见 [第 9 步](/guide/9-maintain/) |

写配置的过程是保守的：保留无关条目和注释、先写临时文件再验证、发现文件在你批准之后被别人改过就报 `conflict` 而不是覆盖。

## 三件事证明它真的装上了

**第一，重启客户端。**MCP 注册在启动时读，不重启新工具不会出现。

**第二，跑一次体检：**

```
rea doctor --json
```

（还没全局安装的话用 `npx rea-agents doctor --json`。）

**第三，让它自己说一遍。**在客户端里问：「列出你现在能用的 rea 工具」。能看到 `open_binary`、`list_strings`、`analyze_function` 这些名字，就是通了。

<div class="tu-note tu-note--ok">
<strong>体检不 healthy 是正常的</strong><p><code>healthy: false</code> 只说明「有些可选能力没配齐」，不代表你现在不能用。本机实测：Node 和 Hopper 都 ok，Ghidra/IDA/JADX/Kuna 全缺，二十多个客户端注册都报 <code>config_drift</code>——因为配置文件被别的工具改过。这些都不影响「静态分析一个 Electron 应用」。</p>
</div>

## 一个引擎都没有，也能开始

这是新手最容易卡住的地方：以为必须先装 Ghidra。

不是的。两条路不需要任何反汇编引擎：

- **JavaScript / Electron 静态分析**：直接读文件，不运行程序。
- **.NET 程序集检查**：读程序集的元数据和成员。

```
npx -y rea-agents@latest analyze-javascript-application /绝对路径/你的应用 --json
```

先把这条跑通，你就已经用上 REA 了。等真的要看原生二进制，再去 [第 3 步：选一个引擎](/guide/3-engine/)。

## 用不用 npx

| 方式 | 适合 | 怎么更新 |
| --- | --- | --- |
| `npx rea-agents ...` 每次现取 | 先试试，不想装 | 每次自动取最新；setup 要重跑 `npx rea-agents@latest setup` |
| `npm install --global rea-agents` | 天天用 | `rea update` |
| 从源码 checkout | 要改它自己 | `git pull` + `npm ci` + `npm run build:cached` |

<div class="tu-note tu-note--warn">
<strong>npx 的一个坑</strong><p>setup 会把「当前这次 npx 缓存里的那个入口」写进你的配置。清 npm 缓存、或者 npx 的临时目录被系统回收，注册就指向一个不存在的文件。长期用请全局安装。</p>
</div>

## 不对怎么办

| 现象 | 大概是什么原因 | 先做什么 |
| --- | --- | --- |
| `npx` 报 Node 版本不符 | 版本低于要求 | `node -v` 看一眼；用 nvm 切到 22.23.4+ |
| 装完客户端里看不到工具 | 没重启 | 完全退出再开，不是关窗口 |
| `ERR_MODULE_NOT_FOUND` | npx 的安装目录缺文件 | 见 [第 9 步](/guide/9-maintain/) 里的 npx 修复段 |
| 提示 `prebuild-install` 警告 | 上游原生依赖的弃用警告 | 忽略，不影响 REA |
| Claude Desktop 注册随后消失 | 审批时它还在运行，退出时把自己的内存配置写回去了 | 完全退出 Claude Desktop，重跑 setup |
| 提示 `conflict` | 你批准之后配置文件被别的工具改了 | 重新审阅一次再批准，不要强行覆盖 |

## 下一步

去 [第 3 课：第一次调查](/start/3-first-task/) ——挑一个你天天用的应用，问它一句。
