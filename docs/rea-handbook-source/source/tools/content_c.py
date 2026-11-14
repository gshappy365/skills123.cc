# -*- coding: utf-8 -*-
"""术语表十二个 + 站点资料六篇 + 六个栏目首页。"""

WIKI = [
    dict(
        slug="evidence", title="证据（Evidence）", nav="证据", minutes=3, order=1,
        desc="REA 每次工具调用产出的、带编号和覆盖范围的记录。它是这套东西的地基。",
        body=r"""
**一句话**：一次工具调用的规范结果，带编号、覆盖范围和限制，可以被引用、导出、比对。

**打个比方**：化验单。不是「医生说你可能缺铁」，而是「这项指标这个值，参考范围是多少，这次的样本够不够」。

**在 REA 里**：每次产出结果的工具都会返回一条记录，`structuredContent` 里有 `evidence_id`、`normalized_result`、`raw_result`、`analysis_profile`。你能用它追问「依据哪条」，也能导出成 bundle 存下来。

**常见误区**：以为证据 = 真相。不是。证据是「这次看到的东西」，覆盖不全的时候它只能证明「看到过」，不能证明「只有这些」。
""",
    ),
    dict(
        slug="coverage", title="覆盖（Coverage）", nav="覆盖", minutes=3, order=2,
        desc="这次查询到底看到了多少。比结论本身更该先看的一个字段。",
        body=r"""
**一句话**：`complete` / `partial` / `truncated` / `unknown` / `unavailable`，五个值描述「这次看到多少」。

**打个比方**：手电筒照房间。照到的部分很清楚，没照到的地方不是「没有东西」，是「没照到」。

**在 REA 里**：工具返回的 `coverage` 字段。`partial` 时不能说「没有别的」；`truncated` 时要翻页或缩小范围；`unavailable` 说明这项能力压根没跑。

**常见误区**：把空列表当结论。「没搜到调用者」在 `partial` 下只意味着范围内没有。
""",
    ),
    dict(
        slug="confidence", title="可信度（Confidence）", nav="可信度", minutes=3, order=3,
        desc="直接看到、推断出来、还是猜的。写结论时把这三档分开，是专业与不专业的分界。",
        body=r"""
**一句话**：结论有多确定。实用分三档就够：直接看到、推断、猜。

**打个比方**：目击、旁证、传闻。

**在 REA 里**：`confidence` 字段带数值，但更该看的是**依据类型**——是从反编译出的代码里读到的，还是从命名和调用关系推的。

**常见误区**：把所有结论写成同一个语气。一句「大概是」和一句「代码里就是这样」读起来一样顺，但价值差十倍。
""",
    ),
    dict(
        slug="unknown", title="未知项（Unknown）", nav="未知项", minutes=3, order=4,
        desc="明确记录「这里我没查清」，带严重程度和下一步怎么试。",
        body=r"""
**一句话**：一个被显式记下来的问题，而不是一个被忘掉的缺口。

**打个比方**：病历上的「待查」。写下来，下次接着查；不写，下次重新猜。

**在 REA 里**：`list_unknowns` / `record_unknown` / `update_unknown` / `unknown_verify`。字段有 `question`、`severity`、`probes`、`status`、`resolution`。修订有版本，可以追「什么时候从不知道变成知道」。

**常见误区**：把 unknown 当成失败的证据。恰恰相反——一份有五条真实 unknown 的报告，比一份「全查清了」的可信得多。
""",
    ),
    dict(
        slug="ledger", title="账本（Ledger）", nav="账本", minutes=3, order=5,
        desc="一个 MCP 连接里所有记录的集合。它不跨会话，所以「换个对话就忘了」是设计。",
        body=r"""
**一句话**：每条证据按编号存进去的一本账，属于**当前这个连接**。

**打个比方**：一次实验的记录本。换个实验室，本子不跟着走。

**在 REA 里**：新连接不共享旧记录；换目标不丢；`close_binary` 不删；`reset_investigation` 才清。要跨会话就得导出 bundle，下一轮用文件引用。

**常见误区**：以为它会把历史攒起来。不会——这是为了不让一次分析的噪声污染下一次。
""",
    ),
    dict(
        slug="provider", title="引擎（Provider）", nav="引擎", minutes=4, order=6,
        desc="真正干活的那个反汇编器：Hopper、Ghidra、IDA、Kuna，或自带的解析器。",
        body=r"""
**一句话**：REA 自己不反汇编，它调用你已经装好的引擎。

**打个比方**：REA 是包工头，引擎是各个工种的师傅。包工头不砌墙。

**在 REA 里**：`rea providers --json` 列出所有 provider 和可用性。`--provider` 指定用哪个。原生分析需要外部引擎；JavaScript、.NET、容器拆解用自带解析器就够。

**常见误区**：以为「装了 REA 就能反编译」。装 REA 只是有了工具，反编译能力来自引擎。
""",
    ),
    dict(
        slug="target", title="目标（Target）", nav="目标", minutes=3, order=7,
        desc="被分析的那个东西：一个可执行文件、一个 .app、一个 APK、一个目录、一个网站。",
        body=r"""
**一句话**：用 `open_binary` 选中的分析对象，有生命周期：打开、使用、关闭。

**打个比方**：把一份样本放到实验台上。放上去、看、收起来。

**在 REA 里**：`open_binary` 打开，`binary_session` 看状态，`close_binary` 释放引擎和缓存。还有 `open_bundle_resources` 只读资源根，不解析可执行文件。

**常见误区**：以为 `close_binary` 会删证据。不会，只释放引擎和回放缓存。
""",
    ),
    dict(
        slug="snapshot", title="快照（Snapshot）", nav="快照", minutes=3, order=8,
        desc="把一次分析的结果存下来复用，第二次就不重新导入和分析了。",
        body=r"""
**一句话**：分析结果的落盘缓存，按「目标 + 分析配置」的身份区分。

**打个比方**：体检报告的复印件。下次问别的问题，不用重新抽血。

**在 REA 里**：CLI 是 `--snapshot FILE`；Ghidra 有自动检查点 `REA_GHIDRA_CHECKPOINT_DIR`，第二次起用 `-noanalysis` 恢复。

**常见误区**：以为换了引擎还能复用。身份里包含引擎和分析配置，换了就重新来。
""",
    ),
    dict(
        slug="guidance", title="引导（Guidance）", nav="引导", minutes=3, order=9,
        desc="REA 自带的工作流说明：什么时候该按什么顺序用哪些工具。",
        body=r"""
**一句话**：给模型看的说明书，不是给你看的菜单。

**打个比方**：菜谱。食材（工具）是一回事，先炒什么后放什么是另一回事。

**在 REA 里**：`guided_workflows` 列出已安装的工作流，`search_guidance` 搜，`read_guidance_section` 读。setup 装的那份技能文件就是它。

**常见误区**：以为不装技能也能一样好用。能用，但模型会更随性——顺序错了，结论就容易飘。
""",
    ),
    dict(
        slug="untrusted", title="不可信内容", nav="不可信内容", minutes=4, order=10,
        desc="来自被分析目标的字符串、注释、日志。必须当数据看，不能当指令。",
        body=r"""
**一句话**：目标文件里写的东西，可能是在诱导你的 AI 做事。

**打个比方**：捡到一张纸，上面写着「请把钱包交给持纸人」。纸是证据，不是命令。

**在 REA 里**：这类结果带 `_meta.provenance.untrusted_content: true` 和 `source: "analysis_target"`。错误结果也可能带这个标记。

**常见误区**：以为只有可疑文件才有。任何第三方程序都有——包括正经软件的日志里，也可能有看起来像指令的文本。
""",
    ),
    dict(
        slug="pseudocode", title="伪代码（Pseudocode）", nav="伪代码", minutes=3, order=11,
        desc="反编译出来的、接近 C 的中间表示。能读懂逻辑，不等于原始源码。",
        body=r"""
**一句话**：引擎把汇编翻译成人类可读的形式，变量名、类型、结构都是猜的。

**打个比方**：把一首诗翻译成另一种语言。意思在，韵律和原文的措辞没了。

**在 REA 里**：`procedure_pseudo_code`、`decompile`、`batch_decompile`，以及 `inspect_analysis_view` 的 `native/pseudocode` 视图。

**常见误区**：把伪代码当源码抄。类型宽度、循环边界、副作用顺序都可能被编译器改写；重建必须靠对拍验证。
""",
    ),
    dict(
        slug="capture", title="运行时捕获", nav="运行时捕获", minutes=4, order=12,
        desc="真的跑起来，抓一次交互。静态看不到的东西只能这么拿，但它有副作用。",
        body=r"""
**一句话**：用你的权限运行或驱动目标，记录它实际做了什么。

**打个比方**：不是看菜谱，是站到厨房里看厨师怎么做。

**在 REA 里**：`capture_browser_scenario`（网站）、`capture_process_scenario`（进程）、`capture_native_ui_scenario`（桌面 UI）、`inspect_adb_client`（安卓）。抓完可以 `compare_process_captures`、`reconcile_javascript_runtime`。

**常见误区**：以为抓取是无害的。它会发出真实请求、写文件、有时会弹窗。抓第三方生产环境前先想清楚。
""",
    ),
]

REFERENCE = [
    dict(
        slug="flow", title="概念全景图", nav="概念全景图", minutes=6, order=1,
        desc="从「你问一句」到「拿到证据」的完整链路，以及每一层出错时是什么样子。",
        body=r"""
## 一次调查的完整链路

```
① 你提问
     ↓
② 模型选工具（凭技能里的说明）
     ↓
③ REA 校验参数 → 选 provider → 打开目标
     ↓
④ provider 分析（Ghidra / Hopper / 自带解析器）
     ↓
⑤ 归一化成 Evidence（编号 + 覆盖 + 限制）
     ↓
⑥ 写进账本，返回给模型
     ↓
⑦ 模型读证据 → 决定追问、下结论、或记 unknown
     ↓
⑧ 你判断：证据够不够、缺什么
```

## 每一层坏了会怎样

| 层 | 坏了的表现 | 去哪儿看 |
| --- | --- | --- |
| ② 选工具 | 该查的不查，绕圈子 | 换更具体的问法；装技能 |
| ③ 目标/参数 | `invalid_request`、`capability_unavailable` | `binary_session`、`rea doctor` |
| ④ 引擎 | 超时、`provider_unavailable` | [引擎超时](/howto/engine-timeout/) |
| ⑤ 归一化 | 字段缺、类型怪 | `raw_result` |
| ⑥ 传输 | `resource_constraint` | [结果太大](/howto/context-bloat/) |
| ⑦ 模型 | 没证据也下结论 | [它说的没有证据](/howto/no-evidence/) |
| ⑧ 你 | 信了不该信的 | [读懂证据](/guide/5-evidence/) |

## 三个关键分界

**静态 vs 运行时。**静态读文件，不执行；运行时会真的跑、真的发请求。前者安全但会漏，后者准但有副作用。

**发现 vs 覆盖。**「找到了目标」和「确定没有别的」是两件事。前者看 `search_scope.observed_goal_status`，后者看 `coverage`。

**证据 vs 结论。**证据是记录，结论是你的判断。中间那一步（推断）必须标出来。

## 一张对照表

| 你想要的 | 静态能给 | 运行时能给 |
| --- | --- | --- |
| 代码里写了什么 | 能 | 能看到实际执行的路径 |
| 实际发了什么请求 | 只能看声明 | 能 |
| 有没有走某个分支 | 不能 | 能 |
| 全部可能的入口 | 能（覆盖够的话） | 只能看到走过的那次 |

完整工具清单见 [工具与命令速查](/reference/commands/)。
""",
    ),
    dict(
        slug="commands", title="命令与工具速查", nav="命令速查", minutes=8, order=2,
        desc="CLI 命令、MCP 工具族、常用环境变量，一页查完。",
        body=r"""
## CLI：按任务分

### 体检与维护

| 命令 | 用途 |
| --- | --- |
| `rea doctor --json` | 大范围审计 |
| `rea doctor --provider <id> --json` | 单个引擎 |
| `rea doctor --client <id> --json` | 单个客户端注册 |
| `rea doctor --skill --json` | 已安装的工作流 |
| `rea providers --json` | 有哪些 provider、可用性 |
| `rea capabilities --json` | 已注册的能力 |
| `rea update` | 更新全局安装 |
| `rea uninstall [--purge-data]` | 卸载 |

### 应用与前端

| 命令 | 用途 |
| --- | --- |
| `rea analyze-javascript-application <路径> --json` | 静态分析目录 / ASAR |
| `rea analyze <路径> --provider <id> --json` | 原生总览 |
| `rea inspect-analysis-view <视图 JSON>` | 从已有证据投影视图 |

### 原生分析（要引擎）

| 命令 | 用途 |
| --- | --- |
| `rea search <目标> <词> --provider <id>` | 搜函数 |
| `rea function <目标> <名或地址> --provider <id>` | 函数档案 |
| `rea decompile <目标> <地址> --provider <id>` | 反编译 |
| `rea xrefs <目标> <地址> --provider <id>` | 交叉引用 |
| `rea trace <目标> <词> --provider <id>` | 追踪 |
| `rea instructions <目标>` | 指令（objdump / Rizin 路线） |

### 工件与容器

| 命令 | 用途 |
| --- | --- |
| `rea inspect-artifact <文件> --json` | 清单 |
| `rea extract-artifact <文件> --json` | 提取成员 |
| `rea inspect-go-binary` / `inspect-rust-binary` | 构建元数据 |
| `rea inspect-model-artifact` | GGUF / safetensors 声明 |
| `rea inspect-il2cpp-metadata` | Unity IL2CPP |
| `rea inspect-pe-imports` / `inspect-pe-certificates` | PE 导入、证书 |
| `rea inspect-elf-notes` / `inspect-native-initializers` | ELF 细节 |
| `rea inspect-python-pyc` / `inspect-erlang-beam` | 字节码 |
| `rea inspect-binary-hardening` | 加固项 |
| `rea inspect-devicetree` / `inspect-kernel-module` | 固件、内核 |

### 证据与比较

| 命令 | 用途 |
| --- | --- |
| `rea evidence-import <bundle>` | 校验导入 |
| `rea evidence-export <in> <out>` | 导出规范形式 |
| `rea compare <a> <b> --json` | 比证据 |
| `rea compare-artifacts <json> --json` | 比产物 |

### 发布与自动化

| 命令 | 用途 |
| --- | --- |
| `rea audit-release-exposure <目标> [--fail_on high]` | 暴露审计 |
| `rea environment-build <har> <dir>` | 构建 RL 环境 |
| `rea environment-serve <manifest>` | 起环境服务 |
| `rea environment-export` / `environment-compare` | 导出、保真度比较 |

### MCP

| 命令 | 用途 |
| --- | --- |
| `rea mcp` | stdio 服务器（默认） |
| `rea mcp --http --port 8765` | HTTP 服务器 |
| `rea mcp add --agent <id>` | 注册到客户端 |
| `rea mcp doctor --json` | 检查启动 |

## 全局输出参数

```
--json    --format json|jsonl|md|csv|tsv|yaml|toon
--detail summary|complete
--evidence_output FILE    --evidence-bundle FILE    --snapshot FILE
--filter-output    --columns    --timings
--token-count    --token-limit    --token-offset
```

## MCP 工具：按族记

| 族 | 工具 |
| --- | --- |
| 目标与会话 | `open_binary` `close_binary` `binary_session` `open_bundle_resources` `reset_investigation` |
| 浏览与搜索 | `list_procedures` `search_procedures` `list_strings` `search_strings` `list_names` |
| 函数分析 | `analyze_function` `procedure_pseudo_code` `procedure_assembly` `read_function_instructions` `batch_decompile` `inspect_native_instruction` |
| 关系 | `procedure_callers` `procedure_callees` `procedure_references` `xrefs` `get_call_graph` `trace_call_path` `resolve_containing_procedure` |
| 追踪 | `trace_feature` `trace_application_feature` `trace_javascript_semantics` `trace_native_values` |
| 比较 | `compare_functions` `compare_artifacts` `match_native_functions` `compare_application_versions` `compare_javascript_export_shapes` `compare_process_captures` `compare_wasm_interfaces` |
| 工件 | `inspect_artifact` `inventory_artifact` `inspect_wasm_artifact` `inspect_macho` `inspect_plist` `inspect_asset_catalog` `inspect_keyed_archive` `inspect_api_contract` |
| 应用图 | `project_managed_application_graph` `project_android_application_graph` `project_apple_application_graph` `project_harmony_application_graph` `find_changed_behavior` `correlate_static_and_runtime` |
| 运行时 | `capture_process_scenario` `capture_browser_scenario` `capture_native_ui_scenario` `inspect_adb_client` `inspect_apktool_client` |
| 账本 | `get_evidence_bundle` `export_evidence_bundle` `inspect_analysis_view` |
| 未知项 | `list_unknowns` `record_unknown` `update_unknown` `unknown_verify` |
| 设置与指南 | `inspect_analysis_settings` `update_analysis_settings` `guided_workflows` `search_guidance` `read_guidance_section` |

## 环境变量

| 变量 | 作用 | 何时生效 |
| --- | --- | --- |
| `GHIDRA_INSTALL_DIR` | Ghidra 安装目录 | 启动 |
| `JAVA_HOME` | JDK | 启动 |
| `HOPPER_LAUNCHER_PATH` | Hopper 启动器 | 启动 |
| `REA_IDA_MCP_CONFIG` | IDA MCP 注册 JSON | 启动 |
| `REA_KUNA_COMMAND` | Kuna 可执行文件 | 启动 |
| `REA_JADX_MCP_JAR` | JADX headless JAR | 启动 |
| `REA_GHIDRA_STARTUP_TIMEOUT_MS` | Ghidra 启动期限 | 启动 |
| `REA_HOPPER_STARTUP_TIMEOUT_MS` | Hopper 启动期限 | 启动 |
| `REA_GHIDRA_DECOMPILE_TIMEOUT_SECONDS` | 单函数反编译期限 | 启动 |
| `REA_GHIDRA_CHECKPOINT_DIR` | 自动检查点目录 | 启动 |
| `REA_GHIDRA_PROJECT_PATH` / `REA_GHIDRA_PROGRAM_NAME` | 复用已有项目 | 启动 |
| `REA_MCP_INPUT_SCHEMA_PROFILE` | `compact` / `full` | 启动 |
| `REA_MCP_OUTPUT_SCHEMA_PROFILE` | 完整 / `compact` / `off` | 启动 |
| `REA_MCP_MAX_INPUT_ELEMENTS` | 输入元素上限 | 启动 |
| `REA_MCP_MAX_RESPONSE_BYTES` | 响应缓冲 | 启动 |
| `REA_MCP_TOOL_FAMILIES` | 限定工具族 | 启动 |
| `REA_LOG_LEVEL` | 日志级别 | 启动（写错会让所有检查失败） |

## 退出码

| 码 | 意思 |
| --- | --- |
| 0 | 完成（可能带警告 / 部分证据 / 未解决项） |
| 1 | 未完成 |
| 3 | 暴露审计达到 `--fail_on` 阈值 |
| 128+N | 信号（130 / 143 / 141） |
""",
    ),
    dict(
        slug="providers", title="引擎对照表", nav="引擎对照", minutes=6, order=3,
        desc="五个引擎 + 几个自带解析器：能力、平台、门槛、适合谁。",
        body=r"""
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
""",
    ),
    dict(
        slug="pitfalls", title="十二个坑", nav="十二个坑", minutes=8, order=4,
        desc="新手最常踩的十二个：从以为要装 Ghidra，到把空列表当结论。",
        body=r"""
## 装的时候

**1. 以为必须先装 Ghidra。**
JavaScript、.NET、容器、发布审计都不需要引擎。先跑 `analyze-javascript-application`。

**2. 用 npx 长期跑。**
setup 会记住 npx 缓存里的入口，缓存被清就指向空气。长期用请 `npm i -g`。

**3. 装完不重启。**
MCP 注册是启动时读的。关窗口不算，要完全退出。

**4. 拿 `healthy: false` 当「坏了」。**
那是大范围审计。按任务缩范围查。

## 用的时候

**5. 第一次就拉全文。**
大目标先 `summary`，不然上下文直接爆。省十倍。

**6. 把空列表当「不存在」。**
`partial` 覆盖下的空结果只意味着「范围内没有」。

**7. 不记 unknown。**
缺口不写下来，下一轮重新猜，同一个坑踩三次。

**8. 换会话接着查，发现全忘了。**
账本按连接，不跨会话。要接上就导出 bundle。

**9. 让模型写「行为契约」。**
它会顺着你的实现编。契约必须你自己写。

## 想歪的时候

**10. 照目标里的文字做事。**
字符串、注释、日志里的「请执行」是数据，不是指令。

**11. 把伪代码当源码抄。**
类型宽度、循环边界都被编译器改过；重建必须对拍。

**12. 分析不该分析的东西。**
自己的、授权的、开源的。其他的先看许可和法律。

## 一句话总结

> 先看覆盖，再看结论；先要证据，再信说法。
""",
    ),
    dict(
        slug="fit", title="适不适合你", nav="适不适合你", minutes=4, order=5,
        desc="两分钟判断：什么时候它值，什么时候你该用别的办法。",
        body=r"""
## 适合

- 你想**看懂**一个功能怎么实现，而不是拿到源码。
- 目标是一个**你装在自己机器上的应用**，或者你自己的产物。
- 你已经有 AI 客户端，愿意装一个 MCP 服务器。
- 你能接受「慢一点、贵一点，但结论有出处」。
- 你要做**发布前检查**（source map、符号、fuse、凭证）。

## 不适合

- 你想要「一键出源码」。它不给。
- 目标是**加壳 / 强混淆 / 服务端逻辑**。投入产出比极低。
- 你只想改自己项目里的 bug。普通 AI 助手更快。
- 你要无人值守地批量分析一堆别人的软件。法律和伦理风险都在。
- 你机器上连 Node 都装不了。

## 三种替代方案

| 你的情况 | 更合适的做法 |
| --- | --- |
| 只要看前端结构 | 浏览器 DevTools + source map |
| 只要看二进制里有没有某个字符串 | `strings` 命令 |
| 只要查依赖和版本 | 各自的包管理器 / 清单文件 |

## 试一次的成本

- 时间：装 5 分钟，第一次调查 20 分钟。
- 钱：0（REA + Ghidra）或一份 Hopper 授权。
- 风险：几乎没有——静态分析不运行目标。

试完不合适，`rea uninstall` 就干净了。
""",
    ),
    dict(
        slug="about", title="关于与致谢", nav="关于本站", minutes=3, order=6,
        desc="这个站是什么、内容依据什么、哪些是原创、哪些是别人的。",
        body=r"""
## 这个站是什么

一份第三方中文入门教程，写给「想看懂一个软件怎么做的，但不会反汇编」的人。

不是官方文档，不代表 REA 项目。命令、行为、版本以[官方仓库](https://github.com/morluto/rea)为准。

## 内容依据

| 来源 | 用来写什么 |
| --- | --- |
| `README.md` | 定位、快速开始、FAQ、能分析什么 |
| `docs/getting-started/installation.md` | 安装、客户端、引擎配置、维护 |
| `docs/getting-started/cli.md` | 命令、参数、退出码 |
| `docs/reference/mcp-contracts.md` | 工具族、证据结构、覆盖语义、不可信内容 |
| `docs/` 下的专题文档 | APK、.NET、网站抓取、固件等 |
| 本机实测（rea 6.7.0 / Node 22.22.2 / macOS 14） | doctor 输出、provider 可用性、版本行为 |

## 什么是原创的

- 全部中文正文、所有讲解顺序和类比；
- 「三个阶段」「十二个坑」「五步重建法」这类组织方式；
- 首页与各栏目首页的文案与结构。

## 什么是借鉴的

- **信息架构**：三栏（导航 / 正文 / 页内目录）、入门三课 + 完整教程 + How-to + 术语 + FAQ 的组织方式，参考了 [xxd-pstack](https://github.com/nevertoday/xxd-pstack) 这套公开的教程写法。
- **界面组件**：沿用本地骨架里的组件样式；本站不复用对方的教程正文、插画和品牌资产。

## 版权

- REA 本体是 MIT。
- 本站文字是本站在公开文档基础上的原创整理，引用的事实以官方文档为准。
- 站内提到的产品名、商标归各自所有者。

## 发现错误

以官方仓库的文档和你本机的实际输出为准。版本变化很快（本教程核对时是 6.7.0，仓库里最新已是 6.9.x 线），如果某条命令和你跑出来的不一致，先看 `rea --version`，再看官方文档。

## 不构成法律意见

站内关于「哪些目标可以分析」的说明只是常识性提醒。具体合法性看你所在地的法律和目标的许可协议。
""",
    ),
]

START_HOME = r"""
## 三课，二十分钟

不会写代码也能走完。每课都有一个明确的终点，走完你就已经用它查过一个真实的东西。

| 课 | 你会拿到 | 时间 |
| --- | --- | --- |
| [1 · 它能帮你什么](/start/1-what/) | 判断值不值得学，知道要准备什么 | 4 分钟 |
| [2 · 装上它](/start/2-setup/) | 一个能用的环境，和一条验证命令 | 6 分钟 |
| [3 · 第一次调查](/start/3-first-task/) | 一条功能链路，一份「没查清」清单 | 9 分钟 |

<div class="tu-note tu-note--tip">
<strong>只记一句话</strong><p>提问时写三样：<strong>要查什么</strong> · <strong>什么算查清</strong> · <strong>给我看什么</strong>。第三样决定了它会不会编。</p>
</div>

## 走完以后

- 想系统学 → [完整教程](/guide/)
- 手上有具体的活 → [How-to](/howto/)
- 看到不认识的词 → [术语表](/wiki/)
"""
GUIDE_HOME = r"""
## 九步，从装到能自己查

给会动手的人。每一步都写了「你应该看到什么」和「不对怎么办」。

| 步 | 内容 | 关键动作 |
| --- | --- | --- |
| [0](/guide/0-what/) | 它到底是什么 | 分清客户端、服务器、工具、引擎、账本 |
| [1](/guide/1-prereqs/) | 环境准备 | Node 版本、平台差异、Linux 的 `ps` |
| [2](/guide/2-install/) | 安装与注册 | setup 的四个动作、限定到一个项目 |
| [3](/guide/3-engine/) | 选一个引擎 | Hopper / Ghidra / IDA / Kuna 怎么选 |
| [4](/guide/4-first-case/) | 完整走一个案子 | 从一个 Electron 应用追到一条链路 |
| [5](/guide/5-evidence/) | 读懂证据 | 覆盖、可信度、限制、未知项、不可信内容 |
| [6](/guide/6-tools/) | 把工具用对 | 七族工具、summary、分页、保留引用 |
| [7](/guide/7-cli/) | 命令行与管道 | JSON、bundle、退出码、CI |
| [8](/guide/8-rebuild/) | 从看懂到做出来 | 契约、实现、对拍、版权 |
| [9](/guide/9-maintain/) | 更新与排错 | `rea update`、分范围 doctor、卸载 |

## 如果只有十分钟

看 [第 4 步](/guide/4-first-case/) 和 [第 5 步](/guide/5-evidence/)。前者教你怎么走一遍，后者教你怎么判断它有没有骗你。
"""
HOWTO_HOME = r"""
## 一篇只讲一件事

每篇结构一样：什么时候用、一段能照抄的话、你会看到什么、不对怎么办。尖括号换成你自己的内容就能发。

## 四组

| 组 | 你在干什么 | 篇数 |
| --- | --- | --- |
| **A · 看懂一个应用** | 手上有一个具体目标，想搞清它怎么做的 | 6 |
| **B · 找东西** | 知道要找什么，但不知道在哪 | 4 |
| **C · 发布与自动化** | 为自己的产物做检查，或放进流水线 | 3 |
| **D · 排错与省钱** | 慢、贵、没证据、起不来 | 4 |

## 最常用的三篇

- [看 Electron 应用](/howto/electron-app/)：不需要引擎，最快见效。
- [从字符串反推功能](/howto/strings/)：任何目标的第一步。
- [没装引擎怎么办](/howto/no-engine/)：先确认你到底缺什么。
"""
WIKI_HOME = r"""
## 十二个词，够用了

每个条目四段：一句话、打个比方、在 REA 里是什么、常见误区。

| 词 | 一句话 |
| --- | --- |
| [证据](/wiki/evidence/) | 一次工具调用的规范结果，带编号和覆盖 |
| [覆盖](/wiki/coverage/) | 这次到底看到了多少 |
| [可信度](/wiki/confidence/) | 直接看到、推断、还是猜的 |
| [未知项](/wiki/unknown/) | 明确记下「这里没查清」 |
| [账本](/wiki/ledger/) | 一个连接里的所有记录，不跨会话 |
| [引擎](/wiki/provider/) | 真正干活的反汇编器 |
| [目标](/wiki/target/) | 被分析的那个东西 |
| [快照](/wiki/snapshot/) | 分析结果的落盘缓存 |
| [引导](/wiki/guidance/) | 给模型看的说明书 |
| [不可信内容](/wiki/untrusted/) | 目标里写的字，不是命令 |
| [伪代码](/wiki/pseudocode/) | 接近 C 的中间表示，不是源码 |
| [运行时捕获](/wiki/capture/) | 真的跑起来抓一次 |

## 先看哪三个

[证据](/wiki/evidence/)、[覆盖](/wiki/coverage/)、[未知项](/wiki/unknown/)。这三个决定了你会不会信错东西。
"""
REFERENCE_HOME = r"""
## 站点资料

| 资料 | 什么时候看 |
| --- | --- |
| [概念全景图](/reference/flow/) | 想搞清整条链路，以及每层坏了会怎样 |
| [命令速查](/reference/commands/) | 忘了命令、参数、环境变量 |
| [引擎对照表](/reference/providers/) | 选引擎，或确认某个能力有没有 |
| [十二个坑](/reference/pitfalls/) | 卡住了，先看看是不是踩过的 |
| [适不适合你](/reference/fit/) | 还没开始，先判断值不值 |
| [关于本站](/reference/about/) | 想知道内容依据和版权 |

## 一张图记住

```
客户端 → REA 服务器 → 引擎 → 目标
   ↑        ↓
   └── 证据账本 ──→ 结论 / 未知项 / bundle
```
"""
