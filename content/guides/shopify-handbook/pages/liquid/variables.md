---
source_url: "https://shopify.baoea.com/liquid/variables"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:43:18"
fetch_method: "http"
content_hash: "bb001965ffa581920545c225ea482b236e0a36d926635e09ef8f75a46a5b122e"
discovered_via: ["sitemap", "internal_link"]
---
## Liquid 变量与对象访问

Shopify 主题里的「变量」是你用 `{% assign %}`、`{% capture %}` 或循环里自带的 **名字 → 值**；「对象」是平台注入的 `product`、`cart`、`shop` 等（见 [Shopify 对象参考](https://shopify.baoea.com/liquid/shopify-objects)）。本篇只解决三件事：**怎么存值、在哪能用、怎么安全读属性**。

官方标签说明：[assign](https://shopify.dev/docs/api/liquid/tags/assign) 、[capture](https://shopify.dev/docs/api/liquid/tags/capture) 、[increment / decrement](https://shopify.dev/docs/api/liquid/tags/increment) 。

* * *

## 1\. `{% assign %}`：赋值与类型[](https://shopify.baoea.com/liquid/variables#1--assign-%E8%B5%8B%E5%80%BC%E4%B8%8E%E7%B1%BB%E5%9E%8B)

Liquid 里变量**没有声明类型**，值可以是字符串、数字、布尔或对象引用。

```
{% assign title = product.title %}
{% assign discount = product.price | times: 0.9 %}
{% assign show_vendor = true %}
{% assign css = "product-card product-card--compact" %}
 
<h2 class="{{ css }}">{{ title }}</h2>
<p>{{ discount | money }}</p>
```

**金额**：`product.price` 等为 **整数最小货币单位**（多数币种为「分」），计算后再交给 `\| money` 格式化，避免按「元」心算又忘了乘除。

* * *

## 2\. 作用域：不要套用「块级局部变量」[](https://shopify.baoea.com/liquid/variables#2-%E4%BD%9C%E7%94%A8%E5%9F%9F%E4%B8%8D%E8%A6%81%E5%A5%97%E7%94%A8%E5%9D%97%E7%BA%A7%E5%B1%80%E9%83%A8%E5%8F%98%E9%87%8F)

与 JavaScript 不同，Liquid 里 **`{% assign %}` 没有块级作用域**：在同一份模板（或同一 snippet 渲染进程）里，在 `for` / `if` 里赋的值，**在外面仍能读到**，后者会覆盖前者。

```
{% assign x = "before" %}
{% for i in (1..2) %}
  {% assign x = "in loop" %}
{% endfor %}
{{ x }}
```

上面最终会输出最后一次写入的 `x`。若需要在循环里「累计」，用循环变量或单独起名（如 `total_quantity`），不要假设「出了循环变量就销毁」。

```
{% assign total = 0 %}
{% for line in cart.items %}
  {% assign total = total | plus: line.quantity %}
{% endfor %}
```

需要 **独立计数器**（不影响同名 assign）时，可用 `{% increment var %}` / `{% decrement var %}`（适用场景见官方文档）。

* * *

## 3\. `{% capture %}`：拼一整段 HTML 或字符串[](https://shopify.baoea.com/liquid/variables#3--capture-%E6%8B%BC%E4%B8%80%E6%95%B4%E6%AE%B5-html-%E6%88%96%E5%AD%97%E7%AC%A6%E4%B8%B2)

`capture` 会把标签之间的 **渲染结果**（含换行）存进变量，适合组装一大块 markup，再一次性输出。

```
{% capture greeting %}
  {% if customer %}
    你好，{{ customer.first_name | escape }}。
  {% else %}
    你好，访客。
  {% endif %}
{% endcapture %}
 
<p>{{ greeting }}</p>
```

注意：`capture` 里是 **先执行 Liquid 再存字符串**，中间若有未定义变量会得到空字符串；对外输出用户内容时仍要对动态片段做 `escape` 或交给过滤器。

* * *

## 4\. 真假值与 `blank`[](https://shopify.baoea.com/liquid/variables#4-%E7%9C%9F%E5%81%87%E5%80%BC%E4%B8%8E-blank)

常用写法：

| 意图 | 推荐 |
| --- | --- |
| 是否有当前客户 | {% if customer %} |
| 字符串 / 数组是否有「实质内容」 | {% if thing != blank %} |
| 可选字段默认值 | | default: '后备' |

不要用其它语言里的 `!= null`：Liquid 里用 **`blank`**（Shopify 扩展）判断空字符串、空数组、nil 等更省事。

```
{% if product.description != blank %}
  <div class="rte">{{ product.description }}</div>
{% endif %}
 
{{ product.metafields.custom.subtitle | default: product.title }}
```

* * *

## 5\. 访问对象属性：点号与 `[]`[](https://shopify.baoea.com/liquid/variables#5-%E8%AE%BF%E9%97%AE%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7%E7%82%B9%E5%8F%B7%E4%B8%8E-)

```
{{ product.title }}
{{ product['title'] }}
 
{% assign key = 'vendor' %}
{{ product[key] }}
```

嵌套时逐级判断，避免中间层为 nil 时连环报错：

```
{% if customer.default_address %}
  {{ customer.default_address.city }}
{% endif %}
```

数组：支持 `.first` / `.last`、按索引 `images[0]`，以及 `{% for %}`. 详见 [数据类型](https://shopify.baoea.com/liquid/data-types)。

* * *

## 6\. 与过滤器配合（不要把业务写太胖）[](https://shopify.baoea.com/liquid/variables#6-%E4%B8%8E%E8%BF%87%E6%BB%A4%E5%99%A8%E9%85%8D%E5%90%88%E4%B8%8D%E8%A6%81%E6%8A%8A%E4%B8%9A%E5%8A%A1%E5%86%99%E5%A4%AA%E8%83%96)

assign 常与过滤器连用；复杂逻辑建议拆给 **snippet** 或多步 assign，便于读和维护。

```
{% assign slug = product.title | handleize %}
{% assign excerpt = product.description | strip_html | truncate: 160 %}
```

**易错**：`where` 用于 **数组里筛对象属性**，语法为 `array | where: '属性名', 值`，不能当成 SQL 随意写比较运算符；不确定时查 [过滤器](https://shopify.baoea.com/liquid/filters) 与官方示例。

* * *

## 7\. 条件里「间接赋值」[](https://shopify.baoea.com/liquid/variables#7-%E6%9D%A1%E4%BB%B6%E9%87%8C%E9%97%B4%E6%8E%A5%E8%B5%8B%E5%80%BC)

Liquid 没有三元运算符，用 `if / else` 或 `assign` + `if` 组合：

```
{% if product.available %}
  {% assign badge_class = 'in-stock' %}
{% else %}
  {% assign badge_class = 'sold-out' %}
{% endif %}
 
<span class="{{ badge_class }}">
  {% if product.available %}现货{% else %}售罄{% endif %}
</span>
```

* * *

## 8\. 命名习惯（保持可读即可）[](https://shopify.baoea.com/liquid/variables#8-%E5%91%BD%E5%90%8D%E4%B9%A0%E6%83%AF%E4%BF%9D%E6%8C%81%E5%8F%AF%E8%AF%BB%E5%8D%B3%E5%8F%AF)

*   用 **`snake_case`**：`featured_count`、`show_sale_badge`。
*   避免单字母、`tmp1`，半年后只有自己认识。
*   布尔含义用前缀：`is_`、`has_`、`show_`。

* * *

## 9\. 调试（仅开发 / 预览）[](https://shopify.baoea.com/liquid/variables#9-%E8%B0%83%E8%AF%95%E4%BB%85%E5%BC%80%E5%8F%91--%E9%A2%84%E8%A7%88)

```
{% if request.design_mode %}
  <pre class="theme-debug">{{ product | json }}</pre>
{% endif %}
```

勿在生产页面长期输出完整 `json`，体积与敏感字段都不友好。

* * *

## 10\. 常见误区（对照检查）[](https://shopify.baoea.com/liquid/variables#10-%E5%B8%B8%E8%A7%81%E8%AF%AF%E5%8C%BA%E5%AF%B9%E7%85%A7%E6%A3%80%E6%9F%A5)

1.  **以为 for 里的 assign 外面看不见** — 实际上会泄漏到外层，注意变量名冲突。
2.  **`customer != null`** — 改用 `{% if customer %}` 或 `!= blank`。
3.  **在 Liquid 里硬算含税总价** — 结账税费以结算为准，模板里演示类计算务必标注「展示用」。
4.  **一大段 HTML 用字符串 append** — 优先 `capture` 或拆 snippet，否则引号与转义极易出错。

* * *

## 11\. 延伸阅读[](https://shopify.baoea.com/liquid/variables#11-%E5%BB%B6%E4%BC%B8%E9%98%85%E8%AF%BB)

*   [数据类型](https://shopify.baoea.com/liquid/data-types) — 字符串、数组、nil
*   [Liquid 过滤器](https://shopify.baoea.com/liquid/filters) — `default`、`money`、`where` 等
*   [Liquid 标签与控制结构](https://shopify.baoea.com/liquid/tags) — `if`、`for`、`case`
*   [Shopify 对象参考](https://shopify.baoea.com/liquid/shopify-objects) — `product`、`cart` 等从哪来

更细的语法以 [Shopify Liquid 参考](https://shopify.dev/docs/api/liquid)  为准。
