import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { resolveSnapshotMarkdown } from "./lib/shopify-guide-security.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const snapshotRoot = path.join(root, "content/guides/shopify-handbook");
const outputRoot = path.join(root, "site/guides/shopify-handbook");
const guideBase = "/guides/shopify-handbook";
const categories = {
  basic: { label: "入门基础", description: "从开店、商品到支付与履约，建立可运营的基本盘。", order: 1 },
  advanced: { label: "进阶经营", description: "围绕增长、性能、合规与技术架构做系统优化。", order: 2 },
  liquid: { label: "Liquid 开发", description: "掌握主题语言、对象模型与工程化开发实践。", order: 3 },
  tools: { label: "实用工具", description: "用于识别、检索与辅助判断 Shopify 店铺。", order: 4 },
};
const blockedHosts = new Set([
  "a.impactradius-go.com",
  "shopify.pxf.io",
]);
const trackingParameters = new Set([
  "aff",
  "affiliate",
  "fbclid",
  "gclid",
  "ref",
  "referrer",
  "spm_id_from",
  "utm",
  "vd_source",
]);
const excludedInternalPaths = new Set([
  "",
  "about",
  "cases",
  "contact",
  "pricing",
  "privacy-policy",
  "terms",
]);

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function withoutFrontMatter(markdown) {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
}

function firstHeading(markdown) {
  return (
    withoutFrontMatter(markdown)
      .match(/^#{1,3}\s+(.+?)(?:\[\]\(.+\))?\s*$/m)?.[1]
      ?.replaceAll(/[*_`]/g, "")
      .trim() ?? "未命名文章"
  );
}

function articlePath(category, slug) {
  return slug === "index"
    ? `${guideBase}/${category}/`
    : `${guideBase}/${category}/${slug}/`;
}

function outputDirectory(article) {
  return article.slug === "index"
    ? path.join(outputRoot, article.category)
    : path.join(outputRoot, article.category, article.slug);
}

function normalizeInternalRoute(url) {
  const normalizedPath = url.pathname.replace(/^\/|\/$/g, "");
  if (excludedInternalPaths.has(normalizedPath)) return null;
  const [category, ...segments] = normalizedPath.split("/");
  if (!categories[category]) return null;
  const slug = segments.length ? segments.join("/") : "index";
  return articlePath(category, slug);
}

function cleanExternalUrl(url) {
  for (const key of [...url.searchParams.keys()]) {
    const normalized = key.toLocaleLowerCase();
    if (trackingParameters.has(normalized) || normalized.startsWith("utm_")) {
      url.searchParams.delete(key);
    }
  }
  return url.href;
}

function publicHref(href) {
  if (!href) return null;
  if (href.startsWith("#")) return href;
  if (href === guideBase || href.startsWith(`${guideBase}/`)) return href;
  try {
    const url = new URL(href, "https://shopify.baoea.com");
    if (blockedHosts.has(url.hostname)) return null;
    if (url.hostname === "shopify.baoea.com") return normalizeInternalRoute(url);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return cleanExternalUrl(url);
  } catch {
    return null;
  }
}

function mediaKey(href) {
  try {
    const url = new URL(href, "https://shopify.baoea.com");
    return url.href;
  } catch {
    return href;
  }
}

function cleanArchivedMarkdown(markdown) {
  const lines = withoutFrontMatter(markdown).split(/\r?\n/);
  const cleaned = [];
  const contactCtaPatterns = [
    /请随时联系我们/,
    /请随时(?:\[)?联系我/,
    /联系我(?:交流|获取(?:更多)?支持)/,
    /联系我们(?:\]?\([^)]*\))?\s*(?:安排|获取)/,
    /欢迎关注本站或联系我/,
    /有任何关于.+问题.+联系我/,
  ];
  let skippedHeadingDepth = 0;
  for (const line of lines) {
    const heading = line.match(/^(#{2,6})\s+(.+?)(?:\[\]\(.+\))?\s*$/);
    if (skippedHeadingDepth) {
      if (!heading || heading[1].length > skippedHeadingDepth) continue;
      skippedHeadingDepth = 0;
    }
    if (
      heading &&
      /^(获取源码方式|解锁完整内容|会员专享特权)/.test(
        heading[2].replaceAll(/[*_`#：:]/g, "").trim()
      )
    ) {
      skippedHeadingDepth = heading[1].length;
      continue;
    }
    if (
      /shopify\.pxf\.io|impactradius-go\.com|shopify\.baoea\.com\/(?:contact|pricing)|一键三连|会员赞助|VIP会员|1对1(?:专家)?咨询|创作不易|密码\s*[:：]\s*1\b|callbaoea|will@baoea\.com|微信群/.test(
        line
      ) ||
      contactCtaPatterns.some((pattern) => pattern.test(line))
    ) {
      continue;
    }
    cleaned.push(line);
  }
  return cleaned.join("\n");
}

function makeRenderer(mediaBySource, omissionsBySource) {
  const renderer = new marked.Renderer();
  renderer.link = function link(token) {
    if (!token.text.trim()) return "";
    const href = publicHref(token.href);
    if (
      [...blockedHosts].some((host) => {
        try {
          return new URL(token.href, "https://shopify.baoea.com").hostname === host;
        } catch {
          return false;
        }
      })
    ) {
      return "";
    }
    const label = /^https?:\/\//i.test(token.text.trim()) && href
      ? escapeHtml(href)
      : this.parser.parseInline(token.tokens);
    if (!href) return label;
    const external = /^https?:\/\//.test(href);
    return `<a href="${escapeHtml(href)}"${external ? ' target="_blank" rel="noreferrer"' : ""}>${label}</a>`;
  };
  renderer.image = function image(token) {
    if (/二维码|联系|折扣|优惠|领取/i.test(token.text)) return "";
    const key = mediaKey(token.href);
    const localPath = mediaBySource.get(key);
    if (!localPath) {
      const omission = omissionsBySource.get(key);
      return omission
        ? `<figure class="media-omission" role="img" aria-label="${escapeHtml(token.text)}"><figcaption>${escapeHtml(omission.public_note)}</figcaption></figure>`
        : "";
    }
    return `<img src="${escapeHtml(localPath)}" alt="${escapeHtml(token.text)}" loading="lazy">`;
  };
  renderer.heading = function heading(token) {
    const text = this.parser.parseInline(token.tokens);
    const id = token.text
      .toLocaleLowerCase()
      .replaceAll(/[^\p{Letter}\p{Number}]+/gu, "-")
      .replaceAll(/^-|-$/g, "");
    return `<h${token.depth}${id ? ` id="${escapeHtml(id)}"` : ""}>${text}</h${token.depth}>`;
  };
  return renderer;
}

function renderMarkdown(markdown, mediaBySource, omissionsBySource) {
  const source = cleanArchivedMarkdown(markdown)
    .replaceAll(/\[\]\(https:\/\/shopify\.baoea\.com[^)]*\)/g, "")
    .replaceAll(/\[!\[([^\]]*)\]\([^)]+\)\]\(https:\/\/(?:shopify\.pxf\.io|a\.impactradius-go\.com)[^)]+\)/g, "");
  const rendered = marked.parse(source, {
    gfm: true,
    renderer: makeRenderer(mediaBySource, omissionsBySource),
  });
  return sanitizeHtml(rendered, {
    allowedTags: [
      "a", "blockquote", "br", "code", "del", "details", "div", "em", "figcaption",
      "figure", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "img", "li", "ol",
      "p", "pre", "span", "strong", "summary", "table", "tbody", "td", "th",
      "thead", "tr", "ul",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      code: ["class"],
      h1: ["id"],
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
      h5: ["id"],
      h6: ["id"],
      img: ["src", "alt", "loading"],
      figure: ["class", "role", "aria-label"],
      td: ["align"],
      th: ["align"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => {
        const href = publicHref(attribs.href);
        if (!href) return { tagName, attribs: {} };
        return {
          tagName,
          attribs: /^https?:\/\//.test(href)
            ? { href, target: "_blank", rel: "noreferrer" }
            : { href },
        };
      },
    },
    exclusiveFilter: (frame) =>
      frame.tag === "img" &&
      !frame.attribs.src?.startsWith("/assets/images/shopify-handbook/"),
  });
}

function descriptionFrom(markdown) {
  return cleanArchivedMarkdown(markdown)
    .replaceAll(/```[\s\S]*?```/g, " ")
    .replaceAll(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replaceAll(/\[\]\([^)]+\)/g, " ")
    .replaceAll(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replaceAll(/https?:\/\/\S+/g, " ")
    .replaceAll(/[#>*_`|~-]/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim()
    .slice(0, 116);
}

function documentShell({ title, description, body, canonical, article = false }) {
  const documentTitle =
    title === "Shopify 独立站手册"
      ? "Shopify 独立站手册 · Skills123"
      : `${title} · Shopify 独立站手册 · Skills123`;
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(documentTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="https://skills123.cc${canonical}">
  <meta property="og:title" content="${escapeHtml(title)} · Shopify 独立站手册">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="${article ? "article" : "website"}">
  <link rel="stylesheet" href="/assets/css/site.css?v=20260726-3">
  <link rel="stylesheet" href="/assets/css/shopify-handbook.css?v=20260726-1">
</head>
<body>
  <div class="guide-shell">
    <header class="site-header guide-site-header">
      <a class="brand" href="/"><span class="mark">S</span>Skills123</a>
      <nav class="nav" aria-label="主导航">
        <a href="/#skill-packages">技能包</a>
        <a aria-current="page" href="${guideBase}/">专题知识库</a>
        <span>学习路径</span>
        <span>关于</span>
      </nav>
    </header>
    ${body}
    <footer class="site-footer guide-footer">
      <span>Skills123 · 专题知识库</span>
      <strong>整理与归档</strong>
    </footer>
  </div>
  <script type="module" src="/assets/js/shopify-handbook.js?v=20260726-1"></script>
</body>
</html>
`;
}

function articleDocument(article, content, previous, next) {
  const neighbor = (label, item) =>
    item
      ? `<a class="article-neighbor" href="${item.path}"><span>${label}</span><strong>${escapeHtml(item.title)}</strong></a>`
      : "<span></span>";
  const body = `<main class="guide-article-layout">
    <nav class="guide-breadcrumb" aria-label="面包屑">
      <a href="/">Skills123</a><span>/</span>
      <a href="${guideBase}/">专题知识库</a><span>/</span>
      <a href="${guideBase}/${article.category}/">${escapeHtml(article.categoryLabel)}</a>
    </nav>
    <article class="guide-article">
      <header class="article-header">
        <p class="guide-kicker">${escapeHtml(article.categoryLabel)} · 整理与归档</p>
        <h1>${escapeHtml(article.title)}</h1>
        <p>${escapeHtml(article.description)}</p>
      </header>
      <div class="article-content">${content}</div>
      <nav class="article-neighbors" aria-label="相邻文章">
        ${neighbor("上一篇", previous)}
        ${neighbor("下一篇", next)}
      </nav>
    </article>
  </main>`;
  return documentShell({
    title: article.title,
    description: article.description,
    body,
    canonical: article.path,
    article: true,
  });
}

function landingDocument(articles, counts) {
  const sections = Object.entries(categories)
    .map(([category, meta]) => {
      const categoryArticles = articles.filter((article) => article.category === category);
      return `<section class="guide-category" data-guide-section>
        <header>
          <div><span>${String(meta.order).padStart(2, "0")}</span><h2>${escapeHtml(meta.label)}</h2></div>
          <p>${escapeHtml(meta.description)}</p>
          <strong>${counts[category]} 篇</strong>
        </header>
        <div class="guide-card-grid">
          ${categoryArticles
            .map(
              (article) => `<a class="guide-card" href="${article.path}" data-guide-card data-search="${escapeHtml(
                `${article.title} ${article.description} ${article.categoryLabel}`.toLocaleLowerCase()
              )}">
                <span>${escapeHtml(article.categoryLabel)}</span>
                <h3>${escapeHtml(article.title)}</h3>
                <p>${escapeHtml(article.description)}</p>
                <strong>阅读文章 →</strong>
              </a>`
            )
            .join("")}
        </div>
      </section>`;
    })
    .join("");
  const body = `<main>
    <section class="guide-hero">
      <nav class="guide-breadcrumb" aria-label="面包屑"><a href="/">Skills123</a><span>/</span><strong>专题知识库</strong></nav>
      <div class="guide-hero-copy">
        <div>
          <p class="guide-kicker">TOPIC GUIDE · 整理与归档</p>
          <h1>把独立站，<em>做成一门可复用的手艺。</em></h1>
        </div>
        <p>从开店基础、增长运营到 Liquid 主题开发，一份可检索、可直达的 Shopify 中文实践手册。</p>
      </div>
      <dl class="guide-stats">
        <div><dt>文章</dt><dd>${articles.length}</dd></div>
        <div><dt>主题</dt><dd>${String(Object.keys(categories).length).padStart(2, "0")}</dd></div>
        <div><dt>形态</dt><dd>静态快照</dd></div>
      </dl>
    </section>
    <section class="guide-search-panel">
      <label for="guide-query">搜索专题文章</label>
      <div><input id="guide-query" type="search" data-guide-search placeholder="搜索 Shopify、SEO、Liquid…" autocomplete="off"><span data-guide-result-count>${articles.length} 篇文章</span></div>
    </section>
    <div data-guide-empty hidden><strong>没有找到匹配文章</strong><p>试试更短的关键词或浏览下方主题。</p></div>
    <div data-guide-categories>${sections}</div>
  </main>`;
  return documentShell({
    title: "Shopify 独立站手册",
    description: "从开店基础、增长运营到 Liquid 主题开发的 Shopify 中文实践手册。",
    body,
    canonical: `${guideBase}/`,
  });
}

const snapshot = JSON.parse(
  await readFile(path.join(snapshotRoot, "snapshot-source.json"), "utf8")
);
const mediaManifest = JSON.parse(
  await readFile(path.join(snapshotRoot, "media-manifest.json"), "utf8").catch(() => "[]")
);
const mediaBySource = new Map(mediaManifest.map((item) => [item.source_url, item.local_path]));
const mediaOmissions = JSON.parse(
  await readFile(path.join(snapshotRoot, "media-omissions.json"), "utf8").catch(() => "[]")
);
const omissionsBySource = new Map(
  mediaOmissions.map((item) => [item.source_url, item])
);

const articles = [];
for (const page of snapshot.pages) {
  const pathname = new URL(page.url).pathname.replace(/^\/|\/$/g, "");
  const [category, ...segments] = pathname.split("/");
  if (!categories[category]) continue;
  const slug = segments.length ? segments.join("/") : "index";
  const sourceFile = await resolveSnapshotMarkdown({
    snapshotRoot,
    file: page.file,
    url: page.url,
  });
  const markdown = await readFile(sourceFile, "utf8");
  articles.push({
    category,
    categoryLabel: categories[category].label,
    slug,
    title: firstHeading(markdown),
    description: descriptionFrom(markdown),
    path: articlePath(category, slug),
    sourceFile: page.file,
    source_url: page.url,
    fetched_at: page.fetched_at,
    content_hash: page.content_hash,
    markdown,
  });
}

articles.sort(
  (a, b) =>
    categories[a.category].order - categories[b.category].order ||
    a.title.localeCompare(b.title, "zh-CN")
);
const counts = Object.fromEntries(
  Object.keys(categories).map((category) => [
    category,
    articles.filter((article) => article.category === category).length,
  ])
);

await rm(outputRoot, { recursive: true, force: true });
await mkdir(path.join(outputRoot, "assets"), { recursive: true });
await writeFile(
  path.join(outputRoot, "assets/guide-index.json"),
  `${JSON.stringify(
    {
      guide: {
        id: "shopify-handbook",
        title: "Shopify 独立站手册",
        label: "整理与归档",
      },
      counts,
      articles: articles.map(({ source_url, fetched_at, content_hash, sourceFile, markdown, ...article }) => article),
    },
    null,
    2
  )}\n`
);
await writeFile(path.join(outputRoot, "index.html"), landingDocument(articles, counts));

for (const [index, article] of articles.entries()) {
  const directory = outputDirectory(article);
  await mkdir(directory, { recursive: true });
  const content = renderMarkdown(article.markdown, mediaBySource, omissionsBySource);
  await writeFile(
    path.join(directory, "index.html"),
    articleDocument(article, content, articles[index - 1], articles[index + 1])
  );
}

console.log(`Generated Shopify guide with ${articles.length} articles.`);
