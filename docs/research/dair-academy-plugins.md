# DAIR Academy Plugins 收录调研

## 结论摘要

- 调研对象：[`dair-ai/dair-academy-plugins`](https://github.com/dair-ai/dair-academy-plugins)
- 调研快照：提交 [`945b237`](https://github.com/dair-ai/dair-academy-plugins/tree/945b237049a08765c0cd164774f974647a6b7f97)，提交时间为 2026-07-18。
- 官方仓库当前列出 **8 个插件**，且每个插件当前都只有一个同名 `SKILL.md`，因此第一版可以按“一个插件 = 技能包内一个技能”映射。[README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/README.md) · [marketplace.json](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/.claude-plugin/marketplace.json)
- 用户最初提供的 README 页面曾只显示 7 项；当前快照新增了 `x-agent-intelligence`。收录范围需要在下一阶段明确选择“按当前仓库收录 8 项”还是“固定收录最初 7 项”。
- 这些项目是 **Claude Code 插件**，统一安装方式为先添加 marketplace，再安装指定插件。[README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/README.md)
- 依赖差异显著：两项需要 Fireworks API，一项需要 Gemini API，一项需要 X MCP，一项需要 YouTube/Python/FFmpeg 工具链；网站需要新增依赖、环境变量和安装说明字段。
- 仓库级 README 只声明“open source，具体见各插件许可证”。当前快照中只有 `survey-generator` 和 `wiki-builder` 找到明确的 MIT 许可证文件，其余 6 项不能据此标注为 MIT。[仓库 README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/README.md#license)

## 访谈决定

- **2026-07-19：收录范围**：按官方当前快照收录全部 8 项，包括新增的 `x-agent-intelligence`。
- **2026-07-19：主要任务场景**：DAIR Academy 技能包归入“研究”；包内偏内容或监控的技能仍保留在该技能包中，不拆分到其他任务场景。
- **2026-07-19：第一版详情范围**：扩展现有共享详情模块，统一展示安装命令、适用平台、外部依赖、环境变量、输出产物和许可证；第一版不制作 8 个独立长文详情页。
- **2026-07-19：包内分组**：DAIR Academy 技能包采用“视觉生成、学习与课程、研究与调研、知识管理、情报监控”5 个技能方向。它们只用于包内筛选，不作为全站任务场景；分组名称同时进入技能搜索索引。
- **2026-07-19：安装入口**：每个具体技能详情提供“复制安装命令”按钮，复制该技能的 `/plugin install <plugin-name>@dair-academy-plugins`；页面不展示 Marketplace 添加命令。安装命令与技能触发方式使用独立字段。
- **2026-07-19：实现顺序**：接入 DAIR Academy 前先做小范围数据层重构，统一技能包、技能、分组和详情字段的读取，并为新增字段增加校验；不改变现有视觉和路由。完成后再录入 8 项技能。
- **2026-07-19：更新策略**：第一版使用固定上游提交快照和手动更新。页面记录上游 commit，数据随网站构建发布，浏览器运行时不调用 GitHub API。
- **2026-07-19：名称与路由**：中文名称为“DAIR Academy 技能包”，英文标识为“DAIR ACADEMY PACKAGE”，数据 ID 为 `dair-academy`，永久路由为 `/packages/dair-academy/`。

## 仓库级安装与结构

添加 marketplace：

```text
/plugin marketplace add dair-ai/dair-academy-plugins
```

安装单个插件：

```text
/plugin install <plugin-name>@dair-academy-plugins
```

官方约定每个插件目录包含 `.claude-plugin/plugin.json`、用户 README 和 `skills/<skill-name>/SKILL.md`，环境变量模板及其他参考文件按需增加。[插件结构说明](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/README.md#plugin-structure)

## 插件清单

### 1. image-generator

- **插件 / 技能名**：`image-generator`，插件版本 `1.1.2`。[plugin.json](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/image-generator/.claude-plugin/plugin.json) · [SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/image-generator/skills/image-generator/SKILL.md)
- **中文概述**：使用 Gemini Nano Banana Pro 生成和编辑图片，支持文生图、图片修改、多图组合、常见宽高比和最高 4K 输出。[README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/image-generator/README.md)
- **典型触发**：生成图片、编辑照片、创建 Logo、制作产品样机或进行风格转换。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/image-generator/skills/image-generator/SKILL.md)
- **安装命令**：`/plugin install image-generator@dair-academy-plugins`。
- **外部依赖**：Google Gemini `gemini-3-pro-image-preview`；技能还给出 `google-genai`、Pillow 及 shell/curl 路径。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/image-generator/skills/image-generator/SKILL.md)
- **环境变量**：必需 `GEMINI_API_KEY`。[.env.example](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/image-generator/skills/image-generator/.env.example)
- **主要产物**：本地 PNG 等图片文件；文件名由具体调用流程决定。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/image-generator/skills/image-generator/SKILL.md)
- **许可证**：未在该插件目录找到许可证文件，不能确认具体许可证。

### 2. lesson-generator

- **插件 / 技能名**：`lesson-generator`，版本 `1.0.0`。[plugin.json](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/lesson-generator/.claude-plugin/plugin.json) · [SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/lesson-generator/skills/lesson-generator/SKILL.md)
- **中文概述**：生成带课程导航、学习目标、闪卡、测验和来源链接的多课时浏览器课程。[README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/lesson-generator/README.md)
- **典型触发**：制作互动课程、迷你课程、学习指南、闪卡或知识检查。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/lesson-generator/skills/lesson-generator/SKILL.md)
- **安装命令**：`/plugin install lesson-generator@dair-academy-plugins`。
- **外部依赖 / 环境变量**：官方说明产物使用原生 HTML/CSS/JS，不需要后端、数据库或固定外部服务；未声明环境变量。[README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/lesson-generator/README.md) · [SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/lesson-generator/skills/lesson-generator/SKILL.md)
- **主要产物**：工作区根目录的 `index.html`、`styles.css`、`script.js`。[README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/lesson-generator/README.md#output)
- **许可证**：未在该插件目录找到许可证文件，不能确认具体许可证。

### 3. learn

- **插件 / 技能名**：`learn`，版本 `1.0.0`。[plugin.json](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/learn/.claude-plugin/plugin.json) · [SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/learn/skills/learn/SKILL.md)
- **中文概述**：根据学习者水平和目标提供自适应辅导、练习、检索检查、学习计划和针对性反馈。[README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/learn/README.md)
- **典型触发**：教我、帮助我学习、辅导某主题、制定学习路径、练习或测验。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/learn/skills/learn/SKILL.md)
- **安装命令**：`/plugin install learn@dair-academy-plugins`。
- **外部依赖 / 环境变量**：技能明确保持 agent-agnostic，不预设特定产品、运行时、持久化方式或固定产物；未声明环境变量。[README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/learn/README.md)
- **主要产物**：按请求选择对话课程、学习计划、笔记、测验、代码示例、图表或文件，没有固定文件契约。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/learn/skills/learn/SKILL.md)
- **许可证**：未在该插件目录找到许可证文件，不能确认具体许可证。

### 4. llm-council

- **插件 / 技能名**：`llm-council`，版本 `1.0.1`。[plugin.json](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/llm-council/.claude-plugin/plugin.json) · [SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/llm-council/skills/llm-council/SKILL.md)
- **中文概述**：通过 Fireworks AI 并行调用多个开放权重模型，执行独立回答、匿名交叉排名和主席模型综合的三阶段讨论。[README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/llm-council/README.md)
- **典型触发**：需要多个 AI 视角、共识判断、交叉评审或 LLM Council 讨论。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/llm-council/skills/llm-council/SKILL.md)
- **安装命令**：`/plugin install llm-council@dair-academy-plugins`。
- **外部依赖**：Fireworks AI 和其托管的多种开放权重模型。[README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/llm-council/README.md)
- **环境变量**：必需 `FIREWORKS_API_KEY`。[.env.example](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/llm-council/skills/llm-council/.env.example)
- **主要产物**：完整显示各模型回答、排名和最终综合，并按技能规则保存原始响应文件；具体目录和文件名由执行流程产生。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/llm-council/skills/llm-council/SKILL.md)
- **许可证**：未在该插件目录找到许可证文件，不能确认具体许可证。

### 5. survey-generator

- **插件 / 技能名**：`survey-generator`，版本 `1.0.0`。[plugin.json](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/survey-generator/.claude-plugin/plugin.json) · [SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/survey-generator/skills/survey-generator/SKILL.md)
- **中文概述**：由 agent 策划论文研究包，再通过 Fireworks AI 上的 Kimi K2.6 一次生成带内联 SVG、编号章节和参考文献的单文件 HTML 综述。[README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/survey-generator/README.md)
- **典型触发**：针对 AI/ML 主题生成 survey paper、文献综述或学术式 HTML 研究产物。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/survey-generator/skills/survey-generator/SKILL.md)
- **安装命令**：`/plugin install survey-generator@dair-academy-plugins`。
- **外部依赖**：Fireworks AI、Kimi K2.6、Python 3 标准库；需要一个公开 anchor resource，论文搜索工具为可选增强。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/survey-generator/skills/survey-generator/SKILL.md#requirements)
- **环境变量**：必需 `FIREWORKS_API_KEY`。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/survey-generator/skills/survey-generator/SKILL.md#requirements)
- **主要产物**：`research_bundle.json` 和版本化的 `output/survey_<model>_v<N>.html`。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/survey-generator/skills/survey-generator/SKILL.md)
- **许可证**：MIT。[LICENSE](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/survey-generator/skills/survey-generator/LICENSE)

### 6. youtube-notetaker

- **插件 / 技能名**：`youtube-notetaker`，版本 `1.0.0`。[plugin.json](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/youtube-notetaker/.claude-plugin/plugin.json) · [SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/youtube-notetaker/skills/youtube-notetaker/SKILL.md)
- **中文概述**：把 YouTube 演讲整理为本地学习资料库，包含幻灯片截图、时间戳转录、可编辑笔记和浏览器查看器。[README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/youtube-notetaker/README.md)
- **典型触发**：深读一个演讲、提取视频幻灯片、记录时间戳笔记或建立演讲资料库。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/youtube-notetaker/skills/youtube-notetaker/SKILL.md)
- **安装命令**：`/plugin install youtube-notetaker@dair-academy-plugins`。
- **外部依赖**：`yt-dlp`、`ffmpeg`、Python 3、Pillow、PyYAML；依赖 YouTube 视频和字幕可访问性。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/youtube-notetaker/skills/youtube-notetaker/SKILL.md#requirements)
- **环境变量**：可选 `VIDEO_LIBRARY_DIR` 和 `VIDEO_LIBRARY_PORT`，分别控制资料库位置和本地服务端口。[README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/youtube-notetaker/README.md#configuration)
- **主要产物**：每个视频一个 `<YTID>.md`，幻灯片位于 `_media/`；Python 服务提供资料库与可回写笔记的查看器。[README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/youtube-notetaker/README.md#layout)
- **许可证**：未在该插件目录找到许可证文件，不能确认具体许可证。

### 7. wiki-builder

- **插件 / 技能名**：`wiki-builder`，版本 `1.0.0`。[plugin.json](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/wiki-builder/.claude-plugin/plugin.json) · [SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/wiki-builder/skills/wiki-builder/SKILL.md)
- **中文概述**：创建和维护可配置的研究 Wiki，支持研究、论文、领域、产品、人物、组织和项目等形态，并保留来源与维护记录。[README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/wiki-builder/README.md)
- **典型触发**：新建知识库、摄取来源、编译 Wiki 页面、查询并归档答案、重构 Wiki 或导出研究材料。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/wiki-builder/skills/wiki-builder/SKILL.md)
- **安装命令**：`/plugin install wiki-builder@dair-academy-plugins`。
- **外部依赖**：主要依赖宿主 agent 和随附 Bash 脚本；未声明外部模型 API 密钥。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/wiki-builder/skills/wiki-builder/SKILL.md)
- **环境变量**：可选 `WIKI_ROOT`，默认根目录为 `~/dair-wikis/`；也可通过 `--root` 覆盖。[README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/wiki-builder/README.md#setup)
- **主要产物**：带 `wiki.config.md`、`raw/`、`wiki/`、`derived/`、`prompts/`、`logs/` 和 `sources.md` 的独立 Wiki 目录。[README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/wiki-builder/README.md#wiki-layout)
- **许可证**：MIT。[LICENSE](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/wiki-builder/LICENSE)

### 8. x-agent-intelligence

- **插件 / 技能名**：`x-agent-intelligence`，版本 `1.4.0`。[plugin.json](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/x-agent-intelligence/.claude-plugin/plugin.json) · [SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/x-agent-intelligence/skills/x-agent-intelligence/SKILL.md)
- **中文概述**：通过官方 X MCP 获取公开 AI 与 Agent 动态，生成可搜索、可筛选、带来源链接的本地 HTML 情报流。[README](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/x-agent-intelligence/README.md)
- **典型触发**：生成 X 信息摘要、监控看板、每日 AI 情报流或来源账号时间线。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/x-agent-intelligence/skills/x-agent-intelligence/SKILL.md)
- **安装命令**：`/plugin install x-agent-intelligence@dair-academy-plugins`。
- **外部依赖**：必须具备官方 X MCP 连接；技能明确禁止在缺少 MCP 时偷偷改用抓取。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/x-agent-intelligence/skills/x-agent-intelligence/SKILL.md#first-check)
- **认证配置**：可使用 App-only Bearer token，或通过 `xurl` 使用 OAuth 2.0 PKCE；后者可能需要 `CLIENT_ID`、`CLIENT_SECRET`，并在 `~/.xurl` 保存敏感令牌。[X MCP setup](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/x-agent-intelligence/references/x-mcp-setup.md)
- **主要产物**：包含归一化故事数据、搜索、分类筛选、来源设置和原帖链接的单文件 `feed.html`。[SKILL.md](https://github.com/dair-ai/dair-academy-plugins/blob/945b237049a08765c0cd164774f974647a6b7f97/plugins/x-agent-intelligence/skills/x-agent-intelligence/SKILL.md#render-the-artifact)
- **许可证**：未在该插件目录找到许可证文件，不能确认具体许可证。

## 映射到 Skills123

### 可直接映射的现有字段

| Skills123 字段 | DAIR 来源 | 说明 |
|---|---|---|
| `id` / `name` | `plugin.json.name`、`SKILL.md.name` | 当前 8 项均为插件名与技能名一一对应。 |
| `descriptionEn` | `plugin.json.description` 或 `SKILL.md.description` | 建议以技能触发描述为主、插件描述为辅。 |
| `descriptionZh` | 本文中文概述 | 上线前需要人工确认文案。 |
| `command` | 插件安装后技能名 | 建议展示为技能调用名，同时单独保存安装命令，不要混为一个字段。 |
| `group` | 本地策展 | 上游没有统一分组，需要 Skills123 决定。 |
| `invocationMode` | `SKILL.md` 工作流 | 上游未提供与 Skills123 相同的枚举，不能机械推断。 |
| `lifecycle` | `plugin.json.version` 与仓库状态 | 当前均在 marketplace 中，但“published”仍是 Skills123 的本地判断。 |
| `tags` | README 功能、依赖和产物 | 应使用中文检索标签。 |
| `relationships` | 外部依赖、产物、安装平台 | 可先用于详情侧栏的结构化摘要。 |

### 建议新增的数据字段

| 字段 | 用途 |
|---|---|
| `sourceUrl` | 链接到具体插件目录或 `SKILL.md`。 |
| `upstreamVersion` | 保存 `plugin.json.version`。 |
| `installCommand` | 保存完整 `/plugin install ...` 命令。 |
| `platform` | 明确标记 `Claude Code plugin`。 |
| `requirements` | 展示 Gemini、Fireworks、X MCP、Python、FFmpeg 等依赖。 |
| `environmentVariables` | 只保存变量名和用途，绝不保存值。 |
| `outputs` | 展示图片、HTML、Markdown Wiki、资料库等产物。 |
| `license` | 使用 `MIT`、`unconfirmed` 等明确状态。 |
| `upstreamCommit` | 固定本次收录所依据的版本，便于后续更新审计。 |

### 已确认的本地分组

- `visual-content`：`image-generator`
- `learning`：`learn`、`lesson-generator`
- `research-generation`：`llm-council`、`survey-generator`
- `knowledge-management`：`wiki-builder`、`youtube-notetaker`
- `intelligence-monitoring`：`x-agent-intelligence`

## 风险与实现约束

1. **收录范围**：按固定快照收录包括 `x-agent-intelligence` 在内的 8 项；后续新增项不自动进入网站。
2. **技能包归属场景**：整个技能包固定归入“研究”；相邻用途只作为包内技能方向和搜索词呈现。
3. **插件与技能的长期关系**：当前是一对一，但官方结构允许一个插件包含多个技能。数据模型应避免永久假设一对一。
4. **许可证**：6 项缺少插件级许可证文件。网站应显示“未确认”，不能从仓库总述推断为 MIT。
5. **密钥与付费依赖**：Gemini、Fireworks 和 X 连接需要外部账号或密钥；网站不得把这些项目表现为零配置技能。
6. **预览模型漂移**：`image-generator` 使用带 `preview` 的 Gemini 模型名；Fireworks 可用模型列表也会变化，需记录上游版本而不是在 Skills123 中长期复制模型清单。
7. **执行环境差异**：上游安装命令面向 Claude Code。若 Skills123 同时面向 Codex 或其他 Agent，需要明确“收录”不等于“可直接在所有宿主安装”。
8. **产物写入风险**：`lesson-generator` 会向工作区根目录写固定文件名；`survey-generator` 会在技能目录生成研究包与输出；收录页应清楚说明写入位置。
9. **上游元数据漂移**：`image-generator` 的 `plugin.json` 为 `1.1.2`，插件 README 的版本段仍写 `1.1.1`；同步时应以结构化 `plugin.json` 为准，并保留上游提交号供审计。

## 实现交接

按已确认范围进入 `/implement`：

1. 先建立统一、可校验的技能目录数据边界。
2. 接入 8 项固定快照数据和 5 个技能方向。
3. 扩展共享详情、包内搜索与全局归属搜索。
4. 运行单元测试、浏览器回归与桌面/手机视觉检查。
