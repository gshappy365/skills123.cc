---
source_url: "https://shopify.baoea.com/basic/shopify-folders"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:23"
fetch_method: "http"
content_hash: "cf07651af15e94d2e736e0413950d5d1da8c99224848c218d062744386b210fa"
discovered_via: ["sitemap", "internal_link"]
---
## Shopify 主题目录结构（Liquid 文件）详解

Shopify 使用 [Liquid](https://shopify.dev/docs/api/liquid)  模板语言来构建主题。每个 Shopify 主题都由多个文件夹组成，其中的 `.liquid` 文件是页面渲染的核心。本篇将为你详细介绍 Shopify 主题中主要目录及其 Liquid 文件的用途与开发建议。

## 📺 视频教程[](https://shopify.baoea.com/basic/shopify-folders#-%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B)

配套视频教程：[Shopify 主题目录结构详解 - B站视频](https://www.bilibili.com/video/BV1ebLczjEHs/?spm_id_from=333.1387.collection.video_card.click&vd_source=7bfc5fde0cd7cd04655174bc2d0ef441) 

通过视频和文档结合学习，能够更好地理解 Shopify 主题的目录结构和开发流程。

* * *

## 目录结构[](https://shopify.baoea.com/basic/shopify-folders#%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)

2025最新主题代码目录有8个文件夹，分别具有不同的功能和用途。主题必须使用以下标准目录结构，不支持列出的子目录以外的子目录。

**Shopify 主题目录结构**

*   *   *   theme.liquid
        *   password.liquid
    *   *   404.json
        *   index.json
        *   product.json
        *   collection.json
        *   article.json
        *   blog.json
        *   *   account.json
            *   login.json
            *   register.json
        *   *   custom.json
    *   *   header.liquid
        *   footer.liquid
        *   main-product.liquid
        *   featured-collection.liquid
    *   *   slide.liquid
        *   text-block.liquid
    *   *   product-card.liquid
        *   price.liquid
    *   *   base.css
        *   theme.js
        *   logo.png
    *   *   settings\_schema.json
        *   settings\_data.json
    *   *   en.default.json
        *   en.default.schema.json
        *   zh-CN.json
        *   zh-CN.schema.json

## 📁 Layout 布局目录[](https://shopify.baoea.com/basic/shopify-folders#-layout-%E5%B8%83%E5%B1%80%E7%9B%AE%E5%BD%95)

### 常见文件：[](https://shopify.baoea.com/basic/shopify-folders#%E5%B8%B8%E8%A7%81%E6%96%87%E4%BB%B6)

*   `theme.liquid`
*   `password.liquid`

### 作用：[](https://shopify.baoea.com/basic/shopify-folders#%E4%BD%9C%E7%94%A8)

布局是主题的基础，所有模板都通过它呈现。默认布局文件是 `theme.liquid`，遵循标准 HTML 文档的结构。

```
<!DOCTYPE html>
<html>
  <head>
    ...
    {{ content_for_header }}
    ...
  </head>
 
  <body>
    ...
    {{ content_for_layout }}
    ...
  </body>
 </html>
```

`password.liquid` 则为 “**密码保护页面**”的内容。

### 布局文件的关键对象：[](https://shopify.baoea.com/basic/shopify-folders#%E5%B8%83%E5%B1%80%E6%96%87%E4%BB%B6%E7%9A%84%E5%85%B3%E9%94%AE%E5%AF%B9%E8%B1%A1)

#### `{{ content_for_header }}`[](https://shopify.baoea.com/basic/shopify-folders#-content_for_header-)

*   **必须**放置在 HTML `<head>` 标签内
*   用于动态加载 Shopify 所需的脚本（如 hCaptcha、Shopify 应用等）
*   开发者不应尝试修改或解析此对象

#### `{{ content_for_layout }}`[](https://shopify.baoea.com/basic/shopify-folders#-content_for_layout-)

*   动态输出每个模板的内容
*   需要在 `<body>` 标签内添加对它的引用
*   这里是各个页面模板内容的插入点

### 开发建议：[](https://shopify.baoea.com/basic/shopify-folders#%E5%BC%80%E5%8F%91%E5%BB%BA%E8%AE%AE)

*   使用 `{{ content_for_header }}` 插入 Shopify 自动注入的脚本
*   用 `{{ content_for_layout }}` 保留页面具体内容的位置
*   可以通过修改该文件，应用于所有非结帐页面

* * *

## 📁 Templates 模板目录[](https://shopify.baoea.com/basic/shopify-folders#-templates-%E6%A8%A1%E6%9D%BF%E7%9B%AE%E5%BD%95)

### 常见文件：[](https://shopify.baoea.com/basic/shopify-folders#%E5%B8%B8%E8%A7%81%E6%96%87%E4%BB%B6-1)

*   `404.json`：404 页面
*   `index.json`：主页模板
*   `product.json`：产品详情页
*   `collection.json`：集合页面
*   `article.json`：文章页面
*   `blog.json`：博客页面
*   `cart.json`：购物车页面
*   `search.json`：搜索页
*   `page.json`：自定义页面
*   `customers/`：客户相关页面
    *   `account.json`：客户账户页
    *   `login.json`：登录页
    *   `register.json`：注册页
*   `metaobject/`：元对象模板

### 可使用的模板类型：[](https://shopify.baoea.com/basic/shopify-folders#%E5%8F%AF%E4%BD%BF%E7%94%A8%E7%9A%84%E6%A8%A1%E6%9D%BF%E7%B1%BB%E5%9E%8B)

| 类型 | 描述 |
| --- | --- |
| 404 | 渲染当客户输入商店的无效 URL 时显示的页面内容 |
| article | 渲染文章页面，包含文章的全部内容以及可选的客户评论部分 |
| blog | 渲染博客页面，列出博客中的所有文章 |
| cart | 渲染购物车页面 |
| collection | 渲染集合页面，显示产品列表 |
| customers | 渲染客户相关页面（登录、注册、账户等） |
| gift_card | 渲染礼品卡页面 |
| index | 渲染商店主页 |
| list-collections | 渲染所有集合的列表页面 |
| page | 渲染自定义页面 |
| password | 渲染密码保护页面 |
| product | 渲染产品详情页 |
| search | 渲染搜索结果页面 |

主题模板有两种不同的文件类型：`JSON` 和 `Liquid`。这些模板文件类型可用于构建多种模板类型，每种模板类型代表商家在线商店中的一种内容类型。

| 类型 | 描述 |
| --- | --- |
| JSON | JSON 模板是带有文件扩展名的数据文件。这些模板可让您轻松地使用来自部分.json的内容填充模板。商家可以使用模板编辑器添加、删除或重新排列部分。如果您使用 JSON 模板，则任何 HTML 或 Liquid 代码都需要包含在模板引用的部分中。 JSON 模板 |
| Liquid | Liquid 模板是Liquid标记文件，.liquid文件扩展名为。您可以直接将 Liquid 和 HTML 添加到 Liquid 模板中。Liquid 模板 |

### 作用：[](https://shopify.baoea.com/basic/shopify-folders#%E4%BD%9C%E7%94%A8-1)

模板控制的是“**页面类型的整体结构**”。它会根据页面路径自动加载对应模板，并通过 `section` 渲染具体内容。

### 开发建议：[](https://shopify.baoea.com/basic/shopify-folders#%E5%BC%80%E5%8F%91%E5%BB%BA%E8%AE%AE-1)

*   保持模板逻辑简洁，内容交给 Section 处理。
*   使用 `template.[name].json`（Online Store 2.0）代替传统 `.liquid` 的灵活布局。

* * *

## 📁 Sections 分区目录[](https://shopify.baoea.com/basic/shopify-folders#-sections-%E5%88%86%E5%8C%BA%E7%9B%AE%E5%BD%95)

### 常见文件：[](https://shopify.baoea.com/basic/shopify-folders#%E5%B8%B8%E8%A7%81%E6%96%87%E4%BB%B6-2)

*   `header.liquid`、`footer.liquid`
*   `main-product.liquid`
*   `main-collection-product-grid.liquid`
*   `featured-collection.liquid`
*   `rich-text.liquid`、`image-banner.liquid`

### 作用：[](https://shopify.baoea.com/basic/shopify-folders#%E4%BD%9C%E7%94%A8-2)

**Sections 是构建页面的主要模块化单元**，支持自定义排序、显示与隐藏。支持全局（所有页）或基于模板渲染的局部块。

### Sections 内容构成：[](https://shopify.baoea.com/basic/shopify-folders#sections-%E5%86%85%E5%AE%B9%E6%9E%84%E6%88%90)

#### 1\. 主内容[](https://shopify.baoea.com/basic/shopify-folders#1-%E4%B8%BB%E5%86%85%E5%AE%B9)

可以包含任何 HTML 或 Liquid 内容。section 可以访问全局对象、标签和过滤器，以及特定的 `section` 和 `block` 对象。

#### 2\. 资产[](https://shopify.baoea.com/basic/shopify-folders#2-%E8%B5%84%E4%BA%A7)

section 可以使用特定的 Liquid 标签 `{% javascript %}` 和 `{% stylesheet %}` 来捆绑自己的 JavaScript 和样式表资产。

#### 3\. Schema[](https://shopify.baoea.com/basic/shopify-folders#3-schema)

section 支持 `{% schema %}` Liquid 标签，用于定义 section 的属性和设置，如名称、标签、类、限制、设置、最大 section 数、预设、默认值、语言环境、启用于和禁用于等。

### 完整示例：[](https://shopify.baoea.com/basic/shopify-folders#%E5%AE%8C%E6%95%B4%E7%A4%BA%E4%BE%8B)

```
// CSS 样式
{{ 'section-main-page.css' | asset_url | stylesheet_tag }}
 
{%- style -%}
  @media screen and (min-width: 750px) {
    .section-{{ section.id }}-padding {
      padding-top: {{ section.settings.padding_top }}px;
      padding-bottom: {{ section.settings.padding_bottom }}px;
    }
  }
{%- endstyle -%}
 
// 主内容
<div class="page-width section-{{ section.id }}-padding">
  {% if section.settings.show_title %}
    <h1>
      {{ page.title | escape }}
    </h1>
  {% endif %}
</div>
 
// Schema 配置
{% schema %}
  {
    "name": "t:sections.main-page.name",
    "tag": "section",
    "class": "section",
    "settings": [
      {
        "type": "header",
        "content": "t:sections.all.padding.section_padding_heading"
      }, {
        "type": "checkbox",
        "id": "show_title",
        "label": "Show title"
      }
    ]
  }
{% endschema %}
```

### 开发建议：[](https://shopify.baoea.com/basic/shopify-folders#%E5%BC%80%E5%8F%91%E5%BB%BA%E8%AE%AE-2)

*   利用 `schema` 字段配置设置项，支持 Shopify 主题编辑器（Theme Editor）
*   合理使用 `settings` 与 `blocks` 提高模块灵活性
*   使用 `{% stylesheet %}` 和 `{% javascript %}` 标签管理 section 专用资源

## 📁 Snippets 小片段目录[](https://shopify.baoea.com/basic/shopify-folders#-snippets-%E5%B0%8F%E7%89%87%E6%AE%B5%E7%9B%AE%E5%BD%95)

### 常见文件：[](https://shopify.baoea.com/basic/shopify-folders#%E5%B8%B8%E8%A7%81%E6%96%87%E4%BB%B6-3)

*   `product-card.liquid`
*   `price.liquid`

### 作用：[](https://shopify.baoea.com/basic/shopify-folders#%E4%BD%9C%E7%94%A8-3)

**Snippets 主要目的是提供代码复用的功能**，通常用于页面的局部渲染。

### 特点：[](https://shopify.baoea.com/basic/shopify-folders#%E7%89%B9%E7%82%B9)

*   **无独立设置**：snippets 没有自己的设置，但可以访问嵌入它们的 sections 的设置
*   **灵活性**：snippets 可以在不同的 sections、templates 和 layout 文件中引用
*   **传递信息**：sections 可以将信息传递给 snippets，确保正确显示数据

### 示例：创建一个产品卡片，并在多个页面中显示[](https://shopify.baoea.com/basic/shopify-folders#%E7%A4%BA%E4%BE%8B%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E4%BA%A7%E5%93%81%E5%8D%A1%E7%89%87%E5%B9%B6%E5%9C%A8%E5%A4%9A%E4%B8%AA%E9%A1%B5%E9%9D%A2%E4%B8%AD%E6%98%BE%E7%A4%BA)

```
<!-- snippets/product-card.liquid -->
<div class="product-card">
  <img src="{{ product.featured_image | img_url: 'large' }}" alt="{{ product.title }}">
  <h3>{{ product.title }}</h3>
  <p>{{ product.price | money }}</p>
</div>
```

在需要的地方引用：

```
{% render 'product-card', product: product %}
```

### 开发建议：[](https://shopify.baoea.com/basic/shopify-folders#%E5%BC%80%E5%8F%91%E5%BB%BA%E8%AE%AE-3)

*   使用 `{% render 'snippet-name' %}` 引用 snippets（推荐）
*   可以通过参数传递数据给 snippets
*   保持 snippets 功能单一，便于复用和维护

## 📁 Config 配置目录[](https://shopify.baoea.com/basic/shopify-folders#-config-%E9%85%8D%E7%BD%AE%E7%9B%AE%E5%BD%95)

### 常见文件：[](https://shopify.baoea.com/basic/shopify-folders#%E5%B8%B8%E8%A7%81%E6%96%87%E4%BB%B6-4)

*   `settings_schema.json`
*   `settings_data.json`

### 作用：[](https://shopify.baoea.com/basic/shopify-folders#%E4%BD%9C%E7%94%A8-4)

**Config 目录包含主题的配置文件**。配置文件定义主题编辑器的 Theme settings 区域中的设置，并存储其值。

### 配置文件类型：[](https://shopify.baoea.com/basic/shopify-folders#%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B)

#### `settings_schema.json`[](https://shopify.baoea.com/basic/shopify-folders#settings_schemajson)

控制主题编辑器的 **Theme settings**（主题设置）区域的组织和内容。模板编辑器中的所有设置选择都保存在 `settings_data.json` 中。

示例：

```
{
  "name": "Colors",
  "settings": [
    {
      "type": "color",
      "id": "color_page_bg",
      "label": "Page background",
      "default": "#FFFFFF"
    }
  ]
}
```

#### `settings_data.json`[](https://shopify.baoea.com/basic/shopify-folders#settings_datajson)

包含基于 `settings_schema.json` 中包含的设置的主题设置值。每当在模板编辑器中更改设置值时，此文件会自动更新。

示例：

```
{
  "color_page_bg": "#FFFFFF"
}
```

### 在 Liquid 中访问设置：[](https://shopify.baoea.com/basic/shopify-folders#%E5%9C%A8-liquid-%E4%B8%AD%E8%AE%BF%E9%97%AE%E8%AE%BE%E7%BD%AE)

```
{% if settings.favicon != blank %}
  <link rel="icon" type="image/png" href="{{ settings.favicon | image_url: width: 32, height: 32 }}">
{% endif %}
```

### 开发建议：[](https://shopify.baoea.com/basic/shopify-folders#%E5%BC%80%E5%8F%91%E5%BB%BA%E8%AE%AE-4)

*   使用 `settings_schema.json` 定义设置项，支持 Shopify 主题编辑器（Theme Editor）
*   通过 `settings` 对象在 Liquid 中访问所有主题设置
*   合理设置默认值，提升用户体验

## 📁 Assets 资源目录[](https://shopify.baoea.com/basic/shopify-folders#-assets-%E8%B5%84%E6%BA%90%E7%9B%AE%E5%BD%95)

### 常见文件：[](https://shopify.baoea.com/basic/shopify-folders#%E5%B8%B8%E8%A7%81%E6%96%87%E4%BB%B6-5)

*   `base.css`、`theme.css`
*   `theme.js`
*   `logo.png`、图片文件

### 作用：[](https://shopify.baoea.com/basic/shopify-folders#%E4%BD%9C%E7%94%A8-5)

**Assets 目录包含主题中使用的所有资源**，包括图像、CSS 和 JavaScript 文件等静态资源。

### 使用方法：[](https://shopify.baoea.com/basic/shopify-folders#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95)

使用 `asset_url` Liquid URL 过滤器在模板中引用资源：

```
{{ 'base.css' | asset_url | stylesheet_tag }}
```

输出：

```
<link href="//polinas-potent-potions.myshopify.com/cdn/shop/t/4/assets/base.css?v=88290808517547527771663872409" rel="stylesheet" type="text/css" media="all" />
```

### 开发建议：[](https://shopify.baoea.com/basic/shopify-folders#%E5%BC%80%E5%8F%91%E5%BB%BA%E8%AE%AE-5)

*   使用 `asset_url` 过滤器引用静态资源
*   使用 `stylesheet_tag` 和 `script_tag` 过滤器包装 CSS 和 JS 文件
*   合理组织资源文件，便于维护和优化

## 📁 Locales 本地化目录[](https://shopify.baoea.com/basic/shopify-folders#-locales-%E6%9C%AC%E5%9C%B0%E5%8C%96%E7%9B%AE%E5%BD%95)

### 常见文件：[](https://shopify.baoea.com/basic/shopify-folders#%E5%B8%B8%E8%A7%81%E6%96%87%E4%BB%B6-6)

*   `en.default.json`
*   `en.default.schema.json`
*   `zh-CN.json`
*   `zh-CN.schema.json`

### 作用：[](https://shopify.baoea.com/basic/shopify-folders#%E4%BD%9C%E7%94%A8-6)

**Locales 目录提供多语言支持**，允许开发者将主题和主题编辑器中的文本内容翻译成多种语言，方便国际商家和客户使用。集中管理文本内容，商家可以在 Shopify 语言编辑器中轻松编辑这些重复出现的文本。

### 文件类型：[](https://shopify.baoea.com/basic/shopify-folders#%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B)

#### `.json` 文件[](https://shopify.baoea.com/basic/shopify-folders#json-%E6%96%87%E4%BB%B6)

*   文件扩展名为 `.json`，用于控制**前端内容的翻译**
*   商家可以通过 Shopify 语言编辑器编辑这些翻译

#### `.schema.json` 文件[](https://shopify.baoea.com/basic/shopify-folders#schemajson-%E6%96%87%E4%BB%B6)

*   文件扩展名为 `.schema.json`，用于控制**主题编辑器设置的翻译**
*   为主题编辑器中的设置标签和说明提供多语言支持

### 默认语言文件：[](https://shopify.baoea.com/basic/shopify-folders#%E9%BB%98%E8%AE%A4%E8%AF%AD%E8%A8%80%E6%96%87%E4%BB%B6)

*   必须指定一个默认语言文件，格式为 `*.default.json`，其中 `*` 是选定的语言代码
*   默认情况下，大多数主题使用 `en.default.json`，将主题的默认语言设置为英语

### 开发建议：[](https://shopify.baoea.com/basic/shopify-folders#%E5%BC%80%E5%8F%91%E5%BB%BA%E8%AE%AE-6)

*   使用 `{{ 'key' | t }}` 在 Liquid 中引用本地化文本
*   为所有用户可见的文本提供翻译键
*   保持翻译键名称的语义化和一致性

## 📁 Blocks 区块目录(2025新增)[](https://shopify.baoea.com/basic/shopify-folders#-blocks-%E5%8C%BA%E5%9D%97%E7%9B%AE%E5%BD%952025%E6%96%B0%E5%A2%9E)

[官方文档连接](https://shopify.dev/docs/storefronts/themes/architecture/blocks) 

### 常见文件：[](https://shopify.baoea.com/basic/shopify-folders#%E5%B8%B8%E8%A7%81%E6%96%87%E4%BB%B6-7)

*   `slide.liquid`
*   `text-block.liquid`

### 作用：[](https://shopify.baoea.com/basic/shopify-folders#%E4%BD%9C%E7%94%A8-7)

**Blocks 是可复用的模块化单元**，支持动态配置和动态渲染。 Blocks 允许开发者将区块拆分成更小、可重复使用的 Liquid 块，从而创建灵活的布局。每个区块都有各自的设置，并且可以在区块内进行添加、移除和重新排序。

### 三种类型的 Blocks：[](https://shopify.baoea.com/basic/shopify-folders#%E4%B8%89%E7%A7%8D%E7%B1%BB%E5%9E%8B%E7%9A%84-blocks)

#### 1\. Theme Blocks（主题块）[](https://shopify.baoea.com/basic/shopify-folders#1-theme-blocks%E4%B8%BB%E9%A2%98%E5%9D%97)

*   在 `/blocks` 文件夹中作为独立的 Liquid 文件创建
*   可以在主题的多个 Section 中重复使用
*   提供最大的灵活性，允许嵌套其他 blocks
*   可以创建”Static blocks”，这些 blocks 在父 block 或 section 中的特定位置固定显示，商家可以隐藏但不能删除

#### 2\. Section Blocks（分区块）[](https://shopify.baoea.com/basic/shopify-folders#2-section-blocks%E5%88%86%E5%8C%BA%E5%9D%97)

*   在 Section 的 Liquid 文件中直接定义
*   在 Section 的 `{% schema %}` 标签中配置
*   仅限于在定义它们的 Section 中使用，不能在其他地方使用
*   只支持单层结构，不能嵌套

#### 3\. App Blocks（应用程序块）[](https://shopify.baoea.com/basic/shopify-folders#3-app-blocks%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F%E5%9D%97)

*   由商家安装的 Shopify 应用提供
*   允许商家在主题中添加特定于应用的功能，如评论、评分或自定义表单
*   这些功能由商家在其商店中安装的 Shopify 应用定义

### 添加应用程序块支持示例：[](https://shopify.baoea.com/basic/shopify-folders#%E6%B7%BB%E5%8A%A0%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F%E5%9D%97%E6%94%AF%E6%8C%81%E7%A4%BA%E4%BE%8B)

```
{% schema %}
{
  "name": "Slide",
  "blocks": [{ "type": "@theme" }, { "type": "@app" }],
  // Rest of your Schema code
}
{% endschema %}
```

### 开发建议：[](https://shopify.baoea.com/basic/shopify-folders#%E5%BC%80%E5%8F%91%E5%BB%BA%E8%AE%AE-7)

*   合理选择 block 类型，Theme Blocks 适合复用，Section Blocks 适合专用功能
*   使用 `{ "type": "@app" }` 在 schema 中添加应用程序块支持
*   为 blocks 设计清晰的设置选项，提升用户体验

[详细了解Block](https://shopify.baoea.com/basic/shopify-blocks)

* * *

## 总结[](https://shopify.baoea.com/basic/shopify-folders#%E6%80%BB%E7%BB%93)

| 文件夹 | 用途 | 是否可视化编辑 |
| --- | --- | --- |
| layout | 页面框架，包含头部和主内容插槽 | ❌ |
| templates | 页面类型的整体结构 | ✅（Online Store 2.0） |
| sections | 页面构建模块，可复用和动态配置 | ✅ |
| blocks | 可复用的区块/程序块/主题块 | ✅ |
| snippets | 可复用的小片段 | ❌ |
| config | 设置 schema 和数据持久化 | ✅ |
| assets | 主题静态资源 | ❌ |
| locales | 本地化翻译 | ✅ |
