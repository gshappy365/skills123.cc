---
source_url: "https://shopify.baoea.com/liquid/customer-objects"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:47"
fetch_method: "browser"
content_hash: "7388f203245a36c2017bc320fe5fd632be79cac222d7b4e69f927b8543520015"
discovered_via: ["sitemap", "internal_link"]
---
## 客户对象详解

客户对象包含了用户账户的所有信息，包括个人信息、地址、订单历史、登录状态等。掌握客户对象的使用对于构建个性化的用户体验和账户功能至关重要。

## 客户基本信息[](https://shopify.baoea.com/liquid/customer-objects#%E5%AE%A2%E6%88%B7%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF)

### 个人信息[](https://shopify.baoea.com/liquid/customer-objects#%E4%B8%AA%E4%BA%BA%E4%BF%A1%E6%81%AF)

```
<!-- 客户基本信息 -->
{% if customer %}
  <div class="customer-info" itemscope itemtype="http://schema.org/Person">
    <h2>欢迎回来，<span itemprop="name">{{ customer.first_name }} {{ customer.last_name }}</span>！</h2>
 
    <div class="customer-details">
      <p><strong>邮箱:</strong> <span itemprop="email">{{ customer.email }}</span></p>
 
      {% if customer.phone %}
        <p><strong>电话:</strong> <span itemprop="telephone">{{ customer.phone }}</span></p>
      {% endif %}
 
      <p><strong>账户创建:</strong> {{ customer.created_at | date: '%Y年%m月%d日' }}</p>
      <p><strong>上次登录:</strong> {{ customer.last_login | date: '%Y年%m月%d日' }}</p>
 
      <div class="customer-status">
        {% if customer.email_marketing_consent.state == 'subscribed' %}
          <span class="badge">已订阅邮件营销</span>
       ...
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

## 下一步学习[](https://shopify.baoea.com/liquid/customer-objects#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

现在您已经掌握了客户对象的详细使用，建议继续学习：

*   [购物车对象详解](https://shopify.baoea.com/liquid/cart-objects) - 学习购物车功能实现
*   [全局对象详解](https://shopify.baoea.com/liquid/global-objects) - 了解更多全局对象
*   [产品对象详解](https://shopify.baoea.com/liquid/product-objects) - 深入了解产品相关对象
*   [高级 Liquid 技巧](https://shopify.baoea.com/liquid/advanced-liquid) - 学习更高级的模板技巧
