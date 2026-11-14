// 内容层：读取 content/pages 下的 Markdown，渲染成 HTML，抽取页内目录。
// 站点结构以 content/site-index.json 为准（由 tools/build_content.py 生成）。
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";

const ROOT = process.cwd();
const PAGES_DIR = join(ROOT, "content", "pages");

export const index = JSON.parse(readFileSync(join(ROOT, "content", "site-index.json"), "utf8"));

/** 部署子路径前缀（astro.config.mjs 的 base）。根路径部署时为空串。
 *  Astro 构建时从 Vite 取；构建后的 Node 脚本（搜索索引、自检）从 SITE_BASE 取，两边口径一致。 */
const RAW_BASE = import.meta.env?.BASE_URL || process.env.SITE_BASE || "/";
export const BASE = RAW_BASE.replace(/\/+$/, "");

/** 站内路径统一带尾斜杠（astro.config.mjs 里 trailingSlash: "always"），并带上部署前缀。 */
export function href(h) {
  const raw = String(h || "/");
  const hash = raw.includes("#") ? raw.slice(raw.indexOf("#")) : "";
  let path = raw.split("#")[0].split("?")[0];
  if (!path.startsWith("/")) path = "/" + path;
  path = path.replace(/\/+$/, "") || "/";
  if (path === "/") return BASE + "/" + hash;
  return BASE + path + "/" + hash;
}

const stripTags = (s) =>
  s
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/\s+/g, " ")
    .trim();

/** 正文里的教学标记：[[词|解释]] 术语、==重点== 荧光笔、++易错++ 粗下划线。
 *  只保护代码块，行内代码仍参与匹配（标记可能跨过 <code>）。 */
function inlineMarkup(htmlText) {
  const parts = htmlText.split(/(<pre[\s\S]*?<\/pre>)/g);
  return parts
    .map((part, i) => {
      if (i % 2 === 1) return part;
      return part
        // 中文里 **粗体** 后面紧跟汉字时 CommonMark 不认闭合，这里兜底
        .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_, word, tip) =>
          `<abbr class="tu-term" data-tip="${tip.replace(/"/g, "&quot;")}" tabindex="0">${word}</abbr>`)
        .replace(/==([^=\n]+)==/g, "<mark>$1</mark>")
        .replace(/\+\+([^+\n]+)\+\+/g, '<u class="tu-u">$1</u>');
    })
    .join("");
}

/** 渲染后的 HTML 后处理：去空锚点、清掉可执行标签与内联事件。 */
function sanitize(htmlText) {
  let out = htmlText;
  out = out.replace(/<a\s+href="[^"]*"\s*><\/a>/gi, "");
  out = out.replace(/<(\/?)(script|style|iframe|object)\b/gi, "&lt;$1$2");
  out = out.replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "");
  out = out.replace(/javascript:/gi, "");
  return out;
}

/** 给 h2/h3/h4 加稳定 id，同时生成右侧目录。 */
function headingIds(htmlText) {
  let n = 0;
  const toc = [];
  const html = htmlText.replace(/<h([2-4])>([\s\S]*?)<\/h\1>/g, (_m, level, inner) => {
    const text = stripTags(inner);
    const id = `sec-${++n}`;
    toc.push({ id, text, depth: Number(level) });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
  return { html, toc };
}

/** 正文里的站内绝对链接（Markdown 里写的 /wiki/…）要跟部署前缀走，代码块内的不动。 */
function withBase(htmlText) {
  if (!BASE) return htmlText;
  const parts = htmlText.split(/(<pre[\s\S]*?<\/pre>)/g);
  return parts
    .map((part, i) => (i % 2 === 1 ? part : part.replace(/(\s(?:href|src))="\/(?!\/)/g, `$1="${BASE}/`)))
    .join("");
}

/** 把一页 Markdown 渲染成正文 HTML 与目录。 */
export function renderPage(page) {
  const rel = String(page.file || "").replace(/^\/?content\/pages\//, "");
  let raw = "";
  try {
    raw = readFileSync(join(PAGES_DIR, rel), "utf8");
  } catch {
    raw = `# ${page.title}\n\n正文暂缺。`;
  }
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  let html = micromark(body, {
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()],
    allowDangerousHtml: true,
  });
  html = sanitize(html);
  // 正文里的 h1 与页面模板标题重复，去掉第一个
  html = html.replace(/<h1>[\s\S]*?<\/h1>/, "");
  html = inlineMarkup(html);
  html = withBase(html);
  const result = headingIds(html);
  return { html: result.html, toc: result.toc };
}

export const pages = index.pages.filter((p) => p.href !== "/");
export const pageByHref = new Map(pages.map((p) => [p.href, p]));
export const categories = index.categories.slice().sort((a, b) => a.order - b.order);

/** 同一栏目里的文章，按 nav_order 排。 */
export function groupItems(id) {
  return pages
    .filter((p) => p.category === id)
    .slice()
    .sort((a, b) => (a.nav_order ?? 9999) - (b.nav_order ?? 9999) || a.title.localeCompare(b.title, "zh"));
}

/** 同一栏目里按 group 再分组（How-to 用），保留组出现顺序。 */
export function groupedItems(id) {
  const list = groupItems(id).filter((p) => p.group);
  const order = [];
  const map = new Map();
  for (const p of list) {
    if (!map.has(p.group)) { map.set(p.group, []); order.push(p.group); }
    map.get(p.group).push(p);
  }
  return order.map((label) => ({ label, items: map.get(label) }));
}

export function prevNext(page) {
  const list = groupItems(page.category);
  const i = list.findIndex((p) => p.href === page.href);
  return { prev: i > 0 ? list[i - 1] : null, next: i >= 0 && i < list.length - 1 ? list[i + 1] : null };
}

export const latest = (index.latest || []).map((l) => pageByHref.get(l.href)).filter(Boolean);
