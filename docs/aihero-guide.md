# AI Hero 学习手册快照

`site/guides/aihero-handbook/` 是本地项目 `~/WorkBuddy/aihero-handbook`
在 2026-11-14 构建的静态快照，发布于
<https://skills123.cc/guides/aihero-handbook/>。源码不是 Git checkout。

## 与其他专题的关键差异：内容版权

此前四个专题（pstack、dsh-superagent、rea、teamai-cli）的教程文字都来自
MIT / Apache-2.0 等开放许可的仓库或官方公开文档。**本专题不同**：

- 全部英文内容来自 **https://www.aihero.dev/**（Matt Pocock 的付费 newsletter
  站点），**没有任何开放许可证**。
- 本专题是**非商业的中文翻译存档**：正文由 AI 辅助翻译为简体中文（代码块与链接
  保持原样），每页正文后带「原文」链接指向英文原站页面，译文仅供参考。
- 内容版权归 **Matt Pocock / AI Hero** 所有。**若站点转为商业用途或收到
  版权方异议，应下线本专题**；想支持作者请到原站订阅。
- 详细说明见快照根目录的 `SOURCE-README.md`。

## 快照与源码

- 快照：218 个 HTML，正文为简体中文（210 页 AI 辅助翻译，GLM 经 WorkBuddy
  云服务 LLM API，翻译管线在源码 `tools/translate.mjs`，支持断点续跑），
  导航与搜索索引同步中文化。
- 源码归档在 `docs/aihero-handbook-source/source/`，清单
  `source-sha256.txt`，锁文件 `package-lock.json`（含翻译脚本与 SDK 依赖）。
  内容数据源（wigolo 抓取产物）不在仓库内，体积原因保留在工作区
  `.workbuddy/craft/aihero-learn/wigolo/pages/`；重建需该目录存在。
- 构建环境：`SITE_BASE=/guides/aihero-handbook SITE_URL=https://skills123.cc
  SITE_TITLE_SUFFIX=" · Skills123" SITE_HOME=/ SITE_HOME_LABEL=Skills123
  npm run build`，随后 `SITE_BASE=… npm run check` 自检（218 页、0 死链）。
- 测试：`tests/aihero-guide.test.mjs`（首页入口、计数、canonical、站内
  链接、搜索索引盖章、每页来源声明）。专题计数断言（rea / teamai 测试中
  的「6 个专题」）随本次新增专题同步 +1。

## 结构

六个栏目：学习地图（原站 /learn + 4 条路线 + 词典总目录 + 关于）、
深度文章（75）、技能库（38，含安装命令）、AI 编码词典（72 词条）、
Sandcastle 文档（16）、工作坊（3）。
