# dsh-superagent 新手教程

一份**非官方**的中文入门教程，讲 [`deepseek-ai/dsh-superagent-prototype`](https://github.com/deepseek-ai/dsh-superagent-prototype)：
一个盯着 GitHub（可选飞书）的主动式编码智能体，被允许的人 @ 它之后，它开工单、自己干活、开 PR，只在需要人时开口。

> 上游是研究原型，仓库自己写着「不是 DeepSeek 官方产品、不是生产级软件」。本站只做讲解，命令与行为请以官方仓库为准。

## 站点结构

| 栏目 | 路径 | 内容 |
| --- | --- | --- |
| 新手入门 | `/start/` | 三课 20 分钟：它能帮你什么 → 装上它 → 第一次派活 |
| 完整教程 | `/guide/` | 九步：边界、环境、安装、授权、第一个任务、面板、工单生命周期、审阅合并、升级扩展 |
| How-to 实操 | `/howto/` | 17 篇，一篇一件事，都带可照抄的请求（分四组） |
| 术语表 | `/wiki/` | 10 个核心概念：一句话、打个比方、在这个项目里、常见误区 |
| 常见问题 | `/faq/` | 费用、边界、安全、噪音、升级 |
| 站点资料 | `/reference/` | 概念全景图、12 个坑、命令速查、适不适合你、关于 |

共 44 篇正文 + 6 个栏目首页。

## 本地运行

```bash
npm install          # 只依赖 astro + micromark
npm run content      # 由 tools/content_*.py 生成 content/pages 与 site-index.json
npm run dev          # http://localhost:4422
npm run build        # 输出到 dist/
npm run check        # 构建后自检：页面数、教学标记、资源、内链
```

## 内容怎么改

内容与模板是分开的：

```text
tools/content_a.py     新手入门 3 课 + 完整教程 9 步
tools/content_b.py     How-to 17 篇 + 常见问题
tools/content_c.py     术语 10 条 + 站点资料 5 篇 + 各栏目首页文案
tools/build_content.py 汇总生成 content/pages/**/*.md 与 content/site-index.json
content/site-index.json 站点结构唯一来源：左导航、首页路线图、上/下篇、搜索都读它
src/data/nav.js        品牌、栏目元信息、侧栏分组、搜索轻索引
src/lib/content.js     Markdown 渲染、教学标记、页内目录
src/layouts/Site.astro 三栏外壳、搜索、外观切换、代码复制按钮
```

改文字只动 `tools/content_*.py`，然后 `npm run content && npm run build`。

正文里支持三种教学标记（在 `src/lib/content.js` 里实现）：

- `[[工单|Ticket：一个被授权的工作单元]]` → 虚线下划线 + 悬停解释
- `==重点==` → 荧光笔
- `**粗体**` → 粗体（中文紧贴也能正确解析）

## 内容依据

- 官方 `README.md`、`SETUP.md`、`package.json`、`examples/profile.cordis.patch.yml`
- 官方 `docs/000`–`008`（理念、领域模型、授权、执行、提示词、面板、部署、架构、扩展手册）
- 信息架构参考 [nevertoday/xxd-pstack](https://github.com/nevertoday/xxd-pstack) 的公开做法：数据驱动导航、新手/完整双轨、每页一句话、可照抄提示词、「你应该看到什么 / 不对怎么办」、术语悬停、全站搜索、亮暗主题

本站文字、示例请求、类比与页面组织为原创撰写，没有复制上述仓库的教程正文、文案或插画。

## 许可

- 本站原创文字与站点代码：MIT
- `public/xxd/` 下的 UI Kit 构建产物：遵循其自带许可（PolyForm Noncommercial 1.0.0，非商用免费、商用需授权），不在本站 MIT 范围之内
- 上游 `dsh-superagent-prototype`：MIT，版权归 DeepSeek Harness Team
