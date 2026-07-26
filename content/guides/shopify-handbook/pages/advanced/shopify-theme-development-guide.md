---
source_url: "https://shopify.baoea.com/advanced/shopify-theme-development-guide"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:41:44"
fetch_method: "http"
content_hash: "1a818aadfd9a1c653b1a13808215c6090b21e952f395379c9519de433c4b6027"
discovered_via: ["sitemap", "internal_link"]
---
Shopify 主题开发自 2021 年 **Online Store 2.0** 推出后发生了根本性变化——从基于固定模板的”主题”，演进为以 **Sections + Blocks + JSON Templates** 为核心的”可视化拖拽系统”。本文聚焦在生产级主题开发的关键模式与决策，**不重复 Liquid 基础语法**（基础语法见 [Liquid 文档](https://shopify.baoea.com/liquid)）。

阅读前置：

*   熟悉 Liquid 基础（assign、for、if、render）
*   熟悉 Shopify 主题目录结构
*   推荐先看 [Liquid 进阶技巧](https://shopify.baoea.com/advanced/advanced-liquid-techniques)

## 一、Online Store 2.0 与旧主题的差异[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E4%B8%80online-store-20-%E4%B8%8E%E6%97%A7%E4%B8%BB%E9%A2%98%E7%9A%84%E5%B7%AE%E5%BC%82)

### 主题文件结构（2.0）[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E4%B8%BB%E9%A2%98%E6%96%87%E4%BB%B6%E7%BB%93%E6%9E%8420)

```
my-theme/
├── assets/                  # 静态资源（CSS、JS、字体、图片）
├── config/
│   ├── settings_schema.json # 主题设置
│   └── settings_data.json   # 主题配置实际值
├── layout/
│   └── theme.liquid         # 主布局
├── sections/                # 可复用 section 与 block
│   ├── header.liquid
│   ├── footer.liquid
│   └── *.liquid
├── snippets/                # 可复用代码片段
├── templates/               # 页面模板（JSON 或 Liquid）
│   ├── product.json         # 2.0 推荐：JSON 模板
│   ├── product.liquid       # 旧：Liquid 模板
│   ├── collection.json
│   └── index.json
├── locales/                 # 多语言文件
└── blocks/                  # 2024 新增：theme blocks（更细粒度）
```

### JSON Templates 取代 Liquid Templates[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#json-templates-%E5%8F%96%E4%BB%A3-liquid-templates)

旧主题：

```
{# templates/product.liquid #}
<div class="product">
  {% section 'product-info' %}
  {% section 'product-recommendations' %}
</div>
```

2.0 主题：

```
{
  "sections": {
    "main": { "type": "main-product", "settings": {} },
    "recommendations": { "type": "product-recommendations", "settings": {} }
  },
  "order": ["main", "recommendations"]
}
```

JSON 模板让**运营人员可以在主题编辑器中拖拽改变 section 顺序**，无需开发介入。

### Sections Everywhere[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#sections-everywhere)

旧主题：sections 仅在首页可用，其他页面是静态 Liquid。

2.0：每个页面都可由多个 sections 组成，每个 section 可包含多个 blocks。运营自由组合。

### 推荐做法[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E6%8E%A8%E8%8D%90%E5%81%9A%E6%B3%95)

*   **所有新主题项目用 2.0 架构**
*   老主题升级时，把 Liquid templates 改为 JSON
*   主 section（如 main-product）建为完整的 section，子组件用 blocks

## 二、Section 与 Block 设计[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E4%BA%8Csection-%E4%B8%8E-block-%E8%AE%BE%E8%AE%A1)

### Section Schema 完整结构[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#section-schema-%E5%AE%8C%E6%95%B4%E7%BB%93%E6%9E%84)

```
{% schema %}
{
  "name": "Featured Products",
  "tag": "section",
  "class": "section-featured-products",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "标题",
      "default": "热门产品"
    },
    {
      "type": "collection",
      "id": "collection",
      "label": "集合"
    },
    {
      "type": "range",
      "id": "products_per_row",
      "label": "每行产品数",
      "min": 2,
      "max": 6,
      "step": 1,
      "default": 4
    }
  ],
  "blocks": [
    {
      "type": "product_card",
      "name": "产品卡片",
      "settings": [
        {
          "type": "product",
          "id": "product",
          "label": "产品"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Featured Products",
      "category": "Products"
    }
  ],
  "max_blocks": 12
}
{% endschema %}
```

### Block 设计原则[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#block-%E8%AE%BE%E8%AE%A1%E5%8E%9F%E5%88%99)

*   每种 block type 独立 schema 定义
*   多个 block 可在同一 section 中重复（运营可加多个产品 / 多张图）
*   单 section 的 blocks 总数有上限（默认 16，可在 schema 设上限）
*   不同 block type 的 settings 完全独立

### 渲染 blocks[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E6%B8%B2%E6%9F%93-blocks)

```
<div class="featured-products">
  {%- if section.settings.title != blank -%}
    <h2>{{ section.settings.title }}</h2>
  {%- endif -%}
 
  <div class="product-grid product-grid--{{ section.settings.products_per_row }}-cols">
    {%- for block in section.blocks -%}
      {%- case block.type -%}
        {%- when 'product_card' -%}
          <div class="product-grid__item" {{ block.shopify_attributes }}>
            {%- if block.settings.product != blank -%}
              {% render 'product-card', product: block.settings.product %}
            {%- endif -%}
          </div>
      {%- endcase -%}
    {%- endfor -%}
  </div>
</div>
```

`{{ block.shopify_attributes }}` **必填**——让主题编辑器能识别并高亮可点击的 block。

## 三、theme.liquid 布局规范[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E4%B8%89themeliquid-%E5%B8%83%E5%B1%80%E8%A7%84%E8%8C%83)

### 头部规范[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E5%A4%B4%E9%83%A8%E8%A7%84%E8%8C%83)

```
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="{{ settings.color_brand }}">
 
  {%- liquid
    assign page_title_with_brand = page_title
    unless page_title contains shop.name
      assign page_title_with_brand = page_title | append: ' - ' | append: shop.name
    endunless
  -%}
  <title>{{ page_title_with_brand }}</title>
 
  <meta name="description" content="{{ page_description | default: shop.description | escape }}">
  <link rel="canonical" href="{{ canonical_url }}">
 
  {# Hreflang 多语言 #}
  {%- for locale in shop.published_locales -%}
    <link rel="alternate"
          hreflang="{{ locale.iso_code }}"
          href="{{ canonical_url }}">
  {%- endfor -%}
  <link rel="alternate" hreflang="x-default" href="{{ canonical_url }}">
 
  {# 预连接 + DNS Prefetch #}
  <link rel="preconnect" href="https://cdn.shopify.com" crossorigin>
  <link rel="preconnect" href="https://fonts.shopifycdn.com" crossorigin>
 
  {# 关键 CSS（首屏） #}
  {{ 'critical.css' | asset_url | stylesheet_tag: preload: true }}
 
  {# 非关键 CSS（异步） #}
  <link rel="preload" href="{{ 'theme.css' | asset_url }}" as="style"
        onload="this.onload=null;this.rel='stylesheet'">
 
  {{ content_for_header }}
</head>
<body class="template-{{ template | replace: '.', '-' }}">
  <a class="skip-link" href="#MainContent">跳转到主要内容</a>
 
  {% section 'announcement-bar' %}
  {% section 'header' %}
 
  <main id="MainContent" role="main">
    {{ content_for_layout }}
  </main>
 
  {% section 'footer' %}
 
  {# 非关键 JS 延迟加载 #}
  <script src="{{ 'theme.js' | asset_url }}" defer></script>
</body>
</html>
```

### 关键点[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E5%85%B3%E9%94%AE%E7%82%B9)

*   **`lang` 属性自动取当前 locale**
*   **`<title>` 与 `shop.name` 智能拼接**避免重复
*   **canonical 与 hreflang** 默认输出
*   **preconnect** Shopify CDN 减少 DNS 时间
*   **critical.css** 内联 + **theme.css** 异步加载

## 四、性能优化模式[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E5%9B%9B%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%A8%A1%E5%BC%8F)

### 性能问题的常见来源[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E6%80%A7%E8%83%BD%E9%97%AE%E9%A2%98%E7%9A%84%E5%B8%B8%E8%A7%81%E6%9D%A5%E6%BA%90)

按真实项目影响排序：

1.  循环外缺少 `assign` 缓存集合对象
2.  `image_url` 未指定 width 或 width 过大
3.  首屏图片错加 `loading="lazy"`
4.  `<img>` 缺 width/height（CLS 飙升）
5.  第三方脚本同步加载（INP 飙升）

详细诊断见 [Shopify 商店性能优化](https://shopify.baoea.com/advanced/improving-web-performance)。

### 主题代码层面的性能模式[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E4%B8%BB%E9%A2%98%E4%BB%A3%E7%A0%81%E5%B1%82%E9%9D%A2%E7%9A%84%E6%80%A7%E8%83%BD%E6%A8%A1%E5%BC%8F)

**模式 1：响应式图片 snippet**

```
{# snippets/responsive-image.liquid #}
{%- assign sizes = sizes | default: "100vw" -%}
{%- assign widths = widths | default: "300, 600, 900, 1200" -%}
{%- assign widths_array = widths | split: ", " -%}
 
{%- capture srcset -%}
  {%- for w in widths_array -%}
    {{ image | image_url: width: w }} {{ w }}w{%- unless forloop.last -%},{%- endunless -%}
  {%- endfor -%}
{%- endcapture -%}
 
<img
  src="{{ image | image_url: width: 600 }}"
  srcset="{{ srcset }}"
  sizes="{{ sizes }}"
  alt="{{ image.alt | escape }}"
  loading="{{ loading | default: 'lazy' }}"
  fetchpriority="{{ priority | default: 'auto' }}"
  width="{{ image.width }}"
  height="{{ image.height }}"
>
```

调用：

```
{# 首屏 hero 图 #}
{% render 'responsive-image',
   image: section.settings.hero_image,
   sizes: '100vw',
   loading: 'eager',
   priority: 'high' %}
 
{# 产品卡片图 #}
{% render 'responsive-image',
   image: product.featured_image,
   sizes: '(min-width: 768px) 33vw, 100vw',
   widths: '300, 600' %}
```

**模式 2：循环外预加载**

```
{%- liquid
  assign featured_products = collections['featured'].products
  assign product_count = featured_products.size
-%}
 
{%- if product_count > 0 -%}
  {%- for product in featured_products limit: 8 -%}
    {%- render 'product-card', product: product -%}
  {%- endfor -%}
{%- endif -%}
```

**模式 3：第三方脚本延迟**

```
<script>
  function loadDeferred() {
    if (window.deferredLoaded) return;
    window.deferredLoaded = true;
    var scripts = ['{{ "tracking.js" | asset_url }}', 'https://example.com/widget.js'];
    scripts.forEach(function(src) {
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      document.head.appendChild(s);
    });
  }
  ['scroll', 'click', 'keydown'].forEach(function(e) {
    window.addEventListener(e, loadDeferred, { once: true, passive: true });
  });
  setTimeout(loadDeferred, 5000);
</script>
```

## 五、JavaScript 架构[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E4%BA%94javascript-%E6%9E%B6%E6%9E%84)

### 现代 Shopify 主题 JS 趋势[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E7%8E%B0%E4%BB%A3-shopify-%E4%B8%BB%E9%A2%98-js-%E8%B6%8B%E5%8A%BF)

*   **Web Components**：原生 Custom Elements，零依赖
*   **Alpine.js**：轻量框架，适合简单交互
*   **Stimulus**：HTML-first 框架
*   **vanilla TypeScript**：性能最优但开发复杂

**不推荐**：

*   jQuery（过时、体积大）
*   完整 React 框架（除非 Headless）
*   多个框架混用

### Web Components 示例：Cart Drawer[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#web-components-%E7%A4%BA%E4%BE%8Bcart-drawer)

```
class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.openButton = this.querySelector('[data-open]');
    this.closeButton = this.querySelector('[data-close]');
  }
 
  connectedCallback() {
    this.openButton?.addEventListener('click', () => this.open());
    this.closeButton?.addEventListener('click', () => this.close());
    document.addEventListener('cart:updated', () => this.refresh());
  }
 
  open() {
    this.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
 
  close() {
    this.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
 
  async refresh() {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    this.updateUI(cart);
  }
 
  updateUI(cart) {
    this.querySelector('[data-cart-count]').textContent = cart.item_count;
    this.querySelector('[data-cart-subtotal]').textContent =
      this.formatMoney(cart.total_price);
  }
 
  formatMoney(cents) {
    return (cents / 100).toFixed(2);
  }
}
 
customElements.define('cart-drawer', CartDrawer);
```

```
<cart-drawer aria-hidden="true">
  <button data-open>购物车 ({{ cart.item_count }})</button>
  <div class="drawer">
    <button data-close>关闭</button>
    <ul>
      {%- for item in cart.items -%}
        {# 渲染 item #}
      {%- endfor -%}
    </ul>
    <p>小计：<span data-cart-subtotal>{{ cart.total_price | money }}</span></p>
  </div>
</cart-drawer>
```

### Cart API 交互[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#cart-api-%E4%BA%A4%E4%BA%92)

```
// 加入购物车
async function addToCart(variantId, quantity) {
  const response = await fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: variantId, quantity: quantity })
  });
 
  if (!response.ok) {
    throw new Error('Add to cart failed');
  }
 
  const item = await response.json();
 
  document.dispatchEvent(new CustomEvent('cart:added', { detail: item }));
  document.dispatchEvent(new CustomEvent('cart:updated'));
 
  return item;
}
 
// 更新数量
async function updateCartItem(line, quantity) {
  const response = await fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ line, quantity })
  });
 
  return response.json();
}
```

## 六、SEO 集成[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E5%85%ADseo-%E9%9B%86%E6%88%90)

### 自动生成的结构化数据[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E7%9A%84%E7%BB%93%E6%9E%84%E5%8C%96%E6%95%B0%E6%8D%AE)

针对产品页：

```
{# snippets/product-schema.liquid #}
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": {{ product.title | json }},
  "image": [
    {%- for image in product.images limit: 5 -%}
      {{ image | image_url: width: 1200 | json }}
      {%- unless forloop.last -%},{%- endunless -%}
    {%- endfor -%}
  ],
  "description": {{ product.description | strip_html | json }},
  "sku": {{ product.selected_or_first_available_variant.sku | json }},
  "brand": {
    "@type": "Brand",
    "name": {{ product.vendor | json }}
  },
  "offers": {
    "@type": "Offer",
    "url": {{ shop.url | append: product.url | json }},
    "priceCurrency": {{ cart.currency.iso_code | json }},
    "price": "{{ product.price | divided_by: 100.00 }}",
    "availability": "{%- if product.available -%}https://schema.org/InStock{%- else -%}https://schema.org/OutOfStock{%- endif -%}",
    {% if product.metafields.reviews.rating_count > 0 %}
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "{{ product.metafields.reviews.rating.value }}",
      "reviewCount": "{{ product.metafields.reviews.rating_count }}"
    }
    {% endif %}
  }
}
</script>
```

### Meta 标签[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#meta-%E6%A0%87%E7%AD%BE)

```
{# Open Graph #}
<meta property="og:type" content="{% if template contains 'product' %}product{% else %}website{% endif %}">
<meta property="og:title" content="{{ page_title | escape }}">
<meta property="og:description" content="{{ page_description | default: shop.description | escape }}">
<meta property="og:url" content="{{ canonical_url }}">
{%- if template contains 'product' -%}
  <meta property="og:image" content="https:{{ product.featured_image | image_url: width: 1200 }}">
  <meta property="product:price:amount" content="{{ product.price | divided_by: 100.0 }}">
  <meta property="product:price:currency" content="{{ cart.currency.iso_code }}">
{%- endif -%}
 
{# Twitter Card #}
<meta name="twitter:card" content="summary_large_image">
```

## 七、可访问性（A11y）[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E4%B8%83%E5%8F%AF%E8%AE%BF%E9%97%AE%E6%80%A7a11y)

### 语义化 HTML[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E8%AF%AD%E4%B9%89%E5%8C%96-html)

```
{# 不推荐 #}
<div class="header">
  <div class="nav">
    <div class="menu-item"><a href="...">Home</a></div>
  </div>
</div>
 
{# 推荐 #}
<header>
  <nav aria-label="主导航">
    <ul>
      <li><a href="..." {% if request.path == '/' %}aria-current="page"{% endif %}>Home</a></li>
    </ul>
  </nav>
</header>
```

### 表单标签[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E8%A1%A8%E5%8D%95%E6%A0%87%E7%AD%BE)

```
<form action="/contact" method="post">
  <label for="contact-email">电子邮箱</label>
  <input id="contact-email" name="contact[email]" type="email" required
         aria-describedby="email-help">
  <small id="email-help">仅用于回复您的咨询</small>
  <button type="submit">提交</button>
</form>
```

### 跳转链接[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5)

```
<a class="skip-link" href="#MainContent">跳转到主要内容</a>
```

配合 CSS：

```
.skip-link {
  position: absolute;
  left: -9999px;
}
.skip-link:focus {
  position: fixed;
  top: 0;
  left: 0;
  background: white;
  padding: 1rem;
  z-index: 9999;
}
```

### 颜色对比[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E9%A2%9C%E8%89%B2%E5%AF%B9%E6%AF%94)

按 WCAG AA 标准：

*   正文文字 ≥ 4.5:1
*   大字号 ≥ 3:1
*   UI 组件 ≥ 3:1

用浏览器 DevTools Lighthouse Accessibility 检查。

## 八、Shopify CLI 开发流程[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E5%85%ABshopify-cli-%E5%BC%80%E5%8F%91%E6%B5%81%E7%A8%8B)

### 安装[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E5%AE%89%E8%A3%85)

```
npm install -g @shopify/cli @shopify/theme
shopify auth login
```

### 本地开发[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E6%9C%AC%E5%9C%B0%E5%BC%80%E5%8F%91)

```
# 拉取主题代码
shopify theme pull --store=my-store.myshopify.com --theme=THEME_ID
 
# 启动本地预览
cd my-theme
shopify theme dev --store=my-store.myshopify.com
 
# 修改代码 → 自动热重载
```

### 推送修改[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E6%8E%A8%E9%80%81%E4%BF%AE%E6%94%B9)

```
# 推送到 unpublished theme（推荐先测试）
shopify theme push --unpublished
 
# 直接更新现有主题
shopify theme push --theme=THEME_ID
```

### 检查代码[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E6%A3%80%E6%9F%A5%E4%BB%A3%E7%A0%81)

```
# 静态检查
shopify theme check
 
# 输出错误、警告、建议
```

## 九、生产部署流程[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E4%B9%9D%E7%94%9F%E4%BA%A7%E9%83%A8%E7%BD%B2%E6%B5%81%E7%A8%8B)

### 推荐工作流[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E6%8E%A8%E8%8D%90%E5%B7%A5%E4%BD%9C%E6%B5%81)

```
本地开发
   ↓ shopify theme push --unpublished
Unpublished Theme（测试）
   ↓ Theme editor 测试
   ↓ Lighthouse 性能验证
   ↓ 关键流程手动测试（购买、加购、登录）
Live Theme（生产）
```

### 版本管理[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E7%89%88%E6%9C%AC%E7%AE%A1%E7%90%86)

主题代码用 Git 管理：

```
main          # 当前生产版本
develop       # 开发分支
feature/xxx   # 功能开发
```

每次发布 tag：`v1.2.3`，便于回滚。

### 灰度发布[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E7%81%B0%E5%BA%A6%E5%8F%91%E5%B8%83)

大改动时：

1.  推送到 unpublished theme
2.  通过 [Shopify Theme Preview](https://shopify.dev/themes/tools/preview)  共享 preview URL
3.  内部测试 1-3 天
4.  灰度部分流量（用第三方 A/B 工具如 Intelligems）
5.  全量切换

## 十、避免的常见错误[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E5%8D%81%E9%81%BF%E5%85%8D%E7%9A%84%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF)

### 错误 1：未升级到 Online Store 2.0[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E9%94%99%E8%AF%AF-1%E6%9C%AA%E5%8D%87%E7%BA%A7%E5%88%B0-online-store-20)

旧 Liquid templates 已不再获得 Shopify 新功能支持。新主题项目必须 2.0。

### 错误 2：硬编码英文文案[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E9%94%99%E8%AF%AF-2%E7%A1%AC%E7%BC%96%E7%A0%81%E8%8B%B1%E6%96%87%E6%96%87%E6%A1%88)

```
{# 反例 #}
<button>Add to Cart</button>
 
{# 推荐 #}
<button>{{ 'products.product.add_to_cart' | t }}</button>
```

### 错误 3：忽略 block.shopify\_attributes[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E9%94%99%E8%AF%AF-3%E5%BF%BD%E7%95%A5-blockshopify_attributes)

未输出该属性的 block 在主题编辑器中不能被选中编辑。

### 错误 4：在主题中存储大量逻辑[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E9%94%99%E8%AF%AF-4%E5%9C%A8%E4%B8%BB%E9%A2%98%E4%B8%AD%E5%AD%98%E5%82%A8%E5%A4%A7%E9%87%8F%E9%80%BB%E8%BE%91)

复杂业务逻辑应该在应用 / 服务器端实现，主题只负责展示。

### 错误 5：不验证主题在 mobile 上的表现[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E9%94%99%E8%AF%AF-5%E4%B8%8D%E9%AA%8C%E8%AF%81%E4%B8%BB%E9%A2%98%E5%9C%A8-mobile-%E4%B8%8A%E7%9A%84%E8%A1%A8%E7%8E%B0)

主题改完只在桌面测试。多数 Shopify 流量来自移动端。

## 十一、相关教程[](https://shopify.baoea.com/advanced/shopify-theme-development-guide#%E5%8D%81%E4%B8%80%E7%9B%B8%E5%85%B3%E6%95%99%E7%A8%8B)

*   [Liquid 进阶技巧](https://shopify.baoea.com/advanced/advanced-liquid-techniques)
*   [Liquid 最佳实践](https://shopify.baoea.com/liquid/best-practices)
*   [Shopify 主题开发实战](https://shopify.baoea.com/advanced/shopify-local-theme-development)
*   [Web 性能优化指南](https://shopify.baoea.com/advanced/web-performance)
*   [Shopify 商店性能优化](https://shopify.baoea.com/advanced/improving-web-performance)
*   [Metafields 与 Metaobjects](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects)
*   [Shopify 主题官方文档](https://shopify.dev/docs/themes) 
*   [Shopify CLI 文档](https://shopify.dev/docs/themes/tools/cli) 
*   [Online Store 2.0 迁移](https://shopify.dev/docs/themes/store/migrate)
