---
source_url: "https://shopify.baoea.com/liquid/environment-setup"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:42:46"
fetch_method: "http"
content_hash: "3c3ff0264699c981c38feca8a1c98b02db34f0260ffe5fab80b6b856e2d31b96"
discovered_via: ["sitemap", "internal_link"]
---
## 开发环境搭建

在编写 Liquid 主题前，需要可重复的本地环境：**Node（运行 Shopify CLI）**、**Git**、**编辑器与 Liquid 支持**、**Partner 店铺或开发店**用于 `shopify theme dev`。本文按「安装 → 校验 → 目录约定 → 排错」组织，并与本专栏 [Shopify CLI](https://shopify.baoea.com/liquid/shopify-cli)、[工作流程](https://shopify.baoea.com/liquid/theme-development-workflow) 衔接。

## 你将完成什么[](https://shopify.baoea.com/liquid/environment-setup#%E4%BD%A0%E5%B0%86%E5%AE%8C%E6%88%90%E4%BB%80%E4%B9%88)

*   安装并校验 Node / npm 与 Shopify CLI
*   配置 VS Code（或同类编辑器）的 Liquid 与格式化
*   了解 Theme Check、推荐目录结构
*   能独立处理版本、权限、网络等常见阻塞

## 前置条件[](https://shopify.baoea.com/liquid/environment-setup#%E5%89%8D%E7%BD%AE%E6%9D%A1%E4%BB%B6)

| 项目 | 说明 |
| --- | --- |
| Shopify Partner | 注册 Partners  并创建开发店铺（Development store），用于拉取主题与预览 |
| 系统 | Windows 10+、macOS 11+ 或主流 Linux；磁盘建议预留 5GB+（含 node_modules 与主题资源） |
| 网络 | CLI 需访问 Shopify API；若跨境访问不稳定，需自备企业网络或合规代理，否则 theme dev / login 易超时 |

## 系统与硬件建议[](https://shopify.baoea.com/liquid/environment-setup#%E7%B3%BB%E7%BB%9F%E4%B8%8E%E7%A1%AC%E4%BB%B6%E5%BB%BA%E8%AE%AE)

*   **内存**：8GB 及以上更顺畅（同时开浏览器预览 + 编辑器 + CLI）
*   **CPU**：无硬性要求；大型主题 `theme check` 会占用一定 CPU

## 1\. Node.js[](https://shopify.baoea.com/liquid/environment-setup#1-nodejs)

Shopify CLI 依赖 Node。**请使用当前 CLI 文档要求的 LTS 主版本**（安装前可查看 [Shopify CLI 安装说明](https://shopify.dev/docs/api/shopify-cli) ）。

### 安装方式[](https://shopify.baoea.com/liquid/environment-setup#%E5%AE%89%E8%A3%85%E6%96%B9%E5%BC%8F)

**官网安装包**

*   下载：[https://nodejs.org/](https://nodejs.org/) （选 LTS）

**macOS（Homebrew）**

```
brew install node
node --version
npm --version
```

**Windows（Chocolatey）**

```
choco install nodejs-lts
```

**Linux（Debian/Ubuntu 示例）**

```
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```

### 版本管理（推荐 nvm）[](https://shopify.baoea.com/liquid/environment-setup#%E7%89%88%E6%9C%AC%E7%AE%A1%E7%90%86%E6%8E%A8%E8%8D%90-nvm)

多项目并存时，用 nvm 切换 Node 版本：

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts
nvm use --lts
```

## 2\. Git[](https://shopify.baoea.com/liquid/environment-setup#2-git)

主题仓库与 CLI 拉取推送均依赖 Git。

*   **下载**：[https://git-scm.com/](https://git-scm.com/) 
*   **macOS**：`xcode-select --install` 或 `brew install git`
*   **初始化用户信息**：

```
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 3\. Shopify CLI[](https://shopify.baoea.com/liquid/environment-setup#3-shopify-cli)

安装与登录流程见专文：[Shopify CLI 使用指南](https://shopify.baoea.com/liquid/shopify-cli)。环境阶段只需验证：

```
npm install -g @shopify/cli @shopify/theme
shopify version
shopify auth login --store your-dev-store.myshopify.com
```

## 4\. 编辑器（以 VS Code 为例）[](https://shopify.baoea.com/liquid/environment-setup#4-%E7%BC%96%E8%BE%91%E5%99%A8%E4%BB%A5-vs-code-%E4%B8%BA%E4%BE%8B)

### 推荐扩展[](https://shopify.baoea.com/liquid/environment-setup#%E6%8E%A8%E8%8D%90%E6%89%A9%E5%B1%95)

| 扩展 | 用途 |
| --- | --- |
| Shopify Liquid（官方） | 语法高亮、补全、与 Theme Check 集成 |
| Theme Check | 静态规则：弃用标签、性能、翻译键等 |
| GitLens | 行级 blame、历史浏览 |
| EditorConfig | 缩进与换行统一 |

### `settings.json` 片段[](https://shopify.baoea.com/liquid/environment-setup#settingsjson-%E7%89%87%E6%AE%B5)

```
{
  "liquid.format.enable": true,
  "files.associations": {
    "*.liquid": "liquid"
  },
  "emmet.includeLanguages": {
    "liquid": "html"
  },
  "[liquid]": {
    "editor.defaultFormatter": "Shopify.theme-check-vscode"
  }
}
```

> 若团队使用 WebStorm / Cursor，请确保启用 **Liquid** 或 **Shopify** 相关插件，并统一 **缩进（建议 2 空格）** 与 **换行符（LF）**，避免 CR 导致 CI 与 Theme Check 告警。

## 5\. Theme Check（主题质量）[](https://shopify.baoea.com/liquid/environment-setup#5-theme-check%E4%B8%BB%E9%A2%98%E8%B4%A8%E9%87%8F)

在 CI 或提交前运行 Theme Check，可提前发现弃用 API、错误 `render` 参数、缺失翻译键等问题。

```
shopify theme check
```

详细规则与忽略配置见官方：[Theme Check](https://shopify.dev/docs/themes/tools/theme-check) 。本专栏 [最佳实践](https://shopify.baoea.com/liquid/best-practices) 与 [代码组织](https://shopify.baoea.com/liquid/code-organization) 中的约定应与规则集一致。

## 6\. 浏览器[](https://shopify.baoea.com/liquid/environment-setup#6-%E6%B5%8F%E8%A7%88%E5%99%A8)

使用 **Chrome** 或 **Edge（Chromium）** 进行预览与 DevTools 性能分析（LCP、CLS）。移动端调试使用设备模拟或真实手机同一局域网预览（取决于 `shopify theme dev` 暴露的 URL）。

## 7\. 环境自检脚本[](https://shopify.baoea.com/liquid/environment-setup#7-%E7%8E%AF%E5%A2%83%E8%87%AA%E6%A3%80%E8%84%9A%E6%9C%AC)

```
mkdir -p shopify-dev-test && cd shopify-dev-test
npm init -y
node -e "console.log('Node', process.version)"
```

若 `shopify version` 与 `node -e` 均正常，即可进入 [主题开发工作流程](https://shopify.baoea.com/liquid/theme-development-workflow) 拉取第一个主题。

## 8\. 推荐目录结构[](https://shopify.baoea.com/liquid/environment-setup#8-%E6%8E%A8%E8%8D%90%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)

在机器上固定工作区，便于备份与多项目切换：

```
~/shopify-development/
├── themes/          # 各客户或内部主题 Git 仓库
├── apps/            # 如需配套自定义应用
├── tools/           # 脚本、主题检查配置共享
└── learning/        # 练习与 POC
```

创建示例：

```
mkdir -p ~/shopify-development/{themes,apps,tools,learning}
```

## 9\. npm 镜像（可选）[](https://shopify.baoea.com/liquid/environment-setup#9-npm-%E9%95%9C%E5%83%8F%E5%8F%AF%E9%80%89)

中国大陆用户若安装 CLI 或依赖较慢，可临时使用镜像（注意公司安全策略）：

```
npm config set registry https://registry.npmmirror.com
```

恢复官方源：

```
npm config set registry https://registry.npmjs.org/
```

## 10\. 故障排除[](https://shopify.baoea.com/liquid/environment-setup#10-%E6%95%85%E9%9A%9C%E6%8E%92%E9%99%A4)

### Node 版本过旧或过新[](https://shopify.baoea.com/liquid/environment-setup#node-%E7%89%88%E6%9C%AC%E8%BF%87%E6%97%A7%E6%88%96%E8%BF%87%E6%96%B0)

使用 **nvm** 切换到 CLI 文档推荐的 LTS，再执行 `npm install -g @shopify/cli @shopify/theme`。

### Linux / macOS npm 权限错误[](https://shopify.baoea.com/liquid/environment-setup#linux--macos-npm-%E6%9D%83%E9%99%90%E9%94%99%E8%AF%AF)

```
sudo chown -R "$(whoami)" ~/.npm
# 若曾用 sudo 全局安装，避免混用；可改为仅用户目录前缀或使用 nvm
```

### 无法访问 shopify.com[](https://shopify.baoea.com/liquid/environment-setup#%E6%97%A0%E6%B3%95%E8%AE%BF%E9%97%AE-shopifycom)

```
ping shopify.com
curl -I https://shopify.dev
```

若超时，检查 DNS、公司防火墙或合规代理；**不要在文档示例中硬编码代理密钥**。

## 下一步[](https://shopify.baoea.com/liquid/environment-setup#%E4%B8%8B%E4%B8%80%E6%AD%A5)

1.  [Shopify CLI 使用指南](https://shopify.baoea.com/liquid/shopify-cli) — 登录、拉主题、`theme dev`
2.  [主题开发工作流程](https://shopify.baoea.com/liquid/theme-development-workflow) — Git 分支与预览协作
3.  [Liquid 快速入门](https://shopify.baoea.com/liquid/getting-started) — 开始写模板
