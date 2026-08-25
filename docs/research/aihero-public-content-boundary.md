# AI Hero 公开内容清单与中文镜像边界

> 调查日期：2026-08-07。本文只使用 AI Hero 官方站点、官方发现/API 文档，以及 AI Hero 页面直接指向的官方 GitHub 仓库。本文是内容与权限核查，不是法律意见。

## 结论先行

AI Hero 明确提供了面向人类和 agent 的公开发现面：HTML 页面、部分页面的 `.md` twin、JSON API、Markdown/XML sitemap、`llms.txt` 和 `/.well-known/api-catalog`。官方发现文档把帖子/列表、skills、AI Coding Dictionary、workshop/tutorial、product、cohort、event 等列为可发现的 URL 族；这说明这些 URL 族是“可公开发现/访问的候选内容”，不等于授予复制、翻译、缓存后公开服务或再发布许可。[`llms.txt`](https://www.aihero.dev/llms.txt)、[`/api`](https://www.aihero.dev/api)、[`sitemap.md`](https://www.aihero.dev/sitemap.md)

AI Hero 当前官方条款的明确方向相反：未经书面许可，不得复制、重复、出售、转售或利用服务的任何部分；同时禁止对网站或内容进行 spider、crawl、scrape 等行为。[Terms, Conditions, and Privacy Policy](https://www.aihero.dev/privacy)

因此，本次调查支持的默认镜像边界是：

- 可以做“目录/索引型中文入口”：标题、类型、原始 URL、短描述、更新时间、自己撰写的事实性摘要，并链接回 AI Hero 原页。
- 不应默认做全文中文翻译、HTML/Markdown 全量镜像、视频/字幕/图片/课程解答缓存或公开再发布。
- 任何全文翻译、长期内容缓存、商业化聚合、付费内容/登录内容镜像，都应先取得 Skill Recordings Inc. / AI Hero 的明确书面许可；官方页面给出的联系邮箱是 `team@aihero.dev`。[官方条款联系方式](https://www.aihero.dev/privacy)

## 一、观察到的公开 URL 族与页面

下面是官方发现文档声明的 URL 族。`公开`表示官方 API/发现面把该族标为可公开发现或页面可直接访问；它不是版权许可判断。

| URL 族 | 官方声明/实际观察 | 中文镜像清单建议 |
| --- | --- | --- |
| `https://www.aihero.dev/<slug>` | Posts and lists。API discovery 将其标为 `public`；支持显式 `.md` twin。实际抽查 `/what-is-an-llm` 与 `/what-is-an-llm.md` 均返回 200。 | 可纳入目录与自写摘要。全文翻译/全文缓存需许可。 |
| `/workshops/<module>` | Workshop landing pages；支持 `.md` twin。实际抽查 `ai-sdk-v6-crash-course` landing page 返回 200，并含课程营销信息、目录和价格/购买入口。 | 可纳入课程目录与原始购买链接；不要把课程目录误当成课程正文许可。 |
| `/workshops/<module>/<lesson>` | 官方写明是“free public lessons”这一条件下的公开 lesson；支持 `.md` twin。当前 sitemap 含一个 lesson URL，但抽查的 `generating-objects-via-output~dkm2k` 页面目录数据标为 `standard`，页面有 “Get Full Access”，其 `.md` 返回 404。 | 只按页面/官方标记确认的 free lesson 处理；标准/付费 lesson 仅保留标题、URL、公开 teaser，不镜像正文、视频、solution。 |
| `/tutorials/<module>/<lesson>` | `llms.txt` 和 sitemap.md 列出 tutorial lesson 族及 `.md` twin；当前抓取的 XML sitemap 主要列出 tutorial landing/list 页面（如 `/vercel-ai-sdk-tutorial`），未据此推断所有 lesson 都免费。 | 逐页核验公开状态；不要因为 URL 可猜测或 HTML 有 teaser 就全文镜像。 |
| `/products/<slug>` | 官方 discovery 标为 `public`，支持 `.md` twin；它是产品/销售结构，不代表购买后课程资料可再发布。 | 可收录产品名称、描述、价格/状态等公开销售元数据并回链；不要复制受售内容。 |
| `/cohorts/<slug>` | 官方 discovery 标为 `public`，支持 `.md` twin。 | 可收录公开 cohort 介绍、日期、报名链接；不收录会员课程、录播、transcript 或 Discord 内容。 |
| `/events/<slug>` | 官方 discovery 标为 `public`，支持 `.md` twin。 | 可收录公开活动元数据；活动录音、字幕、讲义须另行确认权利。 |
| `/skills` 与 `/skills.md` | Skills catalogue/featured skills/editorial guides/changelog；`.md` 实测返回 200。页面直接链接到 `mattpocock/skills` 源仓库。 | AI Hero 页面内容按站点条款处理；若转载仓库中的文件，按仓库自身许可证逐文件处理。 |
| `/ai-coding-dictionary` 与 `/ai-coding-dictionary/<slug>` | 官方 discovery 标为 `public`；XML sitemap 当前含词典页及大量 entry。HTML 实测可访问，但 `agent.md` 实测返回 404；官方发现文档没有为 dictionary entry 承诺 `.md` twin。 | 可做词条索引和原创中文释义；不要把页面公开或 GitHub 仓库公开理解为 AI Hero 词条全文翻译许可。 |
| 固定公开页：`/`、`/learn`、`/faq`、`/open-source`、`/newsletter`、`/privacy` | 这些页面实测返回 HTML 200；`/learn` 是公开 Map，列出文章、视频、skills 等内容入口。Terms 链接实际落到 `/privacy` 的合并页面；`/terms` 当前返回 404。 | 可做站点导航和事实性索引；`/privacy` 中的个人信息、cookie、分析与表单内容不应被镜像收集。 |

截至调查日，官方 [`sitemap.xml`](https://www.aihero.dev/sitemap.xml) 返回 188 个 URL，包含首页、posts/lists、skills、AI Coding Dictionary 及 entries、一个 workshop landing 和一个 workshop lesson 等当前索引项。这个数量是一次抓取时点的观察，不是稳定 API 保证；同步时应重新读取 sitemap，并遵守条款与删除请求。

## 二、发现机制与 API 权限

### 面向 crawler/agent 的发现面

官方提供以下发现入口：

- [`/.well-known/api-catalog`](https://www.aihero.dev/.well-known/api-catalog)：`application/linkset+json`，链接到 AI Hero 的 OpenAPI 文档与 `llms.txt`。
- [`/api`](https://www.aihero.dev/api)：稳定的 JSON discovery document，声明格式（HTML、Markdown、JSON）、URL 族、可用 API 和下一步动作。
- [`/llms.txt`](https://www.aihero.dev/llms.txt)：简短 operator hint；列出 `.md` twins、search、resource lookup 和 token 说明。
- [`/sitemap.md`](https://www.aihero.dev/sitemap.md)：Markdown 版发现索引，列出 URL 族、当前公开示例、Markdown twin 约定和 curl 示例。
- [`/sitemap.xml`](https://www.aihero.dev/sitemap.xml)：XML crawler sitemap；是当前可索引页面清单的实用入口。
- 页面 footer 还暴露 [`/rss.xml`](https://www.aihero.dev/rss.xml) 与 [`/skills.md`](https://www.aihero.dev/skills.md) 等 agent 入口；`/learn` 页面也将它们列在 Agents 区域。

### 匿名可用与需 bearer 的 API

官方 [`/api/openapi.json`](https://www.aihero.dev/api/openapi.json) 的 operation security 是权限边界的更可靠依据：

- `/api/search?q=<query>` 允许匿名访问；OpenAPI 明确说匿名调用者只能看到 public published hits。实测 `q=agent` 返回 200，并返回 107 个命中中的 5 个公开结果；支持 `type`、`per_page`（上限 20）和 `semantic` 等参数。
- `/api/resources?slugOrId=<slug>&type=<type>` 在 OpenAPI 中要求 bearer `content:read`；无凭证实测返回 `401 Unauthorized`。因此不能把 `llms.txt` 中的 resource lookup 示例当作匿名全文 API。
- `/api/posts`、`/api/lessons`、`/api/products` 的内容读取在 OpenAPI 中要求 bearer `content:read`。`content:read` 是特权读取，官方说明其范围可包括 approved draft、unpublished、private、unlisted 等，不应为镜像目的申请或使用这种越权范围。
- `/api/tags` 的 GET 是匿名公开的 tag definition list；不返回 customer/response data。`/api/products/{productId}/availability` 的 GET 也标为 public，但它是库存/容量信息，不是全文内容发现接口。
- `/v1/course-sync/openapi.json` 本身是公开的 OpenAPI schema，但其 binding、stage、preview、apply、rollback 操作均要求不同 bearer。它是 draft-only control plane，不是公开内容下载授权。

API 发现能力只回答“服务器允许什么读取方式”。它没有在官方文档中给出“可将读取结果翻译并再托管”的授权。

## 三、翻译、缓存与再发布边界

### 官方明示的事实

1. 站点条款适用于浏览者、客户、贡献者等所有用户；访问网站即表示接受条款。[官方条款](https://www.aihero.dev/privacy)
2. 条款明确禁止未经 Skill Recordings Inc. 明示书面许可而 reproduce、duplicate、copy、sell、resell 或 exploit 服务/访问/其组成部分。[官方条款](https://www.aihero.dev/privacy)
3. 条款的 prohibited uses 明确列出对站点或相关网站进行 spam、spider、crawl、scrape，以及规避安全功能。[官方条款](https://www.aihero.dev/privacy)
4. 条款对用户主动提交的 comments/feedback 授予 AI Hero 编辑、复制、发布、分发、翻译等权利；这是一项给 AI Hero 的用户投稿条款，不是 AI Hero 反向授予读者翻译和再发布站内内容的许可。[官方条款](https://www.aihero.dev/privacy)
5. 条款承认站内可能包含第三方材料，并要求用户自行查看第三方政策；因此文章里的代码、图片、视频、引用和链接不能统一按 AI Hero 内容处理。[官方条款](https://www.aihero.dev/privacy)
6. 隐私政策说明会收集设备信息、页面浏览、cookie、订单信息并使用 Google Analytics。镜像不应复制表单、个人信息、cookie、分析脚本或订单/账户数据。[官方隐私政策](https://www.aihero.dev/privacy)

### 对“translation / cache / republication”的可执行分层

| 操作 | 官方来源是否给出许可 | 建议边界 |
| --- | --- | --- |
| 链接回原页、展示标题/类型/URL/更新时间 | 未发现需要复制正文的许可问题；仍应保持准确、不冒充官方 | 默认可做，使用 canonical 原链接和明显的 AI Hero 来源标注。 |
| 自己写的中文摘要、目录索引、事实性导航 | 官方没有专门许可；风险低于逐句翻译，但不是权利保证 | 控制为独立表达和必要短引；不重建原文结构，不替代原页，不混入 AI Hero 官方身份。 |
| 短引文或短段落翻译 | 未发现 AI Hero 授权；是否构成合理使用/合理引用取决于适用法、篇幅、目的和市场替代效应 | 仅在必要范围内、带原文 URL/作者/标题/日期，先做法律审查；不要把“短”当成自动安全港。 |
| 全文中文翻译、逐页 `.md` 镜像 | 站点条款明确禁止未经书面许可的 copy/reproduce/exploit；未发现站点内容的开放许可 | 默认不做；取得书面许可，明确语言、页面范围、期限、缓存、商业化、署名和下架机制后再做。 |
| HTTP/对象缓存 | 官方 discovery 说明如何读取，不说明允许第三方长期存档或公共再托管 | 仅可考虑服务自身的短期、访问触发、遵守响应缓存头且可快速失效的技术缓存；这不是官方授予的再发布权，也不得把缓存变成公开镜像。付费、登录、private/unlisted、视频/solution 一律不缓存。 |
| 全量 crawl/scrape、用 sitemap 批量抓取 | 条款明确将 crawl/spider/scrape 列为禁止用途 | 不做。若获书面许可，应按许可中的频率、范围、robots/删除/缓存规则执行。 |
| 使用 `content:read` token 获取 draft/private/unlisted 后翻译 | API 明确这是特权读取，不是公开内容 | 不做；不得将 token 获得的内容进入中文镜像。 |
| 视频、字幕、缩略图、图片、lesson solution、购买后课程材料 | 公开 HTML/元数据不等于媒体或课程资料许可；OpenAPI 还将 raw video/Mux payload 排除在 scoped PAT 之外 | 默认不做。逐项取得权利人许可，并另行核对第三方素材权利。 |

## 四、GitHub/source repository 的限定例外

AI Hero 的 `/skills` 页面链接到 [`mattpocock/skills`](https://github.com/mattpocock/skills)。该仓库的 [`LICENSE`](https://github.com/mattpocock/skills/blob/main/LICENSE) 明示为 MIT，并允许在保留版权与许可声明的条件下复制、修改、发布、分发和销售该 Software。这个许可可支持对仓库中受 MIT 覆盖的文件进行合规翻译/分发，但不自动覆盖：

- AI Hero 网站上的 skills editorial article、页面排版、营销文案、图片、视频和课程内容；
- 仓库依赖、嵌入素材或逐文件另有版权声明的内容；
- 其他 AI Hero 页面或付费 workshop 内容。

AI Hero 的 [`open-source` 页面](https://www.aihero.dev/open-source)还列出 `mattpocock/sandcastle`、`mattpocock/dictionary-of-ai-coding` 等项目；应逐仓库、逐文件读取 LICENSE，不能以“Open source”导航标签替代许可证核验。AI SDK crash course 的官方 GitHub 页面说明仓库包含课程代码示例与 exercises，并链接回 AI Hero，但在本次查看的仓库主页上没有看到可据以扩大 AI Hero 网站课程/视频转载范围的许可证声明；应按“无明确再发布许可”处理。[AI SDK v6 crash course repo](https://github.com/ai-hero-dev/ai-sdk-v6-crash-course)

## 五、建议给 Wayfinder ticket 的决策

将中文镜像拆成两个层级：

1. **默认可推进的目录层**：读取 sitemap/公开页面或匿名 search 的公开元数据，生成中文标题、类型、短摘要、标签、原始 URL、公开/免费/付费状态（若页面明确标注），所有条目回链 AI Hero；不复制全文、不存媒体、不抓取登录/付费内容。
2. **需要外部授权的内容层**：任何完整中文译文、全文 Markdown/HTML 缓存、文章逐页镜像、课程 lesson/transcript/solution、图片/视频、商业广告或 SEO 替代站。先向 `team@aihero.dev` 申请书面许可，保存许可范围和撤下流程。

## 六、法律不确定性（不要误读为结论）

本次官方材料没有提供 AI Hero 站内 editorial/course content 的 Creative Commons、MIT、Apache 或其他通用再发布许可证；也没有发现翻译权、公共缓存权或中文镜像授权。美国条款页面指定德州地址/法律，但跨境镜像的适用法、著作权保护范围、合理使用/合理引用、数据库权利、商标、第三方素材和条款可执行性，都需要由适格律师结合具体页面、篇幅、商业模式和流量替代效应判断。公开访问、被 sitemap 收录、存在 `.md` twin、匿名 API 可搜到，均只能证明技术可达性或官方发现意图，不能单独证明复制、翻译、缓存或再发布权。

