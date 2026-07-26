---
source_url: "https://shopify.baoea.com/basic/shopify-404-redirect"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:17"
fetch_method: "http"
content_hash: "602736f685ad21ecc08267efee0cb8f04ed7d0d67fd9921aafc490284c3a869f"
discovered_via: ["sitemap", "internal_link"]
---
## Shopify 404页面与重定向设置教程

在Shopify运营过程中，难免会遇到用户访问不存在页面（404错误）或产品下架、链接变更等情况。合理设置404页面和URL重定向，不仅能提升用户体验，还能有效减少流量损失、优化SEO。本文将手把手教你如何在Shopify中设置自定义404页面和实现重定向。

* * *

## 404页面是什么？为什么要自定义？[](https://shopify.baoea.com/basic/shopify-404-redirect#404%E9%A1%B5%E9%9D%A2%E6%98%AF%E4%BB%80%E4%B9%88%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E8%87%AA%E5%AE%9A%E4%B9%89)

404页面是指用户访问了不存在的页面时，网站返回的错误提示页面。默认的Shopify 404页面较为简单，容易让用户流失。自定义404页面可以：

*   提供友好的提示和品牌形象
*   引导用户返回首页或热门页面
*   降低跳出率，提升转化

## Shopify自定义404页面方法[](https://shopify.baoea.com/basic/shopify-404-redirect#shopify%E8%87%AA%E5%AE%9A%E4%B9%89404%E9%A1%B5%E9%9D%A2%E6%96%B9%E6%B3%95)

Shopify的404页面模板文件为`templates/404.liquid`, 或者Dawn中使用的`404.json`而其中又指向`sections/main-404.liquid`

```
/*
 * ------------------------------------------------------------
 * IMPORTANT: The contents of this file are auto-generated.
 *
 * This file may be updated by the Shopify admin theme editor
 * or related systems. Please exercise caution as any changes
 * made to this file may be overwritten.
 * ------------------------------------------------------------
 */
{
  "sections": {
    "main": {
      "type": "main-404",
      "settings": {}
    }
  },
  "order": [
    "main"
  ]
}
 
```

你可以通过以下步骤自定义：

### 步骤一：进入主题编辑器[](https://shopify.baoea.com/basic/shopify-404-redirect#%E6%AD%A5%E9%AA%A4%E4%B8%80%E8%BF%9B%E5%85%A5%E4%B8%BB%E9%A2%98%E7%BC%96%E8%BE%91%E5%99%A8)

1.  登录Shopify后台，点击【在线商店】>【主题】。
2.  找到当前正在使用的主题，点击【自定义】。

### 步骤二：编辑404模板[](https://shopify.baoea.com/basic/shopify-404-redirect#%E6%AD%A5%E9%AA%A4%E4%BA%8C%E7%BC%96%E8%BE%91404%E6%A8%A1%E6%9D%BF)

1.  在主题编辑页面，点击左上角的【主题操作】>【编辑代码】。
2.  在左侧文件树中找到`templates/404.liquid`或者`sections/main-404.liquid`文件。

![404.liquid](https://shopify.baoea.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F404-overview.73d0688b.png&w=1920&q=75)

3.  修改文件内容，例如：

```
<!-- 这是一个简单的自定义404页面示例 -->
<div class="error-404">
  <h1>页面未找到</h1>
  <p>很抱歉，您访问的页面不存在或已被删除。</p>
  <a href="/" class="btn">返回首页</a>
</div>
```

4.  保存更改，刷新前台测试效果。

### 小技巧：[](https://shopify.baoea.com/basic/shopify-404-redirect#%E5%B0%8F%E6%8A%80%E5%B7%A7)

*   可以添加热门产品、搜索框、联系方式等内容，提升用户留存。
*   建议配合品牌风格美化页面。

## Shopify后台设置URL重定向[](https://shopify.baoea.com/basic/shopify-404-redirect#shopify%E5%90%8E%E5%8F%B0%E8%AE%BE%E7%BD%AEurl%E9%87%8D%E5%AE%9A%E5%90%91)

当产品下架、页面URL变更或需要合并流量时，可以通过Shopify后台设置301重定向。

### 步骤一：进入重定向设置[](https://shopify.baoea.com/basic/shopify-404-redirect#%E6%AD%A5%E9%AA%A4%E4%B8%80%E8%BF%9B%E5%85%A5%E9%87%8D%E5%AE%9A%E5%90%91%E8%AE%BE%E7%BD%AE)

1.  登录Shopify后台，点击左侧菜单【内容】>【菜单】。
2.  在左上角找到【URL重定向】（URL Redirects），点击进入。

### 步骤二：添加重定向[](https://shopify.baoea.com/basic/shopify-404-redirect#%E6%AD%A5%E9%AA%A4%E4%BA%8C%E6%B7%BB%E5%8A%A0%E9%87%8D%E5%AE%9A%E5%90%91)

1.  点击【创建URL重定向】（Add URL redirect）。
2.  填写”原始URL”（如`/old-page`）和”目标URL”（如`/new-page`）。
3.  点击保存。

![Shopify创建URL重定向](https://shopify.baoea.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fadd-redirect.9d52175d.png&w=3840&q=75)

> 注意：
> 
> *   原始URL必须是相对路径（以/开头），不包含域名。
> *   目标URL可以是站内任意有效页面。
> *   301重定向有助于SEO权重传递。

### 批量导入重定向[](https://shopify.baoea.com/basic/shopify-404-redirect#%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E9%87%8D%E5%AE%9A%E5%90%91)

如需批量设置，可在重定向页面右上角选择”导入”，上传CSV文件批量添加。

## 常见问题与注意事项[](https://shopify.baoea.com/basic/shopify-404-redirect#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E4%B8%8E%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

*   **404页面不生效？** 检查主题是否支持自定义404模板，或是否缓存未刷新。
*   **重定向后SEO会受影响吗？** 301重定向可传递大部分SEO权重，建议及时设置。
*   **能否重定向到外部网站？** Shopify仅支持站内URL重定向，不能直接跳转到外部域名。
*   **如何监控404访问？** 可结合Google Analytics等工具，监控404页面访问量，及时优化。

* * *

通过合理设置404页面和URL重定向，不仅能提升用户体验，还能有效减少流量损失，助力Shopify店铺健康成长。如有更多Shopify运营问题，欢迎关注本站或联系我交流！

最后更新时间：

2026年6月27日

[Shopify目录中的Blocks详解](https://shopify.baoea.com/basic/shopify-blocks "Shopify目录中的Blocks详解")[Shopify数据分析设置完整指南](/basic/shopify-analytics-setup "Shopify数据分析设置完整指南")
