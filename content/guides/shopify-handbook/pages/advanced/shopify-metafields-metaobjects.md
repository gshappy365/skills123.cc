---
source_url: "https://shopify.baoea.com/advanced/shopify-metafields-metaobjects"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:41:35"
fetch_method: "http"
content_hash: "8bcfe6e19dccd00959219eab2e5d6510c6d627e6d200931dd5dfffcaab0ce2a1"
discovered_via: ["sitemap", "internal_link"]
---
## Shopify Metafields 与 Metaobjects 完整指南

![Shopify 管理员中的元字段与元对象定义](https://shopify.baoea.com/_next/image?url=%2Fimages%2Fcontents%2Fshopify-settings-metafields.png&w=2048&q=75)

Metafields 与 Metaobjects 是 Shopify Online Store 2.0 时代的核心数据扩展能力。理解清楚它们能让主题、应用、Headless 站点都拥有**结构化、可校验、可复用**的自定义数据，避免把业务数据硬编码到主题或脏写到产品描述里。

**视频讲解**：[Shopify 元字段与元对象讲解（B 站）](https://www.bilibili.com/video/BV1ge4UzBE3u/) 

> 适合：主题开发者、应用开发者、需要结构化数据的店铺运营团队

## 一、概念区分[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E4%B8%80%E6%A6%82%E5%BF%B5%E5%8C%BA%E5%88%86)

### Metafield（元字段）[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#metafield%E5%85%83%E5%AD%97%E6%AE%B5)

给某个具体资源（产品、变体、集合、客户、订单、店铺）**附加一个自定义字段**。每个 metafield 由 `namespace.key` 唯一标识。

**类比**：给产品贴一张便签——副标题、保质期、护理说明、燃烧时长。一条便签一个值（单值或列表）。

### Metaobject（元对象）[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#metaobject%E5%85%83%E5%AF%B9%E8%B1%A1)

定义**一类可复用的内容结构**，并可创建多条具体条目。

**类比**：定义一张表（“尺码表”、“门店”、“品牌故事”），然后填入多行数据。

### 二者的协作[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E4%BA%8C%E8%80%85%E7%9A%84%E5%8D%8F%E4%BD%9C)

简单加字段 → Metafield。

需要可复用的结构化内容（多字段、多条记录）→ 先建 Metaobject，再用 `metaobject_reference` 类型的 Metafield 在资源上引用。

### 何时用 Metafield，何时用 Metaobject[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E4%BD%95%E6%97%B6%E7%94%A8-metafield%E4%BD%95%E6%97%B6%E7%94%A8-metaobject)

| 需求 | 推荐 |
| --- | --- |
| 给产品加副标题 / 保质期 | product.metafields |
| 给变体加单独属性 | variant.metafields |
| 全站统一 Slogan | shop.metafields |
| 多语言翻译 / 多市场字段 | product.metafields + 翻译 |
| 可复用尺码表 / 门店 | metaobject + metaobject_reference |
| 品牌故事（多字段结构） | metaobject |
| 一组互不相关的字段 | 多个独立 metafield |
| 一组互相关联的字段 | 一个 metaobject |

## 二、为什么用元字段而非产品描述[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E4%BA%8C%E4%B8%BA%E4%BB%80%E4%B9%88%E7%94%A8%E5%85%83%E5%AD%97%E6%AE%B5%E8%80%8C%E9%9D%9E%E4%BA%A7%E5%93%81%E6%8F%8F%E8%BF%B0)

很多店铺把”成分”、“尺寸”、“保养方法”塞到产品描述（description）里。Metafields 的优势：

| 维度 | 塞到描述 | 用 Metafield |
| --- | --- | --- |
| 结构化 | ❌ 纯文本 | ✅ 字段化 |
| 校验 | ❌ 无 | ✅ 类型 + 验证规则 |
| 多语言 | ❌ 难维护 | ✅ 翻译友好 |
| 主题渲染 | 单点 HTML 块 | 可视化编辑器动态绑定 |
| 应用读写 | 难 | API 一致 |
| Headless | 需要 HTML 解析 | 直接 GraphQL 读取 |
| SEO | 单页可索引 | 可以用 Schema 标注 |
| 集合筛选 | 不支持 | 支持作为智能集合条件 |
| POS 显示 | 无 | 可置顶到 POS |

**生产建议**：所有结构化数据用 Metafield，描述只放营销长文本。

## 三、命名空间规范[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E4%B8%89%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E8%A7%84%E8%8C%83)

格式：`namespace.key`，如 `custom.subtitle`、`marketing.badge`。

### 推荐规范[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E6%8E%A8%E8%8D%90%E8%A7%84%E8%8C%83)

*   **业务前缀 + 模块**：`product_info`、`marketing`、`storefront`
*   **保留 `custom` 给通用字段**：默认 Shopify 后台创建的字段在 `custom` 命名空间
*   **避免下划线开头**：Shopify 保留下划线开头作为内部命名
*   **小写 + 下划线**：`size_chart`、`burn_time`

### 不推荐的做法[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E4%B8%8D%E6%8E%A8%E8%8D%90%E7%9A%84%E5%81%9A%E6%B3%95)

*   单一巨大 namespace（如全部用 `custom.*`），后期重构困难
*   中文 key（虽然技术上支持，但维护麻烦）
*   业务模型与 namespace 混乱

## 四、字段类型[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%9B%9B%E5%AD%97%E6%AE%B5%E7%B1%BB%E5%9E%8B)

Shopify 支持丰富的字段类型，按类别：

### 文本类[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E6%96%87%E6%9C%AC%E7%B1%BB)

*   `single_line_text_field`：单行文本
*   `multi_line_text_field`：多行文本
*   `rich_text_field`：富文本（含格式）
*   `url`：URL
*   `json`：JSON 数据
*   `color`：颜色（#RRGGBB）

### 数值类[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E6%95%B0%E5%80%BC%E7%B1%BB)

*   `number_integer`：整数
*   `number_decimal`：小数

### 布尔类[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%B8%83%E5%B0%94%E7%B1%BB)

*   `boolean`

### 日期类[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E6%97%A5%E6%9C%9F%E7%B1%BB)

*   `date`
*   `date_time`

### 媒体类[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%AA%92%E4%BD%93%E7%B1%BB)

*   `file_reference`：文件
*   `image_reference`：图片
*   `video_reference`：视频

### 关系类[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%85%B3%E7%B3%BB%E7%B1%BB)

*   `product_reference`：产品引用
*   `variant_reference`：变体引用
*   `collection_reference`：集合引用
*   `page_reference`：页面引用
*   `metaobject_reference`：元对象引用

### 列表变体[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%88%97%E8%A1%A8%E5%8F%98%E4%BD%93)

多数类型都有 `list.*` 列表变体：

*   `list.single_line_text_field`：字符串列表
*   `list.product_reference`：产品引用列表
*   `list.color`：颜色列表（用于色块展示）

### 评定单位[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E8%AF%84%E5%AE%9A%E5%8D%95%E4%BD%8D)

*   `weight`、`dimension`、`volume`：带单位的数值

### 类型选择原则[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E7%B1%BB%E5%9E%8B%E9%80%89%E6%8B%A9%E5%8E%9F%E5%88%99)

*   简单文本 → `single_line_text_field`
*   富文本展示 → `rich_text_field`
*   结构化数据 → `json` 或 `metaobject_reference`
*   多选关联 → `list.metaobject_reference`

## 五、后台操作[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E4%BA%94%E5%90%8E%E5%8F%B0%E6%93%8D%E4%BD%9C)

### 创建 Metafield 定义[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%88%9B%E5%BB%BA-metafield-%E5%AE%9A%E4%B9%89)

Shopify 后台 → **Settings → Custom data**：

1.  选择资源类型（Products / Variants / Collections 等）
2.  点击 **Add definition**
3.  填写：名称、Namespace、Key、Type、验证规则、是否可在 Storefront 访问
4.  保存

### 创建 Metaobject 定义[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%88%9B%E5%BB%BA-metaobject-%E5%AE%9A%E4%B9%89)

Shopify 后台 → **Settings → Custom data → Metaobjects**：

1.  点击 **Add definition**
2.  命名 type（如 `size_chart`）
3.  添加多个字段（每个字段独立 type）
4.  设置 access：Storefront 可读 / 主题可见 / 仅 Admin
5.  创建 entries（具体条目）

### 在资源上填写值[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%9C%A8%E8%B5%84%E6%BA%90%E4%B8%8A%E5%A1%AB%E5%86%99%E5%80%BC)

进入产品 / 集合详情页 → “Custom data” 区域 → 录入值。

可以**置顶常用字段**：右上角 “Pin” 让该字段在产品列表显示。

### 关联到主题[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%85%B3%E8%81%94%E5%88%B0%E4%B8%BB%E9%A2%98)

Online Store 2.0 主题支持动态来源：

1.  在线商店 → 主题 → Customize
2.  添加 Block 或 Section（如”Text”）
3.  字段旁的 “Connect dynamic source” 按钮
4.  选择对应 metafield

无需写代码即可在前台展示。

## 六、Liquid 中读取[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%85%ADliquid-%E4%B8%AD%E8%AF%BB%E5%8F%96)

### 读取简单字段[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E8%AF%BB%E5%8F%96%E7%AE%80%E5%8D%95%E5%AD%97%E6%AE%B5)

```
{# 读取产品副标题 #}
{% if product.metafields.custom.subtitle %}
  <p class="product-subtitle">{{ product.metafields.custom.subtitle | escape }}</p>
{% endif %}
 
{# 带默认值 #}
{% assign badge = product.metafields.marketing.badge | default: 'New' %}
 
{# 富文本字段 #}
{% if product.metafields.custom.care_instructions %}
  <div class="rte">
    {{ product.metafields.custom.care_instructions | metafield_tag }}
  </div>
{% endif %}
```

`| metafield_tag` filter 是 2024 年新增的，自动按字段类型渲染（富文本会输出 HTML，图片会输出 `<img>`）。

### 读取列表字段[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E8%AF%BB%E5%8F%96%E5%88%97%E8%A1%A8%E5%AD%97%E6%AE%B5)

```
{% if product.metafields.custom.features %}
  <ul>
    {% for feature in product.metafields.custom.features.value %}
      <li>{{ feature }}</li>
    {% endfor %}
  </ul>
{% endif %}
```

注意：列表字段需要 `.value` 才能拿到数组。

### 读取关联字段[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E8%AF%BB%E5%8F%96%E5%85%B3%E8%81%94%E5%AD%97%E6%AE%B5)

```
{# 读取关联产品 #}
{% assign related = product.metafields.custom.related_product.value %}
{% if related %}
  <a href="{{ related.url }}">{{ related.title }}</a>
{% endif %}
 
{# 读取关联 metaobject #}
{% assign size_chart = product.metafields.custom.size_chart.value %}
{% if size_chart %}
  <h3>{{ size_chart.title }}</h3>
  <div>{{ size_chart.content | metafield_tag }}</div>
{% endif %}
```

### 读取 JSON 字段[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E8%AF%BB%E5%8F%96-json-%E5%AD%97%E6%AE%B5)

```
{% assign spec = product.metafields.custom.spec_json.value %}
{% if spec %}
  <table>
    {% for key in spec %}
      <tr>
        <td>{{ key[0] }}</td>
        <td>{{ key[1] }}</td>
      </tr>
    {% endfor %}
  </table>
{% endif %}
```

## 七、Admin GraphQL：写入[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E4%B8%83admin-graphql%E5%86%99%E5%85%A5)

### 创建 / 更新 Metafield[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%88%9B%E5%BB%BA--%E6%9B%B4%E6%96%B0-metafield)

```
mutation UpsertMetafield(
  $ownerId: ID!,
  $namespace: String!,
  $key: String!,
  $type: String!,
  $value: String!
) {
  metafieldsSet(
    metafields: [{
      ownerId: $ownerId,
      namespace: $namespace,
      key: $key,
      type: $type,
      value: $value
    }]
  ) {
    metafields { id namespace key type value }
    userErrors { field message }
  }
}
```

变量示例：

```
{
  "ownerId": "gid://shopify/Product/1234567890",
  "namespace": "custom",
  "key": "subtitle",
  "type": "single_line_text_field",
  "value": "轻盈透气，全天舒适"
}
```

### 批量写入[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E6%89%B9%E9%87%8F%E5%86%99%E5%85%A5)

`metafieldsSet` 支持一次最多 25 个 metafield。批量操作比循环单写效率高 10-20 倍。

### 创建 Metaobject Definition[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%88%9B%E5%BB%BA-metaobject-definition)

```
mutation {
  metaobjectDefinitionCreate(definition: {
    type: "size_chart"
    name: "Size Chart"
    fieldDefinitions: [
      { name: "Title", key: "title", type: "single_line_text_field", required: true },
      { name: "Content", key: "content", type: "rich_text_field" }
    ]
    access: { storefront: PUBLIC_READ }
  }) {
    metaobjectDefinition { id type name }
    userErrors { field message }
  }
}
```

### 创建 Metaobject Entry[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%88%9B%E5%BB%BA-metaobject-entry)

```
mutation {
  metaobjectCreate(metaobject: {
    type: "size_chart"
    fields: [
      { key: "title", value: "上装尺码表" },
      { key: "content", value: "{\"type\":\"root\",\"children\":[...]}" }
    ]
  }) {
    metaobject { id handle }
    userErrors { field message }
  }
}
```

### 关联 Metaobject 到产品[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%85%B3%E8%81%94-metaobject-%E5%88%B0%E4%BA%A7%E5%93%81)

```
mutation LinkMetaobjectToProduct(
  $productId: ID!,
  $metaobjectId: ID!
) {
  metafieldsSet(metafields: [{
    ownerId: $productId,
    namespace: "custom",
    key: "size_chart",
    type: "metaobject_reference",
    value: $metaobjectId
  }]) {
    metafields { id }
    userErrors { field message }
  }
}
```

`value` 字段传 metaobject 的 GID（如 `gid://shopify/Metaobject/xxx`）。

## 八、Storefront API：读取[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%85%ABstorefront-api%E8%AF%BB%E5%8F%96)

Headless 站点或前端 API 集成场景：

```
query ProductWithCustomData($handle: String!) {
  product(handle: $handle) {
    id
    title
    handle
 
    # 单字段
    subtitle: metafield(namespace: "custom", key: "subtitle") {
      value
    }
 
    # 关联元对象
    sizeChart: metafield(namespace: "custom", key: "size_chart") {
      reference {
        ... on Metaobject {
          handle
          type
          fields { key value }
        }
      }
    }
 
    # 关联产品列表
    relatedProducts: metafield(namespace: "custom", key: "related") {
      references(first: 10) {
        edges {
          node {
            ... on Product {
              handle
              title
            }
          }
        }
      }
    }
  }
}
```

**关键**：Storefront API 只能读取 access 设为 `PUBLIC_READ` 的字段。Admin 后台可能能看到但 Storefront 看不到，需检查 access 设置。

## 九、典型应用场景[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E4%B9%9D%E5%85%B8%E5%9E%8B%E5%BA%94%E7%94%A8%E5%9C%BA%E6%99%AF)

### 场景 1：产品规格表[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%9C%BA%E6%99%AF-1%E4%BA%A7%E5%93%81%E8%A7%84%E6%A0%BC%E8%A1%A8)

每个产品的规格不同，结构化为 JSON：

*   字段：`product.metafields.specs.json`
*   类型：`json`
*   值：`{"重量": "200g", "材质": "棉", "产地": "中国"}`

Liquid 渲染表格。

### 场景 2：可复用尺码表[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%9C%BA%E6%99%AF-2%E5%8F%AF%E5%A4%8D%E7%94%A8%E5%B0%BA%E7%A0%81%E8%A1%A8)

服饰品类的不同 SKU 共享同一尺码表：

*   创建 Metaobject `size_chart`，含 title + content 字段
*   创建几个具体 entries（上装、下装、童装等）
*   在产品上加 metafield `custom.size_chart`（类型 `metaobject_reference`）

### 场景 3：FAQ 折叠面板[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%9C%BA%E6%99%AF-3faq-%E6%8A%98%E5%8F%A0%E9%9D%A2%E6%9D%BF)

每个产品有不同的 FAQ：

*   创建 Metaobject `faq_item`，含 question + answer 字段
*   产品 metafield `custom.faqs`（类型 `list.metaobject_reference`）
*   在产品上挂多个 FAQ entries
*   主题循环渲染并加 FAQPage schema

### 场景 4：品牌故事[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%9C%BA%E6%99%AF-4%E5%93%81%E7%89%8C%E6%95%85%E4%BA%8B)

每个品牌的故事内容复杂：

*   Metaobject `brand_story`，含 title / hero\_image / content / founder
*   产品 metafield 引用对应 brand\_story
*   多个产品共享同一品牌故事

### 场景 5：补货邮件订阅[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%9C%BA%E6%99%AF-5%E8%A1%A5%E8%B4%A7%E9%82%AE%E4%BB%B6%E8%AE%A2%E9%98%85)

记录客户对哪个 variant 想要补货：

*   Customer metafield `notifications.restock_variants`（类型 `list.variant_reference`）
*   通过 API 维护列表

## 十、常见问题排查[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%8D%81%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E6%8E%92%E6%9F%A5)

### 主题中字段显示空[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E4%B8%BB%E9%A2%98%E4%B8%AD%E5%AD%97%E6%AE%B5%E6%98%BE%E7%A4%BA%E7%A9%BA)

*   拼写是否正确（namespace、key 必须精确匹配）
*   字段是否定义在该资源类型（如不要把 product metafield 当 collection metafield 读取）
*   access 是否允许（Storefront 读取需要 `PUBLIC_READ`）
*   该字段是否真的填了值（后台空字段当然返回空）

### Storefront API 读不到[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#storefront-api-%E8%AF%BB%E4%B8%8D%E5%88%B0)

*   检查 metafield 定义的 access 是否包含 Storefront
*   检查 metaobject 定义的 access 是否包含 Storefront
*   关联字段时引用对象的 access 也要打开

### `metafieldsSet` 返回错误[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#metafieldsset-%E8%BF%94%E5%9B%9E%E9%94%99%E8%AF%AF)

`userErrors` 字段中查看：

*   `type` 与 `value` 必须匹配（如 `boolean` 类型 value 必须是 `"true"` 或 `"false"`）
*   `ownerId` 是否是正确格式的 GID
*   命名空间不能用 Shopify 保留前缀
*   列表类型 value 必须是 JSON 字符串数组

### 性能问题[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E6%80%A7%E8%83%BD%E9%97%AE%E9%A2%98)

大量产品都引用同一个 metaobject 时，渲染性能可能下降：

*   用 `{% liquid %}` 块预加载到本地变量
*   避免循环内重复访问
*   考虑 metaobject 内容内嵌到产品（如果不复用，直接用 metafield 即可）

## 十一、生产实践建议[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%8D%81%E4%B8%80%E7%94%9F%E4%BA%A7%E5%AE%9E%E8%B7%B5%E5%BB%BA%E8%AE%AE)

### 命名规划[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%91%BD%E5%90%8D%E8%A7%84%E5%88%92)

新店上线前规划好 namespace 与字段分类：

```
custom.*           - 通用字段（默认）
product_info.*     - 产品信息扩展
marketing.*        - 营销标签 / 角标
seo.*              - SEO 元数据扩展
shipping.*         - 物流相关
b2b.*              - B2B 客户分级
```

### 类型选择[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E7%B1%BB%E5%9E%8B%E9%80%89%E6%8B%A9)

*   简单文本永远用 `single_line_text_field`，不要塞 JSON
*   结构化数据用 JSON 或 Metaobject，**不要硬塞分隔符**（如用 `;` 分隔的字符串）
*   颜色用 `color` 类型，不要用 hex 字符串

### 验证规则[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E9%AA%8C%E8%AF%81%E8%A7%84%E5%88%99)

*   数值字段设最小 / 最大
*   文本字段限制长度
*   URL 字段加正则
*   必填项标记 required

减少后台运营录入错误。

### 文档化[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E6%96%87%E6%A1%A3%E5%8C%96)

每个 namespace 与 key 在内部 wiki 中记录：

*   用途
*   类型
*   示例值
*   在主题哪里展示
*   在 API 哪里读取

新员工接手时能快速理解。

### 不要做的[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E4%B8%8D%E8%A6%81%E5%81%9A%E7%9A%84)

*   不要把 metafield 当数据库用（高频写入应该用专门系统）
*   不要在循环里频繁访问 metafield（性能差）
*   不要把超大数据（> 10KB）塞进单个 metafield

## 十二、相关教程[](https://shopify.baoea.com/advanced/shopify-metafields-metaobjects#%E5%8D%81%E4%BA%8C%E7%9B%B8%E5%85%B3%E6%95%99%E7%A8%8B)

*   [Shopify Liquid 进阶技巧](https://shopify.baoea.com/advanced/advanced-liquid-techniques)
*   [Shopify 主题开发指南](https://shopify.baoea.com/advanced/shopify-theme-development-guide)
*   [Shopify API 深度应用](https://shopify.baoea.com/advanced/shopify-api-advanced)
*   [Headless Commerce 架构](https://shopify.baoea.com/advanced/headless-commerce-architecture)
*   [Shopify Metafields 官方文档](https://help.shopify.com/en/manual/custom-data/metafields) 
*   [Shopify Metaobjects 官方文档](https://help.shopify.com/en/manual/custom-data/metaobjects) 
*   [Admin GraphQL Metafields 参考](https://shopify.dev/docs/api/admin-graphql/latest/objects/Metafield)
