---
source_url: "https://shopify.baoea.com/liquid/theme-engineering-setup"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:43:10"
fetch_method: "http"
content_hash: "76a3a88e33eab91222d6d83f409e7245c274bffb84b813b2263fe6e272d98dc1"
discovered_via: ["sitemap", "internal_link"]
---
## 主题工程化：目录约定与 npm 脚本

团队级主题开发通常会约定 **`scripts/` 目录**、**统一 npm scripts**、**提交前 Theme Check / ESLint / Prettier**，并用 **Husky + lint-staged** 保证主分支质量。下面给出**应用层级的示例思路**；文中 **不会出现真实 Theme ID、店铺名或 Token**——你在自己仓库里应使用 **环境变量或本地未提交配置**，且**勿把含敏感信息的 `package.json` 截图发到公开教程或客户文档**。

> 前置阅读：[代码组织](https://shopify.baoea.com/liquid/code-organization)、[Shopify CLI](https://shopify.baoea.com/liquid/shopify-cli)、[AI 辅助与主题工程化](https://shopify.baoea.com/liquid/ai-theme-engineering)。

* * *

## 一、敏感信息与仓库安全[](https://shopify.baoea.com/liquid/theme-engineering-setup#%E4%B8%80%E6%95%8F%E6%84%9F%E4%BF%A1%E6%81%AF%E4%B8%8E%E4%BB%93%E5%BA%93%E5%AE%89%E5%85%A8)

| 风险 | 建议 |
| --- | --- |
| Theme ID 写死在 package.json 并提交到公开仓 | 使用占位符 + 本地覆盖（见下文「环境变量」），对外文档用 YOUR_DEV_THEME_ID |
| 店铺域名、CLI Token、API 密钥 | 只放在 .env、.shopify 或 CI 密钥库；.gitignore 排除；README 中只写变量名 |
| 自定义 shopify-with-store.mjs 等包装脚本 | 可封装默认 --store，但不要在示例仓库中粘贴真实店铺 URL 或 PAT |
| 对外分享 package.json、终端截图 | 打码或改用占位脚本名；客户交付物与开源教程分开 |

以下 JSON 中 **`YOUR_DEV_THEME_ID`** 表示「你在 Shopify 后台 → 在线商店 → 主题 → … 中看到的开发主题数字 ID」，**请仅在本机或私有 CI 中替换**，勿写入公开文档正文。

* * *

## 二、推荐目录结构[](https://shopify.baoea.com/liquid/theme-engineering-setup#%E4%BA%8C%E6%8E%A8%E8%8D%90%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)

```
theme-root/
├── assets/                 # 静态资源、Tailwind 入口等
├── config/
├── layout/
├── locales/
├── sections/
├── snippets/
├── templates/
├── scripts/                  # 仅放「构建/同步/封装 CLI」脚本，勿放密钥
│   └── shopify-with-store.mjs   # 可选：从 process.env 读取 store，再 spawn shopify CLI
├── .husky/                   # Husky 钩子
├── .theme-check.yml          # Theme Check 规则（可选）
├── package.json
└── README.md                 # 说明如何设置 SHOPIFY_* 环境变量
```

原则：**密钥与店铺专属 ID 不进 Git**；进 Git 的只有**占位符、文档与脚本逻辑**。

* * *

## 三、`package.json` 脚本示例[](https://shopify.baoea.com/liquid/theme-engineering-setup#%E4%B8%89packagejson-%E8%84%9A%E6%9C%AC%E7%A4%BA%E4%BE%8B)

下面展示**常见能力分组**，与你在编辑器里配置的脚本一一对应；**复制后请自行替换占位符**，并优先改为读环境变量：

```
{
  "scripts": {
    "watch": "npx tailwindcss -i ./assets/app-tailwind.css -o ./assets/app.css --watch",
    "theme:zip": "bash scripts/theme-store-zip.sh",
    "dev": "node scripts/shopify-with-store.mjs theme dev && npm run watch",
    "sync:pull:index": "node scripts/shopify-with-store.mjs theme pull --theme YOUR_DEV_THEME_ID --only templates/index.json --only config/settings_data.json",
    "sync:pull:json": "node scripts/shopify-with-store.mjs theme pull --theme YOUR_DEV_THEME_ID --only \"templates/*.json\" --only \"sections/*.json\" --only config/settings_data.json",
    "sync:push:index": "node scripts/shopify-with-store.mjs theme push --theme YOUR_DEV_THEME_ID --only templates/index.json --only config/settings_data.json",
    "sync:push:json": "node scripts/shopify-with-store.mjs theme push --theme YOUR_DEV_THEME_ID --only \"templates/*.json\" --only \"sections/*.json\" --only config/settings_data.json",
    "theme:check": "shopify theme check",
    "theme:check:json": "shopify theme check --output json",
    "theme:check:fix": "shopify theme check --auto-correct",
    "theme:check:print": "shopify theme check --print",
    "theme:check:list": "shopify theme check --list",
    "theme:check:init": "shopify theme check --init",
    "lint": "npm run lint:js && npm run lint:css",
    "lint:js": "eslint \"assets/**/*.js\"",
    "lint:css": "stylelint \"assets/**/*.css\"",
    "lint:theme": "npm run lint && npm run theme:check",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prepare": "husky"
  }
}
```

### 脚本含义速查[](https://shopify.baoea.com/liquid/theme-engineering-setup#%E8%84%9A%E6%9C%AC%E5%90%AB%E4%B9%89%E9%80%9F%E6%9F%A5)

| 脚本 | 用途 |
| --- | --- |
| watch | Tailwind 等 CSS 构建监听 |
| theme:zip | 打包符合主题商店或交付规范的 zip（具体由 scripts/theme-store-zip.sh 实现） |
| dev | 先拉起 theme dev（可通过包装脚本附带默认 store），再并行 CSS watch |
| sync:pull:* / sync:push:* | 仅同步 JSON 模板与 settings_data，减少误推整主题风险；YOUR_DEV_THEME_ID 必须私有配置 |
| theme:check* | Theme Check 检查 / JSON 输出 / 自动修复 / 打印规则 / 列表 / 初始化配置 |
| lint / lint:theme | JS/CSS 与主题静态检查组合 |
| format / format:check | Prettier；Liquid 可配合 @shopify/prettier-plugin-liquid |
| prepare | 安装依赖后启用 Husky |

**更安全的写法示例（思路）：** 在 `shopify-with-store.mjs` 内读取 `process.env.SHOPIFY_THEME_ID`，若未设置则打印提示并 `process.exit(1)`，这样 `package.json` 里可完全**不出现数字 ID**。

* * *

## 四、`devDependencies` 与 Git 钩子（示例）[](https://shopify.baoea.com/liquid/theme-engineering-setup#%E5%9B%9Bdevdependencies-%E4%B8%8E-git-%E9%92%A9%E5%AD%90%E7%A4%BA%E4%BE%8B)

以下为**常见组合**，版本号随项目升级：

```
{
  "devDependencies": {
    "@shopify/cli": "^3.92.0",
    "@shopify/prettier-plugin-liquid": "^1.10.0",
    "eslint": "^8.57.0",
    "eslint-config-standard": "^17.1.0",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-n": "^16.6.0",
    "eslint-plugin-promise": "^6.6.0",
    "husky": "^9.1.0",
    "lint-staged": "^16.4.0",
    "prettier": "^3.8.0",
    "stylelint": "^16.26.0",
    "stylelint-config-standard": "^39.0.0",
    "tailwindcss": "^3.4.0"
  },
  "lint-staged": {
    "**/*.{liquid,json,md,yml,yaml}": "prettier --write",
    "assets/**/*.js": ["prettier --write", "eslint --fix"],
    "assets/**/*.css": ["prettier --write", "stylelint --fix --allow-empty-input"]
  }
}
```

*   **Husky**：在 `prepare` 后于 `.husky/pre-commit` 中调用 `npx lint-staged`，避免未格式化或未通过检查的代码进入仓库。
*   **lint-staged**：只对暂存区跑工具，速度快；规则与团队 Prettier/ESLint 配置对齐即可。

* * *

## 五、与 Theme Check / CI 的衔接[](https://shopify.baoea.com/liquid/theme-engineering-setup#%E4%BA%94%E4%B8%8E-theme-check--ci-%E7%9A%84%E8%A1%94%E6%8E%A5)

*   本地：`npm run theme:check` 或 `lint:theme` 作为合并前习惯。
*   CI：可对 PR 执行 `shopify theme check`（需在 runner 上安装 CLI），**不要**在日志中打印 `--store` 或 Token。

详见 [测试和部署](https://shopify.baoea.com/liquid/testing-deployment) 与官方 [Theme Check](https://shopify.dev/docs/themes/tools/theme-check) 。

* * *

## 六、小结[](https://shopify.baoea.com/liquid/theme-engineering-setup#%E5%85%AD%E5%B0%8F%E7%BB%93)

1.  **工程化目录**：`scripts/` 放自动化脚本；敏感信息只通过 **环境变量 + 本地文件** 注入。
2.  **对外文档与教程**：一律使用 **`YOUR_DEV_THEME_ID` 等占位符**，真实 ID 与店铺信息**不得**出现在可复制示例中。
3.  **`package.json` 是展示脚本契约的好地方**，但不是存密钥的地方。

* * *

## 延伸阅读[](https://shopify.baoea.com/liquid/theme-engineering-setup#%E5%BB%B6%E4%BC%B8%E9%98%85%E8%AF%BB)

*   [代码组织](https://shopify.baoea.com/liquid/code-organization)
*   [安全最佳实践](https://shopify.baoea.com/liquid/security)
*   [Shopify CLI 使用指南](https://shopify.baoea.com/liquid/shopify-cli)
*   [Shopify AI Toolkit 使用指南](https://shopify.baoea.com/advanced/shopify-ai-toolkit)（应用向 AI 与文档对齐）
