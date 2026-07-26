---
source_url: "https://shopify.baoea.com/liquid/code-organization"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:36"
fetch_method: "http"
content_hash: "d209311f405e76235ecc9fdcdfdab353121e7185549a3e0c4c6a890b8d5b6b31"
discovered_via: ["sitemap", "internal_link"]
---
## 代码组织和结构

良好的代码组织是成功的 Shopify 主题开发项目的基础。本指南将介绍如何构建清晰、可维护、可扩展的主题架构。

npm 脚本、`scripts/` 目录与 **Theme ID / 店铺信息脱敏** 的工程化约定见：[主题工程化：目录与 npm 脚本](https://shopify.baoea.com/liquid/theme-engineering-setup)。

## 项目目录结构[](https://shopify.baoea.com/liquid/code-organization#%E9%A1%B9%E7%9B%AE%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)

### 1\. 标准主题目录结构[](https://shopify.baoea.com/liquid/code-organization#1-%E6%A0%87%E5%87%86%E4%B8%BB%E9%A2%98%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)

```
my-shopify-theme/
├── assets/                 # 静态资源
│   ├── css/
│   │   ├── base/          # 基础样式
│   │   ├── components/    # 组件样式
│   │   ├── layout/        # 布局样式
│   │   ├── pages/         # 页面特定样式
│   │   └── vendors/       # 第三方库样式
│   ├── js/
│   │   ├── components/    # 组件脚本
│   │   ├── modules/       # 功能模块
│   │   ├── utils/         # 工具函数
│   │   └── vendors/       # 第三方库
│   ├── images/            # 图片资源
│   └── fonts/             # 字体文件
├── config/                # 配置文件
│   ├── settings_schema.json
│   └── settings_data.json
├── layout/                # 布局模板
│   ├── theme.liquid
│   ├── password.liquid
│   └── checkout.liquid
├── locales/               # 多语言文件
│   ├── en.default.json
│   ├── zh-CN.json
│   └── ja.json
├── sections/              # 可重用分区
│   ├── header.liquid
│   ├── footer.liquid
│   ├── product-form.liquid
│   └── featured-collection.liquid
├── snippets/              # 代码片段
│   ├── components/        # 组件片段
│   ├── helpers/           # 辅助函数
│   ├── icons/             # 图标
│   └── shared/            # 共享片段
├── templates/             # 页面模板
│   ├── 404.liquid
│   ├── article.liquid
│   ├── blog.liquid
│   ├── cart.liquid
│   ├── collection.liquid
│   ├── index.liquid
│   ├── page.liquid
│   ├── product.liquid
│   └── search.liquid
├── docs/                  # 文档
│   ├── README.md
│   ├── CHANGELOG.md
│   └── DEVELOPMENT.md
├── scripts/               # 构建脚本
│   ├── build.js
│   ├── deploy.js
│   └── watch.js
├── tests/                 # 测试文件
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env                   # 环境变量
├── .gitignore
├── package.json
├── shopify.theme.toml
└── README.md
```

### 2\. 模块化CSS架构[](https://shopify.baoea.com/liquid/code-organization#2-%E6%A8%A1%E5%9D%97%E5%8C%96css%E6%9E%B6%E6%9E%84)

```
// assets/css/main.scss
// 主样式入口文件
 
// 1. 变量和配置
@import 'base/variables';
@import 'base/functions';
@import 'base/mixins';
 
// 2. 重置和基础样式
@import 'base/normalize';
@import 'base/typography';
@import 'base/base';
 
// 3. 布局
@import 'layout/grid';
@import 'layout/header';
@import 'layout/footer';
@import 'layout/navigation';
 
// 4. 组件
@import 'components/buttons';
@import 'components/forms';
@import 'components/cards';
@import 'components/modals';
@import 'components/product-card';
@import 'components/cart-drawer';
 
// 5. 页面特定样式
@import 'pages/home';
@import 'pages/product';
@import 'pages/collection';
@import 'pages/cart';
 
// 6. 第三方库
@import 'vendors/swiper';
@import 'vendors/lightbox';
 
// 7. 工具类
@import 'utilities/spacing';
@import 'utilities/visibility';
@import 'utilities/text';
```

### 3\. JavaScript模块组织[](https://shopify.baoea.com/liquid/code-organization#3-javascript%E6%A8%A1%E5%9D%97%E7%BB%84%E7%BB%87)

```
// assets/js/main.js
// 主脚本入口文件
 
// 核心模块
import { App } from './modules/App.js';
import { CartManager } from './modules/CartManager.js';
import { ProductForm } from './modules/ProductForm.js';
import { Navigation } from './modules/Navigation.js';
 
// 组件
import { Modal } from './components/Modal.js';
import { Accordion } from './components/Accordion.js';
import { Tabs } from './components/Tabs.js';
 
// 工具函数
import { debounce, throttle } from './utils/helpers.js';
import { api } from './utils/api.js';
 
// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
```

## 组件化开发[](https://shopify.baoea.com/liquid/code-organization#%E7%BB%84%E4%BB%B6%E5%8C%96%E5%BC%80%E5%8F%91)

### 1\. Liquid组件模式[](https://shopify.baoea.com/liquid/code-organization#1-liquid%E7%BB%84%E4%BB%B6%E6%A8%A1%E5%BC%8F)

```
<!-- snippets/components/product-card.liquid -->
{% comment %}
  产品卡片组件
  
  参数:
  - product: 产品对象 (必需)
  - image_size: 图片尺寸 (可选，默认: '300x300')
  - show_vendor: 是否显示品牌 (可选，默认: false)
  - show_price: 是否显示价格 (可选，默认: true)
  - card_style: 卡片样式 (可选: 'standard', 'minimal', 'detailed')
{% endcomment %}
 
{%- liquid
  assign image_size = image_size | default: '300x300'
  assign show_vendor = show_vendor | default: false
  assign show_price = show_price | default: true
  assign card_style = card_style | default: 'standard'
  assign card_class = 'product-card product-card--' | append: card_style
-%}
 
<div class="{{ card_class }}" data-product-id="{{ product.id }}">
  <div class="product-card__image-wrapper">
    <a href="{{ product.url }}" class="product-card__image-link">
      {% if product.featured_image %}
        {% render 'responsive-image',
          image: product.featured_image,
          alt: product.featured_image.alt | default: product.title,
          sizes: image_size,
          loading: 'lazy'
        %}
      {% else %}
        {% render 'placeholder-image', type: 'product' %}
      {% endif %}
    </a>
    
    {% if product.compare_at_price > product.price %}
      <span class="product-card__badge product-card__badge--sale">
        {{ 'products.general.sale' | t }}
      </span>
    {% endif %}
    
    {% unless product.available %}
      <span class="product-card__badge product-card__badge--sold-out">
        {{ 'products.general.sold_out' | t }}
      </span>
    {% endunless %}
  </div>
  
  <div class="product-card__content">
    {% if show_vendor and product.vendor != blank %}
      <p class="product-card__vendor">{{ product.vendor }}</p>
    {% endif %}
    
    <h3 class="product-card__title">
      <a href="{{ product.url }}">{{ product.title }}</a>
    </h3>
    
    {% if show_price %}
      <div class="product-card__price">
        {% render 'price', product: product %}
      </div>
    {% endif %}
    
    {% if card_style == 'detailed' %}
      {% if product.description != blank %}
        <p class="product-card__description">
          {{ product.description | strip_html | truncate: 100 }}
        </p>
      {% endif %}
      
      <div class="product-card__actions">
        {% render 'quick-add-button', product: product %}
        {% render 'wishlist-button', product: product %}
      </div>
    {% endif %}
  </div>
</div>
```

### 2\. JavaScript组件基类[](https://shopify.baoea.com/liquid/code-organization#2-javascript%E7%BB%84%E4%BB%B6%E5%9F%BA%E7%B1%BB)

```
// assets/js/components/BaseComponent.js
export class BaseComponent {
  constructor(element, options = {}) {
    this.element = element;
    this.options = { ...this.defaultOptions, ...options };
    this.isInitialized = false;
    
    this.init();
  }
  
  get defaultOptions() {
    return {};
  }
  
  init() {
    if (this.isInitialized) return;
    
    this.bindEvents();
    this.render();
    this.isInitialized = true;
    
    this.element.setAttribute('data-component-initialized', 'true');
  }
  
  bindEvents() {
    // 子类重写此方法
  }
  
  render() {
    // 子类重写此方法
  }
  
  destroy() {
    this.unbindEvents();
    this.element.removeAttribute('data-component-initialized');
    this.isInitialized = false;
  }
  
  unbindEvents() {
    // 子类重写此方法
  }
  
  emit(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true
    });
    
    this.element.dispatchEvent(event);
  }
  
  on(eventName, handler) {
    this.element.addEventListener(eventName, handler);
  }
  
  off(eventName, handler) {
    this.element.removeEventListener(eventName, handler);
  }
}
```

### 3\. 具体组件实现[](https://shopify.baoea.com/liquid/code-organization#3-%E5%85%B7%E4%BD%93%E7%BB%84%E4%BB%B6%E5%AE%9E%E7%8E%B0)

```
// assets/js/components/ProductForm.js
import { BaseComponent } from './BaseComponent.js';
import { formatMoney } from '../utils/helpers.js';
 
export class ProductForm extends BaseComponent {
  get defaultOptions() {
    return {
      enableHistory: true,
      enableAjax: true,
      selectors: {
        variantSelect: '[data-variant-select]',
        priceElement: '[data-price]',
        addButton: '[data-add-to-cart]',
        form: 'form[action*="/cart/add"]'
      }
    };
  }
  
  bindEvents() {
    this.variantSelects = this.element.querySelectorAll(this.options.selectors.variantSelect);
    this.priceElement = this.element.querySelector(this.options.selectors.priceElement);
    this.addButton = this.element.querySelector(this.options.selectors.addButton);
    this.form = this.element.querySelector(this.options.selectors.form);
    
    this.variantSelects.forEach(select => {
      select.addEventListener('change', this.handleVariantChange.bind(this));
    });
    
    if (this.options.enableAjax && this.form) {
      this.form.addEventListener('submit', this.handleAddToCart.bind(this));
    }
  }
  
  handleVariantChange() {
    const selectedOptions = Array.from(this.variantSelects).map(select => select.value);
    const variant = this.findVariant(selectedOptions);
    
    this.updatePrice(variant);
    this.updateAddButton(variant);
    this.updateUrl(variant);
    
    this.emit('variant:changed', { variant });
  }
  
  findVariant(selectedOptions) {
    return window.productVariants?.find(variant => {
      return variant.options.every((option, index) => {
        return option === selectedOptions[index];
      });
    });
  }
  
  updatePrice(variant) {
    if (!this.priceElement || !variant) return;
    
    let priceHtml = formatMoney(variant.price);
    
    if (variant.compare_at_price > variant.price) {
      priceHtml = `
        <span class="price--sale">${formatMoney(variant.price)}</span>
        <span class="price--compare">${formatMoney(variant.compare_at_price)}</span>
      `;
    }
    
    this.priceElement.innerHTML = priceHtml;
  }
  
  updateAddButton(variant) {
    if (!this.addButton) return;
    
    if (!variant) {
      this.addButton.disabled = true;
      this.addButton.textContent = '无此组合';
    } else if (!variant.available) {
      this.addButton.disabled = true;
      this.addButton.textContent = '缺货';
    } else {
      this.addButton.disabled = false;
      this.addButton.textContent = '加入购物车';
    }
  }
  
  updateUrl(variant) {
    if (!this.options.enableHistory || !variant) return;
    
    const url = new URL(window.location);
    url.searchParams.set('variant', variant.id);
    
    window.history.replaceState(null, '', url);
  }
  
  async handleAddToCart(event) {
    event.preventDefault();
    
    const formData = new FormData(this.form);
    
    try {
      this.setLoading(true);
      
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const item = await response.json();
        this.emit('cart:added', { item });
      } else {
        throw new Error('添加到购物车失败');
      }
      
    } catch (error) {
      this.emit('cart:error', { error: error.message });
    } finally {
      this.setLoading(false);
    }
  }
  
  setLoading(loading) {
    this.addButton.disabled = loading;
    this.addButton.classList.toggle('loading', loading);
  }
}
```

## 配置管理[](https://shopify.baoea.com/liquid/code-organization#%E9%85%8D%E7%BD%AE%E7%AE%A1%E7%90%86)

### 1\. 主题设置架构[](https://shopify.baoea.com/liquid/code-organization#1-%E4%B8%BB%E9%A2%98%E8%AE%BE%E7%BD%AE%E6%9E%B6%E6%9E%84)

```
// config/settings_schema.json
[
  {
    "name": "theme_info",
    "theme_name": "Custom Theme",
    "theme_version": "1.0.0",
    "theme_author": "Your Name",
    "theme_documentation_url": "https://docs.example.com",
    "theme_support_url": "https://support.example.com"
  },
  {
    "name": "颜色",
    "settings": [
      {
        "type": "header",
        "content": "主要颜色"
      },
      {
        "type": "color",
        "id": "color_primary",
        "label": "主色调",
        "default": "#1a73e8"
      },
      {
        "type": "color",
        "id": "color_secondary", 
        "label": "副色调",
        "default": "#34a853"
      },
      {
        "type": "color",
        "id": "color_accent",
        "label": "强调色",
        "default": "#ea4335"
      }
    ]
  },
  {
    "name": "字体",
    "settings": [
      {
        "type": "font_picker",
        "id": "type_header_font",
        "label": "标题字体",
        "default": "helvetica_n4"
      },
      {
        "type": "font_picker",
        "id": "type_body_font",
        "label": "正文字体", 
        "default": "helvetica_n4"
      },
      {
        "type": "range",
        "id": "type_body_size",
        "label": "正文字体大小",
        "min": 12,
        "max": 24,
        "step": 1,
        "unit": "px",
        "default": 16
      }
    ]
  }
]
```

### 2\. 环境配置管理[](https://shopify.baoea.com/liquid/code-organization#2-%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE%E7%AE%A1%E7%90%86)

```
// scripts/config.js
const environments = {
  development: {
    store: 'your-dev-store.myshopify.com',
    theme: 'development',
    debug: true,
    watch: true
  },
  
  staging: {
    store: 'your-staging-store.myshopify.com', 
    theme: 'staging',
    debug: false,
    watch: false
  },
  
  production: {
    store: 'your-store.myshopify.com',
    theme: 'live',
    debug: false,
    watch: false
  }
};
 
export function getConfig(env = 'development') {
  return environments[env] || environments.development;
}
```

## 命名约定[](https://shopify.baoea.com/liquid/code-organization#%E5%91%BD%E5%90%8D%E7%BA%A6%E5%AE%9A)

### 1\. CSS命名规范 (BEM)[](https://shopify.baoea.com/liquid/code-organization#1-css%E5%91%BD%E5%90%8D%E8%A7%84%E8%8C%83-bem)

```
// 组件样式命名
.product-card {                          // 块 (Block)
  &__image {                            // 元素 (Element)
    display: block;
  }
  
  &__title {
    font-size: 1.2rem;
  }
  
  &--featured {                         // 修饰符 (Modifier)
    border: 2px solid gold;
  }
  
  &--sale {
    position: relative;
    
    &::after {
      content: 'SALE';
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
 
// 状态类
.is-active { }
.is-hidden { }
.is-loading { }
 
// JavaScript钩子类
.js-toggle { }
.js-modal-trigger { }
.js-cart-form { }
```

### 2\. JavaScript命名规范[](https://shopify.baoea.com/liquid/code-organization#2-javascript%E5%91%BD%E5%90%8D%E8%A7%84%E8%8C%83)

```
// 类名使用PascalCase
class ProductRecommendations { }
class CartDrawer { }
 
// 方法和变量使用camelCase
const productData = {};
const isVisible = true;
 
function calculatePrice() { }
function updateCartCount() { }
 
// 常量使用UPPER_SNAKE_CASE
const API_ENDPOINT = '/cart.js';
const DEFAULT_TIMEOUT = 5000;
 
// 事件名使用kebab-case
element.dispatchEvent(new CustomEvent('cart:updated'));
element.dispatchEvent(new CustomEvent('product:variant-changed'));
```

### 3\. Liquid文件命名[](https://shopify.baoea.com/liquid/code-organization#3-liquid%E6%96%87%E4%BB%B6%E5%91%BD%E5%90%8D)

```
// 模板文件
templates/
├── index.liquid              # 首页
├── product.liquid            # 产品页
├── collection.liquid         # 集合页
├── page.contact.liquid       # 联系页面 (特定页面)
└── customers/
    ├── login.liquid          # 客户登录
    └── register.liquid       # 客户注册

// 分区文件
sections/
├── header.liquid             # 头部
├── footer.liquid             # 页脚
├── product-form.liquid       # 产品表单
├── featured-collection.liquid # 特色集合
└── newsletter-signup.liquid  # 邮件订阅

// 代码片段
snippets/
├── product-card.liquid       # 产品卡片
├── price.liquid              # 价格显示
├── icon-cart.liquid          # 购物车图标
├── responsive-image.liquid   # 响应式图片
└── components/               # 组件目录
    ├── modal.liquid
    ├── accordion.liquid
    └── tabs.liquid
```

## 文档和注释[](https://shopify.baoea.com/liquid/code-organization#%E6%96%87%E6%A1%A3%E5%92%8C%E6%B3%A8%E9%87%8A)

### 1\. 代码注释规范[](https://shopify.baoea.com/liquid/code-organization#1-%E4%BB%A3%E7%A0%81%E6%B3%A8%E9%87%8A%E8%A7%84%E8%8C%83)

```
{% comment %}
  产品推荐分区
  
  功能：显示相关产品推荐
  
  设置：
  - heading: 标题文本
  - product_limit: 显示产品数量 (1-12)
  - show_vendor: 是否显示品牌
  - image_ratio: 图片比例 ('square', 'portrait', 'landscape')
  
  依赖：
  - snippets/product-card.liquid
  - assets/recommendations.js
  
  更新记录：
  - 2024-01-15: 初始创建
  - 2024-01-20: 添加图片比例选项
{% endcomment %}
 
{%- liquid
  assign heading = section.settings.heading | default: '相关推荐'
  assign product_limit = section.settings.product_limit | default: 4
  assign show_vendor = section.settings.show_vendor | default: false
-%}
```

### 2\. JavaScript文档注释[](https://shopify.baoea.com/liquid/code-organization#2-javascript%E6%96%87%E6%A1%A3%E6%B3%A8%E9%87%8A)

```
/**
 * 购物车抽屉组件
 * 
 * @class CartDrawer
 * @extends BaseComponent
 * 
 * @example
 * const cartDrawer = new CartDrawer(document.querySelector('[data-cart-drawer]'), {
 *   autoOpen: true,
 *   closeOnOverlay: true
 * });
 * 
 * @since 1.0.0
 * @author Your Name
 */
export class CartDrawer extends BaseComponent {
  /**
   * 创建CartDrawer实例
   * 
   * @param {HTMLElement} element - 购物车抽屉元素
   * @param {Object} options - 配置选项
   * @param {boolean} options.autoOpen - 是否自动打开
   * @param {boolean} options.closeOnOverlay - 点击遮罩是否关闭
   */
  constructor(element, options = {}) {
    super(element, options);
  }
  
  /**
   * 打开购物车抽屉
   * 
   * @fires CartDrawer#drawer:opened
   * @returns {Promise<void>}
   */
  async open() {
    // 实现...
  }
}
```

## 版本控制策略[](https://shopify.baoea.com/liquid/code-organization#%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6%E7%AD%96%E7%95%A5)

### 1\. Git工作流程[](https://shopify.baoea.com/liquid/code-organization#1-git%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%A8%8B)

```
# 分支命名规范
feature/product-recommendations    # 新功能
bugfix/cart-total-calculation     # 错误修复
hotfix/critical-checkout-issue    # 紧急修复
release/v1.2.0                   # 发布版本
 
# 提交信息规范
feat: 添加产品推荐功能
fix: 修复购物车总价计算错误
docs: 更新README文档
style: 调整按钮样式
refactor: 重构产品卡片组件
test: 添加购物车功能测试
```

### 2\. 版本发布流程[](https://shopify.baoea.com/liquid/code-organization#2-%E7%89%88%E6%9C%AC%E5%8F%91%E5%B8%83%E6%B5%81%E7%A8%8B)

```
// package.json
{
  "name": "custom-shopify-theme",
  "version": "1.2.0",
  "scripts": {
    "dev": "shopify theme dev",
    "build": "node scripts/build.js",
    "deploy:staging": "node scripts/deploy.js --env=staging",
    "deploy:production": "node scripts/deploy.js --env=production",
    "test": "jest",
    "lint": "eslint assets/js/**/*.js"
  }
}
```

通过遵循这些代码组织和结构最佳实践，您可以创建易于维护、扩展和协作的 Shopify 主题项目！

## 下一步学习[](https://shopify.baoea.com/liquid/code-organization#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

掌握代码组织后，建议继续学习：

1.  [安全最佳实践](https://shopify.baoea.com/liquid/security) - 主题安全规范
2.  [实际应用示例](https://shopify.baoea.com/liquid/examples) - 实战案例分析
