---
title: "命令与工具速查"
description: "CLI 命令、MCP 工具族、常用环境变量，一页查完。"
---

# 命令与工具速查

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
