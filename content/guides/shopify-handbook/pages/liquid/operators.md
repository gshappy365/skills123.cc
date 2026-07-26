---
source_url: "https://shopify.baoea.com/liquid/operators"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:54"
fetch_method: "http"
content_hash: "d69abd2938d6ae8264e88391984927f3fdc24dff857f017641bc09262636f89a"
discovered_via: ["sitemap", "internal_link"]
---
## 运算符和表达式

Liquid 提供了丰富的运算符来创建复杂的表达式和逻辑。掌握这些运算符对于编写强大的模板逻辑至关重要。

## 比较运算符[](https://shopify.baoea.com/liquid/operators#%E6%AF%94%E8%BE%83%E8%BF%90%E7%AE%97%E7%AC%A6)

### 相等比较[](https://shopify.baoea.com/liquid/operators#%E7%9B%B8%E7%AD%89%E6%AF%94%E8%BE%83)

```
<!-- 等于 (==) -->
{% if product.price == 9999 %}
  <span class="special-price">特价商品</span>
{% endif %}
 
{% if customer.email == "admin@example.com" %}
  <div class="admin-panel">管理员面板</div>
{% endif %}
 
{% if product.vendor == "Apple" %}
  <span class="apple-badge">Apple 官方</span>
{% endif %}
 
<!-- 不等于 (!=, <>) -->
{% if product.price != 0 %}
  <span class="price">{{ product.price | money }}</span>
{% endif %}
 
{% if customer.email != blank %}
  <p>已登录用户: {{ customer.email }}</p>
{% endif %}
 
{% if product.description <> blank %}
  <div class="description">{{ product.description }}</div>
{% endif %}
```

### 大小比较[](https://shopify.baoea.com/liquid/operators#%E5%A4%A7%E5%B0%8F%E6%AF%94%E8%BE%83)

```
<!-- 大于 (>) -->
{% if product.price > 10000 %}
  <span class="high-price">高价商品</span>
{% endif %}
 
{% if cart.item_count > 5 %}
  <div class="bulk-order">批量订单</div>
{% endif %}
 
<!-- 大于等于 (>=) -->
{% if customer.orders_count >= 10 %}
  <span class="loyal-customer">忠实客户</span>
{% endif %}
 
{% if product.inventory_quantity >= 100 %}
  <span class="in-stock">库存充足</span>
{% endif %}
 
<!-- 小于 (<) -->
{% if product.price < 5000 %}
  <span class="budget-friendly">经济实惠</span>
{% endif %}
 
{% if cart.total_price < 50000 %}
  <div class="shipping-notice">
    还需购买 {{ 50000 | minus: cart.total_price | money }} 即可免费配送
  </div>
{% endif %}
 
<!-- 小于等于 (<=) -->
{% if product.inventory_quantity <= 5 %}
  <span class="low-stock">库存不足</span>
{% endif %}
 
{% if forloop.index <= 3 %}
  <div class="featured-item">热门商品 #{{ forloop.index }}</div>
{% endif %}
```

### 包含比较[](https://shopify.baoea.com/liquid/operators#%E5%8C%85%E5%90%AB%E6%AF%94%E8%BE%83)

```
<!-- contains 运算符 -->
{% if product.title contains "iPhone" %}
  <span class="apple-product">Apple 产品</span>
{% endif %}
 
{% if product.tags contains "sale" %}
  <div class="sale-badge">促销</div>
{% endif %}
 
{% if customer.tags contains "vip" %}
  <div class="vip-section">VIP 专享</div>
{% endif %}
 
<!-- 集合包含检查 -->
{% assign featured_tags = "featured,bestseller,hot" | split: "," %}
{% assign has_featured_tag = false %}
{% for tag in product.tags %}
  {% if featured_tags contains tag %}
    {% assign has_featured_tag = true %}
    {% break %}
  {% endif %}
{% endfor %}
 
{% if has_featured_tag %}
  <span class="featured-badge">精选商品</span>
{% endif %}
```

## 逻辑运算符[](https://shopify.baoea.com/liquid/operators#%E9%80%BB%E8%BE%91%E8%BF%90%E7%AE%97%E7%AC%A6)

### AND 运算符[](https://shopify.baoea.com/liquid/operators#and-%E8%BF%90%E7%AE%97%E7%AC%A6)

```
<!-- 基本 AND 操作 -->
{% if product.available and product.price < 10000 %}
  <button class="add-to-cart affordable">立即购买</button>
{% endif %}
 
{% if customer and customer.tags contains "vip" %}
  <div class="vip-discount">VIP 专享折扣</div>
{% endif %}
 
<!-- 多条件 AND -->
{% if product.available and product.price > 0 and product.inventory_quantity > 0 %}
  <div class="purchase-options">
    <button type="submit">加入购物车</button>
  </div>
{% endif %}
 
<!-- 复杂 AND 表达式 -->
{% if customer 
   and customer.orders_count > 0 
   and customer.total_spent > 100000 
   and customer.tags contains "premium" %}
  <div class="premium-benefits">
    <h3>尊享会员特权</h3>
    <ul>
      <li>免费配送</li>
      <li>优先客服</li>
      <li>专属折扣</li>
    </ul>
  </div>
{% endif %}
```

### OR 运算符[](https://shopify.baoea.com/liquid/operators#or-%E8%BF%90%E7%AE%97%E7%AC%A6)

```
<!-- 基本 OR 操作 -->
{% if product.tags contains "featured" or product.tags contains "bestseller" %}
  <span class="highlight-badge">推荐商品</span>
{% endif %}
 
{% if customer.tags contains "vip" or customer.total_spent > 50000 %}
  <div class="premium-access">高级会员权限</div>
{% endif %}
 
<!-- 多条件 OR -->
{% if product.type == "Electronics" 
   or product.type == "Computers" 
   or product.vendor == "Apple" %}
  <div class="tech-category">科技产品</div>
{% endif %}
 
<!-- 组合 OR 条件 -->
{% if (product.tags contains "sale" or product.compare_at_price > product.price)
   or (customer.tags contains "member" and cart.total_price > 30000) %}
  <div class="discount-eligible">享受折扣</div>
{% endif %}
```

### NOT 运算符[](https://shopify.baoea.com/liquid/operators#not-%E8%BF%90%E7%AE%97%E7%AC%A6)

```
<!-- 使用 unless (相当于 NOT) -->
{% unless product.available %}
  <div class="out-of-stock">
    <p>商品暂时缺货</p>
    <button class="notify-me">到货通知</button>
  </div>
{% endunless %}
 
<!-- 使用 != 或 <> -->
{% if product.vendor != "Generic" %}
  <span class="brand-name">{{ product.vendor }}</span>
{% endif %}
 
<!-- 复杂 NOT 表达式 -->
{% unless customer and customer.tags contains "blocked" %}
  <div class="add-to-cart-section">
    <!-- 购买选项 -->
  </div>
{% endunless %}
```

## 数学运算符[](https://shopify.baoea.com/liquid/operators#%E6%95%B0%E5%AD%A6%E8%BF%90%E7%AE%97%E7%AC%A6)

### 基本数学运算[](https://shopify.baoea.com/liquid/operators#%E5%9F%BA%E6%9C%AC%E6%95%B0%E5%AD%A6%E8%BF%90%E7%AE%97)

```
<!-- 加法 (+) - 通过过滤器实现 -->
{% assign total_price = product.price | plus: shipping_cost %}
{% assign final_quantity = current_stock | plus: incoming_stock %}
 
<!-- 减法 (-) -->
{% assign discount_amount = product.compare_at_price | minus: product.price %}
{% assign remaining_stock = total_inventory | minus: sold_quantity %}
 
<!-- 乘法 (*) -->
{% assign line_total = item.quantity | times: item.price %}
{% assign bulk_discount = order_total | times: 0.1 %}
 
<!-- 除法 (/) -->
{% assign average_price = total_value | divided_by: item_count %}
{% assign price_per_unit = bulk_price | divided_by: package_size %}
 
<!-- 取模 (%) -->
{% assign remainder = total_items | modulo: items_per_page %}
{% assign is_even = forloop.index | modulo: 2 %}
```

### 数学运算应用示例[](https://shopify.baoea.com/liquid/operators#%E6%95%B0%E5%AD%A6%E8%BF%90%E7%AE%97%E5%BA%94%E7%94%A8%E7%A4%BA%E4%BE%8B)

```
<!-- 计算折扣百分比 -->
{% if product.compare_at_price > product.price %}
  {% assign savings = product.compare_at_price | minus: product.price %}
  {% assign savings_percent = savings | times: 100 | divided_by: product.compare_at_price | round %}
  
  <div class="sale-info">
    <span class="original-price">{{ product.compare_at_price | money }}</span>
    <span class="sale-price">{{ product.price | money }}</span>
    <span class="savings">节省 {{ savings_percent }}%</span>
  </div>
{% endif %}
 
<!-- 计算购物车统计 -->
{% assign subtotal = 0 %}
{% assign total_weight = 0 %}
{% assign item_count = 0 %}
 
{% for item in cart.items %}
  {% assign line_total = item.quantity | times: item.price %}
  {% assign subtotal = subtotal | plus: line_total %}
  {% assign line_weight = item.quantity | times: item.variant.weight %}
  {% assign total_weight = total_weight | plus: line_weight %}
  {% assign item_count = item_count | plus: item.quantity %}
{% endfor %}
 
<div class="cart-summary">
  <p>商品数量: {{ item_count }}</p>
  <p>总重量: {{ total_weight }}g</p>
  <p>小计: {{ subtotal | money }}</p>
  <p>平均单价: {{ subtotal | divided_by: item_count | money }}</p>
</div>
```

### 高级数学运算[](https://shopify.baoea.com/liquid/operators#%E9%AB%98%E7%BA%A7%E6%95%B0%E5%AD%A6%E8%BF%90%E7%AE%97)

```
<!-- 四舍五入 -->
{% assign rounded_price = calculated_price | round %}
{% assign precise_price = calculated_price | round: 2 %}
 
<!-- 向上取整 -->
{% assign pages_needed = total_items | divided_by: items_per_page | ceil %}
 
<!-- 向下取整 -->
{% assign complete_sets = available_quantity | divided_by: set_size | floor %}
 
<!-- 绝对值 -->
{% assign price_difference = new_price | minus: old_price | abs %}
 
<!-- 最大值和最小值 -->
{% assign max_quantity = variant.inventory_quantity | at_most: 10 %}
{% assign min_order = 1 | at_least: minimum_order_quantity %}
```

## 字符串运算符[](https://shopify.baoea.com/liquid/operators#%E5%AD%97%E7%AC%A6%E4%B8%B2%E8%BF%90%E7%AE%97%E7%AC%A6)

### 字符串比较[](https://shopify.baoea.com/liquid/operators#%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%AF%94%E8%BE%83)

```
<!-- 字符串相等比较 -->
{% if product.type == "Electronics" %}
  <span class="category-electronics">电子产品</span>
{% endif %}
 
<!-- 字符串不等比较 -->
{% if product.handle != "default-product" %}
  <a href="{{ product.url }}">{{ product.title }}</a>
{% endif %}
 
<!-- 字符串包含 -->
{% if product.title contains "Pro" %}
  <span class="pro-model">专业版</span>
{% endif %}
 
<!-- 忽略大小写比较 -->
{% assign lower_title = product.title | downcase %}
{% if lower_title contains "iphone" %}
  <span class="iphone-product">iPhone 产品</span>
{% endif %}
```

### 字符串操作[](https://shopify.baoea.com/liquid/operators#%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%93%8D%E4%BD%9C)

```
<!-- 字符串连接 -->
{% assign full_name = customer.first_name | append: " " | append: customer.last_name %}
{% assign product_url = "/products/" | append: product.handle %}
 
<!-- 字符串长度比较 -->
{% if product.title.size > 30 %}
  <h3 title="{{ product.title }}">{{ product.title | truncate: 30 }}</h3>
{% else %}
  <h3>{{ product.title }}</h3>
{% endif %}
 
<!-- 字符串空值检查 -->
{% if product.description != blank %}
  <div class="description">{{ product.description }}</div>
{% endif %}
```

## 复杂表达式[](https://shopify.baoea.com/liquid/operators#%E5%A4%8D%E6%9D%82%E8%A1%A8%E8%BE%BE%E5%BC%8F)

### 括号分组[](https://shopify.baoea.com/liquid/operators#%E6%8B%AC%E5%8F%B7%E5%88%86%E7%BB%84)

```
<!-- 使用括号控制运算顺序 -->
{% if (product.available and product.price < 10000) or (customer.tags contains "vip") %}
  <button class="special-offer">特别优惠</button>
{% endif %}
 
<!-- 复杂的条件分组 -->
{% if (product.type == "Electronics" or product.type == "Computers") 
   and (product.vendor == "Apple" or product.vendor == "Samsung") 
   and product.available %}
  <div class="premium-tech">高端科技产品</div>
{% endif %}
 
<!-- 嵌套条件 -->
{% if customer %}
  {% if (customer.orders_count > 5 and customer.total_spent > 100000) 
     or customer.tags contains "vip" %}
    <div class="loyalty-rewards">忠诚度奖励</div>
  {% endif %}
{% endif %}
```

### 条件链[](https://shopify.baoea.com/liquid/operators#%E6%9D%A1%E4%BB%B6%E9%93%BE)

```
<!-- 多重条件判断 -->
{% if product.price > 50000 %}
  {% assign price_category = "premium" %}
{% elsif product.price > 20000 %}
  {% assign price_category = "mid-range" %}
{% elsif product.price > 5000 %}
  {% assign price_category = "affordable" %}
{% else %}
  {% assign price_category = "budget" %}
{% endif %}
 
<div class="product-card {{ price_category }}">
  <!-- 产品内容 -->
</div>
```

### 表达式求值[](https://shopify.baoea.com/liquid/operators#%E8%A1%A8%E8%BE%BE%E5%BC%8F%E6%B1%82%E5%80%BC)

```
<!-- 复杂的业务逻辑表达式 -->
{% assign is_eligible_for_free_shipping = 
  cart.total_price > 50000 
  or customer.tags contains "premium" 
  or (cart.total_weight < 2000 and customer.orders_count > 10) %}
 
{% assign show_quantity_discount = 
  product.available 
  and product.variants.size > 1 
  and customer
  and (customer.tags contains "wholesale" or cart.item_count > 10) %}
 
{% assign applies_rush_processing = 
  order.created_at > yesterday 
  and order.financial_status == "paid" 
  and (order.shipping_address.country == "CN" or customer.tags contains "priority") %}
```

## 运算符优先级[](https://shopify.baoea.com/liquid/operators#%E8%BF%90%E7%AE%97%E7%AC%A6%E4%BC%98%E5%85%88%E7%BA%A7)

### 优先级顺序[](https://shopify.baoea.com/liquid/operators#%E4%BC%98%E5%85%88%E7%BA%A7%E9%A1%BA%E5%BA%8F)

```
<!-- 运算符优先级 (从高到低) -->
<!-- 1. 括号 () -->
<!-- 2. 一元运算符 (not, unless) -->
<!-- 3. 乘法、除法、取模 (*, /, %) -->
<!-- 4. 加法、减法 (+, -) -->
<!-- 5. 比较运算符 (<, <=, >, >=) -->
<!-- 6. 相等运算符 (==, !=, <>) -->
<!-- 7. 逻辑 AND (and) -->
<!-- 8. 逻辑 OR (or) -->
 
<!-- 示例：理解优先级 -->
{% if product.price > 1000 and product.available or customer.tags contains "vip" %}
  <!-- 等同于: (product.price > 1000 and product.available) or (customer.tags contains "vip") -->
{% endif %}
 
<!-- 使用括号明确优先级 -->
{% if product.price > 1000 and (product.available or customer.tags contains "vip") %}
  <!-- 明确的逻辑: price > 1000 AND (available OR vip) -->
{% endif %}
```

## 类型转换在表达式中[](https://shopify.baoea.com/liquid/operators#%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2%E5%9C%A8%E8%A1%A8%E8%BE%BE%E5%BC%8F%E4%B8%AD)

### 自动类型转换[](https://shopify.baoea.com/liquid/operators#%E8%87%AA%E5%8A%A8%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2)

```
<!-- 字符串到数字的自动转换 -->
{% assign string_price = "99.99" %}
{% if string_price > 50 %}
  <!-- 字符串自动转换为数字进行比较 -->
  <span class="expensive">价格较高</span>
{% endif %}
 
<!-- 数字到字符串的转换 -->
{% assign number = 123 %}
{% assign text = "Product " | append: number %}
<!-- 结果: "Product 123" -->
 
<!-- 布尔值在条件中的使用 -->
{% assign is_featured = product.tags contains "featured" %}
{% if is_featured %}
  <span class="featured-badge">精选</span>
{% endif %}
```

### 显式类型转换[](https://shopify.baoea.com/liquid/operators#%E6%98%BE%E5%BC%8F%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2)

```
<!-- 强制数字转换 -->
{% assign price_string = "99.99" %}
{% assign price_number = price_string | plus: 0 %}
 
<!-- 强制字符串转换 -->
{% assign number = 123 %}
{% assign number_string = number | append: "" %}
 
<!-- 布尔值转换技巧 -->
{% assign has_content = product.description != blank %}
{% assign is_available = product.available == true %}
{% assign is_expensive = product.price > 10000 %}
```

## 实际应用案例[](https://shopify.baoea.com/liquid/operators#%E5%AE%9E%E9%99%85%E5%BA%94%E7%94%A8%E6%A1%88%E4%BE%8B)

### 动态定价逻辑[](https://shopify.baoea.com/liquid/operators#%E5%8A%A8%E6%80%81%E5%AE%9A%E4%BB%B7%E9%80%BB%E8%BE%91)

```
<!-- 复杂的定价规则 -->
{% assign base_price = product.price %}
{% assign final_price = base_price %}
 
<!-- VIP 折扣 -->
{% if customer.tags contains "vip" %}
  {% assign final_price = final_price | times: 0.9 %}
{% endif %}
 
<!-- 批量折扣 -->
{% if cart.item_count > 10 %}
  {% assign final_price = final_price | times: 0.95 %}
{% endif %}
 
<!-- 首次购买折扣 -->
{% if customer.orders_count == 0 %}
  {% assign final_price = final_price | times: 0.85 %}
{% endif %}
 
<!-- 季节性折扣 -->
{% assign current_month = 'now' | date: '%m' %}
{% if current_month == "11" or current_month == "12" %}
  {% assign final_price = final_price | times: 0.8 %}
{% endif %}
 
<div class="pricing">
  {% if final_price < base_price %}
    <span class="original-price">{{ base_price | money }}</span>
    <span class="final-price">{{ final_price | money }}</span>
    {% assign savings = base_price | minus: final_price %}
    <span class="savings">节省 {{ savings | money }}</span>
  {% else %}
    <span class="price">{{ final_price | money }}</span>
  {% endif %}
</div>
```

### 库存管理逻辑[](https://shopify.baoea.com/liquid/operators#%E5%BA%93%E5%AD%98%E7%AE%A1%E7%90%86%E9%80%BB%E8%BE%91)

```
<!-- 智能库存显示 -->
{% assign inventory = product.selected_or_first_available_variant.inventory_quantity %}
{% assign inventory_policy = product.selected_or_first_available_variant.inventory_policy %}
 
{% if inventory_policy == "deny" and inventory <= 0 %}
  <div class="out-of-stock">
    <span class="status">缺货</span>
    <button class="notify-btn">到货通知</button>
  </div>
{% elsif inventory_policy == "deny" and inventory <= 5 %}
  <div class="low-stock">
    <span class="status">仅剩 {{ inventory }} 件</span>
    <span class="urgency">抓紧购买</span>
  </div>
{% elsif inventory_policy == "deny" and inventory <= 20 %}
  <div class="moderate-stock">
    <span class="status">库存充足</span>
  </div>
{% elsif inventory_policy == "continue" %}
  <div class="unlimited-stock">
    <span class="status">现货供应</span>
  </div>
{% else %}
  <div class="high-stock">
    <span class="status">库存充足</span>
  </div>
{% endif %}
```

### 推荐引擎逻辑[](https://shopify.baoea.com/liquid/operators#%E6%8E%A8%E8%8D%90%E5%BC%95%E6%93%8E%E9%80%BB%E8%BE%91)

```
<!-- 基于规则的产品推荐 -->
{% assign recommendation_score = 0 %}
 
<!-- 相同类型加分 -->
{% if related_product.type == product.type %}
  {% assign recommendation_score = recommendation_score | plus: 3 %}
{% endif %}
 
<!-- 相同供应商加分 -->
{% if related_product.vendor == product.vendor %}
  {% assign recommendation_score = recommendation_score | plus: 2 %}
{% endif %}
 
<!-- 价格相近加分 -->
{% assign price_diff = related_product.price | minus: product.price | abs %}
{% assign price_ratio = price_diff | divided_by: product.price %}
{% if price_ratio < 0.3 %}
  {% assign recommendation_score = recommendation_score | plus: 2 %}
{% endif %}
 
<!-- 标签匹配加分 -->
{% for tag in product.tags %}
  {% if related_product.tags contains tag %}
    {% assign recommendation_score = recommendation_score | plus: 1 %}
  {% endif %}
{% endfor %}
 
<!-- 根据评分决定是否推荐 -->
{% if recommendation_score >= 5 %}
  <div class="highly-recommended">
    {% render 'product-card', product: related_product, badge: '强烈推荐' %}
  </div>
{% elsif recommendation_score >= 3 %}
  <div class="recommended">
    {% render 'product-card', product: related_product, badge: '推荐' %}
  </div>
{% endif %}
```

## 性能优化技巧[](https://shopify.baoea.com/liquid/operators#%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%8A%80%E5%B7%A7)

### 避免重复计算[](https://shopify.baoea.com/liquid/operators#%E9%81%BF%E5%85%8D%E9%87%8D%E5%A4%8D%E8%AE%A1%E7%AE%97)

```
<!-- 不好的做法 -->
{% for product in collection.products %}
  {% if collection.products.size > 10 and product.price < 5000 %}
    <!-- collection.products.size 重复计算 -->
  {% endif %}
{% endfor %}
 
<!-- 好的做法 -->
{% assign product_count = collection.products.size %}
{% assign show_budget_filter = product_count > 10 %}
 
{% for product in collection.products %}
  {% if show_budget_filter and product.price < 5000 %}
    <!-- 使用预计算的值 -->
  {% endif %}
{% endfor %}
```

### 短路求值[](https://shopify.baoea.com/liquid/operators#%E7%9F%AD%E8%B7%AF%E6%B1%82%E5%80%BC)

```
<!-- 利用短路求值优化性能 -->
{% if customer and customer.orders_count > 0 and expensive_calculation %}
  <!-- 如果 customer 为空，后面的条件不会执行 -->
{% endif %}
 
<!-- 将简单条件放在前面 -->
{% if product.available and complex_inventory_check %}
  <!-- 如果 available 为 false，复杂检查不会执行 -->
{% endif %}
```

## 最佳实践[](https://shopify.baoea.com/liquid/operators#%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5)

### 1\. 可读性优先[](https://shopify.baoea.com/liquid/operators#1-%E5%8F%AF%E8%AF%BB%E6%80%A7%E4%BC%98%E5%85%88)

```
<!-- 使用有意义的变量名 -->
{% assign customer_is_vip = customer.tags contains "vip" %}
{% assign product_is_on_sale = product.compare_at_price > product.price %}
{% assign order_qualifies_for_free_shipping = cart.total_price > 50000 %}
 
{% if customer_is_vip and product_is_on_sale %}
  <div class="vip-sale-notice">VIP 专享促销</div>
{% endif %}
```

### 2\. 避免复杂嵌套[](https://shopify.baoea.com/liquid/operators#2-%E9%81%BF%E5%85%8D%E5%A4%8D%E6%9D%82%E5%B5%8C%E5%A5%97)

```
<!-- 不好的做法 -->
{% if customer %}
  {% if customer.orders_count > 0 %}
    {% if customer.total_spent > 100000 %}
      {% if customer.tags contains "premium" %}
        <!-- 深层嵌套难以理解 -->
      {% endif %}
    {% endif %}
  {% endif %}
{% endif %}
 
<!-- 好的做法 -->
{% assign is_premium_customer = customer 
  and customer.orders_count > 0 
  and customer.total_spent > 100000 
  and customer.tags contains "premium" %}
 
{% if is_premium_customer %}
  <!-- 清晰的条件表达 -->
{% endif %}
```

### 3\. 一致的代码风格[](https://shopify.baoea.com/liquid/operators#3-%E4%B8%80%E8%87%B4%E7%9A%84%E4%BB%A3%E7%A0%81%E9%A3%8E%E6%A0%BC)

```
<!-- 保持一致的运算符使用 -->
{% if product.price == 0 %}          <!-- 使用 == -->
{% if product.description != blank %} <!-- 使用 != -->
{% if customer.orders_count > 5 %}    <!-- 使用 > -->
```

## 下一步学习[](https://shopify.baoea.com/liquid/operators#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

掌握运算符和表达式后，建议继续学习：

1.  [Shopify 对象参考](https://shopify.baoea.com/liquid/shopify-objects) - 了解可用于表达式的对象
2.  [高级 Liquid 技巧](https://shopify.baoea.com/liquid/advanced-liquid) - 复杂逻辑实现
3.  [性能优化](https://shopify.baoea.com/liquid/performance-optimization) - 表达式优化技巧
4.  [最佳实践](https://shopify.baoea.com/liquid/best-practices) - 代码规范和模式

运算符是构建复杂模板逻辑的基础，熟练掌握它们将让您能够实现各种业务需求！
