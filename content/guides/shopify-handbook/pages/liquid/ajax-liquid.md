---
source_url: "https://shopify.baoea.com/liquid/ajax-liquid"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:36"
fetch_method: "http"
content_hash: "388650d3d753e661586511b1a4fac510ad1c86e0ee452fb18c8bb5b91330635d"
discovered_via: ["sitemap", "internal_link"]
---
## Ajax 与 Liquid

Ajax 技术让您能够在不重新加载整个页面的情况下动态更新内容，提供更流畅的用户体验。结合 Liquid 模板，您可以构建高度交互的电商功能。

## 基础 Ajax 概念[](https://shopify.baoea.com/liquid/ajax-liquid#%E5%9F%BA%E7%A1%80-ajax-%E6%A6%82%E5%BF%B5)

### Shopify Ajax API[](https://shopify.baoea.com/liquid/ajax-liquid#shopify-ajax-api)

```
<!-- Ajax API 端点 -->
<script>
// Shopify 提供的主要 Ajax 端点
const SHOPIFY_AJAX_ENDPOINTS = {
  cart: '/cart.js',           // 获取购物车信息
  cartAdd: '/cart/add.js',    // 添加商品到购物车
  cartUpdate: '/cart/update.js', // 更新购物车
  cartChange: '/cart/change.js', // 修改单个商品
  cartClear: '/cart/clear.js',   // 清空购物车
  products: '/products/{handle}.js', // 获取产品信息
  recommendations: '/recommendations/products.json', // 产品推荐
  search: '/search/suggest.json' // 搜索建议
}
 
// 基础 Ajax 请求函数
function shopifyAjax(url, options = {}) {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
  
  return fetch(url, { ...defaultOptions, ...options })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
}
</script>
```

## 购物车 Ajax 功能[](https://shopify.baoea.com/liquid/ajax-liquid#%E8%B4%AD%E7%89%A9%E8%BD%A6-ajax-%E5%8A%9F%E8%83%BD)

### 动态添加商品[](https://shopify.baoea.com/liquid/ajax-liquid#%E5%8A%A8%E6%80%81%E6%B7%BB%E5%8A%A0%E5%95%86%E5%93%81)

```
<!-- Ajax 添加商品表单 -->
<form class="ajax-product-form" data-product-id="{{ product.id }}">
  <div class="variant-selector">
    <select name="id" class="variant-select">
      {% for variant in product.variants %}
        <option value="{{ variant.id }}" 
                {% unless variant.available %}disabled{% endunless %}
                data-price="{{ variant.price }}"
                data-inventory="{{ variant.inventory_quantity }}">
          {{ variant.title }}
          {% unless variant.available %} - 缺货{% endunless %}
        </option>
      {% endfor %}
    </select>
  </div>
  
  <div class="quantity-selector">
    <input type="number" name="quantity" value="1" min="1" class="quantity-input">
  </div>
  
  <button type="submit" class="btn add-to-cart-ajax" data-loading-text="添加中...">
    <span class="btn-text">加入购物车</span>
    <span class="btn-loading" style="display: none;">
      <svg class="spinner" width="20" height="20" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
      </svg>
    </span>
  </button>
</form>
 
<script>
document.querySelectorAll('.ajax-product-form').forEach(form => {
  form.addEventListener('submit', async function(e) {
    e.preventDefault()
    
    const formData = new FormData(this)
    const button = this.querySelector('.add-to-cart-ajax')
    const btnText = button.querySelector('.btn-text')
    const btnLoading = button.querySelector('.btn-loading')
    
    // 显示加载状态
    button.disabled = true
    btnText.style.display = 'none'
    btnLoading.style.display = 'inline-block'
    
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const item = await response.json()
        
        // 更新购物车UI
        await updateCartUI()
        
        // 显示成功消息
        showNotification('商品已添加到购物车', 'success')
        
        // 打开购物车抽屉
        openCartDrawer()
        
      } else {
        throw new Error('添加失败')
      }
      
    } catch (error) {
      showNotification('添加商品失败，请重试', 'error')
      console.error('Add to cart error:', error)
      
    } finally {
      // 恢复按钮状态
      button.disabled = false
      btnText.style.display = 'inline-block'
      btnLoading.style.display = 'none'
    }
  })
})
</script>
```

### 购物车实时更新[](https://shopify.baoea.com/liquid/ajax-liquid#%E8%B4%AD%E7%89%A9%E8%BD%A6%E5%AE%9E%E6%97%B6%E6%9B%B4%E6%96%B0)

```
<!-- Ajax 购物车更新 -->
<div id="cart-drawer" class="cart-drawer">
  <div class="cart-header">
    <h3>购物车 (<span id="cart-count">{{ cart.item_count }}</span>)</h3>
    <button class="close-cart" onclick="closeCartDrawer()">&times;</button>
  </div>
  
  <div class="cart-items" id="cart-items-container">
    <!-- 购物车内容将通过 Ajax 加载 -->
  </div>
  
  <div class="cart-footer">
    <div class="cart-total">
      总计: <span id="cart-total">{{ cart.total_price | money }}</span>
    </div>
    <button class="checkout-btn" onclick="proceedToCheckout()">
      立即结账
    </button>
  </div>
</div>
 
<script>
// 更新购物车UI
async function updateCartUI() {
  try {
    const cart = await fetch('/cart.js').then(res => res.json())
    
    // 更新购物车计数
    document.getElementById('cart-count').textContent = cart.item_count
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = cart.item_count
    })
    
    // 更新总价
    document.getElementById('cart-total').textContent = formatMoney(cart.total_price)
    
    // 更新购物车内容
    const cartContainer = document.getElementById('cart-items-container')
    if (cart.item_count > 0) {
      cartContainer.innerHTML = await renderCartItems(cart.items)
    } else {
      cartContainer.innerHTML = '<p class="empty-cart">购物车为空</p>'
    }
    
    return cart
  } catch (error) {
    console.error('Failed to update cart:', error)
  }
}
 
// 渲染购物车商品
async function renderCartItems(items) {
  const itemsHTML = items.map(item => `
    <div class="cart-item" data-variant-id="${item.variant_id}">
      <img src="${item.image}" alt="${item.product_title}" class="item-image">
      <div class="item-details">
        <h4>${item.product_title}</h4>
        ${item.variant_title !== 'Default Title' ? `<p>${item.variant_title}</p>` : ''}
        <div class="quantity-controls">
          <button onclick="updateQuantity(${item.key}, ${item.quantity - 1})">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${item.key}, ${item.quantity + 1})">+</button>
        </div>
      </div>
      <div class="item-price">
        ${formatMoney(item.final_line_price)}
        <button onclick="removeItem(${item.key})" class="remove-item">删除</button>
      </div>
    </div>
  `).join('')
  
  return itemsHTML
}
 
// 更新商品数量
async function updateQuantity(key, quantity) {
  try {
    await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: quantity })
    })
    
    await updateCartUI()
  } catch (error) {
    showNotification('更新失败', 'error')
  }
}
 
// 删除商品
async function removeItem(key) {
  await updateQuantity(key, 0)
}
 
// 格式化价格
function formatMoney(cents) {
  return '¥' + (cents / 100).toFixed(2)
}
</script>
```

## 产品快速查看[](https://shopify.baoea.com/liquid/ajax-liquid#%E4%BA%A7%E5%93%81%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8B)

### 模态框快速查看[](https://shopify.baoea.com/liquid/ajax-liquid#%E6%A8%A1%E6%80%81%E6%A1%86%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8B)

```
<!-- 产品快速查看模态框 -->
<div id="quick-view-modal" class="modal" style="display: none;">
  <div class="modal-content">
    <div class="modal-header">
      <h3 id="quick-view-title">产品详情</h3>
      <button class="close-modal" onclick="closeQuickView()">&times;</button>
    </div>
    <div class="modal-body" id="quick-view-content">
      <!-- 内容将通过 Ajax 加载 -->
    </div>
  </div>
</div>
 
<!-- 产品列表中的快速查看按钮 -->
<div class="product-grid">
  {% for product in collection.products %}
    <div class="product-card">
      <img src="{{ product.featured_image | image_url: width: 300, height: 300 }}" 
           alt="{{ product.title }}">
      <h3>{{ product.title }}</h3>
      <p>{{ product.price | money }}</p>
      
      <div class="product-actions">
        <button class="btn quick-view-btn" 
                data-product-handle="{{ product.handle }}"
                onclick="openQuickView('{{ product.handle }}')">
          快速查看
        </button>
        
        <button class="btn add-to-cart-btn" 
                data-variant-id="{{ product.variants.first.id }}"
                onclick="quickAddToCart({{ product.variants.first.id }})">
          快速添加
        </button>
      </div>
    </div>
  {% endfor %}
</div>
 
<script>
// 打开快速查看
async function openQuickView(productHandle) {
  try {
    // 显示加载状态
    document.getElementById('quick-view-title').textContent = '加载中...'
    document.getElementById('quick-view-content').innerHTML = '<div class="loading">正在加载产品信息...</div>'
    document.getElementById('quick-view-modal').style.display = 'block'
    
    // 获取产品数据
    const product = await fetch(`/products/${productHandle}.js`).then(res => res.json())
    
    // 渲染产品内容
    const quickViewHTML = await renderQuickViewContent(product)
    
    document.getElementById('quick-view-title').textContent = product.title
    document.getElementById('quick-view-content').innerHTML = quickViewHTML
    
    // 初始化快速查看表单
    initQuickViewForm()
    
  } catch (error) {
    console.error('Failed to load product:', error)
    document.getElementById('quick-view-content').innerHTML = '<div class="error">加载失败，请重试</div>'
  }
}
 
// 渲染快速查看内容
async function renderQuickViewContent(product) {
  const variantOptions = product.variants.map(variant => 
    `<option value="${variant.id}" ${!variant.available ? 'disabled' : ''}
             data-price="${variant.price}">
       ${variant.title} ${!variant.available ? '- 缺货' : ''}
     </option>`
  ).join('')
  
  return `
    <div class="quick-view-layout">
      <div class="product-images">
        <img src="${product.featured_image}" alt="${product.title}" class="main-image">
      </div>
      
      <div class="product-info">
        <div class="product-price">
          <span id="current-price">${formatMoney(product.price)}</span>
          ${product.compare_at_price ? `<span class="compare-price">${formatMoney(product.compare_at_price)}</span>` : ''}
        </div>
        
        <div class="product-description">
          ${product.description}
        </div>
        
        <form class="quick-view-form">
          <div class="variant-selector">
            <select name="id" onchange="updateQuickViewPrice(this)">
              ${variantOptions}
            </select>
          </div>
          
          <div class="quantity-selector">
            <input type="number" name="quantity" value="1" min="1">
          </div>
          
          <button type="submit" class="btn btn-primary">加入购物车</button>
        </form>
      </div>
    </div>
  `
}
 
// 关闭快速查看
function closeQuickView() {
  document.getElementById('quick-view-modal').style.display = 'none'
}
 
// 快速添加到购物车
async function quickAddToCart(variantId, quantity = 1) {
  try {
    await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: quantity })
    })
    
    await updateCartUI()
    showNotification('商品已添加到购物车', 'success')
    
  } catch (error) {
    showNotification('添加失败', 'error')
  }
}
</script>
```

## 动态搜索[](https://shopify.baoea.com/liquid/ajax-liquid#%E5%8A%A8%E6%80%81%E6%90%9C%E7%B4%A2)

### 实时搜索建议[](https://shopify.baoea.com/liquid/ajax-liquid#%E5%AE%9E%E6%97%B6%E6%90%9C%E7%B4%A2%E5%BB%BA%E8%AE%AE)

```
<!-- 搜索框 -->
<div class="search-container">
  <form class="search-form" action="{{ routes.search_url }}">
    <input type="search" 
           name="q" 
           placeholder="搜索商品..." 
           class="search-input"
           autocomplete="off"
           oninput="handleSearchInput(this)"
           onfocus="showSearchSuggestions()"
           onblur="hideSearchSuggestions()">
    
    <button type="submit" class="search-btn">
      <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" fill="none"/>
      </svg>
    </button>
  </form>
  
  <!-- 搜索建议 -->
  <div id="search-suggestions" class="search-suggestions" style="display: none;">
    <div class="suggestions-content">
      <!-- 建议内容将通过 Ajax 加载 -->
    </div>
  </div>
</div>
 
<script>
let searchTimeout
let searchCache = new Map()
 
// 处理搜索输入
function handleSearchInput(input) {
  const query = input.value.trim()
  
  // 清除之前的定时器
  clearTimeout(searchTimeout)
  
  if (query.length < 2) {
    hideSearchSuggestions()
    return
  }
  
  // 防抖：300ms 后执行搜索
  searchTimeout = setTimeout(() => {
    performSearch(query)
  }, 300)
}
 
// 执行搜索
async function performSearch(query) {
  try {
    // 检查缓存
    if (searchCache.has(query)) {
      displaySearchResults(searchCache.get(query))
      return
    }
    
    // 显示加载状态
    document.querySelector('.suggestions-content').innerHTML = '<div class="loading">搜索中...</div>'
    showSearchSuggestions()
    
    // 搜索产品
    const productsResponse = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=5`)
    const productsData = await productsResponse.json()
    
    // 搜索集合
    const collectionsResponse = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=collection&resources[limit]=3`)
    const collectionsData = await collectionsResponse.json()
    
    const results = {
      products: productsData.resources.results.products || [],
      collections: collectionsData.resources.results.collections || []
    }
    
    // 缓存结果
    searchCache.set(query, results)
    
    // 显示结果
    displaySearchResults(results)
    
  } catch (error) {
    console.error('Search error:', error)
    document.querySelector('.suggestions-content').innerHTML = '<div class="error">搜索失败</div>'
  }
}
 
// 显示搜索结果
function displaySearchResults(results) {
  const { products, collections } = results
  
  let html = ''
  
  // 产品建议
  if (products.length > 0) {
    html += '<div class="suggestion-section"><h4>产品</h4>'
    products.forEach(product => {
      html += `
        <a href="${product.url}" class="suggestion-item product-suggestion">
          <img src="${product.image}" alt="${product.title}" class="suggestion-image">
          <div class="suggestion-info">
            <div class="suggestion-title">${product.title}</div>
            <div class="suggestion-price">${formatMoney(product.price)}</div>
          </div>
        </a>
      `
    })
    html += '</div>'
  }
  
  // 集合建议
  if (collections.length > 0) {
    html += '<div class="suggestion-section"><h4>分类</h4>'
    collections.forEach(collection => {
      html += `
        <a href="${collection.url}" class="suggestion-item collection-suggestion">
          <div class="suggestion-info">
            <div class="suggestion-title">${collection.title}</div>
          </div>
        </a>
      `
    })
    html += '</div>'
  }
  
  if (html === '') {
    html = '<div class="no-results">未找到相关商品</div>'
  }
  
  document.querySelector('.suggestions-content').innerHTML = html
  showSearchSuggestions()
}
 
// 显示搜索建议
function showSearchSuggestions() {
  document.getElementById('search-suggestions').style.display = 'block'
}
 
// 隐藏搜索建议
function hideSearchSuggestions() {
  setTimeout(() => {
    document.getElementById('search-suggestions').style.display = 'none'
  }, 200) // 延迟隐藏，允许点击建议项
}
</script>
```

## 产品过滤[](https://shopify.baoea.com/liquid/ajax-liquid#%E4%BA%A7%E5%93%81%E8%BF%87%E6%BB%A4)

### Ajax 过滤器[](https://shopify.baoea.com/liquid/ajax-liquid#ajax-%E8%BF%87%E6%BB%A4%E5%99%A8)

```
<!-- 产品过滤器 -->
<div class="collection-filters">
  <div class="filter-group">
    <h4>价格范围</h4>
    <div class="price-filter">
      <input type="range" id="price-min" min="0" max="{{ collection.products | map: 'price' | sort | last }}" value="0">
      <input type="range" id="price-max" min="0" max="{{ collection.products | map: 'price' | sort | last }}" value="{{ collection.products | map: 'price' | sort | last }}">
    </div>
  </div>
  
  <div class="filter-group">
    <h4>品牌</h4>
    {% assign vendors = collection.products | map: 'vendor' | uniq | sort %}
    {% for vendor in vendors %}
      <label class="filter-option">
        <input type="checkbox" name="vendor" value="{{ vendor }}" onchange="applyFilters()">
        {{ vendor }}
      </label>
    {% endfor %}
  </div>
  
  <div class="filter-group">
    <h4>产品类型</h4>
    {% assign types = collection.products | map: 'type' | uniq | sort %}
    {% for type in types %}
      <label class="filter-option">
        <input type="checkbox" name="type" value="{{ type }}" onchange="applyFilters()">
        {{ type }}
      </label>
    {% endfor %}
  </div>
</div>
 
<!-- 产品列表 -->
<div id="products-container" class="products-grid">
  {% for product in collection.products %}
    <div class="product-card" 
         data-price="{{ product.price }}" 
         data-vendor="{{ product.vendor }}" 
         data-type="{{ product.type }}">
      <img src="{{ product.featured_image | image_url: width: 300, height: 300 }}" alt="{{ product.title }}">
      <h3>{{ product.title }}</h3>
      <p>{{ product.price | money }}</p>
    </div>
  {% endfor %}
</div>
 
<script>
// 应用过滤器
function applyFilters() {
  const products = document.querySelectorAll('.product-card')
  
  // 获取选中的过滤条件
  const selectedVendors = Array.from(document.querySelectorAll('[name="vendor"]:checked')).map(cb => cb.value)
  const selectedTypes = Array.from(document.querySelectorAll('[name="type"]:checked')).map(cb => cb.value)
  const minPrice = parseInt(document.getElementById('price-min').value)
  const maxPrice = parseInt(document.getElementById('price-max').value)
  
  products.forEach(product => {
    const productPrice = parseInt(product.dataset.price)
    const productVendor = product.dataset.vendor
    const productType = product.dataset.type
    
    let showProduct = true
    
    // 价格过滤
    if (productPrice < minPrice || productPrice > maxPrice) {
      showProduct = false
    }
    
    // 品牌过滤
    if (selectedVendors.length > 0 && !selectedVendors.includes(productVendor)) {
      showProduct = false
    }
    
    // 类型过滤
    if (selectedTypes.length > 0 && !selectedTypes.includes(productType)) {
      showProduct = false
    }
    
    product.style.display = showProduct ? 'block' : 'none'
  })
  
  // 更新 URL（可选）
  updateFilterURL(selectedVendors, selectedTypes, minPrice, maxPrice)
}
 
// 更新 URL
function updateFilterURL(vendors, types, minPrice, maxPrice) {
  const params = new URLSearchParams()
  
  if (vendors.length > 0) params.set('vendor', vendors.join(','))
  if (types.length > 0) params.set('type', types.join(','))
  if (minPrice > 0) params.set('price_min', minPrice)
  if (maxPrice < 999999) params.set('price_max', maxPrice)
  
  const newUrl = window.location.pathname + '?' + params.toString()
  window.history.replaceState({}, '', newUrl)
}
</script>
```

## 通知系统[](https://shopify.baoea.com/liquid/ajax-liquid#%E9%80%9A%E7%9F%A5%E7%B3%BB%E7%BB%9F)

### 全局通知组件[](https://shopify.baoea.com/liquid/ajax-liquid#%E5%85%A8%E5%B1%80%E9%80%9A%E7%9F%A5%E7%BB%84%E4%BB%B6)

```
<!-- 通知容器 -->
<div id="notification-container" class="notification-container">
  <!-- 通知将通过 JavaScript 动态添加 -->
</div>
 
<script>
// 通知系统
const NotificationSystem = {
  container: null,
  
  init() {
    this.container = document.getElementById('notification-container')
    if (!this.container) {
      this.container = document.createElement('div')
      this.container.id = 'notification-container'
      this.container.className = 'notification-container'
      document.body.appendChild(this.container)
    }
  },
  
  show(message, type = 'info', duration = 5000) {
    this.init()
    
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${this.getIcon(type)}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="NotificationSystem.close(this.parentElement.parentElement)">&times;</button>
      </div>
    `
    
    this.container.appendChild(notification)
    
    // 动画显示
    setTimeout(() => notification.classList.add('show'), 10)
    
    // 自动关闭
    if (duration > 0) {
      setTimeout(() => this.close(notification), duration)
    }
    
    return notification
  },
  
  close(notification) {
    notification.classList.remove('show')
    setTimeout(() => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification)
      }
    }, 300)
  },
  
  getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    }
    return icons[type] || icons.info
  }
}
 
// 全局通知函数
function showNotification(message, type = 'info', duration = 5000) {
  return NotificationSystem.show(message, type, duration)
}
</script>
 
<style>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  max-width: 400px;
}
 
.notification {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 10px;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.3s ease;
}
 
.notification.show {
  opacity: 1;
  transform: translateX(0);
}
 
.notification-content {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
 
.notification-success { border-left: 4px solid #10b981; }
.notification-error { border-left: 4px solid #ef4444; }
.notification-warning { border-left: 4px solid #f59e0b; }
.notification-info { border-left: 4px solid #3b82f6; }
</style>
```

## 下一步学习[](https://shopify.baoea.com/liquid/ajax-liquid#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

现在您已经掌握了 Ajax 与 Liquid 的结合使用，建议继续学习：

*   [性能优化](https://shopify.baoea.com/liquid/performance-optimization) - 优化 Ajax 请求性能
*   [高级 Liquid 技巧](https://shopify.baoea.com/liquid/advanced-liquid) - 学习更高级的模板技巧
*   [最佳实践](https://shopify.baoea.com/liquid/best-practices) - 了解 Ajax 开发最佳实践
