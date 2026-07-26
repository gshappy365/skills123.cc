---
source_url: "https://shopify.baoea.com/liquid/tools"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:43:18"
fetch_method: "http"
content_hash: "52b383ade5f94c8791af542f9b9cdb36a90b235ed29a0663fecbfc0e27877f79"
discovered_via: ["sitemap", "internal_link"]
---
## 开发工具推荐

本指南推荐一系列工具和资源，帮助您提升 Shopify 主题开发的效率和质量。

## 代码编辑器[](https://shopify.baoea.com/liquid/tools#%E4%BB%A3%E7%A0%81%E7%BC%96%E8%BE%91%E5%99%A8)

### 1\. Visual Studio Code (推荐)[](https://shopify.baoea.com/liquid/tools#1-visual-studio-code-%E6%8E%A8%E8%8D%90)

**安装和配置**

VS Code 是最受欢迎的 Shopify 主题开发编辑器，提供丰富的插件支持。

**必备插件：**

```
// .vscode/extensions.json
{
  "recommendations": [
    "shopify.liquid",
    "shopify.theme-check-vscode",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-css-formatter",
    "zignd.html-css-class-completion"
  ]
}
```

**工作区配置：**

```
// .vscode/settings.json
{
  "liquid.format.enable": true,
  "liquid.completion.enable": true,
  "liquid.hover.enable": true,
  "files.associations": {
    "*.liquid": "liquid"
  },
  "emmet.includeLanguages": {
    "liquid": "html"
  },
  "editor.quickSuggestions": {
    "strings": true
  },
  "editor.formatOnSave": true,
  "prettier.documentSelectors": ["**/*.liquid"],
  "css.validate": false,
  "scss.validate": false
}
```

**代码片段配置：**

```
// .vscode/liquid.code-snippets
{
  "Liquid Comment Block": {
    "prefix": "comment",
    "body": [
      "{% comment %}",
      "  $1",
      "{% endcomment %}"
    ],
    "description": "Create a Liquid comment block"
  },
  
  "Product Card": {
    "prefix": "product-card",
    "body": [
      "<div class=\"product-card\">",
      "  <a href=\"{{ product.url }}\">",
      "    <img src=\"{{ product.featured_image | image_url: width: 300, height: 300 }}\" alt=\"{{ product.title }}\">",
      "    <h3>{{ product.title }}</h3>",
      "    <p>{{ product.price | money }}</p>",
      "  </a>",
      "</div>"
    ]
  },
  
  "For Loop with Liquid": {
    "prefix": "for-liquid",
    "body": [
      "{%- liquid",
      "  for $1 in $2",
      "    $3",
      "  endfor",
      "-%}"
    ]
  },
  
  "Section Schema": {
    "prefix": "schema",
    "body": [
      "{% schema %}",
      "{",
      "  \"name\": \"$1\",",
      "  \"settings\": [",
      "    {",
      "      \"type\": \"text\",",
      "      \"id\": \"$2\",",
      "      \"label\": \"$3\"",
      "    }",
      "  ]",
      "}",
      "{% endschema %}"
    ]
  }
}
```

### 2\. Sublime Text[](https://shopify.baoea.com/liquid/tools#2-sublime-text)

**包管理器配置：**

```
// Package Control.sublime-settings
{
  "installed_packages": [
    "Liquid",
    "Shopify Liquid",
    "Emmet",
    "SideBarEnhancements",
    "BracketHighlighter",
    "GitGutter"
  ]
}
```

### 3\. Atom (已停止维护)[](https://shopify.baoea.com/liquid/tools#3-atom-%E5%B7%B2%E5%81%9C%E6%AD%A2%E7%BB%B4%E6%8A%A4)

虽然 Atom 已停止维护，但仍有一些有用的包：

*   `language-liquid`
*   `shopify-liquid`
*   `emmet`

## 命令行工具[](https://shopify.baoea.com/liquid/tools#%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%B7%A5%E5%85%B7)

### 1\. Shopify CLI[](https://shopify.baoea.com/liquid/tools#1-shopify-cli)

**安装：**

```
# 使用 Homebrew (macOS)
brew tap shopify/shopify
brew install shopify-cli
 
# 使用 npm
npm install -g @shopify/cli @shopify/theme
 
# 使用 Ruby Gem
gem install shopify-cli
```

**常用命令：**

```
# 登录 Shopify
shopify auth login
 
# 初始化新主题
shopify theme init my-theme
 
# 开发模式 (实时同步)
shopify theme dev
 
# 推送到主题
shopify theme push
 
# 拉取主题
shopify theme pull
 
# 查看主题列表
shopify theme list
 
# 预览主题
shopify theme open
 
# 发布主题
shopify theme publish
 
# 检查主题
shopify theme check
```

**配置文件：**

```
# shopify.theme.toml
[environments.development]
store = "your-dev-store.myshopify.com"
theme = "development"
 
[environments.staging]
store = "your-staging-store.myshopify.com"
theme = "staging"
 
[environments.production]
store = "your-store.myshopify.com"
theme = "live"
```

### 2\. Theme Check[](https://shopify.baoea.com/liquid/tools#2-theme-check)

**安装和使用：**

```
# 安装
npm install -g @shopify/theme-check
 
# 检查当前目录
theme-check
 
# 检查特定文件
theme-check templates/product.liquid
 
# 自动修复
theme-check --auto-correct
```

**配置文件：**

```
# .theme-check.yml
extends: :theme_app_extension
 
ChecksumAssetBundles:
  enabled: false
 
AssetSizeCSS:
  threshold_in_bytes: 100000
 
AssetSizeJavaScript:
  threshold_in_bytes: 150000
 
DeprecatedLazysizes:
  enabled: true
 
RemoteAsset:
  enabled: true
```

### 3\. Lighthouse CI[](https://shopify.baoea.com/liquid/tools#3-lighthouse-ci)

**性能检测配置：**

```
// lighthouserc.json
{
  "ci": {
    "collect": {
      "url": [
        "https://your-store.myshopify.com",
        "https://your-store.myshopify.com/products/example",
        "https://your-store.myshopify.com/collections/all"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.8}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

## 构建工具[](https://shopify.baoea.com/liquid/tools#%E6%9E%84%E5%BB%BA%E5%B7%A5%E5%85%B7)

### 1\. Webpack 配置[](https://shopify.baoea.com/liquid/tools#1-webpack-%E9%85%8D%E7%BD%AE)

**基础配置：**

```
// webpack.config.js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
 
module.exports = {
  entry: {
    main: './src/js/main.js',
    product: './src/js/product.js',
    cart: './src/js/cart.js'
  },
  
  output: {
    path: path.resolve(__dirname, 'assets'),
    filename: '[name].bundle.js',
    clean: true
  },
  
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      }
    ]
  },
  
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  },
  
  devtool: 'source-map'
};
```

### 2\. Vite 配置[](https://shopify.baoea.com/liquid/tools#2-vite-%E9%85%8D%E7%BD%AE)

```
// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';
 
export default defineConfig({
  build: {
    outDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/js/main.js'),
        product: resolve(__dirname, 'src/js/product.js'),
        cart: resolve(__dirname, 'src/js/cart.js')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  }
});
```

### 3\. PostCSS 配置[](https://shopify.baoea.com/liquid/tools#3-postcss-%E9%85%8D%E7%BD%AE)

```
// postcss.config.js
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default'
    })
  ]
};
```

## 测试工具[](https://shopify.baoea.com/liquid/tools#%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B7)

### 1\. Jest 配置[](https://shopify.baoea.com/liquid/tools#1-jest-%E9%85%8D%E7%BD%AE)

```
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  collectCoverageFrom: [
    'assets/js/**/*.js',
    '!assets/js/vendor/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

**测试示例：**

```
// tests/cart.test.js
import { CartManager } from '../assets/js/cart.js';
 
describe('CartManager', () => {
  let cart;
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div data-cart-drawer></div>
      <span data-cart-count>0</span>
    `;
    
    cart = new CartManager();
  });
  
  test('should initialize with empty cart', () => {
    expect(cart.itemCount).toBe(0);
  });
  
  test('should add item to cart', async () => {
    const mockResponse = {
      item_count: 1,
      items: [{ id: 123, quantity: 1 }]
    };
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });
    
    await cart.addItem(123, 1);
    
    expect(cart.itemCount).toBe(1);
  });
});
```

### 2\. Playwright E2E 测试[](https://shopify.baoea.com/liquid/tools#2-playwright-e2e-%E6%B5%8B%E8%AF%95)

```
// tests/e2e/product.spec.js
const { test, expect } = require('@playwright/test');
 
test.describe('Product Page', () => {
  test('should add product to cart', async ({ page }) => {
    await page.goto('/products/example-product');
    
    // 选择变体
    await page.selectOption('[data-variant-select]', '123456');
    
    // 添加到购物车
    await page.click('[data-add-to-cart]');
    
    // 验证购物车更新
    await expect(page.locator('[data-cart-count]')).toHaveText('1');
    
    // 验证购物车抽屉打开
    await expect(page.locator('[data-cart-drawer]')).toBeVisible();
  });
  
  test('should show correct product information', async ({ page }) => {
    await page.goto('/products/example-product');
    
    await expect(page.locator('h1')).toContainText('Example Product');
    await expect(page.locator('[data-price]')).toBeVisible();
    await expect(page.locator('[data-product-image]')).toBeVisible();
  });
});
```

## 性能监控工具[](https://shopify.baoea.com/liquid/tools#%E6%80%A7%E8%83%BD%E7%9B%91%E6%8E%A7%E5%B7%A5%E5%85%B7)

### 1\. Web Vitals 监控[](https://shopify.baoea.com/liquid/tools#1-web-vitals-%E7%9B%91%E6%8E%A7)

```
// assets/js/performance.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
 
function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  
  // 使用 navigator.sendBeacon() 发送数据
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', body);
  } else {
    fetch('/api/vitals', { body, method: 'POST', keepalive: true });
  }
}
 
// 监控所有 Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 2\. Bundle 分析[](https://shopify.baoea.com/liquid/tools#2-bundle-%E5%88%86%E6%9E%90)

```
// webpack-bundle-analyzer.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
 
module.exports = {
  // ... 其他配置
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html'
    })
  ]
};
```

## 部署和CI/CD[](https://shopify.baoea.com/liquid/tools#%E9%83%A8%E7%BD%B2%E5%92%8Ccicd)

### 1\. GitHub Actions[](https://shopify.baoea.com/liquid/tools#1-github-actions)

```
# .github/workflows/deploy.yml
name: Deploy to Shopify
 
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
 
jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run theme check
      run: npx @shopify/theme-check
    
    - name: Build assets
      run: npm run build
 
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Shopify CLI
      uses: shopify/github-action@v1
      with:
        shopify_cli_version: latest
    
    - name: Deploy to staging
      run: shopify theme push --environment staging
      env:
        SHOPIFY_CLI_TOKEN: ${{ secrets.SHOPIFY_CLI_TOKEN }}
    
    - name: Run E2E tests
      run: npx playwright test
      env:
        STORE_URL: ${{ secrets.STAGING_STORE_URL }}
    
    - name: Deploy to production
      if: success()
      run: shopify theme push --environment production
      env:
        SHOPIFY_CLI_TOKEN: ${{ secrets.SHOPIFY_CLI_TOKEN }}
```

### 2\. 自动化脚本[](https://shopify.baoea.com/liquid/tools#2-%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC)

```
// scripts/deploy.js
const { execSync } = require('child_process');
const readline = require('readline');
 
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
 
async function deploy() {
  console.log('🚀 开始部署流程...');
  
  // 1. 运行测试
  console.log('📋 运行测试...');
  execSync('npm test', { stdio: 'inherit' });
  
  // 2. 检查主题
  console.log('🔍 检查主题...');
  execSync('npx @shopify/theme-check', { stdio: 'inherit' });
  
  // 3. 构建资源
  console.log('🏗️ 构建资源...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // 4. 确认部署
  const answer = await new Promise(resolve => {
    rl.question('📤 是否部署到生产环境? (y/N): ', resolve);
  });
  
  if (answer.toLowerCase() === 'y') {
    console.log('🚀 部署到生产环境...');
    execSync('shopify theme push --environment production', { stdio: 'inherit' });
    console.log('✅ 部署完成!');
  } else {
    console.log('❌ 部署已取消');
  }
  
  rl.close();
}
 
deploy().catch(console.error);
```

## 调试工具[](https://shopify.baoea.com/liquid/tools#%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7)

### 1\. Chrome DevTools 扩展[](https://shopify.baoea.com/liquid/tools#1-chrome-devtools-%E6%89%A9%E5%B1%95)

**Shopify DevTools：**

*   检查 Liquid 变量
*   监控 AJAX 请求
*   分析性能

**React Developer Tools：**

*   如果使用 React 组件

### 2\. 浏览器书签工具[](https://shopify.baoea.com/liquid/tools#2-%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B9%A6%E7%AD%BE%E5%B7%A5%E5%85%B7)

```
// Shopify Debug 书签
javascript:(function(){
  const debugInfo = {
    theme: window.Shopify?.theme,
    shop: window.Shopify?.shop,
    customer: window.Shopify?.customer,
    cart: window.Shopify?.cart,
    product: window.product,
    collection: window.collection
  };
  
  console.group('🛍️ Shopify Debug Info');
  Object.entries(debugInfo).forEach(([key, value]) => {
    if (value) {
      console.log(`${key}:`, value);
    }
  });
  console.groupEnd();
  
  // 显示所有 Liquid 变量
  const scripts = document.querySelectorAll('script[type="application/json"]');
  scripts.forEach(script => {
    try {
      const data = JSON.parse(script.textContent);
      console.log(`📄 ${script.id || 'JSON Data'}:`, data);
    } catch (e) {
      // 忽略无效 JSON
    }
  });
})();
```

### 3\. 本地开发代理[](https://shopify.baoea.com/liquid/tools#3-%E6%9C%AC%E5%9C%B0%E5%BC%80%E5%8F%91%E4%BB%A3%E7%90%86)

```
// proxy-server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
 
const app = express();
 
// 代理到 Shopify 店铺
const proxy = createProxyMiddleware({
  target: 'https://your-store.myshopify.com',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    // 添加调试头
    proxyReq.setHeader('X-Debug-Mode', 'true');
  },
  onProxyRes: (proxyRes, req, res) => {
    // 注入调试脚本
    if (proxyRes.headers['content-type']?.includes('text/html')) {
      // 修改响应内容
    }
  }
});
 
app.use('/', proxy);
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔗 代理服务器运行在 http://localhost:${PORT}`);
});
```

## 文档生成工具[](https://shopify.baoea.com/liquid/tools#%E6%96%87%E6%A1%A3%E7%94%9F%E6%88%90%E5%B7%A5%E5%85%B7)

### 1\. JSDoc 配置[](https://shopify.baoea.com/liquid/tools#1-jsdoc-%E9%85%8D%E7%BD%AE)

```
// jsdoc.config.json
{
  "source": {
    "include": ["./assets/js/"],
    "includePattern": "\\.(js)$",
    "exclude": ["node_modules/"]
  },
  "opts": {
    "destination": "./docs/js/"
  },
  "plugins": ["plugins/markdown"]
}
```

### 2\. Storybook 配置[](https://shopify.baoea.com/liquid/tools#2-storybook-%E9%85%8D%E7%BD%AE)

```
// .storybook/main.js
module.exports = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport'
  ]
};
```

通过这些工具的配合使用，您可以建立一个高效、专业的 Shopify 主题开发工作流程！

## 下一步学习[](https://shopify.baoea.com/liquid/tools#%E4%B8%8B%E4%B8%80%E6%AD%A5%E5%AD%A6%E4%B9%A0)

掌握开发工具后，建议继续学习：

1.  [开发资源汇总](https://shopify.baoea.com/liquid/resources) - 学习资源和社区
2.  [项目实战总结](https://shopify.baoea.com/liquid/project-summary) - 项目开发经验总结
