---
source_url: "https://shopify.baoea.com/advanced/shopify-scripts"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:41:40"
fetch_method: "http"
content_hash: "e4aa9055508cf763438c614142e9916ec0cdbe37999f42dad12c247d978f8e8b"
discovered_via: ["sitemap", "internal_link"]
---
## Shopify Scripts 与 Functions 迁移

Shopify Scripts 是 Shopify Plus 专属的可编程能力，用 Ruby 编写，控制购物车、运费、支付的自定义逻辑。**Shopify 已宣布 2024 年 8 月 28 日彻底停用 Scripts**，全面迁移到新一代 **Shopify Functions**。

本文按”Scripts 历史能力 → Functions 替代方案 → Flow 自动化 → 三者协同”展开。如果你仍在维护未迁移的 Scripts 项目，本文的 Functions 部分尤其需要重点关注。

## 一、Scripts 的三类用途与历史现状[](https://shopify.baoea.com/advanced/shopify-scripts#%E4%B8%80scripts-%E7%9A%84%E4%B8%89%E7%B1%BB%E7%94%A8%E9%80%94%E4%B8%8E%E5%8E%86%E5%8F%B2%E7%8E%B0%E7%8A%B6)

Scripts 历史上分三类：

| 类型 | 用途 | 示例 |
| --- | --- | --- |
| Line Item Scripts | 修改商品价格、折扣 | 满 3 件 9 折 |
| Shipping Scripts | 动态调整运费 | VIP 客户免运费 |
| Payment Scripts | 控制支付方式可用性 | 高客单单隐藏 COD |

**重要时间线**：

*   2023 年 6 月：Shopify 宣布 Scripts 进入 Sunset
*   2024 年 8 月 28 日：Scripts 完全停用，新功能开发禁止使用
*   2024 年 8 月 28 日后：旧 Scripts 不再生效，必须迁移到 Functions

如果你的店铺仍依赖 Scripts，**立即开始迁移**——否则相关业务逻辑会失效。

## 二、Shopify Functions 概述[](https://shopify.baoea.com/advanced/shopify-scripts#%E4%BA%8Cshopify-functions-%E6%A6%82%E8%BF%B0)

Functions 是 Scripts 的现代化替代品：

*   **不限 Plus**：所有 Shopify 套餐都可用（但开发能力门槛较高）
*   **服务器端运行**：Shopify 服务器上执行，零客户端性能影响
*   **多语言**：支持 Rust、TypeScript、JavaScript、AssemblyScript
*   **更细粒度**：分多个 API 类别，每类有明确的输入输出契约

### Functions API 类别[](https://shopify.baoea.com/advanced/shopify-scripts#functions-api-%E7%B1%BB%E5%88%AB)

| API | 替代 Scripts | 用途 |
| --- | --- | --- |
| Cart Transform | Line Item Scripts（部分） | 修改购物车显示与价格 |
| Product Discount / Order Discount / Shipping Discount | Line Item Scripts（折扣部分） | 应用动态折扣 |
| Delivery Customization | Shipping Scripts | 修改、隐藏、排序配送选项 |
| Payment Customization | Payment Scripts | 修改、隐藏、排序支付方式 |
| Cart Checkout Validation | 新功能 | 拒绝违反规则的购物车 |
| Fulfillment Constraints | 新功能 | 自定义履约规则 |
| Order Routing Location Rule | 新功能 | 订单路由到指定仓库 |
| Local Pickup Delivery | 新功能 | 本地自提点 |
| Pickup Point Delivery | 新功能 | 智能柜 / 自提点 |

### 开发流程[](https://shopify.baoea.com/advanced/shopify-scripts#%E5%BC%80%E5%8F%91%E6%B5%81%E7%A8%8B)

```
# 1. 用 Shopify CLI 创建 Function
shopify app generate extension --type product_discount
 
# 2. 在生成的 src/ 目录编写逻辑
# (Rust 推荐，性能最优；TypeScript 易上手)
 
# 3. 本地测试
shopify app dev
 
# 4. 部署
shopify app deploy
```

### Function 项目结构（Rust 示例）[](https://shopify.baoea.com/advanced/shopify-scripts#function-%E9%A1%B9%E7%9B%AE%E7%BB%93%E6%9E%84rust-%E7%A4%BA%E4%BE%8B)

```
my-discount-function/
├── shopify.function.toml      # 配置
├── input.graphql              # 定义输入数据
├── src/
│   └── main.rs                # 核心逻辑
├── Cargo.toml                 # Rust 依赖
└── README.md
```

## 三、典型场景迁移[](https://shopify.baoea.com/advanced/shopify-scripts#%E4%B8%89%E5%85%B8%E5%9E%8B%E5%9C%BA%E6%99%AF%E8%BF%81%E7%A7%BB)

### 场景 1：满 N 件 9 折[](https://shopify.baoea.com/advanced/shopify-scripts#%E5%9C%BA%E6%99%AF-1%E6%BB%A1-n-%E4%BB%B6-9-%E6%8A%98)

**Scripts（旧，Ruby）**：

```
# Line Item Script
if Input.cart.line_items.size >= 3
  Input.cart.line_items.each do |line_item|
    line_item.change_line_price(
      line_item.line_price * 0.9,
      message: "满 3 件 9 折"
    )
  end
end
Output.cart = Input.cart
```

**Functions（新，Rust）**：

```
use shopify_function::prelude::*;
 
#[shopify_function]
fn function(input: schema::FunctionRunInput) -> Result<schema::FunctionRunResult> {
    let total_quantity: i32 = input
        .cart
        .lines
        .iter()
        .map(|line| line.quantity)
        .sum();
 
    if total_quantity < 3 {
        return Ok(schema::FunctionRunResult { discounts: vec![] });
    }
 
    let targets = input
        .cart
        .lines
        .iter()
        .map(|line| schema::Target {
            cart_line: Some(schema::CartLineTarget {
                id: line.id.clone(),
                quantity: None,
            }),
            ..Default::default()
        })
        .collect();
 
    Ok(schema::FunctionRunResult {
        discounts: vec![schema::Discount {
            message: Some("满 3 件 9 折".to_string()),
            value: schema::Value::Percentage(schema::Percentage { value: dec!(10) }),
            targets,
            conditions: None,
        }],
    })
}
```

更复杂但更灵活。开发时间约 4-8 工时（首次），熟练后 1-2 小时。

### 场景 2：VIP 客户免运费[](https://shopify.baoea.com/advanced/shopify-scripts#%E5%9C%BA%E6%99%AF-2vip-%E5%AE%A2%E6%88%B7%E5%85%8D%E8%BF%90%E8%B4%B9)

**Scripts（旧）**：

```
if Input.cart.customer && Input.cart.customer.tags.include?("VIP")
  Input.shipping_rates.each do |rate|
    rate.apply_discount(rate.price, message: "VIP 免运费")
  end
end
Output.shipping_rates = Input.shipping_rates
```

**Functions（Delivery Customization）**：

```
export function run(input) {
  const isVIP = input.cart.buyerIdentity?.customer?.hasAnyTag === true;
 
  if (!isVIP) {
    return { operations: [] };
  }
 
  return {
    operations: input.cart.deliveryGroups.flatMap(group =>
      group.deliveryOptions.map(option => ({
        rename: {
          deliveryOptionHandle: option.handle,
          title: `免费配送（VIP 福利）`
        }
      }))
    )
  };
}
```

注意：**Delivery Customization 不能直接改运费金额到零**（这是限制）。要实现免运费需要在折扣 Function 中做 Shipping Discount。

### 场景 3：高客单隐藏 COD[](https://shopify.baoea.com/advanced/shopify-scripts#%E5%9C%BA%E6%99%AF-3%E9%AB%98%E5%AE%A2%E5%8D%95%E9%9A%90%E8%97%8F-cod)

**Scripts（旧）**：

```
if Input.cart.subtotal_price > Money.new(cents: 50000)
  Output.payment_gateways = Input.payment_gateways.reject do |gateway|
    gateway.name.downcase.include?("cash on delivery")
  end
end
```

**Functions（Payment Customization）**：

```
export function run(input) {
  const subtotalCents = parseFloat(input.cart.cost.subtotalAmount.amount) * 100;
 
  if (subtotalCents <= 50000) {
    return { operations: [] };
  }
 
  const codPaymentMethod = input.paymentMethods.find(pm =>
    pm.name.toLowerCase().includes('cash on delivery')
  );
 
  if (!codPaymentMethod) {
    return { operations: [] };
  }
 
  return {
    operations: [{
      hide: { paymentMethodId: codPaymentMethod.id }
    }]
  };
}
```

## 四、Shopify Flow[](https://shopify.baoea.com/advanced/shopify-scripts#%E5%9B%9Bshopify-flow)

Flow 是 Shopify 自家的低代码自动化工具——基于”触发器 + 条件 + 动作”的工作流引擎。**2024 年起向所有 Shopify 套餐开放**（之前仅 Plus）。

### Flow 与 Functions 的区别[](https://shopify.baoea.com/advanced/shopify-scripts#flow-%E4%B8%8E-functions-%E7%9A%84%E5%8C%BA%E5%88%AB)

| 维度 | Flow | Functions |
| --- | --- | --- |
| 用户类型 | 运营 / 业务 | 开发者 |
| 开发方式 | 可视化 + 表达式 | 代码（Rust / JS） |
| 执行时机 | 事件触发后异步 | 同步在结账流程中 |
| 用途 | 工作流自动化 | 业务规则定制 |
| 例子 | 高客单订单 Slack 通知 | 高客单隐藏 COD |

简单理解：**Flow 改”流程”，Functions 改”价格 / 运费 / 支付”**。两者不冲突，互相配合使用。

### Flow 常用模板[](https://shopify.baoea.com/advanced/shopify-scripts#flow-%E5%B8%B8%E7%94%A8%E6%A8%A1%E6%9D%BF)

**模板 1：高价值订单通知**

```
触发：Order Created
条件：Order.totalPriceSet > $500
动作：Send Slack message to #vip-orders
```

**模板 2：客户分群标签**

```
触发：Customer's order count changes
条件：Customer.totalSpent > $1000
动作：Tag customer with "vip"
```

**模板 3：库存预警**

```
触发：Inventory level changes
条件：Variant.inventoryQuantity < 10
动作：Send email to ops@yourstore.com
```

**模板 4：拒付订单自动处理**

```
触发：Order risk analysis
条件：Order.riskLevel = "high"
动作：
  - Cancel order
  - Refund payment
  - Tag customer "high-risk"
```

详细 Flow 实战见 [营销自动化指南](https://shopify.baoea.com/advanced/marketing-automation) 与 [运营管理优化](https://shopify.baoea.com/advanced/operation-optimization)。

## 五、第三方自动化工具协同[](https://shopify.baoea.com/advanced/shopify-scripts#%E4%BA%94%E7%AC%AC%E4%B8%89%E6%96%B9%E8%87%AA%E5%8A%A8%E5%8C%96%E5%B7%A5%E5%85%B7%E5%8D%8F%E5%90%8C)

Flow + Functions 之外，第三方工具填补不同场景：

### Zapier[](https://shopify.baoea.com/advanced/shopify-scripts#zapier)

跨工具自动化，Shopify 与外部系统联动：

*   Shopify 订单 → QuickBooks 财务
*   Shopify 客户 → HubSpot CRM
*   客服邮件 → Slack 通知

价格：$20-$600/月。

### Make（Integromat）[](https://shopify.baoea.com/advanced/shopify-scripts#makeintegromat)

类似 Zapier 但更复杂可视化逻辑，价格更亲民：$9-$100/月。

### n8n[](https://shopify.baoea.com/advanced/shopify-scripts#n8n)

开源自部署版本。完全可控，运行成本仅服务器开销（约 $5-20/月）。学习曲线陡。

### 选型决策[](https://shopify.baoea.com/advanced/shopify-scripts#%E9%80%89%E5%9E%8B%E5%86%B3%E7%AD%96)

| 场景 | 推荐 |
| --- | --- |
| 店内业务规则 | Shopify Flow |
| Cart / Checkout / Delivery 定制 | Shopify Functions |
| 多工具协同 | Zapier 或 Make |
| 高频复杂工作流 | n8n（自部署） |

## 六、迁移到 Functions 的项目流程[](https://shopify.baoea.com/advanced/shopify-scripts#%E5%85%AD%E8%BF%81%E7%A7%BB%E5%88%B0-functions-%E7%9A%84%E9%A1%B9%E7%9B%AE%E6%B5%81%E7%A8%8B)

### Step 1：盘点现有 Scripts[](https://shopify.baoea.com/advanced/shopify-scripts#step-1%E7%9B%98%E7%82%B9%E7%8E%B0%E6%9C%89-scripts)

Shopify 后台 → Apps → Script Editor → 导出所有 Scripts 代码。

按用途分类：

*   折扣类（多数项目主体）
*   运费类
*   支付类

### Step 2：选择 Functions API[](https://shopify.baoea.com/advanced/shopify-scripts#step-2%E9%80%89%E6%8B%A9-functions-api)

每个 Script 对应一个或多个 Function API：

| 原 Scripts | 新 Functions |
| --- | --- |
| 商品价格折扣 | Product Discount Function |
| 订单整体折扣 | Order Discount Function |
| 运费打折 | Shipping Discount Function |
| 修改 / 隐藏配送方式 | Delivery Customization |
| 修改 / 隐藏支付方式 | Payment Customization |

### Step 3：设计[](https://shopify.baoea.com/advanced/shopify-scripts#step-3%E8%AE%BE%E8%AE%A1)

写每个 Function 的输入输出契约。GraphQL Schema 由 Shopify 提供，你只需定义 input.graphql。

### Step 4：开发 + 测试[](https://shopify.baoea.com/advanced/shopify-scripts#step-4%E5%BC%80%E5%8F%91--%E6%B5%8B%E8%AF%95)

*   Shopify CLI 本地生成项目
*   本地用 `shopify app dev` 测试
*   真实订单验证（用 dev store）

### Step 5：部署上线[](https://shopify.baoea.com/advanced/shopify-scripts#step-5%E9%83%A8%E7%BD%B2%E4%B8%8A%E7%BA%BF)

*   `shopify app deploy` 推送代码
*   Shopify 后台关联到具体 Discount / Customization
*   灰度切换（先 10% 流量，观察 48 小时）
*   完成切换后关停旧 Scripts

### Step 6：监控[](https://shopify.baoea.com/advanced/shopify-scripts#step-6%E7%9B%91%E6%8E%A7)

部署后监控：

*   Function 执行成功率（Shopify Partner 后台可查）
*   错误日志（Function 执行报错会被记录）
*   业务指标（如折扣覆盖率、运费应用率）

## 七、Functions 的局限[](https://shopify.baoea.com/advanced/shopify-scripts#%E4%B8%83functions-%E7%9A%84%E5%B1%80%E9%99%90)

不是所有 Scripts 逻辑都能迁移：

### 限制 1：执行时间上限[](https://shopify.baoea.com/advanced/shopify-scripts#%E9%99%90%E5%88%B6-1%E6%89%A7%E8%A1%8C%E6%97%B6%E9%97%B4%E4%B8%8A%E9%99%90)

每个 Function 最多 5ms 执行时间。复杂逻辑可能触顶。

### 限制 2：网络访问[](https://shopify.baoea.com/advanced/shopify-scripts#%E9%99%90%E5%88%B6-2%E7%BD%91%E7%BB%9C%E8%AE%BF%E9%97%AE)

Functions 无法发起 HTTP 请求。需要外部数据时只能通过 input 预先传入（如客户 metafield）。

### 限制 3：数据访问范围[](https://shopify.baoea.com/advanced/shopify-scripts#%E9%99%90%E5%88%B6-3%E6%95%B0%E6%8D%AE%E8%AE%BF%E9%97%AE%E8%8C%83%E5%9B%B4)

每类 Function 能访问的数据有 schema 限制。例如 Delivery Customization 看不到客户订单历史。

### 限制 4：并发限制[](https://shopify.baoea.com/advanced/shopify-scripts#%E9%99%90%E5%88%B6-4%E5%B9%B6%E5%8F%91%E9%99%90%E5%88%B6)

每店每分钟 Function 执行次数有上限。高并发店铺需要优化。

## 八、避免的常见错误[](https://shopify.baoea.com/advanced/shopify-scripts#%E5%85%AB%E9%81%BF%E5%85%8D%E7%9A%84%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF)

### 错误 1：仍在 Scripts 上加新功能[](https://shopify.baoea.com/advanced/shopify-scripts#%E9%94%99%E8%AF%AF-1%E4%BB%8D%E5%9C%A8-scripts-%E4%B8%8A%E5%8A%A0%E6%96%B0%E5%8A%9F%E8%83%BD)

Scripts 已停用，**任何新需求都应该用 Functions 实现**。

### 错误 2：用 Function 做”非业务规则”事情[](https://shopify.baoea.com/advanced/shopify-scripts#%E9%94%99%E8%AF%AF-2%E7%94%A8-function-%E5%81%9A%E9%9D%9E%E4%B8%9A%E5%8A%A1%E8%A7%84%E5%88%99%E4%BA%8B%E6%83%85)

Functions 适合”基于输入返回规则结果”的逻辑。**不适合**：

*   调外部 API
*   发邮件 / 通知
*   写入数据库

这些用 Flow 或 Webhook 实现。

### 错误 3：Function 逻辑过于复杂[](https://shopify.baoea.com/advanced/shopify-scripts#%E9%94%99%E8%AF%AF-3function-%E9%80%BB%E8%BE%91%E8%BF%87%E4%BA%8E%E5%A4%8D%E6%9D%82)

5ms 执行限制让复杂逻辑可能超时。如果逻辑复杂，考虑预计算（如把客户标签 / 分级提前算好存到 metafield）。

### 错误 4：忽视测试环境[](https://shopify.baoea.com/advanced/shopify-scripts#%E9%94%99%E8%AF%AF-4%E5%BF%BD%E8%A7%86%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83)

Function 上线后影响真实结账。**必须在 dev store 充分测试**。

### 错误 5：试图同时改多个 Function[](https://shopify.baoea.com/advanced/shopify-scripts#%E9%94%99%E8%AF%AF-5%E8%AF%95%E5%9B%BE%E5%90%8C%E6%97%B6%E6%94%B9%E5%A4%9A%E4%B8%AA-function)

多个 Function 同时改动 → 出问题难以归因。**一个 Function 验证稳定后再启用下一个**。

## 九、相关教程[](https://shopify.baoea.com/advanced/shopify-scripts#%E4%B9%9D%E7%9B%B8%E5%85%B3%E6%95%99%E7%A8%8B)

*   [Shopify Discount Function 买赠实现](https://shopify.baoea.com/advanced/shopify-discount-function-buy-gift)
*   [Shopify Flow 详细使用](https://shopify.baoea.com/advanced/marketing-automation)
*   [Shopify Plus 完整功能指南](https://shopify.baoea.com/advanced/shopify-plus)
*   [Shopify API 深度应用](https://shopify.baoea.com/advanced/shopify-api-advanced)
*   [Shopify Webhook 开发](https://shopify.baoea.com/advanced/shopify-webhooks-guide)
*   [Shopify Functions 官方文档](https://shopify.dev/docs/api/functions) 
*   [Shopify Functions 学习中心](https://shopify.dev/docs/apps/functions) 
*   [Shopify Flow 官方页面](https://www.shopify.com/flow) 
*   [Scripts 退役公告](https://shopify.dev/changelog/scripts-sunset)
