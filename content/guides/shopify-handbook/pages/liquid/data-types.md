---
source_url: "https://shopify.baoea.com/liquid/data-types"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:45"
fetch_method: "http"
content_hash: "90b0a1a9fc148e8e672024ec494288f05c560a5826f4a611e4e80e37632cca87"
discovered_via: ["sitemap", "internal_link"]
---
## 数据类型详解

Liquid 支持多种数据类型，每种类型都有特定的用法和特性。深入理解这些数据类型对于编写高效的 Liquid 代码至关重要。

## 字符串 (String)[](https://shopify.baoea.com/liquid/data-types#%E5%AD%97%E7%AC%A6%E4%B8%B2-string)

### 字符串字面量[](https://shopify.baoea.com/liquid/data-types#%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AD%97%E9%9D%A2%E9%87%8F)

```
<!-- 双引号字符串 -->
{% assign message = "Hello, World!" %}
{% assign product_name = "iPhone 15 Pro" %}
 
<!-- 单引号字符串 -->
{% assign description = 'This is a great product' %}
{% assign note = 'Customer\'s favorite item' %}
 
<!-- 空字符串 -->
{% assign empty_string = "" %}
{% assign blank_value = '' %}
```

### 字符串包含特殊字符[](https://shopify.baoea.com/liquid/data-types#%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%8C%85%E5%90%AB%E7%89%B9%E6%AE%8A%E5%AD%97%E7%AC%A6)

```
<!-- 包含引号的字符串 -->
{% assign quote_text = 'He said "Hello" to everyone' %}
{% assign apostrophe_text = "It's a beautiful day" %}
 
<!-- 包含换行符的字符串 -->
{% assign multiline = "第一行
第二行
第三行" %}
 
<!-- 包含变量的字符串 -->
{% assign welcome = "欢迎, " | append: customer.first_name | append: "!" %}
```

### 字符串操作[](https://shopify.baoea.com/liquid/data-types#%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%93%8D%E4%BD%9C)

```
<!-- 字符串连接 -->
{% assign full_name = customer.first_name | append: " " | append: customer.last_name %}
{% assign product_url = "/products/" | append: product.handle %}
 
<!-- 字符串转换 -->
{% assign upper_title = product.title | upcase %}
{% assign lower_title = product.title | downcase %}
{% assign capitalized = product.title | capitalize %}
 
<!-- 字符串处理 -->
{% assign clean_title = product.title | strip %}
{% assign short_desc = product.description | truncate: 100 %}
{% assign no_html = product.description | strip_html %}
```

### 字符串检查[](https://shopify.baoea.com/liquid/data-types#%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%A3%80%E6%9F%A5)

```
<!-- 检查字符串是否为空 -->
{% if product.description != blank %}
  <p>{{ product.description }}</p>
{% endif %}
 
<!-- 检查字符串包含 -->
{% if product.title contains "iPhone" %}
  <span class="apple-badge">Apple 产品</span>
{% endif %}
 
<!-- 字符串比较 -->
{% if product.vendor == "Apple" %}
  <div class="apple-section">Apple 官方产品</div>
{% endif %}
```

## 数字 (Number)[](https://shopify.baoea.com/liquid/data-types#%E6%95%B0%E5%AD%97-number)

### 整数[](https://shopify.baoea.com/liquid/data-types#%E6%95%B4%E6%95%B0)

```
<!-- 正整数 -->
{% assign quantity = 5 %}
{% assign max_items = 100 %}
 
<!-- 负整数 -->
{% assign discount = -10 %}
{% assign adjustment = -500 %}
 
<!-- 零 -->
{% assign starting_point = 0 %}
```

### 浮点数[](https://shopify.baoea.com/liquid/data-types#%E6%B5%AE%E7%82%B9%E6%95%B0)

```
<!-- 小数 -->
{% assign price = 99.99 %}
{% assign tax_rate = 0.08 %}
{% assign discount_rate = 0.15 %}
 
<!-- 科学计数法 -->
{% assign large_number = 1.5e6 %}
```

### 数字运算[](https://shopify.baoea.com/liquid/data-types#%E6%95%B0%E5%AD%97%E8%BF%90%E7%AE%97)

```
<!-- 基本运算 -->
{% assign total_price = product.price | plus: shipping_cost %}
{% assign discounted_price = product.price | minus: discount_amount %}
{% assign bulk_price = product.price | times: quantity %}
{% assign unit_price = total_cost | divided_by: quantity %}
 
<!-- 高级运算 -->
{% assign remainder = total_items | modulo: items_per_page %}
{% assign rounded_price = calculated_price | round: 2 %}
{% assign ceiling_value = price_per_unit | ceil %}
{% assign floor_value = price_per_unit | floor %}
 
<!-- 绝对值 -->
{% assign absolute_value = negative_number | abs %}
```

### 数字比较[](https://shopify.baoea.com/liquid/data-types#%E6%95%B0%E5%AD%97%E6%AF%94%E8%BE%83)

```
<!-- 大小比较 -->
{% if product.price > 10000 %}
  <span class="high-price">高价商品</span>
{% elsif product.price < 1000 %}
  <span class="low-price">特惠商品</span>
{% endif %}
 
<!-- 等于比较 -->
{% if cart.item_count == 0 %}
  <p>购物车为空</p>
{% endif %}
 
<!-- 范围检查 -->
{% if product.price >= 5000 and product.price <= 15000 %}
  <span class="mid-range">中档商品</span>
{% endif %}
```

### 数字格式化[](https://shopify.baoea.com/liquid/data-types#%E6%95%B0%E5%AD%97%E6%A0%BC%E5%BC%8F%E5%8C%96)

```
<!-- 货币格式 -->
{{ product.price | money }}
{{ product.price | money_without_currency }}
{{ product.price | money_with_currency }}
 
<!-- 数字格式 -->
{{ large_number | number_with_delimiter }}
{{ percentage | number_to_percentage }}
{{ file_size | number_to_human_size }}
```

## 布尔值 (Boolean)[](https://shopify.baoea.com/liquid/data-types#%E5%B8%83%E5%B0%94%E5%80%BC-boolean)

### 布尔字面量[](https://shopify.baoea.com/liquid/data-types#%E5%B8%83%E5%B0%94%E5%AD%97%E9%9D%A2%E9%87%8F)

```
<!-- true 值 -->
{% assign is_available = true %}
{% assign show_price = true %}
 
<!-- false 值 -->
{% assign is_hidden = false %}
{% assign hide_description = false %}
```

### 布尔表达式[](https://shopify.baoea.com/liquid/data-types#%E5%B8%83%E5%B0%94%E8%A1%A8%E8%BE%BE%E5%BC%8F)

```
<!-- 比较结果 -->
{% assign is_expensive = product.price > 10000 %}
{% assign has_discount = product.compare_at_price > product.price %}
{% assign is_new_customer = customer.orders_count == 0 %}
 
<!-- 存在性检查 -->
{% assign has_image = product.featured_image != blank %}
{% assign has_description = product.description != blank %}
{% assign is_logged_in = customer != blank %}
```

### 布尔运算[](https://shopify.baoea.com/liquid/data-types#%E5%B8%83%E5%B0%94%E8%BF%90%E7%AE%97)

```
<!-- AND 运算 -->
{% assign show_add_to_cart = product.available and customer %}
{% assign eligible_for_discount = is_member and order_total > 5000 %}
 
<!-- OR 运算 -->
{% assign show_badge = product.featured or product.bestseller %}
{% assign can_view = is_admin or is_owner %}
 
<!-- NOT 运算 (使用 unless) -->
{% unless product.available %}
  <span class="out-of-stock">缺货</span>
{% endunless %}
```

### 真值和假值[](https://shopify.baoea.com/liquid/data-types#%E7%9C%9F%E5%80%BC%E5%92%8C%E5%81%87%E5%80%BC)

```
<!-- Liquid 中的假值 -->
<!-- false, nil, empty, blank -->
 
<!-- 检查假值 -->
{% if customer %}
  <!-- customer 存在 -->
{% else %}
  <!-- customer 为 nil -->
{% endif %}
 
<!-- 检查空值 -->
{% if product.description != blank %}
  <!-- 描述不为空 -->
{% endif %}
 
<!-- 检查存在性 -->
{% if product.images.size > 0 %}
  <!-- 有图片 -->
{% endif %}
```

## 数组 (Array)[](https://shopify.baoea.com/liquid/data-types#%E6%95%B0%E7%BB%84-array)

### 数组访问[](https://shopify.baoea.com/liquid/data-types#%E6%95%B0%E7%BB%84%E8%AE%BF%E9%97%AE)

```
<!-- 索引访问 -->
{% assign first_image = product.images[0] %}
{% assign second_image = product.images[1] %}
{% assign last_image = product.images[-1] %}
 
<!-- 数组方法 -->
{% assign first_product = collection.products.first %}
{% assign last_product = collection.products.last %}
{% assign product_count = collection.products.size %}
```

### 数组遍历[](https://shopify.baoea.com/liquid/data-types#%E6%95%B0%E7%BB%84%E9%81%8D%E5%8E%86)

```
<!-- 基本遍历 -->
{% for image in product.images %}
  <img src="{{ image | image_url: width: 300, height: 300 }}" alt="{{ image.alt }}">
{% endfor %}
 
<!-- 带索引遍历 -->
{% for tag in product.tags %}
  <span class="tag tag-{{ forloop.index }}">{{ tag }}</span>
{% endfor %}
 
<!-- 限制数量遍历 -->
{% for product in collection.products limit: 4 %}
  {% render 'product-card', product: product %}
{% endfor %}
```

### 数组操作[](https://shopify.baoea.com/liquid/data-types#%E6%95%B0%E7%BB%84%E6%93%8D%E4%BD%9C)

```
<!-- 过滤数组 -->
{% assign available_products = collection.products | where: 'available', true %}
{% assign featured_products = collection.products | where: 'tags', 'featured' %}
 
<!-- 排序数组 -->
{% assign sorted_products = collection.products | sort: 'title' %}
{% assign price_sorted = collection.products | sort: 'price' %}
 
<!-- 数组转换 -->
{% assign product_titles = collection.products | map: 'title' %}
{% assign unique_vendors = collection.products | map: 'vendor' | uniq %}
 
<!-- 数组连接 -->
{% assign tag_string = product.tags | join: ', ' %}
{% assign breadcrumbs = breadcrumb_items | join: ' > ' %}
```

### 数组创建[](https://shopify.baoea.com/liquid/data-types#%E6%95%B0%E7%BB%84%E5%88%9B%E5%BB%BA)

```
<!-- 从字符串创建数组 -->
{% assign color_options = "红色,蓝色,绿色,黄色" | split: ',' %}
{% assign size_options = "S,M,L,XL" | split: ',' %}
 
<!-- 空数组检查 -->
{% if product.images.size == 0 %}
  <div class="no-images">暂无图片</div>
{% endif %}
 
<!-- 数组合并 (通过循环) -->
{% assign all_tags = "" %}
{% for product in collection.products %}
  {% for tag in product.tags %}
    {% unless all_tags contains tag %}
      {% if all_tags == "" %}
        {% assign all_tags = tag %}
      {% else %}
        {% assign all_tags = all_tags | append: "," | append: tag %}
      {% endif %}
    {% endunless %}
  {% endfor %}
{% endfor %}
{% assign unique_tags = all_tags | split: "," %}
```

## 对象 (Object)[](https://shopify.baoea.com/liquid/data-types#%E5%AF%B9%E8%B1%A1-object)

### 对象属性访问[](https://shopify.baoea.com/liquid/data-types#%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7%E8%AE%BF%E9%97%AE)

```
<!-- 点号访问 -->
{{ product.title }}
{{ customer.first_name }}
{{ order.created_at }}
 
<!-- 方括号访问 -->
{{ product['title'] }}
{{ customer['first_name'] }}
{{ order['created_at'] }}
 
<!-- 动态属性访问 -->
{% assign property_name = 'title' %}
{{ product[property_name] }}
```

### 嵌套对象[](https://shopify.baoea.com/liquid/data-types#%E5%B5%8C%E5%A5%97%E5%AF%B9%E8%B1%A1)

```
<!-- 深层访问 -->
{{ product.selected_or_first_available_variant.title }}
{{ customer.default_address.city }}
{{ order.shipping_address.country }}
 
<!-- 安全访问 -->
{% if product.featured_image %}
  {{ product.featured_image.alt }}
{% endif %}
 
<!-- 链式访问 -->
{{ blog.articles.first.author }}
{{ cart.items.last.product.vendor }}
```

### 对象方法[](https://shopify.baoea.com/liquid/data-types#%E5%AF%B9%E8%B1%A1%E6%96%B9%E6%B3%95)

```
<!-- 集合方法 -->
{{ collection.products.size }}
{{ product.images.first }}
{{ customer.orders.last }}
 
<!-- 字符串方法 -->
{{ product.title.size }}
{{ customer.email.downcase }}
 
<!-- 数组方法 -->
{{ product.tags.first }}
{{ product.variants.last }}
```

### 对象检查[](https://shopify.baoea.com/liquid/data-types#%E5%AF%B9%E8%B1%A1%E6%A3%80%E6%9F%A5)

```
<!-- 检查对象存在 -->
{% if customer %}
  <p>已登录: {{ customer.email }}</p>
{% endif %}
 
<!-- 检查属性存在 -->
{% if product.description %}
  <div class="description">{{ product.description }}</div>
{% endif %}
 
<!-- 检查对象类型 -->
{% if template contains 'product' %}
  <!-- 在产品页面 -->
{% elsif template contains 'collection' %}
  <!-- 在集合页面 -->
{% endif %}
```

## nil 和 empty[](https://shopify.baoea.com/liquid/data-types#nil-%E5%92%8C-empty)

### nil 值[](https://shopify.baoea.com/liquid/data-types#nil-%E5%80%BC)

```
<!-- nil 表示不存在 -->
{% if customer == nil %}
  <p>用户未登录</p>
{% endif %}
 
<!-- 等同于 -->
{% unless customer %}
  <p>用户未登录</p>
{% endunless %}
 
<!-- 检查属性是否为 nil -->
{% if product.featured_image == nil %}
  <div class="no-image-placeholder"></div>
{% endif %}
```

### empty 和 blank[](https://shopify.baoea.com/liquid/data-types#empty-%E5%92%8C-blank)

```
<!-- empty: 数组为空 -->
{% if product.images == empty %}
  <p>没有产品图片</p>
{% endif %}
 
<!-- blank: 字符串为空或只有空白 -->
{% if product.description == blank %}
  <p>暂无产品描述</p>
{% endif %}
 
<!-- 区别示例 -->
{% assign empty_array = "" | split: "," %}
{% assign blank_string = "   " %}
 
{% if empty_array == empty %}
  <!-- true: 数组为空 -->
{% endif %}
 
{% if blank_string == blank %}
  <!-- true: 字符串为空白 -->
{% endif %}
```

## 数据类型转换[](https://shopify.baoea.com/liquid/data-types#%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2)

### 隐式转换[](https://shopify.baoea.com/liquid/data-types#%E9%9A%90%E5%BC%8F%E8%BD%AC%E6%8D%A2)

```
<!-- 字符串到数字 -->
{% assign string_number = "123" %}
{% assign result = string_number | plus: 10 %}
<!-- result 为 133 -->
 
<!-- 数字到字符串 -->
{% assign number = 456 %}
{% assign text = "Product " | append: number %}
<!-- text 为 "Product 456" -->
```

### 显式转换[](https://shopify.baoea.com/liquid/data-types#%E6%98%BE%E5%BC%8F%E8%BD%AC%E6%8D%A2)

```
<!-- 强制转换为数字 -->
{% assign price_string = "99.99" %}
{% assign price_number = price_string | plus: 0 %}
 
<!-- 强制转换为字符串 -->
{% assign number = 123 %}
{% assign number_string = number | append: "" %}
 
<!-- 布尔值转换 -->
{% assign is_true = "true" %}
{% if is_true == "true" %}
  <!-- 字符串比较 -->
{% endif %}
```

## 类型检查技巧[](https://shopify.baoea.com/liquid/data-types#%E7%B1%BB%E5%9E%8B%E6%A3%80%E6%9F%A5%E6%8A%80%E5%B7%A7)

### 判断数据类型[](https://shopify.baoea.com/liquid/data-types#%E5%88%A4%E6%96%AD%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B)

```
<!-- 检查是否为数字 -->
{% assign test_value = "123" %}
{% assign is_number = test_value | plus: 0 %}
{% if is_number != 0 or test_value == "0" %}
  <!-- 是数字 -->
{% endif %}
 
<!-- 检查是否为数组 -->
{% if product.images.size %}
  <!-- product.images 是数组 -->
{% endif %}
 
<!-- 检查是否为字符串 -->
{% if product.title.size %}
  <!-- product.title 是字符串 -->
{% endif %}
```

### 调试数据类型[](https://shopify.baoea.com/liquid/data-types#%E8%B0%83%E8%AF%95%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B)

```
<!-- 输出变量信息 -->
{% if settings.debug_mode %}
  <div class="debug-info">
    <h4>变量调试</h4>
    <p>product.price: {{ product.price }} ({{ product.price.class }})</p>
    <p>product.title: {{ product.title }} ({{ product.title.class }})</p>
    <p>product.available: {{ product.available }} ({{ product.available.class }})</p>
    <p>product.images: {{ product.images.size }} items</p>
    
    <!-- JSON 输出 -->
    <pre>{{ product | json }}</pre>
  </div>
{% endif %}
```

## 复杂数据类型示例[](https://shopify.baoea.com/liquid/data-types#%E5%A4%8D%E6%9D%82%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B%E7%A4%BA%E4%BE%8B)

### 购物车数据处理[](https://shopify.baoea.com/liquid/data-types#%E8%B4%AD%E7%89%A9%E8%BD%A6%E6%95%B0%E6%8D%AE%E5%A4%84%E7%90%86)

```
<!-- 复杂的购物车分析 -->
{% assign total_items = 0 %}
{% assign total_value = 0 %}
{% assign unique_vendors = "" %}
{% assign product_types = "" %}
 
{% for item in cart.items %}
  <!-- 数量统计 (数字) -->
  {% assign total_items = total_items | plus: item.quantity %}
  
  <!-- 价值计算 (数字) -->
  {% assign line_total = item.quantity | times: item.price %}
  {% assign total_value = total_value | plus: line_total %}
  
  <!-- 供应商收集 (字符串数组) -->
  {% unless unique_vendors contains item.vendor %}
    {% if unique_vendors == "" %}
      {% assign unique_vendors = item.vendor %}
    {% else %}
      {% assign unique_vendors = unique_vendors | append: "," | append: item.vendor %}
    {% endif %}
  {% endunless %}
  
  <!-- 产品类型统计 (字符串处理) -->
  {% unless product_types contains item.product.type %}
    {% if product_types == "" %}
      {% assign product_types = item.product.type %}
    {% else %}
      {% assign product_types = product_types | append: "," | append: item.product.type %}
    {% endif %}
  {% endunless %}
{% endfor %}
 
<!-- 结果显示 -->
<div class="cart-analysis">
  <p>总商品数: {{ total_items }}</p>
  <p>总价值: {{ total_value | money }}</p>
  <p>供应商数: {{ unique_vendors | split: "," | size }}</p>
  <p>产品类型: {{ product_types | split: "," | join: ", " }}</p>
</div>
```

## 最佳实践[](https://shopify.baoea.com/liquid/data-types#%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5)

### 1\. 类型安全[](https://shopify.baoea.com/liquid/data-types#1-%E7%B1%BB%E5%9E%8B%E5%AE%89%E5%85%A8)

```
<!-- 安全的数字操作 -->
{% if product.price and product.price > 0 %}
  {% assign discounted_price = product.price | times: 0.9 %}
{% endif %}
 
<!-- 安全的字符串操作 -->
{% if product.title and product.title != blank %}
  {% assign url_slug = product.title | handleize %}
{% endif %}
 
<!-- 安全的数组操作 -->
{% if product.images and product.images.size > 0 %}
  {% assign first_image = product.images[0] %}
{% endif %}
```

### 2\. 性能考虑[](https://shopify.baoea.com/liquid/data-types#2-%E6%80%A7%E8%83%BD%E8%80%83%E8%99%91)

```
<!-- 缓存复杂计算 -->
{% assign is_sale_item = product.compare_at_price > product.price %}
{% assign has_multiple_variants = product.variants.size > 1 %}
 
{% if is_sale_item and has_multiple_variants %}
  <!-- 使用缓存的布尔值 -->
{% endif %}
```

### 3\. 可读性[](https://shopify.baoea.com/liquid/data-types#3-%E5%8F%AF%E8%AF%BB%E6%80%A7)

```
<!-- 使用有意义的变量名 -->
{% assign customer_is_vip = customer.tags contains 'vip' %}
{% assign product_is_available = product.available %}
{% assign order_qualifies_for_free_shipping = order.total_price > 50000 %}
```

## 下一步学习[](https://shopify.baoea.com/liquid/data-types#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

了解数据类型后，建议继续学习：

1.  [对象和属性](https://shopify.baoea.com/liquid/objects) - 深入了解对象系统
2.  [运算符和表达式](https://shopify.baoea.com/liquid/operators) - 学习操作符使用
3.  [过滤器完全指南](https://shopify.baoea.com/liquid/filters) - 掌握数据转换
4.  [Shopify 对象参考](https://shopify.baoea.com/liquid/shopify-objects) - 了解特定对象

掌握数据类型是编写高效 Liquid 代码的基础，它们是所有高级功能的基石！
