---
source_url: "https://shopify.baoea.com/liquid/ecommerce-features"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:47"
fetch_method: "http"
content_hash: "463ce9ba54e7b30d29e03533fe81ba28321e72945b69bb6c6d667095e0f4148c"
discovered_via: ["sitemap", "internal_link"]
---
## 电商功能实现

本指南将详细介绍如何在 Shopify 主题中实现高级电商功能，提升用户购买体验和转化率。

## 高级购物车功能[](https://shopify.baoea.com/liquid/ecommerce-features#%E9%AB%98%E7%BA%A7%E8%B4%AD%E7%89%A9%E8%BD%A6%E5%8A%9F%E8%83%BD)

### 1\. 智能购物车抽屉[](https://shopify.baoea.com/liquid/ecommerce-features#1-%E6%99%BA%E8%83%BD%E8%B4%AD%E7%89%A9%E8%BD%A6%E6%8A%BD%E5%B1%89)

```
<!-- snippets/smart-cart-drawer.liquid -->
<div class="cart-drawer" data-cart-drawer>
  <div class="cart-drawer__overlay" data-cart-overlay></div>
  
  <div class="cart-drawer__content">
    <div class="cart-drawer__header">
      <h2 class="cart-drawer__title">
        购物车 (<span data-cart-count>{{ cart.item_count }}</span>)
      </h2>
      <button class="cart-drawer__close" data-cart-close>
        {% render 'icon-close' %}
      </button>
    </div>
    
    <div class="cart-drawer__body">
      {% if cart.item_count > 0 %}
        <div class="cart-items" data-cart-items>
          {% for item in cart.items %}
            {% render 'cart-item', item: item %}
          {% endfor %}
        </div>
        
        <!-- 免费配送进度条 -->
        {% if settings.free_shipping_threshold > 0 %}
          {% render 'shipping-progress-bar' %}
        {% endif %}
        
        <!-- 购物车总计 -->
        <div class="cart-summary">
          <div class="cart-subtotal">
            <span>小计:</span>
            <span data-cart-subtotal>{{ cart.total_price | money }}</span>
          </div>
          
          {% if cart.total_discounts > 0 %}
            <div class="cart-discounts">
              <span>折扣:</span>
              <span>-{{ cart.total_discounts | money }}</span>
            </div>
          {% endif %}
        </div>
        
        <!-- 结账按钮 -->
        <div class="cart-actions">
          <button class="btn btn--primary btn--full" data-cart-checkout>
            立即结账 - {{ cart.total_price | money }}
          </button>
          <a href="/cart" class="btn btn--secondary btn--full">
            查看完整购物车
          </a>
        </div>
        
        <!-- 相关推荐 -->
        {% render 'cart-recommendations' %}
        
      {% else %}
        <div class="cart-empty">
          {% render 'cart-empty-state' %}
        </div>
      {% endif %}
    </div>
  </div>
</div>
```

### 2\. 动态购物车更新[](https://shopify.baoea.com/liquid/ecommerce-features#2-%E5%8A%A8%E6%80%81%E8%B4%AD%E7%89%A9%E8%BD%A6%E6%9B%B4%E6%96%B0)

```
// assets/cart-manager.js
class CartManager {
  constructor() {
    this.cart = null
    this.listeners = []
    this.init()
  }
  
  init() {
    this.fetchCart()
    this.bindEvents()
  }
  
  async fetchCart() {
    try {
      const response = await fetch('/cart.js')
      this.cart = await response.json()
      this.notifyListeners('cart:updated', this.cart)
      return this.cart
    } catch (error) {
      console.error('获取购物车失败:', error)
    }
  }
  
  async addItem(variantId, quantity = 1, properties = {}) {
    try {
      this.notifyListeners('cart:adding', { variantId, quantity })
      
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: variantId,
          quantity: quantity,
          properties: properties
        })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '添加到购物车失败')
      }
      
      await this.fetchCart()
      this.notifyListeners('cart:added', { variantId, quantity })
      
    } catch (error) {
      this.notifyListeners('cart:error', error.message)
      throw error
    }
  }
  
  async updateItem(key, quantity) {
    try {
      this.notifyListeners('cart:updating', { key, quantity })
      
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: quantity })
      })
      
      this.cart = await response.json()
      this.notifyListeners('cart:updated', this.cart)
      
    } catch (error) {
      this.notifyListeners('cart:error', '更新购物车失败')
      throw error
    }
  }
  
  async removeItem(key) {
    return this.updateItem(key, 0)
  }
  
  on(event, callback) {
    this.listeners.push({ event, callback })
  }
  
  notifyListeners(event, data) {
    this.listeners
      .filter(listener => listener.event === event)
      .forEach(listener => listener.callback(data))
  }
  
  getShippingProgress() {
    const threshold = window.theme.freeShippingThreshold || 0
    const progress = Math.min((this.cart.total_price / threshold) * 100, 100)
    const remaining = Math.max(threshold - this.cart.total_price, 0)
    
    return { progress, remaining, qualified: remaining === 0 }
  }
}
 
// 全局购物车管理器
window.CartManager = new CartManager()
```

## 产品变体选择器[](https://shopify.baoea.com/liquid/ecommerce-features#%E4%BA%A7%E5%93%81%E5%8F%98%E4%BD%93%E9%80%89%E6%8B%A9%E5%99%A8)

### 1\. 智能变体选择器[](https://shopify.baoea.com/liquid/ecommerce-features#1-%E6%99%BA%E8%83%BD%E5%8F%98%E4%BD%93%E9%80%89%E6%8B%A9%E5%99%A8)

```
<!-- snippets/variant-selector-smart.liquid -->
<div class="variant-selector" data-variant-selector data-product-id="{{ product.id }}">
  {% for option in product.options_with_values %}
    <div class="option-group" data-option-index="{{ forloop.index0 }}">
      <label class="option-label">{{ option.name }}</label>
      
      {% assign option_name = option.name | downcase %}
      
      {% if option_name contains 'color' or option_name contains '颜色' %}
        <!-- 颜色选择器 -->
        <div class="color-options">
          {% for value in option.values %}
            {% assign color_class = value | handle %}
            <label class="color-option">
              <input type="radio" 
                     name="option-{{ forloop.parentloop.index0 }}"
                     value="{{ value }}"
                     data-option-value
                     {% if forloop.first %}checked{% endif %}>
              <span class="color-swatch color-swatch--{{ color_class }}"
                    style="background-color: {{ value | handle }};"
                    title="{{ value }}">
                <span class="sr-only">{{ value }}</span>
              </span>
            </label>
          {% endfor %}
        </div>
        
      {% elsif option_name contains 'size' or option_name contains '尺寸' %}
        <!-- 尺寸选择器 -->
        <div class="size-options">
          {% for value in option.values %}
            <label class="size-option">
              <input type="radio" 
                     name="option-{{ forloop.parentloop.index0 }}"
                     value="{{ value }}"
                     data-option-value
                     {% if forloop.first %}checked{% endif %}>
              <span class="size-label">{{ value }}</span>
            </label>
          {% endfor %}
        </div>
        
      {% else %}
        <!-- 下拉选择器 -->
        <select class="option-select" data-option-value>
          {% for value in option.values %}
            <option value="{{ value }}" {% if forloop.first %}selected{% endif %}>
              {{ value }}
            </option>
          {% endfor %}
        </select>
      {% endif %}
    </div>
  {% endfor %}
  
  <!-- 变体信息显示 -->
  <div class="variant-info" data-variant-info>
    <div class="variant-price" data-variant-price>
      {{ product.price | money }}
    </div>
    
    <div class="variant-availability" data-variant-availability>
      {% if product.available %}
        <span class="in-stock">有库存</span>
      {% else %}
        <span class="out-of-stock">缺货</span>
      {% endif %}
    </div>
    
    <div class="variant-sku" data-variant-sku style="display: none;">
      SKU: <span></span>
    </div>
  </div>
  
  <input type="hidden" name="id" data-variant-id value="{{ product.selected_or_first_available_variant.id }}">
</div>
 
<script>
// 变体选择器
class VariantSelector {
  constructor(element) {
    this.container = element
    this.productId = element.dataset.productId
    this.options = element.querySelectorAll('[data-option-value]')
    this.variantIdInput = element.querySelector('[data-variant-id]')
    this.priceElement = element.querySelector('[data-variant-price]')
    this.availabilityElement = element.querySelector('[data-variant-availability]')
    this.skuElement = element.querySelector('[data-variant-sku]')
    
    this.variants = window.productVariants || []
    this.currentVariant = this.variants[0]
    
    this.init()
  }
  
  init() {
    this.options.forEach(option => {
      option.addEventListener('change', () => this.onOptionChange())
    })
    
    this.updateVariantInfo()
  }
  
  onOptionChange() {
    const selectedOptions = this.getSelectedOptions()
    const variant = this.findVariant(selectedOptions)
    
    if (variant) {
      this.currentVariant = variant
      this.updateVariantInfo()
      this.updateAvailableOptions()
    }
    
    this.dispatchVariantChange()
  }
  
  getSelectedOptions() {
    return Array.from(this.options).map(option => {
      if (option.type === 'radio') {
        const checked = this.container.querySelector(`input[name="${option.name}"]:checked`)
        return checked ? checked.value : null
      }
      return option.value
    })
  }
  
  findVariant(selectedOptions) {
    return this.variants.find(variant => {
      return variant.options.every((option, index) => {
        return option === selectedOptions[index]
      })
    })
  }
  
  updateVariantInfo() {
    if (!this.currentVariant) return
    
    // 更新价格
    if (this.priceElement) {
      let priceHtml = this.formatMoney(this.currentVariant.price)
      
      if (this.currentVariant.compare_at_price > this.currentVariant.price) {
        priceHtml = `
          <span class="sale-price">${this.formatMoney(this.currentVariant.price)}</span>
          <span class="compare-price">${this.formatMoney(this.currentVariant.compare_at_price)}</span>
        `
      }
      
      this.priceElement.innerHTML = priceHtml
    }
    
    // 更新库存状态
    if (this.availabilityElement) {
      const available = this.currentVariant.available
      this.availabilityElement.innerHTML = available 
        ? '<span class="in-stock">有库存</span>'
        : '<span class="out-of-stock">缺货</span>'
    }
    
    // 更新SKU
    if (this.skuElement && this.currentVariant.sku) {
      this.skuElement.querySelector('span').textContent = this.currentVariant.sku
      this.skuElement.style.display = 'block'
    }
    
    // 更新隐藏的变体ID
    if (this.variantIdInput) {
      this.variantIdInput.value = this.currentVariant.id
    }
  }
  
  updateAvailableOptions() {
    // 禁用不可用的选项组合
    this.options.forEach((option, optionIndex) => {
      const optionValues = option.type === 'radio' 
        ? this.container.querySelectorAll(`input[name="${option.name}"]`)
        : [option]
      
      optionValues.forEach(optionValue => {
        const testOptions = this.getSelectedOptions()
        testOptions[optionIndex] = optionValue.value
        
        const hasAvailableVariant = this.variants.some(variant => {
          return variant.available && variant.options.every((opt, idx) => {
            return idx === optionIndex || opt === testOptions[idx]
          })
        })
        
        optionValue.disabled = !hasAvailableVariant
        
        if (option.type === 'radio') {
          optionValue.closest('label').classList.toggle('disabled', !hasAvailableVariant)
        }
      })
    })
  }
  
  formatMoney(cents) {
    return (cents / 100).toLocaleString('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    })
  }
  
  dispatchVariantChange() {
    const event = new CustomEvent('variant:changed', {
      detail: { variant: this.currentVariant }
    })
    this.container.dispatchEvent(event)
  }
}
 
// 初始化变体选择器
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-variant-selector]').forEach(selector => {
    new VariantSelector(selector)
  })
})
</script>
```

## 高级搜索功能[](https://shopify.baoea.com/liquid/ecommerce-features#%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2%E5%8A%9F%E8%83%BD)

### 1\. 实时搜索系统[](https://shopify.baoea.com/liquid/ecommerce-features#1-%E5%AE%9E%E6%97%B6%E6%90%9C%E7%B4%A2%E7%B3%BB%E7%BB%9F)

```
<!-- snippets/instant-search.liquid -->
<div class="instant-search" data-instant-search>
  <form class="search-form" data-search-form>
    <div class="search-input-wrapper">
      <input type="search" 
             class="search-input"
             placeholder="搜索商品..."
             data-search-input
             autocomplete="off">
      <button type="submit" class="search-submit">
        {% render 'icon-search' %}
      </button>
    </div>
  </form>
  
  <div class="search-results" data-search-results style="display: none;">
    <div class="search-loading" data-search-loading>
      <div class="loading-spinner"></div>
      <span>搜索中...</span>
    </div>
    
    <div class="search-content" data-search-content></div>
    
    <div class="search-footer" data-search-footer style="display: none;">
      <a href="#" class="search-view-all" data-search-view-all>
        查看所有结果
      </a>
    </div>
  </div>
</div>
 
<script>
class InstantSearch {
  constructor(element) {
    this.container = element
    this.form = element.querySelector('[data-search-form]')
    this.input = element.querySelector('[data-search-input]')
    this.results = element.querySelector('[data-search-results]')
    this.loading = element.querySelector('[data-search-loading]')
    this.content = element.querySelector('[data-search-content]')
    this.footer = element.querySelector('[data-search-footer]')
    this.viewAllLink = element.querySelector('[data-search-view-all]')
    
    this.debounceTimer = null
    this.currentQuery = ''
    this.cache = new Map()
    
    this.init()
  }
  
  init() {
    this.input.addEventListener('input', (e) => {
      this.handleInput(e.target.value)
    })
    
    this.input.addEventListener('focus', () => {
      if (this.currentQuery) {
        this.showResults()
      }
    })
    
    this.input.addEventListener('blur', () => {
      setTimeout(() => this.hideResults(), 200)
    })
    
    this.form.addEventListener('submit', (e) => {
      e.preventDefault()
      this.redirectToSearch()
    })
    
    // 键盘导航
    this.input.addEventListener('keydown', (e) => {
      this.handleKeydown(e)
    })
  }
  
  handleInput(query) {
    clearTimeout(this.debounceTimer)
    
    this.currentQuery = query.trim()
    
    if (this.currentQuery.length < 2) {
      this.hideResults()
      return
    }
    
    this.debounceTimer = setTimeout(() => {
      this.performSearch(this.currentQuery)
    }, 300)
  }
  
  async performSearch(query) {
    if (this.cache.has(query)) {
      this.displayResults(this.cache.get(query), query)
      return
    }
    
    this.showLoading()
    
    try {
      const response = await fetch(
        `/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=8`
      )
      
      const data = await response.json()
      const results = data.resources.results
      
      this.cache.set(query, results)
      this.displayResults(results, query)
      
    } catch (error) {
      console.error('搜索失败:', error)
      this.hideResults()
    }
  }
  
  displayResults(results, query) {
    this.hideLoading()
    
    if (!results.products || results.products.length === 0) {
      this.content.innerHTML = `
        <div class="search-empty">
          <p>没有找到相关商品</p>
        </div>
      `
    } else {
      const productsHtml = results.products.map(product => `
        <a href="${product.url}" class="search-result-item">
          <img src="${product.featured_image ? product.featured_image.url + '&width=60' : ''}" 
               alt="${product.title}" 
               class="search-result-image"
               loading="lazy">
          <div class="search-result-info">
            <h4 class="search-result-title">${this.highlightQuery(product.title, query)}</h4>
            <p class="search-result-price">${this.formatMoney(product.price)}</p>
          </div>
        </a>
      `).join('')
      
      this.content.innerHTML = `
        <div class="search-results-grid">
          ${productsHtml}
        </div>
      `
    }
    
    // 更新查看全部链接
    this.viewAllLink.href = `/search?q=${encodeURIComponent(query)}`
    this.footer.style.display = 'block'
    
    this.showResults()
  }
  
  highlightQuery(text, query) {
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }
  
  formatMoney(cents) {
    return (cents / 100).toLocaleString('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    })
  }
  
  showLoading() {
    this.loading.style.display = 'flex'
    this.content.style.display = 'none'
    this.footer.style.display = 'none'
    this.showResults()
  }
  
  hideLoading() {
    this.loading.style.display = 'none'
    this.content.style.display = 'block'
  }
  
  showResults() {
    this.results.style.display = 'block'
  }
  
  hideResults() {
    this.results.style.display = 'none'
  }
  
  redirectToSearch() {
    if (this.currentQuery) {
      window.location.href = `/search?q=${encodeURIComponent(this.currentQuery)}`
    }
  }
  
  handleKeydown(e) {
    if (e.key === 'Escape') {
      this.hideResults()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      this.redirectToSearch()
    }
  }
}
 
// 初始化即时搜索
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-instant-search]').forEach(search => {
    new InstantSearch(search)
  })
})
</script>
```

## 愿望清单功能[](https://shopify.baoea.com/liquid/ecommerce-features#%E6%84%BF%E6%9C%9B%E6%B8%85%E5%8D%95%E5%8A%9F%E8%83%BD)

### 1\. 本地存储愿望清单[](https://shopify.baoea.com/liquid/ecommerce-features#1-%E6%9C%AC%E5%9C%B0%E5%AD%98%E5%82%A8%E6%84%BF%E6%9C%9B%E6%B8%85%E5%8D%95)

```
// assets/wishlist.js
class Wishlist {
  constructor() {
    this.items = this.load()
    this.listeners = []
    this.init()
  }
  
  init() {
    this.bindEvents()
    this.updateUI()
  }
  
  bindEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-wishlist-add]')) {
        e.preventDefault()
        const productId = e.target.dataset.wishlistAdd
        this.add(productId)
      }
      
      if (e.target.matches('[data-wishlist-remove]')) {
        e.preventDefault()
        const productId = e.target.dataset.wishlistRemove
        this.remove(productId)
      }
      
      if (e.target.matches('[data-wishlist-toggle]')) {
        e.preventDefault()
        const productId = e.target.dataset.wishlistToggle
        this.toggle(productId)
      }
    })
  }
  
  add(productId) {
    if (!this.items.includes(productId)) {
      this.items.push(productId)
      this.save()
      this.updateUI()
      this.notify('added', productId)
      this.showNotification('已添加到愿望清单')
    }
  }
  
  remove(productId) {
    const index = this.items.indexOf(productId)
    if (index > -1) {
      this.items.splice(index, 1)
      this.save()
      this.updateUI()
      this.notify('removed', productId)
      this.showNotification('已从愿望清单移除')
    }
  }
  
  toggle(productId) {
    if (this.has(productId)) {
      this.remove(productId)
    } else {
      this.add(productId)
    }
  }
  
  has(productId) {
    return this.items.includes(productId)
  }
  
  count() {
    return this.items.length
  }
  
  clear() {
    this.items = []
    this.save()
    this.updateUI()
    this.notify('cleared')
  }
  
  load() {
    try {
      const stored = localStorage.getItem('shopify_wishlist')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }
  
  save() {
    localStorage.setItem('shopify_wishlist', JSON.stringify(this.items))
  }
  
  updateUI() {
    // 更新愿望清单计数
    document.querySelectorAll('[data-wishlist-count]').forEach(el => {
      el.textContent = this.count()
    })
    
    // 更新按钮状态
    document.querySelectorAll('[data-wishlist-toggle]').forEach(btn => {
      const productId = btn.dataset.wishlistToggle
      const isInWishlist = this.has(productId)
      
      btn.classList.toggle('active', isInWishlist)
      btn.setAttribute('aria-pressed', isInWishlist)
      
      const text = btn.querySelector('[data-wishlist-text]')
      if (text) {
        text.textContent = isInWishlist ? '已收藏' : '收藏'
      }
    })
    
    // 更新愿望清单页面
    this.updateWishlistPage()
  }
  
  async updateWishlistPage() {
    const container = document.querySelector('[data-wishlist-products]')
    if (!container) return
    
    if (this.items.length === 0) {
      container.innerHTML = `
        <div class="wishlist-empty">
          <h3>愿望清单是空的</h3>
          <p>添加一些商品到愿望清单吧</p>
          <a href="/collections" class="btn btn--primary">继续购物</a>
        </div>
      `
      return
    }
    
    try {
      const productPromises = this.items.map(id => 
        fetch(`/products/${id}.js`).then(r => r.json())
      )
      
      const products = await Promise.all(productPromises)
      
      container.innerHTML = `
        <div class="wishlist-grid">
          ${products.map(product => this.renderWishlistItem(product)).join('')}
        </div>
      `
      
    } catch (error) {
      console.error('加载愿望清单商品失败:', error)
    }
  }
  
  renderWishlistItem(product) {
    return `
      <div class="wishlist-item">
        <a href="/products/${product.handle}" class="wishlist-item__image">
          <img src="${product.featured_image}" alt="${product.title}" loading="lazy">
        </a>
        <div class="wishlist-item__info">
          <h4 class="wishlist-item__title">
            <a href="/products/${product.handle}">${product.title}</a>
          </h4>
          <p class="wishlist-item__price">${this.formatMoney(product.price)}</p>
          <div class="wishlist-item__actions">
            <button class="btn btn--primary" onclick="CartManager.addItem(${product.variants[0].id})">
              加入购物车
            </button>
            <button class="btn btn--outline" data-wishlist-remove="${product.id}">
              移除
            </button>
          </div>
        </div>
      </div>
    `
  }
  
  formatMoney(cents) {
    return (cents / 100).toLocaleString('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    })
  }
  
  notify(action, productId) {
    this.listeners.forEach(listener => {
      listener({ action, productId, items: this.items })
    })
  }
  
  on(callback) {
    this.listeners.push(callback)
  }
  
  showNotification(message) {
    const notification = document.createElement('div')
    notification.className = 'notification notification--success'
    notification.textContent = message
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.classList.add('notification--show')
    }, 100)
    
    setTimeout(() => {
      notification.classList.remove('notification--show')
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }
}
 
// 全局愿望清单
window.Wishlist = new Wishlist()
```

## 客户评价系统[](https://shopify.baoea.com/liquid/ecommerce-features#%E5%AE%A2%E6%88%B7%E8%AF%84%E4%BB%B7%E7%B3%BB%E7%BB%9F)

### 1\. 评价显示组件[](https://shopify.baoea.com/liquid/ecommerce-features#1-%E8%AF%84%E4%BB%B7%E6%98%BE%E7%A4%BA%E7%BB%84%E4%BB%B6)

```
<!-- snippets/product-reviews.liquid -->
<div class="product-reviews" data-product-reviews data-product-id="{{ product.id }}">
  <div class="reviews-summary">
    <div class="reviews-rating">
      <div class="rating-stars">
        {% assign rating = product.metafields.reviews.rating | default: 0 %}
        {% render 'star-rating', rating: rating %}
      </div>
      <span class="rating-average">{{ rating | round: 1 }}</span>
      <span class="rating-count">({{ product.metafields.reviews.count | default: 0 }} 条评价)</span>
    </div>
    
    <button class="btn btn--outline" data-write-review>
      写评价
    </button>
  </div>
  
  <div class="reviews-list" data-reviews-list>
    <!-- 评价列表将通过JavaScript加载 -->
  </div>
  
  <div class="reviews-pagination" data-reviews-pagination style="display: none;">
    <!-- 分页控件 -->
  </div>
</div>
 
<!-- 评价表单模态框 -->
<div class="review-modal" data-review-modal style="display: none;">
  <div class="review-modal__overlay"></div>
  <div class="review-modal__content">
    <div class="review-modal__header">
      <h3>写评价</h3>
      <button class="review-modal__close" data-review-modal-close>
        {% render 'icon-close' %}
      </button>
    </div>
    
    <form class="review-form" data-review-form>
      <div class="form-group">
        <label>评分</label>
        <div class="rating-input" data-rating-input>
          {% for i in (1..5) %}
            <button type="button" class="rating-star" data-rating="{{ i }}">
              ★
            </button>
          {% endfor %}
        </div>
        <input type="hidden" name="rating" data-rating-value required>
      </div>
      
      <div class="form-group">
        <label for="review-title">评价标题</label>
        <input type="text" id="review-title" name="title" required>
      </div>
      
      <div class="form-group">
        <label for="review-content">评价内容</label>
        <textarea id="review-content" name="content" rows="4" required></textarea>
      </div>
      
      <div class="form-group">
        <label for="reviewer-name">您的姓名</label>
        <input type="text" id="reviewer-name" name="name" required>
      </div>
      
      <div class="form-group">
        <label for="reviewer-email">邮箱</label>
        <input type="email" id="reviewer-email" name="email" required>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn btn--primary">
          提交评价
        </button>
        <button type="button" class="btn btn--secondary" data-review-modal-close>
          取消
        </button>
      </div>
    </form>
  </div>
</div>
 
<script>
class ProductReviews {
  constructor(element) {
    this.container = element
    this.productId = element.dataset.productId
    this.reviewsList = element.querySelector('[data-reviews-list]')
    this.writeReviewBtn = element.querySelector('[data-write-review]')
    this.modal = document.querySelector('[data-review-modal]')
    this.form = document.querySelector('[data-review-form]')
    
    this.currentPage = 1
    this.reviews = []
    
    this.init()
  }
  
  init() {
    this.loadReviews()
    this.bindEvents()
  }
  
  bindEvents() {
    this.writeReviewBtn?.addEventListener('click', () => {
      this.openReviewModal()
    })
    
    this.modal?.querySelector('[data-review-modal-close]').addEventListener('click', () => {
      this.closeReviewModal()
    })
    
    this.modal?.querySelector('.review-modal__overlay').addEventListener('click', () => {
      this.closeReviewModal()
    })
    
    // 评分输入
    this.modal?.querySelectorAll('[data-rating]').forEach(star => {
      star.addEventListener('click', (e) => {
        this.setRating(parseInt(e.target.dataset.rating))
      })
    })
    
    this.form?.addEventListener('submit', (e) => {
      e.preventDefault()
      this.submitReview()
    })
  }
  
  async loadReviews() {
    try {
      // 这里需要集成您选择的评价系统API
      // 例如：Judge.me, Yotpo, 或自定义评价系统
      const response = await fetch(`/apps/reviews/api/products/${this.productId}/reviews`)
      const data = await response.json()
      
      this.reviews = data.reviews
      this.renderReviews()
      
    } catch (error) {
      console.error('加载评价失败:', error)
    }
  }
  
  renderReviews() {
    if (this.reviews.length === 0) {
      this.reviewsList.innerHTML = `
        <div class="reviews-empty">
          <p>暂无评价，成为第一个评价的用户吧！</p>
        </div>
      `
      return
    }
    
    const reviewsHtml = this.reviews.map(review => `
      <div class="review-item">
        <div class="review-header">
          <div class="review-rating">
            ${this.renderStars(review.rating)}
          </div>
          <div class="review-meta">
            <span class="review-author">${review.author}</span>
            <span class="review-date">${this.formatDate(review.created_at)}</span>
          </div>
        </div>
        
        <div class="review-content">
          <h4 class="review-title">${review.title}</h4>
          <p class="review-text">${review.content}</p>
        </div>
        
        <div class="review-actions">
          <button class="review-helpful" data-review-helpful="${review.id}">
            有帮助 (${review.helpful_count || 0})
          </button>
        </div>
      </div>
    `).join('')
    
    this.reviewsList.innerHTML = reviewsHtml
  }
  
  renderStars(rating) {
    let stars = ''
    for (let i = 1; i <= 5; i++) {
      stars += `<span class="star ${i <= rating ? 'filled' : ''}">★</span>`
    }
    return stars
  }
  
  openReviewModal() {
    this.modal.style.display = 'block'
    document.body.style.overflow = 'hidden'
  }
  
  closeReviewModal() {
    this.modal.style.display = 'none'
    document.body.style.overflow = ''
    this.form.reset()
    this.resetRating()
  }
  
  setRating(rating) {
    const stars = this.modal.querySelectorAll('[data-rating]')
    const ratingInput = this.modal.querySelector('[data-rating-value]')
    
    stars.forEach((star, index) => {
      star.classList.toggle('active', index < rating)
    })
    
    ratingInput.value = rating
  }
  
  resetRating() {
    const stars = this.modal.querySelectorAll('[data-rating]')
    stars.forEach(star => star.classList.remove('active'))
    this.modal.querySelector('[data-rating-value]').value = ''
  }
  
  async submitReview() {
    const formData = new FormData(this.form)
    
    try {
      const response = await fetch('/apps/reviews/api/reviews', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        this.closeReviewModal()
        this.showNotification('评价提交成功，审核后将显示')
        // 重新加载评价
        this.loadReviews()
      } else {
        throw new Error('提交失败')
      }
      
    } catch (error) {
      this.showNotification('提交失败，请重试', 'error')
    }
  }
  
  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN')
  }
  
  showNotification(message, type = 'success') {
    // 显示通知的实现
    console.log(`${type}: ${message}`)
  }
}
 
// 初始化产品评价
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-product-reviews]').forEach(reviews => {
    new ProductReviews(reviews)
  })
})
</script>
```

## 下一步学习[](https://shopify.baoea.com/liquid/ecommerce-features#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

掌握电商功能实现后，建议继续学习：

1.  [第三方集成](https://shopify.baoea.com/liquid/third-party-integrations) - 外部服务集成
2.  [测试和部署](https://shopify.baoea.com/liquid/testing-deployment) - 质量保证流程

高级电商功能是提升用户体验和转化率的关键！
