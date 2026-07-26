---
source_url: "https://shopify.baoea.com/liquid/global-objects"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:52"
fetch_method: "http"
content_hash: "b418e33793fa6d6ba6dcbd7b1bb205d4fa6e9680d856eb2cb29e111a48cc58ba"
discovered_via: ["sitemap", "internal_link"]
---
## 全局对象详解

全局对象是在所有 Liquid 模板中都可以访问的对象，它们提供了关于商店、请求、页面等重要信息。理解这些全局对象对于构建动态和响应式的 Shopify 主题至关重要。

## 核心全局对象[](https://shopify.baoea.com/liquid/global-objects#%E6%A0%B8%E5%BF%83%E5%85%A8%E5%B1%80%E5%AF%B9%E8%B1%A1)

### shop 对象[](https://shopify.baoea.com/liquid/global-objects#shop-%E5%AF%B9%E8%B1%A1)

`shop` 对象包含商店的基本信息和设置。

#### 基本属性[](https://shopify.baoea.com/liquid/global-objects#%E5%9F%BA%E6%9C%AC%E5%B1%9E%E6%80%A7)

```
<!-- 商店基本信息 -->
<h1>{{ shop.name }}</h1>
<p>{{ shop.description }}</p>
 
<!-- 商店URL和域名 -->
<a href="{{ shop.url }}">{{ shop.domain }}</a>
<link rel="canonical" href="{{ shop.secure_url }}{{ request.path }}" />
 
<!-- 商店ID和句柄 -->
<div data-shop-id="{{ shop.id }}" data-shop-handle="{{ shop.handle }}">
  <!-- 内容 -->
</div>
```

#### 联系信息[](https://shopify.baoea.com/liquid/global-objects#%E8%81%94%E7%B3%BB%E4%BF%A1%E6%81%AF)

```
<!-- 商店联系方式 -->
<div class="contact-info">
  {% if shop.email %}
    <p>邮箱: <a href="mailto:{{ shop.email }}">{{ shop.email }}</a></p>
  {% endif %}
  
  {% if shop.phone %}
    <p>电话: <a href="tel:{{ shop.phone }}">{{ shop.phone }}</a></p>
  {% endif %}
  
  {% if shop.address %}
    <address>
      {{ shop.address.company }}<br>
      {{ shop.address.address1 }}<br>
      {% if shop.address.address2 %}{{ shop.address.address2 }}<br>{% endif %}
      {{ shop.address.city }}, {{ shop.address.province }} {{ shop.address.zip }}<br>
      {{ shop.address.country }}
    </address>
  {% endif %}
</div>
```

#### 货币和税务设置[](https://shopify.baoea.com/liquid/global-objects#%E8%B4%A7%E5%B8%81%E5%92%8C%E7%A8%8E%E5%8A%A1%E8%AE%BE%E7%BD%AE)

```
<!-- 货币信息 -->
<div class="currency-info" data-currency="{{ shop.currency }}">
  <span class="currency-symbol">{{ shop.money_format }}</span>
  <span class="currency-code">{{ shop.currency }}</span>
</div>
 
<!-- 多货币支持 -->
{% if shop.enabled_currencies.size > 1 %}
  <select name="currency" class="currency-selector">
    {% for currency in shop.enabled_currencies %}
      <option value="{{ currency.iso_code }}" 
              {% if currency.iso_code == shop.currency %}selected{% endif %}>
        {{ currency.name }} ({{ currency.symbol }})
      </option>
    {% endfor %}
  </select>
{% endif %}
 
<!-- 税务设置 -->
{% if shop.taxes_included %}
  <p class="tax-notice">价格含税</p>
{% else %}
  <p class="tax-notice">价格不含税</p>
{% endif %}
```

#### 政策页面[](https://shopify.baoea.com/liquid/global-objects#%E6%94%BF%E7%AD%96%E9%A1%B5%E9%9D%A2)

```
<!-- 商店政策链接 -->
<div class="policy-links">
  {% if shop.privacy_policy %}
    <a href="{{ shop.privacy_policy.url }}">{{ shop.privacy_policy.title }}</a>
  {% endif %}
  
  {% if shop.terms_of_service %}
    <a href="{{ shop.terms_of_service.url }}">{{ shop.terms_of_service.title }}</a>
  {% endif %}
  
  {% if shop.refund_policy %}
    <a href="{{ shop.refund_policy.url }}">{{ shop.refund_policy.title }}</a>
  {% endif %}
  
  {% if shop.shipping_policy %}
    <a href="{{ shop.shipping_policy.url }}">{{ shop.shipping_policy.title }}</a>
  {% endif %}
</div>
```

### request 对象[](https://shopify.baoea.com/liquid/global-objects#request-%E5%AF%B9%E8%B1%A1)

`request` 对象包含当前 HTTP 请求的信息。

#### URL 和路径信息[](https://shopify.baoea.com/liquid/global-objects#url-%E5%92%8C%E8%B7%AF%E5%BE%84%E4%BF%A1%E6%81%AF)

```
<!-- 当前页面信息 -->
<div class="page-info">
  <p>当前路径: {{ request.path }}</p>
  <p>完整URL: {{ request.origin }}{{ request.path }}</p>
  <p>页面类型: {{ request.page_type }}</p>
</div>
 
<!-- 构建动态URL -->
{% assign current_url = request.origin | append: request.path %}
{% if request.query %}
  {% assign current_url = current_url | append: '?' | append: request.query %}
{% endif %}
 
<link rel="canonical" href="{{ current_url }}" />
```

#### 设备和用户代理信息[](https://shopify.baoea.com/liquid/global-objects#%E8%AE%BE%E5%A4%87%E5%92%8C%E7%94%A8%E6%88%B7%E4%BB%A3%E7%90%86%E4%BF%A1%E6%81%AF)

```
<!-- 设备检测 -->
{% if request.design_mode %}
  <div class="admin-notice">当前为主题编辑模式</div>
{% endif %}
 
<!-- 用户代理信息 -->
<div class="user-agent" data-user-agent="{{ request.user_agent }}">
  {% comment %} 可用于JavaScript中的设备检测 {% endcomment %}
</div>
 
<!-- 主机信息 -->
<div class="host-info" data-host="{{ request.host }}">
  {% if request.host contains 'myshopify.com' %}
    <div class="dev-notice">开发环境</div>
  {% endif %}
</div>
```

#### 查询参数处理[](https://shopify.baoea.com/liquid/global-objects#%E6%9F%A5%E8%AF%A2%E5%8F%82%E6%95%B0%E5%A4%84%E7%90%86)

```
<!-- 处理查询参数 -->
{% assign sort_by = request.query.sort_by | default: 'best-selling' %}
{% assign view = request.query.view | default: 'grid' %}
{% assign filter_color = request.query.filter.p.product_type %}
 
<div class="filters" data-sort="{{ sort_by }}" data-view="{{ view }}">
  <!-- 排序选项 -->
  <select name="sort_by">
    <option value="best-selling" {% if sort_by == 'best-selling' %}selected{% endif %}>
      最畅销
    </option>
    <option value="price-ascending" {% if sort_by == 'price-ascending' %}selected{% endif %}>
      价格由低到高
    </option>
    <option value="price-descending" {% if sort_by == 'price-descending' %}selected{% endif %}>
      价格由高到低
    </option>
  </select>
</div>
```

### page\_title 对象[](https://shopify.baoea.com/liquid/global-objects#page_title-%E5%AF%B9%E8%B1%A1)

动态页面标题，根据当前页面类型自动生成。

```
<!-- 基本页面标题 -->
<title>{{ page_title }}{% unless page_title contains shop.name %} - {{ shop.name }}{% endunless %}</title>
 
<!-- 自定义页面标题逻辑 -->
{% capture custom_title %}
  {% case request.page_type %}
    {% when 'index' %}
      {{ shop.name }} - {{ shop.description | truncate: 100 }}
    {% when 'product' %}
      {{ product.title }} - {{ product.vendor }} | {{ shop.name }}
    {% when 'collection' %}
      {{ collection.title }} 系列 | {{ shop.name }}
    {% when 'blog' %}
      {{ blog.title }} 博客 | {{ shop.name }}
    {% when 'article' %}
      {{ article.title }} - {{ blog.title }} | {{ shop.name }}
    {% when 'page' %}
      {{ page.title }} | {{ shop.name }}
    {% when 'search' %}
      {% if search.performed %}
        "{{ search.terms }}" 搜索结果 | {{ shop.name }}
      {% else %}
        搜索 | {{ shop.name }}
      {% endif %}
    {% when '404' %}
      页面未找到 | {{ shop.name }}
    {% else %}
      {{ page_title }} | {{ shop.name }}
  {% endcase %}
{% endcapture %}
 
<title>{{ custom_title | strip }}</title>
```

### canonical\_url 对象[](https://shopify.baoea.com/liquid/global-objects#canonical_url-%E5%AF%B9%E8%B1%A1)

规范URL，用于SEO优化。

```
<!-- 基本规范URL -->
<link rel="canonical" href="{{ canonical_url }}" />
 
<!-- 处理分页的规范URL -->
{% if paginate.current_page > 1 %}
  <link rel="canonical" href="{{ canonical_url | append: '?page=' | append: paginate.current_page }}" />
  <link rel="prev" href="{% if paginate.previous %}{{ canonical_url }}{% if paginate.previous.url != canonical_url %}{{ paginate.previous.url }}{% endif %}{% endif %}" />
  <link rel="next" href="{% if paginate.next %}{{ canonical_url }}{{ paginate.next.url }}{% endif %}" />
{% else %}
  <link rel="canonical" href="{{ canonical_url }}" />
  {% if paginate.next %}
    <link rel="next" href="{{ canonical_url }}{{ paginate.next.url }}" />
  {% endif %}
{% endif %}
```

## 主题相关全局对象[](https://shopify.baoea.com/liquid/global-objects#%E4%B8%BB%E9%A2%98%E7%9B%B8%E5%85%B3%E5%85%A8%E5%B1%80%E5%AF%B9%E8%B1%A1)

### settings 对象[](https://shopify.baoea.com/liquid/global-objects#settings-%E5%AF%B9%E8%B1%A1)

访问主题设置中定义的配置。

```
<!-- 主题颜色设置 -->
<style>
  :root {
    --primary-color: {{ settings.primary_color | default: '#000000' }};
    --secondary-color: {{ settings.secondary_color | default: '#ffffff' }};
    --accent-color: {{ settings.accent_color | default: '#007bff' }};
    --text-color: {{ settings.text_color | default: '#333333' }};
    --background-color: {{ settings.background_color | default: '#ffffff' }};
  }
</style>
 
<!-- 主题布局设置 -->
<div class="container" style="max-width: {{ settings.container_width | default: 1200 }}px;">
  <!-- 内容 -->
</div>
 
<!-- 功能开关 -->
{% if settings.enable_newsletter %}
  <div class="newsletter-signup">
    <!-- 邮件订阅表单 -->
  </div>
{% endif %}
 
{% if settings.enable_cart_drawer %}
  <div class="cart-drawer">
    <!-- 购物车抽屉 -->
  </div>
{% endif %}
```

### theme 对象[](https://shopify.baoea.com/liquid/global-objects#theme-%E5%AF%B9%E8%B1%A1)

获取当前主题信息。

```
<!-- 主题信息 -->
<div class="theme-info" 
     data-theme-id="{{ theme.id }}" 
     data-theme-name="{{ theme.name }}"
     data-theme-role="{{ theme.role }}">
  {% if theme.role == 'development' %}
    <div class="dev-theme-notice">开发主题</div>
  {% endif %}
</div>
 
<!-- 主题版本控制 -->
{% comment %}
主题: {{ theme.name }}
ID: {{ theme.id }}
角色: {{ theme.role }}
{% endcomment %}
```

## 高级全局对象使用[](https://shopify.baoea.com/liquid/global-objects#%E9%AB%98%E7%BA%A7%E5%85%A8%E5%B1%80%E5%AF%B9%E8%B1%A1%E4%BD%BF%E7%94%A8)

### 组合使用示例[](https://shopify.baoea.com/liquid/global-objects#%E7%BB%84%E5%90%88%E4%BD%BF%E7%94%A8%E7%A4%BA%E4%BE%8B)

```
<!-- 智能导航系统 -->
<nav class="main-navigation" 
     data-page-type="{{ request.page_type }}"
     data-current-url="{{ request.path }}">
  
  {% for link in linklists.main-menu.links %}
    {% assign is_current = false %}
    {% assign is_parent = false %}
    
    {% comment %} 检查当前页面匹配 {% endcomment %}
    {% if link.url == request.path %}
      {% assign is_current = true %}
    {% endif %}
    
    {% comment %} 检查子页面匹配 {% endcomment %}
    {% for child_link in link.links %}
      {% if child_link.url == request.path %}
        {% assign is_parent = true %}
        {% break %}
      {% endif %}
    {% endfor %}
    
    <a href="{{ link.url }}" 
       class="nav-link {% if is_current %}current{% endif %} {% if is_parent %}parent-current{% endif %}"
       {% if is_current %}aria-current="page"{% endif %}>
      {{ link.title }}
    </a>
  {% endfor %}
</nav>
```

### 动态内容生成[](https://shopify.baoea.com/liquid/global-objects#%E5%8A%A8%E6%80%81%E5%86%85%E5%AE%B9%E7%94%9F%E6%88%90)

```
<!-- 基于页面类型的动态内容 -->
<div class="page-header" data-page-type="{{ request.page_type }}">
  {% case request.page_type %}
    {% when 'index' %}
      <h1>欢迎来到 {{ shop.name }}</h1>
      <p>{{ shop.description }}</p>
      
    {% when 'collection' %}
      <h1>{{ collection.title }}</h1>
      {% if collection.description != blank %}
        <p>{{ collection.description }}</p>
      {% endif %}
      <p>共 {{ collection.products_count }} 件商品</p>
      
    {% when 'product' %}
      <nav aria-label="面包屑">
        <a href="{{ routes.root_url }}">首页</a>
        {% if collection %}
          <a href="{{ collection.url }}">{{ collection.title }}</a>
        {% endif %}
        <span>{{ product.title }}</span>
      </nav>
      
    {% when 'blog' %}
      <h1>{{ blog.title }}</h1>
      {% if blog.summary != blank %}
        <p>{{ blog.summary }}</p>
      {% endif %}
      
    {% when 'search' %}
      {% if search.performed %}
        <h1>"{{ search.terms }}" 的搜索结果</h1>
        <p>找到 {{ search.results_count }} 个结果</p>
      {% else %}
        <h1>搜索商品</h1>
        <p>在 {{ shop.name }} 中搜索您需要的商品</p>
      {% endif %}
  {% endcase %}
</div>
```

## 性能优化技巧[](https://shopify.baoea.com/liquid/global-objects#%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%8A%80%E5%B7%A7)

### 缓存全局数据[](https://shopify.baoea.com/liquid/global-objects#%E7%BC%93%E5%AD%98%E5%85%A8%E5%B1%80%E6%95%B0%E6%8D%AE)

```
<!-- 缓存重要的全局数据 -->
{% liquid
  assign shop_data = shop | json
  assign request_data = request | json
%}
 
<script>
  window.shopData = {{ shop_data }};
  window.requestData = {{ request_data }};
  window.themeSettings = {
    primaryColor: '{{ settings.primary_color }}',
    enableCartDrawer: {{ settings.enable_cart_drawer | json }},
    currencyFormat: '{{ shop.money_format }}'
  };
</script>
```

### 条件加载[](https://shopify.baoea.com/liquid/global-objects#%E6%9D%A1%E4%BB%B6%E5%8A%A0%E8%BD%BD)

```
<!-- 仅在需要时加载重型组件 -->
{% unless request.design_mode %}
  {% if settings.enable_analytics %}
    <!-- 分析代码 -->
  {% endif %}
  
  {% if settings.enable_chat_widget %}
    <!-- 聊天组件 -->
  {% endif %}
{% endunless %}
 
<!-- 开发模式专用功能 -->
{% if request.design_mode %}
  <div class="admin-tools">
    <p>主题: {{ theme.name }} ({{ theme.role }})</p>
    <p>页面类型: {{ request.page_type }}</p>
    <p>当前路径: {{ request.path }}</p>
  </div>
{% endif %}
```

## 调试技巧[](https://shopify.baoea.com/liquid/global-objects#%E8%B0%83%E8%AF%95%E6%8A%80%E5%B7%A7)

### 全局对象调试[](https://shopify.baoea.com/liquid/global-objects#%E5%85%A8%E5%B1%80%E5%AF%B9%E8%B1%A1%E8%B0%83%E8%AF%95)

```
<!-- 开发环境下的调试信息 -->
{% if request.host contains 'myshopify.com' %}
  <div class="debug-panel" style="position: fixed; bottom: 0; right: 0; background: #333; color: #fff; padding: 10px; font-size: 12px; z-index: 9999;">
    <h4>调试信息</h4>
    <p><strong>页面类型:</strong> {{ request.page_type }}</p>
    <p><strong>当前路径:</strong> {{ request.path }}</p>
    <p><strong>主题:</strong> {{ theme.name }} ({{ theme.role }})</p>
    <p><strong>用户代理:</strong> {{ request.user_agent | truncate: 50 }}</p>
    <p><strong>设计模式:</strong> {{ request.design_mode }}</p>
    
    {% if request.query %}
      <p><strong>查询参数:</strong></p>
      <ul>
        {% for param in request.query %}
          <li>{{ param[0] }}: {{ param[1] }}</li>
        {% endfor %}
      </ul>
    {% endif %}
  </div>
{% endif %}
```

## 安全最佳实践[](https://shopify.baoea.com/liquid/global-objects#%E5%AE%89%E5%85%A8%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5)

### 输出转义[](https://shopify.baoea.com/liquid/global-objects#%E8%BE%93%E5%87%BA%E8%BD%AC%E4%B9%89)

```
<!-- 安全输出用户提供的内容 -->
<h1>{{ page_title | escape }}</h1>
<meta name="description" content="{{ page_description | escape | truncate: 160 }}">
 
<!-- 安全处理URL参数 -->
{% assign search_term = request.query.q | escape %}
<input type="search" name="q" value="{{ search_term }}" placeholder="搜索...">
```

### 数据验证[](https://shopify.baoea.com/liquid/global-objects#%E6%95%B0%E6%8D%AE%E9%AA%8C%E8%AF%81)

```
<!-- 验证和清理数据 -->
{% assign valid_currencies = 'USD,EUR,GBP,CAD,AUD,JPY,CNY' | split: ',' %}
{% assign current_currency = request.query.currency | upcase %}
 
{% if valid_currencies contains current_currency %}
  {% comment %} 处理有效的货币代码 {% endcomment %}
  <span class="currency">{{ current_currency }}</span>
{% else %}
  {% comment %} 使用默认货币 {% endcomment %}
  <span class="currency">{{ shop.currency }}</span>
{% endif %}
```

## 下一步学习[](https://shopify.baoea.com/liquid/global-objects#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

现在您已经掌握了全局对象的使用，建议继续学习：

*   [产品对象详解](https://shopify.baoea.com/liquid/product-objects) - 深入了解产品相关对象
*   [客户对象详解](https://shopify.baoea.com/liquid/customer-objects) - 学习客户账户和认证
*   [购物车对象详解](https://shopify.baoea.com/liquid/cart-objects) - 掌握购物车功能实现
*   [高级 Liquid 技巧](https://shopify.baoea.com/liquid/advanced-liquid) - 学习更高级的模板技巧
