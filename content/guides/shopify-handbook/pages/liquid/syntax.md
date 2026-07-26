---
source_url: "https://shopify.baoea.com/liquid/syntax"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:43:09"
fetch_method: "http"
content_hash: "9791510935b1a8689556a41007c5333edde4302f3729668133e29390fcc04611"
discovered_via: ["sitemap", "internal_link"]
---
## Liquid 语法详解

Liquid 是一种安全、易学的模板语言，本指南将深入介绍 Liquid 的语法规则、标记类型和高级用法。

## 语法基础[](https://shopify.baoea.com/liquid/syntax#%E8%AF%AD%E6%B3%95%E5%9F%BA%E7%A1%80)

### Liquid 标记类型[](https://shopify.baoea.com/liquid/syntax#liquid-%E6%A0%87%E8%AE%B0%E7%B1%BB%E5%9E%8B)

Liquid 有三种主要的标记类型：

```
<!-- 1. 输出标记 - 输出内容 -->
{{ variable }}
 
<!-- 2. 逻辑标记 - 创建逻辑 -->
{% if condition %}
{% endif %}
 
<!-- 3. 注释标记 - 添加注释 -->
{% comment %}这是注释{% endcomment %}
```

### 空白控制[](https://shopify.baoea.com/liquid/syntax#%E7%A9%BA%E7%99%BD%E6%8E%A7%E5%88%B6)

使用连字符 `-` 来控制输出中的空白：

```
<!-- 标准输出 -->
{{ product.title }}
{{ product.price }}
 
<!-- 控制空白 -->
{{- product.title -}}
{{- product.price -}}
 
<!-- 在标签中控制空白 -->
{%- if product.available -%}
  有库存
{%- endif -%}
```

**示例对比:**

```
<!-- 带空白 -->
<ul>
  {% for item in cart.items %}
    <li>{{ item.title }}</li>
  {% endfor %}
</ul>
 
<!-- 控制空白 -->
<ul>
  {%- for item in cart.items -%}
    <li>{{ item.title }}</li>
  {%- endfor -%}
</ul>
```

## 变量和赋值[](https://shopify.baoea.com/liquid/syntax#%E5%8F%98%E9%87%8F%E5%92%8C%E8%B5%8B%E5%80%BC)

### 基本变量赋值[](https://shopify.baoea.com/liquid/syntax#%E5%9F%BA%E6%9C%AC%E5%8F%98%E9%87%8F%E8%B5%8B%E5%80%BC)

```
<!-- 简单赋值 -->
{% assign product_title = product.title %}
{% assign sale_price = product.price | times: 0.8 %}
 
<!-- 字符串赋值 -->
{% assign greeting = "欢迎来到我们的商店" %}
{% assign css_class = "product-card featured" %}
 
<!-- 使用变量 -->
<h1>{{ product_title }}</h1>
<p class="{{ css_class }}">特价: {{ sale_price | money }}</p>
```

### 捕获变量[](https://shopify.baoea.com/liquid/syntax#%E6%8D%95%E8%8E%B7%E5%8F%98%E9%87%8F)

使用 `capture` 标签创建复杂的变量：

```
<!-- 捕获 HTML 内容 -->
{% capture product_badge %}
  {% if product.compare_at_price > product.price %}
    <span class="sale-badge">促销</span>
  {% elsif product.tags contains 'new' %}
    <span class="new-badge">新品</span>
  {% endif %}
{% endcapture %}
 
<!-- 捕获计算结果 -->
{% capture discount_text %}
  {% assign discount = product.compare_at_price | minus: product.price %}
  {% assign discount_percent = discount | times: 100 | divided_by: product.compare_at_price | round %}
  节省 {{ discount | money }} ({{ discount_percent }}%)
{% endcapture %}
 
<!-- 使用捕获的变量 -->
<div class="product-info">
  {{ product_badge }}
  {{ discount_text }}
</div>
```

## 数据类型[](https://shopify.baoea.com/liquid/syntax#%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B)

### 字符串[](https://shopify.baoea.com/liquid/syntax#%E5%AD%97%E7%AC%A6%E4%B8%B2)

```
<!-- 字符串字面量 -->
{% assign message = "Hello World" %}
{% assign single_quotes = 'Hello World' %}
 
<!-- 字符串连接 -->
{% assign full_name = customer.first_name | append: ' ' | append: customer.last_name %}
 
<!-- 字符串包含检查 -->
{% if product.title contains "iPhone" %}
  <span class="apple-product">Apple 产品</span>
{% endif %}
```

### 数字[](https://shopify.baoea.com/liquid/syntax#%E6%95%B0%E5%AD%97)

```
<!-- 整数 -->
{% assign quantity = 5 %}
{% assign max_items = 10 %}
 
<!-- 浮点数 -->
{% assign discount_rate = 0.15 %}
{% assign tax_rate = 0.08 %}
 
<!-- 数字运算 -->
{% assign total = quantity | times: product.price %}
{% assign discounted_price = product.price | times: discount_rate %}
```

### 布尔值[](https://shopify.baoea.com/liquid/syntax#%E5%B8%83%E5%B0%94%E5%80%BC)

```
<!-- 布尔字面量 -->
{% assign is_sale = true %}
{% assign hide_price = false %}
 
<!-- 布尔表达式 -->
{% assign is_available = product.available %}
{% assign has_variants = product.variants.size > 1 %}
{% assign is_featured = product.tags contains "featured" %}
```

### 数组[](https://shopify.baoea.com/liquid/syntax#%E6%95%B0%E7%BB%84)

```
<!-- 数组访问 -->
{% assign first_image = product.images[0] %}
{% assign last_image = product.images.last %}
 
<!-- 数组操作 -->
{% assign sorted_products = collection.products | sort: 'title' %}
{% assign featured_products = collection.products | where: 'featured', true %}
 
<!-- 数组创建 -->
{% assign color_options = "红色,蓝色,绿色" | split: "," %}
```

### 对象[](https://shopify.baoea.com/liquid/syntax#%E5%AF%B9%E8%B1%A1)

```
<!-- 对象属性访问 -->
{{ product.title }}
{{ product['title'] }}
{{ product.variants[0].price }}
 
<!-- 嵌套对象访问 -->
{{ product.selected_or_first_available_variant.title }}
{{ customer.default_address.city }}
{{ blog.articles.first.author }}
```

## 操作符[](https://shopify.baoea.com/liquid/syntax#%E6%93%8D%E4%BD%9C%E7%AC%A6)

### 比较操作符[](https://shopify.baoea.com/liquid/syntax#%E6%AF%94%E8%BE%83%E6%93%8D%E4%BD%9C%E7%AC%A6)

```
<!-- 相等比较 -->
{% if product.price == 100 %}
  特价商品
{% endif %}
 
{% if customer.email != blank %}
  已登录用户
{% endif %}
 
<!-- 大小比较 -->
{% if product.price > 50 %}
  高价商品
{% elsif product.price < 20 %}
  低价商品
{% else %}
  中等价位
{% endif %}
 
<!-- 包含检查 -->
{% if product.tags contains "sale" %}
  促销商品
{% endif %}
```

### 逻辑操作符[](https://shopify.baoea.com/liquid/syntax#%E9%80%BB%E8%BE%91%E6%93%8D%E4%BD%9C%E7%AC%A6)

```
<!-- AND 操作 -->
{% if product.available and product.price < 100 %}
  便宜且有库存
{% endif %}
 
<!-- OR 操作 -->
{% if product.tags contains "featured" or product.tags contains "bestseller" %}
  推荐商品
{% endif %}
 
<!-- 组合逻辑 -->
{% if product.available and (product.price < 50 or product.tags contains "sale") %}
  优惠商品
{% endif %}
```

### 存在性检查[](https://shopify.baoea.com/liquid/syntax#%E5%AD%98%E5%9C%A8%E6%80%A7%E6%A3%80%E6%9F%A5)

```
<!-- 检查是否存在 -->
{% if product.description %}
  <p>{{ product.description }}</p>
{% endif %}
 
<!-- 检查是否为空 -->
{% if product.description != blank %}
  <p>{{ product.description }}</p>
{% endif %}
 
{% unless product.description == blank %}
  <p>{{ product.description }}</p>
{% endunless %}
```

## 条件语句[](https://shopify.baoea.com/liquid/syntax#%E6%9D%A1%E4%BB%B6%E8%AF%AD%E5%8F%A5)

### if/elsif/else[](https://shopify.baoea.com/liquid/syntax#ifelsifelse)

```
<!-- 基本条件 -->
{% if product.available %}
  <button type="submit">加入购物车</button>
{% else %}
  <button disabled>缺货</button>
{% endif %}
 
<!-- 多重条件 -->
{% if product.price > 100 %}
  <span class="high-price">高端商品</span>
{% elsif product.price > 50 %}
  <span class="medium-price">中档商品</span>
{% else %}
  <span class="low-price">经济实惠</span>
{% endif %}
 
<!-- 复杂条件 -->
{% if product.available %}
  {% if product.variants.size > 1 %}
    <select name="id">
      {% for variant in product.variants %}
        <option value="{{ variant.id }}">{{ variant.title }}</option>
      {% endfor %}
    </select>
  {% else %}
    <input type="hidden" name="id" value="{{ product.first_available_variant.id }}">
  {% endif %}
  <button type="submit">加入购物车</button>
{% endif %}
```

### unless[](https://shopify.baoea.com/liquid/syntax#unless)

```
<!-- unless 语句 -->
{% unless product.available %}
  <p class="out-of-stock">商品缺货</p>
{% endunless %}
 
<!-- 等同于 -->
{% if product.available == false %}
  <p class="out-of-stock">商品缺货</p>
{% endif %}
```

### case/when[](https://shopify.baoea.com/liquid/syntax#casewhen)

```
<!-- case 语句 -->
{% case product.type %}
  {% when 'Electronics' %}
    <span class="icon-electronics">📱</span>
  {% when 'Clothing' %}
    <span class="icon-clothing">👕</span>
  {% when 'Books' %}
    <span class="icon-books">📚</span>
  {% else %}
    <span class="icon-other">🎁</span>
{% endcase %}
 
<!-- 多值匹配 -->
{% case product.vendor %}
  {% when 'Apple', 'Samsung', 'Google' %}
    <span class="tech-brand">科技品牌</span>
  {% when 'Nike', 'Adidas', 'Puma' %}
    <span class="sports-brand">运动品牌</span>
  {% else %}
    <span class="other-brand">其他品牌</span>
{% endcase %}
```

## 循环语句[](https://shopify.baoea.com/liquid/syntax#%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5)

### for 循环[](https://shopify.baoea.com/liquid/syntax#for-%E5%BE%AA%E7%8E%AF)

```
<!-- 基本循环 -->
{% for product in collection.products %}
  <div class="product-item">
    <h3>{{ product.title }}</h3>
    <p>{{ product.price | money }}</p>
  </div>
{% endfor %}
 
<!-- 带索引的循环 -->
{% for product in collection.products %}
  <div class="product-item product-{{ forloop.index }}">
    <span class="position">第 {{ forloop.index }} 位</span>
    <h3>{{ product.title }}</h3>
  </div>
{% endfor %}
 
<!-- 限制循环次数 -->
{% for product in collection.products limit: 4 %}
  <div class="featured-product">{{ product.title }}</div>
{% endfor %}
 
<!-- 跳过元素 -->
{% for product in collection.products offset: 2 limit: 4 %}
  <div class="product">{{ product.title }}</div>
{% endfor %}
```

### forloop 对象[](https://shopify.baoea.com/liquid/syntax#forloop-%E5%AF%B9%E8%B1%A1)

```
{% for item in cart.items %}
  <tr class="cart-item">
    <td>{{ forloop.index }}</td>  <!-- 当前索引 (1开始) -->
    <td>{{ item.title }}</td>
    <td>
      {% if forloop.first %}
        第一个商品
      {% elsif forloop.last %}
        最后一个商品
      {% endif %}
    </td>
    <td>{{ forloop.length }}</td>  <!-- 总数量 -->
    <td>{{ forloop.rindex }}</td>  <!-- 反向索引 -->
  </tr>
{% endfor %}
```

### 循环控制[](https://shopify.baoea.com/liquid/syntax#%E5%BE%AA%E7%8E%AF%E6%8E%A7%E5%88%B6)

```
<!-- continue - 跳过当前迭代 -->
{% for product in collection.products %}
  {% unless product.available %}
    {% continue %}
  {% endunless %}
  
  <div class="available-product">
    {{ product.title }}
  </div>
{% endfor %}
 
<!-- break - 退出循环 -->
{% for product in collection.products %}
  {% if forloop.index > 5 %}
    {% break %}
  {% endif %}
  
  <div class="top-product">
    {{ product.title }}
  </div>
{% endfor %}
```

### else 子句[](https://shopify.baoea.com/liquid/syntax#else-%E5%AD%90%E5%8F%A5)

```
<!-- 循环为空时的处理 -->
{% for product in collection.products %}
  <div class="product">{{ product.title }}</div>
{% else %}
  <p>此集合暂无商品</p>
{% endfor %}
```

### 范围循环[](https://shopify.baoea.com/liquid/syntax#%E8%8C%83%E5%9B%B4%E5%BE%AA%E7%8E%AF)

```
<!-- 数字范围 -->
{% for i in (1..5) %}
  <span class="rating-star">⭐</span>
{% endfor %}
 
<!-- 变量范围 -->
{% assign max_pages = paginate.pages %}
{% for i in (1..max_pages) %}
  <a href="{{ blog.url }}?page={{ i }}" 
     {% if i == paginate.current_page %}class="current"{% endif %}>
    {{ i }}
  </a>
{% endfor %}
```

## 包含和渲染[](https://shopify.baoea.com/liquid/syntax#%E5%8C%85%E5%90%AB%E5%92%8C%E6%B8%B2%E6%9F%93)

### render 标签[](https://shopify.baoea.com/liquid/syntax#render-%E6%A0%87%E7%AD%BE)

```
<!-- 基本渲染 -->
{% render 'product-card' %}
 
<!-- 传递变量 -->
{% render 'product-card', product: product %}
 
<!-- 传递多个变量 -->
{% render 'product-card', 
    product: product, 
    show_vendor: true, 
    css_class: 'featured' %}
 
<!-- 在循环中渲染 -->
{% for product in collection.products %}
  {% render 'product-card', product: product %}
{% endfor %}
```

### include 标签 (已废弃)[](https://shopify.baoea.com/liquid/syntax#include-%E6%A0%87%E7%AD%BE-%E5%B7%B2%E5%BA%9F%E5%BC%83)

```
<!-- 旧式包含 (不推荐) -->
{% include 'product-card' %}
 
<!-- 应该使用 render 代替 -->
{% render 'product-card' %}
```

## 注释[](https://shopify.baoea.com/liquid/syntax#%E6%B3%A8%E9%87%8A)

### 单行注释[](https://shopify.baoea.com/liquid/syntax#%E5%8D%95%E8%A1%8C%E6%B3%A8%E9%87%8A)

```
{% # 这是单行注释 %}
 
{% assign price = product.price %} {% # 获取价格 %}
```

### 多行注释[](https://shopify.baoea.com/liquid/syntax#%E5%A4%9A%E8%A1%8C%E6%B3%A8%E9%87%8A)

```
{% comment %}
这是多行注释
可以包含多行内容
不会在输出中显示
{% endcomment %}
 
{% comment %}
TODO: 优化这个section的性能
- 减少循环次数
- 使用更高效的过滤器
{% endcomment %}
```

### HTML 注释[](https://shopify.baoea.com/liquid/syntax#html-%E6%B3%A8%E9%87%8A)

```
<!-- 这是 HTML 注释，会出现在输出中 -->
 
<!-- 调试信息: {{ product.id }} -->
```

## 原始内容[](https://shopify.baoea.com/liquid/syntax#%E5%8E%9F%E5%A7%8B%E5%86%85%E5%AE%B9)

### raw 标签[](https://shopify.baoea.com/liquid/syntax#raw-%E6%A0%87%E7%AD%BE)

```
<!-- 阻止 Liquid 处理内容 -->
{% raw %}
  这里的 {{ product.title }} 不会被处理
  {% if true %} 这也不会被处理 {% endif %}
{% endraw %}
 
<!-- 用于显示 Liquid 代码示例 -->
{% raw %}
  <p>使用方法: {{ product.title | upcase }}</p>
{% endraw %}
```

## 液体对象作用域[](https://shopify.baoea.com/liquid/syntax#%E6%B6%B2%E4%BD%93%E5%AF%B9%E8%B1%A1%E4%BD%9C%E7%94%A8%E5%9F%9F)

### 全局作用域[](https://shopify.baoea.com/liquid/syntax#%E5%85%A8%E5%B1%80%E4%BD%9C%E7%94%A8%E5%9F%9F)

```
<!-- 这些变量在整个模板中可用 -->
{{ shop.name }}
{{ cart.item_count }}
{{ customer.first_name }}
```

### 局部作用域[](https://shopify.baoea.com/liquid/syntax#%E5%B1%80%E9%83%A8%E4%BD%9C%E7%94%A8%E5%9F%9F)

```
<!-- assign 创建的变量在当前模板中可用 -->
{% assign local_var = "局部变量" %}
 
<!-- for 循环变量只在循环内可用 -->
{% for product in collection.products %}
  <!-- product 只在这个循环内可用 -->
  {{ product.title }}
{% endfor %}
```

### snippet 作用域[](https://shopify.baoea.com/liquid/syntax#snippet-%E4%BD%9C%E7%94%A8%E5%9F%9F)

```
<!-- snippets/my-snippet.liquid -->
<!-- snippet 内的变量不会污染父作用域 -->
{% assign snippet_var = "只在snippet内可用" %}
 
<!-- 通过 render 传递的变量 -->
<div class="product-card">
  {{ product.title }}  <!-- 从外部传入 -->
</div>
```

## 错误处理[](https://shopify.baoea.com/liquid/syntax#%E9%94%99%E8%AF%AF%E5%A4%84%E7%90%86)

### 安全导航[](https://shopify.baoea.com/liquid/syntax#%E5%AE%89%E5%85%A8%E5%AF%BC%E8%88%AA)

```
<!-- 安全访问可能不存在的属性 -->
{{ product.featured_image.alt | default: product.title }}
 
<!-- 检查对象是否存在 -->
{% if product.featured_image %}
  <img src="{{ product.featured_image | image_url: width: 300, height: 300 }}" 
       alt="{{ product.featured_image.alt | escape }}">
{% endif %}
```

### 默认值处理[](https://shopify.baoea.com/liquid/syntax#%E9%BB%98%E8%AE%A4%E5%80%BC%E5%A4%84%E7%90%86)

```
<!-- 使用 default 过滤器 -->
{{ product.description | default: "暂无描述" }}
{{ customer.first_name | default: "访客" }}
 
<!-- 使用 or 操作符 -->
{% assign display_name = customer.first_name | default: "访客" %}
```

## 性能最佳实践[](https://shopify.baoea.com/liquid/syntax#%E6%80%A7%E8%83%BD%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5)

### 避免重复计算[](https://shopify.baoea.com/liquid/syntax#%E9%81%BF%E5%85%8D%E9%87%8D%E5%A4%8D%E8%AE%A1%E7%AE%97)

```
<!-- 好的做法 -->
{% assign available_products = collection.products | where: 'available', true %}
{% for product in available_products %}
  {{ product.title }}
{% endfor %}
 
<!-- 避免的做法 -->
{% for product in collection.products %}
  {% if product.available %}
    {{ product.title }}
  {% endif %}
{% endfor %}
```

### 合理使用过滤器[](https://shopify.baoea.com/liquid/syntax#%E5%90%88%E7%90%86%E4%BD%BF%E7%94%A8%E8%BF%87%E6%BB%A4%E5%99%A8)

```
<!-- 在循环外预处理 -->
{% assign sorted_tags = product.tags | sort %}
{% for tag in sorted_tags %}
  <span class="tag">{{ tag }}</span>
{% endfor %}
 
<!-- 避免重复的字符串操作 -->
{% assign base_url = shop.url | append: "/products/" %}
{% for product in collection.products %}
  <a href="{{ base_url }}{{ product.handle }}">{{ product.title }}</a>
{% endfor %}
```

## 调试技巧[](https://shopify.baoea.com/liquid/syntax#%E8%B0%83%E8%AF%95%E6%8A%80%E5%B7%A7)

### 输出调试信息[](https://shopify.baoea.com/liquid/syntax#%E8%BE%93%E5%87%BA%E8%B0%83%E8%AF%95%E4%BF%A1%E6%81%AF)

```
<!-- 查看变量内容 -->
<pre>{{ product | json }}</pre>
 
<!-- 查看变量类型 -->
{{ product.price.class }}
 
<!-- 条件调试 -->
{% if settings.debug_mode %}
  <div class="debug">
    <p>Product ID: {{ product.id }}</p>
    <p>Available: {{ product.available }}</p>
    <p>Price: {{ product.price }}</p>
  </div>
{% endif %}
```

### 性能监控[](https://shopify.baoea.com/liquid/syntax#%E6%80%A7%E8%83%BD%E7%9B%91%E6%8E%A7)

```
<!-- 记录处理时间 -->
{% assign start_time = 'now' | date: '%s' %}
 
<!-- 复杂操作 -->
{% for product in collection.products %}
  <!-- 处理产品 -->
{% endfor %}
 
{% assign end_time = 'now' | date: '%s' %}
{% assign processing_time = end_time | minus: start_time %}
 
{% if settings.debug_mode %}
  <p>处理时间: {{ processing_time }}秒</p>
{% endif %}
```

## 下一步学习[](https://shopify.baoea.com/liquid/syntax#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

掌握了 Liquid 语法后，建议继续学习：

1.  [变量和对象](https://shopify.baoea.com/liquid/variables) - 深入了解变量使用
2.  [过滤器完全指南](https://shopify.baoea.com/liquid/filters) - 掌握数据处理
3.  [标签和控制结构](https://shopify.baoea.com/liquid/tags) - 学习高级标签
4.  [Shopify 对象参考](https://shopify.baoea.com/liquid/shopify-objects) - 了解特定对象

通过理解这些语法规则，您将能够创建更加复杂和强大的 Shopify 主题！
