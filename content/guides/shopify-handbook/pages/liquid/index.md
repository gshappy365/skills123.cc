---
source_url: "https://shopify.baoea.com/liquid"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:23:43"
fetch_method: "http"
content_hash: "1a845b139404a3a94d96b20a9468a7112283bb353de5b693ea8eedd7d7346892"
discovered_via: ["sitemap", "internal_link"]
---
Liquid 开发

Liquid 开发指南

## Liquid 模板语言指南

![Shopify Liquid 模板语言指南](https://shopify.baoea.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fshopify-liquid-guide-cover.03dddbf7.png&w=3840&q=75)

本专栏面向 **Shopify 主题与分区开发者**，从环境搭建到上线与排错，覆盖 Liquid 语法、Shopify 对象、OS 2.0 分区架构、性能与安全。示例默认面向 **Online Store 2.0**（JSON 模板 + Section），旧版 `img_url` 等写法会在对应章节标注迁移方式。

## 本专栏约定[](https://shopify.baoea.com/liquid#%E6%9C%AC%E4%B8%93%E6%A0%8F%E7%BA%A6%E5%AE%9A)

| 约定项 | 说明 |
| --- | --- |
| Shopify Liquid | 在 Shopify 中运行的 Liquid 含官方扩展过滤器与对象，与纯开源 Liquid 文档略有差异，以 shopify.dev Liquid 参考  为准 |
| 图片 URL | 新代码统一使用 image_url（width / height / format），避免使用已弃用的 img_url |
| 可运行性 | 文中代码需在对应模板上下文存在（如 product 仅在产品页、section 仅在 section 内） |
| Theme Check | 建议本地启用 Theme Check ，与文档中的规范（如 render 参数、翻译键）对齐 |

## 什么是 Liquid？[](https://shopify.baoea.com/liquid#%E4%BB%80%E4%B9%88%E6%98%AF-liquid)

Liquid 由 Shopify 开源，用于在 HTML 中安全地输出数据与控制逻辑：**对象** `{{ }}`、**标签** `{% %}`、**过滤器** `|`。主题中几乎所有 `.liquid` 文件都依赖它。

*   **易学**：语法集中，设计师与开发者都能参与
*   **沙箱**：不能直接执行任意服务端代码，降低模板注入风险
*   **生态**：除 Shopify 外，也被 Jekyll 等工具使用；本专栏仅讨论 **Shopify 主题场景**

**必读官方入口：** [Liquid 基础（Shopify）](https://shopify.dev/docs/api/liquid/basics) 

## 全章导航（按学习顺序）[](https://shopify.baoea.com/liquid#%E5%85%A8%E7%AB%A0%E5%AF%BC%E8%88%AA%E6%8C%89%E5%AD%A6%E4%B9%A0%E9%A1%BA%E5%BA%8F)

| 模块 | 文章 | 你将掌握 |
| --- | --- | --- |
| 环境与工作流 | 开发环境搭建、Shopify CLI、主题开发工作流程、开发工具 | 本地跑店、拉主题、调试与协作 |
| AI 与工程化 | AI 辅助与主题工程化、主题工程化：目录与 npm 脚本 | AI 与流程；scripts/、脱敏 package.json、Husky / Theme Check |
| Liquid 基础 | 快速入门、语法基础、变量、数据类型、运算符 | 输出、条件、循环、赋值与类型 |
| 核心概念 | 对象、过滤器、标签 | 对象图、常用过滤器、控制流 |
| Shopify 对象 | Shopify 对象、全局对象、产品、客户、购物车 | 各模板可用对象与典型字段 |
| 主题实战 | 布局与模板、自定义分区、片段、主题设置、响应式 | layout、section schema、snippet 参数 |
| 进阶与性能 | 高级技巧、Ajax 与 Liquid、性能优化、本地化 | 片段性能、Section Rendering、图片与 CLS |
| 电商与集成 | 电商功能、第三方集成 | 购物车、结账周边、脚本与 App 块注意点 |
| 规范与交付 | 最佳实践、主题开发实践、代码组织、安全、测试与部署 | 可维护结构、XSS、上线检查清单 |
| 示例与总结 | 代码示例、常用模式、定制案例、项目实战总结 | 可复制模式与踩坑记录 |
| 排错与资源 | 问题排查、学习资源 | 调试手法与外链索引 |

## 推荐学习路径[](https://shopify.baoea.com/liquid#%E6%8E%A8%E8%8D%90%E5%AD%A6%E4%B9%A0%E8%B7%AF%E5%BE%84)

1.  **第 1 周**：环境 + CLI + [快速入门](https://shopify.baoea.com/liquid/getting-started) + [语法基础](https://shopify.baoea.com/liquid/syntax)
2.  **第 2 周**：[过滤器](https://shopify.baoea.com/liquid/filters) + [标签](https://shopify.baoea.com/liquid/tags) + [Shopify 对象](https://shopify.baoea.com/liquid/shopify-objects)
3.  **第 3 周起**：[自定义分区](https://shopify.baoea.com/liquid/custom-sections) + [主题设置](https://shopify.baoea.com/liquid/theme-settings) + [性能优化](https://shopify.baoea.com/liquid/performance-optimization)，并行 [最佳实践](https://shopify.baoea.com/liquid/best-practices) 与 [AI 辅助与主题工程化](https://shopify.baoea.com/liquid/ai-theme-engineering)

## 为什么学 Liquid？[](https://shopify.baoea.com/liquid#%E4%B8%BA%E4%BB%80%E4%B9%88%E5%AD%A6-liquid)

Shopify storefront 的页面由主题渲染：商家改装修、开发者做定制，都离不开 Liquid 与 JSON 模板。掌握 Liquid + Section Schema，才能稳定交付 **可配置、可升级、可审查** 的主题。

## 核心语法速览[](https://shopify.baoea.com/liquid#%E6%A0%B8%E5%BF%83%E8%AF%AD%E6%B3%95%E9%80%9F%E8%A7%88)

**对象（输出）**

```
{{ product.title }}
```

**标签（逻辑）**

```
{% if product.available %}
  <span>有货</span>
{% endif %}
```

**过滤器（加工输出）**

```
{{ product.price | money }}
{{ product.featured_image | image_url: width: 600 | image_tag: loading: "lazy", alt: product.title }}
```

## 开始学习[](https://shopify.baoea.com/liquid#%E5%BC%80%E5%A7%8B%E5%AD%A6%E4%B9%A0)

建议从 [Liquid 快速入门](https://shopify.baoea.com/liquid/getting-started) 进入，按上表顺序阅读；遇到具体对象字段时查阅 [Shopify 对象](https://shopify.baoea.com/liquid/shopify-objects) 与各业务对象章节。

## 外部参考[](https://shopify.baoea.com/liquid#%E5%A4%96%E9%83%A8%E5%8F%82%E8%80%83)

*   [Shopify Liquid 文档](https://shopify.dev/docs/api/liquid) 
*   [Liquid 语法参考（开源版）](https://shopify.github.io/liquid/) 
*   [主题开发](https://shopify.dev/docs/themes) 
*   [Theme Check](https://shopify.dev/docs/themes/tools/theme-check) 

## 反馈[](https://shopify.baoea.com/liquid#%E5%8F%8D%E9%A6%88)

欢迎通过仓库 Issue 或内部渠道反馈错漏、希望补充的章节标题，便于持续修订本专栏与示例代码。

最后更新时间：

2026年6月27日

[开发环境搭建](https://shopify.baoea.com/liquid/environment-setup "开发环境搭建")
