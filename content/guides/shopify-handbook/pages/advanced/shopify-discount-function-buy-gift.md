---
source_url: "https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:40:24"
fetch_method: "http"
content_hash: "14f56361e9822f04695b7b3155e0a67626a635b92d417811dcbc3bde9f195c99"
discovered_via: ["sitemap", "internal_link"]
---
## Shopify Discount Function 实现买赠（买A赠B / 满X赠B）

这篇文档直接讲你最关心的两个场景：

1.  **买 A 赠 B**（例如买 2 件 A，送 1 件 B）
2.  **订单总价满 X 赠 B**（例如满 299 送 1 件 B）

* * *

## 先说清楚一个关键限制[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#%E5%85%88%E8%AF%B4%E6%B8%85%E6%A5%9A%E4%B8%80%E4%B8%AA%E5%85%B3%E9%94%AE%E9%99%90%E5%88%B6)

⚠️

Discount Function 能做的是：当 B 已经在购物车里时，把 B 打成 100% 折扣（或部分折扣）。  
如果你希望“满足条件后自动把 B 加进购物车”，要额外配合 Cart Transform Function 或前端购物车逻辑。

所以最稳妥的落地方式一般是：

*   **V1（最快上线）**：用户手动加 B，函数判断命中后自动把 B 变 0 元
*   **V2（完整体验）**：叠加 Cart Transform，命中条件时自动插入 B

* * *

## 方案设计[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#%E6%96%B9%E6%A1%88%E8%AE%BE%E8%AE%A1)

用一套函数同时支持两种规则，配置化管理：

*   `BUY_A_GET_B`：按 A 数量触发，赠送 B
*   `SUBTOTAL_X_GET_B`：按订单小计触发，赠送 B

配置建议放在 discount 的 metafield（JSON），便于运营在 Admin 改规则，不用每次改代码。

示例配置：

```
{
  "mode": "BUY_A_GET_B",
  "qualifierVariantIds": [
    "gid://shopify/ProductVariant/11111111111111"
  ],
  "giftVariantId": "gid://shopify/ProductVariant/22222222222222",
  "buyQuantity": 2,
  "giftQuantity": 1,
  "subtotalThreshold": 29900,
  "message": "买2件A赠1件B"
}
```

说明：

*   `subtotalThreshold` 用最小货币单位（分）更安全
*   `giftVariantId` 必须是具体 variant
*   `qualifierVariantIds` 支持多个 A（多款都可触发）

* * *

## 实现步骤（JavaScript）[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#%E5%AE%9E%E7%8E%B0%E6%AD%A5%E9%AA%A4javascript)

### 步骤1：创建 Discount Function 扩展[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#%E6%AD%A5%E9%AA%A41%E5%88%9B%E5%BB%BA-discount-function-%E6%89%A9%E5%B1%95)

在你的 app 项目里创建扩展（命令以你当前 CLI 版本为准）：

```
shopify app generate extension --template discount --name buy-gift-function
```

生成后会有 `run.js`（或同等入口）与 `shopify.extension.toml`。

### 步骤2：定义输入查询（Input Query）[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#%E6%AD%A5%E9%AA%A42%E5%AE%9A%E4%B9%89%E8%BE%93%E5%85%A5%E6%9F%A5%E8%AF%A2input-query)

你需要在输入里拿到：

*   购物车行（variant id、数量）
*   订单小计
*   discount 的配置 metafield

如果你用 Shopify 生成模板，先在模板 query 基础上补齐以上字段。

### 步骤3：在 run 函数里做规则计算[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#%E6%AD%A5%E9%AA%A43%E5%9C%A8-run-%E5%87%BD%E6%95%B0%E9%87%8C%E5%81%9A%E8%A7%84%E5%88%99%E8%AE%A1%E7%AE%97)

实现核心逻辑：

1.  解析 metafield 配置 JSON
2.  统计 A 在购物车的数量
3.  找到 B 在购物车中的 line
4.  根据模式计算 `eligibleGiftQty`
5.  给 B line 生成 100% 折扣目标（可限制数量）

### 步骤4：返回 discount 结果[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#%E6%AD%A5%E9%AA%A44%E8%BF%94%E5%9B%9E-discount-%E7%BB%93%E6%9E%9C)

只返回命中的折扣；未命中返回空数组。

### 步骤5：本地测试与部署[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#%E6%AD%A5%E9%AA%A45%E6%9C%AC%E5%9C%B0%E6%B5%8B%E8%AF%95%E4%B8%8E%E9%83%A8%E7%BD%B2)

```
shopify app dev
# 验证通过后
shopify app deploy
```

然后在 Admin 创建对应折扣并绑定此 Function。

* * *

## 关键代码（可直接改造成你的 run.js）[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#%E5%85%B3%E9%94%AE%E4%BB%A3%E7%A0%81%E5%8F%AF%E7%9B%B4%E6%8E%A5%E6%94%B9%E9%80%A0%E6%88%90%E4%BD%A0%E7%9A%84-runjs)

下面是逻辑骨架，重点在算法与边界处理。字段名请按你模板生成的类型对齐。

```
/**
 * @param {Object} input
 * @returns {Object}
 */
export function run(input) {
  const configuration = parseConfiguration(input)
  if (!configuration) {
    return emptyResult()
  }
 
  const cartLines = input.cart?.lines ?? []
  const giftLine = findLineByVariantId(cartLines, configuration.giftVariantId)
  if (!giftLine) {
    return emptyResult()
  }
 
  const eligibleGiftQuantity = getEligibleGiftQuantity({
    cartLines,
    configuration,
    cartSubtotalAmount: getCartSubtotalAmount(input)
  })
 
  if (eligibleGiftQuantity <= 0) {
    return emptyResult()
  }
 
  const discountedQuantity = Math.min(eligibleGiftQuantity, giftLine.quantity)
 
  return {
    discountApplicationStrategy: "FIRST",
    discounts: [
      {
        message: configuration.message || "赠品优惠",
        targets: [
          {
            cartLine: {
              id: giftLine.id,
              quantity: discountedQuantity
            }
          }
        ],
        value: {
          percentage: {
            value: "100.0"
          }
        }
      }
    ]
  }
}
 
function getEligibleGiftQuantity({ cartLines, configuration, cartSubtotalAmount }) {
  if (configuration.mode === "BUY_A_GET_B") {
    const qualifierCount = cartLines
      .filter((line) => configuration.qualifierVariantIds.includes(getVariantId(line)))
      .reduce((sum, line) => sum + line.quantity, 0)
 
    if (qualifierCount < configuration.buyQuantity) {
      return 0
    }
 
    const multiplier = Math.floor(qualifierCount / configuration.buyQuantity)
    return multiplier * configuration.giftQuantity
  }
 
  if (configuration.mode === "SUBTOTAL_X_GET_B") {
    if (cartSubtotalAmount < configuration.subtotalThreshold) {
      return 0
    }
 
    return configuration.giftQuantity || 1
  }
 
  return 0
}
 
function parseConfiguration(input) {
  const raw = input.discountNode?.metafield?.value
  if (!raw) {
    return null
  }
 
  try {
    return JSON.parse(raw)
  } catch (_error) {
    return null
  }
}
 
function getCartSubtotalAmount(input) {
  const amountString = input.cart?.cost?.subtotalAmount?.amount || "0"
  const amount = Number(amountString)
  if (Number.isNaN(amount)) {
    return 0
  }
 
  return Math.round(amount * 100)
}
 
function getVariantId(line) {
  return line.merchandise?.id || ""
}
 
function findLineByVariantId(lines, variantId) {
  return lines.find((line) => getVariantId(line) === variantId)
}
 
function emptyResult() {
  return {
    discountApplicationStrategy: "FIRST",
    discounts: []
  }
}
```

* * *

## 两个场景的计算公式[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#%E4%B8%A4%E4%B8%AA%E5%9C%BA%E6%99%AF%E7%9A%84%E8%AE%A1%E7%AE%97%E5%85%AC%E5%BC%8F)

### 1) 买 A 赠 B[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#1-%E4%B9%B0-a-%E8%B5%A0-b)

*   条件：`A 数量 >= buyQuantity`
*   可赠数量：`floor(A数量 / buyQuantity) * giftQuantity`
*   实际折扣数量：`min(可赠数量, 购物车中B数量)`

示例：

*   配置：买 2 赠 1
*   购物车：A=5，B=2
*   可赠：`floor(5/2)*1 = 2`
*   最终：B 的 2 件 100% off

### 2) 满 X 赠 B[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#2-%E6%BB%A1-x-%E8%B5%A0-b)

*   条件：`cartSubtotal >= subtotalThreshold`
*   可赠数量：通常为 1（也可配置）
*   实际折扣数量：`min(可赠数量, 购物车中B数量)`

示例：

*   配置：满 299 赠 1 件 B
*   小计：328，B=1
*   最终：B 的 1 件 100% off

* * *

## Cart Transform Function：自动加赠品的完整实现[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#cart-transform-function%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%B5%A0%E5%93%81%E7%9A%84%E5%AE%8C%E6%95%B4%E5%AE%9E%E7%8E%B0)

🧩

*   Cart Transform：命中规则时自动加 B（或自动同步赠品数量）
*   Discount Function：把 B 打到 0 元或指定折扣
*   两个函数共用一份规则配置，避免口径不一致

职责拆分后更稳定：

*   Cart Transform 解决“有没有 B”
*   Discount Function 解决“B 打几折、打几件”

### 1) 架构与执行顺序（推荐）[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#1-%E6%9E%B6%E6%9E%84%E4%B8%8E%E6%89%A7%E8%A1%8C%E9%A1%BA%E5%BA%8F%E6%8E%A8%E8%8D%90)

1.  用户加购 A 或达到满 X
2.  Cart Transform 判断是否命中规则
3.  命中则新增/调整赠品 B 的 cart line（打标记）
4.  Discount Function 识别 B line 并打 100% 折扣
5.  用户删减 A 或小计回落时，Transform 同步移除或降级 B

建议在赠品 line 上写一个 attribute，例如：

*   key: `_auto_gift`
*   value: `true`

这样你可以区分「系统自动加的赠品」和「用户主动买的同款 B」。

### 2) 生成 Cart Transform 扩展[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#2-%E7%94%9F%E6%88%90-cart-transform-%E6%89%A9%E5%B1%95)

```
shopify app generate extension --template cart_transform --name auto-gift-transform
```

你需要在输入里至少拿到：

*   `cart.lines`（id、quantity、merchandise.id、attributes）
*   `cart.cost.subtotalAmount.amount`
*   transform 规则配置（建议也是 JSON metafield）

### 3) Transform 规则配置（与折扣函数一致）[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#3-transform-%E8%A7%84%E5%88%99%E9%85%8D%E7%BD%AE%E4%B8%8E%E6%8A%98%E6%89%A3%E5%87%BD%E6%95%B0%E4%B8%80%E8%87%B4)

建议直接复用 discount 的配置字段，或者维护一份共享配置对象，避免出现：

*   Transform 判断是「买2送1」
*   Discount 判断是「买3送1」

这种错配会导致购物车反复抖动。

### 4) Cart Transform 核心代码骨架（自动增删赠品）[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#4-cart-transform-%E6%A0%B8%E5%BF%83%E4%BB%A3%E7%A0%81%E9%AA%A8%E6%9E%B6%E8%87%AA%E5%8A%A8%E5%A2%9E%E5%88%A0%E8%B5%A0%E5%93%81)

> 字段名按你当前模板生成结果对齐，下面重点是算法与防重复策略

```
export function run(input) {
  const configuration = parseConfiguration(input)
  if (!configuration) {
    return { operations: [] }
  }
 
  const lines = input.cart?.lines ?? []
  const cartSubtotalAmount = getCartSubtotalAmount(input)
  const eligibleGiftQuantity = getEligibleGiftQuantity({
    cartLines: lines,
    configuration,
    cartSubtotalAmount
  })
 
  const autoGiftLines = findAutoGiftLines(lines, configuration.giftVariantId)
  const currentAutoGiftQty = autoGiftLines.reduce((sum, line) => sum + line.quantity, 0)
 
  if (eligibleGiftQuantity === currentAutoGiftQty) {
    return { operations: [] }
  }
 
  if (eligibleGiftQuantity <= 0) {
    return {
      operations: autoGiftLines.map((line) => ({
        lineRemove: {
          cartLineId: line.id,
          quantity: line.quantity
        }
      }))
    }
  }
 
  if (autoGiftLines.length === 0) {
    return {
      operations: [
        {
          lineAdd: {
            merchandiseId: configuration.giftVariantId,
            quantity: eligibleGiftQuantity,
            attributes: [{ key: "_auto_gift", value: "true" }]
          }
        }
      ]
    }
  }
 
  const firstGiftLine = autoGiftLines[0]
  return {
    operations: [
      {
        lineUpdate: {
          cartLineId: firstGiftLine.id,
          quantity: eligibleGiftQuantity,
          attributes: [{ key: "_auto_gift", value: "true" }]
        }
      }
    ]
  }
}
 
function findAutoGiftLines(lines, giftVariantId) {
  return lines.filter((line) => {
    const isGiftVariant = line.merchandise?.id === giftVariantId
    if (!isGiftVariant) {
      return false
    }
 
    const attributes = line.attributes ?? []
    return attributes.some((item) => item.key === "_auto_gift" && item.value === "true")
  })
}
 
function parseConfiguration(input) {
  const raw = input.cartTransform?.metafield?.value
  if (!raw) {
    return null
  }
 
  try {
    return JSON.parse(raw)
  } catch (_error) {
    return null
  }
}
 
function getCartSubtotalAmount(input) {
  const amount = Number(input.cart?.cost?.subtotalAmount?.amount ?? "0")
  if (Number.isNaN(amount)) {
    return 0
  }
 
  return Math.round(amount * 100)
}
```

### 5) Discount Function 如何配合 Transform[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#5-discount-function-%E5%A6%82%E4%BD%95%E9%85%8D%E5%90%88-transform)

如果你不做标记区分，可能会出现一个副作用：  
用户自己加购 B 也被当赠品打 100% off。

建议在 Discount Function 中增加一个过滤：

1.  只给带 `_auto_gift=true` 的 B line 打折
2.  用户主动购买的 B 不参与赠品折扣
3.  多个 B line 时，仅处理自动赠品 line

代码思路（伪代码）：

```
const giftLine = cartLines.find((line) => {
  const isGiftVariant = getVariantId(line) === configuration.giftVariantId
  const isAutoGift = (line.attributes ?? []).some(
    (item) => item.key === "_auto_gift" && item.value === "true"
  )
  return isGiftVariant && isAutoGift
})
```

### 6) 防循环与防抖动（非常关键）[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#6-%E9%98%B2%E5%BE%AA%E7%8E%AF%E4%B8%8E%E9%98%B2%E6%8A%96%E5%8A%A8%E9%9D%9E%E5%B8%B8%E5%85%B3%E9%94%AE)

Cart Transform 每次购物车变化都可能重新触发，必须保证幂等：

*   目标数量与当前自动赠品数量相同 → `operations: []`
*   未命中时只删 `_auto_gift=true` 的 line，不删用户手动购买行
*   命中时优先 `lineUpdate` 已有赠品行，而不是每次先删后加

如果不做这些，会出现：

*   购物车闪烁
*   赠品重复新增
*   用户手动购买 B 被误删

### 7) 场景规则建议（运营更好理解）[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#7-%E5%9C%BA%E6%99%AF%E8%A7%84%E5%88%99%E5%BB%BA%E8%AE%AE%E8%BF%90%E8%90%A5%E6%9B%B4%E5%A5%BD%E7%90%86%E8%A7%A3)

*   买 A 赠 B：阶梯默认 `floor(A / buyQty) * giftQty`
*   满 X 赠 B：默认只赠 1 件，除非明确做阶梯满赠
*   赠品建议设为不可单独购买（或通过前端提示区分）

### 8) 联调清单（Transform + Discount）[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#8-%E8%81%94%E8%B0%83%E6%B8%85%E5%8D%95transform--discount)

上线前建议按这个顺序验：

1.  仅开 Transform，不开 Discount：确认赠品会正确增删
2.  再开 Discount：确认只有自动赠品 line 被打折
3.  测 A 增减、B 手动删除、地址/运费变化导致小计变化
4.  验证多币种和税前税后口径是否与你门槛定义一致

### 9) 文档入口[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#9-%E6%96%87%E6%A1%A3%E5%85%A5%E5%8F%A3)

*   [Cart Transform Function API](https://shopify.dev/docs/api/functions/reference/cart-transform) 
*   [Build a discount function (JavaScript)](https://shopify.dev/docs/apps/build/discounts/build-discount-function?extension=javascript) 

* * *

## 测试用例清单（上线前至少覆盖）[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B%E6%B8%85%E5%8D%95%E4%B8%8A%E7%BA%BF%E5%89%8D%E8%87%B3%E5%B0%91%E8%A6%86%E7%9B%96)

*   A 未达门槛，不应出现赠品折扣
*   A 达门槛但 B 未加购物车，不应打折（V1 方案）
*   A 超门槛时，B 折扣数量按阶梯正确计算
*   满 X 边界值（刚好等于 X）要命中
*   多币种时，小计单位换算正确
*   折扣与其他活动叠加规则符合你的策略

* * *

## Admin 侧创建折扣的建议[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#admin-%E4%BE%A7%E5%88%9B%E5%BB%BA%E6%8A%98%E6%89%A3%E7%9A%84%E5%BB%BA%E8%AE%AE)

1.  给折扣命名时加上规则后缀（如 `B2G1-GIFT-B`、`SUB299-GIFT-B`）
2.  把配置 JSON 与活动文案同步维护
3.  活动结束后及时停用，避免遗留命中
4.  在商品页/购物车显式提示「赠品需加入购物车」或启用自动加赠

* * *

## 常见坑位[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#%E5%B8%B8%E8%A7%81%E5%9D%91%E4%BD%8D)

*   **坑1：** 用 Product ID 而不是 Variant ID，导致匹配失败
*   **坑2：** 金额用浮点比较，边界误差导致满减判断抖动
*   **坑3：** 忘记限制折扣数量，导致 B 全部免单
*   **坑4：** 未考虑和其他自动折扣叠加策略
*   **坑5：** 活动文案说“自动赠送”，但实际没有自动加 B

* * *

## 多商户 App：购物车 Widget 怎么装进客户店铺[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#%E5%A4%9A%E5%95%86%E6%88%B7-app%E8%B4%AD%E7%89%A9%E8%BD%A6-widget-%E6%80%8E%E4%B9%88%E8%A3%85%E8%BF%9B%E5%AE%A2%E6%88%B7%E5%BA%97%E9%93%BA)

买赠的「算价、加行」靠 **Functions**；**提示条、进度条、还差多少送 B** 这类 UI，通常用 **店面上的购物车 Widget** 完成。作为要装在很多客户店里的 App，**不要**指望给每家改 Liquid 源码，应走 **Theme App Extension（主题应用扩展）**，由商家在主题编辑器里 **一键开启或拖一个区块**。

### 1) 推荐形态：Theme App Extension[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#1-%E6%8E%A8%E8%8D%90%E5%BD%A2%E6%80%81theme-app-extension)

在 App 里新增扩展：`theme-app-extension/`（Shopify CLI 可生成）。常见两种用法：

| 形态 | 适合做什么 | 商家操作 |
| --- | --- | --- |
| App embed（应用嵌入） | 全店浮层、固定角落小部件、全局注入一段 JS/CSS（监听 /cart.js、展示进度） | 主题编辑器 → 应用嵌入 → 打开你的 App、保存 |
| App block（应用区块） | 要出现在 购物车页 / 购物车抽屉 Section 里的结构化 UI | 在对应模板里 添加区块 → 选你的 App 区块 → 调整顺序并保存 |

官方概念与能力见：[Theme app extensions](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions) 。

**和 Functions 的关系（分工）：**

*   **Widget**：只负责展示与交互（例如「再凑 ¥xx 送 B」），必要时调 **Storefront API** 或 **Cart AJAX** 刷新购物车
*   **Cart Transform / Discount Function**：负责 **加赠品行、改价**；Widget **不应**假装自己是唯一真相源，避免和后台规则打架

### 2) 多客户适配时建议怎么做[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#2-%E5%A4%9A%E5%AE%A2%E6%88%B7%E9%80%82%E9%85%8D%E6%97%B6%E5%BB%BA%E8%AE%AE%E6%80%8E%E4%B9%88%E5%81%9A)

1.  **默认用 App embed 做 MVP**  
    不依赖每家主题的「购物车抽屉」DOM 结构，用 **固定位置** 或 **Portal 到 body** 的容器，冲突最少。
    
2.  **进阶再提供 App block**  
    给使用 **Online Store 2.0**、且愿意把区块放进购物车 Section 的商家，体验更「原生」。
    
3.  **在数据库里记每家店的启用状态**  
    例如：`shop_domain`、`app_embed_enabled`、`theme_block_configured_at`，安装向导里根据状态显示「去主题编辑器开启嵌入」按钮。
    
4.  **用深链把商家带到正确页面**（减少客服成本）  
    App 后台里放「在主题中启用」按钮，链到主题编辑器里 **应用嵌入** 或 **对应模板** 的编辑界面（具体 URL 形态随 Shopify 后台版本可能调整，以当前 [App Bridge / 主题编辑器深链文档](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions)  为准）。
    
5.  **样式隔离**  
    Widget 根节点用 **唯一前缀 class**（如 `myapp-gift-widget`），尽量 **少覆盖** 主题全局样式；主题变量能读则读，读不到则用自有设计 token。
    
6.  **结账页**  
    **传统结账页**不能随意塞第三方任意 HTML Widget；若必须在结账展示信息，要走 **Checkout UI Extension**（能力、位置受平台约束）。购物车页 / 抽屉与结账是两套能力，产品上要分开承诺。
    

### 3) 不推荐或仅作兜底[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#3-%E4%B8%8D%E6%8E%A8%E8%8D%90%E6%88%96%E4%BB%85%E4%BD%9C%E5%85%9C%E5%BA%95)

*   **ScriptTag 往全站注入脚本**：已逐步被更可控的扩展方式替代，多主题、CSP、性能都不好控，**仅适合极老主题或临时迁移**。新 App 应优先 Theme App Extension。

### 4) 上架与文档要给商家写清的三句话[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#4-%E4%B8%8A%E6%9E%B6%E4%B8%8E%E6%96%87%E6%A1%A3%E8%A6%81%E7%BB%99%E5%95%86%E5%AE%B6%E5%86%99%E6%B8%85%E7%9A%84%E4%B8%89%E5%8F%A5%E8%AF%9D)

1.  本 App 的 Widget 通过 **应用嵌入** 启用，不修改主题代码
2.  若希望区块出现在购物车区域，请在 **购物车模板 / 抽屉 Section** 中添加 **本 App 区块**（OS 2.0）
3.  买赠是否生效以 **后台折扣 / Functions 配置** 为准，Widget 仅为提示与辅助

* * *

## 相关文档[](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift#%E7%9B%B8%E5%85%B3%E6%96%87%E6%A1%A3)

*   [Shopify应用开发](https://shopify.baoea.com/advanced/shopify-app-development)
*   [Shopify AI Toolkit 指南](https://shopify.baoea.com/advanced/shopify-ai-toolkit)
*   [Shopify买X得Y折扣设置完整指南](https://shopify.baoea.com/basic/shopify-buy-x-get-y-discount)
*   [Build a discount function (JavaScript)](https://shopify.dev/docs/apps/build/discounts/build-discount-function?extension=javascript)
