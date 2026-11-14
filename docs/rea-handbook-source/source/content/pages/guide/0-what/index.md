---
title: "它到底是什么"
description: "把 REA 拆成五块：MCP 服务器、工具、分析引擎、证据账本、命令行。看懂这张图，后面每一步都顺。"
---

# 它到底是什么

## 一句话的架构

```
你的 AI 客户端  ──MCP──▶  REA 服务器  ──▶  分析引擎 / 解析器  ──▶  目标文件
      ▲                      │
      └──── 工具结果 + 证据 ──┘
```

四层，各管一件事：

| 层 | 是什么 | 你会在哪儿碰到它 |
| --- | --- | --- |
| 客户端 | Claude Code / Codex / Cursor / WorkBuddy 这些 | 你打字的地方 |
| REA 服务器 | 一个本地进程，把工具暴露给客户端 | 注册在客户端配置里，`rea mcp` |
| 工具 | 几十个具体动作：打开、搜、反编译、比对、抓取 | 模型调用时你看到的名字 |
| 引擎 / 解析器 | Ghidra、Hopper、IDA、Kuna，或者自带的解析器 | 只有原生分析才需要 |

## 它有三张面孔

同一套东西，三种用法：

**一、MCP 服务器。** `rea mcp` 起一个 stdio 进程，客户端通过它调用工具。这是主要用法，也是「装上就多一双手」的那个。

**二、命令行。** `rea analyze ...`、`rea decompile ...`、`rea inspect-artifact ...`。适合脚本、CI、一次性任务。==CLI 和 MCP 走的是同一批工作流==，所以你在终端里验证过的命令，可以让模型照着做。

**三、技能（skill）。** 一份说明文档，告诉模型「拿到这些工具应该按什么顺序用、什么时候该停下来问」。它不含代码，只含方法。

<div class="tu-note tu-note--tip">
<strong>三者可以拆开用</strong><p>只装技能不注册 MCP 也能用（<code>npx skills add morluto/rea --skill reverse-engineer-anything</code>）；只注册 MCP 不装技能也能用，只是模型会更随性。都装是最好的组合。</p>
</div>

## 工具不是一堆散装命令

REA 的工具是按「一次调查会怎么走」组织的。粗分成七族：

| 族 | 干什么 | 代表工具 |
| --- | --- | --- |
| 目标与会话 | 打开、关闭、看当前状态、清空账本 | `open_binary`、`binary_session`、`reset_investigation` |
| 代码与函数 | 列函数、搜名字、搜字符串、反编译、看交叉引用 | `list_procedures`、`search_strings`、`procedure_pseudo_code` |
| 比对 | 两个版本、两个函数、两个产物 | `compare_functions`、`compare_artifacts`、`match_native_functions` |
| 工件检查 | 拆容器、看清单、读元数据 | `inspect_artifact`、`analyze_javascript_application` |
| 应用图 | 把一个应用的模块、边界、端点投影成图 | `trace_application_feature`、`project_android_application_graph` |
| 运行时 | 真的跑起来，抓一次交互 | `capture_browser_scenario`、`capture_process_scenario` |
| 账本与设置 | 取证据、导证据、记未知项、改设置 | `get_evidence_bundle`、`record_unknown`、`update_analysis_settings` |

完整的名字在 [工具与命令速查](/reference/commands/)。

## 证据账本：它和别的工具最不一样的地方

一个 MCP 连接 = 一本[[账本|ledger：本次连接里所有工具返回的记录，按证据编号索引]]。每次工具返回都往里写一条，带编号、带覆盖范围、带限制。

三个后果：

1. **结论可以追溯到具体那一次调用**，不是「模型记得」。
2. **它能把「查不到」也记下来**，作为[[未知项|unknown：明确记录「这里我没查清」的条目]]。
3. **新连接不共享旧账本**。换个会话，之前的证据就没了——要留就导出（[第 7 步](/guide/7-cli/)）。

## 分析引擎是可替换的

REA 自己不做反汇编。它调用你已经装好的引擎：

- **Hopper**：macOS 上最省事的原生方案，商业软件。
- **Ghidra**：免费，跨平台，但需要 JDK 和对应架构的原生反编译器。
- **IDA**：要已有的 IDA 和它自己的 MCP 桥。
- **Kuna**：另一个反编译器，自带校验版本。
- **objdump / Rizin**：离线、轻量，能力有限。
- **JADX / Apktool / adb / Frida**：安卓侧。

==没有引擎，JavaScript 和 .NET 的静态分析照样能用==，因为那两类不需要反汇编。

## 它不联网分析你的东西

分析在本地跑，目标不会被上传。但要说完整：工具结果会进模型的上下文，==模型的提供方有它自己的数据政策==。敏感目标请在本地模型或你信任的通道里做。

## 你应该看到什么

到这里你该能解释：为什么「装个 Ghidra」不是必须的第一步，为什么「换个会话就忘了」不是 bug，为什么它老是强调覆盖范围。

## 下一步

[第 1 步：把环境准备对](/guide/1-prereqs/)。
