# REA 中文新手教程：craft-anything 会话记录

> 本文件由 craft-anything MCP（0.6.1）在本次会话中生成，记录 brief / plan / 假设 / 未知项 / 交接。
> 工具生成，不是教程正文。正文在 `content/pages/`。

## Brief

**问题**：REA（morluto/rea）是什么，一个不会反汇编的新手要怎么从零走到能自己完成一次有证据的调查？

**用途**：把一个逆向工程 MCP 服务器翻译成中文新手教程站，读者是想看懂别人软件但不做逆向工程的人。

**约束**

- 只读官方文档与本机 rea 6.7.0 的只读输出（`--version` / `doctor` / `providers`）
- 不运行、不分析任何第三方目标程序
- 不复制他人教程正文与品牌资产，只借鉴公开的信息架构
- 所有结论标注来源；未实测的部分写进未知项

**完成标准**：54 页中文教程建成；构建通过、内链无死链、1440 / 390 无横向溢出。

**目标**

- `https://github.com/morluto/rea`
- `/Users/gaoshan/Documents/rea/node_modules/rea-agents`（本机 6.7.0）
- `/Users/gaoshan/WorkBuddy/rea-tutorial`（产物）

## 计划（全部完成）

1. 读官方文档：README、installation.md、cli.md、mcp-contracts.md — 事实底座
2. 本机取只读证据：版本 / doctor / providers — 让「你应该看到什么」是真输出
3. 设计 6 栏目 54 页结构
4. 内容层：三个 python 模块生成 md + `site-index.json`
5. 构建与验证：astro build、内链扫描、390 宽 iframe 探测
6. 记录未知项与交接

## 假设

| 假设 | 支持证据 |
| --- | --- |
| 核心差异不是「能反编译」，而是每条结论带覆盖状态与证据编号 | mcp-contracts 的 coverage 五级、unknown 工具族、untrusted_content provenance |
| 新手的真卡点是「以为必须先装 Ghidra」 | installation 明说静态 JS 分析无需引擎；本机 providers 里三个静态 provider available、ghidra 缺失 |
| 输出不能直接变成可编译源码，重建必须对拍 | README showcase 用 3205 组用例 + 63 字节一致收尾；FAQ 明说返回伪代码与汇编 |

## 实测记录（本机 rea 6.7.0 / Node 22.22.2 / macOS 14.7.3）

- `rea --version --json` → `6.7.0`
- `rea doctor --json` → `healthy: false`：node / host / hopper 为 ok；ghidra（`GHIDRA_INSTALL_DIR` 未设）、ida、jadx、kuna 缺失；20 多个客户端注册为 `config_drift`
- `rea providers --json` → `native-macos` 4/4 组可用、`rea-artifact-graph` 3/3、`rea-dotnet-static` 3/3、`sqlite` 0/1；ghidra 候选为 `not_configured`

## 未知项

- **版本漂移**：文档提到 6.9.x 发布线，本机为 6.7.0；新增工具与客户端 id 是否已覆盖，需要用 `npm view rea-agents dist-tags.latest` 对照。严重程度 medium。
- **未实测的目标类型**：HarmonyOS 包、固件镜像、EVM 字节码只按文档描述写成，未在本机跑过。严重程度 low。

## 产物与验证

- 站点：`/Users/gaoshan/WorkBuddy/rea-tutorial`（Astro 7.2.8，静态）
- 页面：56 个 HTML（54 篇内容 + 首页 + 404），324 条搜索小节
- 验证：`npm run build` 通过；`npm run check` 全绿；内链 3896 条、坏链 0；390 宽 `scrollWidth == clientWidth`

## 交接

下一步最有价值的两件事：一是按 `npm view` 的实际版本补 6.9.x 的新工具；二是拿一个真实 `.hap` 或固件镜像把「未实测」那两条消掉。内容改动只动 `tools/content_*.py`，别直接改 `content/pages`（会被覆盖）。
