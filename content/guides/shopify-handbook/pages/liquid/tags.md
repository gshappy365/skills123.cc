---
source_url: "https://shopify.baoea.com/liquid/tags"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:43:10"
fetch_method: "http"
content_hash: "c9b745ffefca746c060f4d37c704601d2ae43490f8656d20728c9eb68f09862d"
discovered_via: ["sitemap", "internal_link"]
---
## 标签和控制结构

Liquid 标签是模板语言的核心，用于创建逻辑和控制流。本指南将详细介绍所有可用的标签和它们的高级用法。

## 标签基础[](https://shopify.baoea.com/liquid/tags#%E6%A0%87%E7%AD%BE%E5%9F%BA%E7%A1%80)

### 标签语法[](https://shopify.baoea.com/liquid/tags#%E6%A0%87%E7%AD%BE%E8%AF%AD%E6%B3%95)

```
<!-- 基本标签语法 -->
{% tag_name %}
 
<!-- 带参数的标签 -->
{% tag_name parameter %}
 
<!-- 标签块 -->
{% tag_name %}
  内容
{% endtag_name %}
 
<!-- 自闭合标签 -->
{% tag_name parameter %}
```

### 空白控制[](https://shopify.baoea.com/liquid/tags#%E7%A9%BA%E7%99%BD%E6%8E%A7%E5%88%B6)

```
<!-- 控制标签周围的空白 -->
{%- if condition -%}
  内容
{%- endif -%}
 
<!-- 只控制左侧空白 -->
{%- assign var = value %}
 
<!-- 只控制右侧空白 -->
{% assign var = value -%}
```

## 控制流标签[](https://shopify.baoea.com/liquid/tags#%E6%8E%A7%E5%88%B6%E6%B5%81%E6%A0%87%E7%AD%BE)

### if/elsif/else[](https://shopify.baoea.com/liquid/tags#ifelsifelse)

```
<!-- 基本条件判断 -->
{% if product.available %}
  <button class="add-to-cart">加入购物车</button>
{% endif %}
 
<!-- 多重条件 -->
{% if customer.tags contains 'vip' %}
  <span class="vip-badge">VIP 客户</span>
{% elsif customer.tags contains 'member' %}
  <span class="member-badge">会员</span>
{% else %}
  <span class="guest-badge">访客</span>
{% endif %}
 
<!-- 复杂条件表达式 -->
{% if product.available and product.price < 10000 %}
  <span class="affordable-available">经济实惠，现货供应</span>
{% elsif product.available and product.price >= 10000 %}
  <span class="premium-available">高端商品，现货供应</span>
{% elsif product.price < 10000 %}
  <span class="affordable-unavailable">经济实惠，暂时缺货</span>
{% else %}
  <span class="premium-unavailable">高端商品，暂时缺货</span>
{% endif %}
```

### unless[](https://shopify.baoea.com/liquid/tags#unless)

```
<!-- unless 是 if 的否定形式 -->
{% unless product.available %}
  <div class="out-of-stock-notice">
    <p>此商品暂时缺货</p>
    <button class="notify-btn">到货通知</button>
  </div>
{% endunless %}
 
<!-- 等同于 -->
{% if product.available == false %}
  <div class="out-of-stock-notice">
    <p>此商品暂时缺货</p>
    <button class="notify-btn">到货通知</button>
  </div>
{% endif %}
 
<!-- unless 与 else 组合 -->
{% unless customer %}
  <div class="login-prompt">
    <p>请登录以享受会员价格</p>
    <a href="/account/login">立即登录</a>
  </div>
{% else %}
  <div class="welcome-back">
    <p>欢迎回来，{{ customer.first_name }}！</p>
  </div>
{% endunless %}
```

### case/when[](https://shopify.baoea.com/liquid/tags#casewhen)

```
<!-- case 语句用于多分支选择 -->
{% case product.type %}
  {% when 'Electronics' %}
    <div class="electronics-info">
      <span class="icon">📱</span>
      <p>电子产品 - 1年保修</p>
    </div>
  {% when 'Clothing' %}
    <div class="clothing-info">
      <span class="icon">👕</span>
      <p>服装 - 7天无理由退换</p>
    </div>
  {% when 'Books' %}
    <div class="books-info">
      <span class="icon">📚</span>
      <p>图书 - 正版保证</p>
    </div>
  {% else %}
    <div class="general-info">
      <span class="icon">🎁</span>
      <p>其他商品 - 质量保证</p>
    </div>
{% endcase %}
 
<!-- 多值匹配 -->
{% case customer.tags %}
  {% when 'vip', 'premium', 'gold' %}
    <div class="premium-service">
      <h3>尊享服务</h3>
      <ul>
        <li>免费配送</li>
        <li>优先客服</li>
        <li>专属折扣</li>
      </ul>
    </div>
  {% when 'member', 'silver' %}
    <div class="member-service">
      <h3>会员服务</h3>
      <ul>
        <li>会员折扣</li>
        <li>积分奖励</li>
      </ul>
    </div>
  {% else %}
    <div class="standard-service">
      <h3>标准服务</h3>
      <p>注册成为会员，享受更多优惠！</p>
    </div>
{% endcase %}
```

## 循环标签[](https://shopify.baoea.com/liquid/tags#%E5%BE%AA%E7%8E%AF%E6%A0%87%E7%AD%BE)

### for 循环[](https://shopify.baoea.com/liquid/tags#for-%E5%BE%AA%E7%8E%AF)

```
<!-- 基本循环 -->
{% for product in collection.products %}
  <div class="product-item">
    <h3>{{ product.title }}</h3>
    <p>{{ product.price | money }}</p>
  </div>
{% endfor %}
 
<!-- 带限制的循环 -->
{% for product in collection.products limit: 8 %}
  <div class="featured-product">
    {{ product.title }}
  </div>
{% endfor %}
 
<!-- 跳过元素的循环 -->
{% for product in collection.products offset: 4 limit: 8 %}
  <div class="product-item">
    {{ product.title }}
  </div>
{% endfor %}
 
<!-- 反向循环 -->
{% for product in collection.products reversed %}
  <div class="product-item">
    <span class="position">{{ forloop.rindex }}</span>
    {{ product.title }}
  </div>
{% endfor %}
```

### forloop 对象[](https://shopify.baoea.com/liquid/tags#forloop-%E5%AF%B9%E8%B1%A1)

```
{% for item in cart.items %}
  <div class="cart-item" data-index="{{ forloop.index }}">
    <!-- forloop.index: 当前索引 (从1开始) -->
    <span class="item-number">{{ forloop.index }}</span>
    
    <!-- forloop.index0: 当前索引 (从0开始) -->
    <span class="item-id">item-{{ forloop.index0 }}</span>
    
    <!-- forloop.rindex: 反向索引 (从末尾开始) -->
    <span class="remaining">还有 {{ forloop.rindex }} 项</span>
    
    <!-- forloop.length: 总长度 -->
    <span class="total">共 {{ forloop.length }} 项</span>
    
    <!-- forloop.first: 是否为第一项 -->
    {% if forloop.first %}
      <span class="first-item">首项</span>
    {% endif %}
    
    <!-- forloop.last: 是否为最后一项 -->
    {% if forloop.last %}
      <span class="last-item">末项</span>
    {% endif %}
    
    <div class="item-content">{{ item.title }}</div>
  </div>
{% endfor %}
```

### 高级循环控制[](https://shopify.baoea.com/liquid/tags#%E9%AB%98%E7%BA%A7%E5%BE%AA%E7%8E%AF%E6%8E%A7%E5%88%B6)

```
<!-- continue - 跳过当前迭代 -->
{% for product in collection.products %}
  {% if product.available == false %}
    {% continue %}
  {% endif %}
  
  {% if product.price > 100000 %}
    {% continue %}
  {% endif %}
  
  <div class="available-affordable-product">
    <h3>{{ product.title }}</h3>
    <p>{{ product.price | money }}</p>
  </div>
{% endfor %}
 
<!-- break - 提前退出循环 -->
{% for product in collection.products %}
  {% if forloop.index > 6 %}
    {% break %}
  {% endif %}
  
  <div class="top-product">
    <span class="rank">第{{ forloop.index }}名</span>
    <h3>{{ product.title }}</h3>
  </div>
{% endfor %}
 
<!-- 在break后显示"更多"链接 -->
{% assign remaining_count = collection.products.size | minus: 6 %}
{% if remaining_count > 0 %}
  <div class="more-products">
    <a href="{{ collection.url }}">
      查看更多 {{ remaining_count }} 个商品
    </a>
  </div>
{% endif %}
```

### 循环的 else 子句[](https://shopify.baoea.com/liquid/tags#%E5%BE%AA%E7%8E%AF%E7%9A%84-else-%E5%AD%90%E5%8F%A5)

```
<!-- 当循环为空时执行else -->
{% for product in collection.products %}
  <div class="product-card">
    <h3>{{ product.title }}</h3>
    <p>{{ product.price | money }}</p>
  </div>
{% else %}
  <div class="empty-collection">
    <h3>暂无商品</h3>
    <p>该分类下还没有商品，请稍后再来查看。</p>
    <a href="/collections" class="browse-all">浏览所有分类</a>
  </div>
{% endfor %}
 
<!-- 条件性空状态 -->
{% assign available_products = collection.products | where: 'available', true %}
{% for product in available_products %}
  <div class="available-product">{{ product.title }}</div>
{% else %}
  <div class="no-available-products">
    <p>该分类下的商品暂时都缺货了</p>
    <button class="notify-btn">到货通知</button>
  </div>
{% endfor %}
```

### 范围循环[](https://shopify.baoea.com/liquid/tags#%E8%8C%83%E5%9B%B4%E5%BE%AA%E7%8E%AF)

```
<!-- 数字范围循环 -->
{% for i in (1..5) %}
  <span class="rating-star" data-rating="{{ i }}">⭐</span>
{% endfor %}
 
<!-- 变量范围循环 -->
{% assign start_year = 2020 %}
{% assign end_year = 2024 %}
{% for year in (start_year..end_year) %}
  <option value="{{ year }}">{{ year }}年</option>
{% endfor %}
 
<!-- 动态范围 -->
{% assign max_quantity = product.selected_or_first_available_variant.inventory_quantity | at_most: 10 %}
<select name="quantity">
  {% for qty in (1..max_quantity) %}
    <option value="{{ qty }}">{{ qty }}</option>
  {% endfor %}
</select>
 
<!-- 分页范围 -->
{% if paginate.pages > 1 %}
  <div class="pagination">
    {% for page in (1..paginate.pages) %}
      <a href="{{ blog.url }}?page={{ page }}" 
         {% if page == paginate.current_page %}class="current"{% endif %}>
        {{ page }}
      </a>
    {% endfor %}
  </div>
{% endif %}
```

## 变量标签[](https://shopify.baoea.com/liquid/tags#%E5%8F%98%E9%87%8F%E6%A0%87%E7%AD%BE)

### assign[](https://shopify.baoea.com/liquid/tags#assign)

```
<!-- 基本赋值 -->
{% assign product_title = product.title %}
{% assign sale_price = product.price | times: 0.8 %}
 
<!-- 字符串操作 -->
{% assign product_url = shop.url | append: product.url %}
{% assign css_classes = "product-card" | append: " featured" %}
 
<!-- 条件赋值 -->
{% if product.available %}
  {% assign availability_class = "in-stock" %}
  {% assign availability_text = "有库存" %}
{% else %}
  {% assign availability_class = "out-of-stock" %}
  {% assign availability_text = "缺货" %}
{% endif %}
 
<!-- 复杂计算 -->
{% assign discount = product.compare_at_price | minus: product.price %}
{% assign discount_percent = discount | times: 100 | divided_by: product.compare_at_price | round %}
{% assign savings_text = "节省 " | append: discount_percent | append: "%" %}
```

### capture[](https://shopify.baoea.com/liquid/tags#capture)

```
<!-- 捕获 HTML 内容 -->
{% capture product_gallery %}
  <div class="product-gallery">
    {% for image in product.images %}
      <div class="gallery-item">
        <img src="{{ image | image_url: width: 400, height: 400 }}" 
             alt="{{ image.alt | escape }}"
             data-zoom="{{ image | image_url: width: 1200, height: 1200 }}">
      </div>
    {% endfor %}
  </div>
{% endcapture %}
 
<!-- 捕获动态内容 -->
{% capture shipping_calculator %}
  {% if cart.total_price > 50000 %}
    <div class="free-shipping">
      <span class="icon">🚚</span>
      <span>免费配送</span>
    </div>
  {% else %}
    {% assign remaining = 50000 | minus: cart.total_price %}
    <div class="shipping-threshold">
      <span>再购买 {{ remaining | money }} 即可免费配送</span>
      <div class="progress-bar">
        {% assign progress = cart.total_price | times: 100 | divided_by: 50000 %}
        <div class="progress" style="width: {{ progress }}%"></div>
      </div>
    </div>
  {% endif %}
{% endcapture %}
 
<!-- 使用捕获的内容 -->
<div class="product-details">
  {{ product_gallery }}
</div>
 
<div class="cart-info">
  {{ shipping_calculator }}
</div>
```

### increment/decrement[](https://shopify.baoea.com/liquid/tags#incrementdecrement)

```
<!-- increment: 创建并递增变量 -->
<ul class="product-list">
  {% for product in collection.products %}
    <li class="product-item">
      <span class="item-number">{% increment item_counter %}</span>
      <h3>{{ product.title }}</h3>
    </li>
  {% endfor %}
</ul>
 
<!-- decrement: 创建并递减变量 -->
{% assign total_items = collection.products.size %}
<ol class="countdown-list">
  {% for product in collection.products %}
    <li class="countdown-item">
      <span class="remaining">还剩 {% decrement countdown %} 个</span>
      <h3>{{ product.title }}</h3>
    </li>
  {% endfor %}
</ol>
 
<!-- 多个计数器 -->
<div class="category-stats">
  {% for product in collection.products %}
    {% if product.type == 'Electronics' %}
      电子产品 #{% increment electronics_count %}
    {% elsif product.type == 'Clothing' %}
      服装 #{% increment clothing_count %}
    {% endif %}
  {% endfor %}
</div>
```

## 模板标签[](https://shopify.baoea.com/liquid/tags#%E6%A8%A1%E6%9D%BF%E6%A0%87%E7%AD%BE)

### render[](https://shopify.baoea.com/liquid/tags#render)

```
<!-- 基本渲染 -->
{% render 'product-card' %}
 
<!-- 传递变量 -->
{% render 'product-card', product: product %}
 
<!-- 传递多个变量 -->
{% render 'product-card',
    product: product,
    show_vendor: true,
    show_reviews: false,
    css_class: 'featured' %}
 
<!-- 在循环中渲染 -->
<div class="products-grid">
  {% for product in collection.products %}
    {% render 'product-card',
        product: product,
        index: forloop.index,
        is_first: forloop.first %}
  {% endfor %}
</div>
 
<!-- 条件渲染 -->
{% if customer %}
  {% render 'customer-dashboard', customer: customer %}
{% else %}
  {% render 'login-form' %}
{% endif %}
```

### 高级 render 用法[](https://shopify.baoea.com/liquid/tags#%E9%AB%98%E7%BA%A7-render-%E7%94%A8%E6%B3%95)

```
<!-- 动态模板渲染 -->
{% assign template_name = 'product-card-' | append: settings.card_style %}
{% render template_name, product: product %}
 
<!-- 渲染带配置的组件 -->
{% render 'image-gallery',
    images: product.images,
    config: {
      'thumbnail_size': '100x100',
      'main_size': '600x600',
      'zoom_enabled': true,
      'lazy_load': true
    } %}
 
<!-- 错误处理渲染 -->
{% assign snippet_exists = 'product-' | append: product.type | downcase %}
{% render snippet_exists, product: product %}
<!-- 如果snippet不存在，会静默失败 -->
```

## 原始内容标签[](https://shopify.baoea.com/liquid/tags#%E5%8E%9F%E5%A7%8B%E5%86%85%E5%AE%B9%E6%A0%87%E7%AD%BE)

### raw[](https://shopify.baoea.com/liquid/tags#raw)

```
<!-- 阻止 Liquid 处理内容 -->
{% raw %}
  <script>
    // 这里的 {{ }} 不会被 Liquid 处理
    var productTitle = "{{ product.title }}";
    var productPrice = {{ product.price }};
  </script>
{% endraw %}
 
<!-- 显示 Liquid 代码示例 -->
<div class="code-example">
  <h4>使用方法:</h4>
  <code>
    {% raw %}{{ product.title | upcase }}{% endraw %}
  </code>
</div>
 
<!-- 在教程中显示模板代码 -->
<pre class="liquid-code">
{% raw %}
{% for product in collection.products %}
  <h3>{{ product.title }}</h3>
  <p>{{ product.price | money }}</p>
{% endfor %}
{% endraw %}
</pre>
```

## 注释标签[](https://shopify.baoea.com/liquid/tags#%E6%B3%A8%E9%87%8A%E6%A0%87%E7%AD%BE)

### comment[](https://shopify.baoea.com/liquid/tags#comment)

```
{% comment %}
这是多行注释
可以包含任何内容
包括 Liquid 代码: {{ product.title }}
都不会被处理或显示
{% endcomment %}
 
{% comment %}
TODO: 优化产品卡片性能
- 实现图片懒加载
- 减少DOM操作
- 缓存价格计算
{% endcomment %}
 
<!-- 条件注释 -->
{% if settings.debug_mode %}
  {% comment %}
  调试信息:
  - 产品ID: {{ product.id }}
  - 模板: {{ template }}
  - 时间: {{ 'now' | date: '%Y-%m-%d %H:%M:%S' }}
  {% endcomment %}
{% endif %}
```

### 单行注释[](https://shopify.baoea.com/liquid/tags#%E5%8D%95%E8%A1%8C%E6%B3%A8%E9%87%8A)

```
{% # 这是单行注释 %}
 
{% assign price = product.price %} {% # 获取产品价格 %}
 
{% # TODO: 添加变体选择器 %}
<div class="product-options">
  <!-- 变体选择器将在这里 -->
</div>
```

## 表单标签[](https://shopify.baoea.com/liquid/tags#%E8%A1%A8%E5%8D%95%E6%A0%87%E7%AD%BE)

### form[](https://shopify.baoea.com/liquid/tags#form)

```
<!-- 产品表单 -->
{% form 'product', product %}
  <div class="product-form">
    {% if product.variants.size > 1 %}
      <div class="variant-selector">
        <select name="id" class="product-variants">
          {% for variant in product.variants %}
            <option value="{{ variant.id }}" 
                    {% unless variant.available %}disabled{% endunless %}>
              {{ variant.title }}
              {% unless variant.available %} - 缺货{% endunless %}
            </option>
          {% endfor %}
        </select>
      </div>
    {% else %}
      <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
    {% endif %}
    
    <div class="quantity-selector">
      <label for="quantity">数量:</label>
      <input type="number" name="quantity" value="1" min="1" max="10">
    </div>
    
    <button type="submit" class="add-to-cart-btn">
      加入购物车
    </button>
  </div>
{% endform %}
 
<!-- 联系表单 -->
{% form 'contact' %}
  <div class="contact-form">
    <div class="form-group">
      <label for="contact[name]">姓名</label>
      <input type="text" name="contact[name]" required>
    </div>
    
    <div class="form-group">
      <label for="contact[email]">邮箱</label>
      <input type="email" name="contact[email]" required>
    </div>
    
    <div class="form-group">
      <label for="contact[message]">留言</label>
      <textarea name="contact[message]" rows="5" required></textarea>
    </div>
    
    <button type="submit">发送留言</button>
  </div>
{% endform %}
```

## 分页标签[](https://shopify.baoea.com/liquid/tags#%E5%88%86%E9%A1%B5%E6%A0%87%E7%AD%BE)

### paginate[](https://shopify.baoea.com/liquid/tags#paginate)

```
<!-- 博客分页 -->
{% paginate blog.articles by 5 %}
  <div class="blog-articles">
    {% for article in blog.articles %}
      <article class="blog-post">
        <h2><a href="{{ article.url }}">{{ article.title }}</a></h2>
        <div class="article-meta">
          <time>{{ article.published_at | date: '%Y年%m月%d日' }}</time>
          <span class="author">{{ article.author }}</span>
        </div>
        <div class="article-excerpt">
          {{ article.excerpt | default: article.content | strip_html | truncate: 200 }}
        </div>
        <a href="{{ article.url }}" class="read-more">阅读全文</a>
      </article>
    {% endfor %}
  </div>
 
  <!-- 分页导航 -->
  {% if paginate.pages > 1 %}
    <nav class="pagination">
      {% if paginate.previous %}
        <a href="{{ paginate.previous.url }}" class="prev">上一页</a>
      {% endif %}
      
      {% for part in paginate.parts %}
        {% if part.is_link %}
          <a href="{{ part.url }}">{{ part.title }}</a>
        {% else %}
          <span class="current">{{ part.title }}</span>
        {% endif %}
      {% endfor %}
      
      {% if paginate.next %}
        <a href="{{ paginate.next.url }}" class="next">下一页</a>
      {% endif %}
    </nav>
  {% endif %}
{% endpaginate %}
```

## 高级标签组合[](https://shopify.baoea.com/liquid/tags#%E9%AB%98%E7%BA%A7%E6%A0%87%E7%AD%BE%E7%BB%84%E5%90%88)

### 嵌套循环和条件[](https://shopify.baoea.com/liquid/tags#%E5%B5%8C%E5%A5%97%E5%BE%AA%E7%8E%AF%E5%92%8C%E6%9D%A1%E4%BB%B6)

```
<!-- 产品按类型分组显示 -->
{% assign product_types = collection.products | map: 'type' | uniq %}
 
{% for product_type in product_types %}
  <div class="product-category">
    <h2>{{ product_type }}</h2>
    
    <div class="products-grid">
      {% for product in collection.products %}
        {% if product.type == product_type %}
          {% render 'product-card',
              product: product,
              show_type: false %}
        {% endif %}
      {% endfor %}
    </div>
  </div>
{% endfor %}
 
<!-- 复杂的购物车总结 -->
<div class="cart-summary">
  {% if cart.item_count > 0 %}
    {% assign subtotal = 0 %}
    {% assign shipping = 0 %}
    {% assign tax_rate = 0.08 %}
    
    {% for item in cart.items %}
      {% assign line_total = item.quantity | times: item.price %}
      {% assign subtotal = subtotal | plus: line_total %}
      
      <div class="cart-line-item">
        <span class="item-title">{{ item.title }}</span>
        <span class="item-quantity">{{ item.quantity }}</span>
        <span class="item-price">{{ line_total | money }}</span>
      </div>
    {% endfor %}
    
    {% if subtotal > 50000 %}
      {% assign shipping = 0 %}
    {% else %}
      {% assign shipping = 800 %}
    {% endif %}
    
    {% assign tax = subtotal | times: tax_rate %}
    {% assign total = subtotal | plus: shipping | plus: tax %}
    
    <div class="cart-totals">
      <div class="subtotal">小计: {{ subtotal | money }}</div>
      <div class="shipping">运费: {{ shipping | money }}</div>
      <div class="tax">税费: {{ tax | money }}</div>
      <div class="total">总计: {{ total | money }}</div>
    </div>
  {% else %}
    <div class="empty-cart">
      <p>购物车是空的</p>
      <a href="/collections" class="continue-shopping">继续购物</a>
    </div>
  {% endif %}
</div>
```

## 性能优化技巧[](https://shopify.baoea.com/liquid/tags#%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%8A%80%E5%B7%A7)

### 避免重复计算[](https://shopify.baoea.com/liquid/tags#%E9%81%BF%E5%85%8D%E9%87%8D%E5%A4%8D%E8%AE%A1%E7%AE%97)

```
<!-- 不好的做法 -->
{% for product in collection.products %}
  {% if collection.products.size > 10 %}
    <!-- collection.products.size 在每次循环中都会计算 -->
  {% endif %}
{% endfor %}
 
<!-- 好的做法 -->
{% assign product_count = collection.products.size %}
{% for product in collection.products %}
  {% if product_count > 10 %}
    <!-- 使用预计算的值 -->
  {% endif %}
{% endfor %}
```

### 减少嵌套深度[](https://shopify.baoea.com/liquid/tags#%E5%87%8F%E5%B0%91%E5%B5%8C%E5%A5%97%E6%B7%B1%E5%BA%A6)

```
<!-- 不好的做法 -->
{% for product in collection.products %}
  {% if product.available %}
    {% if product.price < 10000 %}
      {% if product.tags contains 'featured' %}
        <!-- 深层嵌套 -->
      {% endif %}
    {% endif %}
  {% endif %}
{% endfor %}
 
<!-- 好的做法 -->
{% for product in collection.products %}
  {% unless product.available %}{% continue %}{% endunless %}
  {% unless product.price < 10000 %}{% continue %}{% endunless %}
  {% unless product.tags contains 'featured' %}{% continue %}{% endunless %}
  
  <!-- 处理符合条件的产品 -->
{% endfor %}
```

## 下一步学习[](https://shopify.baoea.com/liquid/tags#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

掌握了标签和控制结构后，建议继续学习：

1.  [运算符和表达式](https://shopify.baoea.com/liquid/operators) - 学习更多操作符
2.  [Shopify 对象参考](https://shopify.baoea.com/liquid/shopify-objects) - 了解可用对象
3.  [高级 Liquid 技巧](https://shopify.baoea.com/liquid/advanced-liquid) - 进阶用法
4.  [性能优化](https://shopify.baoea.com/liquid/performance-optimization) - 优化技巧

标签是 Liquid 的核心功能，掌握它们将让您能够创建复杂而强大的模板逻辑！
