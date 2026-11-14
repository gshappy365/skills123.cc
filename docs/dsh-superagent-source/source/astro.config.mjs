import { defineConfig } from "astro/config";

// dsh-superagent 中文新手教程：纯静态构建。
// 部署到自己的域名时把 SITE_URL 换成实际地址（影响 canonical / og:url）。
export default defineConfig({
  site: process.env.SITE_URL || "https://dsh-superagent.example.com",
  trailingSlash: "always",
  build: { format: "directory" },
});
