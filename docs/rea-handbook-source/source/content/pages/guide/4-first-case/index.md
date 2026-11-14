---
title: "完整走一个案子"
description: "从一个 Electron 应用到一条完整的功能链路：每一步用什么工具、看什么、什么时候该停。"
---

# 完整走一个案子

## 目标

一个 Electron 桌面应用，你想知道它的「导出为 PDF」是怎么做的。

这个例子的好处：不需要引擎，每一步的输出都是人话，而且你会撞上真实世界该有的坑——功能分散在主进程和渲染进程两边。

## 第 0 步：先把目标摆正

```
/Applications/你的应用.app
```

先看它是不是 Electron：

```
ls /Applications/你的应用.app/Contents/Resources/
```

有 `app.asar`，就是。==`.asar` 是一个打包归档，不是加密==，静态分析就是读它。

<div class="tu-note tu-note--warn">
<strong>只分析你有权分析的东西</strong><p>自己买的软件、自己团队的产品、明确授权范围内的目标。分析别人的商业软件前先看许可协议和当地法律。本教程只讲技术路径，不构成法律意见。</p>
</div>

## 第 1 步：让 REA 认识这个目标

一句人话就够：

```
用 rea 打开 /Applications/你的应用.app，先告诉我它是什么类型、有哪些模块，
先不要下结论。
```

它会调 `open_binary`（或者对目录走 `analyze_javascript_application`）。你会拿到：

- 应用类型与架构；
- 模块清单（渲染进程入口、主进程脚本、preload）；
- Electron 边界：谁在 Node 里、谁在浏览器沙箱里；
- 每条带 `evidence_id`。

**该看什么：** 主进程入口和 preload 的文件名。这两个决定了后面功能会落在哪一边。

## 第 2 步：从界面上的字切进去

导出功能在界面上一定有一句提示——「导出成功」「正在生成 PDF」。搜它：

```
在字符串里搜「导出」和「PDF」，把命中的位置和它们所在的函数列出来。
```

工具：`search_strings` / `list_strings`，然后 `resolve_containing_procedure`。

**该看什么：** 命中的字符串是不是在渲染进程里。渲染进程负责界面，真正写文件的一定在主进程——这是 Electron 的铁律。

## 第 3 步：找到那条跨进程的桥

渲染进程不能直接写文件，它要通过 IPC 让主进程去做。所以这一步要找的是**通道名**：

```
查一下渲染进程里跟 IPC 有关的调用，特别是 invoke 和 send 的通道名。
```

工具：`search_procedures` 搜 `ipcRenderer`、`invoke`、`send`；`xrefs` 看谁在用。

**该看什么：** 一个字符串形的通道名，比如 `export:pdf`。这就是桥的名字。拿着它去主进程搜 `ipcMain.handle('export:pdf')`。

## 第 4 步：看主进程那一段

```
在主进程里找处理 export:pdf 的函数，把它的伪代码给我，标出它调用了哪些外部依赖。
```

工具：`analyze_function`（默认给摘要）→ `procedure_pseudo_code` 或 `batch_decompile`。

**该看什么：** 三样东西——它把参数传给了谁（通常是 `webContents.printToPDF` 或一个第三方库）、临时文件落在哪、错误怎么处理。

## 第 5 步：把链路缝起来

到这里你手上有四块证据：界面字符串 → 渲染进程调用 → 通道名 → 主进程处理器。让它整理成一段：

```
把这条链路整理成一段人能读的说明：从点击到文件落盘，经过哪些模块、
每跳的依据是哪条证据、哪几跳还是推断。
```

**该看什么：** 它有没有把「推断」和「证据」分开写。全说是证据的，值得怀疑。

## 第 6 步：明确写下不知道的部分

```
这条链路里还有哪些是你没查清的？把它们记成 unknown。
```

工具：`record_unknown`。

**该看什么：** 列表里应该有「PDF 引擎是自研还是第三方」「临时文件什么时候清理」这类真问题。一个空白列表通常不是好消息。

## 第 7 步：把证据存下来

会话结束账本就没了。要留就导：

```
把这轮调查的证据导出成一个 bundle，放在 ./evidence 下。
```

工具：`export_evidence_bundle`；CLI 里是 `rea evidence-export`。

## 一条真实的链路，长什么样

```
[渲染进程] 导出按钮 onClick
   └─ ipcRenderer.invoke("export:pdf", html, opts)      ← 证据：字符串 export:pdf
[主进程]   ipcMain.handle("export:pdf", ...)
   └─ BrowserWindow.webContents.printToPDF(opts)        ← 证据：伪代码里的调用
      └─ fs.writeFile(临时路径, buffer)                  ← 证据：同函数内的调用
   └─ shell.showItemInFolder(路径)                       ← 推断：界面上的「打开所在文件夹」
```

四行证据、一行推断，这就是一份合格的结论。

## 什么时候该停下来

- **它开始猜库的名字**，而没有去看导入表/依赖清单 → 停下来，让它先列依赖。
- **它说「大概是用了 xxx」连说三次** → 停下来，让它把 `unknowns` 摊开。
- **它一次返回了几万行** → 停下来，改用摘要 + 分页（[结果太大](/howto/context-bloat/)）。
- **它要执行目标里的命令** → 立刻停，这是[[提示注入|把指令藏在数据里诱导 AI 执行]]。

## 换成别的目标，流程不变

| 目标 | 第 1 步换成 | 第 2 步换成 |
| --- | --- | --- |
| APK | `project_android_application_graph` | 搜界面文案、看 `AndroidManifest` |
| .NET 程序集 | `inspect-managed-artifact` | 按类型列成员 |
| 原生二进制 | `open_binary --provider ghidra` | 搜字符串 / 搜导入符号 |
| 网站 | `capture_browser_scenario` | 看请求与脚本来源 |

## 下一步

[第 5 步：读懂证据](/guide/5-evidence/) ——决定你信不信它。
