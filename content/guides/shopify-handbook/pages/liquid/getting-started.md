---
source_url: "https://shopify.baoea.com/liquid/getting-started"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:52"
fetch_method: "http"
content_hash: "9f7c0dc1c51a1f6ab76401046e241dddbebfa4bcb9cf1a997ddf2079fdd3a7d0"
discovered_via: ["sitemap", "internal_link"]
---
## Liquid 快速入门

欢迎来到 Liquid 主题开发。本篇用最少概念跑通 **输出 → 逻辑 → 加工**，并给出可直接放进分区/片段的示例。更完整的导航与约定见 [Liquid 开发指南](https://shopify.baoea.com/liquid)。

## 阅读前必读[](https://shopify.baoea.com/liquid/getting-started#%E9%98%85%E8%AF%BB%E5%89%8D%E5%BF%85%E8%AF%BB)

| 项 | 说明 |
| --- | --- |
| 运行上下文 | product 只在产品模板等上下文存在；在首页分区里通常用 section.settings 或 collections |
| 图片 | 新主题请使用 image_url，勿复制旧主题里的 img_url |
| 下一步 | 语法细节见 语法基础，过滤器大全见 过滤器 |

## Liquid 是什么？[](https://shopify.baoea.com/liquid/getting-started#liquid-%E6%98%AF%E4%BB%80%E4%B9%88)

Liquid 是由 Shopify 开发的开源模板语言，用于加载动态内容。它结合了三个主要组件：

1.  **对象 (Objects)** - 告诉 Liquid 在哪里显示内容
2.  **标签 (Tags)** - 创建模板的逻辑和控制流
3.  **过滤器 (Filters)** - 修改 Liquid 对象的输出

## 基本语法[](https://shopify.baoea.com/liquid/getting-started#%E5%9F%BA%E6%9C%AC%E8%AF%AD%E6%B3%95)

### 1\. 对象输出语法[](https://shopify.baoea.com/liquid/getting-started#1-%E5%AF%B9%E8%B1%A1%E8%BE%93%E5%87%BA%E8%AF%AD%E6%B3%95)

使用双大括号 `{{ }}` 来输出对象内容：

```
{{ page.title }}
{{ product.price }}
{{ customer.first_name }}
```

**实际示例:**

```
<!-- 在产品页面显示产品标题 -->
<h1>{{ product.title }}</h1>
 
<!-- 显示当前页面标题 -->
<title>{{ page_title }} - {{ shop.name }}</title>
 
<!-- 显示客户姓名 -->
<p>欢迎回来，{{ customer.first_name }}！</p>
```

### 2\. 标签语法[](https://shopify.baoea.com/liquid/getting-started#2-%E6%A0%87%E7%AD%BE%E8%AF%AD%E6%B3%95)

使用大括号和百分号 `{% %}` 来创建逻辑：

```
{% if condition %}
  <!-- 内容 -->
{% endif %}
 
{% for item in collection %}
  <!-- 循环内容 -->
{% endfor %}
```

**实际示例:**

```
<!-- 条件显示内容 -->
{% if product.available %}
  <button type="submit">加入购物车</button>
{% else %}
  <button disabled>缺货</button>
{% endif %}
 
<!-- 循环显示产品 -->
{% for product in collections.featured.products %}
  <div class="product-card">
    <h3>{{ product.title }}</h3>
    <p>{{ product.price | money }}</p>
  </div>
{% endfor %}
```

### 3\. 过滤器语法[](https://shopify.baoea.com/liquid/getting-started#3-%E8%BF%87%E6%BB%A4%E5%99%A8%E8%AF%AD%E6%B3%95)

使用管道符 `|` 来应用过滤器：

```
{{ product.title | upcase }}
{{ product.price | money }}
{{ article.published_at | date: "%B %d, %Y" }}
```

**实际示例:**

```
<!-- 格式化价格 -->
<span class="price">{{ product.price | money }}</span>
 
<!-- 日期格式化 -->
<time>{{ article.published_at | date: "%Y年%m月%d日" }}</time>
 
<!-- 文本转换 -->
<h2>{{ section.settings.heading | upcase }}</h2>
 
<!-- 图片处理 -->
<img src="{{ product.featured_image | image_url: width: 300, height: 300 }}" 
     alt="{{ product.featured_image.alt }}">
```

## 第一个 Liquid 模板[](https://shopify.baoea.com/liquid/getting-started#%E7%AC%AC%E4%B8%80%E4%B8%AA-liquid-%E6%A8%A1%E6%9D%BF)

让我们创建一个简单的产品卡片组件：

```
<!-- snippets/product-card.liquid -->
<div class="product-card" data-product-id="{{ product.id }}">
  <!-- 产品图片 -->
  {% if product.featured_image %}
    <div class="product-image">
      <img src="{{ product.featured_image | image_url: width: 300, height: 300 }}" 
           alt="{{ product.featured_image.alt | escape }}">
    </div>
  {% endif %}
 
  <!-- 产品信息 -->
  <div class="product-info">
    <!-- 产品标题 -->
    <h3 class="product-title">
      <a href="{{ product.url }}">{{ product.title }}</a>
    </h3>
 
    <!-- 产品价格 -->
    <div class="product-price">
      {% if product.compare_at_price > product.price %}
        <span class="price-compare">{{ product.compare_at_price | money }}</span>
        <span class="price-sale">{{ product.price | money }}</span>
      {% else %}
        <span class="price">{{ product.price | money }}</span>
      {% endif %}
    </div>
 
    <!-- 库存状态 -->
    {% if product.available %}
      <div class="stock-status in-stock">有库存</div>
    {% else %}
      <div class="stock-status out-of-stock">缺货</div>
    {% endif %}
 
    <!-- 添加到购物车按钮 -->
    {% if product.available %}
      <form action="/cart/add" method="post" enctype="multipart/form-data">
        <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
        <button type="submit" class="btn btn-primary">
          加入购物车
        </button>
      </form>
    {% endif %}
  </div>
</div>
```

## 常用对象和属性[](https://shopify.baoea.com/liquid/getting-started#%E5%B8%B8%E7%94%A8%E5%AF%B9%E8%B1%A1%E5%92%8C%E5%B1%9E%E6%80%A7)

根据 [Shopify Liquid 文档](https://shopify.dev/docs/api/liquid)  的参考，以下是一些常用的对象：

### 全局对象[](https://shopify.baoea.com/liquid/getting-started#%E5%85%A8%E5%B1%80%E5%AF%B9%E8%B1%A1)

```
<!-- 商店信息 -->
{{ shop.name }}              <!-- 商店名称 -->
{{ shop.email }}             <!-- 商店邮箱 -->
{{ shop.currency }}          <!-- 商店货币 -->
 
<!-- 页面信息 -->
{{ page_title }}             <!-- 页面标题 -->
{{ canonical_url }}          <!-- 标准URL -->
{{ request.page_type }}      <!-- 页面类型 -->
```

### 产品对象[](https://shopify.baoea.com/liquid/getting-started#%E4%BA%A7%E5%93%81%E5%AF%B9%E8%B1%A1)

```
{{ product.title }}          <!-- 产品标题 -->
{{ product.description }}    <!-- 产品描述 -->
{{ product.price }}          <!-- 产品价格 -->
{{ product.vendor }}         <!-- 供应商 -->
{{ product.type }}           <!-- 产品类型 -->
{{ product.tags }}           <!-- 产品标签 -->
{{ product.available }}      <!-- 是否有库存 -->
{{ product.url }}            <!-- 产品URL -->
```

### 客户对象[](https://shopify.baoea.com/liquid/getting-started#%E5%AE%A2%E6%88%B7%E5%AF%B9%E8%B1%A1)

```
{{ customer.first_name }}   <!-- 客户名字 -->
{{ customer.last_name }}    <!-- 客户姓氏 -->
{{ customer.email }}        <!-- 客户邮箱 -->
{{ customer.phone }}        <!-- 客户电话 -->
{{ customer.accepts_marketing }} <!-- 是否接受营销 -->
```

### 购物车对象[](https://shopify.baoea.com/liquid/getting-started#%E8%B4%AD%E7%89%A9%E8%BD%A6%E5%AF%B9%E8%B1%A1)

```
{{ cart.item_count }}       <!-- 购物车商品数量 -->
{{ cart.total_price }}      <!-- 购物车总价 -->
{{ cart.items }}            <!-- 购物车商品列表 -->
{{ cart.total_weight }}     <!-- 购物车总重量 -->
```

## 常用过滤器[](https://shopify.baoea.com/liquid/getting-started#%E5%B8%B8%E7%94%A8%E8%BF%87%E6%BB%A4%E5%99%A8)

### 字符串过滤器[](https://shopify.baoea.com/liquid/getting-started#%E5%AD%97%E7%AC%A6%E4%B8%B2%E8%BF%87%E6%BB%A4%E5%99%A8)

```
{{ "hello world" | upcase }}           <!-- HELLO WORLD -->
{{ "HELLO WORLD" | downcase }}         <!-- hello world -->
{{ "hello world" | capitalize }}       <!-- Hello world -->
{{ product.title | truncate: 50 }}     <!-- 截断到50字符 -->
{{ product.description | strip_html }} <!-- 移除HTML标签 -->
```

### 数字过滤器[](https://shopify.baoea.com/liquid/getting-started#%E6%95%B0%E5%AD%97%E8%BF%87%E6%BB%A4%E5%99%A8)

```
{{ product.price | money }}                    <!-- ¥99.00 -->
{{ product.price | money_without_currency }}   <!-- 99.00 -->
{{ 1234.56 | round: 1 }}                      <!-- 1234.6 -->
{{ cart.item_count | plus: 1 }}               <!-- 购物车数量+1 -->
```

### 日期过滤器[](https://shopify.baoea.com/liquid/getting-started#%E6%97%A5%E6%9C%9F%E8%BF%87%E6%BB%A4%E5%99%A8)

```
{{ article.published_at | date: "%Y-%m-%d" }}     <!-- 2023-12-01 -->
{{ article.published_at | date: "%B %d, %Y" }}    <!-- December 01, 2023 -->
{{ "now" | date: "%Y年%m月%d日" }}                  <!-- 2023年12月01日 -->
```

### 数组过滤器[](https://shopify.baoea.com/liquid/getting-started#%E6%95%B0%E7%BB%84%E8%BF%87%E6%BB%A4%E5%99%A8)

```
{{ collection.products | size }}               <!-- 集合中产品数量 -->
{{ collection.products | first }}              <!-- 第一个产品 -->
{{ collection.products | last }}               <!-- 最后一个产品 -->
{{ product.tags | join: ", " }}                <!-- 用逗号连接标签 -->
{{ product.tags | sort }}                      <!-- 排序标签 -->
```

## 实际应用案例[](https://shopify.baoea.com/liquid/getting-started#%E5%AE%9E%E9%99%85%E5%BA%94%E7%94%A8%E6%A1%88%E4%BE%8B)

### 案例1：产品列表页面[](https://shopify.baoea.com/liquid/getting-started#%E6%A1%88%E4%BE%8B1%E4%BA%A7%E5%93%81%E5%88%97%E8%A1%A8%E9%A1%B5%E9%9D%A2)

```
<!-- templates/collection.liquid -->
<div class="collection-page">
  <!-- 集合标题和描述 -->
  <header class="collection-header">
    <h1>{{ collection.title }}</h1>
    {% if collection.description != blank %}
      <p>{{ collection.description }}</p>
    {% endif %}
  </header>
 
  <!-- 产品网格 -->
  <div class="products-grid">
    {% for product in collection.products %}
      {% render 'product-card', product: product %}
    {% else %}
      <p>这个集合暂时没有产品。</p>
    {% endfor %}
  </div>
 
  <!-- 分页 -->
  {% if paginate.pages > 1 %}
    {% render 'pagination', paginate: paginate %}
  {% endif %}
</div>
```

### 案例2：购物车抽屉[](https://shopify.baoea.com/liquid/getting-started#%E6%A1%88%E4%BE%8B2%E8%B4%AD%E7%89%A9%E8%BD%A6%E6%8A%BD%E5%B1%89)

```
<!-- snippets/cart-drawer.liquid -->
<div class="cart-drawer" id="cart-drawer">
  <div class="cart-header">
    <h2>购物车 ({{ cart.item_count }})</h2>
    <button class="cart-close" onclick="closeCartDrawer()">×</button>
  </div>
 
  <div class="cart-items">
    {% for item in cart.items %}
      <div class="cart-item" data-key="{{ item.key }}">
        <!-- 商品图片 -->
        <div class="item-image">
          <img src="{{ item.image | image_url: width: 80, height: 80 }}" 
               alt="{{ item.title | escape }}">
        </div>
 
        <!-- 商品信息 -->
        <div class="item-details">
          <h4>{{ item.product.title }}</h4>
          {% unless item.variant.title contains 'Default' %}
            <p class="variant">{{ item.variant.title }}</p>
          {% endunless %}
          
          <!-- 数量和价格 -->
          <div class="item-quantity">
            <input type="number" 
                   value="{{ item.quantity }}" 
                   min="0"
                   data-key="{{ item.key }}"
                   onchange="updateCartItem(this)">
            <span class="item-price">{{ item.final_line_price | money }}</span>
          </div>
        </div>
      </div>
    {% else %}
      <p class="empty-cart">您的购物车是空的</p>
    {% endfor %}
  </div>
 
  {% if cart.item_count > 0 %}
    <div class="cart-footer">
      <div class="cart-total">
        <strong>总计: {{ cart.total_price | money }}</strong>
      </div>
      <a href="/checkout" class="checkout-btn">去结账</a>
    </div>
  {% endif %}
</div>
```

### 案例3：博客文章列表[](https://shopify.baoea.com/liquid/getting-started#%E6%A1%88%E4%BE%8B3%E5%8D%9A%E5%AE%A2%E6%96%87%E7%AB%A0%E5%88%97%E8%A1%A8)

```
<!-- templates/blog.liquid -->
<div class="blog-page">
  <header class="blog-header">
    <h1>{{ blog.title }}</h1>
    {% if blog.description != blank %}
      <p>{{ blog.description }}</p>
    {% endif %}
  </header>
 
  <div class="articles-grid">
    {% for article in blog.articles %}
      <article class="article-card">
        <!-- 文章特色图片 -->
        {% if article.image %}
          <div class="article-image">
            <a href="{{ article.url }}">
              <img src="{{ article.image | image_url: width: 400, height: 250 }}" 
                   alt="{{ article.image.alt | escape }}">
            </a>
          </div>
        {% endif %}
 
        <!-- 文章内容 -->
        <div class="article-content">
          <h2><a href="{{ article.url }}">{{ article.title }}</a></h2>
          
          <!-- 文章元信息 -->
          <div class="article-meta">
            <time>{{ article.published_at | date: "%Y年%m月%d日" }}</time>
            {% if article.author != blank %}
              <span class="author">作者: {{ article.author }}</span>
            {% endif %}
            {% if article.tags.size > 0 %}
              <div class="tags">
                {% for tag in article.tags %}
                  <span class="tag">{{ tag }}</span>
                {% endfor %}
              </div>
            {% endif %}
          </div>
 
          <!-- 文章摘要 -->
          <div class="article-excerpt">
            {{ article.excerpt | default: article.content | strip_html | truncate: 150 }}
          </div>
 
          <a href="{{ article.url }}" class="read-more">阅读更多</a>
        </div>
      </article>
    {% endfor %}
  </div>
</div>
```

## 调试技巧[](https://shopify.baoea.com/liquid/getting-started#%E8%B0%83%E8%AF%95%E6%8A%80%E5%B7%A7)

### 输出变量内容[](https://shopify.baoea.com/liquid/getting-started#%E8%BE%93%E5%87%BA%E5%8F%98%E9%87%8F%E5%86%85%E5%AE%B9)

```
<!-- 查看对象的所有属性 -->
<pre>{{ product | json }}</pre>
 
<!-- 检查变量类型 -->
{{ product.title | debug }}
 
<!-- 显示变量是否存在 -->
{% if product.description %}
  <p>产品有描述</p>
{% else %}
  <p>产品没有描述</p>
{% endif %}
```

### 使用注释[](https://shopify.baoea.com/liquid/getting-started#%E4%BD%BF%E7%94%A8%E6%B3%A8%E9%87%8A)

```
{% comment %}
  这是 Liquid 注释
  不会在前端显示
{% endcomment %}
 
{% # 这是单行注释 %}
```

## 下一步学习[](https://shopify.baoea.com/liquid/getting-started#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

现在您已经掌握了 Liquid 的基础知识，建议继续学习：

1.  [Liquid 语法详解](https://shopify.baoea.com/liquid/syntax) - 深入了解语法规则
2.  [变量和对象](https://shopify.baoea.com/liquid/variables) - 学习变量使用和对象访问
3.  [过滤器完全指南](https://shopify.baoea.com/liquid/filters) - 掌握所有可用的过滤器
4.  [标签和控制结构](https://shopify.baoea.com/liquid/tags) - 学习逻辑控制和循环

## 练习建议[](https://shopify.baoea.com/liquid/getting-started#%E7%BB%83%E4%B9%A0%E5%BB%BA%E8%AE%AE)

1.  **创建一个简单的产品卡片** - 使用上面的示例代码
2.  **修改现有主题** - 尝试修改一些文本和样式
3.  **添加条件逻辑** - 根据产品状态显示不同内容
4.  **使用过滤器** - 格式化价格、日期和文本

通过这些实际练习，您将更好地理解 Liquid 的工作原理和强大功能！
