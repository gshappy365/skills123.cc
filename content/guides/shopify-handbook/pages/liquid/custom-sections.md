---
source_url: "https://shopify.baoea.com/liquid/custom-sections"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:35"
fetch_method: "http"
content_hash: "f6fb54ddab70f49295136d4b869f37c380f8adc5b15ba89e40a7855493db22c8"
discovered_via: ["sitemap", "internal_link"]
---
## 自定义分区开发

分区（Section）是 Online Store 2.0 里 **商家能在主题编辑器里改内容** 的最小完整单元：一个 `sections/*.liquid` 文件，底部带 `{% schema %}` JSON。写得好，运营不用找你改文案；写得散，每个首页改版都是一次「全主题 diff」。

**本篇结构**：分区与 JSON 模板 → 三个约定 → Hero / Blocks 示例 → 集合与产品 → Schema 速查 → 样式与脚本 → 图片与无障碍 → 自检；延伸阅读与官方文档放在文末。

* * *

## 1\. 文件放哪、和 JSON 模板的关系[](https://shopify.baoea.com/liquid/custom-sections#1-%E6%96%87%E4%BB%B6%E6%94%BE%E5%93%AA%E5%92%8C-json-%E6%A8%A1%E6%9D%BF%E7%9A%84%E5%85%B3%E7%B3%BB)

*   路径：`sections/你的分区名.liquid`（文件名即 `{% section 'xxx' %}` 里的 `xxx`，也是主题编辑器里看到的机器名基础）。
*   首页、产品页等 **JSON 模板**（`templates/*.json`）里通过 `type` 引用分区；分区里的 `presets` 决定 **「添加分区」** 时出现的默认块与设置。
*   模板里一段 section 大致长这样（`settings` 会落进 `config/settings_data.json` 或模板 JSON，**改 schema 字段 id 等于改存储键名**，上线前记得迁移或让运营重存一遍）：

```
{
  "type": "hero-promo",
  "settings": { "heading": "当季主推" },
  "blocks": {}
}
```

*   改 Liquid 后若 schema 的 `name` / `settings` 结构大变，**已保存的模板 JSON 可能残留旧字段**，上线前用预览主题点一遍编辑器，必要时重置该 section 配置。

### 限制分区出现在哪些模板（可选）[](https://shopify.baoea.com/liquid/custom-sections#%E9%99%90%E5%88%B6%E5%88%86%E5%8C%BA%E5%87%BA%E7%8E%B0%E5%9C%A8%E5%93%AA%E4%BA%9B%E6%A8%A1%E6%9D%BF%E5%8F%AF%E9%80%89)

在 schema 根级加 `enabled_on` / `disabled_on`，避免运营把「仅适合首页」的模块插进结账页附近的分区列表。具体键名与取值以 [Section schema](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema)  当前文档为准（常见写法包含 `templates` 白名单等）。

* * *

## 2\. 写分区时的三个约定（比 BEM 名字更重要）[](https://shopify.baoea.com/liquid/custom-sections#2-%E5%86%99%E5%88%86%E5%8C%BA%E6%97%B6%E7%9A%84%E4%B8%89%E4%B8%AA%E7%BA%A6%E5%AE%9A%E6%AF%94-bem-%E5%90%8D%E5%AD%97%E6%9B%B4%E9%87%8D%E8%A6%81)

1.  **根节点带 `id` 或 `data-section-id="{{ section.id }}"`**，方便 JS/CSS 只作用在本实例，避免和页面上第二个同文件 section 打架。
2.  **可重复区块一律用 `{% for block in section.blocks %}`**，并在承载 block 的最外层节点写 `{{ block.shopify_attributes }}`，否则主题编辑器里拖不动、也选不中 block。
3.  **集合、产品、链接等「可能为空」的数据先判断**，再给运营看占位文案；空集合 `for` 不报错但页面很丑。

* * *

## 3\. 示例一：无 Blocks 的 Hero（单图 + 文案 + CTA）[](https://shopify.baoea.com/liquid/custom-sections#3-%E7%A4%BA%E4%BE%8B%E4%B8%80%E6%97%A0-blocks-%E7%9A%84-hero%E5%8D%95%E5%9B%BE--%E6%96%87%E6%A1%88--cta)

要点：**首屏大图**若真是 LCP，不要用整页的 `loading="lazy"`；下面示例里图片用 `eager`，其余装饰图再用 `lazy`。`image_tag` 用法详见站内 [Liquid 过滤器 · `image_tag`](https://shopify.baoea.com/liquid/filters)。

```
{% comment %} sections/hero-promo.liquid {% endcomment %}
<section
  id="shopify-section-{{ section.id }}"
  class="hero-promo"
  style="--hero-bg: {{ section.settings.tint | default: '#f4f4f4' }};"
>
  <div class="hero-promo__inner page-width">
    {% if section.settings.image != blank %}
      {% assign hero_alt = section.settings.image.alt | default: section.settings.heading | escape %}
      <div class="hero-promo__media">
        {{
          section.settings.image
          | image_url: width: 1600
          | image_tag:
            loading: 'eager',
            fetchpriority: 'high',
            widths: '400, 800, 1200, 1600',
            sizes: '(min-width: 990px) 60vw, 100vw',
            class: 'hero-promo__img',
            alt: hero_alt
        }}
      </div>
    {% endif %}
 
    <div class="hero-promo__copy">
      {% if section.settings.heading != blank %}
        <h2 class="hero-promo__heading">{{ section.settings.heading | escape }}</h2>
      {% endif %}
      {% if section.settings.subheading != blank %}
        <div class="hero-promo__sub rte">{{ section.settings.subheading }}</div>
      {% endif %}
      {% if section.settings.button_label != blank and section.settings.button_link != blank %}
        <a class="button" href="{{ section.settings.button_link }}">{{ section.settings.button_label | escape }}</a>
      {% endif %}
    </div>
  </div>
</section>
 
{% stylesheet %}
  .hero-promo { background: var(--hero-bg, #f4f4f4); }
  .hero-promo__inner { display: grid; gap: 1.5rem; align-items: center; padding-block: 2rem; }
  @media (min-width: 990px) {
    .hero-promo__inner { grid-template-columns: 1.1fr 0.9fr; }
  }
  .hero-promo__img { width: 100%; height: auto; border-radius: 8px; }
{% endstylesheet %}
 
{% schema %}
{
  "name": "Hero 促销条",
  "tag": "section",
  "class": "section-hero-promo",
  "settings": [
    { "type": "image_picker", "id": "image", "label": "配图" },
    { "type": "text", "id": "heading", "label": "标题", "default": "当季主推" },
    { "type": "richtext", "id": "subheading", "label": "副文案" },
    { "type": "text", "id": "button_label", "label": "按钮文案", "default": "去选购" },
    { "type": "url", "id": "button_link", "label": "按钮链接" },
    { "type": "color", "id": "tint", "label": "背景浅色调", "default": "#f4f4f4" }
  ],
  "presets": [{ "name": "Hero 促销条" }]
}
{% endschema %}
```

说明：

*   每个 section / snippet **最多一个** `{% stylesheet %}`；样式里不要写 Liquid（动态值用根节点 CSS 变量承接）。官方说明见 [JavaScript and stylesheet tags](https://shopify.dev/docs/storefronts/themes/best-practices/javascript-and-stylesheet-tags) 。
*   若团队仍统一走 `assets/*.css`，把上面样式挪出去即可，**不要**在十几个 section 里复制同一坨规则。目录与脚本约定还可对照 [主题工程化：目录与 npm 脚本](https://shopify.baoea.com/liquid/theme-engineering-setup)。

* * *

## 4\. 示例二：带 Blocks 的「图标卖点」行[](https://shopify.baoea.com/liquid/custom-sections#4-%E7%A4%BA%E4%BE%8B%E4%BA%8C%E5%B8%A6-blocks-%E7%9A%84%E5%9B%BE%E6%A0%87%E5%8D%96%E7%82%B9%E8%A1%8C)

`block.shopify_attributes` 少写一次，编辑器里就会表现为「点了没反应」或无法保存排序。

```
{% comment %} sections/icon-row.liquid {% endcomment %}
<section id="shopify-section-{{ section.id }}" class="icon-row page-width">
  {% if section.settings.heading != blank %}
    <h2 class="icon-row__title">{{ section.settings.heading | escape }}</h2>
  {% endif %}
 
  {% if section.blocks.size == 0 %}
    <p class="icon-row__empty">在编辑器里点击「添加块」加入卖点。</p>
  {% else %}
    <ul class="icon-row__list" role="list">
      {% for block in section.blocks %}
        <li class="icon-row__item" {{ block.shopify_attributes }}>
          {% if block.settings.icon != blank %}
            <span class="icon-row__icon" aria-hidden="true">
              {{ block.settings.icon | image_url: width: 64 | image_tag: loading: 'lazy', alt: '' }}
            </span>
          {% endif %}
          {% if block.settings.title != blank %}
            <h3 class="icon-row__item-title">{{ block.settings.title | escape }}</h3>
          {% endif %}
          {% if block.settings.text != blank %}
            <p class="icon-row__item-text">{{ block.settings.text | escape }}</p>
          {% endif %}
        </li>
      {% endfor %}
    </ul>
  {% endif %}
</section>
 
{% stylesheet %}
  .icon-row__list { list-style: none; margin: 0; padding: 0; display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
  .icon-row__item { border: 1px solid #e3e3e3; border-radius: 8px; padding: 1rem; }
  .icon-row__icon img { width: 40px; height: auto; }
{% endstylesheet %}
 
{% schema %}
{
  "name": "图标卖点行",
  "tag": "section",
  "max_blocks": 6,
  "settings": [
    { "type": "text", "id": "heading", "label": "整段标题", "default": "为什么选我们" }
  ],
  "blocks": [
    {
      "type": "item",
      "name": "卖点",
      "settings": [
        { "type": "image_picker", "id": "icon", "label": "图标" },
        { "type": "text", "id": "title", "label": "小标题", "default": "包邮" },
        { "type": "textarea", "id": "text", "label": "说明", "default": "大陆订单满额包邮。" }
      ]
    }
  ],
  "presets": [
    {
      "name": "图标卖点行",
      "blocks": [
        { "type": "item", "settings": { "title": "发货", "text": "48 小时内发出。" } },
        { "type": "item", "settings": { "title": "售后", "text": "签收 7 天内可退。" } }
      ]
    }
  ]
}
{% endschema %}
```

`{% case block.type %}` 适合 **多种 block type 完全两套 markup**（例如图文 / 视频 / 纯文字）；若只是字段多少不同，优先 **单一 block type + 条件**，schema 和 Liquid 都更好维护。

* * *

## 5\. 集合与产品：先确认「setting 到底是对象还是 handle」[](https://shopify.baoea.com/liquid/custom-sections#5-%E9%9B%86%E5%90%88%E4%B8%8E%E4%BA%A7%E5%93%81%E5%85%88%E7%A1%AE%E8%AE%A4setting-%E5%88%B0%E5%BA%95%E6%98%AF%E5%AF%B9%E8%B1%A1%E8%BF%98%E6%98%AF-handle)

`schema` 里 `"type": "collection"` 时，在 Liquid 里常见两种接法，**以你们主题里已有 section 为准**（Dawn 及近年官方主题多为对象写法）：

**写法 A（推荐，对象为 collection drop）**

```
{% assign featured_collection = section.settings.collection %}
{% if featured_collection == blank or featured_collection.products_count == 0 %}
  <p class="section-empty">请在分区设置里选择一个包含商品的集合。</p>
{% else %}
  <div class="grid">
    {% for product in featured_collection.products limit: section.settings.limit %}
      {% render 'product-card', product: product %}
    {% endfor %}
  </div>
{% endif %}
```

**写法 B（setting 存的是 handle 字符串时）**

```
{% assign featured_collection = collections[section.settings.collection] %}
```

`limit` 务必用 `range` 控上下限（例如 4～12），避免运营填 999 拖垮首页 TTFB。卡片 markup 建议放进 [自定义代码片段](https://shopify.baoea.com/liquid/custom-snippets)，section 只负责循环与栅格。

* * *

## 6\. Schema：常用 `settings.type` 速查[](https://shopify.baoea.com/liquid/custom-sections#6-schema%E5%B8%B8%E7%94%A8-settingstype-%E9%80%9F%E6%9F%A5)

| type | 用途 | 备注 |
| --- | --- | --- |
| text / textarea | 短标题、长说明 | 输出时按需 | escape；richtext 一般不再 escape |
| richtext | 需要加粗、列表 | 外层包 .rte，与主题全局排版一致 |
| image_picker | 图 | 配合 image_url / image_tag |
| url | 任意链接 | 别用 text 让运营手填完整 URL |
| collection / product / blog / page | 资源选择器 | Liquid 侧多为对应 对象；老数据或迁移主题再核对是否仍为 handle |
| range | 数量、间距、列数 | 设好 min max step |
| select / checkbox | 样式开关 | options 的 value 建议英文小写，便于 class 后缀 |
| color | 色值 | 注意对比度；大色块上叠字要测暗色模式 |
| header | 仅分组标题 | 不生成数据，只分割表单 |

**分组**：用 `header` 把「内容 / 布局 / 颜色」拆开，运营找设置会快很多；`info` 留一两句「填什么、不填会怎样」即可。

**多语言 label（可选）**：schema 的 `label` 可指向翻译键（如 `t:sections.xxx.settings.heading.label`），文案进 `locales/*.schema.json`，适合要上架 Theme Store 或双语后台的团队。键名规则见官方 [Translate theme content](https://shopify.dev/docs/storefronts/themes/architecture/locales/schema-locale-files)  一类文档。

* * *

## 7\. 样式与脚本：和 section 绑在一起的两种方式[](https://shopify.baoea.com/liquid/custom-sections#7-%E6%A0%B7%E5%BC%8F%E4%B8%8E%E8%84%9A%E6%9C%AC%E5%92%8C-section-%E7%BB%91%E5%9C%A8%E4%B8%80%E8%B5%B7%E7%9A%84%E4%B8%A4%E7%A7%8D%E6%96%B9%E5%BC%8F)

*   **样式**：`{% stylesheet %}` 与外链 `asset_url` 二选一为主，避免同一选择器在多处重复。
*   **脚本**：需要随 section 实例执行时，可用 `{% javascript %}`（每个文件同样建议 **只保留一处**），或把逻辑放进 `assets/*.js` 再在 section 根用 `data-` 属性传参。行为与限制见 [JavaScript and stylesheet tags](https://shopify.dev/docs/storefronts/themes/best-practices/javascript-and-stylesheet-tags) 。
*   需要随 `section.settings` 变的少量变量：根节点 `style="--x: {{ ... }}"` 即可，**不要把整张颜色表**拼进 Liquid 字符串。

用 AI 辅助写 section 时，可把 [AI 辅助与主题工程化](https://shopify.baoea.com/liquid/ai-theme-engineering) 当作流程说明，但合并前仍要过下面的自检与 Theme Check。

* * *

## 8\. 图片与性能：几条硬规则[](https://shopify.baoea.com/liquid/custom-sections#8-%E5%9B%BE%E7%89%87%E4%B8%8E%E6%80%A7%E8%83%BD%E5%87%A0%E6%9D%A1%E7%A1%AC%E8%A7%84%E5%88%99)

1.  **LCP 那张图**：`loading: 'eager'`、`fetchpriority: 'high'`，宽度给够，不要省成糊图。
2.  **below the fold**：`loading: 'lazy'`，`widths` 给阶梯即可。
3.  **`alt`**：有信息写信息，纯装饰用 `alt=""` 并避免父级再读一遍相同内容。
4.  **GIF 大横幅**：能不用就不用；视频用托管与封面图，别塞超大动图进 section。

* * *

## 9\. 无障碍：比 Schema.org 嵌套更优先的三件事[](https://shopify.baoea.com/liquid/custom-sections#9-%E6%97%A0%E9%9A%9C%E7%A2%8D%E6%AF%94-schemaorg-%E5%B5%8C%E5%A5%97%E6%9B%B4%E4%BC%98%E5%85%88%E7%9A%84%E4%B8%89%E4%BB%B6%E4%BA%8B)

1.  **标题层级连续**：全页通常保留一个 `h1`（常见在模板或产品标题），section 内模块标题从 `h2` 起跳。
2.  **键盘能点的一定是 `<a href>` 或 `<button>`**，不要 `div onclick`。
3.  **轮播、tabs** 要么用成熟组件并测键盘，要么别做——半套无障碍比不做更麻烦。

微数据（`itemscope`）不是不能做，但 **错误嵌套会害 SEO**；多数店铺先把语义 HTML 和 `alt` 做对，再考虑由布局或应用统一输出 JSON-LD，往往更稳。

* * *

## 10\. 合并前自检（比「最佳实践」清单有用）[](https://shopify.baoea.com/liquid/custom-sections#10-%E5%90%88%E5%B9%B6%E5%89%8D%E8%87%AA%E6%A3%80%E6%AF%94%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5%E6%B8%85%E5%8D%95%E6%9C%89%E7%94%A8)

*   主题编辑器里 **空 blocks、空集合、空图** 各看一眼
*   同页加 **两个相同 section**，样式和 JS 是否还独立
*   跑 **[Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check)** （本地 CLI 或 CI），无关键报错再合并
*   手机宽度下 **点得到按钮、字不叠在图上**
*   若用了 `javascript` 或全局脚本，确认 **不泄漏全局变量**（IIFE 或 `type="module"`）

* * *

## 11\. 延伸阅读[](https://shopify.baoea.com/liquid/custom-sections#11-%E5%BB%B6%E4%BC%B8%E9%98%85%E8%AF%BB)

*   [自定义代码片段](https://shopify.baoea.com/liquid/custom-snippets) — 把卡片、媒体块抽成 `render`，section 只排版
*   [主题设置配置](https://shopify.baoea.com/liquid/theme-settings) — 全站色板、字体与 section 默认的关系
*   [响应式设计实现](https://shopify.baoea.com/liquid/responsive-design) — 断点与网格和主题 settings 的配合
*   [布局和模板](https://shopify.baoea.com/liquid/layout-templates) — `theme.liquid` 与 JSON 模板如何承接 section
*   [代码组织和结构](https://shopify.baoea.com/liquid/code-organization) — 目录与职责划分，避免 section 变成垃圾场
*   [Liquid 过滤器](https://shopify.baoea.com/liquid/filters) — `image_url` / `image_tag` 等
*   [电商功能实现](https://shopify.baoea.com/liquid/ecommerce-features) — 购物车、结账相关边界
*   [第三方集成](https://shopify.baoea.com/liquid/third-party-integrations) — 脚本与性能、隐私同意

官方 Section 与 schema 细节以 [Shopify Themes 文档](https://shopify.dev/docs/storefronts/themes)  与 [Section schema](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema)  为准；写 section 时手边常开 **Settings 输入类型** 一页，比背长示例快。
