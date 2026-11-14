// 构建后生成正文细索引：命令面板按需 fetch，不塞进每个页面的 HTML。
// 每篇一条「全文」条目，再加每个二级标题一条，直接跳到对应小节。
// 写完索引后把内容指纹盖到每页的 data-sections 上，索引一变缓存就失效。
import { writeFileSync, readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { pages, renderPage, href } from "../src/lib/content.js";

const dist = join(process.cwd(), "dist");
if (!existsSync(dist)) {
  console.error("dist/ 不存在，请先运行 astro build");
  process.exit(1);
}

const out = [];
for (const page of pages) {
  const base = href(page.href);
  const desc = String(page.description || page.excerpt || "").slice(0, 220);
  const full = String(page.search_text || page.excerpt || "").replace(/\s+/g, " ").slice(0, 700);
  out.push({ label: page.title, hint: `${page.category_label} · 全文`, keywords: full || desc, href: base });
  const { toc } = renderPage(page);
  for (const h of toc.filter((x) => x.depth === 2).slice(0, 14)) {
    out.push({
      label: `${page.title} › ${h.text}`,
      hint: page.category_label,
      keywords: `${h.text} ${desc}`,
      href: `${base}#${h.id}`,
    });
  }
}

const bytes = JSON.stringify(out);
writeFileSync(join(dist, "search-sections.json"), bytes);

// 索引指纹（前 16 位）→ 页面里的 data-sections URL
const version = createHash("sha256").update(readFileSync(join(dist, "search-sections.json"))).digest("hex").slice(0, 16);
const target = href("/").replace(/\/$/, "") + "/search-sections.json";

function htmlFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) htmlFiles(p, acc);
    else if (name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

let stamped = 0;
for (const file of htmlFiles(dist)) {
  const html = readFileSync(file, "utf8");
  const next = html.replaceAll(`data-sections="${target}"`, `data-sections="${target}?v=${version}"`);
  if (next !== html) { writeFileSync(file, next); stamped++; }
}

console.log(`search-sections.json: ${out.length} 条（${pages.length} 篇 + 小节）· v=${version} · 盖章 ${stamped} 页`);
