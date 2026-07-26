---
source_url: "https://shopify.baoea.com/liquid/product-objects"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:58"
fetch_method: "http"
content_hash: "b92665c65fc65bcd7923c45ddcb059275d6a434d53fcc1699665b2992e0204ab"
discovered_via: ["sitemap", "internal_link"]
---
## 产品对象详解

产品对象是 Shopify Liquid 中最重要和最复杂的对象之一。它包含了商品的所有信息，包括基本属性、变体、图片、选项等。掌握产品对象的使用对于构建功能完整的电商主题至关重要。

## 产品基本属性[](https://shopify.baoea.com/liquid/product-objects#%E4%BA%A7%E5%93%81%E5%9F%BA%E6%9C%AC%E5%B1%9E%E6%80%A7)

### 基础信息[](https://shopify.baoea.com/liquid/product-objects#%E5%9F%BA%E7%A1%80%E4%BF%A1%E6%81%AF)

```
<!-- 产品基本信息 -->
<div class="product-info" itemscope itemtype="http://schema.org/Product">
  <h1 itemprop="name">{{ product.title }}</h1>
 
  <div class="product-meta">
    <p class="vendor">品牌: <span itemprop="brand">{{ product.vendor }}</span></p>
    <p class="product-type">分类: {{ product.type }}</p>
    <p class="sku" itemprop="sku">SKU: {{ product.selected_or_first_available_variant.sku }}</p>
  </div>
 
  <div class="product-description" itemprop="description">
    {{ product.description }}
  </div>
</div>
```

### 价格信息[](https://shopify.baoea.com/liquid/product-objects#%E4%BB%B7%E6%A0%BC%E4%BF%A1%E6%81%AF)

```
<!-- 产品价格展示 -->
<div class="product-price" itemscope itemtype="http://schema.org/Offer">
  {% assign current_variant = product.selected_or_first_available_variant %}
 
  <meta itemprop="priceCurrency" content="{{ shop.currency }}">
  <meta itemprop="price" content="{{ current_variant.price | money_without_currency }}">
 
  {% if current_variant.compare_at_price > current_variant.price %}
    <span class="price-compare">
      原价: <s>{{ current_variant.compare_at_price | money }}</s>
    </span>
    <span class="price-current sale">
      现价: {{ current_variant.price | money }}
    </span>
    <span class="price-save">
      节省: {{ current_variant.compare_at_price | minus: current_variant.price | money }}
      ({{ current_variant.compare_at_price | minus: current_variant.price | times: 100 | divided_by: current_variant.compare_at_price }}% OFF)
    </span>
  {% else %}
    <span class="price-current">
      {{ current_variant.price | money }}
    </span>
  {% endif %}
 
  {% comment %} 价格范围显示 {% endcomment %}
  {% unless product.has_only_default_variant %}
    <div class="price-range">
      {% if product.price_varies %}
        <span>价格范围: {{ product.price_min | money }} - {{ product.price_max | money }}</span>
      {% endif %}
 
      {% if product.compare_at_price_varies %}
        <span>原价范围: {{ product.compare_at_price_min | money }} - {{ product.compare_at_price_max | money }}</span>
      {% endif %}
    </div>
  {% endunless %}
</div>
```

### 库存状态[](https://shopify.baoea.com/liquid/product-objects#%E5%BA%93%E5%AD%98%E7%8A%B6%E6%80%81)

```
<!-- 库存信息 -->
<div class="product-availability">
  {% assign current_variant = product.selected_or_first_available_variant %}
 
  {% if current_variant.available %}
    <span class="in-stock" itemprop="availability" content="http://schema.org/InStock">
      {% if current_variant.inventory_management %}
        {% if current_variant.inventory_quantity > 0 %}
          有库存 ({{ current_variant.inventory_quantity }} 件)
        {% else %}
          有库存
        {% endif %}
      {% else %}
        有库存
      {% endif %}
    </span>
  {% else %}
    <span class="out-of-stock" itemprop="availability" content="http://schema.org/OutOfStock">
      缺货
    </span>
  {% endif %}
 
  {% comment %} 低库存警告 {% endcomment %}
  {% if current_variant.inventory_quantity <= 5 and current_variant.inventory_qu...
```

### 解锁完整内容

此内容仅限VIP会员访问。升级VIP会员即可解锁全部高级教程，获取独家主题代码和商业案例，享受专家1对1咨询服务。

#### 会员专享特权（感谢您的支持）：

*   🔓 解锁全部VIP教程与案例
*   💎 获取独家主题代码和最佳实践
*   🚀 新功能抢先体验、优先更新
*   💬 VIP专属交流社群、月度答疑
*   🎯 1对1专家咨询和定制开发优先级
*   📚 独家商业案例库和跨境电商资讯

**创作不易，您的支持是我前进的动力!**

## 调试和测试[](https://shopify.baoea.com/liquid/product-objects#%E8%B0%83%E8%AF%95%E5%92%8C%E6%B5%8B%E8%AF%95)

### 产品数据调试[](https://shopify.baoea.com/liquid/product-objects#%E4%BA%A7%E5%93%81%E6%95%B0%E6%8D%AE%E8%B0%83%E8%AF%95)

```
<!-- 产品调试信息 -->
{% if request.design_mode %}
  <div class="product-debug" style="margin-top: 2rem; padding: 1rem; background: #f5f5f5; font-family: monospace; font-size: 12px;">
    <h4>产品调试信息</h4>
 
    <div><strong>基本信息:</strong></div>
    <ul>
      <li>ID: {{ product.id }}</li>
      <li>Handle: {{ product.handle }}</li>
      <li>Title: {{ product.title }}</li>
      <li>Vendor: {{ product.vendor }}</li>
      <li>Type: {{ product.type }}</li>
      <li>Available: {{ product.available }}</li>
      <li>Created: {{ product.created_at | date: '%Y-%m-%d %H:%M' }}</li>
      <li>Updated: {{ product.updated_at | date: '%Y-%m-%d %H:%M' }}</li>
    </ul>
 
    <div><strong>价格信息:</strong></div>
    <ul>
      <li>Price: {{ product.price | money }}</li>
      <li>Compare at price: {{ product.compare_at_price | money }}</li>
      <li>Price varies: {{ product.price_varies }}</li>
      <li>Price min: {{ product.price_min | money }}</li>
      <li>Price max: {{ product.price_max | money }}</li>
    </ul>
 
    <div><strong>变体信息:</strong></div>
    <ul>
      <li>Variants count: {{ product.variants.size }}</li>
      <li>Has only default variant: {{ product.has_only_default_variant }}</li>
      <li>Options: {{ product.options | join: ', ' }}</li>
    </ul>
 
    <div><strong>媒体信息:</strong></div>
    <ul>
      <li>Images count: {{ product.images.size }}</li>
      <li>Featured image: {% if product.featured_image %}{{ product.featured_image.alt }}{% else %}None{% endif %}</li>
    </ul>
 
    <div><strong>分类信息:</strong></div>
    <ul>
      <li>Collections: {{ product.collections | map: 'title' | join: ', ' }}</li>
      <li>Tags: {{ product.tags | join: ', ' }}</li>
    </ul>
  </div>
{% endif %}
```

## 下一步学习[](https://shopify.baoea.com/liquid/product-objects#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

现在您已经掌握了产品对象的详细使用，建议继续学习：

*   [客户对象详解](https://shopify.baoea.com/liquid/customer-objects) - 学习客户相关功能
*   [购物车对象详解](https://shopify.baoea.com/liquid/cart-objects) - 掌握购物车实现
*   [全局对象详解](https://shopify.baoea.com/liquid/global-objects) - 了解更多全局对象
*   [高级 Liquid 技巧](https://shopify.baoea.com/liquid/advanced-liquid) - 学习更高级的技巧
