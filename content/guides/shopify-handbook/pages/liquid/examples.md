---
source_url: "https://shopify.baoea.com/liquid/examples"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:47"
fetch_method: "http"
content_hash: "9df545e4e56bddc270623d06ca7af525569fa2e64d8121afb0329cff8ae0b64a"
discovered_via: ["sitemap", "internal_link"]
---
## 实际应用示例

本指南通过实际的应用场景和完整代码示例，帮助您深入理解 Shopify 主题开发的实践应用。

## 案例1：智能产品搜索[](https://shopify.baoea.com/liquid/examples#%E6%A1%88%E4%BE%8B1%E6%99%BA%E8%83%BD%E4%BA%A7%E5%93%81%E6%90%9C%E7%B4%A2)

### 功能需求[](https://shopify.baoea.com/liquid/examples#%E5%8A%9F%E8%83%BD%E9%9C%80%E6%B1%82)

*   实时搜索建议
*   搜索结果高亮
*   搜索历史记录
*   无搜索结果时的智能推荐

### 完整实现[](https://shopify.baoea.com/liquid/examples#%E5%AE%8C%E6%95%B4%E5%AE%9E%E7%8E%B0)

```
<!-- sections/smart-search.liquid -->
<div class="smart-search" data-smart-search>
  <form class="search-form" data-search-form role="search">
    <div class="search-input-wrapper">
      <input type="search" 
             class="search-input"
             placeholder="搜索商品、品牌、分类..."
             data-search-input
             autocomplete="off"
             aria-label="搜索商品">
      
      <button type="submit" class="search-submit" aria-label="搜索">
        {% render 'icon-search' %}
      </button>
      
      <button type="button" class="search-clear" data-search-clear aria-label="清空搜索">
        {% render 'icon-close' %}
      </button>
    </div>
    
    <!-- 搜索建议 -->
    <div class="search-suggestions" data-search-suggestions>
      <div class="suggestions-header">
        <h4>搜索建议</h4>
      </div>
      <div class="suggestions-content" data-suggestions-content></div>
    </div>
    
    <!-- 搜索历史 -->
    <div class="search-history" data-search-history>
      <div class="history-header">
        <h4>最近搜索</h4>
        <button type="button" class="history-clear" data-history-clear>清空</button>
      </div>
      <div class="history-content" data-history-content></div>
    </div>
  </form>
</div>
 
<script>
class SmartSearch {
  constructor(element) {
    this.container = element;
    this.form = element.querySelector('[data-search-form]');
    this.input = element.querySelector('[data-search-input]');
    this.suggestions = element.querySelector('[data-search-suggestions]');
    this.history = element.querySelector('[data-search-history]');
    
    this.debounceTimer = null;
    this.searchHistory = this.loadSearchHistory();
    this.cache = new Map();
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.showSearchHistory();
  }
  
  bindEvents() {
    this.input.addEventListener('input', this.handleInput.bind(this));
    this.input.addEventListener('focus', this.handleFocus.bind(this));
    this.input.addEventListener('blur', this.handleBlur.bind(this));
    
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    
    // 历史记录清空
    const historyCleanBtn = this.container.querySelector('[data-history-clear]');
    historyCleanBtn?.addEventListener('click', this.clearHistory.bind(this));
    
    // 搜索清空
    const searchClearBtn = this.container.querySelector('[data-search-clear]');
    searchClearBtn?.addEventListener('click', this.clearSearch.bind(this));
    
    // 键盘导航
    this.input.addEventListener('keydown', this.handleKeyNavigation.bind(this));
  }
  
  handleInput(event) {
    const query = event.target.value.trim();
    
    clearTimeout(this.debounceTimer);
    
    if (query.length < 2) {
      this.hideSuggestions();
      this.showSearchHistory();
      return;
    }
    
    this.debounceTimer = setTimeout(() => {
      this.performSearch(query);
    }, 300);
  }
  
  handleFocus() {
    if (this.input.value.trim().length < 2) {
      this.showSearchHistory();
    } else {
      this.showSuggestions();
    }
  }
  
  handleBlur() {
    // 延迟隐藏，允许点击建议项
    setTimeout(() => {
      this.hideSuggestions();
      this.hideSearchHistory();
    }, 200);
  }
  
  handleSubmit(event) {
    event.preventDefault();
    const query = this.input.value.trim();
    
    if (query) {
      this.saveToHistory(query);
      this.redirectToSearch(query);
    }
  }
  
  async performSearch(query) {
    // 检查缓存
    if (this.cache.has(query)) {
      this.displaySuggestions(this.cache.get(query), query);
      return;
    }
    
    try {
      const response = await fetch(
        `/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,collection,article&resources[limit]=8`
      );
      
      const data = await response.json();
      const results = data.resources.results;
      
      this.cache.set(query, results);
      this.displaySuggestions(results, query);
      
    } catch (error) {
      console.error('搜索失败:', error);
    }
  }
  
  displaySuggestions(results, query) {
    const content = this.suggestions.querySelector('[data-suggestions-content]');
    
    if (!results.products?.length && !results.collections?.length) {
      content.innerHTML = `
        <div class="no-suggestions">
          <p>没有找到相关结果</p>
          <div class="recommended-terms">
            <p>试试这些搜索:</p>
            <button type="button" onclick="this.closest('[data-smart-search]').querySelector('[data-search-input]').value='连衣裙';this.click()">连衣裙</button>
            <button type="button" onclick="this.closest('[data-smart-search]').querySelector('[data-search-input]').value='手机';this.click()">手机</button>
          </div>
        </div>
      `;
    } else {
      let html = '';
      
      // 产品建议
      if (results.products?.length) {
        html += '<div class="suggestion-group">';
        html += '<h5>商品</h5>';
        html += results.products.slice(0, 4).map(product => `
          <a href="${product.url}" class="suggestion-item suggestion-item--product">
            <img src="${product.featured_image?.url}&width=40" alt="${product.title}" loading="lazy">
            <span class="suggestion-text">${this.highlightQuery(product.title, query)}</span>
            <span class="suggestion-price">${this.formatMoney(product.price)}</span>
          </a>
        `).join('');
        html += '</div>';
      }
      
      // 分类建议
      if (results.collections?.length) {
        html += '<div class="suggestion-group">';
        html += '<h5>分类</h5>';
        html += results.collections.slice(0, 3).map(collection => `
          <a href="${collection.url}" class="suggestion-item suggestion-item--collection">
            <span class="suggestion-text">${this.highlightQuery(collection.title, query)}</span>
            <span class="suggestion-count">${collection.products_count} 件商品</span>
          </a>
        `).join('');
        html += '</div>';
      }
      
      content.innerHTML = html;
    }
    
    this.showSuggestions();
  }
  
  highlightQuery(text, query) {
    const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
  
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  formatMoney(cents) {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(cents / 100);
  }
  
  showSuggestions() {
    this.suggestions.style.display = 'block';
    this.hideSearchHistory();
  }
  
  hideSuggestions() {
    this.suggestions.style.display = 'none';
  }
  
  showSearchHistory() {
    if (this.searchHistory.length > 0) {
      const content = this.history.querySelector('[data-history-content]');
      content.innerHTML = this.searchHistory.map(term => `
        <button type="button" 
                class="history-item" 
                onclick="this.closest('[data-smart-search]').querySelector('[data-search-input]').value='${term}';this.closest('form').submit()">
          ${term}
        </button>
      `).join('');
      
      this.history.style.display = 'block';
    }
  }
  
  hideSearchHistory() {
    this.history.style.display = 'none';
  }
  
  saveToHistory(query) {
    if (!this.searchHistory.includes(query)) {
      this.searchHistory.unshift(query);
      this.searchHistory = this.searchHistory.slice(0, 5); // 只保留最近5个
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }
  }
  
  loadSearchHistory() {
    try {
      return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    } catch {
      return [];
    }
  }
  
  clearHistory() {
    this.searchHistory = [];
    localStorage.removeItem('searchHistory');
    this.hideSearchHistory();
  }
  
  clearSearch() {
    this.input.value = '';
    this.hideSuggestions();
    this.showSearchHistory();
    this.input.focus();
  }
  
  redirectToSearch(query) {
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  }
  
  handleKeyNavigation(event) {
    const items = this.suggestions.querySelectorAll('.suggestion-item');
    if (items.length === 0) return;
    
    let currentIndex = Array.from(items).findIndex(item => 
      item.classList.contains('highlighted')
    );
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        currentIndex = (currentIndex + 1) % items.length;
        this.highlightItem(items, currentIndex);
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        currentIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        this.highlightItem(items, currentIndex);
        break;
        
      case 'Enter':
        if (currentIndex >= 0 && items[currentIndex]) {
          event.preventDefault();
          items[currentIndex].click();
        }
        break;
        
      case 'Escape':
        this.hideSuggestions();
        this.input.blur();
        break;
    }
  }
  
  highlightItem(items, index) {
    items.forEach((item, i) => {
      item.classList.toggle('highlighted', i === index);
    });
  }
}
 
// 初始化智能搜索
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-smart-search]').forEach(search => {
    new SmartSearch(search);
  });
});
</script>
 
<style>
.smart-search {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}
 
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  overflow: hidden;
  transition: border-color 0.3s;
}
 
.search-input-wrapper:focus-within {
  border-color: #1a73e8;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
}
 
.search-input {
  flex: 1;
  padding: 12px 20px;
  border: none;
  font-size: 16px;
  background: transparent;
}
 
.search-submit, .search-clear {
  padding: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
}
 
.search-submit:hover, .search-clear:hover {
  color: #1a73e8;
}
 
.search-suggestions, .search-history {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 1000;
  display: none;
  max-height: 400px;
  overflow-y: auto;
}
 
.suggestions-header, .history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #f9f9f9;
}
 
.suggestion-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  text-decoration: none;
  color: #333;
  transition: background-color 0.2s;
}
 
.suggestion-item:hover, .suggestion-item.highlighted {
  background-color: #f5f5f5;
}
 
.suggestion-item img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 12px;
}
 
.suggestion-text {
  flex: 1;
}
 
.suggestion-text mark {
  background: #fff3cd;
  color: #856404;
  padding: 0 2px;
}
 
.history-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  transition: background-color 0.2s;
}
 
.history-item:hover {
  background-color: #f5f5f5;
}
</style>
```

## 案例2：动态购物车[](https://shopify.baoea.com/liquid/examples#%E6%A1%88%E4%BE%8B2%E5%8A%A8%E6%80%81%E8%B4%AD%E7%89%A9%E8%BD%A6)

### 功能需求[](https://shopify.baoea.com/liquid/examples#%E5%8A%9F%E8%83%BD%E9%9C%80%E6%B1%82-1)

*   Ajax添加商品
*   实时购物车更新
*   商品数量调整
*   购物车商品推荐

### 核心实现[](https://shopify.baoea.com/liquid/examples#%E6%A0%B8%E5%BF%83%E5%AE%9E%E7%8E%B0)

```
<!-- snippets/dynamic-cart.liquid -->
<div class="cart-overlay" data-cart-overlay></div>
 
<div class="cart-drawer" data-cart-drawer>
  <div class="cart-header">
    <h2>购物车 (<span data-cart-count>0</span>)</h2>
    <button class="cart-close" data-cart-close>×</button>
  </div>
  
  <div class="cart-body">
    <div class="cart-items" data-cart-items>
      <!-- 购物车商品列表 -->
    </div>
    
    <div class="cart-empty" data-cart-empty style="display: none;">
      <p>购物车是空的</p>
      <a href="/collections" class="btn btn--primary">继续购物</a>
    </div>
  </div>
  
  <div class="cart-footer" data-cart-footer>
    <div class="cart-total">
      <span>总计: <strong data-cart-total>¥0.00</strong></span>
    </div>
    <button class="btn btn--primary btn--full" data-cart-checkout>
      去结账
    </button>
  </div>
</div>
 
<script>
class DynamicCart {
  constructor() {
    this.cart = null;
    this.isOpen = false;
    this.init();
  }
  
  async init() {
    this.bindEvents();
    await this.loadCart();
    this.updateUI();
  }
  
  bindEvents() {
    // 添加到购物车按钮
    document.addEventListener('click', async (e) => {
      if (e.target.matches('[data-add-to-cart]')) {
        e.preventDefault();
        await this.handleAddToCart(e.target);
      }
    });
    
    // 购物车抽屉控制
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-cart-trigger]')) {
        this.open();
      }
      
      if (e.target.matches('[data-cart-close]') || e.target.matches('[data-cart-overlay]')) {
        this.close();
      }
    });
    
    // 商品数量调整
    document.addEventListener('click', async (e) => {
      if (e.target.matches('[data-cart-quantity-plus]')) {
        const key = e.target.dataset.cartKey;
        await this.updateQuantity(key, 1);
      }
      
      if (e.target.matches('[data-cart-quantity-minus]')) {
        const key = e.target.dataset.cartKey;
        await this.updateQuantity(key, -1);
      }
      
      if (e.target.matches('[data-cart-remove]')) {
        const key = e.target.dataset.cartKey;
        await this.removeItem(key);
      }
    });
    
    // 结账按钮
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-cart-checkout]')) {
        window.location.href = '/checkout';
      }
    });
  }
  
  async loadCart() {
    try {
      const response = await fetch('/cart.js');
      this.cart = await response.json();
    } catch (error) {
      console.error('加载购物车失败:', error);
    }
  }
  
  async handleAddToCart(button) {
    const form = button.closest('form');
    const formData = new FormData(form);
    
    try {
      this.setButtonLoading(button, true);
      
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const item = await response.json();
        await this.loadCart();
        this.updateUI();
        this.open();
        this.showAddedNotification(item);
      } else {
        const error = await response.json();
        this.showError(error.message);
      }
    } catch (error) {
      this.showError('添加商品失败');
    } finally {
      this.setButtonLoading(button, false);
    }
  }
  
  async updateQuantity(key, change) {
    const currentItem = this.cart.items.find(item => item.key === key);
    if (!currentItem) return;
    
    const newQuantity = Math.max(0, currentItem.quantity + change);
    
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: newQuantity })
      });
      
      this.cart = await response.json();
      this.updateUI();
    } catch (error) {
      this.showError('更新数量失败');
    }
  }
  
  async removeItem(key) {
    return this.updateQuantity(key, -999); // 设置为0来移除
  }
  
  updateUI() {
    this.updateCartCount();
    this.updateCartItems();
    this.updateCartTotal();
    this.updateEmptyState();
  }
  
  updateCartCount() {
    const countElements = document.querySelectorAll('[data-cart-count]');
    countElements.forEach(el => {
      el.textContent = this.cart.item_count;
    });
  }
  
  updateCartItems() {
    const container = document.querySelector('[data-cart-items]');
    if (!container) return;
    
    if (this.cart.items.length === 0) {
      container.innerHTML = '';
      return;
    }
    
    container.innerHTML = this.cart.items.map(item => `
      <div class="cart-item" data-cart-item="${item.key}">
        <div class="cart-item-image">
          <img src="${item.featured_image.url}&width=80" alt="${item.product_title}">
        </div>
        
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.product_title}</h4>
          ${item.variant_title ? `<p class="cart-item-variant">${item.variant_title}</p>` : ''}
          
          <div class="cart-item-quantity">
            <button class="quantity-btn" data-cart-quantity-minus data-cart-key="${item.key}">-</button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn" data-cart-quantity-plus data-cart-key="${item.key}">+</button>
          </div>
        </div>
        
        <div class="cart-item-price">
          <span class="cart-item-total">${this.formatMoney(item.line_price)}</span>
          <button class="cart-item-remove" data-cart-remove data-cart-key="${item.key}">移除</button>
        </div>
      </div>
    `).join('');
  }
  
  updateCartTotal() {
    const totalElements = document.querySelectorAll('[data-cart-total]');
    totalElements.forEach(el => {
      el.textContent = this.formatMoney(this.cart.total_price);
    });
  }
  
  updateEmptyState() {
    const emptyState = document.querySelector('[data-cart-empty]');
    const cartFooter = document.querySelector('[data-cart-footer]');
    
    if (this.cart.item_count === 0) {
      emptyState.style.display = 'block';
      cartFooter.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      cartFooter.style.display = 'block';
    }
  }
  
  open() {
    const drawer = document.querySelector('[data-cart-drawer]');
    const overlay = document.querySelector('[data-cart-overlay]');
    
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.classList.add('cart-open');
    this.isOpen = true;
  }
  
  close() {
    const drawer = document.querySelector('[data-cart-drawer]');
    const overlay = document.querySelector('[data-cart-overlay]');
    
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.classList.remove('cart-open');
    this.isOpen = false;
  }
  
  setButtonLoading(button, loading) {
    button.disabled = loading;
    button.textContent = loading ? '添加中...' : '加入购物车';
  }
  
  showAddedNotification(item) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <img src="${item.featured_image}&width=60" alt="${item.product_title}">
        <div>
          <p><strong>${item.product_title}</strong> 已添加到购物车</p>
          <p>${item.variant_title || ''}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  showError(message) {
    alert(message); // 简单实现，实际项目中应该用更好的UI
  }
  
  formatMoney(cents) {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(cents / 100);
  }
}
 
// 初始化动态购物车
window.dynamicCart = new DynamicCart();
</script>
```

## 案例3：产品图片库[](https://shopify.baoea.com/liquid/examples#%E6%A1%88%E4%BE%8B3%E4%BA%A7%E5%93%81%E5%9B%BE%E7%89%87%E5%BA%93)

### 功能需求[](https://shopify.baoea.com/liquid/examples#%E5%8A%9F%E8%83%BD%E9%9C%80%E6%B1%82-2)

*   图片缩放查看
*   缩略图导航
*   移动端滑动支持
*   懒加载优化

### 实现代码[](https://shopify.baoea.com/liquid/examples#%E5%AE%9E%E7%8E%B0%E4%BB%A3%E7%A0%81)

```
<!-- snippets/product-gallery.liquid -->
<div class="product-gallery" data-product-gallery>
  <div class="gallery-main">
    <div class="main-image-container">
      <img class="main-image" 
           data-main-image
           src="{{ product.featured_image | image_url: width: 800, height: 800 }}"
           alt="{{ product.featured_image.alt | default: product.title }}">
      
      <button class="zoom-btn" data-zoom-trigger aria-label="放大图片">
        🔍
      </button>
    </div>
  </div>
  
  <div class="gallery-thumbs" data-gallery-thumbs>
    {% for image in product.images %}
      <button class="thumb-btn {% if forloop.first %}active{% endif %}"
              data-thumb-btn
              data-image-src="{{ image | image_url: width: 800, height: 800 }}"
              data-image-alt="{{ image.alt | default: product.title }}">
        <img src="{{ image | image_url: width: 100, height: 100 }}" 
             alt="{{ image.alt | default: product.title }}"
             loading="lazy">
      </button>
    {% endfor %}
  </div>
</div>
 
<!-- 图片放大模态框 -->
<div class="image-zoom-modal" data-zoom-modal>
  <div class="zoom-overlay"></div>
  <div class="zoom-content">
    <img class="zoom-image" data-zoom-image>
    <button class="zoom-close" data-zoom-close>×</button>
    <button class="zoom-prev" data-zoom-prev>‹</button>
    <button class="zoom-next" data-zoom-next">›</button>
  </div>
</div>
 
<script>
class ProductGallery {
  constructor(element) {
    this.gallery = element;
    this.mainImage = element.querySelector('[data-main-image]');
    this.thumbs = element.querySelectorAll('[data-thumb-btn]');
    this.zoomModal = document.querySelector('[data-zoom-modal]');
    
    this.currentIndex = 0;
    this.images = Array.from(this.thumbs).map(thumb => ({
      src: thumb.dataset.imageSrc,
      alt: thumb.dataset.imageAlt
    }));
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.setupTouchSupport();
  }
  
  bindEvents() {
    // 缩略图切换
    this.thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        this.switchToImage(index);
      });
    });
    
    // 放大功能
    const zoomTrigger = this.gallery.querySelector('[data-zoom-trigger]');
    zoomTrigger?.addEventListener('click', () => {
      this.openZoom();
    });
    
    // 模态框控制
    this.zoomModal?.addEventListener('click', (e) => {
      if (e.target.matches('[data-zoom-close]') || e.target.matches('.zoom-overlay')) {
        this.closeZoom();
      }
      
      if (e.target.matches('[data-zoom-prev]')) {
        this.prevImage();
      }
      
      if (e.target.matches('[data-zoom-next]')) {
        this.nextImage();
      }
    });
    
    // 键盘导航
    document.addEventListener('keydown', (e) => {
      if (this.zoomModal?.classList.contains('active')) {
        switch (e.key) {
          case 'ArrowLeft':
            this.prevImage();
            break;
          case 'ArrowRight':
            this.nextImage();
            break;
          case 'Escape':
            this.closeZoom();
            break;
        }
      }
    });
  }
  
  setupTouchSupport() {
    let startX = 0;
    let startY = 0;
    
    this.mainImage.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    
    this.mainImage.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      // 水平滑动且距离足够
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.nextImage();
        } else {
          this.prevImage();
        }
      }
    }, { passive: true });
  }
  
  switchToImage(index) {
    if (index < 0 || index >= this.images.length) return;
    
    this.currentIndex = index;
    const image = this.images[index];
    
    // 更新主图片
    this.updateMainImage(image.src, image.alt);
    
    // 更新缩略图状态
    this.updateThumbsState();
    
    // 如果模态框打开，也更新模态框图片
    if (this.zoomModal?.classList.contains('active')) {
      this.updateZoomImage();
    }
  }
  
  updateMainImage(src, alt) {
    // 预加载图片
    const img = new Image();
    img.onload = () => {
      this.mainImage.src = src;
      this.mainImage.alt = alt;
    };
    img.src = src;
  }
  
  updateThumbsState() {
    this.thumbs.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === this.currentIndex);
    });
  }
  
  nextImage() {
    const nextIndex = (this.currentIndex + 1) % this.images.length;
    this.switchToImage(nextIndex);
  }
  
  prevImage() {
    const prevIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
    this.switchToImage(prevIndex);
  }
  
  openZoom() {
    if (!this.zoomModal) return;
    
    this.updateZoomImage();
    this.zoomModal.classList.add('active');
    document.body.classList.add('zoom-open');
  }
  
  closeZoom() {
    if (!this.zoomModal) return;
    
    this.zoomModal.classList.remove('active');
    document.body.classList.remove('zoom-open');
  }
  
  updateZoomImage() {
    const zoomImage = this.zoomModal?.querySelector('[data-zoom-image]');
    if (zoomImage) {
      const currentImage = this.images[this.currentIndex];
      // 使用更高分辨率的图片用于放大
      const highResImage = currentImage.src.replace('800x800', '1600x1600');
      zoomImage.src = highResImage;
      zoomImage.alt = currentImage.alt;
    }
  }
}
 
// 初始化产品图片库
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-product-gallery]').forEach(gallery => {
    new ProductGallery(gallery);
  });
});
</script>
```

通过这些实际应用示例，您可以学习到完整的功能实现过程和最佳实践！

## 下一步学习[](https://shopify.baoea.com/liquid/examples#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

完成实际应用示例后，建议继续学习：

1.  [常见模式和解决方案](https://shopify.baoea.com/liquid/common-patterns) - 开发模式总结
2.  [定制化开发案例](https://shopify.baoea.com/liquid/customization-examples) - 高级定制技巧
