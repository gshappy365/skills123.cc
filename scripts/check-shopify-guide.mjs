// CI 校验：Shopify 专题现在是已提交的静态快照，不再在流水线里生成。
// 这一步确认快照完整，替代旧 build-shopify-handbook 的「生成后检查工作树」。
import { access, readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("site/guides/shopify-handbook");
const required = [
  "index.html",
  "404.html",
  "search-sections.json",
  "site.css",
  "site-shopify.css",
  "xxd/xxd.css",
];

for (const file of required) {
  await access(path.join(root, file)).catch(() => {
    throw new Error(`Shopify 专题快照缺少 ${file}`);
  });
}

async function countPages(dir) {
  let total = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) total += await countPages(full);
    else if (entry.name === "index.html") total += 1;
  }
  return total;
}

const pages = await countPages(root);
if (pages !== 203) {
  throw new Error(`Shopify 专题页数应为 203，实际 ${pages}`);
}

console.log(`Shopify 专题快照校验通过：${pages} 个页面`);
