---
source_url: "https://shopify.baoea.com/liquid/shopify-objects"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:43:00"
fetch_method: "http"
content_hash: "bbfccc1ba39d34ae073cc6d35aceb8f92d38aa86b4c3df0e6f1cd68a61fed053"
discovered_via: ["sitemap", "internal_link"]
---
Liquid 里所谓「对象」，就是 Shopify 在渲染某一页时已经帮你准备好的 **数据入口**（商店、购物车、当前产品、集合等）。写主题时真正省时间的，不是背每个字段名，而是搞清楚：**当前模板里哪些对象一定有、哪些是 nil、和 `routes` / `request` 怎么配合**。

官方完整字段以 [Liquid 对象索引](https://shopify.dev/docs/api/liquid/objects)  为准；本文做 **地图 + 速查 + 常见写法**，细节深挖见站内各篇。

* * *

## 1\. 建议怎么读这篇[](https://shopify.baoea.com/liquid/shopify-objects#1-%E5%BB%BA%E8%AE%AE%E6%80%8E%E4%B9%88%E8%AF%BB%E8%BF%99%E7%AF%87)

1.  先看下面 **「按页面类型，对象是否可用」**，避免在 `footer.liquid` 里写 `product.title` 却纳闷为什么是空的。
2.  需要某个对象的字段时，用文中 **速查表** 定位常用属性，再点进 [全局对象](https://shopify.baoea.com/liquid/global-objects)、[产品对象](https://shopify.baoea.com/liquid/product-objects) 等专题。
3.  链接与跳转一律优先用 **`routes.*`**，少写死 `/cart`、`/account/login`，多市场、子路径、自定义域名时更稳。

* * *

## 2\. 按页面类型：对象可用性（简表）[](https://shopify.baoea.com/liquid/shopify-objects#2-%E6%8C%89%E9%A1%B5%E9%9D%A2%E7%B1%BB%E5%9E%8B%E5%AF%B9%E8%B1%A1%E5%8F%AF%E7%94%A8%E6%80%A7%E7%AE%80%E8%A1%A8)

| 对象 / 情境 | 全局（layout、多数 section） | 仅部分模板有「当前」实例 |
| --- | --- | --- |
| shop | 有 | — |
| routes | 有 | — |
| request | 有 | — |
| settings（主题设置） | 有 | — |
| section / block | 在对应 section 内 | — |
| cart | 有（空购物车也是对象） | 结账页 Liquid 能力受限，勿假设与店面一致 |
| customer | 登录后有 | 未登录为 nil，用 {% if customer %} |
| product | 仅产品页（及显式 all_products 等上下文） | 集合循环里是 for 里的局部变量 |
| collection | 集合页、部分 section 赋值后 | — |
| blog / article | 博客列表 / 文章页 | 文章页用 article，列表用 blog.articles |
| page | 仅自定义页面模板 | — |
| search | 搜索模板执行搜索后 | search.performed 区分是否已搜 |
| template | 有 | 分支判断更推荐 request.page_type（见下文） |
| paginate | 仅在 {% paginate %}…{% endpaginate %} 内 | — |

**记忆口诀**：跟「当前 URL 代表的是谁」绑定的对象（`product`、`collection`、`article`…），出了对应模板就不要指望还在「当前」上下文里；全局展示用 `section.settings` 选资源，或 `all_products[handle]` 显式取。

* * *

## 3\. `routes`：链接不要写死路径[](https://shopify.baoea.com/liquid/shopify-objects#3-routes%E9%93%BE%E6%8E%A5%E4%B8%8D%E8%A6%81%E5%86%99%E6%AD%BB%E8%B7%AF%E5%BE%84)

storefront 与账户、搜索、购物车等 URL 会随商店配置变化，应使用 `routes`（见 [routes 对象](https://shopify.dev/docs/api/liquid/objects/routes) ）。

| 常见用途 | Liquid 示例 |
| --- | --- |
| 购物车 | {{ routes.cart_url }} |
| 搜索提交 | {{ routes.search_url }}（form 的 action） |
| 登录 / 注册 | {{ routes.account_login_url }} / {{ routes.account_register_url }} |
| 首页 | {{ routes.root_url }} |
| 全店商品集合 | {{ routes.all_products_collection_url }} |

示例（搜索表单）：

```
<form action="{{ routes.search_url }}" method="get" role="search">
  <label class="visually-hidden" for="q">搜索</label>
  <input id="q" type="search" name="q" value="{{ search.terms | escape }}" placeholder="搜索…">
  <button type="submit">搜索</button>
</form>
```

* * *

## 4\. `shop` 对象（商店）[](https://shopify.baoea.com/liquid/shopify-objects#4-shop-%E5%AF%B9%E8%B1%A1%E5%95%86%E5%BA%97)

包含店名、域名、货币、政策链接、地址等。站内扩展阅读：[全局对象详解](https://shopify.baoea.com/liquid/global-objects)。

### 常用属性速查[](https://shopify.baoea.com/liquid/shopify-objects#%E5%B8%B8%E7%94%A8%E5%B1%9E%E6%80%A7%E9%80%9F%E6%9F%A5)

| 属性 | 含义 |
| --- | --- |
| shop.name / shop.domain / shop.url | 名称、主域、店铺 URL |
| shop.currency | 店铺货币代码 |
| shop.email | 店铺联系邮箱（展示用） |
| shop.address | 地址对象（多级字段） |
| shop.privacy_policy 等 | 政策页面对象，用 .url 链出 |
| shop.secure_url | HTTPS 根 URL，拼 canonical 时常用 |

```
<h1>{{ shop.name }}</h1>
{% if shop.description != blank %}
  <p>{{ shop.description }}</p>
{% endif %}
 
<address>
  {{ shop.address.address1 }}<br />
  {% if shop.address.address2 != blank %}{{ shop.address.address2 }}<br />{% endif %}
  {{ shop.address.city }}, {{ shop.address.province_code }} {{ shop.address.zip }}<br />
  {{ shop.address.country }}
</address>
 
<p><a href="mailto:{{ shop.email }}">{{ shop.email }}</a></p>
 
{% if shop.privacy_policy %}
  <a href="{{ shop.privacy_policy.url }}">隐私政策</a>
{% endif %}
```

* * *

## 5\. `cart` 对象（购物车）[](https://shopify.baoea.com/liquid/shopify-objects#5-cart-%E5%AF%B9%E8%B1%A1%E8%B4%AD%E7%89%A9%E8%BD%A6)

`cart` 在店面主题里几乎始终存在；`cart.item_count == 0` 表示空车。行项目用 `cart.items`。详解：[购物车对象](https://shopify.baoea.com/liquid/cart-objects)。

| 属性 | 含义 |
| --- | --- |
| cart.items | 行项目数组 |
| cart.item_count | 件数（数量之和） |
| cart.total_price | 总价（配合 | money） |
| cart.currency | 购物车货币 |
| cart.taxes_included | 是否含税价展示 |

```
<p>小计 {{ cart.total_price | money }}{% if cart.currency != shop.currency %}（{{ cart.currency }}）{% endif %}</p>
 
{% for item in cart.items %}
  <div class="cart-line" data-line-key="{{ item.key }}">
    {% if item.image %}
      {{ item.image | image_url: width: 120 | image_tag: alt: item.image.alt | default: item.title, loading: 'lazy' }}
    {% endif %}
    <div>
      <a href="{{ item.url }}">{{ item.product.title }}</a>
      {% unless item.product.has_only_default_variant %}
        <p>{{ item.variant.title }}</p>
      {% endunless %}
      <p>{{ item.final_line_price | money }} × {{ item.quantity }}</p>
    </div>
  </div>
{% endfor %}
 
{% if cart.item_count == 0 %}
  <p>购物车是空的。</p>
  <a href="{{ routes.all_products_collection_url }}">去逛逛</a>
{% endif %}
```

* * *

## 6\. `customer` 对象（当前客户）[](https://shopify.baoea.com/liquid/shopify-objects#6-customer-%E5%AF%B9%E8%B1%A1%E5%BD%93%E5%89%8D%E5%AE%A2%E6%88%B7)

仅登录后存在；未登录务必 `{% if customer %}`。详解：[客户对象](https://shopify.baoea.com/liquid/customer-objects)。

```
{% if customer %}
  <p>欢迎，{{ customer.first_name | default: '顾客' }}</p>
  <p>{{ customer.email }}</p>
  {% if customer.default_address %}
    <p>{{ customer.default_address.city }}</p>
  {% endif %}
  <a href="{{ routes.account_url }}">账户</a>
{% else %}
  <a href="{{ routes.account_login_url }}">登录</a>
  <a href="{{ routes.account_register_url }}">注册</a>
{% endif %}
```

* * *

## 7\. `request` 对象（当前请求）[](https://shopify.baoea.com/liquid/shopify-objects#7-request-%E5%AF%B9%E8%B1%A1%E5%BD%93%E5%89%8D%E8%AF%B7%E6%B1%82)

做 **hreflang**、canonical、调试、按语言切换 class 时都会用到。

| 属性 | 含义 |
| --- | --- |
| request.page_type | 页面类型字符串，如 product、collection、index |
| request.path | 路径部分 |
| request.origin | 源站 origin，拼绝对 URL |
| request.locale | 当前区域 / 语言相关 |
| request.design_mode | 主题编辑器预览中为 true |

**按页面类型分支**：优先用 `request.page_type`，不要依赖把 `template` 当字符串的 `{% case template %}`（`template` 在新主题里多为 **对象**，应用 `template.name` 或直接用 `request.page_type`）。

```
{% case request.page_type %}
  {% when 'index' %}
    {% comment %} 首页 {% endcomment %}
  {% when 'product' %}
    {% comment %} 产品页 {% endcomment %}
  {% when 'collection' %}
    {% comment %} 集合页 {% endcomment %}
  {% when 'cart' %}
    {% comment %} 购物车 {% endcomment %}
  {% else %}
    {% comment %} 其他类型 {% endcomment %}
{% endcase %}
```

调试（仅开发环境或 `settings` 开关）：

```
{% if request.design_mode %}
  <p class="theme-debug">page_type={{ request.page_type }}</p>
{% endif %}
```

* * *

## 8\. `product` 对象（当前产品）[](https://shopify.baoea.com/liquid/shopify-objects#8-product-%E5%AF%B9%E8%B1%A1%E5%BD%93%E5%89%8D%E4%BA%A7%E5%93%81)

仅在 **产品模板**（或你显式传入的 `product`）上下文。价格、变体、图、SEO 等见 [产品对象详解](https://shopify.baoea.com/liquid/product-objects)。

```
<h1>{{ product.title }}</h1>
<p>{{ product.vendor }}</p>
 
<div class="price">
  {% if product.compare_at_price > product.price %}
    <span class="compare">{{ product.compare_at_price | money }}</span>
    <span class="sale">{{ product.price | money }}</span>
  {% else %}
    <span>{{ product.price | money }}</span>
  {% endif %}
</div>
 
{% if product.description != blank %}
  <div class="rte">{{ product.description }}</div>
{% endif %}
 
{% if product.featured_image %}
  {{ product.featured_image | image_url: width: 800 | image_tag: alt: product.featured_image.alt | default: product.title, loading: 'eager', fetchpriority: 'high' }}
{% endif %}
```

* * *

## 9\. `collection` 对象（集合）[](https://shopify.baoea.com/liquid/shopify-objects#9-collection-%E5%AF%B9%E8%B1%A1%E9%9B%86%E5%90%88)

集合页有「当前」`collection`；`collection.products` 在 **未分页** 时注意性能，列表页应用 `{% paginate %}` 或限制 `limit:`。

```
<h1>{{ collection.title }}</h1>
{% if collection.description != blank %}
  <div class="rte">{{ collection.description }}</div>
{% endif %}
 
{% paginate collection.products by 24 %}
  {% for product in collection.products %}
    {% render 'product-card', product: product %}
  {% endfor %}
  {% if paginate.pages > 1 %}
    <a href="{{ paginate.next.url }}" rel="next">下一页</a>
  {% endif %}
{% endpaginate %}
```

空集合：

```
{% if collection.products_count == 0 %}
  <p>该集合暂无商品。</p>
{% endif %}
```

* * *

## 10\. `blog` 与 `article`[](https://shopify.baoea.com/liquid/shopify-objects#10-blog-%E4%B8%8E-article)

*   **博客列表页**：`blog` 有 `title`、`articles` 等。
*   **文章详情页**：当前文章多为顶层 `article`（与模板有关，以你主题 `article.json` / `article.liquid` 为准）。

```
<h1>{{ blog.title }}</h1>
{% for article in blog.articles limit: 10 %}
  <article>
    <h2><a href="{{ article.url }}">{{ article.title }}</a></h2>
    <time datetime="{{ article.published_at | date: '%Y-%m-%d' }}">{{ article.published_at | date: '%Y-%m-%d' }}</time>
    {% if article.excerpt != blank %}
      <p>{{ article.excerpt | strip_html | truncate: 160 }}</p>
    {% endif %}
  </article>
{% endfor %}
```

* * *

## 11\. `page` 对象（自定义页面）[](https://shopify.baoea.com/liquid/shopify-objects#11-page-%E5%AF%B9%E8%B1%A1%E8%87%AA%E5%AE%9A%E4%B9%89%E9%A1%B5%E9%9D%A2)

用于 `page` 模板。字段以 [page 对象](https://shopify.dev/docs/api/liquid/objects/page)  为准；`author` 等是否出现取决于后台是否填写或使用 metafield。

```
<h1>{{ page.title }}</h1>
<div class="rte">{{ page.content }}</div>
```

* * *

## 12\. `template` 对象[](https://shopify.baoea.com/liquid/shopify-objects#12-template-%E5%AF%B9%E8%B1%A1)

提供当前渲染的模板名、后缀等。做条件时推荐 **`request.page_type`** 或 **`template.name`**，与旧版「`template` 当作字符串」的写法区分开。

```
{% if template.name == 'product' %}
  {% comment %} 产品 JSON 模板等 {% endcomment %}
{% endif %}
```

* * *

## 13\. `paginate` 对象[](https://shopify.baoea.com/liquid/shopify-objects#13-paginate-%E5%AF%B9%E8%B1%A1)

只在 `{% paginate collection.products by n %}…{% endpaginate %}`（或 blog、search 等可分页集合）内部可用，提供 `paginate.previous`、`paginate.next`、`paginate.parts`、`paginate.current_page` 等。

```
{% paginate collection.products by 12 %}
  {% for product in collection.products %}…{% endfor %}
  {% if paginate.pages > 1 %}
    <nav aria-label="分页">
      {% if paginate.previous %}<a href="{{ paginate.previous.url }}" rel="prev">上一页</a>{% endif %}
      {% for part in paginate.parts %}
        {% if part.is_link %}<a href="{{ part.url }}">{{ part.title }}</a>{% else %}<span>{{ part.title }}</span>{% endif %}
      {% endfor %}
      {% if paginate.next %}<a href="{{ paginate.next.url }}" rel="next">下一页</a>{% endif %}
    </nav>
  {% endif %}
{% endpaginate %}
```

* * *

## 14\. `search` 对象[](https://shopify.baoea.com/liquid/shopify-objects#14-search-%E5%AF%B9%E8%B1%A1)

`search.performed` 为真表示用户已提交搜索；结果在 `search.results`，类型可用 `item.object_type` 分支（以官方文档枚举为准）。

```
{% if search.performed %}
  <h1>「{{ search.terms | escape }}」的搜索结果</h1>
  <p>共 {{ search.results_count }} 条</p>
  {% for item in search.results %}
    {% case item.object_type %}
      {% when 'product' %}
        <a href="{{ item.url }}">{{ item.title }}</a>
      {% when 'article' %}
        <a href="{{ item.url }}">{{ item.title }}</a>
      {% when 'page' %}
        <a href="{{ item.url }}">{{ item.title }}</a>
    {% endcase %}
  {% endfor %}
{% endif %}
```

* * *

## 15\. `section` 与 `settings`（分区与主题配置）[](https://shopify.baoea.com/liquid/shopify-objects#15-section-%E4%B8%8E-settings%E5%88%86%E5%8C%BA%E4%B8%8E%E4%B8%BB%E9%A2%98%E9%85%8D%E7%BD%AE)

*   **`section`**：在 `sections/*.liquid` 内，`section.id`、`section.settings`、`section.blocks` 最常用。实践见 [自定义分区开发](https://shopify.baoea.com/liquid/custom-sections)。
*   **`settings`**：`config/settings_schema.json` 定义的全局主题设置，全站片段、layout 里都能读。

* * *

## 16\. 使用注意（合并成几条硬规则）[](https://shopify.baoea.com/liquid/shopify-objects#16-%E4%BD%BF%E7%94%A8%E6%B3%A8%E6%84%8F%E5%90%88%E5%B9%B6%E6%88%90%E5%87%A0%E6%9D%A1%E7%A1%AC%E8%A7%84%E5%88%99)

1.  **先判断再输出**：`{% if product %}`、`{% if collection.products_count > 0 %}`，避免 nil 上点属性。
2.  **价格与货币**：展示用 `\| money`；JSON-LD 或结构化数据里常用 `money_without_currency` 等，注意与币种字段一致。
3.  **性能**：大集合不要无分页一次扫光；同一字段在循环里多次访问可先 `{% assign img = product.featured_image %}`。
4.  **HTML 安全**：用户输入、标题等输出到属性或 JSON 时用 `\| escape`；`description` 类富文本用 `strip_html` 再进 meta。
5.  **结构化数据**：示例 JSON-LD 仅作参考，变体、多币种、预售等场景建议用主题或 App 统一维护，避免与后台真实库存不同步。

```
{% if product.featured_image %}
  {% assign img = product.featured_image %}
  {{ img | image_url: width: 600 | image_tag: alt: img.alt | default: product.title | escape, loading: 'lazy' }}
{% endif %}
```

* * *

## 17\. 延伸阅读[](https://shopify.baoea.com/liquid/shopify-objects#17-%E5%BB%B6%E4%BC%B8%E9%98%85%E8%AF%BB)

*   [全局对象详解](https://shopify.baoea.com/liquid/global-objects)
*   [产品对象详解](https://shopify.baoea.com/liquid/product-objects)
*   [客户对象详解](https://shopify.baoea.com/liquid/customer-objects)
*   [购物车对象](https://shopify.baoea.com/liquid/cart-objects)
*   [Liquid 过滤器](https://shopify.baoea.com/liquid/filters)
*   [自定义分区开发](https://shopify.baoea.com/liquid/custom-sections)
*   [高级 Liquid 技巧](https://shopify.baoea.com/liquid/advanced-liquid)
*   官方：[Liquid 对象](https://shopify.dev/docs/api/liquid/objects) 

字段名、新增对象以 **shopify.dev 当前页** 为准；主题升级后若某属性废弃，以 Theme Check 与发布说明为准。
