---
source_url: "https://shopify.baoea.com/basic/shopify-blocks"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:22"
fetch_method: "http"
content_hash: "cdfaac7800764c3442db1c5ed0c70771351fb149b22967acc47cf5c94bf42188"
discovered_via: ["sitemap", "internal_link"]
---
## Shopify 主题中的块(blocks)

## 块(Blocks)概念[](https://shopify.baoea.com/basic/shopify-blocks#%E5%9D%97blocks%E6%A6%82%E5%BF%B5)

Shopify 中的块允许开发者通过将部分(sections)分解为更小、可重用的 Liquid 代码片段来创建灵活的布局。每个块都有自己的设置集，可以在部分内添加、删除和重新排序。

Shopify 有三种类型的块：

*   主题块(Theme blocks): 在 `/blocks` 文件夹中创建为独立的 `Liquid` 文件，可在主题的多个部分中重复使用。
*   部分块(Section blocks): 在部分的 Liquid 文件内创建，仅限于在该部分内使用。
*   应用块(App blocks): 由商店安装的应用提供的块。

## 如何创建一个主题块(Theme block)[](https://shopify.baoea.com/basic/shopify-blocks#%E5%A6%82%E4%BD%95%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E4%B8%BB%E9%A2%98%E5%9D%97theme-block)

### 步骤 1: 创建 blocks 文件夹和块文件[](https://shopify.baoea.com/basic/shopify-blocks#%E6%AD%A5%E9%AA%A4-1-%E5%88%9B%E5%BB%BA-blocks-%E6%96%87%E4%BB%B6%E5%A4%B9%E5%92%8C%E5%9D%97%E6%96%87%E4%BB%B6)

在主题根目录下创建一个 /blocks 文件夹(如果尚不存在) 在该文件夹中创建一个新的 Liquid 文件，例如 text.liquid

### 步骤 2: 编写块的内容[](https://shopify.baoea.com/basic/shopify-blocks#%E6%AD%A5%E9%AA%A4-2-%E7%BC%96%E5%86%99%E5%9D%97%E7%9A%84%E5%86%85%E5%AE%B9)

主题块文件包含两部分:

*   标记(markup): 任何要在块中包含的 HTML 或 Liquid 内容
*   模式(schema): 使用 {% schema %} Liquid 标签，用于配置块的设置和属性 以下是一个基本的文本块示例:

```
<div class="{{ block.settings.text_style }}">
    {{ block.settings.text }}
</div>
 
{% schema %}
{
    "name": "Text",
    "settings": [
{
    "type": "richtext",
    "id": "text",
    "label": "Text"
},
{
    "type": "select",
    "id": "text_style",
    "label": "Text style",
    "options": [
{
    "value": "body",
    "label": "Regular"
},
{
    "value": "subtitle",
    "label": "Subtitle"
}
    ],
    "default": "body"
}
    ],
    "presets": [
{
    "name": "Text"
},
{
    "name": "Content",
    "settings": {
    "text": "<p>Hello, World!</p>"
}
}
    ]
}
{% endschema %}
```

### 步骤 3: 添加预设(Presets)[](https://shopify.baoea.com/basic/shopify-blocks#%E6%AD%A5%E9%AA%A4-3-%E6%B7%BB%E5%8A%A0%E9%A2%84%E8%AE%BEpresets)

预设需要在主题块的 schema 中定义，这样商家才能在主题编辑器的块选择器中使用它。可以为同一个主题块创建多个预设。在上面的例子中，文本主题块有两个名为`Text`和`Content`的预设。

## 在部分(Section)中使用主题块[](https://shopify.baoea.com/basic/shopify-blocks#%E5%9C%A8%E9%83%A8%E5%88%86section%E4%B8%AD%E4%BD%BF%E7%94%A8%E4%B8%BB%E9%A2%98%E5%9D%97)

创建主题块后，需要更新主题的部分以呈现这些块:

### 步骤 1: 在部分的 Liquid 文件中渲染块[](https://shopify.baoea.com/basic/shopify-blocks#%E6%AD%A5%E9%AA%A4-1-%E5%9C%A8%E9%83%A8%E5%88%86%E7%9A%84-liquid-%E6%96%87%E4%BB%B6%E4%B8%AD%E6%B8%B2%E6%9F%93%E5%9D%97)

使用以下代码在 section 文件中渲染块:

```
{% content_for 'blocks' %}
```

### 步骤 2: 更新部分的模式(schema)[](https://shopify.baoea.com/basic/shopify-blocks#%E6%AD%A5%E9%AA%A4-2-%E6%9B%B4%E6%96%B0%E9%83%A8%E5%88%86%E7%9A%84%E6%A8%A1%E5%BC%8Fschema)

要接受所有主题块，请在部分的 schema 的 blocks 属性中添加类型 @theme:

```
"blocks": [
    {
        "type": "@theme"
    },
    {
        "type": "@app"
    }
]
```

### 如何在可视化编辑器中使用创建的块[](https://shopify.baoea.com/basic/shopify-blocks#%E5%A6%82%E4%BD%95%E5%9C%A8%E5%8F%AF%E8%A7%86%E5%8C%96%E7%BC%96%E8%BE%91%E5%99%A8%E4%B8%AD%E4%BD%BF%E7%94%A8%E5%88%9B%E5%BB%BA%E7%9A%84%E5%9D%97)

![Shopify\_theme\_add\_blocks](https://shopify.baoea.com/_next/image?url=%2Fimages%2Fcontents%2Fadd-block1.png&w=1920&q=75) ![Shopify\_theme\_add\_blocks](https://shopify.baoea.com/_next/image?url=%2Fimages%2Fcontents%2Fadd-block2.png&w=1920&q=75) ![Shopify\_theme\_add\_blocks](https://shopify.baoea.com/_next/image?url=%2Fimages%2Fcontents%2Fadd-block3.png&w=1920&q=75)

一旦您创建了主题块并在部分中启用了它们，商家就可以在 `Shopify` 主题编辑器中使用这些块:

1.  在 Shopify 管理后台，转到”`在线商店`” > “`主题`”
2.  点击您当前主题的”`自定义`”按钮
3.  导航到包含支持主题块的部分的页面
4.  选择该部分，点击”`添加块`”按钮
5.  在出现的块选择器中，您将看到您创建的块(由于您添加的预设)
6.  选择所需的块预设，它将被添加到部分中
7.  使用块配置面板调整块的设置
8.  您可以使用拖放功能重新排序块

关键是，确保`块`在 `schema` 中有正确的 `presets` 定义，这样它们才会出现在主题编辑器的块选择器中，并且确保你的部分在其 `schema` 中接受 `@theme` 类型的块。 通过遵循这些步骤，您可以创建高度可定制的 Shopify 主题，让商家能够轻松地使用拖放界面来构建他们的页面。

最后更新时间：

2026年6月27日

[Shopify主题目录结构](https://shopify.baoea.com/basic/shopify-folders "Shopify主题目录结构")[404页面与重定向设置教程](/basic/shopify-404-redirect "404页面与重定向设置教程")
