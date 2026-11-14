# REA 新手教程（rea-handbook）

一份第三方中文入门教程，讲 [REA](https://github.com/morluto/rea)（`rea-agents`）：一个给 AI 助手用的逆向工程 MCP 服务器。
目标读者是「想看懂一个软件怎么做的，但不做逆向工程」的人——不会汇编，也不想先学一堆工具。

- 54 篇内容，6 个栏目：新手入门 3 课 / 完整教程 9 步 / How-to 17 篇 / 术语 12 条 / 常见问题 / 站点资料 6 篇
- Astro 静态构建，三栏布局 + 全站搜索，桌面与手机都能读
- 事实依据官方仓库的 README、`docs/getting-started/`、`docs/reference/mcp-contracts.md`，
  并在本机 rea 6.7.0 / Node 22.22.2 / macOS 14 上核对过命令与输出

## 本地运行

```bash
npm install
npm run dev       # http://localhost:4424
npm run build     # 输出到 dist/
```

`node_modules` 是从同目录的 `dsh-superagent-tutorial` 直接复制的（同一套 Astro 版本）；如果依赖缺失，重新 `npm install` 即可。

## 目录

```text
tools/content_a.py       新手入门 3 课 + 完整教程 9 步
tools/content_b.py       How-to 17 篇（四组）+ 常见问题
tools/content_c.py       术语 12 条 + 站点资料 6 篇 + 六个栏目首页
tools/build_content.py   生成 content/pages/**/*.md 与 content/site-index.json
content/                 生成物，不要手改（会被覆盖）
src/data/nav.js          站点结构：栏目、图标、资料链接、搜索索引
src/lib/content.js       渲染层：Markdown → HTML、术语/高亮标记、页内目录
src/layouts/Site.astro   三栏外壳：顶栏、左导航、右目录、搜索、复制按钮
src/views/Home.astro     首页
public/xxd/              界面组件（随骨架自带，非商用许可，见下）
public/site.css          骨架样式
public/site-rea.css      本站品牌色与教程部件
scripts/verify.mjs       构建自检
scripts/search-sections.mjs  正文小节索引
docs/RESEARCH-craft-anything.md  craft-anything MCP 生成的研究记录
```

## 改文案的正确做法

只改 `tools/content_*.py`，然后：

```bash
npm run content && npm run build
```

直接改 `content/pages/` 会在下次 `npm run content` 时被删掉重写。

## 内容里的教学标记

| 写法 | 效果 |
| --- | --- |
| `[[词\|一句话解释]]` | 虚线下划线 + 悬停提示（**表格里必须写成 `\|`**，否则会被当成列分隔符） |
| `==重点==` | 荧光笔 |
| `++易错++` | 粗下划线 |
| `<div class="tu-note tu-note--warn">…</div>` | 提示框（`--ok` / `--tip` / `--warn`） |

## 验证

```bash
npm run build && npm run check
```

`verify.mjs` 检查：页面数、正文渲染、未渲染残留标记、空锚点、缺失资源。
另外两项是手写的临时检查（不随仓库跑）：

- 内链扫描：遍历 `dist/**/*.html` 的站内 `href`，当前 3896 条、0 死链
- 窄屏探测：同源 iframe 设 390 宽，读 `scrollWidth == clientWidth`，当前全部页面通过

## 版权与致谢

- 教程正文、栏目结构、首页文案：本站原创整理。
- 信息架构（三栏、入门三课 + 完整教程 + How-to + 术语 + FAQ）：参考 [xxd-pstack](https://github.com/nevertoday/xxd-pstack) 的公开写法，未复制其正文与插画。
- `public/xxd/` 是骨架自带的界面组件构建产物，适用它自己的许可（非商用免费），不是本站原创。
- 站内提到的产品名与商标归各自所有者。本教程不是 REA 官方文档。
