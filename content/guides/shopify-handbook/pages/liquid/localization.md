---
source_url: "https://shopify.baoea.com/liquid/localization"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:53"
fetch_method: "http"
content_hash: "1496874d19438b499d39a46256d67949b588ae144f6c69a6323c0a613c778207"
discovered_via: ["sitemap", "internal_link"]
---
## 多语言和本地化

在全球化的电商环境中，多语言支持是必不可少的功能。Shopify 提供了强大的多语言和本地化功能，让您能够为不同地区的客户提供本地化的购物体验。

## 基础多语言设置[](https://shopify.baoea.com/liquid/localization#%E5%9F%BA%E7%A1%80%E5%A4%9A%E8%AF%AD%E8%A8%80%E8%AE%BE%E7%BD%AE)

### 语言检测[](https://shopify.baoea.com/liquid/localization#%E8%AF%AD%E8%A8%80%E6%A3%80%E6%B5%8B)

```
<!-- 当前语言信息 -->
<div class="language-info" data-current-locale="{{ request.locale.iso_code }}">
  <p>当前语言: {{ request.locale.name }}</p>
  <p>语言代码: {{ request.locale.iso_code }}</p>
  <p>根URL: {{ request.locale.root_url }}</p>
</div>
 
<!-- 语言切换器 -->
<div class="language-switcher">
  <label for="language-select">选择语言:</label>
  <select id="language-select" onchange="switchLanguage(this.value)">
    {% for locale in shop.published_locales %}
      <option value="{{ locale.iso_code }}" 
              {% if locale.iso_code == request.locale.iso_code %}selected{% endif %}>
        {{ locale.name }}
      </option>
    {% endfor %}
  </select>
</div>
 
<script>
function switchLanguage(localeCode) {
  const currentUrl = window.location.pathname + window.location.search
  window.location.href = `/${localeCode}${currentUrl}`
}
</script>
```

### 文本翻译[](https://shopify.baoea.com/liquid/localization#%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91)

```
<!-- 基本文本翻译 -->
<div class="site-navigation">
  <a href="{{ routes.root_url }}">{{ 'general.navigation.home' | t }}</a>
  <a href="{{ routes.all_products_collection_url }}">{{ 'general.navigation.catalog' | t }}</a>
  <a href="{{ routes.cart_url }}">
    {{ 'general.navigation.cart' | t }} ({{ cart.item_count }})
  </a>
  <a href="/pages/about">{{ 'general.navigation.about' | t }}</a>
  <a href="/pages/contact">{{ 'general.navigation.contact' | t }}</a>
</div>
 
<!-- 带参数的翻译 -->
<div class="product-price">
  {% assign discount_percentage = product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price %}
  
  <span class="original-price">
    {{ 'products.product.original_price' | t: price: product.compare_at_price | money }}
  </span>
  
  <span class="sale-price">
    {{ 'products.product.sale_price' | t: price: product.price | money }}
  </span>
  
  <span class="discount">
    {{ 'products.product.save_percentage' | t: percentage: discount_percentage }}
  </span>
</div>
```

## 货币本地化[](https://shopify.baoea.com/liquid/localization#%E8%B4%A7%E5%B8%81%E6%9C%AC%E5%9C%B0%E5%8C%96)

### 货币格式[](https://shopify.baoea.com/liquid/localization#%E8%B4%A7%E5%B8%81%E6%A0%BC%E5%BC%8F)

```
<!-- 货币显示 -->
<div class="currency-display">
  <div class="price-primary">
    {{ product.price | money_with_currency }}
  </div>
  
  <div class="price-local">
    {{ product.price | money: request.locale.currency.symbol }}
  </div>
  
  <!-- 多货币支持 -->
  {% if shop.enabled_currencies.size > 1 %}
    <div class="currency-selector">
      <select onchange="changeCurrency(this.value)">
        {% for currency in shop.enabled_currencies %}
          <option value="{{ currency.iso_code }}" 
                  {% if currency.iso_code == cart.currency.iso_code %}selected{% endif %}>
            {{ currency.name }} ({{ currency.symbol }})
          </option>
        {% endfor %}
      </select>
    </div>
  {% endif %}
</div>
 
<script>
function changeCurrency(currencyCode) {
  fetch('/cart/update.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currency: currencyCode
    })
  }).then(() => {
    location.reload()
  })
}
</script>
```

### 价格格式化[](https://shopify.baoea.com/liquid/localization#%E4%BB%B7%E6%A0%BC%E6%A0%BC%E5%BC%8F%E5%8C%96)

```
<!-- 自定义价格格式 -->
{% capture price_format %}
  {% case request.locale.iso_code %}
    {% when 'zh-CN' %}
      ¥{{ price | divided_by: 100.0 | round: 2 }}
    {% when 'ja' %}
      ¥{{ price | divided_by: 100.0 | round: 0 }}
    {% when 'en-US' %}
      ${{ price | divided_by: 100.0 | round: 2 }}
    {% when 'en-GB' %}
      £{{ price | divided_by: 100.0 | round: 2 }}
    {% else %}
      {{ price | money }}
  {% endcase %}
{% endcapture %}
 
<div class="localized-price">{{ price_format }}</div>
```

## 日期和时间本地化[](https://shopify.baoea.com/liquid/localization#%E6%97%A5%E6%9C%9F%E5%92%8C%E6%97%B6%E9%97%B4%E6%9C%AC%E5%9C%B0%E5%8C%96)

### 日期格式[](https://shopify.baoea.com/liquid/localization#%E6%97%A5%E6%9C%9F%E6%A0%BC%E5%BC%8F)

```
<!-- 本地化日期显示 -->
<div class="date-display">
  {% case request.locale.iso_code %}
    {% when 'zh-CN' %}
      <time>{{ article.published_at | date: '%Y年%m月%d日' }}</time>
    {% when 'en-US' %}
      <time>{{ article.published_at | date: '%B %d, %Y' }}</time>
    {% when 'en-GB' %}
      <time>{{ article.published_at | date: '%d %B %Y' }}</time>
    {% when 'ja' %}
      <time>{{ article.published_at | date: '%Y年%m月%d日' }}</time>
    {% else %}
      <time>{{ article.published_at | date: '%Y-%m-%d' }}</time>
  {% endcase %}
</div>
 
<!-- 相对时间 -->
<div class="relative-time">
  {% assign days_ago = 'now' | date: '%s' | minus: article.published_at | date: '%s' | divided_by: 86400 %}
  
  {% if days_ago == 0 %}
    {{ 'general.date.today' | t }}
  {% elsif days_ago == 1 %}
    {{ 'general.date.yesterday' | t }}
  {% elsif days_ago < 7 %}
    {{ 'general.date.days_ago' | t: count: days_ago }}
  {% else %}
    {{ article.published_at | date: '%Y-%m-%d' }}
  {% endif %}
</div>
```

## 地址格式化[](https://shopify.baoea.com/liquid/localization#%E5%9C%B0%E5%9D%80%E6%A0%BC%E5%BC%8F%E5%8C%96)

### 本地化地址[](https://shopify.baoea.com/liquid/localization#%E6%9C%AC%E5%9C%B0%E5%8C%96%E5%9C%B0%E5%9D%80)

```
<!-- 地址格式本地化 -->
<address class="localized-address">
  {% case request.locale.iso_code %}
    {% when 'zh-CN' %}
      <!-- 中文地址格式 -->
      <div class="address-country">{{ address.country }}</div>
      <div class="address-province">{{ address.province }}</div>
      <div class="address-city">{{ address.city }}</div>
      <div class="address-street">{{ address.address1 }}</div>
      {% if address.address2 %}
        <div class="address-street2">{{ address.address2 }}</div>
      {% endif %}
      <div class="address-zip">{{ address.zip }}</div>
      <div class="address-name">{{ address.first_name }} {{ address.last_name }}</div>
      
    {% when 'ja' %}
      <!-- 日文地址格式 -->
      <div class="address-zip">〒{{ address.zip }}</div>
      <div class="address-country">{{ address.country }}</div>
      <div class="address-province">{{ address.province }}</div>
      <div class="address-city">{{ address.city }}</div>
      <div class="address-street">{{ address.address1 }}</div>
      {% if address.address2 %}
        <div class="address-street2">{{ address.address2 }}</div>
      {% endif %}
      <div class="address-name">{{ address.last_name }} {{ address.first_name }}</div>
      
    {% else %}
      <!-- 西方地址格式 -->
      <div class="address-name">{{ address.first_name }} {{ address.last_name }}</div>
      <div class="address-street">{{ address.address1 }}</div>
      {% if address.address2 %}
        <div class="address-street2">{{ address.address2 }}</div>
      {% endif %}
      <div class="address-city-state">
        {{ address.city }}, {{ address.province }} {{ address.zip }}
      </div>
      <div class="address-country">{{ address.country }}</div>
  {% endcase %}
</address>
```

## 内容本地化[](https://shopify.baoea.com/liquid/localization#%E5%86%85%E5%AE%B9%E6%9C%AC%E5%9C%B0%E5%8C%96)

### 产品信息本地化[](https://shopify.baoea.com/liquid/localization#%E4%BA%A7%E5%93%81%E4%BF%A1%E6%81%AF%E6%9C%AC%E5%9C%B0%E5%8C%96)

```
<!-- 本地化产品内容 -->
<div class="product-info">
  <h1>{{ product.title }}</h1>
  
  <!-- 本地化描述 -->
  {% assign localized_description = product.metafields.translations[request.locale.iso_code].description %}
  {% if localized_description %}
    <div class="product-description">{{ localized_description }}</div>
  {% else %}
    <div class="product-description">{{ product.description }}</div>
  {% endif %}
  
  <!-- 本地化特性列表 -->
  {% assign features_key = 'features_' | append: request.locale.iso_code %}
  {% assign localized_features = product.metafields.custom[features_key] %}
  
  {% if localized_features %}
    <div class="product-features">
      <h3>{{ 'products.product.features' | t }}</h3>
      <ul>
        {% for feature in localized_features %}
          <li>{{ feature }}</li>
        {% endfor %}
      </ul>
    </div>
  {% endif %}
</div>
```

### 集合本地化[](https://shopify.baoea.com/liquid/localization#%E9%9B%86%E5%90%88%E6%9C%AC%E5%9C%B0%E5%8C%96)

```
<!-- 本地化集合信息 -->
<div class="collection-header">
  {% assign localized_title = collection.metafields.translations[request.locale.iso_code].title %}
  <h1>{% if localized_title %}{{ localized_title }}{% else %}{{ collection.title }}{% endif %}</h1>
  
  {% assign localized_description = collection.metafields.translations[request.locale.iso_code].description %}
  {% if localized_description %}
    <div class="collection-description">{{ localized_description }}</div>
  {% elsif collection.description %}
    <div class="collection-description">{{ collection.description }}</div>
  {% endif %}
</div>
```

## SEO 本地化[](https://shopify.baoea.com/liquid/localization#seo-%E6%9C%AC%E5%9C%B0%E5%8C%96)

### hreflang 标签[](https://shopify.baoea.com/liquid/localization#hreflang-%E6%A0%87%E7%AD%BE)

```
<!-- hreflang 实现 -->
<head>
  {% for locale in shop.published_locales %}
    <link rel="alternate" 
          hreflang="{{ locale.iso_code }}" 
          href="{{ locale.root_url }}{{ request.path }}">
  {% endfor %}
  
  <!-- 默认语言 -->
  <link rel="alternate" 
        hreflang="x-default" 
        href="{{ shop.primary_locale.root_url }}{{ request.path }}">
</head>
```

### 本地化 meta 标签[](https://shopify.baoea.com/liquid/localization#%E6%9C%AC%E5%9C%B0%E5%8C%96-meta-%E6%A0%87%E7%AD%BE)

```
<!-- 本地化 SEO 标签 -->
<head>
  {% assign page_title_key = 'meta.title.' | append: template %}
  {% assign page_description_key = 'meta.description.' | append: template %}
  
  <title>
    {% if page_title_key != blank %}
      {{ page_title_key | t: shop_name: shop.name, page_title: page_title }}
    {% else %}
      {{ page_title }}{% unless page_title contains shop.name %} - {{ shop.name }}{% endunless %}
    {% endif %}
  </title>
  
  <meta name="description" content="{{ page_description_key | t | default: page_description | truncate: 160 }}">
  
  <!-- Open Graph 本地化 -->
  <meta property="og:locale" content="{{ request.locale.iso_code | replace: '-', '_' }}">
  {% for locale in shop.published_locales %}
    {% unless locale.iso_code == request.locale.iso_code %}
      <meta property="og:locale:alternate" content="{{ locale.iso_code | replace: '-', '_' }}">
    {% endunless %}
  {% endfor %}
</head>
```

## RTL 支持[](https://shopify.baoea.com/liquid/localization#rtl-%E6%94%AF%E6%8C%81)

### 右到左语言支持[](https://shopify.baoea.com/liquid/localization#%E5%8F%B3%E5%88%B0%E5%B7%A6%E8%AF%AD%E8%A8%80%E6%94%AF%E6%8C%81)

```
<!-- RTL 语言支持 -->
{% assign rtl_languages = 'ar,he,fa,ur' | split: ',' %}
{% assign is_rtl = false %}
{% for rtl_lang in rtl_languages %}
  {% if request.locale.iso_code contains rtl_lang %}
    {% assign is_rtl = true %}
    {% break %}
  {% endif %}
{% endfor %}
 
<html dir="{% if is_rtl %}rtl{% else %}ltr{% endif %}" lang="{{ request.locale.iso_code }}">
<head>
  <style>
    {% if is_rtl %}
      body {
        direction: rtl;
        text-align: right;
      }
      
      .container {
        padding-right: 20px;
        padding-left: 20px;
      }
      
      .navigation {
        float: right;
      }
      
      .breadcrumbs {
        direction: rtl;
      }
      
      .breadcrumbs::before {
        content: "←";
        margin-left: 5px;
        margin-right: 0;
      }
    {% endif %}
  </style>
</head>
```

## 表单本地化[](https://shopify.baoea.com/liquid/localization#%E8%A1%A8%E5%8D%95%E6%9C%AC%E5%9C%B0%E5%8C%96)

### 多语言表单[](https://shopify.baoea.com/liquid/localization#%E5%A4%9A%E8%AF%AD%E8%A8%80%E8%A1%A8%E5%8D%95)

```
<!-- 本地化表单 -->
<form action="/contact" method="post" class="contact-form">
  <div class="form-group">
    <label for="contact-name">{{ 'contact.form.name' | t }}</label>
    <input type="text" 
           id="contact-name" 
           name="contact[name]" 
           placeholder="{{ 'contact.form.name_placeholder' | t }}"
           required>
  </div>
  
  <div class="form-group">
    <label for="contact-email">{{ 'contact.form.email' | t }}</label>
    <input type="email" 
           id="contact-email" 
           name="contact[email]" 
           placeholder="{{ 'contact.form.email_placeholder' | t }}"
           required>
  </div>
  
  <div class="form-group">
    <label for="contact-subject">{{ 'contact.form.subject' | t }}</label>
    <select id="contact-subject" name="contact[subject]">
      <option value="">{{ 'contact.form.subject_choose' | t }}</option>
      <option value="general">{{ 'contact.form.subject_general' | t }}</option>
      <option value="support">{{ 'contact.form.subject_support' | t }}</option>
      <option value="wholesale">{{ 'contact.form.subject_wholesale' | t }}</option>
    </select>
  </div>
  
  <div class="form-group">
    <label for="contact-message">{{ 'contact.form.message' | t }}</label>
    <textarea id="contact-message" 
              name="contact[body]" 
              placeholder="{{ 'contact.form.message_placeholder' | t }}"
              required></textarea>
  </div>
  
  <button type="submit" class="btn btn-primary">
    {{ 'contact.form.send' | t }}
  </button>
</form>
```

## 本地化工具[](https://shopify.baoea.com/liquid/localization#%E6%9C%AC%E5%9C%B0%E5%8C%96%E5%B7%A5%E5%85%B7)

### 翻译文件结构[](https://shopify.baoea.com/liquid/localization#%E7%BF%BB%E8%AF%91%E6%96%87%E4%BB%B6%E7%BB%93%E6%9E%84)

```
<!-- 翻译文件路径检查 -->
{% comment %}
翻译文件位置：
/locales/en.default.json
/locales/zh-CN.json
/locales/ja.json
/locales/fr.json
{% endcomment %}
 
<!-- 翻译键检查 -->
<div class="translation-debug" style="display: none;">
  {% assign test_keys = 'general.navigation.home,products.product.add_to_cart,cart.general.title' | split: ',' %}
  
  {% for key in test_keys %}
    <p>{{ key }}: "{{ key | t }}"</p>
  {% endfor %}
</div>
```

### 翻译管理[](https://shopify.baoea.com/liquid/localization#%E7%BF%BB%E8%AF%91%E7%AE%A1%E7%90%86)

```
<!-- 翻译管理助手 -->
{% if request.design_mode %}
  <div class="translation-helper" style="position: fixed; top: 10px; right: 10px; background: #fff; padding: 10px; border: 1px solid #ccc; z-index: 9999;">
    <h4>翻译助手</h4>
    <p><strong>当前语言:</strong> {{ request.locale.name }} ({{ request.locale.iso_code }})</p>
    <p><strong>可用语言:</strong></p>
    <ul>
      {% for locale in shop.published_locales %}
        <li>
          <a href="{{ locale.root_url }}{{ request.path }}">
            {{ locale.name }} ({{ locale.iso_code }})
          </a>
        </li>
      {% endfor %}
    </ul>
  </div>
{% endif %}
```

## 性能优化[](https://shopify.baoea.com/liquid/localization#%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96)

### 本地化缓存[](https://shopify.baoea.com/liquid/localization#%E6%9C%AC%E5%9C%B0%E5%8C%96%E7%BC%93%E5%AD%98)

```
<script>
// 翻译缓存
const TranslationCache = {
  cache: {},
  
  get: function(key, locale = null) {
    const currentLocale = locale || document.documentElement.lang
    const cacheKey = `${currentLocale}.${key}`
    
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey]
    }
    
    // 从服务器获取翻译
    return this.fetch(key, currentLocale)
  },
  
  fetch: function(key, locale) {
    return fetch(`/locales/${locale}.json`)
      .then(response => response.json())
      .then(translations => {
        const value = this.getNestedValue(translations, key)
        this.cache[`${locale}.${key}`] = value
        return value
      })
  },
  
  getNestedValue: function(obj, path) {
    return path.split('.').reduce((o, p) => o && o[p], obj)
  }
}
 
// 动态翻译
function t(key, params = {}) {
  return TranslationCache.get(key).then(translation => {
    if (typeof translation === 'string') {
      // 替换参数
      Object.keys(params).forEach(param => {
        translation = translation.replace(new RegExp(`{{\\s*${param}\\s*}}`, 'g'), params[param])
      })
    }
    return translation || key
  })
}
</script>
```

## 测试和调试[](https://shopify.baoea.com/liquid/localization#%E6%B5%8B%E8%AF%95%E5%92%8C%E8%B0%83%E8%AF%95)

### 本地化测试[](https://shopify.baoea.com/liquid/localization#%E6%9C%AC%E5%9C%B0%E5%8C%96%E6%B5%8B%E8%AF%95)

```
<!-- 本地化测试工具 -->
{% if request.design_mode %}
  <div class="localization-test" style="margin: 20px 0; padding: 20px; background: #f8f9fa; border: 1px solid #dee2e6;">
    <h3>本地化测试</h3>
    
    <div class="test-section">
      <h4>语言信息</h4>
      <ul>
        <li>当前语言: {{ request.locale.name }} ({{ request.locale.iso_code }})</li>
        <li>默认语言: {{ shop.primary_locale.name }} ({{ shop.primary_locale.iso_code }})</li>
        <li>可用语言数: {{ shop.published_locales.size }}</li>
      </ul>
    </div>
    
    <div class="test-section">
      <h4>货币信息</h4>
      <ul>
        <li>当前货币: {{ cart.currency.iso_code }}</li>
        <li>货币符号: {{ cart.currency.symbol }}</li>
        <li>可用货币数: {{ shop.enabled_currencies.size }}</li>
      </ul>
    </div>
    
    <div class="test-section">
      <h4>翻译测试</h4>
      <p>导航.首页: {{ 'general.navigation.home' | t }}</p>
      <p>产品.加入购物车: {{ 'products.product.add_to_cart' | t }}</p>
      <p>购物车.标题: {{ 'cart.general.title' | t }}</p>
    </div>
  </div>
{% endif %}
```

## 下一步学习[](https://shopify.baoea.com/liquid/localization#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

现在您已经掌握了多语言和本地化功能，建议继续学习：

*   [Ajax 与 Liquid](https://shopify.baoea.com/liquid/ajax-liquid) - 学习动态内容加载
*   [高级 Liquid 技巧](https://shopify.baoea.com/liquid/advanced-liquid) - 学习更高级的模板技巧
*   [性能优化](https://shopify.baoea.com/liquid/performance-optimization) - 优化多语言站点性能
*   [最佳实践](https://shopify.baoea.com/liquid/best-practices) - 了解本地化最佳实践
