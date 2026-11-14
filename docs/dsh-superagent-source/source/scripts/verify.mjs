// 构建自检：页面数量、正文渲染、外链残留、锚点与资源是否完整。
// 用法：npm run build && npm run check
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { pages } from "../src/lib/content.js";

const dist = join(process.cwd(), "dist");
if (!existsSync(dist)) {
  console.error("dist/ 不存在，请先运行 npm run build");
  process.exit(1);
}

function htmlFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) htmlFiles(p, acc);
    else if (name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

const files = htmlFiles(dist);
const problems = [];
let emptyAnchors = 0, missingAssets = 0, prosePages = 0, renderErrors = 0;
const seenAssets = new Set();

for (const file of files) {
  const html = readFileSync(file, "utf8");
  const rel = relative(dist, file);
  emptyAnchors += (html.match(/<a\s+href="[^"]*"\s*><\/a>/g) || []).length;
  if (html.includes('class="xxd-prose"')) prosePages++;
  if (/\[\[[^\]]+\|/.test(html)) { renderErrors++; problems.push(`${rel}: 残留未渲染的术语标记`); }
  if (/==[^=\n]{2,}==/.test(html)) { renderErrors++; problems.push(`${rel}: 残留未渲染的重点标记`); }
  for (const m of html.matchAll(/(?:src|href)="(\/[^"#?]+\.(?:css|js|svg|png|webp|jpg))"/g)) {
    const asset = m[1];
    if (seenAssets.has(asset)) continue;
    seenAssets.add(asset);
    if (!existsSync(join(dist, asset.replace(/^\//, "")))) {
      missingAssets++;
      if (problems.length < 12) problems.push(`${rel}: 缺资源 ${asset}`);
    }
  }
}

const indexOk = existsSync(join(dist, "index.html"));
const searchOk = existsSync(join(dist, "search-sections.json"));
const notFoundOk = existsSync(join(dist, "404.html"));
const expected = pages.length;

console.log("— 构建自检 —");
console.log(`HTML 页面            : ${files.length}`);
console.log(`含正文的文章页        : ${prosePages} / ${expected}`);
console.log(`首页 / 404 / 搜索索引 : ${indexOk ? "✓" : "✗"} / ${notFoundOk ? "✓" : "✗"} / ${searchOk ? "✓" : "✗"}`);
console.log(`空锚点残留            : ${emptyAnchors}`);
console.log(`未渲染的教学标记      : ${renderErrors}`);
console.log(`引用但不存在的资源    : ${missingAssets}（共检查 ${seenAssets.size} 个）`);
if (problems.length) console.log("示例:", problems.slice(0, 8).join("; "));

const bad = !indexOk || !notFoundOk || !searchOk || emptyAnchors > 0 || missingAssets > 0 || renderErrors > 0 || prosePages < expected;
if (bad) {
  console.error("自检未通过");
  process.exit(1);
}
console.log("自检通过 ✓");
