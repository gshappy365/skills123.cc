---
source_url: "https://shopify.baoea.com/advanced/shopify-app-development"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:39:51"
fetch_method: "http"
content_hash: "f083b7e617e8879da5b8c1c5c2703d5c040e6ebaa1c06a8726ed669d1d2f1502"
discovered_via: ["sitemap", "internal_link"]
---
## Shopify App 开发完整指南

Shopify App 是扩展 Shopify 平台能力的标准方式——可以是 Shopify App Store 上架的公开应用、单店专用的 Custom App、或服务于内部业务的私有集成。Shopify 自 2021 年起对 App 开发架构做了多次重大调整（Online Store 2.0、Checkout Extensibility、Theme App Extensions），现在的 App 开发与早期完全不同。

本文是 App 开发的体系性入门。深度技术内容（API、Webhook、Functions）见各对应专题文章。

> 若你在 Cursor / Claude Code / VS Code 等用 AI 辅助开发，推荐启用 [Shopify AI Toolkit](https://shopify.dev/docs/apps/build/ai-toolkit) ，本站导读：[Shopify AI Toolkit 使用指南](https://shopify.baoea.com/advanced/shopify-ai-toolkit)。

## 一、App 类型选择[](https://shopify.baoea.com/advanced/shopify-app-development#%E4%B8%80app-%E7%B1%BB%E5%9E%8B%E9%80%89%E6%8B%A9)

### 三种主要类型[](https://shopify.baoea.com/advanced/shopify-app-development#%E4%B8%89%E7%A7%8D%E4%B8%BB%E8%A6%81%E7%B1%BB%E5%9E%8B)

| 类型 | 分发方式 | 审核 | 适用 |
| --- | --- | --- | --- |
| Public App | Shopify App Store | 必须 | 面向所有商家 |
| Custom App | 单店私有 | 否 | 单一商家深度定制 |
| Private App（已废弃） | 单店 API key | 否 | 已不推荐，逐步淘汰 |

### Public App 的两个亚类[](https://shopify.baoea.com/advanced/shopify-app-development#public-app-%E7%9A%84%E4%B8%A4%E4%B8%AA%E4%BA%9A%E7%B1%BB)

*   **Listed**：在 App Store 公开展示
*   **Unlisted**：通过私有链接安装（如内部工具、企业客户专用）

### 选型决策[](https://shopify.baoea.com/advanced/shopify-app-development#%E9%80%89%E5%9E%8B%E5%86%B3%E7%AD%96)

```
你的 App 是给：
   ↓
单一商家 + 内部业务（不上架）
   → Custom App
   ↓
多个客户 + 内部分发（合作伙伴）
   → Unlisted Public App
   ↓
开放给所有 Shopify 商家
   → Listed Public App（需 App Store 审核）
```

### 商业模型差异[](https://shopify.baoea.com/advanced/shopify-app-development#%E5%95%86%E4%B8%9A%E6%A8%A1%E5%9E%8B%E5%B7%AE%E5%BC%82)

| 模型 | Custom App | Public App |
| --- | --- | --- |
| 收入 | 按项目报价 | 月费 / 一次性 / 免费 |
| 客户关系 | 直接合同 | Shopify 居间 |
| 维护 | 客户付费 | 月度订阅持续支持 |
| Shopify 抽成 | 0 | 0-20% |

## 二、开发环境搭建[](https://shopify.baoea.com/advanced/shopify-app-development#%E4%BA%8C%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA)

### Shopify CLI 安装[](https://shopify.baoea.com/advanced/shopify-app-development#shopify-cli-%E5%AE%89%E8%A3%85)

```
npm install -g @shopify/cli @shopify/app
```

### 初始化项目[](https://shopify.baoea.com/advanced/shopify-app-development#%E5%88%9D%E5%A7%8B%E5%8C%96%E9%A1%B9%E7%9B%AE)

```
shopify app init my-app
# 选择模板：
#   - Remix（推荐，Shopify 官方默认）
#   - Node + Vite + React
#   - 仅扩展（无后端）
```

### 项目结构（Remix 模板）[](https://shopify.baoea.com/advanced/shopify-app-development#%E9%A1%B9%E7%9B%AE%E7%BB%93%E6%9E%84remix-%E6%A8%A1%E6%9D%BF)

```
my-app/
├── app/                       # Remix 路由 + 业务逻辑
│   ├── routes/
│   ├── shopify.server.ts     # Shopify 连接配置
│   └── db.server.ts          # 数据库
├── extensions/                # App Extensions
│   ├── theme-extension/      # 主题扩展
│   ├── checkout-extension/   # 结账扩展
│   ├── admin-extension/      # Admin UI 扩展
│   └── function/             # Shopify Functions
├── prisma/                    # 数据库 schema
├── shopify.app.toml          # App 配置
└── package.json
```

### 本地开发[](https://shopify.baoea.com/advanced/shopify-app-development#%E6%9C%AC%E5%9C%B0%E5%BC%80%E5%8F%91)

```
# 启动开发服务
shopify app dev
 
# 自动完成：
# - 创建临时 dev s...
```

### 解锁完整内容

此内容仅限VIP会员访问。升级VIP会员即可解锁全部高级教程，获取独家主题代码和商业案例，享受专家1对1咨询服务。

#### 会员专享特权（感谢您的支持）：

*   🔓 解锁全部VIP教程与案例
*   💎 获取独家主题代码和最佳实践
*   🚀 新功能抢先体验、优先更新
*   💬 VIP专属交流社群、月度答疑
*   🎯 1对1专家咨询和定制开发优先级
*   📚 独家商业案例库和跨境电商资讯

**创作不易，您的支持是我前进的动力!**

## 十三、相关教程[](https://shopify.baoea.com/advanced/shopify-app-development#%E5%8D%81%E4%B8%89%E7%9B%B8%E5%85%B3%E6%95%99%E7%A8%8B)

*   [Shopify API 深度应用](https://shopify.baoea.com/advanced/shopify-api-advanced)
*   [Shopify Webhook 完整指南](https://shopify.baoea.com/advanced/shopify-webhooks-guide)
*   [Shopify Scripts 与 Functions](https://shopify.baoea.com/advanced/shopify-scripts)
*   [Headless Commerce 架构](https://shopify.baoea.com/advanced/headless-commerce-architecture)
*   [Shopify AI Toolkit](https://shopify.baoea.com/advanced/shopify-ai-toolkit)
*   [GDPR 合规完整指南](https://shopify.baoea.com/advanced/gdpr-compliance-guide)
*   [Shopify App 官方开发文档](https://shopify.dev/docs/apps) 
*   [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) 
*   [Shopify Polaris 设计系统](https://polaris.shopify.com/)
