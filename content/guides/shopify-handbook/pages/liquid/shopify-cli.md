---
source_url: "https://shopify.baoea.com/liquid/shopify-cli"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:59"
fetch_method: "http"
content_hash: "0aedb3583c82265eda04391a5950133b7e48b60ed55090110ce1ea6cf8213d11"
discovered_via: ["sitemap", "internal_link"]
---
## Shopify CLI 安装与配置

Shopify CLI 是官方提供的命令行工具，用于加速 Shopify 主题和应用的开发。本指南将详细介绍如何安装、配置和使用 Shopify CLI。

## 什么是 Shopify CLI？[](https://shopify.baoea.com/liquid/shopify-cli#%E4%BB%80%E4%B9%88%E6%98%AF-shopify-cli)

Shopify CLI 是一个命令行界面工具，提供以下功能：

*   **主题开发**: 创建、预览和部署主题
*   **应用开发**: 构建和测试 Shopify 应用
*   **实时预览**: 本地开发时实时预览更改
*   **代码生成**: 自动生成模板和组件
*   **部署管理**: 简化主题发布流程

## 安装前准备[](https://shopify.baoea.com/liquid/shopify-cli#%E5%AE%89%E8%A3%85%E5%89%8D%E5%87%86%E5%A4%87)

确保您已经完成了[开发环境搭建](https://shopify.baoea.com/liquid/environment-setup)：

*   ✅ Node.js (16.x 或更高版本)
*   ✅ npm 或 yarn
*   ✅ Git
*   ✅ 代码编辑器

## 安装方法[](https://shopify.baoea.com/liquid/shopify-cli#%E5%AE%89%E8%A3%85%E6%96%B9%E6%B3%95)

### 方法一：使用 npm 安装 (推荐)[](https://shopify.baoea.com/liquid/shopify-cli#%E6%96%B9%E6%B3%95%E4%B8%80%E4%BD%BF%E7%94%A8-npm-%E5%AE%89%E8%A3%85-%E6%8E%A8%E8%8D%90)

```
# 全局安装 Shopify CLI
npm install -g @shopify/cli @shopify/theme
 
# 验证安装
shopify version
```

### 方法二：使用 yarn 安装[](https://shopify.baoea.com/liquid/shopify-cli#%E6%96%B9%E6%B3%95%E4%BA%8C%E4%BD%BF%E7%94%A8-yarn-%E5%AE%89%E8%A3%85)

```
# 全局安装
yarn global add @shopify/cli @shopify/theme
 
# 验证安装
shopify version
```

### 方法三：直接下载二进制文件[](https://shopify.baoea.com/liquid/shopify-cli#%E6%96%B9%E6%B3%95%E4%B8%89%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%96%87%E4%BB%B6)

#### Windows[](https://shopify.baoea.com/liquid/shopify-cli#windows)

```
# 使用 PowerShell
iwr https://github.com/Shopify/shopify-cli/releases/latest/download/shopify-cli-windows-amd64.exe -OutFile shopify.exe
 
# 将 shopify.exe 移动到 PATH 中的目录
```

#### macOS[](https://shopify.baoea.com/liquid/shopify-cli#macos)

```
# 使用 Homebrew
brew tap shopify/shopify
brew install shopify-cli
 
# 或直接下载
curl -L https://github.com/Shopify/shopify-cli/releases/latest/download/shopify-cli-darwin-amd64 -o shopify
chmod +x shopify
sudo mv shopify /usr/local/bin/
```

#### Linux[](https://shopify.baoea.com/liquid/shopify-cli#linux)

```
# 下载并安装
curl -L https://github.com/Shopify/shopify-cli/releases/latest/download/shopify-cli-linux-amd64 -o shopify
chmod +x shopify
sudo mv shopify /usr/local/bin/
```

## 验证安装[](https://shopify.baoea.com/liquid/shopify-cli#%E9%AA%8C%E8%AF%81%E5%AE%89%E8%A3%85)

```
# 检查版本
shopify version
 
# 查看帮助信息
shopify help
 
# 查看所有可用命令
shopify --help
```

## 身份验证[](https://shopify.baoea.com/liquid/shopify-cli#%E8%BA%AB%E4%BB%BD%E9%AA%8C%E8%AF%81)

### 登录到 Shopify[](https://shopify.baoea.com/liquid/shopify-cli#%E7%99%BB%E5%BD%95%E5%88%B0-shopify)

```
# 登录到您的 Shopify 账户
shopify auth login
 
# 这将打开浏览器进行身份验证
# 按照屏幕提示完成登录过程
```

### 验证登录状态[](https://shopify.baoea.com/liquid/shopify-cli#%E9%AA%8C%E8%AF%81%E7%99%BB%E5%BD%95%E7%8A%B6%E6%80%81)

```
# 检查当前登录状态
shopify auth whoami
 
# 查看可访问的商店
shopify auth list-stores
```

### 登出[](https://shopify.baoea.com/liquid/shopify-cli#%E7%99%BB%E5%87%BA)

```
# 登出当前账户
shopify auth logout
```

## 主题开发命令[](https://shopify.baoea.com/liquid/shopify-cli#%E4%B8%BB%E9%A2%98%E5%BC%80%E5%8F%91%E5%91%BD%E4%BB%A4)

### 创建新主题[](https://shopify.baoea.com/liquid/shopify-cli#%E5%88%9B%E5%BB%BA%E6%96%B0%E4%B8%BB%E9%A2%98)

```
# 创建基于 Dawn 的新主题
shopify theme init my-new-theme
 
# 进入主题目录
cd my-new-theme
```

### 连接现有主题[](https://shopify.baoea.com/liquid/shopify-cli#%E8%BF%9E%E6%8E%A5%E7%8E%B0%E6%9C%89%E4%B8%BB%E9%A2%98)

```
# 在现有主题目录中
shopify theme pull
 
# 或指定主题 ID
shopify theme pull --theme-id=123456789
```

### 本地开发服务器[](https://shopify.baoea.com/liquid/shopify-cli#%E6%9C%AC%E5%9C%B0%E5%BC%80%E5%8F%91%E6%9C%8D%E5%8A%A1%E5%99%A8)

```
# 启动开发服务器
shopify theme dev
 
# 指定商店
shopify theme dev --store=your-store.myshopify.com
 
# 使用特定主题
shopify theme dev --theme-id=123456789
```

开发服务器将在 `http://localhost:9292` 启动，提供：

*   🔄 热重载功能
*   📱 移动预览
*   🛠️ 开发工具集成

### 主题管理[](https://shopify.baoea.com/liquid/shopify-cli#%E4%B8%BB%E9%A2%98%E7%AE%A1%E7%90%86)

```
# 查看商店中的所有主题
shopify theme list
 
# 推送本地更改到远程主题
shopify theme push
 
# 从远程拉取更改
shopify theme pull
 
# 发布主题
shopify theme publish --theme-id=123456789
 
# 创建主题副本
shopify theme duplicate --theme-id=123456789 --name="My Copy"
```

## 高级配置[](https://shopify.baoea.com/liquid/shopify-cli#%E9%AB%98%E7%BA%A7%E9%85%8D%E7%BD%AE)

### 配置文件[](https://shopify.baoea.com/liquid/shopify-cli#%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)

Shopify CLI 使用配置文件来存储设置：

```
# 查看配置文件位置
shopify config
 
# 编辑配置
shopify config edit
```

### 忽略文件配置[](https://shopify.baoea.com/liquid/shopify-cli#%E5%BF%BD%E7%95%A5%E6%96%87%E4%BB%B6%E9%85%8D%E7%BD%AE)

创建 `.shopifyignore` 文件来排除文件：

```
# .shopifyignore
node_modules/
.git/
*.log
.env
.DS_Store
thumbs.db
```

### 环境变量[](https://shopify.baoea.com/liquid/shopify-cli#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F)

```
# 设置默认商店
export SHOPIFY_FLAG_STORE="your-store.myshopify.com"
 
# 设置主题 ID
export SHOPIFY_FLAG_THEME_ID="123456789"
 
# 启用调试模式
export SHOPIFY_CLI_DEBUG=1
```

## 代码生成功能[](https://shopify.baoea.com/liquid/shopify-cli#%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90%E5%8A%9F%E8%83%BD)

### 生成 Section[](https://shopify.baoea.com/liquid/shopify-cli#%E7%94%9F%E6%88%90-section)

```
# 生成新的 section
shopify theme generate section
 
# 或指定名称
shopify theme generate section hero-banner
```

### 生成 Snippet[](https://shopify.baoea.com/liquid/shopify-cli#%E7%94%9F%E6%88%90-snippet)

```
# 生成 snippet
shopify theme generate snippet
 
# 指定名称
shopify theme generate snippet product-card
```

### 生成模板[](https://shopify.baoea.com/liquid/shopify-cli#%E7%94%9F%E6%88%90%E6%A8%A1%E6%9D%BF)

```
# 生成页面模板
shopify theme generate template page
 
# 生成产品模板
shopify theme generate template product
```

## 工作流程示例[](https://shopify.baoea.com/liquid/shopify-cli#%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%A8%8B%E7%A4%BA%E4%BE%8B)

### 日常开发流程[](https://shopify.baoea.com/liquid/shopify-cli#%E6%97%A5%E5%B8%B8%E5%BC%80%E5%8F%91%E6%B5%81%E7%A8%8B)

```
# 1. 拉取最新代码
shopify theme pull
 
# 2. 启动开发服务器
shopify theme dev
 
# 3. 在另一个终端进行开发
# 编辑文件，浏览器会自动刷新
 
# 4. 提交更改
git add .
git commit -m "Add new feature"
 
# 5. 推送到远程主题
shopify theme push
 
# 6. 如果准备发布
shopify theme publish
```

### 团队协作流程[](https://shopify.baoea.com/liquid/shopify-cli#%E5%9B%A2%E9%98%9F%E5%8D%8F%E4%BD%9C%E6%B5%81%E7%A8%8B)

```
# 创建开发分支
git checkout -b feature/new-homepage
 
# 创建开发主题
shopify theme push --unpublished --json > theme-info.json
 
# 获取主题 ID
cat theme-info.json | jq -r '.theme.id'
 
# 在特定主题上开发
shopify theme dev --theme-id=THEME_ID
 
# 完成开发后合并代码
git checkout main
git merge feature/new-homepage
 
# 推送到主主题
shopify theme push --theme-id=MAIN_THEME_ID
```

## 故障排除[](https://shopify.baoea.com/liquid/shopify-cli#%E6%95%85%E9%9A%9C%E6%8E%92%E9%99%A4)

### 常见问题[](https://shopify.baoea.com/liquid/shopify-cli#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)

#### 1\. 认证问题[](https://shopify.baoea.com/liquid/shopify-cli#1-%E8%AE%A4%E8%AF%81%E9%97%AE%E9%A2%98)

```
# 清除认证缓存
shopify auth logout
shopify auth login
 
# 检查网络连接
ping shopify.com
```

#### 2\. 权限问题[](https://shopify.baoea.com/liquid/shopify-cli#2-%E6%9D%83%E9%99%90%E9%97%AE%E9%A2%98)

```
# 检查商店权限
shopify auth whoami
 
# 确保拥有主题编辑权限
# 联系商店所有者分配权限
```

#### 3\. 版本冲突[](https://shopify.baoea.com/liquid/shopify-cli#3-%E7%89%88%E6%9C%AC%E5%86%B2%E7%AA%81)

```
# 更新到最新版本
npm update -g @shopify/cli @shopify/theme
 
# 清除 npm 缓存
npm cache clean --force
```

#### 4\. 端口冲突[](https://shopify.baoea.com/liquid/shopify-cli#4-%E7%AB%AF%E5%8F%A3%E5%86%B2%E7%AA%81)

```
# 指定不同端口
shopify theme dev --port=3000
 
# 查看端口使用情况
netstat -tulpn | grep :9292
```

### 调试技巧[](https://shopify.baoea.com/liquid/shopify-cli#%E8%B0%83%E8%AF%95%E6%8A%80%E5%B7%A7)

```
# 启用详细日志
shopify theme dev --verbose
 
# 查看详细错误信息
SHOPIFY_CLI_DEBUG=1 shopify theme dev
 
# 检查主题文件
shopify theme check
```

## 最佳实践[](https://shopify.baoea.com/liquid/shopify-cli#%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5)

### 1\. 版本控制集成[](https://shopify.baoea.com/liquid/shopify-cli#1-%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6%E9%9B%86%E6%88%90)

```
# .gitignore
.shopify/
*.log
.env
node_modules/
```

### 2\. 自动化脚本[](https://shopify.baoea.com/liquid/shopify-cli#2-%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC)

```
// package.json
{
  "scripts": {
    "dev": "shopify theme dev",
    "push": "shopify theme push",
    "pull": "shopify theme pull",
    "check": "shopify theme check",
    "build": "npm run check && npm run push"
  }
}
```

### 3\. CI/CD 集成[](https://shopify.baoea.com/liquid/shopify-cli#3-cicd-%E9%9B%86%E6%88%90)

```
# .github/workflows/deploy.yml
name: Deploy Theme
on:
  push:
    branches: [main]
 
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install Shopify CLI
        run: npm install -g @shopify/cli @shopify/theme
        
      - name: Deploy to Shopify
        env:
          SHOPIFY_CLI_TOKEN: ${{ secrets.SHOPIFY_CLI_TOKEN }}
          SHOPIFY_FLAG_STORE: ${{ secrets.SHOPIFY_STORE }}
        run: shopify theme push --allow-live
```

## 高级功能[](https://shopify.baoea.com/liquid/shopify-cli#%E9%AB%98%E7%BA%A7%E5%8A%9F%E8%83%BD)

### 主题检查[](https://shopify.baoea.com/liquid/shopify-cli#%E4%B8%BB%E9%A2%98%E6%A3%80%E6%9F%A5)

```
# 运行主题检查
shopify theme check
 
# 只检查特定文件
shopify theme check templates/
 
# 生成报告
shopify theme check --output=json > check-report.json
```

### 性能分析[](https://shopify.baoea.com/liquid/shopify-cli#%E6%80%A7%E8%83%BD%E5%88%86%E6%9E%90)

```
# 分析主题性能
shopify theme dev --timing
 
# 查看文件大小
shopify theme info
```

### 多环境管理[](https://shopify.baoea.com/liquid/shopify-cli#%E5%A4%9A%E7%8E%AF%E5%A2%83%E7%AE%A1%E7%90%86)

```
# 开发环境
shopify theme dev --store=dev-store.myshopify.com
 
# 测试环境  
shopify theme push --store=staging-store.myshopify.com
 
# 生产环境
shopify theme push --store=production-store.myshopify.com --live
```

## 相关资源[](https://shopify.baoea.com/liquid/shopify-cli#%E7%9B%B8%E5%85%B3%E8%B5%84%E6%BA%90)

*   [Shopify CLI 官方文档](https://shopify.dev/docs/themes/tools/cli) 
*   [主题开发工作流程](https://shopify.baoea.com/liquid/theme-development-workflow)
*   [Liquid 入门基础](https://shopify.baoea.com/liquid/getting-started)

Shopify CLI 是现代 Shopify 开发的核心工具，掌握它将大大提高您的开发效率！
