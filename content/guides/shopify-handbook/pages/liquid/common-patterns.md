---
source_url: "https://shopify.baoea.com/liquid/common-patterns"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:37"
fetch_method: "http"
content_hash: "7e73ea98b1aceeae429b235e68acb917488b25f059ea649ce93ac80459d48281"
discovered_via: ["sitemap", "internal_link"]
---
## 常见模式和解决方案

本指南汇总了 Shopify 主题开发中的常见设计模式、最佳实践和问题解决方案，帮助您更高效地开发主题。

## 数据处理模式[](https://shopify.baoea.com/liquid/common-patterns#%E6%95%B0%E6%8D%AE%E5%A4%84%E7%90%86%E6%A8%A1%E5%BC%8F)

### 1\. 条件渲染模式[](https://shopify.baoea.com/liquid/common-patterns#1-%E6%9D%A1%E4%BB%B6%E6%B8%B2%E6%9F%93%E6%A8%A1%E5%BC%8F)

```
<!-- 多条件判断模式 -->
{%- liquid
  assign show_content = false
 
  if section.settings.enable_section
    if product.available or settings.show_sold_out_products
      if product.tags contains 'featured' or section.settings.show_all
        assign show_content = true
      endif
    endif
  endif
-%}
 
{% if show_content %}
  <!-- 渲染内容 -->
{% endif %}
 
<!-- 默认值处理模式 -->
{%- liquid
  assign heading = section.settings.heading
  if heading == blank
    assign heading = product.title
  endif
 
  assign button_text = section.settings.button_text | default: 'Learn More'
  assign image_size = section.settings.image_size | default: '400x400'
  assign show_price = section.settings.show_price | default: true
-%}
 
<!-- 复杂条件简化 -->
{%- liquid
  case product.type
    when 'clothing'
      assign size_guide_url = 'size guide url1'
    when 'shoes'
      assign size_guide_url = 'size guide url2'
    else
      assign size_guide_url = 'size guide url3'
  endcase
-%}
```

### 2\. 循环处理模式[](https://shopify.baoea.com/liquid/common-patterns#2-%E5%BE%AA%E7%8E%AF%E5%A4%84%E7%90%86%E6%A8%A1%E5%BC%8F)

```
<!-- 分组循环模式 -->
{%- assign products_by_type = collections.all.products | group_by: 'type' -%}
 
{% for group in products_by_type %}
  <div class="product-type-group">
    <h3>{{ group.name }}</h3>
    <div class="products-grid">
      {% for product in group.items limit: 4 %}
        {% render 'product-card', product: product %}
      {% endfor %}
    </div>
  </div>
{% endfor %}
 
<!-- 分页循环模式 -->
{%- assign items_per_row = 3 -%}
{%- assign total_items = collection.products.size -%}
 
{% for product in collection.products %}
  {% assign row_index = forloop.index0 | divided_by: items_per_row %}
  {% assign col_index = forloop.index0 | modulo: items_per_row %}
 
  {% if col_index == 0 %}
    <div class="products-row">
  {% endif %}
 
  {% render 'product-card', product: product %}
 
  {% if col_index == items_per_row | minus: 1 or forloop.last %}
    </div>
  {% endif %}
{% endfor %}
 
<!-- 过滤循环模式 -->
{%- assign featured_products = collection.products | where: 'tags', 'featured' -%}
{%- assign available_products = featured_products | where: 'available', true -%}
 
{% for product in available_products limit: 8 %}
  {% render 'product-card', product: product %}
{% endfor %}
```

### 3\. 数据转换模式[](https://shopify.baoea.com/liquid/common-patterns#3-%E6%95%B0%E6%8D%AE%E8%BD%AC%E6%8D%A2%E6%A8%A1%E5%BC%8F)

```
<!-- 数据格式化模式 -->
{%- liquid
  assign price_cents = product.price
  assign price_yuan = price_cents | divided_by: 100.0
  assign formatted_price = price_yuan | money_without_currency | append: ' 元'
 
  assign publish_date = article.created_at | date: '%Y-%m-%d'
  assign reading_time = article.content | strip_html | split: ' ' | size | divided_by: 200
  if reading_time < 1
    assign reading_time = 1
  endif
-%}
 
<!-- 多语言处理模式 -->
{%- liquid
  assign current_locale = request.locale.iso_code
 
  case current_locale
    when 'zh-CN'
      assign currency_symbol = '¥'
      assign date_format = '%Y年%m月%d日'
    when 'en'
      assign currency_symbol = '$'
      assign date_format = '%B %d, %Y'
    else
      assign currency_symbol = shop.currency
      assign date_format = '%Y-%m-%d'
  endcase
-%}
 
<!-- JSON数据处理模式 -->
{%- capture product_json -%}
{
  "id": {{ product.id }},
  "title": {{ product.title | json }},
  "price": {{ product.price }},
  "available": {{ product.available }},
  "variants": [
    {%- for variant in product.variants -%}
    {
      "id": {{ variant.id }},
      "title": {{ variant.title | json }},
      "price": {{ variant.price }},
      "available": {{ variant.available }}
    }{% unless forloop.last %},{% endunless %}
    {%- endfor -%}
  ]
}
{%- endcapture -%}
 
<script id="product-data" type="application/json">
  {{ product_json }}
</script>
```

## UI组件模式[](https://shopify.baoea.com/liquid/common-patterns#ui%E7%BB%84%E4%BB%B6%E6%A8%A1%E5%BC%8F)

### 1\. 可配置组件模式[](https://shopify.baoea.com/liquid/common-patterns#1-%E5%8F%AF%E9%85%8D%E7%BD%AE%E7%BB%84%E4%BB%B6%E6%A8%A1%E5%BC%8F)

```
<!-- snippets/configurable-button.liquid -->
{% comment %}
可配置按钮组件
 
参数:
- text: 按钮文本 (必需)
- url: 链接地址 (可选)
- style: 按钮样式 ('primary', 'secondary', 'outline')
- size: 按钮大小 ('small', 'medium', 'large')
- icon: 图标名称 (可选)
- attributes: 额外HTML属性 (可选)
{% endcomment %}
 
{%- liquid
  assign button_text = text
  assign button_url = url | default: '#'
  assign button_style = style | default: 'primary'
  assign button_size = size | default: 'medium'
  assign button_icon = icon
  assign button_attributes = attributes
 
  assign button_class = 'btn btn--' | append: button_style | append: ' btn--' | append: button_size
 
  if button_icon
    assign button_class = button_class | append: ' btn--with-icon'
  endif
-%}
 
{% if button_url == '#' %}
  <button class="{{ button_class }}" {{ button_attributes }}>
    {% if button_icon %}
      {% render 'icon', name: button_icon %}
    {% endif %}
    {{ button_text }}
  </button>
{% else %}
  <a href="{{ button_url }}" class="{{ button_class }}" {{ button_attributes }}>
    {% if button_icon %}
      {% render 'icon', name: button_icon %}
    {% endif %}
    {{ button_text }}
  </a>
{% endif %}
 
<!-- 使用示例 -->
{% render 'configurable-button',
  text: '立即购买',
  url: product.url,
  style: 'primary',
  size: 'large',
  icon: 'cart',
  attributes: 'data-product-id="' | append: product.id | append: '"'
%}
```

### 2\. 响应式组件模式[](https://shopify.baoea.com/liquid/common-patterns#2-%E5%93%8D%E5%BA%94%E5%BC%8F%E7%BB%84%E4%BB%B6%E6%A8%A1%E5%BC%8F)

```
<!-- snippets/responsive-grid.liquid -->
{%- liquid
  assign grid_items = items
  assign mobile_columns = mobile_cols | default: 1
  assign tablet_columns = tablet_cols | default: 2
  assign desktop_columns = desktop_cols | default: 3
  assign gap = gap | default: '1rem'
 
  assign grid_id = 'grid-' | append: section.id
-%}
 
<div class="responsive-grid" id="{{ grid_id }}">
  {% for item in grid_items %}
    <div class="grid-item">
      {{ item }}
    </div>
  {% endfor %}
</div>
 
<style>
#{{ grid_id }} {
  display: grid;
  gap: {{ gap }};
  grid-template-columns: repeat({{ mobile_columns }}, 1fr);
}
 
@media (min-width: 768px) {
  #{{ grid_id }} {
    grid-template-columns: repeat({{ tablet_columns }}, 1fr);
  }
}
 
@media (min-width: 1024px) {
  #{{ grid_id }} {
    grid-template-columns: repeat({{ desktop_columns }}, 1fr);
  }
}
</style>
```

### 3\. 状态管理模式[](https://shopify.baoea.com/liquid/common-patterns#3-%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86%E6%A8%A1%E5%BC%8F)

```
// assets/js/state-manager.js
class StateManager {
  constructor() {
    this.state = new Proxy({}, {
      set: (target, key, value) => {
        const oldValue = target[key];
        target[key] = value;
        this.notifySubscribers(key, value, oldValue);
        return true;
      }
    });
 
    this.subscribers = new Map();
  }
 
  // 订阅状态变化
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);
 
    // 返回取消订阅函数
    return () => {
      this.subscribers.get(key)?.delete(callback);
    };
  }
 
  // 设置状态
  setState(key, value) {
    this.state[key] = value;
  }
 
  // 获取状态
  getState(key) {
    return this.state[key];
  }
 
  // 通知订阅者
  notifySubscribers(key, newValue, oldValue) {
    const callbacks = this.subscribers.get(key);
    if (callbacks) {
      callbacks.forEach(callback => {
        callback(newValue, oldValue, key);
      });
    }
  }
}
 
// 全局状态管理器
window.stateManager = new StateManager();
 
// 使用示例
class CartComponent {
  constructor() {
    this.init();
  }
 
  init() {
    // 订阅购物车状态变化
    window.stateManager.subscribe('cart', (cart, oldCart) => {
      this.updateCartUI(cart);
    });
 
    // 订阅用户状态变化
    window.stateManager.subscribe('user', (user) => {
      this.updateUserUI(user);
    });
  }
 
  updateCartUI(cart) {
    // 更新购物车UI
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = cart.item_count;
    });
  }
 
  updateUserUI(user) {
    // 更新用户UI
    const userElements = document.querySelectorAll('[data-user-name]');
    userElements.forEach(el => {
      el.textContent = user ? user.name : '游客';
    });
  }
}
```

## 性能优化模式[](https://shopify.baoea.com/liquid/common-patterns#%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%A8%A1%E5%BC%8F)

### 1\. 懒加载模式[](https://shopify.baoea.com/liquid/common-patterns#1-%E6%87%92%E5%8A%A0%E8%BD%BD%E6%A8%A1%E5%BC%8F)

```
<!-- 图片懒加载 -->
<img class="lazy-image"
     data-src="{{ image | image_url: width: 800, height: 600 }}"
     data-srcset="{{ image | image_url: width: 400, height: 300 }} 400w,
                  {{ image | image_url: width: 800, height: 600 }} 800w,
                  {{ image | image_url: width: 1200, height: 900 }} 1200w"
     data-sizes="(max-width: 768px) 100vw, 50vw"
     alt="{{ image.alt | escape }}"
     loading="lazy">
 
<script>
// 图片懒加载实现
class LazyImageLoader {
  constructor() {
    this.images = document.querySelectorAll('.lazy-image');
    this.imageObserver = null;
    this.init();
  }
 
  init() {
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            this.imageObserver.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '50px 0px'
      });
 
      this.images.forEach(img => this.imageObserver.observe(img));
    } else {
      // 降级处理
      this.images.forEach(img => this.loadImage(img));
    }
  }
 
  loadImage(img) {
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
    }
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
    if (img.dataset.sizes) {
      img.sizes = img.dataset.sizes;
    }
 
    img.classList.add('loaded');
  }
}
 
new LazyImageLoader();
</script>
```

### 2\. 缓存模式[](https://shopify.baoea.com/liquid/common-patterns#2-%E7%BC%93%E5%AD%98%E6%A8%A1%E5%BC%8F)

```
// 简单缓存实现
class SimpleCache {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) { // 5分钟TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }
 
  set(key, value) {
    // 如果缓存已满，删除最老的条目
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
 
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
 
  get(key) {
    const item = this.cache.get(key);
 
    if (!item) {
      return null;
    }
 
    // 检查是否过期
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
 
    return item.value;
  }
 
  has(key) {
    return this.get(key) !== null;
  }
 
  clear() {
    this.cache.clear();
  }
}
 
// API缓存示例
class CachedAPI {
  constructor() {
    this.cache = new SimpleCache();
  }
 
  async fetchProduct(productId) {
    const cacheKey = `product-${productId}`;
 
    // 检查缓存
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
 
    // 从API获取
    try {
      const response = await fetch(`/products/${productId}.js`);
      const product = await response.json();
 
      // 存入缓存
      this.cache.set(cacheKey, product);
 
      return product;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return null;
    }
  }
}
```

### 3\. 防抖和节流模式[](https://shopify.baoea.com/liquid/common-patterns#3-%E9%98%B2%E6%8A%96%E5%92%8C%E8%8A%82%E6%B5%81%E6%A8%A1%E5%BC%8F)

```
// 防抖函数
function debounce(func, wait, immediate = false) {
  let timeout;
 
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
 
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
 
    if (callNow) func.apply(this, args);
  };
}
 
// 节流函数
function throttle(func, limit) {
  let inThrottle;
 
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
 
// 使用示例
class SearchComponent {
  constructor() {
    this.searchInput = document.querySelector('[data-search-input]');
    this.init();
  }
 
  init() {
    // 防抖搜索
    const debouncedSearch = debounce(this.performSearch.bind(this), 300);
    this.searchInput.addEventListener('input', debouncedSearch);
 
    // 节流滚动
    const throttledScroll = throttle(this.handleScroll.bind(this), 100);
    window.addEventListener('scroll', throttledScroll);
  }
 
  performSearch(event) {
    const query = event.target.value;
    console.log('Searching for:', query);
  }
 
  handleScroll() {
    console.log('Scroll position:', window.scrollY);
  }
}
```

## 错误处理模式[](https://shopify.baoea.com/liquid/common-patterns#%E9%94%99%E8%AF%AF%E5%A4%84%E7%90%86%E6%A8%A1%E5%BC%8F)

### 1\. 优雅降级模式[](https://shopify.baoea.com/liquid/common-patterns#1-%E4%BC%98%E9%9B%85%E9%99%8D%E7%BA%A7%E6%A8%A1%E5%BC%8F)

```
<!-- 图片降级处理 -->
{% if product.featured_image %}
  <picture>
    <source srcset="{{ product.featured_image | image_url: width: 800, height: 600, format: 'webp' }}" type="image/webp">
    <source srcset="{{ product.featured_image | image_url: width: 800, height: 600, format: 'jpg' }}" type="image/jpeg">
    <img src="{{ product.featured_image | image_url: width: 400, height: 300 }}"
         alt="{{ product.featured_image.alt | default: product.title | escape }}"
         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
  </picture>
  <div class="image-placeholder" style="display: none;">
    <span>图片暂时无法显示</span>
  </div>
{% else %}
  <div class="image-placeholder">
    <span>暂无图片</span>
  </div>
{% endif %}
 
<!-- 内容降级处理 -->
{% if section.settings.video_url %}
  <video controls>
    <source src="{{ section.settings.video_url }}" type="video/mp4">
    <p>您的浏览器不支持视频播放，请<a href="{{ section.settings.video_url }}">点击这里下载</a>。</p>
  </video>
{% elsif section.settings.image %}
  <img src="{{ section.settings.image | image_url: width: 800, height: 600 }}"
       alt="{{ section.settings.image.alt | escape }}">
{% else %}
  <div class="content-placeholder">
    <p>{{ section.settings.fallback_text | default: '内容加载中...' }}</p>
  </div>
{% endif %}
```

### 2\. 错误边界模式[](https://shopify.baoea.com/liquid/common-patterns#2-%E9%94%99%E8%AF%AF%E8%BE%B9%E7%95%8C%E6%A8%A1%E5%BC%8F)

```
class ErrorBoundary {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      fallbackMessage: '出现了一些问题，请刷新页面重试',
      showError: false,
      onError: null,
      ...options
    };
 
    this.init();
  }
 
  init() {
    this.originalContent = this.element.innerHTML;
    this.wrapContent();
  }
 
  wrapContent() {
    try {
      // 执行可能出错的操作
      this.executeRiskyOperation();
    } catch (error) {
      this.handleError(error);
    }
  }
 
  executeRiskyOperation() {
    // 这里放置可能出错的代码
    // 例如：复杂的DOM操作、第三方API调用等
  }
 
  handleError(error) {
    console.error('Component error:', error);
 
    // 显示错误信息
    this.showErrorUI(error);
 
    // 调用错误回调
    if (this.options.onError) {
      this.options.onError(error);
    }
 
    // 上报错误
    this.reportError(error);
  }
 
  showErrorUI(error) {
    const errorHTML = `
      <div class="error-boundary">
        <h3>⚠️ ${this.options.fallbackMessage}</h3>
        ${this.options.showError ? `<details><summary>错误详情</summary><pre>${error.stack}</pre></details>` : ''}
        <button onclick="location.reload()">刷新页面</button>
      </div>
    `;
 
    this.element.innerHTML = errorHTML;
  }
 
  reportError(error) {
    // 发送错误报告到服务器
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        url: window.location.href,
        timestamp: new Date().toISOString()
      })
    }).catch(() => {
      // 忽略报告错误
    });
  }
 
  retry() {
    this.element.innerHTML = this.originalContent;
    this.executeRiskyOperation();
  }
}
 
// 使用示例
document.querySelectorAll('[data-error-boundary]').forEach(element => {
  new ErrorBoundary(element, {
    showError: true,
    onError: (error) => {
      console.log('Error caught by boundary:', error);
    }
  });
});
```

## 可访问性模式[](https://shopify.baoea.com/liquid/common-patterns#%E5%8F%AF%E8%AE%BF%E9%97%AE%E6%80%A7%E6%A8%A1%E5%BC%8F)

### 1\. 键盘导航模式[](https://shopify.baoea.com/liquid/common-patterns#1-%E9%94%AE%E7%9B%98%E5%AF%BC%E8%88%AA%E6%A8%A1%E5%BC%8F)

```
class KeyboardNavigator {
  constructor(container) {
    this.container = container;
    this.items = container.querySelectorAll('[data-nav-item]');
    this.currentIndex = 0;
 
    this.init();
  }
 
  init() {
    this.bindEvents();
    this.updateFocus();
  }
 
  bindEvents() {
    this.container.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          this.moveNext();
          break;
 
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          this.movePrevious();
          break;
 
        case 'Home':
          e.preventDefault();
          this.moveToFirst();
          break;
 
        case 'End':
          e.preventDefault();
          this.moveToLast();
          break;
 
        case 'Enter':
        case ' ':
          e.preventDefault();
          this.activateItem();
          break;
      }
    });
  }
 
  moveNext() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.updateFocus();
  }
 
  movePrevious() {
    this.currentIndex = this.currentIndex === 0 ? this.items.length - 1 : this.currentIndex - 1;
    this.updateFocus();
  }
 
  moveToFirst() {
    this.currentIndex = 0;
    this.updateFocus();
  }
 
  moveToLast() {
    this.currentIndex = this.items.length - 1;
    this.updateFocus();
  }
 
  updateFocus() {
    this.items.forEach((item, index) => {
      const isCurrent = index === this.currentIndex;
      item.setAttribute('tabindex', isCurrent ? '0' : '-1');
 
      if (isCurrent) {
        item.focus();
        item.classList.add('keyboard-focused');
      } else {
        item.classList.remove('keyboard-focused');
      }
    });
  }
 
  activateItem() {
    const currentItem = this.items[this.currentIndex];
    currentItem.click();
  }
}
```

### 2\. 屏幕阅读器友好模式[](https://shopify.baoea.com/liquid/common-patterns#2-%E5%B1%8F%E5%B9%95%E9%98%85%E8%AF%BB%E5%99%A8%E5%8F%8B%E5%A5%BD%E6%A8%A1%E5%BC%8F)

```
<!-- ARIA标签和语义化结构 -->
<nav aria-label="主导航" role="navigation">
  <ul class="main-menu">
    {% for link in linklists.main-menu.links %}
      <li class="menu-item">
        <a href="{{ link.url }}"
           {% if link.url == request.path %}aria-current="page"{% endif %}
           {% if link.links != blank %}aria-expanded="false" aria-haspopup="true"{% endif %}>
          {{ link.title }}
        </a>
 
        {% if link.links != blank %}
          <ul class="submenu" aria-label="{{ link.title }} 子菜单">
            {% for childlink in link.links %}
              <li>
                <a href="{{ childlink.url }}">{{ childlink.title }}</a>
              </li>
            {% endfor %}
          </ul>
        {% endif %}
      </li>
    {% endfor %}
  </ul>
</nav>
 
<!-- 实时更新区域 -->
<div aria-live="polite" aria-atomic="true" class="sr-only" id="status-message">
  <!-- 状态消息会在这里动态更新 -->
</div>
 
<!-- 商品卡片可访问性 -->
<article class="product-card"
         role="article"
         aria-labelledby="product-title-{{ product.id }}"
         aria-describedby="product-description-{{ product.id }}">
 
  <h3 id="product-title-{{ product.id }}" class="product-title">
    {{ product.title }}
  </h3>
 
  <div class="product-image">
    <img src="{{ product.featured_image | image_url: width: 300, height: 300 }}"
         alt="{{ product.featured_image.alt | default: product.title | escape }}"
         role="img">
  </div>
 
  <p id="product-description-{{ product.id }}" class="product-description">
    {{ product.description | strip_html | truncate: 100 }}
  </p>
 
  <div class="product-price" aria-label="价格">
    <span class="visually-hidden">价格：</span>
    {{ product.price | money }}
  </div>
 
  <button class="add-to-cart-btn"
          aria-label="将 {{ product.title }} 添加到购物车"
          data-product-id="{{ product.id }}">
    添加到购物车
  </button>
</article>
```

通过掌握这些常见模式和解决方案，您可以更高效地开发出高质量的 Shopify 主题！

## 下一步学习[](https://shopify.baoea.com/liquid/common-patterns#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

掌握常见模式后，建议继续学习：

1.  [定制化开发案例](https://shopify.baoea.com/liquid/customization-examples) - 高级定制技巧
2.  [开发工具推荐](https://shopify.baoea.com/liquid/tools) - 提升开发效率的工具
