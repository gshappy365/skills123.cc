---
source_url: "https://shopify.baoea.com/liquid/objects"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:53"
fetch_method: "http"
content_hash: "49c1927a7fa28de404623f76098a15132e139e2e219bdfe57fbadae454a0a8bf"
discovered_via: ["sitemap", "internal_link"]
---
## 对象和属性

在 Liquid 中，对象是包含属性的数据结构。理解对象系统对于有效使用 Shopify 主题开发至关重要。

## 对象基础概念[](https://shopify.baoea.com/liquid/objects#%E5%AF%B9%E8%B1%A1%E5%9F%BA%E7%A1%80%E6%A6%82%E5%BF%B5)

### 什么是对象[](https://shopify.baoea.com/liquid/objects#%E4%BB%80%E4%B9%88%E6%98%AF%E5%AF%B9%E8%B1%A1)

```
<!-- 对象是具有属性的数据结构 -->
{{ product.title }}        <!-- product 是对象，title 是属性 -->
{{ customer.first_name }}  <!-- customer 是对象，first_name 是属性 -->
{{ shop.name }}            <!-- shop 是对象，name 是属性 -->
```

### 对象层次结构[](https://shopify.baoea.com/liquid/objects#%E5%AF%B9%E8%B1%A1%E5%B1%82%E6%AC%A1%E7%BB%93%E6%9E%84)

```
<!-- Shopify 对象层次结构示例 -->
全局对象
├── shop (商店对象)
├── cart (购物车对象)
├── customer (客户对象)
└── request (请求对象)
 
页面特定对象
├── product (产品对象)
├── collection (集合对象)
├── blog (博客对象)
└── article (文章对象)
```

## 对象属性访问[](https://shopify.baoea.com/liquid/objects#%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7%E8%AE%BF%E9%97%AE)

### 点号访问[](https://shopify.baoea.com/liquid/objects#%E7%82%B9%E5%8F%B7%E8%AE%BF%E9%97%AE)

```
<!-- 基本属性访问 -->
{{ product.title }}
{{ product.price }}
{{ product.description }}
 
<!-- 嵌套属性访问 -->
{{ product.featured_image.alt }}
{{ customer.default_address.city }}
{{ order.shipping_address.country }}
 
<!-- 深层嵌套访问 -->
{{ product.selected_or_first_available_variant.title }}
{{ blog.articles.first.author }}
{{ cart.items.last.product.vendor }}
```

### 方括号访问[](https://shopify.baoea.com/liquid/objects#%E6%96%B9%E6%8B%AC%E5%8F%B7%E8%AE%BF%E9%97%AE)

```
<!-- 使用方括号访问属性 -->
{{ product['title'] }}
{{ customer['first_name'] }}
{{ order['created_at'] }}
 
<!-- 动态属性访问 -->
{% assign property_name = 'title' %}
{{ product[property_name] }}
 
{% assign field = 'first_name' %}
{{ customer[field] }}
```

### 动态属性访问示例[](https://shopify.baoea.com/liquid/objects#%E5%8A%A8%E6%80%81%E5%B1%9E%E6%80%A7%E8%AE%BF%E9%97%AE%E7%A4%BA%E4%BE%8B)

```
<!-- 根据用户选择显示不同属性 -->
{% assign display_field = settings.product_display_field %}
{% case display_field %}
  {% when 'title' %}
    {{ product.title }}
  {% when 'vendor' %}
    {{ product.vendor }}
  {% when 'type' %}
    {{ product.type }}
  {% else %}
    {{ product[display_field] }}
{% endcase %}
 
<!-- 循环显示多个属性 -->
{% assign product_fields = 'title,vendor,type,price' | split: ',' %}
<dl class="product-details">
  {% for field in product_fields %}
    <dt>{{ field | capitalize }}:</dt>
    <dd>{{ product[field] }}</dd>
  {% endfor %}
</dl>
```

## 对象存在性检查[](https://shopify.baoea.com/liquid/objects#%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%9C%A8%E6%80%A7%E6%A3%80%E6%9F%A5)

### 检查对象是否存在[](https://shopify.baoea.com/liquid/objects#%E6%A3%80%E6%9F%A5%E5%AF%B9%E8%B1%A1%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8)

```
<!-- 检查对象本身是否存在 -->
{% if customer %}
  <p>用户已登录: {{ customer.email }}</p>
{% else %}
  <p>用户未登录</p>
{% endif %}
 
<!-- 检查嵌套对象是否存在 -->
{% if product.featured_image %}
  <img src="{{ product.featured_image | image_url: width: 400, height: 400 }}" 
       alt="{{ product.featured_image.alt }}">
{% else %}
  <div class="no-image-placeholder">暂无图片</div>
{% endif %}
```

### 检查属性是否存在[](https://shopify.baoea.com/liquid/objects#%E6%A3%80%E6%9F%A5%E5%B1%9E%E6%80%A7%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8)

```
<!-- 检查属性是否存在且不为空 -->
{% if product.description %}
  <div class="product-description">
    {{ product.description }}
  </div>
{% endif %}
 
<!-- 检查属性是否不为 blank -->
{% if product.description != blank %}
  <div class="product-description">
    {{ product.description }}
  </div>
{% endif %}
 
<!-- 检查数组属性是否有内容 -->
{% if product.images.size > 0 %}
  <div class="product-gallery">
    {% for image in product.images %}
      <img src="{{ image | image_url: width: 300, height: 300 }}" alt="{{ image.alt }}">
    {% endfor %}
  </div>
{% endif %}
```

### 安全访问模式[](https://shopify.baoea.com/liquid/objects#%E5%AE%89%E5%85%A8%E8%AE%BF%E9%97%AE%E6%A8%A1%E5%BC%8F)

```
<!-- 使用 default 过滤器提供默认值 -->
{{ product.description | default: "暂无描述" }}
{{ customer.first_name | default: "访客" }}
{{ product.featured_image.alt | default: product.title }}
 
<!-- 链式安全访问 -->
{% assign image_alt = product.featured_image.alt %}
{% if image_alt == blank %}
  {% assign image_alt = product.title %}
{% endif %}
{{ image_alt }}
 
<!-- 三级安全访问 -->
{% if product.featured_image and product.featured_image.alt %}
  {{ product.featured_image.alt }}
{% elsif product.featured_image %}
  {{ product.title }}
{% else %}
  默认图片描述
{% endif %}
```

## 对象方法和属性[](https://shopify.baoea.com/liquid/objects#%E5%AF%B9%E8%B1%A1%E6%96%B9%E6%B3%95%E5%92%8C%E5%B1%9E%E6%80%A7)

### 数组对象方法[](https://shopify.baoea.com/liquid/objects#%E6%95%B0%E7%BB%84%E5%AF%B9%E8%B1%A1%E6%96%B9%E6%B3%95)

```
<!-- 数组长度 -->
{{ product.images.size }}
{{ collection.products.size }}
{{ customer.addresses.size }}
 
<!-- 第一个和最后一个元素 -->
{{ product.images.first }}
{{ product.images.last }}
{{ collection.products.first }}
{{ collection.products.last }}
 
<!-- 数组索引访问 -->
{{ product.images[0] }}
{{ product.images[1] }}
{{ product.images[-1] }}  <!-- 最后一个元素 -->
{{ product.images[-2] }}  <!-- 倒数第二个元素 -->
```

### 字符串对象方法[](https://shopify.baoea.com/liquid/objects#%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AF%B9%E8%B1%A1%E6%96%B9%E6%B3%95)

```
<!-- 字符串长度 -->
{{ product.title.size }}
{{ customer.first_name.size }}
 
<!-- 字符串检查 -->
{% if product.title.size > 20 %}
  <h3 title="{{ product.title }}">{{ product.title | truncate: 20 }}</h3>
{% else %}
  <h3>{{ product.title }}</h3>
{% endif %}
```

### 日期对象方法[](https://shopify.baoea.com/liquid/objects#%E6%97%A5%E6%9C%9F%E5%AF%B9%E8%B1%A1%E6%96%B9%E6%B3%95)

```
<!-- 日期格式化 -->
{{ order.created_at | date: '%Y-%m-%d' }}
{{ article.published_at | date: '%B %d, %Y' }}
 
<!-- 日期比较 -->
{% assign today = 'now' | date: '%Y-%m-%d' %}
{% assign order_date = order.created_at | date: '%Y-%m-%d' %}
{% if order_date == today %}
  <span class="today-order">今日订单</span>
{% endif %}
```

## 对象遍历[](https://shopify.baoea.com/liquid/objects#%E5%AF%B9%E8%B1%A1%E9%81%8D%E5%8E%86)

### 遍历数组对象[](https://shopify.baoea.com/liquid/objects#%E9%81%8D%E5%8E%86%E6%95%B0%E7%BB%84%E5%AF%B9%E8%B1%A1)

```
<!-- 遍历产品图片 -->
{% for image in product.images %}
  <div class="image-item">
    <img src="{{ image | image_url: width: 400, height: 400 }}" 
         alt="{{ image.alt | escape }}"
         data-index="{{ forloop.index0 }}">
  </div>
{% endfor %}
 
<!-- 遍历购物车商品 -->
{% for item in cart.items %}
  <div class="cart-item">
    <h4>{{ item.title }}</h4>
    <p>数量: {{ item.quantity }}</p>
    <p>价格: {{ item.price | money }}</p>
    <p>小计: {{ item.line_price | money }}</p>
  </div>
{% endfor %}
 
<!-- 遍历客户地址 -->
{% for address in customer.addresses %}
  <div class="address-card">
    <h4>{{ address.first_name }} {{ address.last_name }}</h4>
    <p>{{ address.address1 }}</p>
    {% if address.address2 != blank %}
      <p>{{ address.address2 }}</p>
    {% endif %}
    <p>{{ address.city }}, {{ address.province }} {{ address.zip }}</p>
    <p>{{ address.country }}</p>
  </div>
{% endfor %}
```

### 有条件的遍历[](https://shopify.baoea.com/liquid/objects#%E6%9C%89%E6%9D%A1%E4%BB%B6%E7%9A%84%E9%81%8D%E5%8E%86)

```
<!-- 只遍历可用的产品变体 -->
{% for variant in product.variants %}
  {% if variant.available %}
    <option value="{{ variant.id }}">
      {{ variant.title }} - {{ variant.price | money }}
    </option>
  {% endif %}
{% endfor %}
 
<!-- 遍历特定标签的文章 -->
{% for article in blog.articles %}
  {% if article.tags contains 'featured' %}
    <article class="featured-article">
      <h2>{{ article.title }}</h2>
      <p>{{ article.excerpt }}</p>
    </article>
  {% endif %}
{% endfor %}
```

## 对象过滤和操作[](https://shopify.baoea.com/liquid/objects#%E5%AF%B9%E8%B1%A1%E8%BF%87%E6%BB%A4%E5%92%8C%E6%93%8D%E4%BD%9C)

### 使用 where 过滤器[](https://shopify.baoea.com/liquid/objects#%E4%BD%BF%E7%94%A8-where-%E8%BF%87%E6%BB%A4%E5%99%A8)

```
<!-- 过滤可用产品 -->
{% assign available_products = collection.products | where: 'available', true %}
 
<!-- 过滤特定供应商的产品 -->
{% assign apple_products = collection.products | where: 'vendor', 'Apple' %}
 
<!-- 过滤包含特定标签的产品 -->
{% assign featured_products = collection.products | where: 'tags', 'featured' %}
 
<!-- 显示过滤结果 -->
<div class="filtered-products">
  {% for product in featured_products %}
    {% render 'product-card', product: product %}
  {% endfor %}
</div>
```

### 使用 map 提取属性[](https://shopify.baoea.com/liquid/objects#%E4%BD%BF%E7%94%A8-map-%E6%8F%90%E5%8F%96%E5%B1%9E%E6%80%A7)

```
<!-- 提取所有产品标题 -->
{% assign product_titles = collection.products | map: 'title' %}
 
<!-- 提取所有供应商 -->
{% assign vendors = collection.products | map: 'vendor' | uniq %}
 
<!-- 提取所有价格 -->
{% assign prices = collection.products | map: 'price' %}
 
<!-- 显示提取的信息 -->
<div class="vendors-list">
  <h3>品牌列表:</h3>
  {% for vendor in vendors %}
    <span class="vendor-tag">{{ vendor }}</span>
  {% endfor %}
</div>
```

### 对象排序[](https://shopify.baoea.com/liquid/objects#%E5%AF%B9%E8%B1%A1%E6%8E%92%E5%BA%8F)

```
<!-- 按标题排序 -->
{% assign sorted_products = collection.products | sort: 'title' %}
 
<!-- 按价格排序 -->
{% assign price_sorted = collection.products | sort: 'price' %}
 
<!-- 按创建时间排序 -->
{% assign newest_first = collection.products | sort: 'created_at' | reverse %}
 
<!-- 显示排序结果 -->
<div class="sorted-products">
  {% for product in price_sorted %}
    <div class="product-item">
      <h4>{{ product.title }}</h4>
      <p>{{ product.price | money }}</p>
    </div>
  {% endfor %}
</div>
```

## 复杂对象操作[](https://shopify.baoea.com/liquid/objects#%E5%A4%8D%E6%9D%82%E5%AF%B9%E8%B1%A1%E6%93%8D%E4%BD%9C)

### 对象聚合统计[](https://shopify.baoea.com/liquid/objects#%E5%AF%B9%E8%B1%A1%E8%81%9A%E5%90%88%E7%BB%9F%E8%AE%A1)

```
<!-- 统计不同类型的产品数量 -->
{% assign electronics_count = 0 %}
{% assign clothing_count = 0 %}
{% assign books_count = 0 %}
{% assign other_count = 0 %}
 
{% for product in collection.products %}
  {% case product.type %}
    {% when 'Electronics' %}
      {% assign electronics_count = electronics_count | plus: 1 %}
    {% when 'Clothing' %}
      {% assign clothing_count = clothing_count | plus: 1 %}
    {% when 'Books' %}
      {% assign books_count = books_count | plus: 1 %}
    {% else %}
      {% assign other_count = other_count | plus: 1 %}
  {% endcase %}
{% endfor %}
 
<div class="category-stats">
  <h3>产品分类统计</h3>
  <ul>
    <li>电子产品: {{ electronics_count }}</li>
    <li>服装: {{ clothing_count }}</li>
    <li>图书: {{ books_count }}</li>
    <li>其他: {{ other_count }}</li>
  </ul>
</div>
```

### 对象关系分析[](https://shopify.baoea.com/liquid/objects#%E5%AF%B9%E8%B1%A1%E5%85%B3%E7%B3%BB%E5%88%86%E6%9E%90)

```
<!-- 分析购物车中的产品关系 -->
{% assign cart_vendors = "" %}
{% assign cart_types = "" %}
{% assign total_value = 0 %}
 
{% for item in cart.items %}
  <!-- 收集供应商 -->
  {% unless cart_vendors contains item.vendor %}
    {% if cart_vendors == "" %}
      {% assign cart_vendors = item.vendor %}
    {% else %}
      {% assign cart_vendors = cart_vendors | append: "," | append: item.vendor %}
    {% endif %}
  {% endunless %}
  
  <!-- 收集产品类型 -->
  {% unless cart_types contains item.product.type %}
    {% if cart_types == "" %}
      {% assign cart_types = item.product.type %}
    {% else %}
      {% assign cart_types = cart_types | append: "," | append: item.product.type %}
    {% endif %}
  {% endunless %}
  
  <!-- 计算总价值 -->
  {% assign line_total = item.quantity | times: item.price %}
  {% assign total_value = total_value | plus: line_total %}
{% endfor %}
 
<div class="cart-analysis">
  <h3>购物车分析</h3>
  <p>涉及品牌: {{ cart_vendors | split: "," | size }}</p>
  <p>产品类型: {{ cart_types | split: "," | size }}</p>
  <p>总价值: {{ total_value | money }}</p>
  <p>平均单价: {{ total_value | divided_by: cart.item_count | money }}</p>
</div>
```

### 对象数据转换[](https://shopify.baoea.com/liquid/objects#%E5%AF%B9%E8%B1%A1%E6%95%B0%E6%8D%AE%E8%BD%AC%E6%8D%A2)

```
<!-- 将产品数据转换为 JSON -->
{% assign product_data = "" %}
{% capture product_json %}
{
  "id": {{ product.id }},
  "title": "{{ product.title | escape }}",
  "price": {{ product.price }},
  "available": {{ product.available }},
  "images": [
    {% for image in product.images %}
      {
        "src": "{{ image | image_url: width: 400, height: 400 }}",
        "alt": "{{ image.alt | escape | default: product.title }}"
      }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ],
  "variants": [
    {% for variant in product.variants %}
      {
        "id": {{ variant.id }},
        "title": "{{ variant.title | escape }}",
        "price": {{ variant.price }},
        "available": {{ variant.available }}
      }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ]
}
{% endcapture %}
 
<script>
  window.productData = {{ product_json }};
</script>
```

## 对象调试技巧[](https://shopify.baoea.com/liquid/objects#%E5%AF%B9%E8%B1%A1%E8%B0%83%E8%AF%95%E6%8A%80%E5%B7%A7)

### 输出对象结构[](https://shopify.baoea.com/liquid/objects#%E8%BE%93%E5%87%BA%E5%AF%B9%E8%B1%A1%E7%BB%93%E6%9E%84)

```
<!-- 查看完整对象结构 -->
{% if settings.debug_mode %}
  <div class="debug-panel">
    <h4>产品对象调试</h4>
    <pre>{{ product | json }}</pre>
  </div>
{% endif %}
 
<!-- 查看特定对象的属性 -->
{% if settings.debug_mode %}
  <div class="debug-info">
    <h4>客户对象属性</h4>
    <ul>
      <li>ID: {{ customer.id }}</li>
      <li>邮箱: {{ customer.email }}</li>
      <li>名字: {{ customer.first_name }}</li>
      <li>姓氏: {{ customer.last_name }}</li>
      <li>订单数: {{ customer.orders_count }}</li>
      <li>总消费: {{ customer.total_spent | money }}</li>
      <li>标签: {{ customer.tags | join: ", " }}</li>
    </ul>
  </div>
{% endif %}
```

### 检查对象类型[](https://shopify.baoea.com/liquid/objects#%E6%A3%80%E6%9F%A5%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B)

```
<!-- 检查变量类型 -->
{% if settings.debug_mode %}
  <div class="type-info">
    <p>product.id 类型: {{ product.id.class }}</p>
    <p>product.title 类型: {{ product.title.class }}</p>
    <p>product.price 类型: {{ product.price.class }}</p>
    <p>product.available 类型: {{ product.available.class }}</p>
    <p>product.images 类型: {{ product.images.class }}</p>
  </div>
{% endif %}
```

## 性能优化技巧[](https://shopify.baoea.com/liquid/objects#%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%8A%80%E5%B7%A7)

### 避免重复对象访问[](https://shopify.baoea.com/liquid/objects#%E9%81%BF%E5%85%8D%E9%87%8D%E5%A4%8D%E5%AF%B9%E8%B1%A1%E8%AE%BF%E9%97%AE)

```
<!-- 不好的做法 -->
{% for i in (1..10) %}
  {{ collection.products.size }}  <!-- 每次都访问 -->
{% endfor %}
 
<!-- 好的做法 -->
{% assign product_count = collection.products.size %}
{% for i in (1..10) %}
  {{ product_count }}  <!-- 使用缓存的值 -->
{% endfor %}
```

### 预处理复杂对象[](https://shopify.baoea.com/liquid/objects#%E9%A2%84%E5%A4%84%E7%90%86%E5%A4%8D%E6%9D%82%E5%AF%B9%E8%B1%A1)

```
<!-- 预处理可用产品 -->
{% assign available_products = collection.products | where: 'available', true %}
 
<!-- 预计算价格范围 -->
{% assign min_price = collection.products | map: 'price' | sort | first %}
{% assign max_price = collection.products | map: 'price' | sort | last %}
 
<!-- 使用预处理的数据 -->
<div class="collection-info">
  <p>可用商品: {{ available_products.size }}</p>
  <p>价格范围: {{ min_price | money }} - {{ max_price | money }}</p>
</div>
```

## 最佳实践[](https://shopify.baoea.com/liquid/objects#%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5)

### 1\. 安全访问[](https://shopify.baoea.com/liquid/objects#1-%E5%AE%89%E5%85%A8%E8%AE%BF%E9%97%AE)

```
<!-- 始终检查对象存在性 -->
{% if product and product.featured_image %}
  <img src="{{ product.featured_image | image_url: width: 400, height: 400 }}" 
       alt="{{ product.featured_image.alt | default: product.title }}">
{% endif %}
```

### 2\. 使用有意义的变量名[](https://shopify.baoea.com/liquid/objects#2-%E4%BD%BF%E7%94%A8%E6%9C%89%E6%84%8F%E4%B9%89%E7%9A%84%E5%8F%98%E9%87%8F%E5%90%8D)

```
<!-- 好的变量命名 -->
{% assign featured_products = collection.products | where: 'featured', true %}
{% assign customer_is_vip = customer.tags contains 'vip' %}
{% assign product_has_variants = product.variants.size > 1 %}
```

### 3\. 避免深度嵌套[](https://shopify.baoea.com/liquid/objects#3-%E9%81%BF%E5%85%8D%E6%B7%B1%E5%BA%A6%E5%B5%8C%E5%A5%97)

```
<!-- 将深度嵌套分解为步骤 -->
{% assign selected_variant = product.selected_or_first_available_variant %}
{% if selected_variant %}
  {% assign variant_title = selected_variant.title %}
  {% assign variant_price = selected_variant.price %}
{% endif %}
```

## 下一步学习[](https://shopify.baoea.com/liquid/objects#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

掌握对象和属性后，建议继续学习：

1.  [运算符和表达式](https://shopify.baoea.com/liquid/operators) - 学习对象比较和操作
2.  [Shopify 对象参考](https://shopify.baoea.com/liquid/shopify-objects) - 了解所有可用对象
3.  [高级 Liquid 技巧](https://shopify.baoea.com/liquid/advanced-liquid) - 进阶对象操作
4.  [性能优化](https://shopify.baoea.com/liquid/performance-optimization) - 对象使用优化

理解对象系统是掌握 Liquid 的关键，它为动态内容提供了强大的数据访问能力！
