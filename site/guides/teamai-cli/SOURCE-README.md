# teamai-cli 新手教程

一份**非官方**的中文入门教程，讲 [`Tencent/teamai-cli`](https://github.com/Tencent/teamai-cli)（TeamAI）：
把团队的 skills、rules、agents、hooks、MCP、env、models 放进一个 Git 仓库，成员 `init` 一次，
之后每次开 AI 会话自动同步最新资源。

> 本站只做讲解。命令、参数与行为请以官方仓库为准，本文核对到 CLI `0.30.0`（2026-11）。

## 站点结构

| 栏目 | 路径 | 内容 |
| --- | --- | --- |
| 新手入门 | `/start/` | 三课 20 分钟：它解决什么 → 装上它 → 第一次接入 |
| 完整教程 | `/guide/` | 九步：是什么、准备、安装、init、pull 落点、push、角色项目、工作流、维护 |
| How-to 实操 | `/howto/` | 17 篇，分四组：上手五件事、资源怎么写、谁收到什么、出问题怎么办 |
| 术语表 | `/wiki/` | 10 个概念：一句话、打个比方、在这个项目里、常见误区 |
| 常见问题 | `/faq/` | 费用、Git 平台、文件改动、密钥、多人协作、离线、工具支持 |
| 站点资料 | `/reference/` | 概念全景图、10 个坑、命令速查、适不适合你、关于 |

共 44 篇正文 + 6 个栏目首页，50 个内容页。

## 本地运行

```bash
npm install          # 只依赖 astro + micromark
npm run content      # 由 tools/content_*.py 生成 content/pages 与 site-index.json
npm run dev          # http://localhost:4423
npm run build        # 输出到 dist/
npm run check        # 构建后自检：页面数、教学标记、资源、内链
```

## 内容怎么改

内容与模板分开：

```text
tools/content_a.py     新手入门 3 课 + 完整教程 9 步
tools/content_b.py     How-to 17 篇 + 常见问题
tools/content_c.py     术语 10 条 + 站点资料 5 篇 + 各栏目首页导语
tools/build_content.py 汇总生成 content/pages/**/*.md 与 content/site-index.json
content/site-index.json 站点结构唯一来源：左导航、首页路线图、上/下篇、搜索都读它
src/data/nav.js        品牌、栏目元信息、侧栏分组、搜索轻索引
src/lib/content.js     Markdown 渲染、教学标记、页内目录
src/layouts/Site.astro 三栏外壳、搜索、外观切换、代码复制按钮
public/site-teamai.css 品牌色（深青）、首页板块与教程部件
```

改文字只动 `tools/content_*.py`，然后 `npm run content && npm run build`。

正文支持三种教学标记（实现在 `src/lib/content.js`）：

- `[[术语|一句话解释]]` → 虚线下划线 + 悬停解释（表格里要写成 `[[术语\|解释]]`）
- `==重点==` → 荧光笔
- `++易错++` → 粗下划线
- `**粗体**` → 粗体（中文紧贴也能正确解析）

另有 `.tu-note` / `.tu-note--warn` / `--tip` / `--amber` 几种提示框，直接在正文里写 HTML。

## 内容依据

- `README.zh-CN.md`：产品概览、能力表、快速开始、安装方式
- `docs/usage-guide.zh-CN.md`、`docs/product-overview.zh-CN.md`
- `docs/guide/zh-CN/`：getting-started、distribution、sharing、member-guide、skill、faq、reference、windows、providers
- `skill-data/core/references/commands.md`：完整命令参考

信息架构参考 [nevertoday/xxd-pstack](https://github.com/nevertoday/xxd-pstack) 的公开做法：
数据驱动导航、新手/完整双轨、每页一句话、可照抄命令、「你应该看到什么 / 不对怎么办」、
术语悬停、全站搜索、亮暗主题、三栏骨架。

本站文字、示例命令、类比与页面组织为原创撰写，没有复制上述仓库的教程正文、文案或插画。

## 工程说明

- 构建产物 `dist/` 是纯静态站，任何静态托管都能放。
- 部署到自己的域名时，把环境变量 `SITE_URL` 设成实际地址（影响 canonical / og:url）。
- 依赖版本固定为 `astro@7.2.8`、`micromark@4.0.3`、`micromark-extension-gfm@3.0.0`。

## 许可

- 本站原创文字与站点代码：MIT
- `public/xxd/` 下的 UI Kit 构建产物：遵循其自带许可（PolyForm Noncommercial 1.0.0，非商用免费、商用需授权），不在本站 MIT 范围之内
- 上游 `Tencent/teamai-cli`：MIT，版权归腾讯及贡献者
