---
source_url: "https://shopify.baoea.com/liquid/performance-optimization"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:54"
fetch_method: "http"
content_hash: "ee3e4feca44b9c5f95398e1ba5d1f12ece96af900ccf34d91521ed085c13f85c"
discovered_via: ["sitemap", "internal_link"]
---
## Liquid 性能优化

优化 Liquid 模板性能对于提供良好的用户体验至关重要。本指南将详细介绍各种性能优化技巧和最佳实践。

## 性能监控和分析[](https://shopify.baoea.com/liquid/performance-optimization#%E6%80%A7%E8%83%BD%E7%9B%91%E6%8E%A7%E5%92%8C%E5%88%86%E6%9E%90)

### 1\. 性能指标测量[](https://shopify.baoea.com/liquid/performance-optimization#1-%E6%80%A7%E8%83%BD%E6%8C%87%E6%A0%87%E6%B5%8B%E9%87%8F)

```
<!-- 渲染时间监控 -->
{% assign start_time = 'now' | date: '%s' | plus: 0 %}
 
<!-- 主要内容渲染 -->
<div class="main-content">
  {% for product in collection.products limit: 20 %}
    {% render 'product-card', product: product %}
  {% endfor %}
</div>
 
{% assign end_time = 'now' | date: '%s' | plus: 0 %}
{% assign render_duration = end_time | minus: start_time %}
 
{% if settings.show_debug_info %}
  <div class="debug-timing">
    <p>页面渲染耗时: {{ render_duration }}秒</p>
    <p>处理商品数量: {{ collection.products.size }}</p>
    <p>平均每个商品: {{ render_duration | divided_by: collection.products.size | round: 3 }}秒</p>
  </div>
{% endif %}
```

### 2\. 对象访问统计[](https://shopify.baoea.com/liquid/performance-optimization#2-%E5%AF%B9%E8%B1%A1%E8%AE%BF%E9%97%AE%E7%BB%9F%E8%AE%A1)

```
<!-- 统计复杂操作次数 -->
{% assign filter_operations = 0 %}
{% assign sort_operations = 0 %}
{% assign loop_iterations = 0 %}
 
<!-- 监控性能关键指标 -->
{% if settings.performance_monitoring %}
  <script>
    window.performanceMetrics = {
      totalProducts: {{ collection.products.size }},
      filteredProducts: {{ collection.products | where: 'available', true | size }},
      renderStartTime: performance.now()
    };
  </script>
{% endif %}
```

## 数据预处理优化[](https://shopify.baoea.com/liquid/performance-optimization#%E6%95%B0%E6%8D%AE%E9%A2%84%E5%A4%84%E7%90%86%E4%BC%98%E5%8C%96)

### 1\. 减少重复计算[](https://shopify.baoea.com/liquid/performance-optimization#1-%E5%87%8F%E5%B0%91%E9%87%8D%E5%A4%8D%E8%AE%A1%E7%AE%97)

```
<!-- 不好的做法 - 重复计算 -->
{% for product in collection.products %}
  {% if collection.products.size > 20 %}
    <!-- 每次循环都计算 size -->
  {% endif %}
  {% if collection.products | where: 'available', true | size > 10 %}
    <!-- 每次循环都执行复杂过滤 -->
  {% endif %}
{% endfor %}
 
<!-- 好的做法 - 预计算 -->
{% assign total_products = collection.products.size %}
{% assign available_products = collection.products | where: 'available', true %}
{% assign available_count = available_products.size %}
{% assign large_collection = total_products > 20 %}
{% assign has_sufficient_stock = available_count > 10 %}
 
{% for product in collection.products %}
  {% if large_collection %}
    <!-- 使用预计算的布尔值 -->
  {% endif %}
  {% if has_sufficient_stock %}
    <!-- 使用预计算的结果 -->
  {% endif %}
{% endfor %}
```

### 2\. 智能数据分组[](https://shopify.baoea.com/liquid/performance-optimization#2-%E6%99%BA%E8%83%BD%E6%95%B0%E6%8D%AE%E5%88%86%E7%BB%84)

```
<!-- 按需分组数据 -->
{% assign products_by_vendor = collection.products | group_by: 'vendor' %}
{% assign products_by_type = collection.products | group_by: 'type' %}
{% assign price_ranges = collection.products | group_by: 'price' %}
 
<!-- 使用分组数据进行高效渲染 -->
{% for vendor_group in products_by_vendor %}
  <div class="vendor-section">
    <h3>{{ vendor_group.name }}</h3>
    <div class="vendor-products">
      {% for product in vendor_group.items limit: 8 %}
        {% render 'product-card-minimal', product: product %}
      {% endfor %}
    </div>
  </div>
{% endfor %}
```

### 3\. 条件数据加载[](https://shopify.baoea.com/liquid/performance-optimization#3-%E6%9D%A1%E4%BB%B6%E6%95%B0%E6%8D%AE%E5%8A%A0%E8%BD%BD)

```
<!-- 根据页面上下文加载数据 -->
{% case template %}
  {% when 'index' %}
    {% assign featured_products = collections.featured.products | limit: 8 %}
    {% assign new_products = collections.new.products | limit: 4 %}
    <!-- 首页只加载必要数据 -->
    
  {% when 'collection' %}
    {% assign all_products = collection.products %}
    {% assign filter_options = collection.products | map: 'vendor' | uniq %}
    <!-- 集合页加载完整数据 -->
    
  {% when 'product' %}
    {% assign related_products = collections[product.type] | default: collections.all | limit: 4 %}
    <!-- 产品页只加载相关产品 -->
{% endcase %}
```

## 循环和迭代优化[](https://shopify.baoea.com/liquid/performance-optimization#%E5%BE%AA%E7%8E%AF%E5%92%8C%E8%BF%AD%E4%BB%A3%E4%BC%98%E5%8C%96)

### 1\. 限制循环次数[](https://shopify.baoea.com/liquid/performance-optimization#1-%E9%99%90%E5%88%B6%E5%BE%AA%E7%8E%AF%E6%AC%A1%E6%95%B0)

```
<!-- 设置合理的限制 -->
{% assign max_products = 20 %}
{% assign max_reviews = 5 %}
{% assign max_images = 10 %}
 
{% for product in collection.products limit: max_products %}
  <div class="product-item">
    <h3>{{ product.title }}</h3>
    
    <!-- 限制嵌套循环 -->
    {% for image in product.images limit: max_images %}
      <img src="{{ image | image_url: width: 100, height: 100 }}" alt="{{ image.alt }}">
    {% endfor %}
  </div>
{% endfor %}
```

### 2\. 早期跳出优化[](https://shopify.baoea.com/liquid/performance-optimization#2-%E6%97%A9%E6%9C%9F%E8%B7%B3%E5%87%BA%E4%BC%98%E5%8C%96)

```
<!-- 使用 break 和 continue 优化循环 -->
{% assign featured_count = 0 %}
{% assign max_featured = 6 %}
 
{% for product in collection.products %}
  <!-- 跳过不可用商品 -->
  {% unless product.available %}
    {% continue %}
  {% endunless %}
  
  <!-- 达到目标数量后退出 -->
  {% if featured_count >= max_featured %}
    {% break %}
  {% endif %}
  
  {% if product.tags contains 'featured' %}
    {% render 'featured-product-card', product: product %}
    {% assign featured_count = featured_count | plus: 1 %}
  {% endif %}
{% endfor %}
```

### 3\. 批处理优化[](https://shopify.baoea.com/liquid/performance-optimization#3-%E6%89%B9%E5%A4%84%E7%90%86%E4%BC%98%E5%8C%96)

```
<!-- 批量处理数据 -->
{% assign batch_size = 10 %}
{% assign total_batches = collection.products.size | divided_by: batch_size | ceil %}
 
{% for i in (0..total_batches) %}
  {% assign start_index = i | times: batch_size %}
  {% assign end_index = start_index | plus: batch_size | minus: 1 %}
  
  <div class="product-batch" data-batch="{{ i }}">
    {% for product in collection.products limit: batch_size offset: start_index %}
      {% render 'product-card', product: product %}
    {% endfor %}
  </div>
{% endfor %}
```

## 过滤器优化[](https://shopify.baoea.com/liquid/performance-optimization#%E8%BF%87%E6%BB%A4%E5%99%A8%E4%BC%98%E5%8C%96)

### 1\. 过滤器链优化[](https://shopify.baoea.com/liquid/performance-optimization#1-%E8%BF%87%E6%BB%A4%E5%99%A8%E9%93%BE%E4%BC%98%E5%8C%96)

```
<!-- 优化过滤器顺序 - 先减少数据量 -->
{% assign optimized_products = collection.products 
  | where: 'available', true          <!-- 首先过滤可用性 -->
  | where: 'price', '>', 0            <!-- 过滤有效价格 -->
  | where: 'tags', 'featured'         <!-- 然后过滤标签 -->
  | sort: 'created_at'                <!-- 最后排序 -->
  | reverse                           <!-- 反向排序 -->
  | limit: 12 %}                     <!-- 最终限制数量 -->
 
<!-- 避免反复过滤同一数据集 -->
{% assign base_products = collection.products | where: 'available', true %}
{% assign featured_products = base_products | where: 'tags', 'featured' %}
{% assign sale_products = base_products | where: 'compare_at_price_max', '>', 0 %}
```

### 2\. 条件过滤[](https://shopify.baoea.com/liquid/performance-optimization#2-%E6%9D%A1%E4%BB%B6%E8%BF%87%E6%BB%A4)

```
<!-- 根据条件应用过滤 -->
{% assign filtered_products = collection.products %}
 
{% if settings.show_only_available %}
  {% assign filtered_products = filtered_products | where: 'available', true %}
{% endif %}
 
{% if settings.min_price > 0 %}
  {% assign filtered_products = filtered_products | where: 'price', '>=', settings.min_price %}
{% endif %}
 
{% if settings.featured_only %}
  {% assign filtered_products = filtered_products | where: 'tags', 'featured' %}
{% endif %}
 
<!-- 最后应用排序和限制 -->
{% case settings.sort_order %}
  {% when 'price_asc' %}
    {% assign filtered_products = filtered_products | sort: 'price' %}
  {% when 'price_desc' %}
    {% assign filtered_products = filtered_products | sort: 'price' | reverse %}
  {% when 'created_desc' %}
    {% assign filtered_products = filtered_products | sort: 'created_at' | reverse %}
{% endcase %}
 
{% assign display_products = filtered_products | limit: settings.products_per_page %}
```

### 3\. 缓存过滤结果[](https://shopify.baoea.com/liquid/performance-optimization#3-%E7%BC%93%E5%AD%98%E8%BF%87%E6%BB%A4%E7%BB%93%E6%9E%9C)

```
<!-- 缓存复杂过滤操作的结果 -->
{% comment %} 概念性缓存 - 实际实现需要后端支持 {% endcomment %}
{% assign cache_key = collection.handle | append: '_filtered_' | append: settings.filter_settings %}
 
{% unless cache[cache_key] %}
  {% assign expensive_filtered_data = collection.products 
    | where: 'available', true 
    | map: 'vendor' 
    | uniq 
    | sort %}
  {% comment %} 存储到缓存 {% endcomment %}
{% endunless %}
 
{% assign vendor_list = cache[cache_key] | default: expensive_filtered_data %}
```

## 对象访问优化[](https://shopify.baoea.com/liquid/performance-optimization#%E5%AF%B9%E8%B1%A1%E8%AE%BF%E9%97%AE%E4%BC%98%E5%8C%96)

### 1\. 缓存对象引用[](https://shopify.baoea.com/liquid/performance-optimization#1-%E7%BC%93%E5%AD%98%E5%AF%B9%E8%B1%A1%E5%BC%95%E7%94%A8)

```
<!-- 缓存深层对象访问 -->
{% assign selected_variant = product.selected_or_first_available_variant %}
{% assign variant_image = selected_variant.featured_image %}
{% assign variant_price = selected_variant.price %}
{% assign variant_available = selected_variant.available %}
 
<!-- 使用缓存的引用 -->
<div class="product-variant">
  {% if variant_image %}
    <img src="{{ variant_image | image_url: width: 300, height: 300 }}" alt="{{ product.title }}">
  {% endif %}
  
  <div class="variant-info">
    <p class="price">{{ variant_price | money }}</p>
    <p class="availability">
      {% if variant_available %}有库存{% else %}缺货{% endif %}
    </p>
  </div>
</div>
```

### 2\. 避免重复对象查找[](https://shopify.baoea.com/liquid/performance-optimization#2-%E9%81%BF%E5%85%8D%E9%87%8D%E5%A4%8D%E5%AF%B9%E8%B1%A1%E6%9F%A5%E6%89%BE)

```
<!-- 不好的做法 -->
{% for item in cart.items %}
  {% if collections[item.product.type] %}
    {% for related in collections[item.product.type].products limit: 3 %}
      <!-- 每次都查找集合 -->
    {% endfor %}
  {% endif %}
{% endfor %}
 
<!-- 好的做法 -->
{% assign product_collections = '' %}
{% for item in cart.items %}
  {% assign type_collection = collections[item.product.type] %}
  {% if type_collection %}
    {% assign collection_key = item.product.type %}
    {% unless product_collections contains collection_key %}
      {% assign product_collections = product_collections | append: collection_key | append: ',' %}
      
      <!-- 处理集合数据 -->
      {% for related in type_collection.products limit: 3 %}
        {% render 'related-product', product: related %}
      {% endfor %}
    {% endunless %}
  {% endif %}
{% endfor %}
```

## 图片和媒体优化[](https://shopify.baoea.com/liquid/performance-optimization#%E5%9B%BE%E7%89%87%E5%92%8C%E5%AA%92%E4%BD%93%E4%BC%98%E5%8C%96)

### 1\. 智能图片尺寸[](https://shopify.baoea.com/liquid/performance-optimization#1-%E6%99%BA%E8%83%BD%E5%9B%BE%E7%89%87%E5%B0%BA%E5%AF%B8)

```
<!-- 响应式图片尺寸 -->
{% assign base_size = 400 %}
{% if request.user_agent contains 'Mobile' %}
  {% assign base_size = 300 %}
{% endif %}
 
{% assign srcset_sizes = '' %}
 
<!-- 使用 image_url 按宽度生成 srcset（单位 w） -->
{% for multiplier in (1..3) %}
  {% assign size = base_size | times: multiplier %}
  {% assign srcset_entry = product.featured_image | image_url: width: size | append: ' ' | append: size | append: 'w' %}
  {% if srcset_sizes == '' %}
    {% assign srcset_sizes = srcset_entry %}
  {% else %}
    {% assign srcset_sizes = srcset_sizes | append: ', ' | append: srcset_entry %}
  {% endif %}
{% endfor %}
 
<img src="{{ product.featured_image | image_url: width: base_size }}"
     srcset="{{ srcset_sizes }}"
     sizes="(max-width: 768px) 300px, 400px"
     alt="{{ product.title }}"
     loading="lazy">
```

### 2\. 延迟加载实现[](https://shopify.baoea.com/liquid/performance-optimization#2-%E5%BB%B6%E8%BF%9F%E5%8A%A0%E8%BD%BD%E5%AE%9E%E7%8E%B0)

```
<!-- 使用 Intersection Observer 的延迟加载 -->
<img class="lazy-load"
     data-src="{{ product.featured_image | image_url: width: 400, height: 400 }}"
     data-srcset="{{ product.featured_image | image_url: width: 400, height: 400 }} 1x, {{ product.featured_image | image_url: width: 800, height: 800 }} 2x"
     src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f0f0f0'/%3E%3C/svg%3E"
     alt="{{ product.title }}"
     loading="lazy">
 
<script>
document.addEventListener('DOMContentLoaded', function() {
  const lazyImages = document.querySelectorAll('.lazy-load');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          img.classList.remove('lazy-load');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(function(img) {
      imageObserver.observe(img);
    });
  } else {
    // 降级处理
    lazyImages.forEach(function(img) {
      img.src = img.dataset.src;
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
    });
  }
});
</script>
```

### 3\. 预加载关键资源[](https://shopify.baoea.com/liquid/performance-optimization#3-%E9%A2%84%E5%8A%A0%E8%BD%BD%E5%85%B3%E9%94%AE%E8%B5%84%E6%BA%90)

```
<!-- 预加载关键图片 -->
{% if product.featured_image %}
  <link rel="preload" 
        as="image" 
        href="{{ product.featured_image | image_url: width: 600, height: 600 }}"
        imagesrcset="{{ product.featured_image | image_url: width: 300, height: 300 }} 300w,
                     {{ product.featured_image | image_url: width: 600, height: 600 }} 600w,
                     {{ product.featured_image | image_url: width: 1200, height: 1200 }} 1200w">
{% endif %}
 
<!-- 预加载关键字体 -->
<link rel="preload" href="{{ 'font-primary.woff2' | asset_url }}" as="font" type="font/woff2" crossorigin>
 
<!-- 预连接到外部资源 -->
<link rel="preconnect" href="https://cdn.shopify.com">
<link rel="dns-prefetch" href="https://monorail-edge.shopifysvc.com">
```

## 代码分割和模块化[](https://shopify.baoea.com/liquid/performance-optimization#%E4%BB%A3%E7%A0%81%E5%88%86%E5%89%B2%E5%92%8C%E6%A8%A1%E5%9D%97%E5%8C%96)

### 1\. 条件加载组件[](https://shopify.baoea.com/liquid/performance-optimization#1-%E6%9D%A1%E4%BB%B6%E5%8A%A0%E8%BD%BD%E7%BB%84%E4%BB%B6)

```
<!-- 只在需要时加载复杂组件 -->
{% if template contains 'product' %}
  {% render 'product-recommendations', product: product %}
  {% render 'product-reviews', product: product %}
{% endif %}
 
{% if template contains 'cart' %}
  {% render 'cart-upsells' %}
  {% render 'shipping-calculator' %}
{% endif %}
 
{% if customer %}
  {% render 'customer-dashboard' %}
{% else %}
  {% render 'guest-features' %}
{% endif %}
```

### 2\. 异步内容加载[](https://shopify.baoea.com/liquid/performance-optimization#2-%E5%BC%82%E6%AD%A5%E5%86%85%E5%AE%B9%E5%8A%A0%E8%BD%BD)

```
<!-- 标记异步加载区域 -->
<div id="product-reviews" 
     data-product-id="{{ product.id }}"
     data-load-async="true">
  <div class="loading-skeleton">
    <div class="skeleton-text"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text"></div>
  </div>
</div>
 
<div id="related-products" 
     data-collection="{{ product.type | handle }}"
     data-load-async="true">
  <div class="loading-skeleton">
    {% for i in (1..4) %}
      <div class="skeleton-product-card"></div>
    {% endfor %}
  </div>
</div>
 
<script>
// 异步加载内容
document.addEventListener('DOMContentLoaded', function() {
  const asyncElements = document.querySelectorAll('[data-load-async]');
  
  asyncElements.forEach(function(element) {
    // 使用 Intersection Observer 在元素进入视口时加载
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          loadAsyncContent(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(element);
  });
});
</script>
```

### 3\. 渐进式渲染[](https://shopify.baoea.com/liquid/performance-optimization#3-%E6%B8%90%E8%BF%9B%E5%BC%8F%E6%B8%B2%E6%9F%93)

```
<!-- 分批渲染大量内容 -->
{% assign total_products = collection.products.size %}
{% assign batch_size = 12 %}
{% assign initial_batch = batch_size %}
 
<!-- 首批内容立即渲染 -->
<div class="products-initial">
  {% for product in collection.products limit: initial_batch %}
    {% render 'product-card', product: product %}
  {% endfor %}
</div>
 
<!-- 剩余内容延迟渲染 -->
{% if total_products > initial_batch %}
  <div class="products-lazy" style="display: none;">
    {% for product in collection.products offset: initial_batch %}
      {% render 'product-card', product: product %}
    {% endfor %}
  </div>
  
  <button id="load-more" class="btn btn-secondary">
    加载更多 ({{ total_products | minus: initial_batch }} 个商品)
  </button>
  
  <script>
  document.getElementById('load-more').addEventListener('click', function() {
    const lazyProducts = document.querySelector('.products-lazy');
    lazyProducts.style.display = 'block';
    this.style.display = 'none';
  });
  </script>
{% endif %}
```

## 缓存策略[](https://shopify.baoea.com/liquid/performance-optimization#%E7%BC%93%E5%AD%98%E7%AD%96%E7%95%A5)

### 1\. 模板级缓存[](https://shopify.baoea.com/liquid/performance-optimization#1-%E6%A8%A1%E6%9D%BF%E7%BA%A7%E7%BC%93%E5%AD%98)

```
<!-- 使用 metafields 进行简单缓存 -->
{% assign cache_key = 'expensive_calculation_' | append: collection.id %}
{% assign cache_ttl = 3600 %} <!-- 1小时 -->
{% assign current_time = 'now' | date: '%s' | plus: 0 %}
 
{% assign cached_result = shop.metafields.cache[cache_key] %}
{% assign cache_time = shop.metafields.cache[cache_key | append: '_time'] | plus: 0 %}
 
{% if cached_result == blank or current_time | minus: cache_time > cache_ttl %}
  <!-- 重新计算 -->
  {% assign expensive_result = collection.products 
    | where: 'available', true 
    | group_by: 'vendor' 
    | map: 'name' 
    | join: ',' %}
  
  {% comment %} 
  在实际应用中，这里需要后端API来设置metafields
  {% endcomment %}
  
  {% assign cached_result = expensive_result %}
{% endif %}
 
<!-- 使用缓存的结果 -->
{{ cached_result }}
```

### 2\. 浏览器缓存优化[](https://shopify.baoea.com/liquid/performance-optimization#2-%E6%B5%8F%E8%A7%88%E5%99%A8%E7%BC%93%E5%AD%98%E4%BC%98%E5%8C%96)

```
<!-- 设置适当的缓存头 -->
<script>
// 利用浏览器缓存存储计算结果
const cacheKey = 'collection_{{ collection.id }}_filters';
const cacheTime = 'collection_{{ collection.id }}_time';
const maxAge = 1800000; // 30分钟
 
let cachedData = localStorage.getItem(cacheKey);
let cachedTime = localStorage.getItem(cacheTime);
 
if (!cachedData || !cachedTime || Date.now() - parseInt(cachedTime) > maxAge) {
  // 重新计算并缓存
  const freshData = calculateExpensiveData();
  localStorage.setItem(cacheKey, JSON.stringify(freshData));
  localStorage.setItem(cacheTime, Date.now().toString());
  cachedData = freshData;
} else {
  cachedData = JSON.parse(cachedData);
}
</script>
```

## 性能监控和分析[](https://shopify.baoea.com/liquid/performance-optimization#%E6%80%A7%E8%83%BD%E7%9B%91%E6%8E%A7%E5%92%8C%E5%88%86%E6%9E%90-1)

### 1\. 实时性能监控[](https://shopify.baoea.com/liquid/performance-optimization#1-%E5%AE%9E%E6%97%B6%E6%80%A7%E8%83%BD%E7%9B%91%E6%8E%A7)

```
<!-- 性能监控脚本 -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  const perfData = {
    // 页面加载性能
    loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
    domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
    firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
    
    // Liquid 特定指标
    liquidObjects: {
      products: {{ collection.products.size | default: 0 }},
      variants: {{ product.variants.size | default: 0 }},
      images: {{ product.images.size | default: 0 }}
    },
    
    // 页面类型
    template: '{{ template }}',
    pageType: '{{ request.page_type }}'
  };
  
  // 发送性能数据到分析服务
  if (window.gtag) {
    gtag('event', 'page_performance', {
      custom_parameter_1: perfData.loadTime,
      custom_parameter_2: perfData.liquidObjects.products
    });
  }
  
  // 开发环境下显示性能信息
  {% if settings.debug_mode %}
  console.log('页面性能数据:', perfData);
  {% endif %}
});
</script>
```

### 2\. Core Web Vitals 优化[](https://shopify.baoea.com/liquid/performance-optimization#2-core-web-vitals-%E4%BC%98%E5%8C%96)

```
<!-- Core Web Vitals 优化 -->
<script>
// 监控 LCP (Largest Contentful Paint)
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log('LCP:', lastEntry.startTime);
}).observe({entryTypes: ['largest-contentful-paint']});
 
// 监控 FID (First Input Delay)
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  entries.forEach((entry) => {
    console.log('FID:', entry.processingStart - entry.startTime);
  });
}).observe({entryTypes: ['first-input']});
 
// 监控 CLS (Cumulative Layout Shift)
let clsValue = 0;
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (!entry.hadRecentInput) {
      clsValue += entry.value;
    }
  }
  console.log('CLS:', clsValue);
}).observe({entryTypes: ['layout-shift']});
</script>
```

## 移动端优化[](https://shopify.baoea.com/liquid/performance-optimization#%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%BC%98%E5%8C%96)

### 1\. 移动端特定优化[](https://shopify.baoea.com/liquid/performance-optimization#1-%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%89%B9%E5%AE%9A%E4%BC%98%E5%8C%96)

```
<!-- 检测移动设备 -->
{% assign is_mobile = request.user_agent contains 'Mobile' %}
{% assign is_tablet = request.user_agent contains 'Tablet' %}
 
<!-- 移动端优化的图片尺寸 -->
{% if is_mobile %}
  {% assign image_width = 300 %}
  {% assign products_per_row = 2 %}
  {% assign max_products = 8 %}
{% elsif is_tablet %}
  {% assign image_width = 400 %}
  {% assign products_per_row = 3 %}
  {% assign max_products = 12 %}
{% else %}
  {% assign image_width = 500 %}
  {% assign products_per_row = 4 %}
  {% assign max_products = 16 %}
{% endif %}
 
<!-- 移动端优化的布局 -->
<div class="products-grid mobile-optimized" 
     data-columns="{{ products_per_row }}">
  {% for product in collection.products limit: max_products %}
    <div class="product-card">
      <img src="{{ product.featured_image | image_url: width: image_width }}" 
           alt="{{ product.title }}"
           loading="lazy">
      <h3>{{ product.title | truncate: 30 }}</h3>
      <p>{{ product.price | money }}</p>
    </div>
  {% endfor %}
</div>
```

### 2\. 触摸优化[](https://shopify.baoea.com/liquid/performance-optimization#2-%E8%A7%A6%E6%91%B8%E4%BC%98%E5%8C%96)

```
<!-- 为移动设备优化的交互元素 -->
{% if is_mobile %}
<style>
.product-card {
  /* 增大触摸目标 */
  min-height: 44px;
  padding: 12px;
}
 
.btn {
  /* 移动端按钮优化 */
  min-height: 44px;
  font-size: 16px; /* 防止iOS缩放 */
}
 
.touch-friendly {
  /* 为触摸优化的间距 */
  margin: 8px 0;
  padding: 12px 16px;
}
</style>
{% endif %}
```

## 总结和最佳实践[](https://shopify.baoea.com/liquid/performance-optimization#%E6%80%BB%E7%BB%93%E5%92%8C%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5)

### 性能优化清单[](https://shopify.baoea.com/liquid/performance-optimization#%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%B8%85%E5%8D%95)

1.  **数据预处理**
    
    *   缓存复杂计算结果
    *   减少重复过滤操作
    *   合理使用 limit 限制数据量
2.  **循环优化**
    
    *   使用 break 和 continue
    *   避免深层嵌套循环
    *   批处理大量数据
3.  **对象访问**
    
    *   缓存深层对象引用
    *   避免重复查找
    *   使用条件加载
4.  **图片优化**
    
    *   响应式图片尺寸
    *   延迟加载
    *   预加载关键资源
5.  **代码组织**
    
    *   模块化组件
    *   条件渲染
    *   异步加载

## 下一步学习[](https://shopify.baoea.com/liquid/performance-optimization#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

掌握性能优化后，建议继续学习：

1.  [调试和故障排除](https://shopify.baoea.com/liquid/troubleshooting) - 性能问题诊断
2.  [最佳实践](https://shopify.baoea.com/liquid/best-practices) - 综合开发规范
3.  [主题开发实战](https://shopify.baoea.com/liquid/theme-development-practices) - 实际项目应用
4.  [测试和质量保证](https://shopify.baoea.com/liquid/testing-deployment) - 确保代码质量

性能优化是一个持续的过程，需要在开发中不断监控、测试和改进！
