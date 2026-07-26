---
source_url: "https://shopify.baoea.com/advanced/shopify-ai-toolkit"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:38:11"
fetch_method: "http"
content_hash: "12f38230ff8a37a398b3ba204e7b0f92d99add80c0c80d09c84230745d304be2"
discovered_via: ["sitemap", "internal_link"]
---
## Shopify AI Toolkit 使用指南

[Shopify AI Toolkit](https://shopify.dev/docs/apps/build/ai-toolkit)  是 Shopify 官方提供的 **AI 开发增强套件**：把你的 AI 助手（Cursor、Claude Code、VS Code、Gemini CLI、Codex 等）与 **Shopify 文档、API Schema、代码校验能力** 以及 **CLI 侧与店铺相关的执行能力** 连接起来，让智能体**按平台真实行为工作**，而不是凭训练数据「猜」接口怎么写。

> **定位说明**：官方文档归类在 **Apps → Build → Dev tools** 下，主要面向 **Shopify 应用与扩展** 开发场景。若你主要做 **主题与 Liquid**，可搭配阅读 [AI 辅助与主题工程化](https://shopify.baoea.com/liquid/ai-theme-engineering)；Toolkit 与 Theme Check、CLI 仍可共用同一套编辑器习惯。

最近也有不少海外开发者把它放进日常工作流里，比如 WebSensePro 的这篇 [Shopify AI Toolkit Tutorial](https://websensepro.com/blog/shopify-ai-toolkit-tutorial-build-themes-automate-seo-in-minutes/)  提到：通过自然语言让 AI 辅助更新产品标签、优化图片与 SEO 元信息、创建主题区块。这里不照搬案例，而是结合我们自己的建站、主题和运营经验，把它拆成更实用的判断：**哪些事可以大胆交给 AI 起草，哪些事必须人来收口**。

* * *

## 一、Toolkit 解决什么问题[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#%E4%B8%80toolkit-%E8%A7%A3%E5%86%B3%E4%BB%80%E4%B9%88%E9%97%AE%E9%A2%98)

| 痛点 | Toolkit 的作用 |
| --- | --- |
| 模型编造不存在的 Admin API 字段或 GraphQL 操作名 | 通过官方文档与 Schema 约束回答与生成 |
| 团队各自问 ChatGPT，答案版本不一致 | 统一 插件 / Skills / MCP 入口，随官方更新 |
| 写完代码不知道是否符合平台习惯 | 结合校验与 CLI 能力，减少「能跑但不符合规范」的代码 |

官方表述：**让 agent 与 Shopify 正确协作，而不是猜测实现细节。**（参见 [Shopify AI Toolkit 文档](https://shopify.dev/docs/apps/build/ai-toolkit) 。）

换成更接地气的话说：它不是「替你经营一家店」，而是把原来分散在文档、CLI、API Schema、主题文件里的信息，变成 AI 可以调用的上下文。它真正省时间的地方，通常不是一次生成一个惊艳功能，而是少走这些弯路：

*   少查很多遍同一个 Admin API 字段名
*   少写一批重复的 GraphQL 查询
*   少在主题文件里凭感觉改 section schema
*   少把 SEO 标签、图片 alt、产品标签这些重复工作逐条人工处理
*   少让初级同事在旧博客和新文档之间反复对答案

* * *

很多介绍 AI Toolkit 的文章会强调「几分钟做完主题、SEO、批量修改」。这个方向没错，但实际项目里要稍微冷静一点看。

它擅长：

*   **起草代码**：例如生成一个 section、写一个 Admin GraphQL 查询、补一段 App Extension 配置
*   **读文档并对齐接口**：让 AI 不再靠旧知识猜 Shopify 的字段
*   **批量整理**：产品标签、图片 alt、SEO 标题、描述、metafield 草稿
*   **解释项目结构**：快速理解 app、extension、theme 的目录与入口

它不适合直接接管：

*   真实生产店铺的批量写入，不经人工 review 就执行
*   品牌口吻、SEO 策略、产品合规承诺
*   价格、库存、折扣、税务、支付等高风险配置
*   客户数据、订单数据、私密 token 的随意粘贴

比较稳的用法是：**先让 AI 生成计划与 diff，再由人决定是否执行**。尤其是批量改产品、图片、SEO 字段时，先抽样 5～10 个结果，比一上来跑全店安全得多。

* * *

## 三、安装前要求[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#%E4%B8%89%E5%AE%89%E8%A3%85%E5%89%8D%E8%A6%81%E6%B1%82)

根据官方说明，安装前应满足：

*   **Node.js**：**18 及以上**（建议与团队 CLI 版本对齐，使用 LTS）。
*   **受支持的 AI 工具之一**：Claude Code、Codex（**仅支持 Skills 与 MCP**）、Cursor、Gemini CLI、Visual Studio Code。

具体子版本与兼容性以 [官方 Requirements](https://shopify.dev/docs/apps/build/ai-toolkit#requirements)  为准。

* * *

## 四、三种安装方式概览[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#%E5%9B%9B%E4%B8%89%E7%A7%8D%E5%AE%89%E8%A3%85%E6%96%B9%E5%BC%8F%E6%A6%82%E8%A7%88)

| 方式 | 适用场景 | 维护方式 |
| --- | --- | --- |
| 插件（Plugin，推荐） | 希望「一次装好、自动跟新」 | 插件随官方发布更新 |
| Agent Skills（手动） | 只想要部分能力、可自选技能包 | 需自行拉取更新 |
| Dev MCP Server | 已在工作流里深度使用 MCP、希望接本地 stdio 服务 | 本地 npx 拉起，按文档配置各客户端 |

下面分方式说明要点；**命令与菜单位置以你本机文档版本为准**，若与官方不一致，请以 [shopify.dev AI Toolkit](https://shopify.dev/docs/apps/build/ai-toolkit)  为准。

* * *

## 五、方式 A：插件安装（推荐）[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#%E4%BA%94%E6%96%B9%E5%BC%8F-a%E6%8F%92%E4%BB%B6%E5%AE%89%E8%A3%85%E6%8E%A8%E8%8D%90)

插件把能力打成一个整体，**官方推荐优先用插件**，以便新能力发布时自动带上。

### Claude Code[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#claude-code)

1.  在 Claude Code 中启用 Shopify 插件市场（官方示例命令）： `/plugin marketplace add Shopify/shopify-ai-toolkit`
2.  再安装插件： `/plugin install shopify-plugin@shopify-plugin`

### Cursor[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#cursor)

在 **Cursor Marketplace** 中搜索并添加 **Shopify** 相关官方插件（详见官方文档「Cursor」小节）。

### Gemini CLI[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#gemini-cli)

在终端执行（官方提供的扩展安装方式）：

```
gemini extensions install https://github.com/Shopify/shopify-ai-toolkit
```

### Visual Studio Code[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#visual-studio-code)

1.  在 VS Code 设置中启用 **Agent plugins** 相关预览能力（以当前 VS Code 版本说明为准）。
2.  命令面板执行 **Chat: Install Plugin From Source**。
3.  仓库地址填入：`https://github.com/Shopify/shopify-ai-toolkit`（与官方文档一致）。

* * *

## 六、方式 B：Agent Skills（`npx skills`）[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#%E5%85%AD%E6%96%B9%E5%BC%8F-bagent-skillsnpx-skills)

适合希望 **按需安装**、或只引入部分技能的场景，不希望占用太多插件空间。

**安装全部技能：**

```
npx skills add Shopify/shopify-ai-toolkit
```

  
![安装 Shopify-ai-toolkit](https://shopify.baoea.com/_next/image?url=%2Fimages%2Fcontents%2Fshopify-ai-toolkit.png&w=1920&q=75)

也可以一个个空格勾选部分选中的技能，选完之后一直回车就安装好了

  
![安装 Shopify-ai-toolkit 一直回车安装完毕](https://shopify.baoea.com/_next/image?url=%2Fimages%2Fcontents%2Fshopify-ai-toolkit-added.png&w=1920&q=75)

**仅安装单个技能：**

```
npx skills add Shopify/shopify-ai-toolkit --skill shopify-admin
```

完整技能列表见官方 GitHub 仓库说明。注意：**手动添加的 Skills 不会自动更新**，需要你们自行跟进版本。

* * *

## 七、方式 C：Dev MCP Server（`@shopify/dev-mcp`）[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#%E4%B8%83%E6%96%B9%E5%BC%8F-cdev-mcp-servershopifydev-mcp)

通过 **MCP（Model Context Protocol）** 把本地或 IDE 里的助手接到 Shopify 开发者资源；官方说明该 **MCP 在本地运行**，且文档描述为 **无需额外认证**（以官方最新说明为准）。

### 通用思路[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#%E9%80%9A%E7%94%A8%E6%80%9D%E8%B7%AF)

*   使用 **`npx -y @shopify/dev-mcp@latest`** 作为 MCP 子进程命令；
*   在各客户端的 **MCP 配置** 里增加 `shopify-dev-mcp`（名称可自定）；
*   **保存配置后重启**对应客户端，使 MCP 生效。

### Cursor 配置示例[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#cursor-%E9%85%8D%E7%BD%AE%E7%A4%BA%E4%BE%8B)

在 **Cursor → Settings → Cursor Settings → Tools and MCP → New MCP server** 中增加类似配置（与 [官方 Cursor 小节](https://shopify.dev/docs/apps/build/ai-toolkit)  对齐）：

```
{
  "mcpServers": {
    "shopify-dev-mcp": {
      "command": "npx",
      "args": ["-y", "@shopify/dev-mcp@latest"]
    }
  }
}
```

若 **Windows** 上出现连接错误，官方文档提供了改用 `cmd /k npx ...` 的替代写法，请在文档中复制最新片段。

### Claude Code 示例[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#claude-code-%E7%A4%BA%E4%BE%8B)

官方建议通过 CLI 注册 MCP，例如：

```
claude mcp add --transport stdio shopify-dev-mcp -- npx -y @shopify/dev-mcp@latest
```

执行后 **重启 Claude Code**。

### Codex CLI[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#codex-cli)

在 `~/.codex/config.toml` 中增加 `[mcp_servers.shopify-dev-mcp]` 段（**注意 Codex 使用 snake\_case 的 `mcp_servers`**，与部分 JSON 配置不同）。完整片段见 [官方 Codex 说明](https://shopify.dev/docs/apps/build/ai-toolkit) 。

### Gemini CLI 与 VS Code[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#gemini-cli-%E4%B8%8E-vs-code)

*   Gemini CLI：在 `settings.json` 的 `mcpServers` 中增加与上文类似的 `command` / `args`；跨项目使用可加官方文档中的 **`--scope user`** 等参数。
*   VS Code：命令面板打开 **MCP: Open User Configuration**，在用户级 `mcp.json` 的 `servers` 下添加 `shopify-dev-mcp` 条目（字段名以 VS Code 当前 MCP 规范为准）。

* * *

## 八、结合实际业务的 5 个工作流[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#%E5%85%AB%E7%BB%93%E5%90%88%E5%AE%9E%E9%99%85%E4%B8%9A%E5%8A%A1%E7%9A%84-5-%E4%B8%AA%E5%B7%A5%E4%BD%9C%E6%B5%81)

### 1\. 批量 SEO 初稿：先生成，再抽样，再写入[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#1-%E6%89%B9%E9%87%8F-seo-%E5%88%9D%E7%A8%BF%E5%85%88%E7%94%9F%E6%88%90%E5%86%8D%E6%8A%BD%E6%A0%B7%E5%86%8D%E5%86%99%E5%85%A5)

适合处理：

*   产品标题太短或不统一
*   Meta title / description 缺失
*   图片 alt 空白
*   产品标签混乱

推荐流程：

1.  先让 AI 读取产品结构，生成 **字段清单与修改策略**
2.  只选 5 个产品做样本
3.  人工检查关键词、品牌语气、是否夸大功效
4.  再批量执行
5.  导出变更记录，方便回滚

可以这样问：

```
请先不要修改店铺数据。
帮我检查当前产品的 SEO 字段结构，列出缺失 meta title、meta description、image alt 的产品数量。
然后抽取 5 个样本，给出建议修改前后对照表。
```

这样比「直接帮我优化全店 SEO」安全很多。WebSensePro 的文章里提到批量更新标签与 200+ 图片的效率案例，可以作为方向参考，但真实项目里建议先做抽样和回滚方案。

### 2\. 主题区块开发：先让 AI 写草稿，再用 Theme Check 收口[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#2-%E4%B8%BB%E9%A2%98%E5%8C%BA%E5%9D%97%E5%BC%80%E5%8F%91%E5%85%88%E8%AE%A9-ai-%E5%86%99%E8%8D%89%E7%A8%BF%E5%86%8D%E7%94%A8-theme-check-%E6%94%B6%E5%8F%A3)

适合让 AI 生成：

*   before / after 图片对比模块
*   FAQ 折叠区块
*   trust badges 信任图标
*   产品卖点卡片
*   首页活动 banner

推荐流程：

1.  先描述 section 的使用场景与设置项
2.  让 AI 生成 Liquid、schema、CSS 的第一版
3.  人工检查是否符合主题现有命名、布局和性能习惯
4.  跑 Theme Check
5.  在预览主题里测试移动端、空数据、图片缺失状态

更好的提示词不是「帮我写一个漂亮 section」，而是：

```
请基于 Shopify Online Store 2.0 写一个可复用 section：
- 用于首页展示 3 个产品卖点
- 每个卖点包含图标、标题、描述
- schema 支持最多 6 个 block
- 不要依赖外部库
- 输出前说明文件放在哪，以及需要我在主题编辑器里怎么配置
```

### 3\. App / Extension 开发：减少字段名和配置错误[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#3-app--extension-%E5%BC%80%E5%8F%91%E5%87%8F%E5%B0%91%E5%AD%97%E6%AE%B5%E5%90%8D%E5%92%8C%E9%85%8D%E7%BD%AE%E9%94%99%E8%AF%AF)

做 Shopify App、Checkout UI Extension、Discount Function、Cart Transform 时，AI 最大价值不是「替你设计业务」，而是减少这些低级错误：

*   GraphQL 字段名写错
*   mutation 输入结构不对
*   extension target 用错
*   TOML 配置漏字段
*   示例代码引用了过期 API 版本

推荐做法：

```
请根据 Shopify 当前官方文档，帮我生成一个 Discount Function 的输入 query。
规则是：买 A 赠 B，需要读取 cart lines 的 merchandise id、quantity、line attributes 和 cart subtotal。
先输出 query，再解释每个字段为什么需要。
```

这类问题很适合 Toolkit / MCP，因为它能围绕官方 Schema 和文档回答，比普通聊天模型更少「看起来对、实际不能跑」。

### 4\. 运营数据整理：让 AI 做助理，不做裁判[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#4-%E8%BF%90%E8%90%A5%E6%95%B0%E6%8D%AE%E6%95%B4%E7%90%86%E8%AE%A9-ai-%E5%81%9A%E5%8A%A9%E7%90%86%E4%B8%8D%E5%81%9A%E8%A3%81%E5%88%A4)

你可以让 AI 帮忙：

*   整理产品标签命名规范
*   把供应商资料转成商品字段草稿
*   分析哪些商品缺图、缺 alt、缺 SEO 字段
*   给运营同事生成待办清单

但不要让它直接决定：

*   哪些商品必须下架
*   哪些 SKU 应该涨价
*   哪些客户应该被标记为高风险
*   哪些承诺能写进商品页

AI 适合做「整理和建议」，最终判断仍要看库存、利润、合规和品牌策略。

### 5\. 团队协作：把 AI 用法写成 SOP[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#5-%E5%9B%A2%E9%98%9F%E5%8D%8F%E4%BD%9C%E6%8A%8A-ai-%E7%94%A8%E6%B3%95%E5%86%99%E6%88%90-sop)

如果团队里多人都用 AI Toolkit，建议建立一份很短的 SOP：

*   哪些任务允许 AI 直接改文件
*   哪些任务只能生成建议
*   批量写入店铺前必须抽样多少条
*   谁负责 review diff
*   出问题如何回滚

很多 AI 工具带来的混乱，不是因为工具不好，而是团队没有定义「能不能执行」和「谁来确认」。这点比安装方式更重要。

* * *

## 九、与日常开发流程如何配合[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#%E4%B9%9D%E4%B8%8E%E6%97%A5%E5%B8%B8%E5%BC%80%E5%8F%91%E6%B5%81%E7%A8%8B%E5%A6%82%E4%BD%95%E9%85%8D%E5%90%88)

1.  **应用脚手架**：仍使用 `shopify app init` 等 CLI 流程（参见 [Shopify 应用开发](https://shopify.baoea.com/advanced/shopify-app-development)）。
2.  **写 Admin API / GraphQL 前**：让已连接 Toolkit / MCP 的助手 **对照 Schema 生成查询**，减少字段名错误。
3.  **合并前**：继续跑你们团队的 **Lint、单测、Theme Check**（主题相关时），Toolkit 不替代 CI。
4.  **密钥与合规**：Toolkit 提升的是「**文档与接口正确性**」；**API Token、客户数据** 仍须遵守 [安全最佳实践](https://shopify.baoea.com/liquid/security) 与公司政策，勿粘贴进不可信会话。

可以把它理解成一条更稳的链路：

```
需求描述 → AI 生成计划 → AI 生成代码或批量操作草稿 → 人工 review → 小范围执行 → 记录结果 → 再扩大范围
```

* * *

## 十、适合直接上手的提示词[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#%E5%8D%81%E9%80%82%E5%90%88%E7%9B%B4%E6%8E%A5%E4%B8%8A%E6%89%8B%E7%9A%84%E6%8F%90%E7%A4%BA%E8%AF%8D)

### 检查产品 SEO 字段[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#%E6%A3%80%E6%9F%A5%E4%BA%A7%E5%93%81-seo-%E5%AD%97%E6%AE%B5)

```
请先读取产品字段结构，不要修改任何数据。
统计哪些产品缺少 meta title、meta description、image alt 和产品标签。
请按“问题类型、影响、建议处理方式、是否适合批量修复”输出。
```

![安装 Shopify-ai-toolkit 优化产品和SEO](https://shopify.baoea.com/_next/image?url=%2Fimages%2Fcontents%2Fshopify-ai-toolkit-optimize.png&w=1920&q=75)

### 生成主题 Section[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#%E7%94%9F%E6%88%90%E4%B8%BB%E9%A2%98-section)

```
请帮我为 Shopify OS 2.0 主题写一个 section 草稿。
功能是首页活动横幅，包含桌面图、移动端图、标题、副标题、按钮文字和链接。
请使用 Liquid schema，不依赖第三方库，并说明如何在主题编辑器里配置。
```

### 生成 Admin GraphQL 查询[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#%E7%94%9F%E6%88%90-admin-graphql-%E6%9F%A5%E8%AF%A2)

```
请根据 Shopify Admin GraphQL 当前 Schema，生成一个查询：
读取前 20 个产品的标题、handle、状态、标签、SEO title、SEO description、前 5 张图片的 altText。
请先输出 query，再解释字段用途。
```

### 批量修改前生成计划[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E5%89%8D%E7%94%9F%E6%88%90%E8%AE%A1%E5%88%92)

```
我准备批量更新产品图片 alt。
请先根据当前产品标题、产品类型和图片上下文生成 10 条样本建议。
不要执行写入。
请输出修改前字段、建议字段、风险说明。
```

* * *

## 十一、延伸阅读与官方入口[](https://shopify.baoea.com/advanced/shopify-ai-toolkit#%E5%8D%81%E4%B8%80%E5%BB%B6%E4%BC%B8%E9%98%85%E8%AF%BB%E4%B8%8E%E5%AE%98%E6%96%B9%E5%85%A5%E5%8F%A3)

*   **官方主文档**：[Shopify AI Toolkit](https://shopify.dev/docs/apps/build/ai-toolkit) 
*   **案例参考**：[Shopify AI Toolkit Tutorial - Build Themes & Automate SEO in Minutes](https://websensepro.com/blog/shopify-ai-toolkit-tutorial-build-themes-automate-seo-in-minutes/) 
*   **相关**： [Shopify CLI](https://shopify.dev/docs/api/shopify-cli)  · [Scaffold an app](https://shopify.dev/docs/apps/build/scaffold-app)  · [Storefront MCP](https://shopify.dev/docs/apps/build/storefront-mcp) 
*   **本站**： [Shopify 应用开发](https://shopify.baoea.com/advanced/shopify-app-development) · [AI 辅助与主题工程化](https://shopify.baoea.com/liquid/ai-theme-engineering) · [独立站与 AI：热点能力地图](https://shopify.baoea.com/advanced/ai-hot-topics-independent-stores) · [Storefront MCP 简介](https://shopify.baoea.com/advanced/storefront-mcp-overview)

* * *

> **提示**：Shopify 对插件市场、MCP 字段名与 VS Code 行为会迭代更新；若本文与 [shopify.dev 当前页](https://shopify.dev/docs/apps/build/ai-toolkit)  不一致，**以官方页面为准**。
