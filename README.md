# skills123.cc

本仓库索引本机 `~/.claude/skills/` 下可见的本地 skills，并按功能分类整理。

- 统计日期：2026-05-24
- 技能总数：140
- 可直接调用：16
- 来源目录：`~/.claude/skills/`

## 分类目录

- [飞书与协作](#飞书与协作)：18
- [数据表格与分析](#数据表格与分析)：5
- [图像视觉与设计](#图像视觉与设计)：24
- [论文研究与检索](#论文研究与检索)：16
- [写作内容与摘要](#写作内容与摘要)：20
- [认知学习与知识管理](#认知学习与知识管理)：11
- [商业投资与产品](#商业投资与产品)：9
- [代码工程与 GitHub](#代码工程与-github)：20
- [Agent 编排与工作流](#agent-编排与工作流)：6
- [系统工具与自动化](#系统工具与自动化)：6
- [其他](#其他)：5

## 飞书与协作

| Skill | 版本 | 调用 | 说明 |
|---|---:|:---:|---|
| **lark-base** | `1.2.0` | - | 当需要用 lark-cli 操作飞书多维表格（Base）时调用：适用于建表、字段管理、记录读写、视图配置、历史查询，以及角色/表单/仪表盘管理；也适用于把旧的 +table / +field / +record 写... |
| **lark-calendar** | `1.0.0` | - | 飞书日历（calendar）：提供日历与日程（会议）的全面管理能力。核心场景包括：查看/搜索日程、创建/更新日程、管理参会人、查询忙闲状态及推荐空闲时段。高频操作请优先使用 Shortcuts：+agenda（快速... |
| **lark-contact** | `1.0.0` | - | 飞书通讯录：查询组织架构、人员信息和搜索员工。获取当前用户或指定用户的详细信息、通过关键词搜索员工（姓名/邮箱/手机号）。当用户需要查看个人信息、查找同事 open_id 或联系方式、按姓名搜索员工、查询部门结构时使用 |
| **lark-doc** | `1.0.0` | - | 飞书云文档：创建和编辑飞书文档。从 Markdown 创建文档、获取文档内容、更新文档（追加/覆盖/替换/插入/删除）、上传和下载文档中的图片和文件、搜索云空间文档。当用户需要创建或编辑飞书文档、读取文档内容、在文... |
| **lark-drive** | `1.0.0` | - | 飞书云空间：管理云空间中的文件和文件夹。上传和下载文件、创建文件夹、复制/移动/删除文件、查看文件元数据、管理文档评论、管理文档权限、订阅用户评论变更事件。当用户需要上传或下载文件、整理云空间目录、查看文件详情、管... |
| **lark-event** | `1.0.0` | - | 飞书事件订阅：通过 WebSocket 长连接实时监听飞书事件（消息、通讯录变更、日历变更等），输出 NDJSON 到 stdout，支持 compact Agent 友好格式、正则路由、文件输出。当用户需要实时监... |
| **lark-im** | `1.0.0` | - | 飞书即时通讯：收发消息和管理群聊。发送和回复消息、搜索聊天记录、管理群聊成员、上传下载图片和文件、管理表情回复。当用户需要发消息、查看或搜索聊天记录、下载聊天中的文件、查看群成员时使用 |
| **lark-mail** | `1.0.0` | - | 飞书邮箱 — draft, compose, send, reply, forward, read, and search emails; manage drafts, folders, labels, conta... |
| **lark-minutes** | `1.0.0` | - | 飞书妙记：获取妙记基础信息（标题、封面、时长）和相关的 AI 产物（总结、待办、章节）。飞书妙记的 URL 格式为: http(s)://<host>/minutes/<minute-token> |
| **lark-openapi-explorer** | `1.0.0` | - | 飞书/Lark 原生 OpenAPI 探索：从官方文档库中挖掘未经 CLI 封装的原生 OpenAPI 接口。当用户的需求无法被现有 lark-* skill 或 lark-cli 已注册命令满足，需要查找并调用原... |
| **lark-shared** | `1.0.0` | - | 飞书/Lark CLI 共享基础：应用配置初始化、认证登录（auth login）、身份切换（--as user/bot）、权限与 scope 管理、Permission denied 错误处理、安全规则。当用户需... |
| **lark-sheets** | `1.1.0` | - | 飞书电子表格：创建和操作电子表格。创建表格并写入表头和数据、读取和写入单元格、追加行数据、在已知电子表格中查找单元格内容、导出表格文件。当用户需要创建电子表格、批量读写数据、在已知表格中查找内容、导出或下载表格时使... |
| **lark-skill-maker** | `1.0.0` | - | 创建 lark-cli 的自定义 Skill。当用户需要把飞书 API 操作封装成可复用的 Skill（包装原子 API 或编排多步流程）时使用 |
| **lark-task** | `1.0.0` | - | 飞书任务：管理任务和清单。创建待办任务、查看和更新任务状态、拆分子任务、组织任务清单、分配协作成员。当用户需要创建待办事项、查看任务列表、跟踪任务进度、管理项目清单或给他人分配任务时使用 |
| **lark-vc** | `1.0.0` | - | 飞书视频会议：查询会议记录、获取会议纪要产物（总结、待办、章节、逐字稿）。1. 查询已经结束的会议数量或详情时使用本技能(如昨天 \| 上周 \| 今天已经开过的会议等场景)，查询未开始的会议日程使用 lark-c... |
| **lark-whiteboard** | `-` | - | 当用户要求在飞书云文档中绘制图表，或使用飞书画板绘制架构图、流程图、思维导图、时序图或其他可视化图表时使用此 skill |
| **lark-wiki** | `1.0.0` | - | 飞书知识库：管理知识空间和文档节点。创建和查询知识空间、管理节点层级结构、在知识库中组织文档和快捷方式。当用户需要在知识库中查找或创建文档、浏览知识空间结构、移动或复制节点时使用 |
| **lark-workflow-meeting-summary** | `1.0.0` | - | 会议纪要整理工作流：汇总指定时间范围内的会议纪要并生成结构化报告。当用户需要整理会议纪要、生成会议周报、回顾一段时间内的会议内容时使用 |

## 数据表格与分析

| Skill | 版本 | 调用 | 说明 |
|---|---:|:---:|---|
| **dbs-benchmark** | `-` | - | dontbesilent 对标分析。用五重过滤法帮你找到值得模仿的对标，排除一切关于「我」的噪音。 触发方式：/dbs-benchmark、/对标、「帮我找对标」「我该模仿谁」 Benchmark analysis... |
| **review-analyzer-skill** | `1.0.0` | - | AI驱动的电商评论深度分析工具，支持22维度智能标签、用户画像识别、VOC洞察和可视化看板生成。 当用户需要以下功能时触发： - 分析电商产品评论（Amazon/eBay/AliExpress等平台） - 从评论中... |
| **sn-da-excel-workflow** | `-` | - | Multi-step workflow for Excel data analysis |
| **sn-da-large-file-analysis** | `-` | - | High-performance analysis for Excel datasets with 10k+ rows. Provides streaming read via openpyxl read_only... |
| **vega** | `-` | - | Create data-driven charts with Vega-Lite (simple) and Vega (advanced). Best for bar, line, scatter, heatmap... |

## 图像视觉与设计

| Skill | 版本 | 调用 | 说明 |
|---|---:|:---:|---|
| **baidu-image-gen** | `-` | - | Generate images via Baidu ERNIE API (AI Studio) and save to local files. Use as a backend engine for image-... |
| **baoyu-imagine** | `1.58.0` | - | AI image generation with OpenAI GPT Image 2, Azure OpenAI, Google, OpenRouter, DashScope, Z.AI GLM-Image, M... |
| **baoyu-infographic** | `1.58.0` | - | Generate professional infographics with 21 layout types and 22 visual styles. Analyzes content, recommends... |
| **baoyu-xhs-images** | `1.56.2` | - | [Deprecated: use baoyu-image-cards] Generates Xiaohongshu (Little Red Book) image card series with 12 visua... |
| **dbs-xhs-title** | `-` | - | 小红书标题公式工具。从 75 个验证过的爆款公式中，帮你挑对的、用对的、理解为什么用这个。 触发方式：/dbs-xhs-title、/小红书标题、「帮我起个小红书标题」「小红书标题公式」 Xiaohongshu t... |
| **design-exploration** | `-` | - | 新功能设计探索流程。当用户有模糊想法要做新功能/新模块时使用。通过"需求收敛 → 技术调研 → ASCII 批量探索 → HTML 设计稿 → 全状态覆盖 → 需求总结"的结构化流程，从模糊想法产出可交付的设计参考... |
| **image-assistant** | `-` | - | 配图助手 - 把文章/模块内容转成统一风格、少字高可读的 16:9 信息图提示词；先定“需要几张图+每张讲什么”，再压缩文案与隐喻，最后输出可直接复制的生图提示词并迭代 |
| **ljg-present** | `3.0.0` | 是 | 演讲铸造器（Outline-Faithful）。基于 orgmode/markdown outline 层级 1:1 视觉化呈现——色块大字、ultra-bold 错位，原文不动只做美化。三档主题色 black/r... |
| **ljg-roundtable** | `-` | - | Structured roundtable discussion framework with a truth-seeking moderator who invites representative figure... |
| **ljg-skill-map** | `1.0.0` | 是 | Skill map viewer. Scans all installed skills and renders a visual overview — name, version, description, ca... |
| **nano-banana-pro-prompts-recommend-skill** | `-` | - | Recommend suitable prompts from 6000+ Nano Banana Pro image generation prompts based on user needs. Use thi... |
| **pdf-to-wechat** | `-` | - | 将 PDF 幻灯片（Slide Deck）转换为微信公众号格式的 HTML 文章，完整保留每页配图。自动提取每页标题文字作为章节分段，图片以 base64 内嵌到 HTML（离线可看）。使用微信公众号友好的 CSS... |
| **smart-illustrator** | `-` | - | 智能配图与 PPT 信息图生成器。支持三种模式：(1) 文章配图模式 - 分析文章内容，生成插图；(2) PPT/Slides 模式 - 生成批量信息图；(3) Cover 模式 - 生成封面图。所有模式默认生成图... |
| **sn-da-image-caption** | `-` | - | Use this skill when image files (.png, .jpg, .jpeg, .gif, .webp, .bmp) are the primary input and the user n... |
| **sn-image-base** | `-` | - | Base-layer skill for the SenseNova-Skills project, providing low-level APIs for image generation, recogniti... |
| **sn-image-enhance** | `-` | - | 提示词增强 + 生图两步流程。在生图前调用 LLM 将短提示词扩写为结构化版本，再送入 sn-image-base 生图。解决 --enhance 参数不存在的问题 |
| **sn-image-imitate** | `-` | - | Generates a new image that imitates the style of a reference image while updating content based on user int... |
| **sn-image-resume** | `-` | - | Generates a designed portfolio-resume image from resume content provided in conversation text. Extracts opt... |
| **sn-infographic** | `-` | - | Generates professional infographics with various layout types and visual styles. Analyzes content, recommen... |
| **sn-md-to-html-report** | `-` | - | 将 Markdown 文档转换为美观、舒适、结构清晰、可直接打开的 HTML 长篇报告。适用于把 .md 文件转成 HTML、统一研究报告/行业报告/调研文档版式、生成可离线分享的单文件网页报告、嵌入或校验本地图片... |
| **sn-ppt-creative** | `-` | - | Creative-mode PPT pipeline. One full-page 16:9 PNG per slide. LLM / VLM calls go through sn-ppt-standard/li... |
| **sn-ppt-doctor** | `-` | - | Environment diagnostic for the PPT family. Validates sn-image-base, API keys, Node runtime, and optional de... |
| **sn-ppt-entry** | `-` | - | Entry point for PPT generation. Collects role / audience / scene / page_count / ppt_mode (creative or stand... |
| **sn-ppt-standard** | `-` | - | Standard-mode PPT pipeline. All LLM / VLM / T2I calls are wrapped in a single CLI entry (scripts/run_stage.... |

## 论文研究与检索

| Skill | 版本 | 调用 | 说明 |
|---|---:|:---:|---|
| **ljg-paper** | `4.9.0` | 是 | Paper reader for non-academics. Takes a paper and extracts its ideas for personal use. Focuses on understan... |
| **ljg-paper-flow** | `1.0.2` | 是 | Paper workflow: read papers + cast cards in one go. Takes one or more arxiv links, paper URLs, PDFs, or pap... |
| **ljg-paper-river** | `1.0.0` | 是 | 论文倒读法：给一篇论文，递归找出它批判和改进的前序论文（最多5层），再找它之后的最新进展，从源头正向讲述问题演化史。以问题为轴，费曼式讲解每篇论文看到的问题和解法创新 |
| **ljg-qa** | `-` | 是 | 信息提问机。给一篇文章/论文/书，把核心观点抽成 Q-A 对——Question 切要害，不教科书；Answer 简洁清晰，有形式化收口，逻辑链完整。读者顺 Q 链走过，每个 A 砸下一枚钉子，复现作者整套推理 |
| **ljg-read** | `1.0.0` | 是 | Reading companion agent. Accompanies user through any text (books, articles, essays, papers, news) with tra... |
| **ljg-travel** | `1.0.0` | 是 | Deep travel research workflow for museums and ancient architecture. Input a city name, auto-generates struc... |
| **sn-deep-research** | `-` | - | 深度调研编排器，覆盖 规划→分维度取证→综合→成稿（report.md）全流程，产物落盘到 report_dir，支持断点续跑；启动前必须用一次极小的通用 web_search 探测确认当前会话搜索能力可用，探测失... |
| **sn-dimension-research** | `-` | - | 深度研究中的单维度执行与多源搜索整合；当 plan.json 已定义维度，需要按 dimension.search_strategy 调用合适的搜索能力做多轮检索、筛选证据、交叉验证，并写入 sub_reports... |
| **sn-report-format-discovery** | `-` | - | 发现特定报告类型的结构规范与写作约束；当需要判断“这类报告应该长什么样”、为报告生成章节结构/必备元素/风格约束，或为 deep research 的 `report_shape` 提供依据时使用。适用于行业/市场... |
| **sn-research-planning** | `-` | - | 深度研究的精简计划；当需要仅基于 request.md 生成 plan.json，一次性完成研究定界、报告格式发现、结构设想、维度拆解、关键问题、搜索策略、依赖、执行顺序和完成标准时使用 |
| **sn-research-report** | `-` | - | 基于已有研究材料或草稿生成/修改最终 Markdown 研究报告的成稿 skill。遇到以下情况使用：①已有 deep research 产物 `synthesis.md`、`plan.json`、`sub_rep... |
| **sn-research-synthesis** | `-` | - | 深度研究的综合判断；当多个 sub_reports 已完成，需要产出 synthesis.md，明确主线判断、证据强弱、跨维度共识、关键冲突、冲突解释、不确定性，以及对原始问题的回答时使用。它用于“先想清楚结论”，... |
| **sn-search-academic** | `-` | - | 搜索学术论文和百科知识：ArXiv 预印本、Semantic Scholar（含引用数）、PubMed 生医文献、Wikipedia 百科。支持按章节读取 ArXiv HTML 全文和 PMC 开放获取全文，适合学... |
| **sn-search-social-cn** | `-` | - | 搜索中文社交平台：B站视频、知乎问答、抖音视频。部分平台需要 cookie 认证，稳定性因平台而异 |
| **sn-search-social-en** | `-` | - | 搜索英文社交平台：Reddit 帖子、Twitter/X 推文、YouTube 视频。用于获取英文社区讨论和视频内容 |
| **yao-tutorial-skill** | `-` | - | Create standalone beginner tutorial packages from a topic or supplied references, with adaptive research, c... |

## 写作内容与摘要

| Skill | 版本 | 调用 | 说明 |
|---|---:|:---:|---|
| **baoyu-wechat-summary** | `0.1.0` | - | Summarizes WeChat group chat highlights into a structured digest using the local wx-cli binary (https://git... |
| **dbs-ai-check** | `-` | - | dontbesilent AI 写作特征识别。扫描文案中的 AI 生成痕迹，输出检测报告。默认只诊断不改。 触发方式：/dbs-ai-check、/AI检测、「帮我看看有没有 AI 味」「检测一下 AI 特征」 A... |
| **dbs-content** | `-` | - | dontbesilent 内容创作诊断。选题通过后，诊断怎么把这个选题做成好内容。 触发方式：/dbs-content、/内容诊断、「这个内容怎么做」「帮我看看这个文案」 Content creation diag... |
| **humanizer-zh** | `-` | - | 去除文本中的 AI 生成痕迹。适用于编辑或审阅文本，使其听起来更自然、更像人类书写。 基于维基百科的"AI 写作特征"综合指南。检测并修复以下模式：夸大的象征意义、 宣传性语言、以 -ing 结尾的肤浅分析、模糊的... |
| **ljg-card** | `2.3.0` | 是 | Content caster (铸). Transforms content into PNG visuals. Seven molds: -l (default) long reading card, -i in... |
| **ljg-plain** | `5.0.0` | 是 | Cognitive atom: Plain (白). Rewrites any content so a smart 12-year-old groks it. Structure-free — form foll... |
| **ljg-writes** | `6.3.0` | 是 | 写作引擎。像手术刀剖开一个观点，一层层剥到底。1000-1500 字 |
| **md2wechat** | `-` | - | Convert Markdown to WeChat Official Account HTML. Use this whenever the user wants WeChat article conversio... |
| **md2wechat-skill** | `1.10.0` | - | 将 Markdown 文章转换为微信公众号格式的 AI 技能，支持多种主题和 API/AI 两种模式 |
| **neat-freak** | `-` | - | neat-freak Skill Summary |
| **podcast-workflow** | `-` | - | 播客处理一站式工作流。支持两种入口： (1) 直接处理：提供 YouTube 链接，直接进入处理流程 (2) 更新检查：获取关注博主的最新更新，用户挑选后处理 功能：字幕提取 → content-digest 处理... |
| **prd-doc-writer** | `-` | - | Write and iteratively refine PRD/需求文档 with a story-driven structure and strict staged confirmations (journe... |
| **Skill Evolution Manager** | `-` | - | 专门用于在对话结束时，根据用户反馈和对话内容总结优化并迭代现有 Skills 的核心工具。它通过吸取对话中的“精华”（如成功的解决方案、失败的教训、特定的代码规范）来持续演进 Skills 库 |
| **thought-mining** | `-` | - | 思维挖掘助手 - 通过对话帮助用户把脑子里的零散想法倒出来、记录下来、整理成文章。覆盖从思维挖掘到成稿的完整流程 |
| **web-article-translator** | `-` | - | 翻译在线文章为中文并保存为 Markdown 格式。当用户需要翻译网页文章、博客文章时使用此技能，例如："翻译这篇文章 https://example.com/article"、"把这个 URL 的文章翻译成中文并保存" |
| **web-scraper** | `-` | - | Fetch and extract content from web pages, converting HTML to clean markdown |
| **wewrite** | `-` | - | 微信公众号内容全流程助手：热点抓取 → 选题 → 框架 → 内容增强 → 写作 → SEO → 视觉AI → 排版推送草稿箱。 触发关键词：公众号、推文、微信文章、微信推文、草稿箱、微信排版、选题、热搜、 热点抓取... |
| **writing-assistant** | `-` | - | 写作助手 - 当用户说"我想写XX"、"帮我梳理选题"、"怎么形成框架"、"给我组织思路"时触发。根据观点清晰度自动选择最优路线：清晰观点走"框架→内容"，模糊观点走"挖掘→选题→框架→内容" |
| **x-blogger-analyzer** | `-` | - | 分析 X/Twitter 博主的内容风格、创作策略和增长原因。当用户输入 X/Twitter 博主链接（如 https://x.com/username 或 https://twitter.com/username... |
| **xiaohu-wechat-format** | `-` | - | xiaohu-wechat-format |

## 认知学习与知识管理

| Skill | 版本 | 调用 | 说明 |
|---|---:|:---:|---|
| **dbs-deconstruct** | `-` | - | dontbesilent 概念拆解。用维特根斯坦 + 奥派经济学的方法，把模糊的商业概念拆到原子级别。 触发方式：/dbs-deconstruct、/拆概念、「帮我拆解这个概念」「这个词到底什么意思」 Concep... |
| **lesson-builder** | `-` | - | 帮助用户通过讨论完成课程大纲和课件。当用户说"备课"、"做课件"、"准备课程"时触发 |
| **ljg-learn** | `-` | - | Deep concept anatomist that deconstructs any concept through 8 exploration dimensions (history, dialectics,... |
| **ljg-rank** | `-` | 是 | 给一个领域，找出背后真正撑着它的几根独立的力。十几个现象砍到不可再少的生成器——砍完能把现象一个个生回来，才算数 |
| **ljg-relationship** | `-` | - | Relationship analyst combining structural diagnostics (5-layer framework) with psychoanalytic depth (transf... |
| **ljg-think** | `-` | 是 | 追本之箭——纵向深钻思维工具。给一个观点、现象或问题，像箭一样一路向下钻到不可再分的本质 |
| **ljg-word** | `1.0.1` | 是 | Deep-dive English word mastery tool. Deconstructs a single English word into core semantics and epiphany |
| **ljg-word-flow** | `1.0.1` | 是 | Word flow: deep-dive word analysis + infograph card in one go. Takes one or more English words, runs ljg-wo... |
| **notebooklm** | `-` | - | Use this skill to query your Google NotebookLM notebooks directly from Claude Code for source-grounded, cit... |
| **qiaomu-anything-to-notebooklm** | `-` | - | 多源内容智能处理器：支持微信公众号、网页、YouTube、播客（小宇宙/喜马拉雅）、PDF、Markdown等，自动上传到NotebookLM并生成播客/PPT/思维导图等多种格式。支持深度分析模式和飞书文档自动创建 |
| **thinking-partner** | `-` | - | 思考拍档 - 陪你从混沌中理清局面，锁定核心问题，拆解卡点，共创解法，落地行动 |

## 商业投资与产品

| Skill | 版本 | 调用 | 说明 |
|---|---:|:---:|---|
| **dbs** | `-` | - | dontbesilent 商业工具箱主入口。根据你的问题自动路由到最合适的诊断工具。 触发方式：/dbs、/商业、「帮我看看」 Main entry point for dontbesilent business... |
| **dbs-action** | `-` | - | dontbesilent 执行力诊断。用阿德勒心理学框架诊断你「知道该做什么但就是不做」的真正原因。 触发方式：/dbs-action、/action、「我知道该怎么做但就是不做」「为什么我总是拖延」 Execut... |
| **dbs-diagnosis** | `-` | - | dontbesilent 商业模式诊断。两种模式：问诊（消解你的问题）和体检（拆解你的商业模式）。 触发方式：/dbs-diagnosis、/问诊、「帮我看看商业模式」「诊断一下我的业务」「我有个商业问题」 Bus... |
| **dbs-hook** | `-` | - | dontbesilent 短视频开头优化。诊断开头问题 + 生成优化方案。 触发方式：/dbs-hook、/hook、「帮我优化开头」「开头怎么写」 Short video opening optimization... |
| **dbs-slowisfast** | `-` | - | dontbesilent 慢就是快。帮创业者找到看起来更慢但长期更快的方法，用摩擦建造资产。 触发方式：/dbs-slowisfast、/慢就是快、「有没有更慢的方法」「我是不是太快了」 Slow-is-fast... |
| **ljg-invest** | `-` | - | 投资分析, 生成一份深度投资分析报告。不做传统投资分析——核心判断是项目是否是一台「秩序创造机器」 |
| **product-naming** | `-` | - | 产品命名协作流程。当用户想给产品/项目/模块起名字时使用。通过"灵魂挖掘 → 约束提取 → 路线发散 → 方向选择 → 竞品验证 → 最终确认"的结构化流程，从模糊想法产出有品牌生命力的名字，避免拍脑袋起名 |
| **version-planner** | `-` | - | 帮助用户把产品需求拆解成渐进式版本规划。当用户说"拆版本"、"版本规划"、"MVP怎么做"、"分阶段实现"时触发 |
| **yao-business-skill** | `-` | - | Design, diagnose, and study business models from ideas, product websites, or company names |

## 代码工程与 GitHub

| Skill | 版本 | 调用 | 说明 |
|---|---:|:---:|---|
| **convex-create-component** | `-` | - | Convex Create Component |
| **github-repo-search** | `-` | - | 帮助用户搜索和筛选 GitHub 开源项目，输出结构化推荐报告。当用户说"帮我找开源项目"、"搜一下GitHub上有什么"、"找找XX方向的仓库"、"开源项目推荐"、"github搜索"、"/github-sear... |
| **github-to-skills** | `-` | - | Automated factory for converting GitHub repositories into specialized AI skills. Use this skill when the us... |
| **iga-pages** | `1.0.5` | - | Deploy frontend and full-stack projects to IGA Pages |
| **issue-triage** | `-` | - | GitHub Issue 处理协作流程。当用户收到 issue 需要分析和回复时使用。通过"诊断 → 定性 → 决策 → 回复"四步法，从一个 issue 产出准确的根因分析和得体的用户回复，避免误判问题类型或回复不专业 |
| **ljg-push** | `-` | 是 | 把 ~/.claude/skills/ljg-* 里所有更新过的 skills 同步到 github repo (ljg-skills)，先推 master 分支（org-mode 输出风格），再切 md 分支（m... |
| **llm-wiki-ingest** | `-` | - | Ingest GitHub repositories into the user's LLM Wiki following CLAUDE.md conventions. Handles clone, raw sou... |
| **meta-theory** | `3.0.0` | - | Meta Arsenal — governance and development orchestration skill. Always invoke when the user explicitly calls... |
| **planning-with-files** | `2.10.0` | - | Implements Manus-style file-based planning for complex tasks. Creates task_plan.md, findings.md, and progre... |
| **priority-judge** | `-` | - | 优先级判断助手 - 帮用户从混沌的待办事项中判断优先级，确定现在该做什么。当用户说"我有很多事要做"、"帮我理一下"、"排个优先级"、"今天该做什么"时触发 |
| **project-map-builder** | `-` | - | 生成或更新用户指定文件夹的 PROJECT_MAP.md。适用于用户要求目录地图/项目地图/代码仓概览/文件夹级说明/更新已有 PROJECT_MAP.md 的场景。必须先询问要扫描的文件夹范围，禁止默认全仓库扫描... |
| **qiaomu-markdown-proxy** | `2.0.0` | - | Fetch any URL as clean Markdown via proxy services or built-in scripts. Works with login-required pages lik... |
| **req-change-workflow** | `-` | - | Standardize requirement/feature changes in an existing codebase (especially Chrome extensions) by turning "... |
| **rss-aggregator** | `-` | - | Aggregates and summarizes recent updates from a predefined list of RSS feeds |
| **skill-creator** | `-` | - | Create new skills, modify and improve existing skills, and measure skill performance |
| **skill-doctor** | `-` | - | Scan local skill folders to inventory purpose, usage signals, cleanup priority, and safety risks, then gene... |
| **skill-manager** | `-` | - | Lifecycle manager for GitHub-based skills. Use this to batch scan your skills directory, check for updates... |
| **sn-search-code** | `-` | - | 搜索开发者资源：GitHub 仓库/代码/Issue、Stack Overflow 问答、Hacker News 讨论、HuggingFace 模型/数据集/Space。用于查找代码示例、开源项目、技术问答、预训练模型 |
| **ui-design** | `-` | - | UI 样式修改协作流程。当用户要求修改页面样式、调整布局、改 UI 细节时使用。通过"截图定位 → 现状描述 → 方案选择 → 改代码 → 微调"的结构化流程，减少沟通偏差，避免浪费 token |
| **weekly-report** | `-` | - | 帮助用户梳理周报，按照完整逻辑展示工作价值和边界。当用户说"写周报"、"周报"、"梳理周报"、"整理工作"时触发 |

## Agent 编排与工作流

| Skill | 版本 | 调用 | 说明 |
|---|---:|:---:|---|
| **agent-teams-playbook** | `4.7` | - | Cross-runtime Agent Teams orchestration playbook for Claude Code, Codex, OpenClaw, and Cursor. This skill s... |
| **ai-vc-due-diligence** | `1.0.0` | - | AI VC Due Diligence Agent Team - 多代理投资分析管道。对初创公司进行全面的投资尽职调查，包括公司研究、市场分析、财务建模、风险评估和专业报告生成。触发词：尽职调查、投资分析、VC分析... |
| **dbs-agent-migration** | `-` | - | Agent 工作台迁移。把任意项目整理成 Claude Code / Codex 双端一致、可长期维护的 Agent 工作台：审计规则文件、识别真源、统一命名并生成 bridge。 触发方式：/dbs-agent-... |
| **find-skills** | `-` | - | Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill f... |
| **lark-workflow-standup-report** | `1.0.0` | - | 日程待办摘要：编排 calendar +agenda 和 task +get-my-tasks，生成指定日期的日程与未完成任务摘要。适用于了解今天/明天/本周的安排 |
| **neudrive** | `-` | - | Use neuDrive as the canonical hub for platform import, export, listing, and status workflows through MCP pl... |

## 系统工具与自动化

| Skill | 版本 | 调用 | 说明 |
|---|---:|:---:|---|
| **backlog-manager** | `-` | - | 需求池管理。用户随时抛出想法/痛点，AI 负责追问、整理、合并、归档到需求池文件。用户准备开新版本时，协助从池中筛选。痛点驱动，不做提前排期 |
| **dbskill-upgrade** | `-` | - | 升级 dbskill 到最新版本 |
| **skills-cli** | `1.0.0` | - | Universal CLI for managing AI agent skills across 35+ agents (Claude Code, Cursor, OpenCode, etc.). Install... |
| **sn-image-doctor** | `-` | - | Environment diagnostic skill for SenseNova-Skills project. Checks that sn-image-base is properly installed... |
| **sn-skills-install** | `-` | - | 安装 SenseNova-Skills 到 Hermes skills 目录，以及配置 cc-connect 飞书授权。 用于：安装新skills、检查环境、飞书机器人授权配置 |
| **wx-cli** | `-` | - | wx-cli — 从本地微信数据库查询聊天记录、联系人、会话、收藏等。用户提到微信聊天记录、联系人、消息历史、群成员、收藏内容时，使用此 skill 安装并调用 wx-cli |

## 其他

| Skill | 版本 | 调用 | 说明 |
|---|---:|:---:|---|
| **dbs-chatroom** | `-` | - | 定向聊天室：根据话题推荐或接受用户指定的专家，模拟多角色对话。触发方式：/dbs-chatroom、/定向聊天室、「定向聊天室」 |
| **dbs-chatroom-austrian** | `-` | - | 哈耶克 × 米塞斯 × Claude 三人对话。奥派经济学视角的多角色讨论。 触发方式：/dbs-chatroom-austrian、/chatroom-austrian、/奥派、「奥派聊天室」 Austrian... |
| **log-viewer** | `-` | - | 查看和分析应用日志，帮助排查问题。当用户提到以下场景时触发： - 查日志、看日志、日志在哪 - 查一下问题、排查错误、debug - 刚才执行了什么、历史记录 - SkillLauncher 日志、应用日志 |
| **vision-exploration** | `-` | - | 终局愿景探索。用户抛出一个模糊 idea，AI 主导引导，通过"追问价值 → 挖掘动机 → 推导演化 → 画终局"的链路，帮用户看到未来最远的可能性。不设限，不收敛，纯发散 |
| **web-access** | `-` | - | web-access Skill |
