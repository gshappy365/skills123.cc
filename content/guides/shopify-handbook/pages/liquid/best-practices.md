---
source_url: "https://shopify.baoea.com/liquid/best-practices"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:35"
fetch_method: "http"
content_hash: "8fac1e13931f04d419e7448794335e6ba79f976a70d29e5c2967a6bda5bd01ec"
discovered_via: ["sitemap", "internal_link"]
---
## Shopify Liquid 主题开发实战要点

本指南聚焦 Shopify 主题开发中真正影响最终交付质量的几类问题。所有示例代码均基于实际项目中反复出现的写法对比，重点在于**为什么这么写**以及**何时不必这么写**——而非泛泛的代码规范。

阅读前置：熟悉 Liquid 基础语法（[官方文档](https://shopify.dev/docs/api/liquid) ）。

## 性能优先：Liquid 对象是惰性查询[](https://shopify.baoea.com/liquid/best-practices#%E6%80%A7%E8%83%BD%E4%BC%98%E5%85%88liquid-%E5%AF%B9%E8%B1%A1%E6%98%AF%E6%83%B0%E6%80%A7%E6%9F%A5%E8%AF%A2)

Shopify 主题性能问题中占比最高的不是过滤器复杂、不是循环嵌套，而是**在循环内反复访问”集合”对象**。

### 问题代码[](https://shopify.baoea.com/liquid/best-practices#%E9%97%AE%E9%A2%98%E4%BB%A3%E7%A0%81)

```
{% for product in collections['featured'].products %}
  {% if collections['featured'].products.size > 4 %}
    <div class="card carousel-item">
      ...
      {% assign related = collections['featured'].products | where: 'tags', product.tags.first %}
      ...
    </div>
  {% endif %}
{% endfor %}
```

上述代码中 `collections['featured'].products` 出现三次，每次都会触发完整的集合查询。当 collection 包含 80 个产品时，等效于 `80 × 3 = 240` 次”调用”。

### 修正写法[](https://shopify.baoea.com/liquid/best-practices#%E4%BF%AE%E6%AD%A3%E5%86%99%E6%B3%95)

```
{% assign featured_products = collections['featured'].products %}
{% assign product_count = featured_products.size %}
 
{% if product_count > 4 %}
  {% for product in featured_products limit: 8 %}
    ...
  {% endfor %}
{% endif %}
```

实测表现：在一个首屏含 4 个 section、每个 section 涉及 collection 访问的主题中，仅此一项优化即可将首页 LCP 从 6.2 秒降至 2.1 秒。

### 核心心智模型[](https://shopify.baoea.com/liquid/best-practices#%E6%A0%B8%E5%BF%83%E5%BF%83%E6%99%BA%E6%A8%A1%E5%9E%8B)

**Shopify 的对象不是 JavaScript 变量，而是惰性查询**。`product`、`collection`、`customer` 等对象每次访问都会触发一次后端数据获取，而非读取已加载的内存对象。

养成习惯：进入任何循环前，用 `{% assign %}` 将待用对象绑定到本地变量。

## 避免使用 `collections.all.products`[](https://shopify.baoea.com/liquid/best-practices#%E9%81%BF%E5%85%8D%E4%BD%BF%E7%94%A8-collectionsallproducts)

在主页 section 或高频渲染模板中使用 `collections.all.products` 是常见性能陷阱。

```
{# 反例 #}
{% assign sale_products = collections.all.products | where: 'compare_at_price_max', '>', 0 %}
```

店铺产品数较少（< 100）时表现正常。但产品数增至 800、3000、10000 时，主页可能直接触发 Shopify 模板渲染时间上限（约 1.5 秒）而报错或返回空。

**正确做法**：让 Shopify 在后台维护集合。创建一个名为 `sale` 的 collection，配置 automated rules 为 “compare\_at\_price 不为空”，然后：

```
{% assign sale_products = collections['sale'].products %}
```

后端预先计算的集合直接返回结果，避免模板渲染时的 O(n) 过滤开销。

## 图片处理：尺寸参数必须精确[](https://shopify.baoea.com/liquid/best-practices#%E5%9B%BE%E7%89%87%E5%A4%84%E7%90%86%E5%B0%BA%E5%AF%B8%E5%8F%82%E6%95%B0%E5%BF%85%E9%A1%BB%E7%B2%BE%E7%A1%AE)

`image_url` 过滤器若不传 `width` 参数，返回的是**原图**——可能是 4000px × 4000px、5MB 体积的原始文件。即使浏览器最终缩放到 300px 显示，下载流量已经发生。

### 反例[](https://shopify.baoea.com/liquid/best-practices#%E5%8F%8D%E4%BE%8B)

```
{# 卡片显示宽度 300px，却取了 1500px #}
<img src="{{ product.featured_image | image_url: width: 1500 }}">
 
{# 未指定宽度，返回原图 #}
<img src="{{ product.featured_image | image_url }}">
```

### 推荐：封装为 responsive-image snippet[](https://shopify.baoea.com/liquid/best-practices#%E6%8E%A8%E8%8D%90%E5%B0%81%E8%A3%85%E4%B8%BA-responsive-image-snippet)

```
{% comment %}
  snippets/responsive-image.liquid
 
  参数:
    image (必需) - image 对象
    sizes (可选, 默认 "100vw") - CSS sizes 属性
    widths (可选, 默认 "300, 600, 900, 1200") - srcset 候选宽度
    class (可选) - 额外 class
{% endcomment %}
 
{%- assign sizes = sizes | default: "100vw" -%}
{%- assign widths = widths | default: "300, 600, 900, 1200" -%}
{%- assign widths_array = widths | split: ", " -%}
 
{%- capture srcset -%}
  {%- for w in widths_array -%}
    {{ image | image_url: width: w }} {{ w }}w{%- unless forloop.last -%},{%- endunless -%}
  {%- endfor -%}
{%- endcapture -%}
 
<img
  src="{{ image | image_url: width: 600 }}"
  srcset="{{ srcset }}"
  sizes="{{ sizes }}"
  alt="{{ image.alt | escape }}"
  class="{{ class }}"
  loading="lazy"
  width="{{ image.width }}"
  height="{{ image.height }}"
>
```

调用：

```
{% render 'responsive-image',
   image: product.featured_image,
   sizes: '(min-width: 768px) 33vw, 100vw',
   widths: '300, 600, 900' %}
```

### 三个关键点[](https://shopify.baoea.com/liquid/best-practices#%E4%B8%89%E4%B8%AA%E5%85%B3%E9%94%AE%E7%82%B9)

1.  **`width` 与 `height` 属性不能省略**。浏览器需要在图片加载完成前预留正确比例的空间，否则会触发 CLS（累积布局偏移）。
2.  **产品页首图禁用 `loading="lazy"`**。首图是 LCP 候选元素，延迟加载会直接拖累性能评分。
3.  **`srcset` 与 `sizes` 配合使用**。浏览器据此选择合适尺寸的图，可显著降低移动端流量。

```
{% for image in product.images %}
  <img
    src="{{ image | image_url: width: 1200 }}"
    {% unless forloop.first %}loading="lazy"{% endunless %}
    alt="{{ image.alt | default: product.title }}"
  >
{% endfor %}
```

`forloop.first` 仅对首图禁用 lazy load，其余图片正常延迟加载。该写法通常可将产品页 LCP 降低 0.5-1 秒。

## 分页：避免用 `limit` 替代 `paginate`[](https://shopify.baoea.com/liquid/best-practices#%E5%88%86%E9%A1%B5%E9%81%BF%E5%85%8D%E7%94%A8-limit-%E6%9B%BF%E4%BB%A3-paginate)

```
{# 反例：永远只展示前 50 个 #}
{% for product in collection.products limit: 50 %}
  ...
{% endfor %}
```

若 collection 含 200 个产品，上述写法导致用户无法翻页查看后续产品，搜索引擎也只能爬取前 50 个 URL。

**正确写法**：

```
{% paginate collection.products by 24 %}
  {% for product in collection.products %}
    {% render 'product-card', product: product %}
  {% endfor %}
 
  {{ paginate | default_pagination }}
{% endpaginate %}
```

每页 24 或 36（按网格列数对齐）是兼顾移动端加载速度与 SEO 抓取完整度的常见选择。

## `where` 过滤器的边界[](https://shopify.baoea.com/liquid/best-practices#where-%E8%BF%87%E6%BB%A4%E5%99%A8%E7%9A%84%E8%BE%B9%E7%95%8C)

`where` 看起来便利，但在大数据量场景需注意三点：

**性能特征是 O(n)**：含 5000 个产品的 collection 上使用 `where`，模板内会遍历所有 5000 个。在性能敏感的页面（主页、collection 页），**先用 `limit` 或 `paginate` 限定范围再 `where`**。

**比较语义**：`where: 'tags', 'sale'` 是**包含关系**——会匹配所有 `tags` 数组中包含 `'sale'` 的产品，而非仅含 `'sale'` 这一个 tag 的产品。

**数值比较有限制**：`where: 'price', '>', 1000` 在部分字段上不工作。复杂数值筛选建议改用 `if` + 循环手动实现，行为更可控。

## 转义：HTML 与 JavaScript 上下文区分[](https://shopify.baoea.com/liquid/best-practices#%E8%BD%AC%E4%B9%89html-%E4%B8%8E-javascript-%E4%B8%8A%E4%B8%8B%E6%96%87%E5%8C%BA%E5%88%86)

转义错误是主题安全审计中最常见的问题之一。`escape` 与 `json` 不能互换。

### 判断规则[](https://shopify.baoea.com/liquid/best-practices#%E5%88%A4%E6%96%AD%E8%A7%84%E5%88%99)

*   **HTML 内容或 HTML 属性内**：使用 `escape`
*   **JavaScript 字面量赋值**：使用 `json`

### 反例[](https://shopify.baoea.com/liquid/best-practices#%E5%8F%8D%E4%BE%8B-1)

```
{# 错误 1：JS 上下文用 escape，单引号、换行未处理 #}
<script>
  var productTitle = "{{ product.title | escape }}";
</script>
 
{# 错误 2：HTML 属性用 json，引号嵌套出错 #}
<div data-title="{{ product.title | json }}">
```

### 正确写法[](https://shopify.baoea.com/liquid/best-practices#%E6%AD%A3%E7%A1%AE%E5%86%99%E6%B3%95)

```
<script>
  var productTitle = {{ product.title | json }};
  {# 注意 json 会自带引号，外层不需要再加 #}
</script>
 
<div data-title="{{ product.title | escape }}">
```

判断方法：**输出位置周围已经存在引号吗？** 是 HTML 属性（双引号包围）则用 `escape`；是 JS 字面量赋值（值的位置，无外层引号）则用 `json`。

## `{% liquid %}` 标签简化多行赋值[](https://shopify.baoea.com/liquid/best-practices#-liquid--%E6%A0%87%E7%AD%BE%E7%AE%80%E5%8C%96%E5%A4%9A%E8%A1%8C%E8%B5%8B%E5%80%BC)

Shopify 在 2021 年引入的 `{% liquid %}` 标签允许多行 Liquid 语句共享一个标签块，避免逐行 `{% %}`。

```
{% liquid
  assign featured_products = collections['featured'].products
  assign product_count = featured_products.size
  assign is_logged_in = customer != blank
  assign has_orders = false
 
  if customer and customer.orders.size > 0
    assign has_orders = true
  endif
 
  if is_logged_in and has_orders
    assign show_returning_banner = true
  else
    assign show_returning_banner = false
  endif
%}
```

推荐用法：在每个 section 文件顶部用 `{% liquid %}` 块集中完成数据准备，正文部分保留纯展示逻辑。可读性与调试定位均显著优于零散的 `{% assign %}`。

## `{% render %}` 与 `{% include %}` 的关键差异[](https://shopify.baoea.com/liquid/best-practices#-render--%E4%B8%8E--include--%E7%9A%84%E5%85%B3%E9%94%AE%E5%B7%AE%E5%BC%82)

`{% include %}` 已被 Shopify 官方标记为 deprecated，但因兼容性原因未删除，老主题中仍可见。两者行为存在一个关键差异：

| 特性 | include | render |
| --- | --- | --- |
| 访问父模板变量 | 可以直接访问 | 必须显式传参 |
| 作用域 | 共享父作用域 | 完全隔离 |
| 状态 | deprecated | 推荐使用 |

```
{% assign product = collection.products.first %}
 
{% include 'product-card' %}
{# snippet 内部可直接使用 product #}
 
{% render 'product-card' %}
{# snippet 内部 product 为 nil #}
 
{% render 'product-card', product: product %}
{# 正确调用方式 #}
```

新代码统一使用 `render`。作用域隔离减少了变量被父模板意外污染的可能性，调试时能定位掉一类”变量为空但不知道为什么”的问题。

## Snippet 组件化规范[](https://shopify.baoea.com/liquid/best-practices#snippet-%E7%BB%84%E4%BB%B6%E5%8C%96%E8%A7%84%E8%8C%83)

可复用 snippet 应在开头声明参数契约：

```
{% comment %}
  snippets/product-card.liquid
 
  必需参数:
    product - 产品对象
 
  可选参数:
    show_vendor (boolean, 默认 false) - 是否显示品牌
    image_width (number, 默认 400) - 卡片图片宽度
    context (string, 默认 'default') - 'collection' | 'search' | 'featured'
                                       用于埋点和不同布局变体
 
  调用示例:
    {% render 'product-card', product: product, show_vendor: true %}
{% endcomment %}
 
{%- liquid
  assign show_vendor = show_vendor | default: false
  assign image_width = image_width | default: 400
  assign context = context | default: 'default'
-%}
 
<div class="product-card" data-context="{{ context }}">
  ...
</div>
```

Liquid 没有类型系统，这段注释承担接口文档的职责。半年后维护或团队成员交接时，参数定义清晰可避免大量沟通成本。

## 多语言：从第一天开始使用翻译键[](https://shopify.baoea.com/liquid/best-practices#%E5%A4%9A%E8%AF%AD%E8%A8%80%E4%BB%8E%E7%AC%AC%E4%B8%80%E5%A4%A9%E5%BC%80%E5%A7%8B%E4%BD%BF%E7%94%A8%E7%BF%BB%E8%AF%91%E9%94%AE)

主题若未来可能支持多语言，**所有 UI 文案从一开始就使用 `t` filter**，不要硬编码语言。

```
{# 反例 #}
<button>加入购物车</button>
<p>商品已售罄</p>
 
{# 推荐 #}
<button>{{ 'products.product.add_to_cart' | t }}</button>
<p>{{ 'products.product.sold_out' | t }}</p>
```

在 `locales/zh-CN.json` 与 `locales/en.json` 中维护翻译表。事后补国际化的成本约为初期实施的 10 倍——会涉及几十个 Liquid 文件、数百处文案的搜索替换。

带参数的翻译使用命名参数：

```
// locales/zh-CN.json
{ "products": { "facets": { "showing_count": "共 {{ count }} 件商品" } } }
```

```
{{ 'products.facets.showing_count' | t: count: collection.products_count }}
```

参数名需与翻译文件中的占位符严格对应。

## 主题审查优先级[](https://shopify.baoea.com/liquid/best-practices#%E4%B8%BB%E9%A2%98%E5%AE%A1%E6%9F%A5%E4%BC%98%E5%85%88%E7%BA%A7)

接手或审查第三方主题时，按以下优先级处理问题：

### 优先级 P0（必须修复）[](https://shopify.baoea.com/liquid/best-practices#%E4%BC%98%E5%85%88%E7%BA%A7-p0%E5%BF%85%E9%A1%BB%E4%BF%AE%E5%A4%8D)

*   循环外缺少 `assign` 缓存集合对象 → 性能影响最大
*   `image_url` 未传 width，或 width 比展示尺寸大 2 倍以上 → 流量与 LCP 双重浪费
*   产品页首图被加 `loading="lazy"` → LCP 评分直接下降
*   `<img>` 缺少 width / height 属性 → CLS 飙升
*   主页或高频 section 使用 `collections.all.products` → 产品数增长后即时炸弹

### 优先级 P1（建议修复）[](https://shopify.baoea.com/liquid/best-practices#%E4%BC%98%E5%85%88%E7%BA%A7-p1%E5%BB%BA%E8%AE%AE%E4%BF%AE%E5%A4%8D)

*   `include` 改为 `render`（除非短期内大量改造风险高）
*   转义错误（`escape` vs `json` 用错）
*   缺少 `{% liquid %}` 块的密集 `assign` 区域

### 优先级 P2（按需处理）[](https://shopify.baoea.com/liquid/best-practices#%E4%BC%98%E5%85%88%E7%BA%A7-p2%E6%8C%89%E9%9C%80%E5%A4%84%E7%90%86)

*   命名风格不一致（仅在维护频繁时优先）
*   过度嵌套但无性能影响的条件判断
*   未使用 `t` filter 的硬编码语言（仅做单语言站可不处理）
*   调试输出残留（确认无敏感信息泄露后可保留）

主题代码的目标不是”完美”，而是**确保影响真实用户体验的部分稳定可靠**。性能与功能层面的问题优先，风格层面的问题按维护节奏推进。

## 延伸阅读[](https://shopify.baoea.com/liquid/best-practices#%E5%BB%B6%E4%BC%B8%E9%98%85%E8%AF%BB)

*   [性能优化](https://shopify.baoea.com/liquid/performance-optimization)
*   [调试和故障排除](https://shopify.baoea.com/liquid/troubleshooting)
*   [主题开发实战](https://shopify.baoea.com/liquid/theme-development-practices)
