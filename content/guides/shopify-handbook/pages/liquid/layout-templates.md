---
source_url: "https://shopify.baoea.com/liquid/layout-templates"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:52"
fetch_method: "http"
content_hash: "991ce62a0fdf4d8e88470694bb90a02444edcfced8c16f9c1b0d7ca129dab069"
discovered_via: ["sitemap", "internal_link"]
---
## 布局模板开发

布局模板是 Shopify 主题的骨架，定义了网站的整体结构和共享元素。本指南将详细介绍如何开发高效、灵活的布局模板。

## 布局模板基础[](https://shopify.baoea.com/liquid/layout-templates#%E5%B8%83%E5%B1%80%E6%A8%A1%E6%9D%BF%E5%9F%BA%E7%A1%80)

### 1\. theme.liquid - 主布局文件[](https://shopify.baoea.com/liquid/layout-templates#1-themeliquid---%E4%B8%BB%E5%B8%83%E5%B1%80%E6%96%87%E4%BB%B6)

```
<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="{{ settings.color_accent }}">
  
  <link rel="canonical" href="{{ canonical_url }}">
  
  {%- if settings.favicon != blank -%}
    <link rel="icon" type="image/png" href="{{ settings.favicon | image_url: width: 32, height: 32 }}">
  {%- endif -%}
  
  {%- capture seo_title -%}
    {%- if request.page_type == 'search' and search.terms != blank -%}
      {{ 'general.search.heading' | t: count: search.results_count }}: {{ 'general.search.results_with_count' | t: terms: search.terms, count: search.results_count }}
    {%- else -%}
      {{ page_title }}
    {%- endif -%}
    {%- if current_tags %} &ndash; {{ 'general.meta.tags' | t: tags: current_tags | join: ', ' }}{% endif -%}
    {%- if current_page != 1 %} &ndash; {{ 'general.meta.page' | t: page: current_page }}{% endif -%}
    {%- assign title_separator = ' | ' -%}
    {%- unless page_title contains shop.name -%}
      {{ title_separator }}{{ shop.name }}
    {%- endunless -%}
  {%- endcapture -%}
  
  <title>{{ seo_title | strip }}</title>
  
  {%- if page_description -%}
    <meta name="description" content="{{ page_description | escape }}">
  {%- endif -%}
  
  {% render 'meta-tags' %}
  
  <script>
    document.documentElement.className = document.documentElement.className.replace('no-js', 'js');
    
    window.theme = {
      settings: {
        cartType: {{ settings.cart_type | json }},
        moneyFormat: {{ shop.money_format | json }},
        moneyWithCurrencyFormat: {{ shop.money_with_currency_format | json }}
      },
      strings: {
        addToCart: {{ 'products.product.add_to_cart' | t | json }},
        soldOut: {{ 'products.product.sold_out' | t | json }},
        unavailable: {{ 'products.product.unavailable' | t | json }}
      },
      routes: {
        cart: '{{ routes.cart_url }}',
        cartAdd: '{{ routes.cart_add_url }}',
        cartChange: '{{ routes.cart_change_url }}'
      }
    };
  </script>
  
  {% render 'css-variables' %}
  
  <link rel="stylesheet" href="{{ 'theme.css' | asset_url }}">
  
  {%- unless settings.type_header_font.system? -%}
    <link rel="preconnect" href="https://fonts.shopifycdn.com" crossorigin>
  {%- endunless -%}
  
  <script>window.performance && window.performance.mark && window.performance.mark('shopify.content_for_header.start');</script>
  {{ content_for_header }}
  <script>window.performance && window.performance.mark && window.performance.mark('shopify.content_for_header.end');</script>
  
  {% render 'microdata-schema' %}
</head>
 
<body class="gradient{% if customer %} customer-logged-in{% endif %} template-{{ request.page_type | handle }}">
  <a class="skip-to-content-link button visually-hidden" href="#MainContent">
    {{ 'accessibility.skip_to_text' | t }}
  </a>
  
  {% section 'announcement-bar' %}
  {% section 'header' %}
  
  <main id="MainContent" class="content-for-layout focus-none" role="main" tabindex="-1">
    {{ content_for_layout }}
  </main>
  
  {% section 'footer' %}
  
  <ul hidden>
    <li id="a11y-refresh-page-message">{{ 'accessibility.refresh_page' | t }}</li>
    <li id="a11y-new-window-message">{{ 'accessibility.link_messages.new_window' | t }}</li>
  </ul>
  
  <script>
    window.shopUrl = {{ request.origin | json }};
    window.routes = {
      cart_add_url: {{ routes.cart_add_url | json }},
      cart_change_url: {{ routes.cart_change_url | json }},
      cart_update_url: {{ routes.cart_update_url | json }},
      cart_url: {{ routes.cart_url | json }},
      predictive_search_url: {{ routes.predictive_search_url | json }}
    };
  </script>
  
  {% if settings.predictive_search_enabled %}
    <script src="{{ 'predictive-search.js' | asset_url }}" defer="defer"></script>
  {% endif %}
  
  <script src="{{ 'theme.js' | asset_url }}" defer="defer"></script>
  
  {% render 'cart-drawer' %}
  
  {% if template contains 'product' %}
    <script src="{{ 'product-form.js' | asset_url }}" defer="defer"></script>
  {% endif %}
</body>
</html>
```

### 2\. 密码保护页面布局[](https://shopify.baoea.com/liquid/layout-templates#2-%E5%AF%86%E7%A0%81%E4%BF%9D%E6%8A%A4%E9%A1%B5%E9%9D%A2%E5%B8%83%E5%B1%80)

```
<!-- layout/password.liquid -->
<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  
  <title>{{ shop.name }}</title>
  
  {% if page_description %}
    <meta name="description" content="{{ page_description | escape }}">
  {% endif %}
  
  {% render 'meta-tags' %}
  
  <link rel="stylesheet" href="{{ 'password.css' | asset_url }}">
  
  {{ content_for_header }}
</head>
 
<body class="password-page">
  <div class="password-container">
    <header class="password-header">
      {% if shop.logo %}
        <img src="{{ shop.logo | image_url: width: 200 }}" alt="{{ shop.name }}" class="password-logo">
      {% else %}
        <h1 class="password-shop-name">{{ shop.name }}</h1>
      {% endif %}
    </header>
    
    <main class="password-content">
      {{ content_for_layout }}
    </main>
    
    <footer class="password-footer">
      <p>&copy; {{ 'now' | date: '%Y' }} {{ shop.name }}</p>
    </footer>
  </div>
  
  <script src="{{ 'password.js' | asset_url }}" defer></script>
</body>
</html>
```

## 布局组件化[](https://shopify.baoea.com/liquid/layout-templates#%E5%B8%83%E5%B1%80%E7%BB%84%E4%BB%B6%E5%8C%96)

### 1\. 头部组件片段[](https://shopify.baoea.com/liquid/layout-templates#1-%E5%A4%B4%E9%83%A8%E7%BB%84%E4%BB%B6%E7%89%87%E6%AE%B5)

```
<!-- snippets/layout-head.liquid -->
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width,initial-scale=1">
 
<!-- SEO 元标签 -->
{% render 'seo-meta-tags' %}
 
<!-- 性能优化 -->
<link rel="dns-prefetch" href="https://cdn.shopify.com">
<link rel="dns-prefetch" href="https://monorail-edge.shopifysvc.com">
 
<!-- 字体预加载 -->
{% unless settings.type_header_font.system? %}
  <link rel="preconnect" href="https://fonts.shopifycdn.com" crossorigin>
{% endunless %}
 
<!-- 关键 CSS 内联 -->
{% render 'critical-css' %}
 
<!-- 非关键 CSS 异步加载 -->
<link rel="preload" href="{{ 'theme.css' | asset_url }}" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="{{ 'theme.css' | asset_url }}"></noscript>
 
<!-- 主题配置 -->
<script>
  window.theme = {
    settings: {{ settings | json }},
    strings: {
      addToCart: {{ 'products.product.add_to_cart' | t | json }},
      soldOut: {{ 'products.product.sold_out' | t | json }},
      unavailable: {{ 'products.product.unavailable' | t | json }}
    },
    routes: {
      cart: {{ routes.cart_url | json }},
      cartAdd: {{ routes.cart_add_url | json }},
      cartChange: {{ routes.cart_change_url | json }}
    }
  };
</script>
```

### 2\. 页脚脚本组件[](https://shopify.baoea.com/liquid/layout-templates#2-%E9%A1%B5%E8%84%9A%E8%84%9A%E6%9C%AC%E7%BB%84%E4%BB%B6)

```
<!-- snippets/layout-scripts.liquid -->
<!-- 核心功能脚本 -->
<script src="{{ 'theme.js' | asset_url }}" defer></script>
 
<!-- 条件加载脚本 -->
{% if settings.cart_type == 'drawer' %}
  <script src="{{ 'cart-drawer.js' | asset_url }}" defer></script>
{% endif %}
 
{% if template contains 'product' %}
  <script src="{{ 'product-form.js' | asset_url }}" defer></script>
  <script src="{{ 'product-gallery.js' | asset_url }}" defer></script>
{% endif %}
 
{% if template contains 'collection' %}
  <script src="{{ 'collection-filters.js' | asset_url }}" defer></script>
{% endif %}
 
{% if settings.predictive_search_enabled %}
  <script src="{{ 'predictive-search.js' | asset_url }}" defer></script>
{% endif %}
 
<!-- 第三方脚本 -->
{% render 'analytics-scripts' %}
```

## 条件布局系统[](https://shopify.baoea.com/liquid/layout-templates#%E6%9D%A1%E4%BB%B6%E5%B8%83%E5%B1%80%E7%B3%BB%E7%BB%9F)

### 1\. 多布局支持[](https://shopify.baoea.com/liquid/layout-templates#1-%E5%A4%9A%E5%B8%83%E5%B1%80%E6%94%AF%E6%8C%81)

```
<!-- layout/theme.liquid -->
{%- liquid
  assign layout_class = 'layout-default'
  
  case template.name
    when 'product'
      assign layout_class = 'layout-product'
    when 'collection'
      assign layout_class = 'layout-collection'
    when 'page'
      if page.handle contains 'landing'
        assign layout_class = 'layout-landing'
      endif
    when 'blog'
      assign layout_class = 'layout-blog'
  endcase
  
  if customer
    assign layout_class = layout_class | append: ' customer-logged-in'
  endif
-%}
 
<body class="{{ layout_class }} template-{{ template.name | handle }}">
  <!-- 根据不同布局加载不同的头部 -->
  {% case layout_class %}
    {% when 'layout-landing' %}
      {% section 'header-landing' %}
    {% when 'layout-product' %}
      {% section 'header-product' %}
    {% else %}
      {% section 'header' %}
  {% endcase %}
  
  <main id="MainContent" class="content-for-layout">
    {{ content_for_layout }}
  </main>
  
  <!-- 根据不同布局加载不同的页脚 -->
  {% unless layout_class contains 'layout-landing' %}
    {% section 'footer' %}
  {% endunless %}
</body>
```

### 2\. 响应式布局容器[](https://shopify.baoea.com/liquid/layout-templates#2-%E5%93%8D%E5%BA%94%E5%BC%8F%E5%B8%83%E5%B1%80%E5%AE%B9%E5%99%A8)

```
<!-- snippets/responsive-container.liquid -->
{%- liquid
  assign container_class = 'container'
  assign max_width = section.settings.container_width | default: 'default'
  
  case max_width
    when 'narrow'
      assign container_class = container_class | append: ' container--narrow'
    when 'wide'
      assign container_class = container_class | append: ' container--wide'
    when 'full'
      assign container_class = container_class | append: ' container--full'
  endcase
  
  if section.settings.container_padding
    assign container_class = container_class | append: ' container--padded'
  endif
-%}
 
<div class="{{ container_class }}">
  <div class="container__inner">
    {{ content }}
  </div>
</div>
 
<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }
  
  .container--narrow {
    max-width: 800px;
  }
  
  .container--wide {
    max-width: 1400px;
  }
  
  .container--full {
    max-width: none;
    padding: 0;
  }
  
  .container--padded {
    padding: 30px 15px;
  }
  
  @media (min-width: 768px) {
    .container {
      padding: 0 30px;
    }
    
    .container--padded {
      padding: 60px 30px;
    }
  }
</style>
```

## 性能优化布局[](https://shopify.baoea.com/liquid/layout-templates#%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E5%B8%83%E5%B1%80)

### 1\. 关键路径优化[](https://shopify.baoea.com/liquid/layout-templates#1-%E5%85%B3%E9%94%AE%E8%B7%AF%E5%BE%84%E4%BC%98%E5%8C%96)

```
<!-- snippets/critical-css.liquid -->
<style>
  /* 关键 CSS - 首屏内容样式 */
  .header {
    background: white;
    padding: 1rem 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .main-content {
    min-height: 50vh;
    padding: 2rem 0;
  }
  
  /* 加载动画 */
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: opacity 0.3s;
  }
  
  .loading-overlay.hidden {
    opacity: 0;
    pointer-events: none;
  }
  
  @media (min-width: 768px) {
    .container {
      padding: 0 2rem;
    }
  }
</style>
```

### 2\. 异步组件加载[](https://shopify.baoea.com/liquid/layout-templates#2-%E5%BC%82%E6%AD%A5%E7%BB%84%E4%BB%B6%E5%8A%A0%E8%BD%BD)

```
<!-- snippets/async-components.liquid -->
<script>
  // 异步组件加载器
  class AsyncComponentLoader {
    constructor() {
      this.components = new Map();
      this.observer = new IntersectionObserver(this.handleIntersection.bind(this));
      this.init();
    }
    
    init() {
      // 注册延迟加载的组件
      document.querySelectorAll('[data-async-component]').forEach(el => {
        this.observer.observe(el);
      });
    }
    
    handleIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadComponent(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }
    
    async loadComponent(element) {
      const componentName = element.dataset.asyncComponent;
      const componentData = element.dataset.componentData;
      
      try {
        // 显示加载状态
        element.innerHTML = '<div class="component-loading">加载中...</div>';
        
        // 异步获取组件内容
        const response = await fetch(`/apps/components/${componentName}?data=${componentData}`);
        const html = await response.text();
        
        // 渲染组件
        element.innerHTML = html;
        
        // 初始化组件脚本
        this.initializeComponentScripts(element);
        
      } catch (error) {
        console.error(`Failed to load component ${componentName}:`, error);
        element.innerHTML = '<div class="component-error">加载失败</div>';
      }
    }
    
    initializeComponentScripts(element) {
      const scripts = element.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        document.head.appendChild(newScript);
      });
    }
  }
  
  // 初始化异步组件加载器
  document.addEventListener('DOMContentLoaded', () => {
    new AsyncComponentLoader();
  });
</script>
```

## 移动端优化布局[](https://shopify.baoea.com/liquid/layout-templates#%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%BC%98%E5%8C%96%E5%B8%83%E5%B1%80)

### 1\. 移动端专用布局[](https://shopify.baoea.com/liquid/layout-templates#1-%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%B8%93%E7%94%A8%E5%B8%83%E5%B1%80)

```
<!-- layout/theme.mobile.liquid -->
<!doctype html>
<html class="no-js mobile-layout" lang="{{ request.locale.iso_code }}">
<head>
  {% render 'layout-head' %}
  
  <!-- 移动端特定样式 -->
  <link rel="stylesheet" href="{{ 'mobile.css' | asset_url }}">
  
  <!-- PWA 配置 -->
  <link rel="manifest" href="{{ 'manifest.json' | asset_url }}">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
</head>
 
<body class="mobile-optimized">
  <!-- 移动端导航 -->
  {% section 'mobile-header' %}
  
  <!-- 主内容 -->
  <main id="MainContent" class="mobile-content">
    {{ content_for_layout }}
  </main>
  
  <!-- 移动端页脚 -->
  {% section 'mobile-footer' %}
  
  <!-- 移动端专用脚本 -->
  <script src="{{ 'mobile.js' | asset_url }}" defer></script>
  
  <!-- PWA 注册 -->
  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  </script>
</body>
</html>
```

### 2\. 自适应布局切换[](https://shopify.baoea.com/liquid/layout-templates#2-%E8%87%AA%E9%80%82%E5%BA%94%E5%B8%83%E5%B1%80%E5%88%87%E6%8D%A2)

```
<!-- snippets/adaptive-layout.liquid -->
<script>
  class AdaptiveLayout {
    constructor() {
      this.breakpoint = 768;
      this.isMobile = window.innerWidth < this.breakpoint;
      this.init();
    }
    
    init() {
      this.setupLayout();
      window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    setupLayout() {
      if (this.isMobile) {
        this.enableMobileLayout();
      } else {
        this.enableDesktopLayout();
      }
    }
    
    enableMobileLayout() {
      document.body.classList.add('mobile-layout');
      document.body.classList.remove('desktop-layout');
      
      // 加载移动端特定组件
      this.loadMobileComponents();
    }
    
    enableDesktopLayout() {
      document.body.classList.add('desktop-layout');
      document.body.classList.remove('mobile-layout');
      
      // 加载桌面端特定组件
      this.loadDesktopComponents();
    }
    
    handleResize() {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth < this.breakpoint;
      
      if (wasMobile !== this.isMobile) {
        this.setupLayout();
      }
    }
    
    loadMobileComponents() {
      // 异步加载移动端组件
      import('./mobile-components.js').then(module => {
        module.init();
      });
    }
    
    loadDesktopComponents() {
      // 异步加载桌面端组件
      import('./desktop-components.js').then(module => {
        module.init();
      });
    }
  }
  
  // 初始化自适应布局
  new AdaptiveLayout();
</script>
```

## 布局调试工具[](https://shopify.baoea.com/liquid/layout-templates#%E5%B8%83%E5%B1%80%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7)

### 1\. 开发模式布局调试[](https://shopify.baoea.com/liquid/layout-templates#1-%E5%BC%80%E5%8F%91%E6%A8%A1%E5%BC%8F%E5%B8%83%E5%B1%80%E8%B0%83%E8%AF%95)

```
<!-- snippets/layout-debugger.liquid -->
{% if settings.debug_mode %}
  <div class="layout-debugger" style="position: fixed; top: 10px; right: 10px; z-index: 10000; background: black; color: white; padding: 10px; font-size: 12px;">
    <div>模板: {{ template.name }}</div>
    <div>页面类型: {{ request.page_type }}</div>
    <div>设备: <span id="device-type"></span></div>
    <div>断点: <span id="current-breakpoint"></span></div>
    <div>性能: <span id="load-time"></span>ms</div>
  </div>
  
  <script>
    // 布局调试器
    class LayoutDebugger {
      constructor() {
        this.init();
      }
      
      init() {
        this.updateDeviceInfo();
        this.measurePerformance();
        window.addEventListener('resize', () => this.updateDeviceInfo());
      }
      
      updateDeviceInfo() {
        const width = window.innerWidth;
        let deviceType = 'Desktop';
        let breakpoint = 'xl';
        
        if (width < 576) {
          deviceType = 'Mobile';
          breakpoint = 'xs';
        } else if (width < 768) {
          deviceType = 'Mobile Large';
          breakpoint = 'sm';
        } else if (width < 992) {
          deviceType = 'Tablet';
          breakpoint = 'md';
        } else if (width < 1200) {
          deviceType = 'Desktop';
          breakpoint = 'lg';
        }
        
        document.getElementById('device-type').textContent = deviceType;
        document.getElementById('current-breakpoint').textContent = breakpoint;
      }
      
      measurePerformance() {
        window.addEventListener('load', () => {
          const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
          document.getElementById('load-time').textContent = loadTime;
        });
      }
    }
    
    new LayoutDebugger();
  </script>
{% endif %}
```

通过这些布局模板开发技术，您可以创建高效、灵活且用户友好的 Shopify 主题布局！

## 下一步学习[](https://shopify.baoea.com/liquid/layout-templates#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

完成布局模板开发后，建议继续学习：

1.  [代码组织和结构](https://shopify.baoea.com/liquid/code-organization) - 项目架构最佳实践
2.  [最佳实践](https://shopify.baoea.com/liquid/best-practices) - 开发规范和约定
