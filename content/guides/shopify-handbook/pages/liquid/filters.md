---
source_url: "https://shopify.baoea.com/liquid/filters"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:47"
fetch_method: "http"
content_hash: "6c0476f4ec4c8639d9423d0e564898fcafceddb5f3713e107962dec5b98be0b5"
discovered_via: ["sitemap", "internal_link"]
---
## 5--- title: “过滤器完全指南” description: “全面掌握Shopify Liquid过滤器，包含所有过滤器的详细说明和实际代码示例”[](https://shopify.baoea.com/liquid/filters#5---title-%E8%BF%87%E6%BB%A4%E5%99%A8%E5%AE%8C%E5%85%A8%E6%8C%87%E5%8D%97description-%E5%85%A8%E9%9D%A2%E6%8E%8C%E6%8F%A1shopify-liquid%E8%BF%87%E6%BB%A4%E5%99%A8%E5%8C%85%E5%90%AB%E6%89%80%E6%9C%89%E8%BF%87%E6%BB%A4%E5%99%A8%E7%9A%84%E8%AF%A6%E7%BB%86%E8%AF%B4%E6%98%8E%E5%92%8C%E5%AE%9E%E9%99%85%E4%BB%A3%E7%A0%81%E7%A4%BA%E4%BE%8B)

## 过滤器完全指南

过滤器是 Liquid 模板语言的核心功能之一，用于修改对象的输出。本指南将详细介绍所有可用的 Shopify Liquid 过滤器，并提供实际的代码示例。

## 过滤器基础[](https://shopify.baoea.com/liquid/filters#%E8%BF%87%E6%BB%A4%E5%99%A8%E5%9F%BA%E7%A1%80)

### 基本语法[](https://shopify.baoea.com/liquid/filters#%E5%9F%BA%E6%9C%AC%E8%AF%AD%E6%B3%95)

```
{{ object | filter_name }}
{{ object | filter_name: parameter }}
{{ object | filter_name: parameter1, parameter2 }}
```

### 链式过滤器[](https://shopify.baoea.com/liquid/filters#%E9%93%BE%E5%BC%8F%E8%BF%87%E6%BB%A4%E5%99%A8)

```
{{ product.title | downcase | replace: ' ', '-' | append: '.html' }}
```

## 字符串过滤器[](https://shopify.baoea.com/liquid/filters#%E5%AD%97%E7%AC%A6%E4%B8%B2%E8%BF%87%E6%BB%A4%E5%99%A8)

### 文本转换[](https://shopify.baoea.com/liquid/filters#%E6%96%87%E6%9C%AC%E8%BD%AC%E6%8D%A2)

#### `upcase` - 转换为大写[](https://shopify.baoea.com/liquid/filters#upcase---%E8%BD%AC%E6%8D%A2%E4%B8%BA%E5%A4%A7%E5%86%99)

```
{{ 'hello world' | upcase }}
<!-- 输出: HELLO WORLD -->
 
{{ product.title | upcase }}
<!-- 输出产品标题的大写形式 -->
```

#### `downcase` - 转换为小写[](https://shopify.baoea.com/liquid/filters#downcase---%E8%BD%AC%E6%8D%A2%E4%B8%BA%E5%B0%8F%E5%86%99)

```
{{ 'HELLO WORLD' | downcase }}
<!-- 输出: hello world -->
 
{{ customer.email | downcase }}
<!-- 确保邮箱地址为小写 -->
```

#### `capitalize` - 首字母大写[](https://shopify.baoea.com/liquid/filters#capitalize---%E9%A6%96%E5%AD%97%E6%AF%8D%E5%A4%A7%E5%86%99)

```
{{ 'hello world' | capitalize }}
<!-- 输出: Hello world -->
 
{{ customer.first_name | capitalize }}
<!-- 客户名字首字母大写 -->
```

#### `strip` - 移除首尾空格[](https://shopify.baoea.com/liquid/filters#strip---%E7%A7%BB%E9%99%A4%E9%A6%96%E5%B0%BE%E7%A9%BA%E6%A0%BC)

```
{{ '  hello world  ' | strip }}
<!-- 输出: hello world -->
```

### 文本处理[](https://shopify.baoea.com/liquid/filters#%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86)

#### `truncate` - 截断文本[](https://shopify.baoea.com/liquid/filters#truncate---%E6%88%AA%E6%96%AD%E6%96%87%E6%9C%AC)

```
{{ product.description | truncate: 100 }}
<!-- 截断到100个字符 -->
 
{{ product.description | truncate: 100, '...' }}
<!-- 自定义截断标记 -->
 
{{ article.content | strip_html | truncate: 150 }}
<!-- 先移除HTML再截断 -->
```

#### `strip_html` - 移除HTML标签[](https://shopify.baoea.com/liquid/filters#strip_html---%E7%A7%BB%E9%99%A4html%E6%A0%87%E7%AD%BE)

```
{{ product.description | strip_html }}
<!-- 移除所有HTML标签 -->
 
{{ article.content | strip_html | truncate: 200 }}
<!-- 移除HTML标签后截断 -->
```

#### `strip_newlines` - 移除换行符[](https://shopify.baoea.com/liquid/filters#strip_newlines---%E7%A7%BB%E9%99%A4%E6%8D%A2%E8%A1%8C%E7%AC%A6)

```
{{ product.description | strip_newlines }}
<!-- 移除所有换行符 -->
```

#### `newline_to_br` - 换行符转换为`<br />`[](https://shopify.baoea.com/liquid/filters#newline_to_br---%E6%8D%A2%E8%A1%8C%E7%AC%A6%E8%BD%AC%E6%8D%A2%E4%B8%BAbr-)

```
{{ product.description | newline_to_br }}
<!-- 将\n转换为<br>标签 -->
```

### 字符串操作[](https://shopify.baoea.com/liquid/filters#%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%93%8D%E4%BD%9C)

#### `replace` - 替换文本[](https://shopify.baoea.com/liquid/filters#replace---%E6%9B%BF%E6%8D%A2%E6%96%87%E6%9C%AC)

```
{{ product.title | replace: 'iPhone', 'Apple iPhone' }}
<!-- 替换指定文本 -->
 
{{ product.handle | replace: '-', ' ' | capitalize }}
<!-- 将连字符替换为空格并首字母大写 -->
```

#### `remove` - 移除文本[](https://shopify.baoea.com/liquid/filters#remove---%E7%A7%BB%E9%99%A4%E6%96%87%E6%9C%AC)

```
{{ product.title | remove: 'Brand:' }}
<!-- 移除指定文本 -->
 
{{ product.tags | join: ', ' | remove: 'hidden' }}
<!-- 从标签列表中移除特定标签 -->
```

#### `append` - 添加到末尾[](https://shopify.baoea.com/liquid/filters#append---%E6%B7%BB%E5%8A%A0%E5%88%B0%E6%9C%AB%E5%B0%BE)

```
{{ product.title | append: ' - 限时特价' }}
<!-- 在标题末尾添加文本 -->
 
{{ product.url | append: '?utm_source=newsletter' }}
<!-- 在URL后添加参数 -->
```

#### `prepend` - 添加到开头[](https://shopify.baoea.com/liquid/filters#prepend---%E6%B7%BB%E5%8A%A0%E5%88%B0%E5%BC%80%E5%A4%B4)

```
{{ product.title | prepend: '热销商品: ' }}
<!-- 在标题开头添加文本 -->
```

#### `split` - 分割字符串[](https://shopify.baoea.com/liquid/filters#split---%E5%88%86%E5%89%B2%E5%AD%97%E7%AC%A6%E4%B8%B2)

```
{{ product.tags | split: ',' }}
<!-- 将标签字符串分割为数组 -->
```

### URL和编码[](https://shopify.baoea.com/liquid/filters#url%E5%92%8C%E7%BC%96%E7%A0%81)

#### `url_encode` - URL编码[](https://shopify.baoea.com/liquid/filters#url_encode---url%E7%BC%96%E7%A0%81)

```
{{ product.title | url_encode }}
<!-- URL编码产品标题 -->
 
{{ search.terms | url_encode }}
<!-- 编码搜索词 -->
```

#### `url_decode` - URL解码[](https://shopify.baoea.com/liquid/filters#url_decode---url%E8%A7%A3%E7%A0%81)

```
{{ encoded_text | url_decode }}
<!-- URL解码 -->
```

#### `escape` - HTML转义[](https://shopify.baoea.com/liquid/filters#escape---html%E8%BD%AC%E4%B9%89)

```
{{ product.description | escape }}
<!-- 转义HTML特殊字符 -->
 
{{ customer.note | escape }}
<!-- 安全显示用户输入内容 -->
```

#### `escape_once` - HTML转义(只转义一次)[](https://shopify.baoea.com/liquid/filters#escape_once---html%E8%BD%AC%E4%B9%89%E5%8F%AA%E8%BD%AC%E4%B9%89%E4%B8%80%E6%AC%A1)

```
{{ content | escape_once }}
<!-- 避免重复转义 -->
```

## 数字过滤器[](https://shopify.baoea.com/liquid/filters#%E6%95%B0%E5%AD%97%E8%BF%87%E6%BB%A4%E5%99%A8)

### 金额格式化[](https://shopify.baoea.com/liquid/filters#%E9%87%91%E9%A2%9D%E6%A0%BC%E5%BC%8F%E5%8C%96)

#### `money` - 格式化为货币[](https://shopify.baoea.com/liquid/filters#money---%E6%A0%BC%E5%BC%8F%E5%8C%96%E4%B8%BA%E8%B4%A7%E5%B8%81)

```
{{ product.price | money }}
<!-- 输出: ¥99.00 -->
 
{{ cart.total_price | money }}
<!-- 购物车总价格式化 -->
```

#### `money_without_currency` - 不显示货币符号[](https://shopify.baoea.com/liquid/filters#money_without_currency---%E4%B8%8D%E6%98%BE%E7%A4%BA%E8%B4%A7%E5%B8%81%E7%AC%A6%E5%8F%B7)

```
{{ product.price | money_without_currency }}
<!-- 输出: 99.00 -->
```

#### `money_with_currency` - 显示货币代码[](https://shopify.baoea.com/liquid/filters#money_with_currency---%E6%98%BE%E7%A4%BA%E8%B4%A7%E5%B8%81%E4%BB%A3%E7%A0%81)

```
{{ product.price | money_with_currency }}
<!-- 输出: ¥99.00 CNY -->
```

### 数学运算[](https://shopify.baoea.com/liquid/filters#%E6%95%B0%E5%AD%A6%E8%BF%90%E7%AE%97)

#### `plus` - 加法[](https://shopify.baoea.com/liquid/filters#plus---%E5%8A%A0%E6%B3%95)

```
{{ product.price | plus: 10 }}
<!-- 价格加10 -->
 
{{ cart.item_count | plus: 1 }}
<!-- 购物车数量加1 -->
```

#### `minus` - 减法[](https://shopify.baoea.com/liquid/filters#minus---%E5%87%8F%E6%B3%95)

```
{{ product.compare_at_price | minus: product.price }}
<!-- 计算折扣金额 -->
```

#### `times` - 乘法[](https://shopify.baoea.com/liquid/filters#times---%E4%B9%98%E6%B3%95)

```
{{ product.price | times: 0.9 }}
<!-- 9折价格 -->
 
{{ item.quantity | times: item.price }}
<!-- 计算总价 -->
```

#### `divided_by` - 除法[](https://shopify.baoea.com/liquid/filters#divided_by---%E9%99%A4%E6%B3%95)

```
{{ product.price | divided_by: 2 }}
<!-- 价格除以2 -->
 
{{ total_savings | divided_by: original_price | times: 100 }}
<!-- 计算折扣百分比 -->
```

#### `modulo` - 取余[](https://shopify.baoea.com/liquid/filters#modulo---%E5%8F%96%E4%BD%99)

```
{{ forloop.index | modulo: 2 }}
<!-- 判断奇偶数 -->
```

### 数字格式化[](https://shopify.baoea.com/liquid/filters#%E6%95%B0%E5%AD%97%E6%A0%BC%E5%BC%8F%E5%8C%96)

#### `round` - 四舍五入[](https://shopify.baoea.com/liquid/filters#round---%E5%9B%9B%E8%88%8D%E4%BA%94%E5%85%A5)

```
{{ 4.6 | round }}
<!-- 输出: 5 -->
 
{{ product.price | divided_by: 3 | round: 2 }}
<!-- 保留两位小数 -->
```

#### `ceil` - 向上取整[](https://shopify.baoea.com/liquid/filters#ceil---%E5%90%91%E4%B8%8A%E5%8F%96%E6%95%B4)

```
{{ 4.2 | ceil }}
<!-- 输出: 5 -->
```

#### `floor` - 向下取整[](https://shopify.baoea.com/liquid/filters#floor---%E5%90%91%E4%B8%8B%E5%8F%96%E6%95%B4)

```
{{ 4.8 | floor }}
<!-- 输出: 4 -->
```

#### `abs` - 绝对值[](https://shopify.baoea.com/liquid/filters#abs---%E7%BB%9D%E5%AF%B9%E5%80%BC)

```
{{ -5 | abs }}
<!-- 输出: 5 -->
```

## 日期过滤器[](https://shopify.baoea.com/liquid/filters#%E6%97%A5%E6%9C%9F%E8%BF%87%E6%BB%A4%E5%99%A8)

### `date` - 日期格式化[](https://shopify.baoea.com/liquid/filters#date---%E6%97%A5%E6%9C%9F%E6%A0%BC%E5%BC%8F%E5%8C%96)

```
<!-- 基本格式 -->
{{ article.published_at | date: '%Y-%m-%d' }}
<!-- 输出: 2023-12-01 -->
 
{{ article.published_at | date: '%B %d, %Y' }}
<!-- 输出: December 01, 2023 -->
 
<!-- 中文格式 -->
{{ article.published_at | date: '%Y年%m月%d日' }}
<!-- 输出: 2023年12月01日 -->
 
{{ article.published_at | date: '%m月%d日 %H:%M' }}
<!-- 输出: 12月01日 14:30 -->
 
<!-- 完整示例 -->
{{ order.created_at | date: '%Y年%m月%d日 %H:%M:%S' }}
<!-- 订单创建时间 -->
 
{{ customer.created_at | date: '%Y年%m月' }}
<!-- 客户注册月份 -->
```

#### 常用日期格式[](https://shopify.baoea.com/liquid/filters#%E5%B8%B8%E7%94%A8%E6%97%A5%E6%9C%9F%E6%A0%BC%E5%BC%8F)

```
<!-- 完整日期时间 -->
{{ 'now' | date: '%Y-%m-%d %H:%M:%S' }}
 
<!-- 短日期 -->
{{ 'now' | date: '%m/%d/%Y' }}
 
<!-- 长日期 -->
{{ 'now' | date: '%A, %B %d, %Y' }}
 
<!-- 时间戳 -->
{{ 'now' | date: '%s' }}
 
<!-- ISO 8601 格式 -->
{{ 'now' | date: '%Y-%m-%dT%H:%M:%S%z' }}
```

## 数组过滤器[](https://shopify.baoea.com/liquid/filters#%E6%95%B0%E7%BB%84%E8%BF%87%E6%BB%A4%E5%99%A8)

### 数组信息[](https://shopify.baoea.com/liquid/filters#%E6%95%B0%E7%BB%84%E4%BF%A1%E6%81%AF)

#### `size` - 获取数组长度[](https://shopify.baoea.com/liquid/filters#size---%E8%8E%B7%E5%8F%96%E6%95%B0%E7%BB%84%E9%95%BF%E5%BA%A6)

```
{{ collection.products | size }}
<!-- 集合中产品数量 -->
 
{{ cart.items | size }}
<!-- 购物车商品种类数 -->
 
{{ product.tags | size }}
<!-- 产品标签数量 -->
```

#### `first` - 获取第一个元素[](https://shopify.baoea.com/liquid/filters#first---%E8%8E%B7%E5%8F%96%E7%AC%AC%E4%B8%80%E4%B8%AA%E5%85%83%E7%B4%A0)

```
{{ collection.products | first }}
<!-- 第一个产品 -->
 
{{ product.images | first | image_url: width: 300, height: 300 }}
<!-- 第一张产品图片 -->
```

#### `last` - 获取最后一个元素[](https://shopify.baoea.com/liquid/filters#last---%E8%8E%B7%E5%8F%96%E6%9C%80%E5%90%8E%E4%B8%80%E4%B8%AA%E5%85%83%E7%B4%A0)

```
{{ collection.products | last }}
<!-- 最后一个产品 -->
 
{{ blog.articles | last }}
<!-- 最新文章 -->
```

### 数组操作[](https://shopify.baoea.com/liquid/filters#%E6%95%B0%E7%BB%84%E6%93%8D%E4%BD%9C)

#### `join` - 连接数组元素[](https://shopify.baoea.com/liquid/filters#join---%E8%BF%9E%E6%8E%A5%E6%95%B0%E7%BB%84%E5%85%83%E7%B4%A0)

```
{{ product.tags | join: ', ' }}
<!-- 用逗号连接标签 -->
 
{{ breadcrumb | join: ' > ' }}
<!-- 面包屑导航 -->
```

#### `split` - 分割字符串为数组[](https://shopify.baoea.com/liquid/filters#split---%E5%88%86%E5%89%B2%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%BA%E6%95%B0%E7%BB%84)

```
{{ 'red,green,blue' | split: ',' }}
<!-- 分割为颜色数组 -->
 
{{ product.tags | split: ',' | join: ' | ' }}
<!-- 重新格式化标签 -->
```

#### `reverse` - 反转数组[](https://shopify.baoea.com/liquid/filters#reverse---%E5%8F%8D%E8%BD%AC%E6%95%B0%E7%BB%84)

```
{% assign products = collection.products | reverse %}
{% for product in products %}
  <!-- 从最新到最旧显示产品 -->
{% endfor %}
```

#### `sort` - 排序数组[](https://shopify.baoea.com/liquid/filters#sort---%E6%8E%92%E5%BA%8F%E6%95%B0%E7%BB%84)

```
{{ product.tags | sort }}
<!-- 按字母顺序排序标签 -->
 
{% assign sorted_products = collection.products | sort: 'price' %}
<!-- 按价格排序产品 -->
```

#### `sort_natural` - 自然排序[](https://shopify.baoea.com/liquid/filters#sort_natural---%E8%87%AA%E7%84%B6%E6%8E%92%E5%BA%8F)

```
{{ product.tags | sort_natural }}
<!-- 自然排序(数字按数值排序) -->
```

#### `uniq` - 去重[](https://shopify.baoea.com/liquid/filters#uniq---%E5%8E%BB%E9%87%8D)

```
{{ all_tags | uniq }}
<!-- 移除重复标签 -->
```

### 数组筛选[](https://shopify.baoea.com/liquid/filters#%E6%95%B0%E7%BB%84%E7%AD%9B%E9%80%89)

#### `where` - 筛选数组[](https://shopify.baoea.com/liquid/filters#where---%E7%AD%9B%E9%80%89%E6%95%B0%E7%BB%84)

```
{% assign available_products = collection.products | where: 'available', true %}
<!-- 筛选有库存的产品 -->
 
{% assign featured_articles = blog.articles | where: 'tags', 'featured' %}
<!-- 筛选特色文章 -->
```

#### `map` - 提取属性[](https://shopify.baoea.com/liquid/filters#map---%E6%8F%90%E5%8F%96%E5%B1%9E%E6%80%A7)

```
{{ collection.products | map: 'title' }}
<!-- 提取所有产品标题 -->
 
{{ cart.items | map: 'product.vendor' | uniq %}
<!-- 获取购物车中所有供应商 -->
```

## 图片过滤器[](https://shopify.baoea.com/liquid/filters#%E5%9B%BE%E7%89%87%E8%BF%87%E6%BB%A4%E5%99%A8)

### `image_url` - 生成图片 URL（推荐）[](https://shopify.baoea.com/liquid/filters#image_url---%E7%94%9F%E6%88%90%E5%9B%BE%E7%89%87-url%E6%8E%A8%E8%8D%90)

Shopify 主题应优先使用 `image_url`，替代已弃用的 `img_url`（旧主题仍可能见到 `img_url`，新代码请勿再写）。

```
<!-- 固定宽高 -->
{{ product.featured_image | image_url: width: 300, height: 300 }}
 
<!-- 仅限制宽度，高度按比例 -->
{{ product.featured_image | image_url: width: 500 }}
 
<!-- 仅限制高度 -->
{{ product.featured_image | image_url: height: 400 }}
 
<!-- 指定格式（如 WebP），需 CDN 与主题版本支持 -->
{{ product.featured_image | image_url: width: 800, format: 'webp' }}
 
<!-- 响应式：密度或宽度描述符与 HTML 规范一致 -->
<img src="{{ product.featured_image | image_url: width: 300 }}"
     srcset="{{ product.featured_image | image_url: width: 300 }} 300w,
             {{ product.featured_image | image_url: width: 600 }} 600w"
     sizes="(max-width: 768px) 50vw, 300px"
     alt="{{ product.featured_image.alt | escape }}"
     loading="lazy">
```

**迁移对照（旧 → 新）：**

| 旧写法（已弃用） | 新写法 |
| --- | --- |
| | img_url: '300x300' | | image_url: width: 300, height: 300 |
| | img_url: '500x' | | image_url: width: 500 |
| | img_url: 'x400' | | image_url: height: 400 |

**旧版预设名（thumb、compact 等）：** 请改为显式 `width` / `height` 数值，便于控制清晰度与性能。

官方参考：[Liquid image\_url](https://shopify.dev/docs/api/liquid/filters/image_url) 。

### `image_tag` - 生成完整 `img`（推荐）[](https://shopify.baoea.com/liquid/filters#image_tag---%E7%94%9F%E6%88%90%E5%AE%8C%E6%95%B4-img%E6%8E%A8%E8%8D%90)

```
{{ product.featured_image | image_url: width: 600 | image_tag: alt: product.title, loading: 'lazy' }}
```

旧版 `img_tag: '300x300'` 在新主题中应改为与 `image_url` 组合或直接使用 `image_tag` 的命名参数（以当前 Shopify 文档为准）。

### `asset_img_url` - 主题资源图片[](https://shopify.baoea.com/liquid/filters#asset_img_url---%E4%B8%BB%E9%A2%98%E8%B5%84%E6%BA%90%E5%9B%BE%E7%89%87)

用于 `assets` 内图片，与 `image_url`（商品/媒体库）不同：

```
{{ 'logo.png' | asset_img_url: width: 200 }}
```

## 颜色过滤器[](https://shopify.baoea.com/liquid/filters#%E9%A2%9C%E8%89%B2%E8%BF%87%E6%BB%A4%E5%99%A8)

### `color_to_rgb` - 转换为RGB[](https://shopify.baoea.com/liquid/filters#color_to_rgb---%E8%BD%AC%E6%8D%A2%E4%B8%BArgb)

```
{{ '#ff0000' | color_to_rgb }}
<!-- 输出: rgb(255, 0, 0) -->
```

### `color_to_hsl` - 转换为HSL[](https://shopify.baoea.com/liquid/filters#color_to_hsl---%E8%BD%AC%E6%8D%A2%E4%B8%BAhsl)

```
{{ '#ff0000' | color_to_hsl }}
<!-- 输出: hsl(0, 100%, 50%) -->
```

### `color_to_hex` - 转换为HEX[](https://shopify.baoea.com/liquid/filters#color_to_hex---%E8%BD%AC%E6%8D%A2%E4%B8%BAhex)

```
{{ 'rgb(255, 0, 0)' | color_to_hex }}
<!-- 输出: #ff0000 -->
```

### `color_brightness` - 获取亮度[](https://shopify.baoea.com/liquid/filters#color_brightness---%E8%8E%B7%E5%8F%96%E4%BA%AE%E5%BA%A6)

```
{{ '#ffffff' | color_brightness }}
<!-- 输出亮度值 -->
```

### `color_lighten` - 调亮颜色[](https://shopify.baoea.com/liquid/filters#color_lighten---%E8%B0%83%E4%BA%AE%E9%A2%9C%E8%89%B2)

```
{{ '#ff0000' | color_lighten: 20 }}
<!-- 将红色调亮20% -->
```

### `color_darken` - 调暗颜色[](https://shopify.baoea.com/liquid/filters#color_darken---%E8%B0%83%E6%9A%97%E9%A2%9C%E8%89%B2)

```
{{ '#ff0000' | color_darken: 20 }}
<!-- 将红色调暗20% -->
```

## 实际应用示例[](https://shopify.baoea.com/liquid/filters#%E5%AE%9E%E9%99%85%E5%BA%94%E7%94%A8%E7%A4%BA%E4%BE%8B)

### 产品卡片完整示例[](https://shopify.baoea.com/liquid/filters#%E4%BA%A7%E5%93%81%E5%8D%A1%E7%89%87%E5%AE%8C%E6%95%B4%E7%A4%BA%E4%BE%8B)

```
<!-- snippets/product-card.liquid -->
<div class="product-card" data-product-id="{{ product.id }}">
  <!-- 产品图片 -->
  <div class="product-image">
    <a href="{{ product.url }}">
      {% if product.featured_image %}
        <img src="{{ product.featured_image | image_url: width: 300, height: 300 }}"
             srcset="{{ product.featured_image | image_url: width: 300, height: 300 }} 1x,
                     {{ product.featured_image | image_url: width: 600, height: 600 }} 2x"
             alt="{{ product.featured_image.alt | escape | default: product.title }}"
             loading="lazy">
      {% else %}
        <div class="no-image">暂无图片</div>
      {% endif %}
    </a>
    
    <!-- 促销标签 -->
    {% if product.compare_at_price > product.price %}
      {% assign discount = product.compare_at_price | minus: product.price %}
      {% assign discount_percent = discount | times: 100 | divided_by: product.compare_at_price | round %}
      <span class="sale-badge">-{{ discount_percent }}%</span>
    {% endif %}
  </div>
 
  <!-- 产品信息 -->
  <div class="product-info">
    <!-- 供应商 -->
    {% if product.vendor != blank %}
      <div class="product-vendor">{{ product.vendor | upcase }}</div>
    {% endif %}
 
    <!-- 产品标题 -->
    <h3 class="product-title">
      <a href="{{ product.url }}">
        {{ product.title | truncate: 60 }}
      </a>
    </h3>
 
    <!-- 产品价格 -->
    <div class="product-price">
      {% if product.compare_at_price > product.price %}
        <span class="price-compare">{{ product.compare_at_price | money }}</span>
        <span class="price-sale">{{ product.price | money }}</span>
      {% else %}
        <span class="price">{{ product.price | money }}</span>
      {% endif %}
    </div>
 
    <!-- 产品标签 -->
    {% if product.tags.size > 0 %}
      <div class="product-tags">
        {% assign display_tags = product.tags | where_not: 'hidden' | slice: 0, 3 %}
        {% for tag in display_tags %}
          <span class="tag">{{ tag | replace: '_', ' ' | capitalize }}</span>
        {% endfor %}
      </div>
    {% endif %}
 
    <!-- 变体信息 -->
    {% if product.variants.size > 1 %}
      <div class="variant-info">
        {{ product.variants.size }} 个选项可选
      </div>
    {% endif %}
  </div>
</div>
```

### 购物车摘要示例[](https://shopify.baoea.com/liquid/filters#%E8%B4%AD%E7%89%A9%E8%BD%A6%E6%91%98%E8%A6%81%E7%A4%BA%E4%BE%8B)

```
<!-- snippets/cart-summary.liquid -->
<div class="cart-summary">
  <!-- 购物车商品数量 -->
  <div class="cart-count">
    购物车 ({{ cart.item_count }} {% if cart.item_count == 1 %}件商品{% else %}件商品{% endif %})
  </div>
 
  <!-- 商品列表 -->
  {% for item in cart.items limit: 5 %}
    <div class="cart-item-summary">
      <img src="{{ item.image | image_url: width: 60, height: 60 }}" 
           alt="{{ item.title | escape }}">
      <div class="item-details">
        <div class="item-title">{{ item.product.title | truncate: 30 }}</div>
        {% unless item.variant.title contains 'Default' %}
          <div class="item-variant">{{ item.variant.title }}</div>
        {% endunless %}
        <div class="item-quantity-price">
          {{ item.quantity }} × {{ item.price | money }}
        </div>
      </div>
    </div>
  {% endfor %}
 
  <!-- 显示更多 -->
  {% if cart.item_count > 5 %}
    <div class="more-items">
      还有 {{ cart.item_count | minus: 5 }} 件商品...
    </div>
  {% endif %}
 
  <!-- 总计 -->
  <div class="cart-total">
    <div class="subtotal">
      小计: {{ cart.total_price | money }}
    </div>
    {% if cart.total_discounts > 0 %}
      <div class="discounts">
        折扣: -{{ cart.total_discounts | money }}
      </div>
    {% endif %}
  </div>
</div>
```

### 博客文章预览[](https://shopify.baoea.com/liquid/filters#%E5%8D%9A%E5%AE%A2%E6%96%87%E7%AB%A0%E9%A2%84%E8%A7%88)

```
<!-- snippets/article-preview.liquid -->
<article class="article-preview">
  <!-- 文章图片 -->
  {% if article.image %}
    <div class="article-image">
      <a href="{{ article.url }}">
        <img src="{{ article.image | image_url: width: 400, height: 250 }}"
             alt="{{ article.image.alt | escape | default: article.title }}"
             loading="lazy">
      </a>
    </div>
  {% endif %}
 
  <!-- 文章内容 -->
  <div class="article-content">
    <!-- 文章标题 -->
    <h2 class="article-title">
      <a href="{{ article.url }}">{{ article.title }}</a>
    </h2>
 
    <!-- 文章元信息 -->
    <div class="article-meta">
      <time datetime="{{ article.published_at | date: '%Y-%m-%d' }}">
        {{ article.published_at | date: '%Y年%m月%d日' }}
      </time>
      {% if article.author != blank %}
        <span class="author">作者: {{ article.author }}</span>
      {% endif %}
      {% if article.tags.size > 0 %}
        <div class="tags">
          {% for tag in article.tags limit: 3 %}
            <span class="tag">{{ tag | replace: '_', ' ' | capitalize }}</span>
          {% endfor %}
        </div>
      {% endif %}
    </div>
 
    <!-- 文章摘要 -->
    <div class="article-excerpt">
      {% if article.excerpt != blank %}
        {{ article.excerpt | strip_html | truncate: 200 }}
      {% else %}
        {{ article.content | strip_html | truncate: 200 }}
      {% endif %}
    </div>
 
    <!-- 阅读时间估算 -->
    {% assign reading_time = article.content | strip_html | split: ' ' | size | divided_by: 200 | at_least: 1 %}
    <div class="reading-time">
      预计阅读时间: {{ reading_time }} 分钟
    </div>
 
    <a href="{{ article.url }}" class="read-more">阅读全文</a>
  </div>
</article>
```

## 过滤器最佳实践[](https://shopify.baoea.com/liquid/filters#%E8%BF%87%E6%BB%A4%E5%99%A8%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5)

### 1\. 性能考虑[](https://shopify.baoea.com/liquid/filters#1-%E6%80%A7%E8%83%BD%E8%80%83%E8%99%91)

```
<!-- 好的做法：在循环外处理数据 -->
{% assign featured_products = collection.products | where: 'tags', 'featured' %}
{% for product in featured_products %}
  <!-- 渲染产品 -->
{% endfor %}
 
<!-- 避免：在循环内重复处理 -->
{% for product in collection.products %}
  {% if product.tags contains 'featured' %}
    <!-- 渲染产品 -->
  {% endif %}
{% endfor %}
```

### 2\. 安全性[](https://shopify.baoea.com/liquid/filters#2-%E5%AE%89%E5%85%A8%E6%80%A7)

```
<!-- 始终转义用户输入 -->
{{ customer.note | escape }}
{{ search.terms | escape }}
 
<!-- 处理可能为空的值 -->
{{ product.featured_image.alt | escape | default: product.title }}
```

### 3\. 可读性[](https://shopify.baoea.com/liquid/filters#3-%E5%8F%AF%E8%AF%BB%E6%80%A7)

```
<!-- 使用变量提高可读性 -->
{% assign discount_percent = product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price | round %}
 
<!-- 而不是一行完成所有计算 -->
{{ product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price | round }}%
```

## 相关资源[](https://shopify.baoea.com/liquid/filters#%E7%9B%B8%E5%85%B3%E8%B5%84%E6%BA%90)

*   [Shopify Liquid 过滤器官方文档](https://shopify.dev/docs/api/liquid/filters) 
*   [Liquid 语法详解](https://shopify.baoea.com/liquid/syntax)
*   [标签和控制结构](https://shopify.baoea.com/liquid/tags)
*   [Shopify 对象参考](https://shopify.baoea.com/liquid/shopify-objects)

掌握这些过滤器将让您能够创建强大而灵活的 Shopify 主题！
