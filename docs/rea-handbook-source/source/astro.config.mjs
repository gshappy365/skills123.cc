import { defineConfig } from "astro/config";

// REA 中文新手教程：纯静态构建。
// 独立部署：不设环境变量即可（站点根路径）。
// 挂到 skills123.cc 的子路径时：
//   SITE_BASE=/guides/rea-handbook SITE_URL=https://skills123.cc \
//   SITE_TITLE_SUFFIX=" · Skills123" npm run build
const base = process.env.SITE_BASE || "/";

export default defineConfig({
  site: process.env.SITE_URL || "https://rea-handbook.example.com",
  base,
  trailingSlash: "always",
  build: { format: "directory" },
});
