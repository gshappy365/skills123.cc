---
source_url: "https://shopify.baoea.com/liquid/testing-deployment"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:43:10"
fetch_method: "http"
content_hash: "1912a0a9cdb70d40339d3384df7f4c387b06ecc1a2d269d87886c51fbd142d93"
discovered_via: ["sitemap", "internal_link"]
---
## 测试和部署

本指南将详细介绍 Shopify 主题开发的测试策略、部署流程和性能优化方法，确保项目的高质量交付。

## 测试策略[](https://shopify.baoea.com/liquid/testing-deployment#%E6%B5%8B%E8%AF%95%E7%AD%96%E7%95%A5)

### 1\. 功能测试清单[](https://shopify.baoea.com/liquid/testing-deployment#1-%E5%8A%9F%E8%83%BD%E6%B5%8B%E8%AF%95%E6%B8%85%E5%8D%95)

```
# Shopify 主题功能测试清单
 
## 基础功能测试
- [ ] 主页加载正常
- [ ] 导航菜单功能正常
- [ ] 搜索功能正常
- [ ] 产品页面显示正确
- [ ] 集合页面显示正确
- [ ] 购物车功能正常
- [ ] 结账流程无误
 
## 响应式测试
- [ ] 移动端 (320px - 767px)
- [ ] 平板端 (768px - 1023px)
- [ ] 桌面端 (1024px+)
- [ ] 超大屏幕 (1440px+)
 
## 浏览器兼容性
- [ ] Chrome (最新版本)
- [ ] Firefox (最新版本)
- [ ] Safari (最新版本)
- [ ] Edge (最新版本)
- [ ] 移动端浏览器
 
## 性能测试
- [ ] 页面加载速度 < 3秒
- [ ] 图片优化正常
- [ ] JavaScript 无错误
- [ ] CSS 无冲突
 
## SEO 测试
- [ ] Meta 标签正确
- [ ] 结构化数据有效
- [ ] 图片 Alt 属性完整
- [ ] 链接结构合理
 
## 可访问性测试
- [ ] 键盘导航正常
- [ ] 屏幕阅读器友好
- [ ] 颜色对比度符合标准
- [ ] ARIA 标签正确
```

### 2\. 自动化测试脚本[](https://shopify.baoea.com/liquid/testing-deployment#2-%E8%87%AA%E5%8A%A8%E5%8C%96%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC)

```
// tests/theme-tests.js
const { test, expect } = require('@playwright/test');
 
// 基础页面测试
test.describe('基础页面功能', () => {
  test('主页加载测试', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.*首页.*/);
    
    // 检查关键元素
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
  
  test('导航菜单测试', async ({ page }) => {
    await page.goto('/');
    
    // 桌面端导航
    await expect(page.locator('.main-navigation')).toBeVisible();
    
    // 移动端导航
    await page.setViewportSize({ width: 375, height: 812 });
    await page.locator('[data-mobile-menu-toggle]').click();
    await expect(page.locator('.navigation-menu')).toHaveClass(/active/);
  });
  
  test('搜索功能测试', async ({ page }) => {
    await page.goto('/');
    
    // 搜索输入
    await page.fill('[data-search-input]', '测试产品');
    await page.press('[data-search-input]', 'Enter');
    
    // 验证搜索结果页面
    await expect(page).toHaveURL(/.*search.*/);
    await expect(page.locator('.search-results')).toBeVisible();
  });
});
 
// 产品页面测试
test.describe('产品页面功能', () => {
  test('产品页面基础功能', async ({ page }) => {
    await page.goto('/products/test-product');
    
    // 检查产品信息
    await expect(page.locator('.product-title')).toBeVisible();
    await expect(page.locator('.product-price')).toBeVisible();
    await expect(page.locator('.product-gallery')).toBeVisible();
    
    // 检查变体选择器
    const variantSelector = page.locator('[data-variant-selector]');
    if (await variantSelector.count() > 0) {
      await expect(variantSelector).toBeVisible();
    }
  });
  
  test('添加到购物车功能', async ({ page }) => {
    await page.goto('/products/test-product');
    
    // 添加到购物车
    await page.click('[data-add-to-cart]');
    
    // 验证购物车抽屉打开
    await expect(page.locator('[data-cart-drawer]')).toHaveClass(/is-open/);
    
    // 验证商品已添加
    await expect(page.locator('[data-cart-count]')).not.toHaveText('0');
  });
});
 
// 响应式测试
test.describe('响应式设计测试', () => {
  const devices = [
    { name: '移动端', width: 375, height: 812 },
    { name: '平板端', width: 768, height: 1024 },
    { name: '桌面端', width: 1280, height: 800 }
  ];
  
  devices.forEach(device => {
    test(`${device.name}布局测试`, async ({ page }) => {
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.goto('/');
      
      // 检查布局元素
      await expect(page.locator('.container')).toBeVisible();
      
      // 检查导航适配
      if (device.width < 768) {
        await expect(page.locator('.mobile-menu-toggle')).toBeVisible();
      } else {
        await expect(page.locator('.navigation-list')).toBeVisible();
      }
    });
  });
});
 
// 性能测试
test.describe('性能测试', () => {
  test('页面加载性能', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - start;
    
    // 页面加载时间应小于3秒
    expect(loadTime).toBeLessThan(3000);
  });
  
  test('图片懒加载测试', async ({ page }) => {
    await page.goto('/collections/all');
    
    // 检查懒加载图片
    const lazyImages = page.locator('img.lazyload');
    const imageCount = await lazyImages.count();
    
    if (imageCount > 0) {
      // 滚动页面触发懒加载
      await page.evaluate(() => window.scrollTo(0, window.innerHeight));
      await page.waitForTimeout(1000);
      
      // 验证图片已加载
      await expect(lazyImages.first()).toHaveAttribute('src', /.+/);
    }
  });
});
```

### 3\. CSS 和 JavaScript 验证[](https://shopify.baoea.com/liquid/testing-deployment#3-css-%E5%92%8C-javascript-%E9%AA%8C%E8%AF%81)

```
// tests/code-quality.js
const { test, expect } = require('@playwright/test');
 
test.describe('代码质量测试', () => {
  test('JavaScript 错误检查', async ({ page }) => {
    const errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    
    // 触发一些交互
    await page.click('[data-mobile-menu-toggle]');
    await page.fill('[data-search-input]', '测试');
    
    // 验证无 JavaScript 错误
    expect(errors).toHaveLength(0);
  });
  
  test('CSS 加载验证', async ({ page }) => {
    await page.goto('/');
    
    // 检查关键 CSS 样式
    const header = page.locator('header');
    const headerStyles = await header.evaluate(el => {
      return window.getComputedStyle(el);
    });
    
    // 验证样式已正确应用
    expect(headerStyles.display).not.toBe('none');
  });
  
  test('表单验证测试', async ({ page }) => {
    // 测试邮件订阅表单
    await page.goto('/');
    
    const newsletterForm = page.locator('[data-newsletter-form]');
    if (await newsletterForm.count() > 0) {
      // 空表单提交
      await page.click('button[type="submit"]');
      
      // 验证验证消息
      const emailInput = page.locator('input[type="email"]');
      const validationMessage = await emailInput.evaluate(el => el.validationMessage);
      expect(validationMessage).toBeTruthy();
      
      // 有效邮箱测试
      await page.fill('input[type="email"]', 'test@example.com');
      await page.click('button[type="submit"]');
      
      // 验证提交成功
      await expect(page.locator('.newsletter-message')).toBeVisible();
    }
  });
});
```

## 性能优化[](https://shopify.baoea.com/liquid/testing-deployment#%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96)

### 1\. 图片优化脚本[](https://shopify.baoea.com/liquid/testing-deployment#1-%E5%9B%BE%E7%89%87%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC)

```
// scripts/optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
 
class ImageOptimizer {
  constructor(inputDir, outputDir) {
    this.inputDir = inputDir;
    this.outputDir = outputDir;
    this.supportedFormats = ['.jpg', '.jpeg', '.png', '.webp'];
  }
  
  async optimizeDirectory() {
    const files = fs.readdirSync(this.inputDir);
    
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      
      if (this.supportedFormats.includes(ext)) {
        await this.optimizeImage(file);
      }
    }
  }
  
  async optimizeImage(filename) {
    const inputPath = path.join(this.inputDir, filename);
    const outputPath = path.join(this.outputDir, filename);
    
    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();
      
      // 生成多种尺寸
      const sizes = [400, 600, 800, 1200, 1600];
      
      for (const size of sizes) {
        if (metadata.width > size) {
          const resizedPath = path.join(
            this.outputDir, 
            `${path.parse(filename).name}_${size}w${path.extname(filename)}`
          );
          
          await image
            .resize(size, null, { withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toFile(resizedPath);
        }
      }
      
      // 生成 WebP 格式
      const webpPath = path.join(
        this.outputDir,
        `${path.parse(filename).name}.webp`
      );
      
      await image
        .webp({ quality: 80 })
        .toFile(webpPath);
      
      console.log(`✓ 优化完成: ${filename}`);
      
    } catch (error) {
      console.error(`✗ 优化失败: ${filename}`, error);
    }
  }
}
 
// 使用方法
const optimizer = new ImageOptimizer('./assets/images', './assets/optimized');
optimizer.optimizeDirectory();
```

### 2\. CSS 和 JavaScript 压缩[](https://shopify.baoea.com/liquid/testing-deployment#2-css-%E5%92%8C-javascript-%E5%8E%8B%E7%BC%A9)

```
// scripts/minify-assets.js
const fs = require('fs');
const path = require('path');
const terser = require('terser');
const CleanCSS = require('clean-css');
 
class AssetMinifier {
  constructor() {
    this.cleanCSS = new CleanCSS({
      level: 2,
      returnPromise: true
    });
  }
  
  async minifyJavaScript(inputPath, outputPath) {
    try {
      const code = fs.readFileSync(inputPath, 'utf8');
      const result = await terser.minify(code, {
        compress: {
          drop_console: true,
          drop_debugger: true
        },
        mangle: true
      });
      
      if (result.error) {
        throw result.error;
      }
      
      fs.writeFileSync(outputPath, result.code);
      console.log(`✓ JS压缩完成: ${path.basename(inputPath)}`);
      
    } catch (error) {
      console.error(`✗ JS压缩失败: ${path.basename(inputPath)}`, error);
    }
  }
  
  async minifyCSS(inputPath, outputPath) {
    try {
      const css = fs.readFileSync(inputPath, 'utf8');
      const result = await this.cleanCSS.minify(css);
      
      if (result.errors.length > 0) {
        throw new Error(result.errors.join('\n'));
      }
      
      fs.writeFileSync(outputPath, result.styles);
      console.log(`✓ CSS压缩完成: ${path.basename(inputPath)}`);
      
    } catch (error) {
      console.error(`✗ CSS压缩失败: ${path.basename(inputPath)}`, error);
    }
  }
  
  async processDirectory(inputDir, outputDir) {
    const files = fs.readdirSync(inputDir);
    
    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file);
      const ext = path.extname(file);
      
      if (ext === '.js') {
        await this.minifyJavaScript(inputPath, outputPath);
      } else if (ext === '.css') {
        await this.minifyCSS(inputPath, outputPath);
      }
    }
  }
}
 
// 使用方法
const minifier = new AssetMinifier();
minifier.processDirectory('./assets/dev', './assets/dist');
```

### 3\. 性能监控脚本[](https://shopify.baoea.com/liquid/testing-deployment#3-%E6%80%A7%E8%83%BD%E7%9B%91%E6%8E%A7%E8%84%9A%E6%9C%AC)

```
<!-- snippets/performance-monitor.liquid -->
<script>
  // 性能监控
  class PerformanceMonitor {
    constructor() {
      this.metrics = {};
      this.init();
    }
    
    init() {
      // 页面加载完成后收集性能数据
      window.addEventListener('load', () => {
        this.collectMetrics();
      });
    }
    
    collectMetrics() {
      if (!window.performance) return;
      
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      this.metrics = {
        // 页面加载时间
        pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        
        // DNS 查询时间
        dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
        
        // 连接时间
        connectTime: navigation.connectEnd - navigation.connectStart,
        
        // 请求响应时间
        responseTime: navigation.responseEnd - navigation.requestStart,
        
        // DOM 构建时间
        domTime: navigation.domContentLoadedEventEnd - navigation.responseEnd,
        
        // 首次内容绘制
        firstContentfulPaint: this.getPaintTime('first-contentful-paint'),
        
        // 最大内容绘制
        largestContentfulPaint: this.getLCP()
      };
      
      this.reportMetrics();
    }
    
    getPaintTime(paintType) {
      const paintEntries = performance.getEntriesByType('paint');
      const paint = paintEntries.find(entry => entry.name === paintType);
      return paint ? paint.startTime : null;
    }
    
    getLCP() {
      return new Promise((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    }
    
    reportMetrics() {
      // 发送性能数据到分析服务
      if (window.gtag) {
        gtag('event', 'performance_metrics', {
          page_load_time: Math.round(this.metrics.pageLoadTime),
          dns_time: Math.round(this.metrics.dnsTime),
          response_time: Math.round(this.metrics.responseTime)
        });
      }
      
      // 控制台输出（开发环境）
      {% if settings.debug_mode %}
        console.table(this.metrics);
      {% endif %}
      
      // 性能警告
      this.checkPerformanceThresholds();
    }
    
    checkPerformanceThresholds() {
      const warnings = [];
      
      if (this.metrics.pageLoadTime > 3000) {
        warnings.push('页面加载时间超过3秒');
      }
      
      if (this.metrics.firstContentfulPaint > 1500) {
        warnings.push('首次内容绘制时间过长');
      }
      
      if (warnings.length > 0) {
        console.warn('性能警告:', warnings);
      }
    }
  }
  
  // 初始化性能监控
  new PerformanceMonitor();
</script>
```

## 部署流程[](https://shopify.baoea.com/liquid/testing-deployment#%E9%83%A8%E7%BD%B2%E6%B5%81%E7%A8%8B)

### 1\. 部署前检查清单[](https://shopify.baoea.com/liquid/testing-deployment#1-%E9%83%A8%E7%BD%B2%E5%89%8D%E6%A3%80%E6%9F%A5%E6%B8%85%E5%8D%95)

```
#!/bin/bash
# scripts/pre-deploy-check.sh
 
echo "🔍 开始部署前检查..."
 
# 1. 代码质量检查
echo "📋 检查代码质量..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ 代码质量检查失败"
  exit 1
fi
 
# 2. 运行测试
echo "🧪 运行测试..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ 测试失败"
  exit 1
fi
 
# 3. 构建资源
echo "🔨 构建资源..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ 构建失败"
  exit 1
fi
 
# 4. 检查文件大小
echo "📏 检查资源文件大小..."
find assets -name "*.js" -size +100k -exec echo "⚠️  JavaScript文件过大: {}" \;
find assets -name "*.css" -size +50k -exec echo "⚠️  CSS文件过大: {}" \;
 
# 5. 验证关键文件
echo "📂 验证关键文件..."
required_files=(
  "layout/theme.liquid"
  "templates/index.liquid"
  "templates/product.liquid"
  "templates/collection.liquid"
  "templates/cart.liquid"
)
 
for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ 缺少关键文件: $file"
    exit 1
  fi
done
 
echo "✅ 部署前检查通过"
```

### 2\. 自动化部署脚本[](https://shopify.baoea.com/liquid/testing-deployment#2-%E8%87%AA%E5%8A%A8%E5%8C%96%E9%83%A8%E7%BD%B2%E8%84%9A%E6%9C%AC)

```
// scripts/deploy.js
const { execSync } = require('child_process');
const fs = require('fs');
 
class ShopifyDeployer {
  constructor(config) {
    this.config = config;
    this.themeName = `${config.themeName}-${new Date().toISOString().slice(0, 10)}`;
  }
  
  async deploy() {
    try {
      console.log('🚀 开始部署流程...');
      
      // 1. 运行部署前检查
      await this.preDeployCheck();
      
      // 2. 创建新主题
      await this.createTheme();
      
      // 3. 上传文件
      await this.uploadFiles();
      
      // 4. 部署后验证
      await this.postDeployValidation();
      
      console.log('✅ 部署完成');
      
    } catch (error) {
      console.error('❌ 部署失败:', error);
      process.exit(1);
    }
  }
  
  async preDeployCheck() {
    console.log('📋 执行部署前检查...');
    
    try {
      execSync('bash scripts/pre-deploy-check.sh', { stdio: 'inherit' });
    } catch (error) {
      throw new Error('部署前检查失败');
    }
  }
  
  async createTheme() {
    console.log('🎨 创建新主题...');
    
    try {
      const command = `shopify theme push --unpublished --theme-name="${this.themeName}"`;
      execSync(command, { stdio: 'inherit' });
    } catch (error) {
      throw new Error('创建主题失败');
    }
  }
  
  async uploadFiles() {
    console.log('📤 上传文件...');
    
    // 获取主题ID
    const themeListOutput = execSync('shopify theme list --json').toString();
    const themes = JSON.parse(themeListOutput);
    const newTheme = themes.find(theme => theme.name === this.themeName);
    
    if (!newTheme) {
      throw new Error('找不到新创建的主题');
    }
    
    this.themeId = newTheme.id;
    
    // 上传特定文件类型
    const fileTypes = ['templates', 'sections', 'snippets', 'assets', 'config'];
    
    for (const type of fileTypes) {
      if (fs.existsSync(type)) {
        console.log(`📁 上传 ${type} 文件...`);
        execSync(`shopify theme push --theme=${this.themeId} --only=${type}/*`, { stdio: 'inherit' });
      }
    }
  }
  
  async postDeployValidation() {
    console.log('🔍 部署后验证...');
    
    // 获取主题预览URL
    const themeInfoOutput = execSync(`shopify theme info --theme=${this.themeId} --json`).toString();
    const themeInfo = JSON.parse(themeInfoOutput);
    const previewUrl = themeInfo.preview_url;
    
    console.log(`🔗 主题预览链接: ${previewUrl}`);
    
    // 运行快速验证测试
    try {
      execSync(`npm run test:smoke -- --url=${previewUrl}`, { stdio: 'inherit' });
      console.log('✅ 快速验证通过');
    } catch (error) {
      console.warn('⚠️  快速验证失败，请手动检查');
    }
  }
}
 
// 配置和执行部署
const config = {
  themeName: process.env.THEME_NAME || 'Custom-Theme',
  store: process.env.SHOPIFY_STORE,
  environment: process.env.NODE_ENV || 'development'
};
 
const deployer = new ShopifyDeployer(config);
deployer.deploy();
```

### 3\. CI/CD 配置[](https://shopify.baoea.com/liquid/testing-deployment#3-cicd-%E9%85%8D%E7%BD%AE)

```
# .github/workflows/deploy.yml
name: 部署到Shopify
 
on:
  push:
    branches:
      - main
      - staging
  pull_request:
    branches:
      - main
 
jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: 设置 Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: 安装依赖
      run: npm ci
    
    - name: 运行测试
      run: npm test
    
    - name: 代码质量检查
      run: npm run lint
    
    - name: 构建资源
      run: npm run build
    
    - name: 上传测试结果
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: test-results
        path: test-results/
 
  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: 设置 Shopify CLI
      uses: shopify/cli-action@v1
    
    - name: 部署到测试环境
      env:
        SHOPIFY_CLI_THEME_TOKEN: ${{ secrets.SHOPIFY_STAGING_TOKEN }}
        SHOPIFY_STORE: ${{ secrets.SHOPIFY_STAGING_STORE }}
      run: |
        shopify theme push --unpublished --theme-name="staging-$(date +%Y%m%d-%H%M%S)"
 
  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - uses: actions/checkout@v3
    
    - name: 设置 Shopify CLI
      uses: shopify/cli-action@v1
    
    - name: 部署到生产环境
      env:
        SHOPIFY_CLI_THEME_TOKEN: ${{ secrets.SHOPIFY_PRODUCTION_TOKEN }}
        SHOPIFY_STORE: ${{ secrets.SHOPIFY_PRODUCTION_STORE }}
      run: |
        shopify theme push --unpublished --theme-name="production-$(date +%Y%m%d-%H%M%S)"
    
    - name: 发送部署通知
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        text: '🚀 生产环境部署完成'
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
      if: always()
```

## 监控和维护[](https://shopify.baoea.com/liquid/testing-deployment#%E7%9B%91%E6%8E%A7%E5%92%8C%E7%BB%B4%E6%8A%A4)

### 1\. 错误监控[](https://shopify.baoea.com/liquid/testing-deployment#1-%E9%94%99%E8%AF%AF%E7%9B%91%E6%8E%A7)

```
<!-- snippets/error-monitoring.liquid -->
<script>
  // 全局错误监控
  class ErrorMonitor {
    constructor() {
      this.errors = [];
      this.init();
    }
    
    init() {
      // JavaScript 错误监控
      window.addEventListener('error', (event) => {
        this.logError({
          type: 'javascript',
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        });
      });
      
      // Promise 错误监控
      window.addEventListener('unhandledrejection', (event) => {
        this.logError({
          type: 'promise',
          message: event.reason?.message || event.reason,
          stack: event.reason?.stack,
          timestamp: new Date().toISOString(),
          url: window.location.href
        });
      });
      
      // 定期发送错误报告
      setInterval(() => {
        this.sendErrorReport();
      }, 30000); // 每30秒发送一次
    }
    
    logError(error) {
      this.errors.push(error);
      
      // 控制台输出
      console.error('错误记录:', error);
      
      // 立即发送严重错误
      if (this.isCriticalError(error)) {
        this.sendErrorReport([error]);
      }
    }
    
    isCriticalError(error) {
      const criticalPatterns = [
        /payment/i,
        /checkout/i,
        /cart/i,
        /order/i
      ];
      
      return criticalPatterns.some(pattern => 
        pattern.test(error.message) || pattern.test(error.filename)
      );
    }
    
    async sendErrorReport(errors = null) {
      const errorsToSend = errors || this.errors.splice(0);
      
      if (errorsToSend.length === 0) return;
      
      try {
        // 发送到错误监控服务
        await fetch('/api/errors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            shop: {{ shop.permanent_domain | json }},
            theme: {{ theme.name | json }},
            errors: errorsToSend
          })
        });
        
      } catch (error) {
        console.error('发送错误报告失败:', error);
        // 重新加入队列
        this.errors.unshift(...errorsToSend);
      }
    }
  }
  
  // 初始化错误监控
  if (typeof window !== 'undefined') {
    new ErrorMonitor();
  }
</script>
```

### 2\. 性能监控仪表板[](https://shopify.baoea.com/liquid/testing-deployment#2-%E6%80%A7%E8%83%BD%E7%9B%91%E6%8E%A7%E4%BB%AA%E8%A1%A8%E6%9D%BF)

```
// scripts/performance-dashboard.js
class PerformanceDashboard {
  constructor() {
    this.metrics = new Map();
    this.thresholds = {
      pageLoadTime: 3000,
      firstContentfulPaint: 1500,
      largestContentfulPaint: 2500,
      cumulativeLayoutShift: 0.1
    };
  }
  
  async generateReport() {
    const pages = [
      '/',
      '/collections/all',
      '/products/sample-product',
      '/cart'
    ];
    
    const results = [];
    
    for (const page of pages) {
      const metrics = await this.measurePage(page);
      results.push({
        url: page,
        metrics: metrics,
        status: this.evaluatePerformance(metrics)
      });
    }
    
    this.generateHTML(results);
    return results;
  }
  
  async measurePage(url) {
    // 使用 Lighthouse 或其他性能测试工具
    const lighthouse = require('lighthouse');
    const chromeLauncher = require('chrome-launcher');
    
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = { logLevel: 'info', output: 'json', port: chrome.port };
    const runnerResult = await lighthouse(url, options);
    
    await chrome.kill();
    
    const audits = runnerResult.lhr.audits;
    
    return {
      performanceScore: runnerResult.lhr.categories.performance.score * 100,
      firstContentfulPaint: audits['first-contentful-paint'].numericValue,
      largestContentfulPaint: audits['largest-contentful-paint'].numericValue,
      cumulativeLayoutShift: audits['cumulative-layout-shift'].numericValue,
      speedIndex: audits['speed-index'].numericValue,
      timeToInteractive: audits['interactive'].numericValue
    };
  }
  
  evaluatePerformance(metrics) {
    const issues = [];
    
    Object.entries(this.thresholds).forEach(([key, threshold]) => {
      if (metrics[key] > threshold) {
        issues.push(`${key} 超过阈值 (${metrics[key]} > ${threshold})`);
      }
    });
    
    return {
      passed: issues.length === 0,
      issues: issues,
      score: metrics.performanceScore
    };
  }
  
  generateHTML(results) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>性能监控报告</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .metric-card { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
    .passed { border-color: #4caf50; background-color: #f1f8e9; }
    .failed { border-color: #f44336; background-color: #ffebee; }
    .metric { margin: 5px 0; }
    .score { font-size: 24px; font-weight: bold; }
  </style>
</head>
<body>
  <h1>性能监控报告</h1>
  <p>生成时间: ${new Date().toLocaleString()}</p>
  
  ${results.map(result => `
    <div class="metric-card ${result.status.passed ? 'passed' : 'failed'}">
      <h2>${result.url}</h2>
      <div class="score">性能得分: ${result.metrics.performanceScore.toFixed(1)}/100</div>
      
      <div class="metric">首次内容绘制: ${result.metrics.firstContentfulPaint.toFixed(0)}ms</div>
      <div class="metric">最大内容绘制: ${result.metrics.largestContentfulPaint.toFixed(0)}ms</div>
      <div class="metric">累积布局偏移: ${result.metrics.cumulativeLayoutShift.toFixed(3)}</div>
      <div class="metric">交互时间: ${result.metrics.timeToInteractive.toFixed(0)}ms</div>
      
      ${result.status.issues.length > 0 ? `
        <h3>问题:</h3>
        <ul>
          ${result.status.issues.map(issue => `<li>${issue}</li>`).join('')}
        </ul>
      ` : '<p>✅ 所有指标都在正常范围内</p>'}
    </div>
  `).join('')}
</body>
</html>
    `;
    
    require('fs').writeFileSync('performance-report.html', html);
    console.log('性能报告已生成: performance-report.html');
  }
}
 
// 生成性能报告
const dashboard = new PerformanceDashboard();
dashboard.generateReport();
```

## 最佳实践总结[](https://shopify.baoea.com/liquid/testing-deployment#%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5%E6%80%BB%E7%BB%93)

### 1\. 开发工作流[](https://shopify.baoea.com/liquid/testing-deployment#1-%E5%BC%80%E5%8F%91%E5%B7%A5%E4%BD%9C%E6%B5%81)

1.  **版本控制**: 使用 Git 进行版本管理
2.  **分支策略**: 采用 GitFlow 或 GitHub Flow
3.  **代码审查**: 所有代码必须经过审查
4.  **自动化测试**: 集成持续测试
5.  **部署流程**: 自动化部署到不同环境

### 2\. 质量保证[](https://shopify.baoea.com/liquid/testing-deployment#2-%E8%B4%A8%E9%87%8F%E4%BF%9D%E8%AF%81)

1.  **测试覆盖**: 确保关键功能测试覆盖
2.  **性能监控**: 持续监控网站性能
3.  **错误跟踪**: 实时监控和处理错误
4.  **用户反馈**: 收集和处理用户反馈

### 3\. 维护策略[](https://shopify.baoea.com/liquid/testing-deployment#3-%E7%BB%B4%E6%8A%A4%E7%AD%96%E7%95%A5)

1.  **定期更新**: 保持主题和依赖的更新
2.  **安全检查**: 定期进行安全审计
3.  **备份策略**: 定期备份重要文件
4.  **文档维护**: 保持文档的及时更新

通过完善的测试和部署流程，您可以确保 Shopify 主题的高质量交付和稳定运行！
