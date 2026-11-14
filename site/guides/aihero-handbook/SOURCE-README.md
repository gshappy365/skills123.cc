# SOURCE-README — AI Hero 学习手册（aihero-handbook）

本目录（`site/guides/aihero-handbook/`）是本地项目 `~/WorkBuddy/aihero-handbook`
在 2026-11-14 构建的静态快照，发布于
`https://skills123.cc/guides/aihero-handbook/`。构建环境：
`SITE_BASE=/guides/aihero-handbook SITE_URL=https://skills123.cc
SITE_TITLE_SUFFIX=" · Skills123" SITE_HOME=/ SITE_HOME_LABEL=Skills123`。

## 内容来源与版权（重要）

- 全部英文内容抓取自 **https://www.aihero.dev/**（Matt Pocock 的 AI Hero 站点），
  抓取时间 2026-11-14，工具为 wigolo（sitemap 爬取 + 逐页 JS 渲染）。
- **内容版权归 Matt Pocock / AI Hero 所有**。该站点内容没有任何开放许可证；
  本专题为非商业的个人学习存档，仅保留原文与栏目结构，未做翻译或改写。
  每页页头/页尾带原站 URL（frontmatter `source` 与正文「原文」链接）。
- **若本站用途变为商业用途，或 AI Hero 方面提出异议，应立即下线本专题。**
- UI Kit（`xxd/`）为 PolyForm Noncommercial 1.0.0（未修改的 `xxd/LICENSE`
  随快照保留），本站为非商业用途；商用需另行授权。
- 骨架信息架构参考公开的 nevertoday/xxd-pstack 教程方法，与 AI Hero 官方无关。

## 快照内容

- 218 个 HTML：216 个内容页（学习地图 8 / 深度文章 75 / 技能库 38 /
  AI 编码词典 73 / Sandcastle 文档 16 / 工作坊 3 + 关于页）+ 首页 + 404。
- 原站站内链接已改写为本专题对应页面；未收录页面（如 /cohorts/、/topics/）
  还原为原站绝对地址。
- `search-sections.json` 为全文搜索细索引，页面内 data-sections 带内容指纹。

## 重建方式

源码保留在 `docs/aihero-handbook-source/source/`（清单见同目录
`source-sha256.txt`），依赖锁文件为 `docs/aihero-handbook-source/package-lock.json`。
复现步骤：拷贝 source 到干净目录 → `shasum -a 256 -c` 校验 → 数据源
（wigolo 抓取产物）位于工作区
`.workbuddy/craft/aihero-learn/wigolo/pages/` → `python3 tools/build_content.py`
生成 `content/` → `npm ci --ignore-scripts` → 按上述环境变量 `npm run build` →
`SITE_BASE=… npm run check` 自检。
