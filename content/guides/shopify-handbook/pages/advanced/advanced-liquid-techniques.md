---
source_url: "https://shopify.baoea.com/advanced/advanced-liquid-techniques"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:26:30"
fetch_method: "http"
content_hash: "aa11b8f60d71b067b7321c77a28d8cb79744e445c8b52bdc8dfe9548c1ba646b"
discovered_via: ["sitemap", "internal_link"]
---
## Liquid 进阶技巧

本教程面向已经熟悉 Liquid 基础语法，正在或将要负责主题级别工程的开发者。重点不在”Liquid 能做什么”，而在**生产级主题中的可靠模式**：如何处理复杂数据、如何控制性能、如何把代码组织得可维护。

阅读前置：

*   熟悉 Liquid 基础（assign、for、if、capture、render）
*   理解 Shopify 主题目录结构（layout、templates、sections、snippets）
*   推荐先阅读 [Liquid 最佳实践](https://shopify.baoea.com/liquid/best-practices)

## 一、复杂数据结构处理[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E4%B8%80%E5%A4%8D%E6%9D%82%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E5%A4%84%E7%90%86)

Liquid 没有原生的数组操作 API，处理多维或动态结构时需要借助字符串拼接与 split。

### 唯一值收集（去重）[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E5%94%AF%E4%B8%80%E5%80%BC%E6%94%B6%E9%9B%86%E5%8E%BB%E9%87%8D)

从产品集合中收集所有唯一 tag：

```
{%- liquid
  assign all_tags = ''
  for product in collection.products
    for tag in product.tags
      unless all_tags contains tag
        assign all_tags = all_tags | append: tag | append: '|'
      endunless
    endfor
  endfor
  assign tags_array = all_tags | split: '|' | compact
-%}
 
<ul class="tag-cloud">
  {%- for tag in tags_array -%}
    <li><a href="{{ collection.url }}/{{ tag | handle }}">{{ tag }}</a></li>
  {%- endfor -%}
</ul>
```

**关键点**：

*   用 `|` 而非 `,` 作为分隔符，避免 tag 本身含逗号时拆分错误
*   `compact` 过滤器移除空字符串
*   这种模式对 collection.products.size > 200 会有性能压力，大集合应考虑用 metafield 预存

### 构建 JSON 输出[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E6%9E%84%E5%BB%BA-json-%E8%BE%93%E5%87%BA)

为前端 JavaScript 提供数据时，**永远不要拼字符串**。用 Shopify 的 `json` filter：

```
{%- liquid
  assign products_data = ''
-%}
<script>
window.collectionData = {
  "title": {{ collection.title | json }},
  "handle": {{ collection.handle | json }},
  "products_count": {{ collection.products.size }},
  "products": [
    {%- for product in collection.products limit: 12 -%}
      {
        "id": {{ product.id }},
        "title": {{ product.title | json }},
        "handle": {{ product.handle | json }},
        "url": {{ product.url | json }},
        "price": {{ product.price }},
        "available": {{ product.available }},
        "image": {{ product.featured_image | image_url: width: 600 | json }}
      }{% unless forloop.last %},{% endunless %}
    {%- endfor -%}
  ]
};
</script>
```

**关键点**：

*   `json` filter 自动处理引号、转义、Unicode
*   价格保持整数（cents），前端再除以 100
*   `forloop.last` 控制逗号

### 动态属性访问[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E5%8A%A8%E6%80%81%E5%B1%9E%E6%80%A7%E8%AE%BF%E9%97%AE)

Liquid 支持方括号语法访问对象属性：

```
{%- liquid
  assign meta_key = 'specifications'
  assign specs = product.metafields.custom[meta_key]
-%}
 
{%- for i in (1..3) -%}
  {%- assign option_key = 'option' | append: i -%}
  {%- if product[option_key] != blank -%}
    <div class="option">{{ product[option_key] }}</div>
  {%- endif -%}
{%- endfor -%}
```

应用场景：

*   多语言字段从 metafield 按 locale 动态取值
*   配置驱动的列表渲染（同一个 section 服务多种类型）
*   A/B 测试时根据用户分组选择不同内容字段

## 二、过滤器链式优化[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E4%BA%8C%E8%BF%87%E6%BB%A4%E5%99%A8%E9%93%BE%E5%BC%8F%E4%BC%98%E5%8C%96)

过滤器可以链式组合，但**顺序很重要**——错误顺序导致结果不同或性能下降。

### 顺序原则[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E9%A1%BA%E5%BA%8F%E5%8E%9F%E5%88%99)

**先过滤、再排序、最后限量**：

```
{# 推荐：先 where 后 sort #}
{% assign featured_products = collection.products
   | where: 'available'
   | sort: 'created_at'
   | reverse
   | slice: 0, 6 %}
```

```
{# 不推荐：先 sort 后 where，sort 浪费在被过滤掉的元素上 #}
{% assign featured_products = collection.products
   | sort: 'created_at'
   | reverse
   | where: 'available'
   | slice: 0, 6 %}
```

虽然结果相同，前者在大集合（> 1000 产品）上明显更快。

### 多条件 where 链式[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E5%A4%9A%E6%9D%A1%E4%BB%B6-where-%E9%93%BE%E5%BC%8F)

```
{% assign sale_featured = collection.products
   | where: 'available'
   | where: 'tags', 'featured'
   | where: 'compare_at_price', '>', 0 %}
```

每个 `where` 都是 O(n) 遍历。如果有 5000 产品，三个 `where` 链 = 15000 次比较。建议先用 paginate 或集合预筛限制范围。

### 字符串处理链[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%A4%84%E7%90%86%E9%93%BE)

```
{%- liquid
  assign description = product.description
    | strip_html
    | strip_newlines
    | truncate: 160, '…'
    | escape
-%}
 
<meta name="description" content="{{ description }}">
```

`strip_html` 必须最先，否则 `<p>…</p>` 内的标点会被截断算错字数。

## 三、循环性能模式[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E4%B8%89%E5%BE%AA%E7%8E%AF%E6%80%A7%E8%83%BD%E6%A8%A1%E5%BC%8F)

### tablerow 替代 for + 网格 CSS[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#tablerow-%E6%9B%BF%E4%BB%A3-for--%E7%BD%91%E6%A0%BC-css)

需要固定列数的网格时，`tablerow` 比 for + CSS Grid 更简洁：

```
{% tablerow product in collection.products cols: 4 limit: 12 %}
  {% render 'product-card', product: product %}
{% endtablerow %}
```

生成的 HTML 是 `<table>` 结构，对静态展示性能略优于 CSS Grid。但缺乏响应式能力（不同断点切换列数），所以**仅适合桌面端固定布局或邮件模板**。

### break 与 continue 早退[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#break-%E4%B8%8E-continue-%E6%97%A9%E9%80%80)

```
{%- liquid
  assign featured_count = 0
  for product in collection.products
    unless product.available
      continue
    endunless
 
    if product.tags contains 'featured'
      assign featured_count = featured_count | plus: 1
      render 'product-card', product: product
      if featured_count >= 6
        break
      endif
    endif
  endfor
-%}
```

`break` 在找到足够元素后立即退出，避免遍历整个集合。

### 数据预处理移出循环[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E6%95%B0%E6%8D%AE%E9%A2%84%E5%A4%84%E7%90%86%E7%A7%BB%E5%87%BA%E5%BE%AA%E7%8E%AF)

循环内的重复计算是常见性能瓶颈：

```
{# 反例：循环内每次都重新计算 #}
{% for product in collection.products %}
  {% if collection.products.size > 10 %}
    {# size 在每次迭代中都被访问 #}
  {% endif %}
{% endfor %}
 
{# 推荐：循环外预计算 #}
{%- liquid
  assign total_count = collection.products.size
  assign should_show_extra = false
  if total_count > 10
    assign should_show_extra = true
  endif
-%}
 
{% for product in collection.products %}
  {% if should_show_extra %}
    {# 使用预计算的标志 #}
  {% endif %}
{% endfor %}
```

## 四、复杂条件逻辑[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E5%9B%9B%E5%A4%8D%E6%9D%82%E6%9D%A1%E4%BB%B6%E9%80%BB%E8%BE%91)

### 多重条件组合用单独的 assign 化简[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E5%A4%9A%E9%87%8D%E6%9D%A1%E4%BB%B6%E7%BB%84%E5%90%88%E7%94%A8%E5%8D%95%E7%8B%AC%E7%9A%84-assign-%E5%8C%96%E7%AE%80)

```
{# 反例：深层嵌套难读 #}
{% if customer %}
  {% if customer.orders.size > 0 %}
    {% if customer.total_spent > 100000 %}
      {% if customer.tags contains 'vip' %}
        <!-- VIP 内容 -->
      {% endif %}
    {% endif %}
  {% endif %}
{% endif %}
 
{# 推荐：扁平化布尔值 #}
{%- liquid
  assign is_vip = false
  if customer
    and customer.orders.size > 0
    and customer.total_spent > 100000
    and customer.tags contains 'vip'
    assign is_vip = true
  endif
-%}
 
{% if is_vip %}
  <!-- VIP 内容 -->
{% endif %}
```

### case / when 替代多分支 if[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#case--when-%E6%9B%BF%E4%BB%A3%E5%A4%9A%E5%88%86%E6%94%AF-if)

```
{%- liquid
  case template
    when 'product'
      assign body_class = 'page--product'
    when 'collection'
      assign body_class = 'page--collection'
    when 'cart'
      assign body_class = 'page--cart'
    when 'index'
      assign body_class = 'page--home'
    else
      assign body_class = 'page--default'
  endcase
-%}
 
<body class="{{ body_class }}">
```

### 时间窗口判断[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E6%97%B6%E9%97%B4%E7%AA%97%E5%8F%A3%E5%88%A4%E6%96%AD)

```
{%- liquid
  assign now = 'now' | date: '%s' | times: 1
  assign sale_start = settings.sale_start | date: '%s' | times: 1
  assign sale_end = settings.sale_end | date: '%s' | times: 1
  assign is_sale_active = false
  if now >= sale_start and now <= sale_end
    assign is_sale_active = true
  endif
-%}
 
{% if is_sale_active %}
  <div class="sale-banner">限时优惠中</div>
{% endif %}
```

`'now' | date: '%s'` 返回 Unix 时间戳字符串，乘 1 转为数字才能比较。

## 五、字符串处理进阶[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E4%BA%94%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%A4%84%E7%90%86%E8%BF%9B%E9%98%B6)

### SKU 解析[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#sku-%E8%A7%A3%E6%9E%90)

按规则解码 SKU 提取分类信息：

```
{%- liquid
  assign sku_parts = product.sku | split: '-'
  assign category = sku_parts[0]
  assign size = sku_parts[1]
  assign color = sku_parts[2]
-%}
 
<div class="product-meta" data-category="{{ category }}" data-color="{{ color }}">
```

### 动态 CSS 类名拼接[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E5%8A%A8%E6%80%81-css-%E7%B1%BB%E5%90%8D%E6%8B%BC%E6%8E%A5)

```
{%- liquid
  assign css_classes = 'product-card'
  unless product.available
    assign css_classes = css_classes | append: ' is-sold-out'
  endunless
  if product.tags contains 'new'
    assign css_classes = css_classes | append: ' is-new'
  endif
  if product.compare_at_price > product.price
    assign css_classes = css_classes | append: ' is-on-sale'
  endif
-%}
 
<div class="{{ css_classes }}">
```

### 智能截断保持完整词[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E6%99%BA%E8%83%BD%E6%88%AA%E6%96%AD%E4%BF%9D%E6%8C%81%E5%AE%8C%E6%95%B4%E8%AF%8D)

`truncate` 会在字符位置硬切，可能截掉半个单词。保持单词完整：

```
{%- liquid
  assign desc = product.description | strip_html
  if desc.size > 150
    assign truncated = desc | truncate: 150, ''
    assign words = truncated | split: ' '
    assign safe_words = words | slice: 0, -1
    assign final_desc = safe_words | join: ' ' | append: '…'
  else
    assign final_desc = desc
  endif
-%}
 
<p>{{ final_desc }}</p>
```

## 六、组件化与作用域[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E5%85%AD%E7%BB%84%E4%BB%B6%E5%8C%96%E4%B8%8E%E4%BD%9C%E7%94%A8%E5%9F%9F)

### snippet 参数化设计[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#snippet-%E5%8F%82%E6%95%B0%E5%8C%96%E8%AE%BE%E8%AE%A1)

Liquid 没有真正的”函数”，但 `{% render %}` + 命名参数能达到类似效果：

```
{# snippets/price-display.liquid #}
{%- comment %}
  显示价格组件
 
  必需参数：
    price (number) - 价格（cents）
 
  可选参数：
    compare_at_price (number) - 划线价（cents）
    currency_code (string) - 货币代码，默认 cart.currency.iso_code
    show_savings (boolean) - 是否显示节省金额，默认 false
    css_class (string) - 自定义 class
{% endcomment -%}
 
{%- liquid
  assign currency_code = currency_code | default: cart.currency.iso_code
  assign show_savings = show_savings | default: false
  assign css_class = css_class | default: 'price-display'
-%}
 
<div class="{{ css_class }}">
  {%- if compare_at_price and compare_at_price > price -%}
    <span class="price-display__sale">{{ price | money }}</span>
    <span class="price-display__regular"><s>{{ compare_at_price | money }}</s></span>
    {%- if show_savings -%}
      {%- assign savings = compare_at_price | minus: price -%}
      <span class="price-display__savings">省 {{ savings | money }}</span>
    {%- endif -%}
  {%- else -%}
    <span class="price-display__regular">{{ price | money }}</span>
  {%- endif -%}
</div>
```

调用：

```
{% render 'price-display',
   price: product.price,
   compare_at_price: product.compare_at_price,
   show_savings: true %}
```

### 作用域隔离的好处[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%9A%94%E7%A6%BB%E7%9A%84%E5%A5%BD%E5%A4%84)

`{% render %}` 的作用域隔离让 snippet 真正可复用：

*   snippet 内部不会被父模板变量”污染”
*   多次调用时变量不会互相影响
*   重构父模板时无需担心 snippet 副作用

唯一例外：`product`、`section`、`block` 等 Shopify 内置变量在 section 上下文中可自动透传到 snippet（取决于 Shopify 版本）。**显式传参是更安全的做法**。

### Section block 循环[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#section-block-%E5%BE%AA%E7%8E%AF)

支持 block 的 section 可让运营人员在主题编辑器中自由增删模块：

```
{# sections/featured-collections.liquid #}
<div class="featured-collections">
  {%- for block in section.blocks -%}
    {%- case block.type -%}
      {%- when 'collection' -%}
        <div class="featured-collection" {{ block.shopify_attributes }}>
          <h2>{{ block.settings.title }}</h2>
          {%- if block.settings.collection != blank -%}
            {%- render 'collection-preview',
                 collection: collections[block.settings.collection],
                 limit: block.settings.product_count -%}
          {%- endif -%}
        </div>
      {%- when 'banner' -%}
        <div class="featured-banner" {{ block.shopify_attributes }}>
          <img src="{{ block.settings.image | image_url: width: 1200 }}"
               alt="{{ block.settings.alt }}">
        </div>
    {%- endcase -%}
  {%- endfor -%}
</div>
 
{% schema %}
{
  "name": "Featured Collections",
  "blocks": [
    {
      "type": "collection",
      "name": "Collection",
      "settings": [
        { "type": "text", "id": "title", "label": "标题" },
        { "type": "collection", "id": "collection", "label": "集合" },
        { "type": "range", "id": "product_count", "label": "产品数",
          "min": 2, "max": 12, "step": 2, "default": 4 }
      ]
    },
    {
      "type": "banner",
      "name": "Banner",
      "settings": [
        { "type": "image_picker", "id": "image", "label": "图片" },
        { "type": "text", "id": "alt", "label": "Alt 文本" }
      ]
    }
  ],
  "presets": [{ "name": "Featured Collections" }]
}
{% endschema %}
```

`block.shopify_attributes` 是必加的——它让主题编辑器能识别并高亮可点击的 block。

## 七、国际化与本地化[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E4%B8%83%E5%9B%BD%E9%99%85%E5%8C%96%E4%B8%8E%E6%9C%AC%E5%9C%B0%E5%8C%96)

### 翻译键的命名约定[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E7%BF%BB%E8%AF%91%E9%94%AE%E7%9A%84%E5%91%BD%E5%90%8D%E7%BA%A6%E5%AE%9A)

按 `命名空间.作用域.具体内容` 三段式组织：

```
{
  "products": {
    "product": {
      "add_to_cart": "加入购物车",
      "sold_out": "已售罄",
      "on_sale": "限时优惠"
    },
    "facets": {
      "filter_by": "筛选条件",
      "showing_count": "共 {{ count }} 件商品"
    }
  },
  "cart": {
    "general": {
      "subtotal": "小计",
      "free_shipping_remaining": "再加 {{ amount }} 包邮"
    }
  }
}
```

调用：

```
{{ 'products.product.add_to_cart' | t }}
{{ 'products.facets.showing_count' | t: count: collection.products_count }}
{{ 'cart.general.free_shipping_remaining' | t: amount: remaining_amount | money }}
```

### 货币地区化[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E8%B4%A7%E5%B8%81%E5%9C%B0%E5%8C%BA%E5%8C%96)

```
{%- liquid
  assign price_money = product.price | money
  assign price_no_currency = product.price | money_without_currency
  assign price_with_iso = product.price | money_with_currency
-%}
 
<span itemprop="price" content="{{ product.price | divided_by: 100.00 }}">
  {{ price_money }}
</span>
<meta itemprop="priceCurrency" content="{{ cart.currency.iso_code }}">
```

不同 filter 输出：

*   `money`：使用 Markets 配置的格式（如 `$9.99`）
*   `money_without_currency`：仅金额（`9.99`）
*   `money_with_currency`：金额 + ISO 码（`9.99 USD`）

### 多语言内容回退[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E5%A4%9A%E8%AF%AD%E8%A8%80%E5%86%85%E5%AE%B9%E5%9B%9E%E9%80%80)

```
{%- liquid
  assign current_locale = request.locale.iso_code
  assign translated_title = product.metafields.translations[current_locale].title
  assign final_title = translated_title | default: product.title
-%}
 
<h1>{{ final_title }}</h1>
```

`default` filter 在变量为空或 false 时返回 fallback，是回退机制的标准写法。

## 八、调试技巧[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E5%85%AB%E8%B0%83%E8%AF%95%E6%8A%80%E5%B7%A7)

### 输出对象结构[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E8%BE%93%E5%87%BA%E5%AF%B9%E8%B1%A1%E7%BB%93%E6%9E%84)

开发时输出对象的完整 JSON 结构，了解可用字段：

```
{% if settings.debug_mode %}
  <pre style="background:#f4f4f4;padding:1em;font-size:11px;">
    {{ product | json }}
  </pre>
{% endif %}
```

不要在生产环境保留——`product | json` 输出可能包含敏感字段。

### 性能埋点[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E6%80%A7%E8%83%BD%E5%9F%8B%E7%82%B9)

```
{%- assign perf_start = 'now' | date: '%s%L' | times: 1 -%}
 
{# 待测代码块 #}
{%- for product in collection.products -%}
  {# 复杂逻辑 #}
{%- endfor -%}
 
{%- assign perf_end = 'now' | date: '%s%L' | times: 1 -%}
{%- assign perf_diff = perf_end | minus: perf_start -%}
 
{% if settings.show_perf %}
  <div class="perf-info">Block executed in {{ perf_diff }}ms</div>
{% endif %}
```

`%L` 输出毫秒级时间戳。注意 Liquid 渲染时间通常 < 100ms，更精细的性能问题需要在客户端用 Performance API 测。

### 错误边界[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E9%94%99%E8%AF%AF%E8%BE%B9%E7%95%8C)

Liquid 没有 try/catch，但可以用 `default` 与显式检查模拟错误处理：

```
{%- liquid
  assign featured_handle = settings.featured_collection_handle
  assign featured_collection = collections[featured_handle]
-%}
 
{%- if featured_collection and featured_collection.products.size > 0 -%}
  {%- render 'collection-preview', collection: featured_collection -%}
{%- elsif collections.all.products.size > 0 -%}
  {# 回退到全部产品 #}
  {%- render 'collection-preview', collection: collections.all -%}
{%- else -%}
  <p>暂无产品</p>
{%- endif -%}
```

## 九、生产环境注意事项[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E4%B9%9D%E7%94%9F%E4%BA%A7%E7%8E%AF%E5%A2%83%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

### Section 限制[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#section-%E9%99%90%E5%88%B6)

每个 section 文件**最大 1MB**，schema JSON **最大 16KB**。超出会导致主题保存失败。复杂 section 应拆分为多个独立 section 或用 snippet 抽取。

### 全局变量泄露[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F%E6%B3%84%E9%9C%B2)

避免在 layout 中 assign 通用变量名（如 `title`、`description`、`url`）——会污染所有 section / snippet 的作用域。约定命名前缀（如 `_layout_title`）。

### 缓存失效[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E7%BC%93%E5%AD%98%E5%A4%B1%E6%95%88)

Shopify 主题渲染有页面缓存，但**包含 `customer` 对象的内容不缓存**。如果某个 section 引用了 `customer.name`，整个页面的缓存都会被绕过。

优化方法：把客户专属内容用 AJAX 异步加载，主页 HTML 保持纯静态。

### 渲染时间上限[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E6%B8%B2%E6%9F%93%E6%97%B6%E9%97%B4%E4%B8%8A%E9%99%90)

单个模板渲染超过约 1.5 秒会触发 Shopify 的 timeout，返回空白或错误。性能压力最大的位置：

*   主页（多个 section 同时渲染）
*   collection 页（产品列表 + filter）
*   含大量 metafield 查询的产品页

预防：避免 `collections.all.products` 在主页、用 paginate 限定产品列表、把复杂数据预存到 metafield。

## 延伸阅读[](https://shopify.baoea.com/advanced/advanced-liquid-techniques#%E5%BB%B6%E4%BC%B8%E9%98%85%E8%AF%BB)

*   [Liquid 最佳实践](https://shopify.baoea.com/liquid/best-practices)
*   [Liquid 性能优化](https://shopify.baoea.com/liquid/performance-optimization)
*   [代码组织和结构](https://shopify.baoea.com/liquid/code-organization)
*   [Shopify Theme 开发指南](https://shopify.baoea.com/advanced/shopify-theme-development-guide)
*   [Shopify CLI 本地开发](https://shopify.baoea.com/advanced/shopify-local-theme-development)
