---
source_url: "https://shopify.baoea.com/liquid/customization-examples"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:46"
fetch_method: "http"
content_hash: "d107088204424dc5fa27ee6725830ffae3c18b78853752215a07becfe5b36ee1"
discovered_via: ["sitemap", "internal_link"]
---
```
<!-- snippets/dynamic-pricing.liquid -->
{% comment %}
  动态定价组件
  
  参数:
  - product: 产品对象
  - customer: 客户对象
  - quantity: 购买数量 (默认: 1)
{% endcomment %}
 
{%- liquid
  assign base_price = product.price
  assign current_customer = customer
  assign buy_quantity = quantity | default: 1
  
  # 获取客户等级
  assign customer_tier = 'guest'
  if current_customer
    for tag in current_customer.tags
      if tag contains 'tier:'
        assign customer_tier = tag | remove: 'tier:'
        break
      endif
    endfor
  endif
  
  # 计算等级折扣
  assign tier_discount = 0
  case customer_tier
    when 'vip'
      assign tier_discount = 0.15
    when 'premium' 
      assign tier_discount = 0.10
    when 'regular'
      assign tier_discount = 0.05
  endcase
  
  # 计算批量折扣
  assign bulk_discount = 0
  if buy_quantity >= 100
    assign bulk_discount = 0.20
  elsif buy_quantity >= 50
    assign bulk_discount = 0.15
  elsif buy_quantity >= 20
    assign bulk_discount = 0.10
  elsif buy_quantity >= 10
    assign bulk_discount = 0.05
  endif
  
  # 检查地区定价
  assign region_multiplier = 1.0
  if current_customer.default_address
    assign country = current_customer.default_address.country_code
    case country
      when 'US'
        assign region_multiplier = 1.0
      when 'CA'
        assign region_multiplier = 1.1
      when 'AU'
        assign region_multiplier = 1.15
      when 'CN'
        assign region_multiplier = 0.85
    endcase
  endif
  
  # 检查活动定价
  assign promo_discount = 0
  assign current_time = 'now' | date: '%s' | plus: 0
  
  # 黑色星期五促销
  assign black_friday_start = '2024-11-29' | date: '%s'
  assign black_friday_end = '2024-12-02' | date: '%s'
  
  if current_time >= black_friday_start and current_time <= black_friday_end
    if product.tags contains 'black-friday'
      assign promo_discount = 0.30
    endif
  endif
  
  # 计算最终价格
  assign final_discount = tier_discount | plus: bulk_discount | plus: promo_discount
  if final_discount > 0.5
    assign final_discount = 0.5
  endif
  
  assign discounted_price = base_price | times: region_multiplier | times: 1 | minus: final_discount
  assign total_price = discounted_price | times: buy_quantity
  
  assign savings = base_price | minus: discounted_price | times: buy_quantity
-%}
 
<div class="dynamic-pricing" data-dynamic-pricing>
  <div class="pricing-display">
    <div class="current-price">
      {% if discounted_price < base_price %}
        <span class="price--sale">{{ discounted_price | money }}</span>
        <span class="price--original">{{ base_price | money }}</span>
      {% else %}
        <span class="price--regular">{{ discounted_price | money }}</span>
      {% endif %}
    </div>
    
    {% if savings > 0 %}
      <div class="savings-info">
        <span class="savings-amount">节省 {{ savings | money }}</span>
        <span class="savings-percentage">({{ final_discount | times: 100 | round }}% 折扣)</span>
      </div>
    {% endif %}
  </div>
  
  <!-- 定价详情 -->
  <div class="pricing-breakdown" data-pricing-details style="display: none;">
    <h4>定价详情</h4>
    
    <div class="pricing-item">
      <span>基础价格:</span>
      <span>{{ base_price | money }}</span>
    </div>
    
    {% if tier_discount > 0 %}
      <div class="pricing-item">
        <span>{{ customer_tier | capitalize }} 会员折扣 ({{ tier_discount | times: 100 }}%):</span>
        <span>-{{ base_price | times: tier_discount | money }}</span>
      </div>
    {% endif %}
    
    {% if bulk_discount > 0 %}
      <div class="pricing-item">
        <span>批量购买折扣 ({{ bulk_discount | times: 100 }}%):</span>
        <span>-{{ base_price | times: bulk_discount | money }}</span>
      </div>
    {% endif %}
    
    {% if promo_discount > 0 %}
      <div class="pricing-item">
        <span>促销活动折扣 ({{ promo_discount | times: 100 }}%):</span>
        <span>-{{ base_price | times: promo_discount | money }}</span>
      </div>
    {% endif %}
    
    {% if region_multiplier != 1.0 %}
      <div class="pricing-item">
        <span>地区调整:</span>
        <span>×{{ region_multiplier }}</span>
      </div>
    {% endif %}
    
    <div class="pricing-item total">
      <span>单价:</span>
      <span>{{ discounted_price | money }}</span>
    </div>
    
    {% if buy_quantity > 1 %}
      <div class="pricing-item total">
        <span>总计 ({{ buy_quantity }} 件):</span>
        <span>{{ total_price | money }}</span>
      </div>
    {% endif %}
  </div>
  
  <button class="pricing-toggle" data-pricing-toggle>
    查看定价详情
  </button>
</div>
 
<script>
class DynamicPricing {
  constructor(element) {
    this.container = element;
    this.toggleBtn = element.querySelector('[data-pricing-toggle]');
    this.details = element.querySelector('[data-pricing-details]');
    
    this.init();
  }
  
  init() {
    this.bindEvents();
  }
  
  bindEvents() {
    this.toggleBtn?.addEventListener('click', this.toggleDetails.bind(this));
  }
  
  toggleDetails() {
    const isVisible = this.details.style.display !== 'none';
    
    this.details.style.display = isVisible ? 'none' : 'block';
    this.toggleBtn.textContent = isVisible ? '查看定价详情' : '隐藏定价详情';
  }
  
  // 更新数量时重新计算价格
  updateQuantity(newQuantity) {
    // 这里可以通过AJAX重新获取定价信息
    fetch(`/products/${this.productId}/pricing?quantity=${newQuantity}`, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
      this.updatePricingDisplay(data);
    });
  }
  
  updatePricingDisplay(pricingData) {
    // 更新价格显示
    this.container.innerHTML = pricingData.html;
  }
}
 
// 初始化动态定价
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-dynamic-pricing]').forEach(pricing => {
    new DynamicPricing(pricing);
  });
});
</script>
```

```
<!-- snippets/advanced-inventory.liquid -->
{% comment %}
  高级库存管理组件
  
  参数:
  - variant: 产品变体
  - show_warehouses: 是否显示仓库详情
{% endcomment %}
 
{%- liquid
  assign current_variant = variant
  assign total_inventory = current_variant.inventory_quantity
  assign inventory_policy = current_variant.inventory_policy
  assign inventory_management = current_variant.inventory_management
  assign show_warehouses = show_warehouses | default: false
  
  # 获取仓库库存信息 (通过metafields)
  assign warehouse_stock = current_variant.metafields.inventory.warehouses
  
  # 设置库存状态
  assign stock_status = 'in_stock'
  assign stock_message = '有库存'
  assign stock_class = 'stock-good'
  
  if total_inventory <= 0
    if inventory_policy == 'continue'
      assign stock_status = 'preorder'
      assign stock_message = '可预订'
      assign stock_class = 'stock-preorder'
    else
      assign stock_status = 'out_of_stock'
      assign stock_message = '缺货'
      assign stock_class = 'stock-out'
    endif
  elsif total_inventory <= 5
    assign stock_status = 'low_stock'
    assign stock_message = '库存紧张'
    assign stock_class = 'stock-low'
  endif
  
  # 预计到货时间
  assign estimated_delivery = current_variant.metafields.inventory.estimated_delivery
  assign lead_time_days = current_variant.metafields.inventory.lead_time | default: 7
-%}
 
<div class="advanced-inventory" data-inventory-manager data-variant-id="{{ current_variant.id }}">
  <div class="stock-status {{ stock_class }}">
    <span class="stock-indicator"></span>
    <span class="stock-text">{{ stock_message }}</span>
    
    {% if total_inventory > 0 and total_inventory <= 10 %}
      <span class="stock-count">(仅剩 {{ total_inventory }} 件)</span>
    {% endif %}
  </div>
  
  <!-- 仓库库存详情 -->
  {% if show_warehouses and warehouse_stock %}
    <div class="warehouse-stock" data-warehouse-details>
      <h4>库存分布</h4>
      {% assign warehouses = warehouse_stock | split: ',' %}
      {% for warehouse_info in warehouses %}
        {% assign info_parts = warehouse_info | split: ':' %}
        {% assign warehouse_name = info_parts[0] %}
        {% assign warehouse_stock_count = info_parts[1] | plus: 0 %}
        
        <div class="warehouse-item">
          <span class="warehouse-name">{{ warehouse_name }}</span>
          <span class="warehouse-stock">{{ warehouse_stock_count }} 件</span>
        </div>
      {% endfor %}
    </div>
  {% endif %}
  
  <!-- 预售信息 -->
  {% if stock_status == 'preorder' %}
    <div class="preorder-info">
      <h4>预售信息</h4>
      {% if estimated_delivery %}
        <p>预计到货: {{ estimated_delivery | date: '%Y年%m月%d日' }}</p>
      {% else %}
        <p>预计 {{ lead_time_days }} 个工作日内发货</p>
      {% endif %}
    </div>
  {% endif %}
  
  <!-- 库存通知 -->
  {% if stock_status == 'out_of_stock' %}
    <div class="stock-notification">
      <h4>到货通知</h4>
      <form class="notify-form" data-notify-form>
        <input type="hidden" name="variant_id" value="{{ current_variant.id }}">
        <input type="email" 
               name="email" 
               placeholder="输入邮箱地址" 
               required
               class="notify-email">
        <button type="submit" class="notify-btn">到货通知我</button>
      </form>
      <p class="notify-text">商品到货后我们会第一时间通知您</p>
    </div>
  {% endif %}
  
  <!-- 库存图表 -->
  <div class="stock-chart" data-stock-chart>
    <div class="chart-container">
      <canvas id="stock-chart-{{ current_variant.id }}"></canvas>
    </div>
  </div>
</div>
 
<script>
class AdvancedInventory {
  constructor(element) {
    this.container = element;
    this.variantId = element.dataset.variantId;
    this.notifyForm = element.querySelector('[data-notify-form]');
    this.chartCanvas = element.querySelector(`#stock-chart-${this.variantId}`);
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.loadStockHistory();
    this.setupRealTimeUpdates();
  }
  
  bindEvents() {
    // 到货通知表单
    this.notifyForm?.addEventListener('submit', this.handleNotifySubmit.bind(this));
    
    // 库存变化监听
    document.addEventListener('variant:changed', (e) => {
      if (e.detail.variantId === this.variantId) {
        this.updateInventoryDisplay(e.detail.inventory);
      }
    });
  }
  
  async handleNotifySubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(this.notifyForm);
    const email = formData.get('email');
    
    try {
      const response = await fetch('/api/stock-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variant_id: this.variantId,
          email: email
        })
      });
      
      if (response.ok) {
        this.showNotification('通知设置成功！', 'success');
        this.notifyForm.reset();
      } else {
        throw new Error('设置失败');
      }
    } catch (error) {
      this.showNotification('设置失败，请稍后重试', 'error');
    }
  }
  
  async loadStockHistory() {
    try {
      const response = await fetch(`/api/variants/${this.variantId}/stock-history`);
      const stockData = await response.json();
      
      this.renderStockChart(stockData);
    } catch (error) {
      console.warn('Failed to load stock history:', error);
    }
  }
  
  renderStockChart(stockData) {
    if (!this.chartCanvas || !window.Chart) return;
    
    const ctx = this.chartCanvas.getContext('2d');
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: stockData.dates,
        datasets: [{
          label: '库存数量',
          data: stockData.quantities,
          borderColor: '#1a73e8',
          backgroundColor: 'rgba(26, 115, 232, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: '库存变化趋势'
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '库存数量'
            }
          },
          x: {
            title: {
              display: true,
              text: '日期'
            }
          }
        }
      }
    });
  }
  
  setupRealTimeUpdates() {
    // 使用 WebSocket 或 Server-Sent Events 实现实时库存更新
    if (window.EventSource) {
      const eventSource = new EventSource(`/api/variants/${this.variantId}/stock-updates`);
      
      eventSource.onmessage = (event) => {
        const stockUpdate = JSON.parse(event.data);
        this.updateInventoryDisplay(stockUpdate);
      };
      
      eventSource.onerror = () => {
        console.warn('Stock update connection lost, falling back to polling');
        this.setupPolling();
      };
    } else {
      this.setupPolling();
    }
  }
  
  setupPolling() {
    // 降级到轮询方式
    setInterval(async () => {
      try {
        const response = await fetch(`/api/variants/${this.variantId}/stock`);
        const stockData = await response.json();
        this.updateInventoryDisplay(stockData);
      } catch (error) {
        console.warn('Failed to poll stock data:', error);
      }
    }, 30000); // 30秒轮询一次
  }
  
  updateInventoryDisplay(inventoryData) {
    const stockStatus = this.container.querySelector('.stock-status');
    const stockText = stockStatus.querySelector('.stock-text');
    const stockCount = stockStatus.querySelector('.stock-count');
    
    // 更新库存状态
    stockStatus.className = `stock-status ${inventoryData.stock_class}`;
    stockText.textContent = inventoryData.stock_message;
    
    if (stockCount) {
      if (inventoryData.quantity > 0 && inventoryData.quantity <= 10) {
        stockCount.textContent = `(仅剩 ${inventoryData.quantity} 件)`;
        stockCount.style.display = 'inline';
      } else {
        stockCount.style.display = 'none';
      }
    }
    
    // 触发库存变化事件
    this.container.dispatchEvent(new CustomEvent('inventory:updated', {
      detail: inventoryData
    }));
  }
  
  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    this.container.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}
 
// 初始化高级库存管理
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-inventory-manager]').forEach(inventory => {
    new AdvancedInventory(inventory);
  });
});
</script>
```

```
<!-- sections/personalized-recommendations.liquid -->
<div class="personalized-recommendations" 
     data-recommendations
     data-customer-id="{{ customer.id | default: 'guest' }}"
     data-current-product="{{ product.id | default: '' }}">
  
  <div class="recommendations-header">
    <h2>{{ section.settings.heading | default: '为您推荐' }}</h2>
  </div>
  
  <div class="recommendations-container">
    <!-- 加载状态 -->
    <div class="recommendations-loading" data-loading>
      <div class="loading-spinner"></div>
      <p>正在为您精选商品...</p>
    </div>
    
    <!-- 推荐商品 -->
    <div class="recommendations-grid" data-recommendations-grid style="display: none;">
      <!-- 动态加载的推荐商品 -->
    </div>
    
    <!-- 无推荐时的降级内容 -->
    <div class="recommendations-fallback" data-fallback style="display: none;">
      <h3>精选商品</h3>
      <div class="fallback-products">
        {% for product in collections.featured.products limit: 4 %}
          {% render 'product-card', product: product %}
        {% endfor %}
      </div>
    </div>
  </div>
</div>
 
<script>
class PersonalizedRecommendations {
  constructor(element) {
    this.container = element;
    this.customerId = element.dataset.customerId;
    this.currentProduct = element.dataset.currentProduct;
    this.loading = element.querySelector('[data-loading]');
    this.grid = element.querySelector('[data-recommendations-grid]');
    this.fallback = element.querySelector('[data-fallback]');
    
    this.recommendationTypes = [
      'viewed_together',    // 一起浏览的商品
      'bought_together',    // 一起购买的商品  
      'similar_products',   // 相似商品
      'user_behavior',      // 基于用户行为
      'trending',          // 热门商品
      'category_based'     // 基于分类
    ];
    
    this.init();
  }
  
  async init() {
    await this.loadRecommendations();
    this.trackUserBehavior();
  }
  
  async loadRecommendations() {
    try {
      const recommendations = await this.fetchRecommendations();
      
      if (recommendations && recommendations.length > 0) {
        this.renderRecommendations(recommendations);
      } else {
        this.showFallback();
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      this.showFallback();
    }
  }
  
  async fetchRecommendations() {
    const params = new URLSearchParams({
      customer_id: this.customerId,
      current_product: this.currentProduct,
      limit: 8,
      types: this.recommendationTypes.join(',')
    });
    
    const response = await fetch(`/api/recommendations?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return response.json();
  }
  
  renderRecommendations(recommendations) {
    let html = '';
    
    recommendations.forEach((item, index) => {
      html += this.createProductHTML(item, index);
    });
    
    this.grid.innerHTML = html;
    this.hideLoading();
    this.grid.style.display = 'grid';
    
    // 懒加载图片
    this.setupLazyLoading();
    
    // 跟踪推荐展示
    this.trackRecommendationViews(recommendations);
  }
  
  createProductHTML(product, index) {
    const reasonText = this.getRecommendationReason(product.reason);
    
    return `
      <div class="recommendation-item" data-product-id="${product.id}" data-index="${index}">
        <div class="recommendation-reason">
          <span class="reason-badge">${reasonText}</span>
        </div>
        
        <div class="product-image">
          <img data-src="${product.featured_image}&width=300" 
               alt="${product.title}"
               class="lazy-image">
        </div>
        
        <div class="product-info">
          <h4 class="product-title">
            <a href="${product.url}">${product.title}</a>
          </h4>
          
          <div class="product-price">
            ${product.compare_at_price > product.price ? 
              `<span class="price--sale">${this.formatMoney(product.price)}</span>
               <span class="price--compare">${this.formatMoney(product.compare_at_price)}</span>` :
              `<span class="price--regular">${this.formatMoney(product.price)}</span>`
            }
          </div>
          
          <div class="product-rating" data-rating="${product.rating}">
            ${this.createStarRating(product.rating)}
            <span class="rating-count">(${product.review_count})</span>
          </div>
          
          <button class="quick-add-btn" 
                  data-product-id="${product.id}"
                  data-variant-id="${product.default_variant_id}">
            快速加入购物车
          </button>
        </div>
        
        <!-- A/B测试标记 -->
        <div class="ab-test-marker" data-test-variant="${product.test_variant}" style="display: none;"></div>
      </div>
    `;
  }
  
  getRecommendationReason(reason) {
    const reasons = {
      'viewed_together': '一起浏览',
      'bought_together': '一起购买', 
      'similar_products': '相似商品',
      'user_behavior': '为您推荐',
      'trending': '热门商品',
      'category_based': '同类推荐'
    };
    
    return reasons[reason] || '推荐';
  }
  
  createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let html = '';
    
    // 满星
    for (let i = 0; i < fullStars; i++) {
      html += '<span class="star star--full">★</span>';
    }
    
    // 半星
    if (hasHalfStar) {
      html += '<span class="star star--half">☆</span>';
    }
    
    // 空星
    for (let i = 0; i < emptyStars; i++) {
      html += '<span class="star star--empty">☆</span>';
    }
    
    return html;
  }
  
  formatMoney(cents) {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(cents / 100);
  }
  
  setupLazyLoading() {
    const images = this.grid.querySelectorAll('.lazy-image');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy-image');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    } else {
      // 降级处理
      images.forEach(img => {
        img.src = img.dataset.src;
      });
    }
  }
  
  trackRecommendationViews(recommendations) {
    // 跟踪推荐商品的展示
    const viewData = {
      customer_id: this.customerId,
      recommendations: recommendations.map((item, index) => ({
        product_id: item.id,
        position: index,
        reason: item.reason,
        test_variant: item.test_variant
      })),
      context: {
        page: window.location.pathname,
        current_product: this.currentProduct
      }
    };
    
    fetch('/api/analytics/recommendation-views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(viewData)
    }).catch(error => {
      console.warn('Failed to track recommendation views:', error);
    });
  }
  
  trackUserBehavior() {
    // 跟踪用户行为以改善推荐
    document.addEventListener('click', (e) => {
      const productCard = e.target.closest('.recommendation-item');
      
      if (productCard) {
        const productId = productCard.dataset.productId;
        const index = productCard.dataset.index;
        const testVariant = productCard.querySelector('[data-test-variant]')?.dataset.testVariant;
        
        this.trackClick(productId, index, testVariant);
      }
    });
    
    // 跟踪滚动行为
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackScrollBehavior();
      }, 500);
    });
  }
  
  trackClick(productId, position, testVariant) {
    const clickData = {
      customer_id: this.customerId,
      product_id: productId,
      position: parseInt(position),
      test_variant: testVariant,
      timestamp: Date.now()
    };
    
    fetch('/api/analytics/recommendation-clicks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clickData)
    }).catch(error => {
      console.warn('Failed to track recommendation click:', error);
    });
  }
  
  trackScrollBehavior() {
    const visibleItems = this.getVisibleRecommendations();
    
    if (visibleItems.length > 0) {
      const scrollData = {
        customer_id: this.customerId,
        visible_products: visibleItems,
        scroll_position: window.scrollY,
        timestamp: Date.now()
      };
      
      fetch('/api/analytics/scroll-behavior', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scrollData)
      }).catch(error => {
        console.warn('Failed to track scroll behavior:', error);
      });
    }
  }
  
  getVisibleRecommendations() {
    const items = this.grid.querySelectorAll('.recommendation-item');
    const visibleItems = [];
    
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        visibleItems.push({
          product_id: item.dataset.productId,
          position: item.dataset.index,
          visibility_ratio: this.calculateVisibilityRatio(rect)
        });
      }
    });
    
    return visibleItems;
  }
  
  calculateVisibilityRatio(rect) {
    const windowHeight = window.innerHeight;
    const elementHeight = rect.height;
    
    let visibleHeight = elementHeight;
    
    if (rect.top < 0) {
      visibleHeight += rect.top;
    }
    
    if (rect.bottom > windowHeight) {
      visibleHeight -= (rect.bottom - windowHeight);
    }
    
    return Math.max(0, visibleHeight / elementHeight);
  }
  
  hideLoading() {
    this.loading.style.display = 'none';
  }
  
  showFallback() {
    this.hideLoading();
    this.fallback.style.display = 'block';
  }
}
 
// 初始化个性化推荐
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-recommendations]').forEach(recommendations => {
    new PersonalizedRecommendations(recommendations);
  });
});
</script>
 
{% schema %}
{
  "name": "个性化推荐",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "标题",
      "default": "为您推荐"
    },
    {
      "type": "range",
      "id": "product_limit",
      "label": "推荐商品数量",
      "min": 4,
      "max": 12,
      "step": 2,
      "default": 8
    },
    {
      "type": "checkbox",
      "id": "enable_ab_testing",
      "label": "启用A/B测试",
      "default": true
    }
  ],
  "presets": [
    {
      "name": "个性化推荐",
      "category": "产品"
    }
  ]
}
{% endschema %}
```
