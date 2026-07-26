---
source_url: "https://shopify.baoea.com/liquid/custom-snippets"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:44"
fetch_method: "http"
content_hash: "cad35b61e676680aa49cb4341aa796b7182bf57523516a89b82e7debc56b14be"
discovered_via: ["sitemap", "internal_link"]
---
## 自定义代码片段开发

代码片段 (Snippets) 是 Shopify 主题开发中创建可复用组件的核心机制。本指南将详细介绍如何开发高质量、可维护的自定义代码片段。

## 基础组件开发[](https://shopify.baoea.com/liquid/custom-snippets#%E5%9F%BA%E7%A1%80%E7%BB%84%E4%BB%B6%E5%BC%80%E5%8F%91)

### 1\. 产品卡片组件[](https://shopify.baoea.com/liquid/custom-snippets#1-%E4%BA%A7%E5%93%81%E5%8D%A1%E7%89%87%E7%BB%84%E4%BB%B6)

```
<!-- snippets/product-card.liquid -->
{% comment %}
  产品卡片组件
  
  参数:
  - product: 产品对象 (必需)
  - card_style: 卡片样式 (可选: 'default', 'minimal', 'detailed')
  - image_ratio: 图片比例 (可选: 'square', 'portrait', 'landscape')
  - show_vendor: 是否显示品牌 (可选: true/false)
  - show_badge: 是否显示标签 (可选: true/false)
  - lazy_load: 是否懒加载 (可选: true/false)
{% endcomment %}
 
{% assign card_style = card_style | default: 'default' %}
{% assign image_ratio = image_ratio | default: 'square' %}
{% assign show_vendor = show_vendor | default: false %}
{% assign show_badge = show_badge | default: true %}
{% assign lazy_load = lazy_load | default: true %}
 
<article class="product-card product-card--{{ card_style }}" data-product-id="{{ product.id }}">
  <div class="product-card__image-wrapper">
    <a href="{{ product.url }}" class="product-card__link" aria-label="{{ product.title }}">
      {% if product.featured_image %}
        <div class="product-card__image product-card__image--{{ image_ratio }}">
          {% if lazy_load %}
            <img data-src="{{ product.featured_image | image_url: width: 400, height: 400 }}"
                 alt="{{ product.featured_image.alt | default: product.title }}"
                 class="product-card__img lazyload">
          {% else %}
            <img src="{{ product.featured_image | image_url: width: 400, height: 400 }}"
                 alt="{{ product.featured_image.alt | default: product.title }}"
                 class="product-card__img">
          {% endif %}
          
          <!-- 悬停图片 -->
          {% if product.images[1] and card_style != 'minimal' %}
            <img src="{{ product.images[1] | image_url: width: 400, height: 400 }}"
                 alt="{{ product.title }}"
                 class="product-card__img product-card__img--hover">
          {% endif %}
        </div>
      {% else %}
        <div class="product-card__placeholder">
          {% render 'icon-placeholder' %}
        </div>
      {% endif %}
      
      <!-- 产品标签 -->
      {% if show_badge %}
        {% render 'product-badges', product: product %}
      {% endif %}
    </a>
    
    <!-- 快速操作 -->
    {% unless card_style == 'minimal' %}
      <div class="product-card__actions">
        {% if product.available and product.variants.size == 1 %}
          <button type="button" 
                  class="quick-add-btn"
                  data-variant-id="{{ product.first_available_variant.id }}">
            {% render 'icon-cart' %}
          </button>
        {% endif %}
        
        <button type="button" 
                class="wishlist-btn"
                data-product-id="{{ product.id }}">
          {% render 'icon-heart' %}
        </button>
      </div>
    {% endunless %}
  </div>
  
  <div class="product-card__info">
    {% if show_vendor and product.vendor %}
      <p class="product-card__vendor">{{ product.vendor }}</p>
    {% endif %}
    
    <h3 class="product-card__title">
      <a href="{{ product.url }}">{{ product.title }}</a>
    </h3>
    
    <!-- 价格显示 -->
    <div class="product-card__price">
      {% render 'price', product: product %}
    </div>
    
    <!-- 变体选项 -->
    {% if card_style == 'detailed' and product.variants.size > 1 %}
      {% render 'product-variant-pills', product: product %}
    {% endif %}
    
    <!-- 评分 -->
    {% if product.metafields.reviews.rating and card_style != 'minimal' %}
      {% render 'star-rating', rating: product.metafields.reviews.rating %}
    {% endif %}
  </div>
</article>
```

### 2\. 价格显示组件[](https://shopify.baoea.com/liquid/custom-snippets#2-%E4%BB%B7%E6%A0%BC%E6%98%BE%E7%A4%BA%E7%BB%84%E4%BB%B6)

```
<!-- snippets/price.liquid -->
{% comment %}
  价格显示组件
  
  参数:
  - product: 产品对象 (必需)
  - variant: 变体对象 (可选，优先于产品价格)
  - size: 显示尺寸 (可选: 'small', 'medium', 'large')
  - show_currency: 是否显示货币符号 (可选: true/false)
{% endcomment %}
 
{% assign target = variant | default: product %}
{% assign size = size | default: 'medium' %}
{% assign show_currency = show_currency | default: true %}
 
<div class="price price--{{ size }}" data-price-container>
  {% if target.compare_at_price > target.price %}
    <!-- 促销价格 -->
    <span class="price__sale">
      {% if show_currency %}
        {{ target.price | money }}
      {% else %}
        {{ target.price | money_without_currency }}
      {% endif %}
    </span>
    <span class="price__compare">
      {% if show_currency %}
        {{ target.compare_at_price | money }}
      {% else %}
        {{ target.compare_at_price | money_without_currency }}
      {% endif %}
    </span>
    
    <!-- 折扣百分比 -->
    {% assign discount = target.compare_at_price | minus: target.price %}
    {% assign discount_percent = discount | times: 100 | divided_by: target.compare_at_price | round %}
    <span class="price__badge">-{{ discount_percent }}%</span>
  {% else %}
    <!-- 常规价格 -->
    <span class="price__regular">
      {% if show_currency %}
        {{ target.price | money }}
      {% else %}
        {{ target.price | money_without_currency }}
      {% endif %}
    </span>
  {% endif %}
  
  <!-- 单位价格 -->
  {% if target.unit_price_measurement %}
    <div class="price__unit">
      <span class="price__unit-price">
        {{ target.unit_price | money }}
      </span>
      <span class="price__unit-measure">
        / {{ target.unit_price_measurement.reference_value }}{{ target.unit_price_measurement.reference_unit }}
      </span>
    </div>
  {% endif %}
</div>
```

### 3\. 星级评分组件[](https://shopify.baoea.com/liquid/custom-snippets#3-%E6%98%9F%E7%BA%A7%E8%AF%84%E5%88%86%E7%BB%84%E4%BB%B6)

```
<!-- snippets/star-rating.liquid -->
{% comment %}
  星级评分组件
  
  参数:
  - rating: 评分值 (必需, 0-5)
  - max_rating: 最大评分 (可选, 默认: 5)
  - show_text: 是否显示文字 (可选: true/false)
  - size: 显示尺寸 (可选: 'small', 'medium', 'large')
  - color: 星星颜色 (可选: 'gold', 'red', 'blue')
{% endcomment %}
 
{% assign rating = rating | default: 0 %}
{% assign max_rating = max_rating | default: 5 %}
{% assign show_text = show_text | default: false %}
{% assign size = size | default: 'medium' %}
{% assign color = color | default: 'gold' %}
 
<div class="star-rating star-rating--{{ size }} star-rating--{{ color }}" 
     role="img" 
     aria-label="评分 {{ rating }} 星，满分 {{ max_rating }} 星">
  
  <div class="star-rating__stars" aria-hidden="true">
    {% for i in (1..max_rating) %}
      {% if rating >= i %}
        <span class="star star--filled">★</span>
      {% elsif rating > i | minus: 1 %}
        <span class="star star--half">★</span>
      {% else %}
        <span class="star star--empty">☆</span>
      {% endif %}
    {% endfor %}
  </div>
  
  {% if show_text %}
    <span class="star-rating__text">
      {{ rating | round: 1 }}/{{ max_rating }}
    </span>
  {% endif %}
</div>
```

## 交互式组件[](https://shopify.baoea.com/liquid/custom-snippets#%E4%BA%A4%E4%BA%92%E5%BC%8F%E7%BB%84%E4%BB%B6)

### 1\. 变体选择器[](https://shopify.baoea.com/liquid/custom-snippets#1-%E5%8F%98%E4%BD%93%E9%80%89%E6%8B%A9%E5%99%A8)

```
<!-- snippets/variant-selector.liquid -->
{% comment %}
  产品变体选择器
  
  参数:
  - product: 产品对象 (必需)
  - option: 选项对象 (必需)
  - option_index: 选项索引 (必需)
  - selector_type: 选择器类型 (可选: 'dropdown', 'buttons', 'swatches')
{% endcomment %}
 
{% assign selector_type = selector_type | default: 'buttons' %}
 
<div class="variant-selector" data-option-index="{{ option_index }}">
  <label class="variant-selector__label">{{ option.name }}</label>
  
  {% case selector_type %}
    {% when 'dropdown' %}
      <select class="variant-selector__dropdown" data-option-selector>
        {% for value in option.values %}
          <option value="{{ value }}" 
                  {% if option.selected_value == value %}selected{% endif %}>
            {{ value }}
          </option>
        {% endfor %}
      </select>
      
    {% when 'buttons' %}
      <div class="variant-selector__buttons">
        {% for value in option.values %}
          <button type="button" 
                  class="variant-selector__button {% if option.selected_value == value %}active{% endif %}"
                  data-option-value="{{ value }}"
                  data-option-selector>
            {{ value }}
          </button>
        {% endfor %}
      </div>
      
    {% when 'swatches' %}
      <div class="variant-selector__swatches">
        {% for value in option.values %}
          {% assign color_image = value | handle | append: '.png' %}
          <label class="variant-selector__swatch">
            <input type="radio" 
                   name="option-{{ option_index }}"
                   value="{{ value }}"
                   {% if option.selected_value == value %}checked{% endif %}
                   data-option-selector>
            <span class="variant-selector__swatch-display"
                  style="background-color: {{ value | handle }}; background-image: url('{{ color_image | asset_img_url: '50x50' }}');"
                  title="{{ value }}">
              <span class="visually-hidden">{{ value }}</span>
            </span>
          </label>
        {% endfor %}
      </div>
  {% endcase %}
</div>
```

### 2\. 数量选择器[](https://shopify.baoea.com/liquid/custom-snippets#2-%E6%95%B0%E9%87%8F%E9%80%89%E6%8B%A9%E5%99%A8)

```
<!-- snippets/quantity-selector.liquid -->
{% comment %}
  数量选择器组件
  
  参数:
  - quantity: 初始数量 (可选, 默认: 1)
  - min: 最小数量 (可选, 默认: 1)
  - max: 最大数量 (可选)
  - step: 步长 (可选, 默认: 1)
  - variant_id: 变体ID (可选，用于库存检查)
{% endcomment %}
 
{% assign quantity = quantity | default: 1 %}
{% assign min = min | default: 1 %}
{% assign step = step | default: 1 %}
 
<div class="quantity-selector" data-quantity-selector>
  <label for="quantity-{{ section.id }}" class="quantity-selector__label">
    数量
  </label>
  
  <div class="quantity-selector__input-wrapper">
    <button type="button" 
            class="quantity-selector__button quantity-selector__button--minus"
            data-quantity-change="decrease"
            aria-label="减少数量">
      {% render 'icon-minus' %}
    </button>
    
    <input type="number" 
           id="quantity-{{ section.id }}"
           class="quantity-selector__input"
           name="quantity"
           value="{{ quantity }}"
           min="{{ min }}"
           {% if max %}max="{{ max }}"{% endif %}
           step="{{ step }}"
           data-quantity-input
           aria-label="商品数量">
    
    <button type="button" 
            class="quantity-selector__button quantity-selector__button--plus"
            data-quantity-change="increase"
            aria-label="增加数量">
      {% render 'icon-plus' %}
    </button>
  </div>
  
  {% if variant_id %}
    <div class="quantity-selector__stock" data-stock-info="{{ variant_id }}"></div>
  {% endif %}
</div>
 
<script>
// 数量选择器功能
class QuantitySelector {
  constructor(element) {
    this.container = element
    this.input = element.querySelector('[data-quantity-input]')
    this.decreaseBtn = element.querySelector('[data-quantity-change="decrease"]')
    this.increaseBtn = element.querySelector('[data-quantity-change="increase"]')
    
    this.init()
  }
  
  init() {
    this.decreaseBtn?.addEventListener('click', () => this.decrease())
    this.increaseBtn?.addEventListener('click', () => this.increase())
    this.input?.addEventListener('change', () => this.validate())
  }
  
  decrease() {
    const currentValue = parseInt(this.input.value)
    const minValue = parseInt(this.input.min)
    const step = parseInt(this.input.step) || 1
    
    if (currentValue > minValue) {
      this.input.value = Math.max(currentValue - step, minValue)
      this.input.dispatchEvent(new Event('change'))
    }
  }
  
  increase() {
    const currentValue = parseInt(this.input.value)
    const maxValue = this.input.max ? parseInt(this.input.max) : Infinity
    const step = parseInt(this.input.step) || 1
    
    if (currentValue < maxValue) {
      this.input.value = Math.min(currentValue + step, maxValue)
      this.input.dispatchEvent(new Event('change'))
    }
  }
  
  validate() {
    const value = parseInt(this.input.value)
    const min = parseInt(this.input.min)
    const max = this.input.max ? parseInt(this.input.max) : Infinity
    
    if (value < min) {
      this.input.value = min
    } else if (value > max) {
      this.input.value = max
    }
    
    this.updateButtons()
  }
  
  updateButtons() {
    const value = parseInt(this.input.value)
    const min = parseInt(this.input.min)
    const max = this.input.max ? parseInt(this.input.max) : Infinity
    
    this.decreaseBtn.disabled = value <= min
    this.increaseBtn.disabled = value >= max
  }
}
 
// 初始化所有数量选择器
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-quantity-selector]').forEach(selector => {
    new QuantitySelector(selector)
  })
})
</script>
```

### 3\. 图片画廊组件[](https://shopify.baoea.com/liquid/custom-snippets#3-%E5%9B%BE%E7%89%87%E7%94%BB%E5%BB%8A%E7%BB%84%E4%BB%B6)

```
<!-- snippets/product-gallery.liquid -->
{% comment %}
  产品图片画廊组件
  
  参数:
  - product: 产品对象 (必需)
  - featured_media: 特色媒体 (可选)
  - enable_zoom: 是否启用放大 (可选: true/false)
  - thumbnail_position: 缩略图位置 (可选: 'bottom', 'left', 'right')
{% endcomment %}
 
{% assign enable_zoom = enable_zoom | default: true %}
{% assign thumbnail_position = thumbnail_position | default: 'bottom' %}
 
<div class="product-gallery" data-product-gallery>
  <!-- 主图显示区域 -->
  <div class="product-gallery__main">
    {% if product.featured_media %}
      <div class="product-gallery__media" data-media-container>
        {% case product.featured_media.media_type %}
          {% when 'image' %}
            <img src="{{ product.featured_media | image_url: width: 800, height: 800 }}"
                 alt="{{ product.featured_media.alt | default: product.title }}"
                 class="product-gallery__image"
                 data-main-image
                 {% if enable_zoom %}data-zoom="{{ product.featured_media | image_url: width: 1600, height: 1600 }}"{% endif %}>
          
          {% when 'video' %}
            <video class="product-gallery__video"
                   controls
                   data-main-video>
              <source src="{{ product.featured_media.sources[0].url }}" type="{{ product.featured_media.sources[0].mime_type }}">
            </video>
          
          {% when 'external_video' %}
            <div class="product-gallery__external-video">
              {{ product.featured_media | external_video_tag }}
            </div>
          
          {% when 'model' %}
            <div class="product-gallery__model">
              {{ product.featured_media | model_viewer_tag }}
            </div>
        {% endcase %}
      </div>
    {% endif %}
    
    <!-- 放大镜功能 -->
    {% if enable_zoom %}
      <div class="product-gallery__zoom-container" data-zoom-container style="display: none;"></div>
    {% endif %}
  </div>
  
  <!-- 缩略图 -->
  {% if product.media.size > 1 %}
    <div class="product-gallery__thumbnails product-gallery__thumbnails--{{ thumbnail_position }}">
      {% for media in product.media %}
        <button type="button" 
                class="product-gallery__thumbnail {% if forloop.first %}active{% endif %}"
                data-media-index="{{ forloop.index0 }}"
                data-media-type="{{ media.media_type }}"
                aria-label="查看 {{ media.alt | default: product.title }}">
          
          {% case media.media_type %}
            {% when 'image' %}
              <img src="{{ media.preview_image | image_url: width: 100, height: 100 }}"
                   alt="{{ media.alt | default: product.title }}"
                   class="product-gallery__thumbnail-image">
            
            {% when 'video' %}
              <img src="{{ media.preview_image | image_url: width: 100, height: 100 }}"
                   alt="{{ media.alt | default: product.title }}"
                   class="product-gallery__thumbnail-image">
              <span class="product-gallery__media-icon">{% render 'icon-play' %}</span>
            
            {% when 'external_video' %}
              <img src="{{ media.preview_image | image_url: width: 100, height: 100 }}"
                   alt="{{ media.alt | default: product.title }}"
                   class="product-gallery__thumbnail-image">
              <span class="product-gallery__media-icon">{% render 'icon-play' %}</span>
            
            {% when 'model' %}
              <img src="{{ media.preview_image | image_url: width: 100, height: 100 }}"
                   alt="{{ media.alt | default: product.title }}"
                   class="product-gallery__thumbnail-image">
              <span class="product-gallery__media-icon">{% render 'icon-3d' %}</span>
          {% endcase %}
        </button>
      {% endfor %}
    </div>
  {% endif %}
</div>
 
<script>
// 产品画廊功能
class ProductGallery {
  constructor(element) {
    this.gallery = element
    this.mediaContainer = element.querySelector('[data-media-container]')
    this.thumbnails = element.querySelectorAll('[data-media-index]')
    this.currentMediaIndex = 0
    
    this.init()
  }
  
  init() {
    this.thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => this.switchMedia(index))
    })
    
    // 键盘导航
    this.gallery.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.previousMedia()
      } else if (e.key === 'ArrowRight') {
        this.nextMedia()
      }
    })
  }
  
  switchMedia(index) {
    if (index === this.currentMediaIndex) return
    
    const thumbnail = this.thumbnails[index]
    const mediaType = thumbnail.dataset.mediaType
    
    // 更新活跃缩略图
    this.thumbnails.forEach(thumb => thumb.classList.remove('active'))
    thumbnail.classList.add('active')
    
    // 更新主媒体
    this.updateMainMedia(index, mediaType)
    this.currentMediaIndex = index
  }
  
  updateMainMedia(index, mediaType) {
    // 这里需要根据媒体类型更新主显示区域
    // 实际实现会更复杂，包括图片切换动画等
    const mediaData = window.productMedia[index]
    
    switch(mediaType) {
      case 'image':
        this.displayImage(mediaData)
        break
      case 'video':
        this.displayVideo(mediaData)
        break
      case 'external_video':
        this.displayExternalVideo(mediaData)
        break
      case 'model':
        this.displayModel(mediaData)
        break
    }
  }
  
  previousMedia() {
    const newIndex = this.currentMediaIndex > 0 ? 
      this.currentMediaIndex - 1 : 
      this.thumbnails.length - 1
    this.switchMedia(newIndex)
  }
  
  nextMedia() {
    const newIndex = this.currentMediaIndex < this.thumbnails.length - 1 ? 
      this.currentMediaIndex + 1 : 
      0
    this.switchMedia(newIndex)
  }
}
 
// 初始化产品画廊
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-product-gallery]').forEach(gallery => {
    new ProductGallery(gallery)
  })
})
</script>
```

## 功能性组件[](https://shopify.baoea.com/liquid/custom-snippets#%E5%8A%9F%E8%83%BD%E6%80%A7%E7%BB%84%E4%BB%B6)

### 1\. 搜索建议组件[](https://shopify.baoea.com/liquid/custom-snippets#1-%E6%90%9C%E7%B4%A2%E5%BB%BA%E8%AE%AE%E7%BB%84%E4%BB%B6)

```
<!-- snippets/search-suggestions.liquid -->
{% comment %}
  搜索建议组件
  
  参数:
  - max_suggestions: 最大建议数量 (可选, 默认: 6)
  - show_products: 是否显示产品建议 (可选: true/false)
  - show_collections: 是否显示集合建议 (可选: true/false)
  - show_pages: 是否显示页面建议 (可选: true/false)
{% endcomment %}
 
{% assign max_suggestions = max_suggestions | default: 6 %}
{% assign show_products = show_products | default: true %}
{% assign show_collections = show_collections | default: true %}
{% assign show_pages = show_pages | default: false %}
 
<div class="search-suggestions" data-search-suggestions>
  <div class="search-suggestions__content" data-suggestions-content>
    <!-- 搜索建议内容将通过 JavaScript 动态加载 -->
  </div>
</div>
 
<script>
class SearchSuggestions {
  constructor(element) {
    this.container = element
    this.content = element.querySelector('[data-suggestions-content]')
    this.searchInput = null
    this.debounceTimer = null
    
    this.init()
  }
  
  init() {
    // 查找关联的搜索输入框
    this.searchInput = document.querySelector('[data-search-input]')
    
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.handleInput(e.target.value)
      })
      
      this.searchInput.addEventListener('focus', () => {
        this.show()
      })
      
      this.searchInput.addEventListener('blur', () => {
        setTimeout(() => this.hide(), 200)
      })
    }
  }
  
  handleInput(query) {
    clearTimeout(this.debounceTimer)
    
    if (query.length < 2) {
      this.hide()
      return
    }
    
    this.debounceTimer = setTimeout(() => {
      this.fetchSuggestions(query)
    }, 300)
  }
  
  async fetchSuggestions(query) {
    try {
      const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,collection,page&resources[limit]={{ max_suggestions }}`)
      const data = await response.json()
      
      this.renderSuggestions(data.resources.results)
      this.show()
      
    } catch (error) {
      console.error('获取搜索建议失败:', error)
    }
  }
  
  renderSuggestions(results) {
    let html = ''
    
    {% if show_products %}
    if (results.products && results.products.length > 0) {
      html += '<div class="suggestions-section">'
      html += '<h4 class="suggestions-title">产品</h4>'
      html += '<ul class="suggestions-list">'
      
      results.products.forEach(product => {
        html += `
          <li class="suggestions-item">
            <a href="${product.url}" class="suggestions-link">
              ${product.featured_image ? `<img src="${product.featured_image.url}&width=50" alt="${product.title}" class="suggestions-image">` : ''}
              <div class="suggestions-info">
                <span class="suggestions-text">${product.title}</span>
                <span class="suggestions-price">${this.formatPrice(product.price)}</span>
              </div>
            </a>
          </li>
        `
      })
      
      html += '</ul></div>'
    }
    {% endif %}
    
    {% if show_collections %}
    if (results.collections && results.collections.length > 0) {
      html += '<div class="suggestions-section">'
      html += '<h4 class="suggestions-title">分类</h4>'
      html += '<ul class="suggestions-list">'
      
      results.collections.forEach(collection => {
        html += `
          <li class="suggestions-item">
            <a href="${collection.url}" class="suggestions-link">
              ${collection.featured_image ? `<img src="${collection.featured_image.url}&width=50" alt="${collection.title}" class="suggestions-image">` : ''}
              <span class="suggestions-text">${collection.title}</span>
            </a>
          </li>
        `
      })
      
      html += '</ul></div>'
    }
    {% endif %}
    
    {% if show_pages %}
    if (results.pages && results.pages.length > 0) {
      html += '<div class="suggestions-section">'
      html += '<h4 class="suggestions-title">页面</h4>'
      html += '<ul class="suggestions-list">'
      
      results.pages.forEach(page => {
        html += `
          <li class="suggestions-item">
            <a href="${page.url}" class="suggestions-link">
              <span class="suggestions-text">${page.title}</span>
            </a>
          </li>
        `
      })
      
      html += '</ul></div>'
    }
    {% endif %}
    
    this.content.innerHTML = html
  }
  
  formatPrice(priceInCents) {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(priceInCents / 100)
  }
  
  show() {
    this.container.classList.add('active')
  }
  
  hide() {
    this.container.classList.remove('active')
  }
}
 
// 初始化搜索建议
document.addEventListener('DOMContentLoaded', () => {
  const suggestions = document.querySelector('[data-search-suggestions]')
  if (suggestions) {
    new SearchSuggestions(suggestions)
  }
})
</script>
```

### 2\. 愿望清单组件[](https://shopify.baoea.com/liquid/custom-snippets#2-%E6%84%BF%E6%9C%9B%E6%B8%85%E5%8D%95%E7%BB%84%E4%BB%B6)

```
<!-- snippets/wishlist-button.liquid -->
{% comment %}
  愿望清单按钮组件
  
  参数:
  - product: 产品对象 (必需)
  - style: 按钮样式 (可选: 'icon', 'text', 'both')
  - size: 按钮尺寸 (可选: 'small', 'medium', 'large')
{% endcomment %}
 
{% assign style = style | default: 'icon' %}
{% assign size = size | default: 'medium' %}
 
<button type="button" 
        class="wishlist-btn wishlist-btn--{{ style }} wishlist-btn--{{ size }}"
        data-wishlist-toggle="{{ product.id }}"
        data-product-handle="{{ product.handle }}"
        aria-label="{% if style == 'icon' %}添加到愿望清单{% endif %}">
  
  <span class="wishlist-btn__icon" data-wishlist-icon>
    {% render 'icon-heart' %}
  </span>
  
  {% if style == 'text' or style == 'both' %}
    <span class="wishlist-btn__text" data-wishlist-text>
      收藏
    </span>
  {% endif %}
</button>
 
<script>
class WishlistButton {
  constructor(element) {
    this.button = element
    this.productId = element.dataset.wishlistToggle
    this.productHandle = element.dataset.productHandle
    this.icon = element.querySelector('[data-wishlist-icon]')
    this.text = element.querySelector('[data-wishlist-text]')
    
    this.init()
  }
  
  init() {
    this.button.addEventListener('click', () => {
      this.toggle()
    })
    
    // 检查初始状态
    this.updateState()
  }
  
  toggle() {
    const wishlist = this.getWishlist()
    const isInWishlist = wishlist.includes(this.productId)
    
    if (isInWishlist) {
      this.removeFromWishlist()
    } else {
      this.addToWishlist()
    }
  }
  
  addToWishlist() {
    const wishlist = this.getWishlist()
    wishlist.push(this.productId)
    this.saveWishlist(wishlist)
    this.updateState()
    
    // 触发自定义事件
    this.dispatchEvent('wishlist:added', {
      productId: this.productId,
      productHandle: this.productHandle
    })
    
    this.showNotification('已添加到愿望清单')
  }
  
  removeFromWishlist() {
    let wishlist = this.getWishlist()
    wishlist = wishlist.filter(id => id !== this.productId)
    this.saveWishlist(wishlist)
    this.updateState()
    
    // 触发自定义事件
    this.dispatchEvent('wishlist:removed', {
      productId: this.productId,
      productHandle: this.productHandle
    })
    
    this.showNotification('已从愿望清单移除')
  }
  
  updateState() {
    const wishlist = this.getWishlist()
    const isInWishlist = wishlist.includes(this.productId)
    
    this.button.classList.toggle('active', isInWishlist)
    this.button.setAttribute('aria-pressed', isInWishlist)
    
    if (this.text) {
      this.text.textContent = isInWishlist ? '已收藏' : '收藏'
    }
  }
  
  getWishlist() {
    try {
      return JSON.parse(localStorage.getItem('shopify_wishlist') || '[]')
    } catch {
      return []
    }
  }
  
  saveWishlist(wishlist) {
    localStorage.setItem('shopify_wishlist', JSON.stringify(wishlist))
  }
  
  dispatchEvent(eventName, detail) {
    const event = new CustomEvent(eventName, { detail })
    document.dispatchEvent(event)
  }
  
  showNotification(message) {
    // 这里可以集成您的通知系统
    console.log(message)
  }
}
 
// 初始化所有愿望清单按钮
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-wishlist-toggle]').forEach(button => {
    new WishlistButton(button)
  })
})
 
// 监听愿望清单事件
document.addEventListener('wishlist:added', (e) => {
  console.log('产品已添加到愿望清单:', e.detail)
})
 
document.addEventListener('wishlist:removed', (e) => {
  console.log('产品已从愿望清单移除:', e.detail)
})
</script>
```

## 下一步学习[](https://shopify.baoea.com/liquid/custom-snippets#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

掌握自定义代码片段开发后，建议继续学习：

1.  [主题设置配置](https://shopify.baoea.com/liquid/theme-settings) - 全局主题配置
2.  [响应式设计实现](https://shopify.baoea.com/liquid/responsive-design) - 移动优先设计
3.  [电商功能实现](https://shopify.baoea.com/liquid/ecommerce-features) - 高级电商功能
4.  [第三方集成](https://shopify.baoea.com/liquid/third-party-integrations) - 外部服务集成
5.  [测试和部署](https://shopify.baoea.com/liquid/testing-deployment) - 质量保证流程

代码片段是构建模块化、可维护主题的基础！
