---
source_url: "https://shopify.baoea.com/advanced/shopify-line-restock-notification"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:41:32"
fetch_method: "http"
content_hash: "6fc447ee9aff57fd71ee78cbf176e9de68d7d00caaf4561a264166a96f12fab0"
discovered_via: ["sitemap", "internal_link"]
---
## Shopify LINE 到货通知实现指南

**LINE 到货通知**（Back in Stock via LINE）在台湾、日本、泰国市场是显著高于 Email 转化的渠道——LINE 消息打开率通常 70%+，Email 在同区段仅 20–30%。但 Shopify 官方没有原生 LINE 集成，需要自行接入 LINE Messaging API + 库存监听。

本文给出一个**完整可落地**的实现方案：前端订阅表单 → 数据存储 → 库存监听 → LINE 推送 → 防骚扰。代码示例可直接复制改造。

> **写在前面**：如果你**面向欧美市场**，建议先评估 Email / SMS 渠道（Klaviyo、Postscript），LINE 在欧美几乎没有用户基数。LINE 路径**只在亚太特定市场才值得投入开发**。

### 渠道对比速查[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#%E6%B8%A0%E9%81%93%E5%AF%B9%E6%AF%94%E9%80%9F%E6%9F%A5)

| 渠道 | 适合市场 | 打开率 | 实现难度 | 单次成本 |
| --- | --- | --- | --- | --- |
| LINE | 台湾、日本、泰国、印尼 | 70–85% | 中（需 Messaging API） | 按消息计费，月活 $0.X |
| Email | 全球通用 | 20–35% | 低（Shopify 自带 + Klaviyo） | 接近 0 |
| SMS | 北美、东南亚 | 90%+ | 中 | 较高（$0.01–$0.05 / 条） |
| WhatsApp | 拉美、中东、印度 | 80%+ | 中（需 Business API） | 按对话计费 |
| Web Push | 全球 | 5–15% | 低（Shopify App） | 0 |

**LINE 不是万能解**——在面向多市场的店铺里，**优先按访客地区分流**：台日访客显示 LINE 订阅，其他地区显示 Email。

* * *

## ✅ 目标功能[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#-%E7%9B%AE%E6%A0%87%E5%8A%9F%E8%83%BD)

让客户在商品售罄时，输入 LINE ID 或授权 LINE Login，当商品补货时，自动通过 LINE 消息通知客户。

* * *

## 方案实现流程[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#%E6%96%B9%E6%A1%88%E5%AE%9E%E7%8E%B0%E6%B5%81%E7%A8%8B)

### 一、准备工具和条件[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#%E4%B8%80%E5%87%86%E5%A4%87%E5%B7%A5%E5%85%B7%E5%92%8C%E6%9D%A1%E4%BB%B6)

| 项目 | 工具或服务 |
| --- | --- |
| 客户订阅表单 | Shopify前端自定义代码 |
| 通知发送 | LINE 官方账号（Messaging API） |
| 数据存储 | Shopify metafield / Shopify app / 外部数据库 |
| 通知触发 | Shopify Flow / Shopify App / 自建Webhook逻辑 |

* * *

## 二、设置 LINE 官方账号 & Messaging API[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#%E4%BA%8C%E8%AE%BE%E7%BD%AE-line-%E5%AE%98%E6%96%B9%E8%B4%A6%E5%8F%B7--messaging-api)

### 1\. 创建 LINE 官方账号[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#1-%E5%88%9B%E5%BB%BA-line-%E5%AE%98%E6%96%B9%E8%B4%A6%E5%8F%B7)

1.  访问 [LINE Business Manager](https://manager.line.biz/) 
2.  创建新的商业账号
3.  完成账号验证

### 2\. 设置 Messaging API[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#2-%E8%AE%BE%E7%BD%AE-messaging-api)

1.  在 LINE Developers Console 创建新的 Provider
2.  创建”Messaging API”频道
3.  获取重要信息：
    *   **Channel ID**
    *   **Channel Secret**
    *   **Access Token**

### 3\. 配置 Webhook[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#3-%E9%85%8D%E7%BD%AE-webhook)

```
# Webhook URL 示例
https://your-app.herokuapp.com/webhook/line
```

* * *

### 1\. 添加订阅表单到商品页面[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#1-%E6%B7%BB%E5%8A%A0%E8%AE%A2%E9%98%85%E8%A1%A8%E5%8D%95%E5%88%B0%E5%95%86%E5%93%81%E9%A1%B5%E9%9D%A2)

在 `sections/product-form.liquid` 或相关模板中添加：

```
<!-- 缺货时显示的 LINE 订阅表单 -->
{% unless current_variant.available %}
<div id="line-restock-notification" class="restock-form">
  <h3>📢 商品补货通知</h3>
  <p>此商品暂时缺货，订阅 LINE 通知，补货时第一时间告知您！</p>
 
  <div class="line-subscription-form">
    <input
      type="text"
      id="line-id-input"
      placeholder="请输入您的 LINE ID"
      class="form-input"
    />
    <button
      onclick="subscribeLine()"
      class="btn btn-primary"
      id="subscribe-btn"
    >
      订阅到货通知
    </button>
  </div>
 
  <div id="line-result-msg" class="notification-msg"></div>
 
  <!-- 或者使用 LINE 登录按钮 -->
  <div class="line-login-option">
    <p>或者使用 LINE 账号快速订阅：</p>
    <div
      id="line-login-btn"
      data-client-id="{{ settings.line_login_channel_id }}"
      data-redirect-uri="{{ shop.secure_url }}/apps/line-auth"
    >
      <img src="https://d.line-scdn.net/r/devcenter/downloadables/login_button/login_btn_base.png" alt="LINE登录">
    </div>
  </div>
</div>
 
<style>
.restock-form {
  border: 2px solid #00C300;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  background: #f8fff8;
}
 
.line-subscription-form {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}
 
.form-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
 
.notification-msg {
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
}
 
.notification-msg.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
 
.notification-msg.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
{% endunless %}
```

### 2\. JavaScript 订阅逻辑[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#2-javascript-%E8%AE%A2%E9%98%85%E9%80%BB%E8%BE%91)

```
// assets/line-restock-notification.js
 
function subscribeLine() {
  const lineId = document.getElementById("line-id-input").value.trim();
  const subscribeBtn = document.getElementById("subscribe-btn");
  const resultMsg = document.getElementById("line-result-msg");
 
  // 验证输入
  if (!lineId) {
    showMessage("请输入您的 LINE ID", "error");
    return;
  }
 
  // 获取当前商品变体信息
  const variantId = getSelectedVariantId();
  const productId = {{ product.id }};
 
  // 禁用按钮，防止重复提交
  subscribeBtn.disabled = true;
  subscribeBtn.textContent = "订阅中...";
 
  // 发送订阅请求
  fetch("/apps/line-restock/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Web-Token": "{{ form.authenticity_token }}"
    },
    body: JSON.stringify({
      lineId: lineId,
      variantId: variantId,
      productId: productId,
      productTitle: "{{ product.title | escape }}",
      variantTitle: getSelectedVariantTitle()
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showMessage("订阅成功！商品补货时我们会立即通知您", "success");
      document.getElementById("line-id-input").value = "";
    } else {
      showMessage("订阅失败：" + (data.message || "请稍后重试"), "error");
    }
  })
  .catch(error => {
    console.error("订阅错误:", error);
    showMessage("网络错误，请稍后重试", "error");
  })
  .finally(() => {
    subscribeBtn.disabled = false;
    subscribeBtn.textContent = "订阅到货通知";
  });
}
 
function getSelectedVariantId() {
  // 获取当前选中的变体ID
  const variantSelect = document.querySelector('[name="id"]');
  return variantSelect ? variantSelect.value : {{ product.selected_or_first_available_variant.id }};
}
 
function getSelectedVariantTitle() {
  const variantSelect = document.querySelector('[name="id"]');
  if (variantSelect) {
    const selectedOption = variantSelect.options[variantSelect.selectedIndex];
    return selectedOption.textContent;
  }
  return "{{ product.selected_or_first_available_variant.title | escape }}";
}
 
function showMessage(message, type) {
  const resultMsg = document.getElementById("line-result-msg");
  resultMsg.textContent = message;
  resultMsg.className = `notification-msg ${type}`;
 
  // 3秒后自动清除消息
  setTimeout(() => {
    resultMsg.textContent = "";
    resultMsg.className = "notification-msg";
  }, 3000);
}
 
// LINE 登录功能
function initLineLogin() {
  const lineLoginBtn = document.getElementById("line-login-btn");
  if (lineLoginBtn) {
    lineLoginBtn.addEventListener("click", function() {
      const clientId = this.dataset.clientId;
      const redirectUri = this.dataset.redirectUri;
      const state = generateRandomString(32);
 
      const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?` +
        `response_type=code&` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `state=${state}&` +
        `scope=profile%20openid`;
 
      window.location.href = loginUrl;
    });
  }
}
 
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
 
// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
  initLineLogin();
});
```

* * *

## 四、后端 API 实现[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#%E5%9B%9B%E5%90%8E%E7%AB%AF-api-%E5%AE%9E%E7%8E%B0)

### 1\. Shopify App Proxy 设置[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#1-shopify-app-proxy-%E8%AE%BE%E7%BD%AE)

在 Shopify 合作伙伴后台设置 App Proxy：

```
Subpath prefix: apps
Subpath: line-restock
URL: https://your-server.com/shopify/proxy
```

### 2\. 订阅 API 端点[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#2-%E8%AE%A2%E9%98%85-api-%E7%AB%AF%E7%82%B9)

```
// server.js (Node.js + Express 示例)
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const app = express();
 
app.use(express.json());
 
// LINE API 配置
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
 
// 数据库配置 (示例使用 MongoDB)
const mongoose = require('mongoose');
 
// 订阅记录模型
const RestockSubscription = mongoose.model('RestockSubscription', {
  shopDomain: String,
  lineUserId: String,
  variantId: String,
  productId: String,
  productTitle: String,
  variantTitle: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
 
// 处理订阅请求
app.post('/shopify/proxy/subscribe', async (req, res) => {
  try {
    const { lineId, variantId, productId, productTitle, variantTitle } = req.body;
    const shopDomain = req.get('X-Shopify-Shop-Domain');
 
    // 验证 LINE ID 格式
    if (!lineId || lineId.length < 3) {
      return res.json({ success: false, message: 'LINE ID 格式不正确' });
    }
 
    // 检查是否已经订阅
    const existingSubscription = await RestockSubscription.findOne({
      shopDomain,
      lineUserId: lineId,
      variantId,
      isActive: true
    });
 
    if (existingSubscription) {
      return res.json({ success: false, message: '您已经订阅了此商品的到货通知' });
    }
 
    // 创建新的订阅记录
    const subscription = new RestockSubscription({
      shopDomain,
      lineUserId: lineId,
      variantId,
      productId,
      productTitle,
      variantTitle
    });
 
    await subscription.save();
 
    // 发送确认消息到 LINE
    await sendLineMessage(lineId, `订阅成功！\n\n商品：${productTitle}\n规格：${variantTitle}\n\n补货时我们会立即通知您！`);
 
    res.json({ success: true, message: '订阅成功' });
 
  } catch (error) {
    console.error('订阅失败:', error);
    res.json({ success: false, message: '系统错误，请稍后重试' });
  }
});
 
// 发送 LINE 消息
async function sendLineMessage(userId, message) {
  try {
    await axios.post('https://api.line.me/v2/bot/message/push', {
      to: userId,
      messages: [{
        type: 'text',
        text: message
      }]
    }, {
      headers: {
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('LINE 消息发送失败:', error.response?.data || error.message);
  }
}
```

* * *

## 五、库存变更监听与通知发送[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#%E4%BA%94%E5%BA%93%E5%AD%98%E5%8F%98%E6%9B%B4%E7%9B%91%E5%90%AC%E4%B8%8E%E9%80%9A%E7%9F%A5%E5%8F%91%E9%80%81)

### 1\. 设置 Shopify Webhook[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#1-%E8%AE%BE%E7%BD%AE-shopify-webhook)

在 Shopify 后台或通过 API 设置库存更新 Webhook：

```
// 注册 Webhook
app.post('/webhooks/inventory/update', async (req, res) => {
  try {
    // 验证 Webhook 签名
    const hmac = req.get('X-Shopify-Hmac-Sha256');
    const body = JSON.stringify(req.body);
    const hash = crypto.createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET)
                      .update(body, 'utf8')
                      .digest('base64');
 
    if (hash !== hmac) {
      return res.status(401).send('Unauthorized');
    }
 
    const inventoryLevel = req.body;
    const variantId = inventoryLevel.inventory_item_id;
 
    // 检查库存是否从0变为有库存
    if (inventoryLevel.available > 0) {
      await processRestockNotification(variantId);
    }
 
    res.status(200).send('OK');
 
  } catch (error) {
    console.error('Webhook 处理错误:', error);
    res.status(500).send('Internal Server Error');
  }
});
```

### 2\. 补货通知处理[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#2-%E8%A1%A5%E8%B4%A7%E9%80%9A%E7%9F%A5%E5%A4%84%E7%90%86)

```
async function processRestockNotification(variantId) {
  try {
    // 查找所有订阅此变体的用户
    const subscriptions = await RestockSubscription.find({
      variantId: variantId,
      isActive: true
    });
 
    if (subscriptions.length === 0) {
      return;
    }
 
    // 获取商品信息
    const variant = await getShopifyVariant(subscriptions[0].shopDomain, variantId);
    if (!variant) {
      console.error('无法获取变体信息:', variantId);
      return;
    }
 
    // 构建通知消息
    const message = `🎉 好消息！您订阅的商品已经补货了！\n\n` +
                   `商品：${subscriptions[0].productTitle}\n` +
                   `规格：${subscriptions[0].variantTitle}\n` +
                   `价格：${variant.price}\n\n` +
                   `立即购买：${getProductUrl(subscriptions[0].shopDomain, subscriptions[0].productId, variantId)}\n\n` +
                   `数量有限，先到先得！`;
 
    // 发送通知给所有订阅用户
    const notifications = subscriptions.map(subscription =>
      sendRestockNotification(subscription, message)
    );
 
    await Promise.all(notifications);
 
    // 将订阅标记为已通知
    await RestockSubscription.updateMany(
      { variantId: variantId, isActive: true },
      { isActive: false, notifiedAt: new Date() }
    );
 
    console.log(`补货通知已发送给 ${subscriptions.length} 位用户`);
 
  } catch (error) {
    console.error('补货通知处理错误:', error);
  }
}
 
async function sendRestockNotification(subscription, message) {
  try {
    await sendLineMessage(subscription.lineUserId, message);
 
    // 记录通知发送日志
    console.log(`通知已发送: ${subscription.lineUserId} - ${subscription.productTitle}`);
 
  } catch (error) {
    console.error(`通知发送失败: ${subscription.lineUserId}`, error);
  }
}
 
function getProductUrl(shopDomain, productId, variantId) {
  return `https://${shopDomain}/products/${productId}?variant=${variantId}`;
}
```

* * *

## 六、高级功能增强[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#%E5%85%AD%E9%AB%98%E7%BA%A7%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA)

### 1\. LINE Rich Menu 集成[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#1-line-rich-menu-%E9%9B%86%E6%88%90)

```
// 创建 Rich Menu
async function createLineRichMenu() {
  const richMenu = {
    size: {
      width: 2500,
      height: 1686
    },
    selected: true,
    name: "购物助手菜单",
    chatBarText: "购物助手",
    areas: [
      {
        bounds: {
          x: 0,
          y: 0,
          width: 1250,
          height: 843
        },
        action: {
          type: "postback",
          data: "action=view_subscriptions"
        }
      },
      {
        bounds: {
          x: 1250,
          y: 0,
          width: 1250,
          height: 843
        },
        action: {
          type: "uri",
          uri: "https://yourshop.com"
        }
      }
    ]
  };
 
  try {
    const response = await axios.post('https://api.line.me/v2/bot/richmenu', richMenu, {
      headers: {
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
 
    console.log('Rich Menu 创建成功:', response.data);
    return response.data.richMenuId;
 
  } catch (error) {
    console.error('Rich Menu 创建失败:', error.response?.data);
  }
}
```

### 2\. 取消订阅功能[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#2-%E5%8F%96%E6%B6%88%E8%AE%A2%E9%98%85%E5%8A%9F%E8%83%BD)

```
// 处理 LINE Postback 事件
app.post('/webhook/line', (req, res) => {
  const events = req.body.events;
 
  events.forEach(async (event) => {
    if (event.type === 'postback') {
      const userId = event.source.userId;
      const data = new URLSearchParams(event.postback.data);
      const action = data.get('action');
 
      switch (action) {
        case 'view_subscriptions':
          await handleViewSubscriptions(userId);
          break;
        case 'cancel_subscription':
          const variantId = data.get('variantId');
          await handleCancelSubscription(userId, variantId);
          break;
      }
    }
  });
 
  res.status(200).send('OK');
});
 
async function handleViewSubscriptions(userId) {
  try {
    const subscriptions = await RestockSubscription.find({
      lineUserId: userId,
      isActive: true
    });
 
    if (subscriptions.length === 0) {
      await sendLineMessage(userId, '您目前没有任何商品订阅');
      return;
    }
 
    let message = '📋 您的订阅列表：\n\n';
    subscriptions.forEach((sub, index) => {
      message += `${index + 1}. ${sub.productTitle}\n`;
      message += `   规格：${sub.variantTitle}\n\n`;
    });
 
    // 创建取消订阅的快捷回复
    const quickReply = {
      items: subscriptions.map(sub => ({
        type: 'action',
        action: {
          type: 'postback',
          label: `取消 ${sub.productTitle}`,
          data: `action=cancel_subscription&variantId=${sub.variantId}`
        }
      }))
    };
 
    await sendLineMessage(userId, message, quickReply);
 
  } catch (error) {
    console.error('查看订阅失败:', error);
  }
}
```

* * *

## 七、技术选项总结[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#%E4%B8%83%E6%8A%80%E6%9C%AF%E9%80%89%E9%A1%B9%E6%80%BB%E7%BB%93)

| 目标 | 实现方式 | 推荐工具 |
| --- | --- | --- |
| 客户授权/获取 Line ID | LINE 登录 / 表单输入 | LINE Login API |
| 储存订阅数据 | Metafields / 外部数据库 | MongoDB / PostgreSQL |
| 自动检测库存变化 | Shopify Webhook | Inventory Levels Update |
| 发送 LINE 消息 | LINE Messaging API | Node.js/Express API |
| 服务器部署 | 云服务 | Heroku / Vercel / AWS |

* * *

## 八、部署清单[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#%E5%85%AB%E9%83%A8%E7%BD%B2%E6%B8%85%E5%8D%95)

### 环境变量配置[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E9%85%8D%E7%BD%AE)

```
# .env
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
LINE_CHANNEL_SECRET=your_line_channel_secret
LINE_LOGIN_CHANNEL_ID=your_line_login_channel_id
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
MONGODB_URI=your_mongodb_connection_string
```

### Shopify 主题设置[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#shopify-%E4%B8%BB%E9%A2%98%E8%AE%BE%E7%BD%AE)

在 `config/settings_schema.json` 中添加：

```
{
  "name": "LINE 通知设置",
  "settings": [
    {
      "type": "text",
      "id": "line_login_channel_id",
      "label": "LINE Login Channel ID"
    },
    {
      "type": "checkbox",
      "id": "enable_line_restock_notification",
      "label": "启用 LINE 到货通知",
      "default": true
    }
  ]
}
```

* * *

## 九、测试验证[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#%E4%B9%9D%E6%B5%8B%E8%AF%95%E9%AA%8C%E8%AF%81)

### 1\. 功能测试步骤[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#1-%E5%8A%9F%E8%83%BD%E6%B5%8B%E8%AF%95%E6%AD%A5%E9%AA%A4)

1.  **订阅测试**：在缺货商品页面测试订阅功能
2.  **通知测试**：手动触发库存更新，验证通知发送
3.  **取消订阅测试**：通过 LINE 消息测试取消订阅
4.  **错误处理测试**：测试各种异常情况的处理

### 2\. 监控和日志[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#2-%E7%9B%91%E6%8E%A7%E5%92%8C%E6%97%A5%E5%BF%97)

```
// 添加日志记录
const winston = require('winston');
 
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'line-notifications.log' })
  ]
});
 
// 在关键操作中添加日志
logger.info('订阅创建', {
  userId: lineId,
  variantId,
  timestamp: new Date()
});
```

* * *

## 十、优化建议[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#%E5%8D%81%E4%BC%98%E5%8C%96%E5%BB%BA%E8%AE%AE)

### 1\. 性能优化[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#1-%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96)

*   使用消息队列（如 BullMQ、SQS）处理大量通知，避免 Webhook 超时
*   实现通知发送的批量处理（LINE Messaging API 支持 multicast，最多 500 收件人 / 次）
*   添加 Redis 缓存减少数据库查询

### 2\. 用户体验优化[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#2-%E7%94%A8%E6%88%B7%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96)

*   支持多语言通知消息（按 `customer.locale` 渲染）
*   在通知里附商品图片（LINE Rich Message）
*   加 “立即购买”按钮（Quick Reply）直接跳回 Shopify 商品页

### 3\. 业务功能扩展[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#3-%E4%B8%9A%E5%8A%A1%E5%8A%9F%E8%83%BD%E6%89%A9%E5%B1%95)

*   价格下降通知（监听 `products/update` Webhook 的 `variants.price` 字段）
*   VIP 用户优先通知（提前 N 分钟推送）
*   限时抢购提醒（与 Launchpad 联动）

* * *

## 上线前检查清单[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#%E4%B8%8A%E7%BA%BF%E5%89%8D%E6%A3%80%E6%9F%A5%E6%B8%85%E5%8D%95)

*   **LINE Messaging API** 配置完成，Channel Access Token 安全存储（不要硬编码到主题）
*   **Webhook URL** 用 HTTPS，且**校验 LINE Signature**（防伪造请求）
*   **数据库**字段加索引：`product_id + variant_id + status`（高并发查询用）
*   **库存 Webhook**：在 Shopify Admin → Notifications → Webhooks 注册 `inventory_levels/update`
*   **重复通知防护**：同一用户同一 SKU **30 天内最多 1 次**通知
*   **退订机制**：消息底部带”停止接收”链接（合规必备）
*   **消息频率限制**：单店铺 < 1000 条 / 分钟，避免触发 LINE 风控
*   **降级方案**：LINE API 故障时回退到 Email
*   **审计日志**：保留每次通知的发送记录至少 90 天

* * *

## 常见问题（FAQ）[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98faq)

**Q：用户必须有 LINE 账号才能订阅吗？** A：是。但**不一定要让用户先注册**——可以让用户**先用 Email 订阅**，到货时同时尝试 LINE（如绑定过）与 Email。亚太市场建议默认 LINE Login，欧美用户走 Email。

**Q：LINE Messaging API 收费吗？** A：免费额度内（**500 条 / 月** 推送 + 无限接收），超出后按阶梯收费。中小店铺通常不超出。详见 LINE 官方价格页。

**Q：能用 Shopify 自带的”Back in Stock”功能吗？** A：Shopify 没有原生”到货通知”功能。需要装 App（如 Back in Stock by Swym、Restock Rocket）或自建。**App 大多只支持 Email + SMS**，不支持 LINE——这正是本文方案存在的理由。

**Q：库存变更的判定逻辑是什么？** A：监听 `inventory_levels/update` Webhook。判断条件：`(previous.available <= 0) && (current.available > 0)`。注意：**直接监听 `products/update` 不够准**，因为价格 / 描述更新也会触发。

**Q：怎么防止通知风暴（一个 SKU 一夜补货 100 个，触发 100 条推送）？** A：核心做法——（1）**每个用户每个 SKU 只发一次**；（2）发送后立刻把订阅状态改为 `sent`；（3）批量推送时用 multicast 而非循环 push。

**Q：用户在主题编辑器中能看到这个 Section 吗？** A：建议把订阅表单**封装成 Section**（参考 [Shopify Section 开发指南](https://shopify.baoea.com/advanced/add-section)），让运营能控制是否启用、文案是什么。比硬编码到 product-form.liquid 灵活。

**Q：合规上要注意什么？** A：（1）订阅前明确告知**发送频率与停止方式**；（2）日本市场需符合 **特定電子メール法**，台湾市场参考 **個人資料保護法**；（3）保留用户同意的时间戳；（4）退订请求 48 小时内生效。

**Q：能用 AI 做更智能的通知吗？** A：可以——基于用户浏览历史推送”你关注的 XX 类商品已上架”。但**先把基础流跑稳**再扩展 AI 个性化。AI 个性化收益通常在月推送 > 1 万条后才显著。

* * *

## 延伸阅读[](https://shopify.baoea.com/advanced/shopify-line-restock-notification#%E5%BB%B6%E4%BC%B8%E9%98%85%E8%AF%BB)

*   [Shopify Webhooks 完整指南](https://shopify.baoea.com/advanced/shopify-webhooks-guide) — Webhook 重试、HMAC 校验、幂等性设计
*   [Shopify Section 开发指南](https://shopify.baoea.com/advanced/add-section) — 把订阅表单封装为可配置 Section
*   [Shopify App 开发](https://shopify.baoea.com/advanced/shopify-app-development) — 把本方案打包成可复用 App
*   [营销自动化实践](https://shopify.baoea.com/advanced/marketing-automation) — 与 Email / SMS / EDM 流程联动
*   [跨境电商进阶](https://shopify.baoea.com/advanced/cross-border-advanced) — 不同市场的渠道选择策略
*   [GDPR 合规实施指南](https://shopify.baoea.com/advanced/gdpr-compliance-guide) — 欧盟用户参考（虽然 LINE 主要在亚太）

* * *

> **小结**：LINE 到货通知是**亚太市场 ROI 极高的获客 / 转化挽留工具**——但实现复杂度也实实在在。建议**先 MVP**：只做”Email 订阅 + LINE 二次绑定”，跑两个月看转化率与单条成本，再决定要不要扩到更多营销场景（价格降价提醒、限时活动等）。
