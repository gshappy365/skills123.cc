---
source_url: "https://shopify.baoea.com/liquid/cart-objects"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:35"
fetch_method: "http"
content_hash: "6c6c6ab1d1ec9a5a1cbef633054587e42070eeb2e8730b64ec05f35311f56732"
discovered_via: ["sitemap", "internal_link"]
---
## 购物车对象详解

购物车对象包含了用户当前购物车中的所有商品信息、价格计算、运费、税费等。掌握购物车对象是构建完整电商体验的关键。

## 购物车基本信息[](https://shopify.baoea.com/liquid/cart-objects#%E8%B4%AD%E7%89%A9%E8%BD%A6%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF)

### 购物车状态[](https://shopify.baoea.com/liquid/cart-objects#%E8%B4%AD%E7%89%A9%E8%BD%A6%E7%8A%B6%E6%80%81)

```
<!-- 购物车基本信息 -->
<div class="cart-summary" data-cart-count="{{ cart.item_count }}">
  {% if cart.item_count > 0 %}
    <h2>购物车 ({{ cart.item_count }} 件商品)</h2>
 
    <div class="cart-meta">
      <p><strong>商品数量:</strong> {{ cart.item_count }}</p>
      <p><strong>商品小计:</strong> {{ cart.items_subtotal_price | money }}</p>
      <p><strong>总价:</strong> {{ cart.total_price | money }}</p>
 
      {% if cart.total_discount > 0 %}
        <p class="discount"><strong>优惠:</strong> -{{ cart.total_discount | money }}</p>
      {% endif %}
    </div>
  {% else %}
    <div class="empty-cart">
      <h2>购物车为空</h2>
      <p>您的购物车中还没有商品</p>
      <a href="{{ routes.all_products_collection_url }}" class="btn btn-primary">开始购物</a>
    </div>
  {% endif %}
</div>
```

## 购物车商品[](https://shopify.baoea.com/liquid/cart-objects#%E8%B4%AD%E7%89%A9%E8%BD%A6%E5%95%86%E5%93%81)

### 商品列表[](https://shopify.baoea.com/liquid/cart-objects#%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8)

```
<!-- 购物车商品列表 -->
{% if cart.item_count > 0 %}
  <div class="cart-items">
    {% for item in cart.items %}
      <div class="cart-item" data-variant-id="{{ item.variant.id }}">
        <div class="item-image">
          <img src="{{ item.image | image_url: width: 150, height: 150 }}"
               alt="{{ item.product.title }}"
               loading="lazy" />
        </div>
 
        <div class="item-details">
          <h3 class="item-title">
            <a href="{{ item.product.url }}">{{ item.product.title }}</a>
          </h3>
 
          {% unless item.variant.title == 'Default Title' %}
            <p class="item-variant">{{ item.variant.title }}</p>
          {% endunless %}
 
          {% if item.vendor != blank %}
            <p class="item-vendor">品牌: {{ item.vendor }}...
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

## 下一步学习[](https://shopify.baoea.com/liquid/cart-objects#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

现在您已经掌握了购物车对象的使用，建议继续学习：

*   [全局对象详解](https://shopify.baoea.com/liquid/global-objects) - 了解更多全局对象
*   [产品对象详解](https://shopify.baoea.com/liquid/product-objects) - 深入了解产品相关对象
*   [客户对象详解](https://shopify.baoea.com/liquid/customer-objects) - 学习客户相关功能
*   [高级 Liquid 技巧](https://shopify.baoea.com/liquid/advanced-liquid) - 学习更高级的模板技巧

最后更新时间：

2026年6月27日

[客户对象](https://shopify.baoea.com/liquid/customer-objects "客户对象,[object Object]")[布局和模板](/liquid/layout-templates "布局和模板")
