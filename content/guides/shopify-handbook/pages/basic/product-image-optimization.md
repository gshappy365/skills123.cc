---
source_url: "https://shopify.baoea.com/basic/product-image-optimization"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:16"
fetch_method: "http"
content_hash: "b6083a41f5fb6e80899b0d9c3863d494147503dabc581ac8f40f3a578e36f0ad"
discovered_via: ["sitemap", "internal_link"]
---
在 Shopify 商店中，产品图片的质量直接影响客户的购买决策和网站性能。本指南将帮助您了解如何优化产品图片，提升店铺的加载速度和用户体验。

* * *

## 📐 推荐图片尺寸[](https://shopify.baoea.com/basic/product-image-optimization#-%E6%8E%A8%E8%8D%90%E5%9B%BE%E7%89%87%E5%B0%BA%E5%AF%B8)

### 主产品图片（方形图）[](https://shopify.baoea.com/basic/product-image-optimization#%E4%B8%BB%E4%BA%A7%E5%93%81%E5%9B%BE%E7%89%87%E6%96%B9%E5%BD%A2%E5%9B%BE)

*   **推荐尺寸：** 2048 × 2048 px
*   **最低要求：** 1024 × 1024 px
*   **优势：** 支持放大镜功能（zoom）和高清展示
*   **节省版本：** 1000 × 1000 px（平衡质量与加载速度）

### 不同页面推荐尺寸对照表[](https://shopify.baoea.com/basic/product-image-optimization#%E4%B8%8D%E5%90%8C%E9%A1%B5%E9%9D%A2%E6%8E%A8%E8%8D%90%E5%B0%BA%E5%AF%B8%E5%AF%B9%E7%85%A7%E8%A1%A8)

| 使用场景 | 推荐尺寸 | 比例 | 备注 |
| --- | --- | --- | --- |
| 产品详情页主图 | 2048 × 2048 px | 1:1 | 支持放大功能 |
| 集合页缩略图 | 800 × 800 px | 1:1 | 最低要求 |
| Banner横图 | 1920 × 1080 px | 16:9 | 适合幻灯片 |
| 服装展示图 | 1200 × 1500 px | 4:5 | 时尚行业常用 |
| 产品组合图 | 1200 × 800 px | 3:2 | 横向展示 |

### 比例选择建议[](https://shopify.baoea.com/basic/product-image-optimization#%E6%AF%94%E4%BE%8B%E9%80%89%E6%8B%A9%E5%BB%BA%E8%AE%AE)

**方形 (1:1)**

*   ✅ 最常见，适合大多数主题
*   ✅ 在集合页和详情页显示一致
*   ✅ 适合各行业产品，如电子产品、家居用品

**矩形 (4:5 或 3:4)**

*   ✅ 时尚/服装行业常用
*   ✅ 展示穿搭效果更佳
*   ⚠️ 需确保主题支持，有些主题是1:1的图片框，使用4:5或3:4的图片会被裁减为1:1的图片

**横向 (16:9)**

*   ✅ 适合 Banner、头图场景
*   ✅ 展示产品使用场景
*   ⚠️ 主要用于首页横幅

> **重要提示：** 保持所有产品图片使用统一比例，避免在集合页出现”对不齐”,“跳动”等效果，影响体验。

* * *

## 图片格式选择[](https://shopify.baoea.com/basic/product-image-optimization#%E5%9B%BE%E7%89%87%E6%A0%BC%E5%BC%8F%E9%80%89%E6%8B%A9)

### JPEG (JPG) - 推荐格式[](https://shopify.baoea.com/basic/product-image-optimization#jpeg-jpg---%E6%8E%A8%E8%8D%90%E6%A0%BC%E5%BC%8F)

*   ✅ 适合大多数产品图片
*   ✅ 压缩效果好，文件较小
*   ✅ 所有浏览器完美支持
*   ❌ 不支持透明背景

### PNG[](https://shopify.baoea.com/basic/product-image-optimization#png)

*   ✅ 支持透明背景
*   ✅ 适合 LOGO 或有透明元素的图片
*   ✅ 无损压缩
*   ❌ 文件体积较大

### WebP / AVIF - 新一代格式[](https://shopify.baoea.com/basic/product-image-optimization#webp--avif---%E6%96%B0%E4%B8%80%E4%BB%A3%E6%A0%BC%E5%BC%8F)

*   ✅ 体积比 JPEG 小 25-50%
*   ✅ 支持透明背景
*   ✅ 部分 Shopify 主题自动转换
*   ⚠️ 部分第三方插件不支持（解决方案：不支持时使用PNG或JPEG替代），需要浏览器支持（现代浏览器基本支持）

### GIF[](https://shopify.baoea.com/basic/product-image-optimization#gif)

*   ✅ 可展示动画效果（如 360° 展示）
*   ❌ 文件体积大
*   ❌ 不推荐用于静态产品图

**推荐策略：** 主要使用 JPEG，需要透明背景时使用 PNG，有条件可启用 WebP 自动转换。

* * *

## 文件大小控制[](https://shopify.baoea.com/basic/product-image-optimization#%E6%96%87%E4%BB%B6%E5%A4%A7%E5%B0%8F%E6%8E%A7%E5%88%B6)

### Shopify 限制[](https://shopify.baoea.com/basic/product-image-optimization#shopify-%E9%99%90%E5%88%B6)

*   **最大支持：** 20 MB/张
*   **实际建议：** 远小于此限制

### 推荐文件大小[](https://shopify.baoea.com/basic/product-image-optimization#%E6%8E%A8%E8%8D%90%E6%96%87%E4%BB%B6%E5%A4%A7%E5%B0%8F)

| 图片类型 | 推荐大小 | 最大限制 |
| --- | --- | --- |
| 产品主图 | 200-500 KB | 1 MB |
| 缩略图 | 50-200 KB | 300 KB |
| Banner 大图 | 500 KB - 1 MB | 2 MB |
| 详情页附图 | 200-400 KB | 800 KB |

### 文件大小对加载速度的影响，参考（3G网络）[](https://shopify.baoea.com/basic/product-image-optimization#%E6%96%87%E4%BB%B6%E5%A4%A7%E5%B0%8F%E5%AF%B9%E5%8A%A0%E8%BD%BD%E9%80%9F%E5%BA%A6%E7%9A%84%E5%BD%B1%E5%93%8D%E5%8F%82%E8%80%833g%E7%BD%91%E7%BB%9C)

```
图片大小 → 加载时间（3G网络）
100 KB  → 0.5 秒
500 KB  → 2.5 秒
1 MB    → 5 秒
2 MB    → 10 秒
```

> **性能提示：** 页面总图片大小建议控制在 3MB 以内，确保良好的用户体验。

* * *

## 图片压缩优化工具[](https://shopify.baoea.com/basic/product-image-optimization#%E5%9B%BE%E7%89%87%E5%8E%8B%E7%BC%A9%E4%BC%98%E5%8C%96%E5%B7%A5%E5%85%B7)

### 在线压缩工具[](https://shopify.baoea.com/basic/product-image-optimization#%E5%9C%A8%E7%BA%BF%E5%8E%8B%E7%BC%A9%E5%B7%A5%E5%85%B7)

#### 1\. TinyPNG（强烈推荐，个人使用了很多年）[](https://shopify.baoea.com/basic/product-image-optimization#1-tinypng%E5%BC%BA%E7%83%88%E6%8E%A8%E8%8D%90%E4%B8%AA%E4%BA%BA%E4%BD%BF%E7%94%A8%E4%BA%86%E5%BE%88%E5%A4%9A%E5%B9%B4)

*   **网址：** [https://tinypng.com/](https://tinypng.com/) 
*   **特点：**
    *   无损压缩，保持画质，压缩后图片质量损失很小
    *   支持 PNG 和 JPEG
    *   可压缩 50-90%
    *   批量处理功能，支持批量上传图片，批量下载压缩后的图片
    *   免费版每月 500 张，足够个人使用

**使用步骤：**

1.  访问 TinyPNG 官网
2.  拖拽图片到页面
3.  等待压缩完成
4.  下载压缩后的图片

#### 2\. Squoosh（Google 出品，个人使用过，压缩效果一般）[](https://shopify.baoea.com/basic/product-image-optimization#2-squooshgoogle-%E5%87%BA%E5%93%81%E4%B8%AA%E4%BA%BA%E4%BD%BF%E7%94%A8%E8%BF%87%E5%8E%8B%E7%BC%A9%E6%95%88%E6%9E%9C%E4%B8%80%E8%88%AC)

*   **网址：** [https://squoosh.app/](https://squoosh.app/) 
*   **特点：**
    *   完全免费
    *   支持多种格式
    *   实时预览压缩效果
    *   可调节压缩参数

#### 3\. Compressor.io（个人使用过，压缩效果一般）[](https://shopify.baoea.com/basic/product-image-optimization#3-compressorio%E4%B8%AA%E4%BA%BA%E4%BD%BF%E7%94%A8%E8%BF%87%E5%8E%8B%E7%BC%A9%E6%95%88%E6%9E%9C%E4%B8%80%E8%88%AC)

*   **网址：** [https://compressor.io/](https://compressor.io/) 
*   **特点：**
    *   支持多种格式
    *   有损/无损压缩选择
    *   批量处理

### 桌面软件[](https://shopify.baoea.com/basic/product-image-optimization#%E6%A1%8C%E9%9D%A2%E8%BD%AF%E4%BB%B6)

#### ImageOptim（Mac）[](https://shopify.baoea.com/basic/product-image-optimization#imageoptimmac)

*   拖拽即可压缩
*   批量处理
*   完全免费

#### RIOT（Windows）[](https://shopify.baoea.com/basic/product-image-optimization#riotwindows)

*   实时预览
*   多格式支持
*   精确控制压缩参数

### Shopify 应用[](https://shopify.baoea.com/basic/product-image-optimization#shopify-%E5%BA%94%E7%94%A8)

#### TinyIMG[](https://shopify.baoea.com/basic/product-image-optimization#tinyimg)

*   自动压缩上传的图片
*   SEO 优化功能
*   批量处理历史图片

* * *

## 图片优化最佳实践[](https://shopify.baoea.com/basic/product-image-optimization#%E5%9B%BE%E7%89%87%E4%BC%98%E5%8C%96%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5)

### 1\. 上传前优化流程[](https://shopify.baoea.com/basic/product-image-optimization#1-%E4%B8%8A%E4%BC%A0%E5%89%8D%E4%BC%98%E5%8C%96%E6%B5%81%E7%A8%8B)

```
原图 → 调整尺寸 → 格式转换 → 压缩优化 → 上传 Shopify
```

**详细步骤：**

1.  **尺寸调整：** 确保符合推荐尺寸
2.  **格式选择：** 根据需求选择 JPEG/PNG
3.  **压缩处理：** 使用 TinyPNG 等工具
4.  **质量检查：** 确保压缩后画质可接受
5.  **批量处理：** 保持所有图片规格一致

### 2\. 命名规范[](https://shopify.baoea.com/basic/product-image-optimization#2-%E5%91%BD%E5%90%8D%E8%A7%84%E8%8C%83)

**推荐命名格式：**

```
产品名-颜色-角度-序号.jpg
例如：iphone-15-black-front-01.jpg
```

**避免的命名：**

*   中文文件名
*   特殊字符
*   过长的文件名
*   IMG\_001.jpg 等无意义命名

### 3\. Alt 文本优化[](https://shopify.baoea.com/basic/product-image-optimization#3-alt-%E6%96%87%E6%9C%AC%E4%BC%98%E5%8C%96)

为每张图片添加描述性的 Alt 文本：

```
<!-- 好的例子 -->
<img alt="iPhone 15 黑色正面产品图" src="iphone-15-black-front.jpg">
 
<!-- 不好的例子 -->
<img alt="图片" src="img001.jpg">
```

### 4\. 图片数量建议[](https://shopify.baoea.com/basic/product-image-optimization#4-%E5%9B%BE%E7%89%87%E6%95%B0%E9%87%8F%E5%BB%BA%E8%AE%AE)

*   **产品主图：** 1 张高质量主图
*   **附加图片：** 3-8 张不同角度
*   **生活场景图：** 1-2 张使用场景
*   **细节图：** 根据产品复杂度

* * *

## 不同行业的图片策略[](https://shopify.baoea.com/basic/product-image-optimization#%E4%B8%8D%E5%90%8C%E8%A1%8C%E4%B8%9A%E7%9A%84%E5%9B%BE%E7%89%87%E7%AD%96%E7%95%A5)

### 服装行业[](https://shopify.baoea.com/basic/product-image-optimization#%E6%9C%8D%E8%A3%85%E8%A1%8C%E4%B8%9A)

*   **主图：** 模特穿着效果
*   **附图：** 平铺图、细节图、背面图
*   **比例：** 3:4 或 4:5 竖图
*   **背景：** 纯色或简洁背景

### 电子产品[](https://shopify.baoea.com/basic/product-image-optimization#%E7%94%B5%E5%AD%90%E4%BA%A7%E5%93%81)

*   **主图：** 45° 角展示产品
*   **附图：** 正面、背面、侧面、包装
*   **比例：** 1:1 方图
*   **背景：** 纯白色背景

### 家居用品[](https://shopify.baoea.com/basic/product-image-optimization#%E5%AE%B6%E5%B1%85%E7%94%A8%E5%93%81)

*   **主图：** 使用场景展示
*   **附图：** 产品细节、尺寸对比
*   **比例：** 根据产品形状选择
*   **背景：** 居家场景或纯色

* * *

## 技术进阶：响应式图片（需要有一定技术基础）[](https://shopify.baoea.com/basic/product-image-optimization#%E6%8A%80%E6%9C%AF%E8%BF%9B%E9%98%B6%E5%93%8D%E5%BA%94%E5%BC%8F%E5%9B%BE%E7%89%87%E9%9C%80%E8%A6%81%E6%9C%89%E4%B8%80%E5%AE%9A%E6%8A%80%E6%9C%AF%E5%9F%BA%E7%A1%80)

### 使用 srcset 属性[](https://shopify.baoea.com/basic/product-image-optimization#%E4%BD%BF%E7%94%A8-srcset-%E5%B1%9E%E6%80%A7)

```
<img src="product-800w.jpg"
     srcset="product-400w.jpg 400w,
             product-800w.jpg 800w,
             product-1200w.jpg 1200w"
     sizes="(max-width: 600px) 400px,
            (max-width: 1000px) 800px,
            1200px"
     alt="产品图片">
```

### Shopify 图片转换参数[](https://shopify.baoea.com/basic/product-image-optimization#shopify-%E5%9B%BE%E7%89%87%E8%BD%AC%E6%8D%A2%E5%8F%82%E6%95%B0)

```
<!-- 原图 -->
{{ product.featured_image | img_url }}
 
<!-- 指定尺寸 -->
{{ product.featured_image | img_url: '800x800' }}
 
<!-- 智能裁剪 -->
{{ product.featured_image | img_url: '800x600', crop: 'center' }}
```

* * *

## 常见错误与解决方案[](https://shopify.baoea.com/basic/product-image-optimization#%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF%E4%B8%8E%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88)

### 错误 1：图片过大导致加载缓慢[](https://shopify.baoea.com/basic/product-image-optimization#%E9%94%99%E8%AF%AF-1%E5%9B%BE%E7%89%87%E8%BF%87%E5%A4%A7%E5%AF%BC%E8%87%B4%E5%8A%A0%E8%BD%BD%E7%BC%93%E6%85%A2)

**症状：** 页面加载时间超过 5 秒 **解决：** 使用 TinyPNG 压缩，控制文件大小在 500KB 以内

### 错误 2：图片比例不统一[](https://shopify.baoea.com/basic/product-image-optimization#%E9%94%99%E8%AF%AF-2%E5%9B%BE%E7%89%87%E6%AF%94%E4%BE%8B%E4%B8%8D%E7%BB%9F%E4%B8%80)

**症状：** 集合页产品图片大小不一致 **解决：** 统一使用 1:1 比例，或在主题中设置固定展示比例

### 错误 3：图片质量过低[](https://shopify.baoea.com/basic/product-image-optimization#%E9%94%99%E8%AF%AF-3%E5%9B%BE%E7%89%87%E8%B4%A8%E9%87%8F%E8%BF%87%E4%BD%8E)

**症状：** 图片模糊，影响产品展示效果 **解决：** 使用至少 1000x1000 像素的原图，适度压缩

### 错误 4：缺少 Alt 文本[](https://shopify.baoea.com/basic/product-image-optimization#%E9%94%99%E8%AF%AF-4%E7%BC%BA%E5%B0%91-alt-%E6%96%87%E6%9C%AC)

**症状：** SEO 效果差，无障碍访问问题 **解决：** 为每张图片添加描述性的 Alt 文本

* * *

## 优化效果评估[](https://shopify.baoea.com/basic/product-image-optimization#%E4%BC%98%E5%8C%96%E6%95%88%E6%9E%9C%E8%AF%84%E4%BC%B0)

### 优化前后对比指标[](https://shopify.baoea.com/basic/product-image-optimization#%E4%BC%98%E5%8C%96%E5%89%8D%E5%90%8E%E5%AF%B9%E6%AF%94%E6%8C%87%E6%A0%87)

| 指标 | 优化前 | 优化后 | 改善幅度 |
| --- | --- | --- | --- |
| 页面加载时间 | 8 秒 | 3 秒 | 62% ↓ |
| 图片总大小 | 5 MB | 1.5 MB | 70% ↓ |
| 跳出率 | 65% | 45% | 31% ↓ |
| 转化率 | 2.1% | 3.2% | 52% ↑ |

### A/B 测试建议[](https://shopify.baoea.com/basic/product-image-optimization#ab-%E6%B5%8B%E8%AF%95%E5%BB%BA%E8%AE%AE)

1.  **测试不同图片数量：** 4张 vs 8张产品图
2.  **测试图片质量：** 高清大图 vs 压缩优化图
3.  **测试图片比例：** 方图 vs 矩形图
4.  **测试加载方式：** 懒加载 vs 预加载

* * *

## 专业提示[](https://shopify.baoea.com/basic/product-image-optimization#%E4%B8%93%E4%B8%9A%E6%8F%90%E7%A4%BA)

1.  **批量处理：** 使用 Photoshop 动作或在线工具批量调整图片尺寸
2.  **备份原图：** 始终保留高质量原图，以便后续使用
3.  **定期审查：** 每季度检查一次图片加载性能
4.  **移动优先：** 优先考虑移动端的图片展示效果
5.  **测试不同设备：** 在各种设备上测试图片显示效果

* * *

## 相关资源[](https://shopify.baoea.com/basic/product-image-optimization#%E7%9B%B8%E5%85%B3%E8%B5%84%E6%BA%90)

*   [TinyPNG 官网](https://tinypng.com/)  - 推荐的图片压缩工具
*   [Google PageSpeed Insights](https://pagespeed.web.dev/)  - 网站性能检测
*   [Shopify 图片要求官方文档](https://help.shopify.com/en/manual/products/product-media/product-images) 

* * *

## 进阶优化与补充（实战）[](https://shopify.baoea.com/basic/product-image-optimization#%E8%BF%9B%E9%98%B6%E4%BC%98%E5%8C%96%E4%B8%8E%E8%A1%A5%E5%85%85%E5%AE%9E%E6%88%98)

### 首屏 LCP 与 CLS 实战[](https://shopify.baoea.com/basic/product-image-optimization#%E9%A6%96%E5%B1%8F-lcp-%E4%B8%8E-cls-%E5%AE%9E%E6%88%98)

*   优先级：首屏最大内容绘制图像（LCP 图）应设置 `fetchpriority="high"`，并使用 `loading="eager"`
*   稳定布局：所有图片明确 `width` 与 `height`，或用 `aspect-ratio` 占位，避免 CLS
*   合理尺寸：结合 `srcset/sizes` 提供多档尺寸，避免在移动端下载超大图

```
<!-- 首屏主图（示例） -->
<img
  src="/images/hero-1200.jpg"
  alt="品牌主打产品展示"
  width="1200"
  height="800"
  fetchpriority="high"
  loading="eager"
  decoding="sync"
  srcset="/images/hero-800.jpg 800w, /images/hero-1200.jpg 1200w, /images/hero-1600.jpg 1600w"
  sizes="(max-width: 768px) 100vw, 80vw"
>
```

### Shopify Liquid 响应式（新写法优先）[](https://shopify.baoea.com/basic/product-image-optimization#shopify-liquid-%E5%93%8D%E5%BA%94%E5%BC%8F%E6%96%B0%E5%86%99%E6%B3%95%E4%BC%98%E5%85%88)

```
{%- assign img = product.featured_image -%}
{%- comment -%} 使用 image_url + image_tag 生成响应式图片 {%- endcomment -%}
{{ img | image_url: width: 1200 | image_tag:
  widths: [400, 800, 1200],
  sizes: '(max-width: 768px) 100vw, 50vw',
  loading: 'eager',
  alt: img.alt
}}
 
{%- comment -%} 非关键图统一懒加载 {%- endcomment -%}
{%- for media in product.media -%}
  {{ media | image_url: width: 800 | image_tag:
    widths: [400, 800],
    sizes: '(max-width: 768px) 100vw, 33vw',
    loading: 'lazy',
    decoding: 'async',
    alt: media.alt
  }}
{%- endfor -%}
```

> 提示：若已知固有尺寸，请同时输出 `width` 与 `height` 以避免 CLS；或用容器样式 `style="aspect-ratio: 1 / 1"` 占位

### 懒加载与解码策略[](https://shopify.baoea.com/basic/product-image-optimization#%E6%87%92%E5%8A%A0%E8%BD%BD%E4%B8%8E%E8%A7%A3%E7%A0%81%E7%AD%96%E7%95%A5)

*   非首屏图片：`loading="lazy"` + `decoding="async"`
*   首屏 LCP 图：`loading="eager"` + `fetchpriority="high"`
*   交互后出现的图片：在交互时再插入 DOM，进一步减少初始负载

### `<picture>` 使用次世代格式并回退[](https://shopify.baoea.com/basic/product-image-optimization#picture-%E4%BD%BF%E7%94%A8%E6%AC%A1%E4%B8%96%E4%BB%A3%E6%A0%BC%E5%BC%8F%E5%B9%B6%E5%9B%9E%E9%80%80)

```
<picture>
  <source type="image/avif" srcset="/p/product-800.avif 800w, /p/product-1200.avif 1200w">
  <source type="image/webp" srcset="/p/product-800.webp 800w, /p/product-1200.webp 1200w">
  <img
    src="/p/product-1200.jpg"
    alt="产品细节图"
    width="1200"
    height="1200"
    loading="lazy"
    decoding="async"
    sizes="(max-width: 768px) 100vw, 600px"
  >
  <!-- 浏览器不支持 avif/webp 时回退到 jpg -->
  
</picture>
```

### 占位图（LQIP/Blur-up）策略[](https://shopify.baoea.com/basic/product-image-optimization#%E5%8D%A0%E4%BD%8D%E5%9B%BElqipblur-up%E7%AD%96%E7%95%A5)

*   生成极小尺寸的低清图作为占位，图片加载完成后再替换为高清图
*   Shopify 可用 `image_url: width: 24` 生成 LQIP，再用 JS 替换为大图

```
{%- assign img = product.featured_image -%}
{%- assign lqip = img | image_url: width: 24 -%}
<img
  src="{{ lqip }}"
  data-src="{{ img | image_url: width: 800 }}"
  alt="{{ img.alt }}"
  width="800"
  height="800"
  loading="lazy"
  decoding="async"
  class="blur-up"
>
```

```
<script>
document.addEventListener("DOMContentLoaded", () => {
  const imgs = document.querySelectorAll("img[data-src]")
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const el = entry.target
      el.src = el.dataset.src
      el.addEventListener("load", () => el.classList.remove("blur-up"), { once: true })
      el.removeAttribute("data-src")
      io.unobserve(el)
    })
  })
  imgs.forEach(img => io.observe(img))
})
</script>
```

> 样式建议：`.blur-up { filter: blur(12px); transition: filter .3s } .blur-up:not([data-src]) { filter: none }`

### 色彩与元数据[](https://shopify.baoea.com/basic/product-image-optimization#%E8%89%B2%E5%BD%A9%E4%B8%8E%E5%85%83%E6%95%B0%E6%8D%AE)

*   统一导出为 sRGB，避免不同设备色偏
*   去除 EXIF/地理位置等元数据，减小体积并保护隐私
*   对 JPEG 启用渐进式（Progressive），在网络较差时更友好

### 自动化与 CI 压缩[](https://shopify.baoea.com/basic/product-image-optimization#%E8%87%AA%E5%8A%A8%E5%8C%96%E4%B8%8E-ci-%E5%8E%8B%E7%BC%A9)

```
name: Optimize images
on:
  pull_request:
    paths:
      - "public/**/*.{png,jpg,jpeg,webp,avif}"
jobs:
  imagemin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: calibreapp/image-actions@v1
        with:
          githubToken: "${{ secrets.GITHUB_TOKEN }}"
```

### SEO 与无障碍（a11y）[](https://shopify.baoea.com/basic/product-image-optimization#seo-%E4%B8%8E%E6%97%A0%E9%9A%9C%E7%A2%8Da11y)

*   装饰性图片使用空 `alt` 并隐藏可达性：`alt="" aria-hidden="true"`
*   结构化数据为 `Product` 提供 `image` 数组，提升富结果机会

```
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "示例产品",
  "image": [
    "https://cdn.shopify.com/s/files/1/xxxx/hero.jpg",
    "https://cdn.shopify.com/s/files/1/xxxx/angle.jpg"
  ]
}
</script>
```

### 性能预算与监控[](https://shopify.baoea.com/basic/product-image-optimization#%E6%80%A7%E8%83%BD%E9%A2%84%E7%AE%97%E4%B8%8E%E7%9B%91%E6%8E%A7)

*   目标：LCP ≤ 2.5s，CLS ≤ 0.1，INP ≤ 200ms（或 FID ≤ 100ms）
*   图片预算：首屏总图片 ≤ 300–500KB，单张关键图 ≤ 200–250KB（移动端）
*   持续用 Lighthouse/PageSpeed 与 RUM 监控关键页面

```
[
  {
    "path": "/*",
    "resourceSizes": [{ "resourceType": "image", "budget": 500 }],
    "timings": [{ "metric": "interactive", "budget": 4000 }]
  }
]
```

### 其他建议[](https://shopify.baoea.com/basic/product-image-optimization#%E5%85%B6%E4%BB%96%E5%BB%BA%E8%AE%AE)

*   预连接 Shopify CDN：

```
<link rel="preconnect" href="https://cdn.shopify.com" crossorigin>
```

这一点Shopify 主题一般都会做好

*   动画优先使用视频或 WebM/animated WebP，避免体积巨大的 GIF

## 总结[](https://shopify.baoea.com/basic/product-image-optimization#%E6%80%BB%E7%BB%93)

优化 Shopify 产品图片是提升店铺性能和用户体验的重要环节。通过合理的尺寸设置、格式选择和压缩优化，可以显著改善页面加载速度，提高转化率。记住要：

1.  **保持一致性** - 统一图片规格和风格
2.  **平衡质量与性能** - 在画质和文件大小间找到最佳平衡点
3.  **持续优化** - 定期检查和改进图片策略
4.  **关注数据** - 用实际数据验证优化效果

从现在开始实施这些优化建议，您将看到店铺性能的明显改善！
