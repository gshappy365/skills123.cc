# 参考框架勘察记录（craft-anything）

本次开工前，用 craft-anything 的引擎（CLI 形态）对**参考框架**做了一次取证式勘察，
确认三栏骨架的构成后再动手改造成本站在用。目标不是 xxd-pstack 的线上站点，而是本地已重建过的
同构实现 `../dsh-superagent-tutorial`（它与 xxd-pstack 的信息架构一致，且源码可读）。

## 为什么用 CLI 而不是 MCP

`~/.workbuddy/mcp.json` 里已经登记了 `craft-anything`（`craft-anything-cli mcp --project …/pstack-clone.cany --allow-run`），
但本次会话的 MCP 连接器列表里没有它，工具侧取不到 `mcp__craft-anything__*`。
两者是同一个引擎、同一套工具，所以改用 CLI 直接调用，工具与参数完全一致：

```bash
craft-anything-cli --project <新>.cany --deep --format md triage <目标>
craft-anything-cli --project <新>.cany --deep --format md core-archive-show <目标>
```

需要在会话里用 MCP 形态时：连接器管理页右上角的自定义入口 → 对该 server 点「信任」，重开会话即可。

## 证据

### 1) 目标识别（core_target_triage）

```
dsh-superagent-tutorial is a folder (an app bundle, an unpacked app or a project).
evidence: ev_02d573aaa8f48e4c309200a170fca0d718925f07765c5cb4bfe00f11ac164372
confidence: inferred
limitations: the kind is detected from the first bytes and, to break ties, the file name
```

**读法**：kind = `directory`，置信度 `inferred`（只看头部与文件名推断）。所以它不能替代
「读懂目录结构」，只用于确认目标类型并对下一步工具选路（建议 `core_archive_show` 清点）。

### 2) 结构清点（core_archive_show）

```
12875 files in 14546 entries; 0 nested container(s)
evidence: ev_d03cd026012cc47a96794f793aed5a030f8c63de63b4ec0f71ba1514eaa4470a
confidence: observed
limitations: DMG/PKG/MSI/tarball 只列为一个文件，不展开
```

`by_kind` 里与本站相关的三项：`html 55`（含 `dist/` 构建产物）、`css 67`、`text 921`。
`inferred` 的 921 个 text 里包含 `content/pages/**/index.md` 与 `src/**`，也就是骨架与正文。

**读法**：`observed` 只说明"这些文件存在"，不说明"它们是干什么的"。真正的结论来自读源码，
证据在这里的作用是**确认清点边界**——没有隐藏的嵌套容器，55 个 HTML 与构建产物数量对得上。

## 从源码读出的框架结构（证据之外）

清点只能给规模，结构要读代码。以下是从 `src/` 与 `content/` 读出的、本站沿用的部分：

| 层 | 文件 | 作用 |
| --- | --- | --- |
| 结构唯一来源 | `content/site-index.json` | 左导航、首页路线图、上/下篇、搜索都读它 |
| 内容层 | `src/lib/content.js` | micromark 渲染、教学标记、h2/h3 锚点与目录 |
| 外壳 | `src/layouts/Site.astro` | 三栏、⌘K 命令面板、外观切换、代码复制 |
| 元信息 | `src/data/nav.js` | 品牌、栏目 icon/一句话、侧栏分组 |
| 品牌样式 | `public/site-*.css` | 用 `@layer site` + color-mix 派生，亮暗不跳 |
| 内容生成 | `tools/content_*.py` → `build_content.py` | 内容与模板解耦，改字只动 py |

## 这次改了什么、没改什么

**沿用**：三栏骨架、`site-index.json` 驱动、双轨（新手/完整）、术语悬停与荧光笔、⌘K 搜索、
代码复制、亮暗主题、栏目首页自动卡片、上一篇/下一篇。

**替换**：品牌（`teamai-cli 新手教程`）、主色（`#1f5fd0` → `#0e6b5e`，并把 `--tu-blue*` 全量改名为
`--tu-accent*`）、图标（提示符 → 三节点连线）、全部 50 页正文、首页七块板块、六栏目元信息。

**新增**：`tools/build_content.py` 里六栏目的中文文案与 `latest` 指向；正文里 17 篇 How-to 的四组分法。

## 一个踩到的坑（值得记）

`[[术语|解释]]` 写进 GFM 表格单元格会被竖线切断成两格。正解是写成 `[[术语\|解释]]`，
转义后 micromark 输出字面 `|`，`inlineMarkup` 才能匹配。已在该处修正并复验：
`class="tu-term" data-tip="Role：…"` 正常出现在 `<td>` 内。

## 复现步骤

```bash
cd /Users/gaoshan/WorkBuddy/teamai-cli-tutorial
python3 tools/build_content.py     # 50 个内容页 + site-index.json
npm run build                      # 52 个 HTML（50 内容页 + 首页 + 404）
npm run check                      # 自检：教学标记 0 残留、0 空锚点
```
