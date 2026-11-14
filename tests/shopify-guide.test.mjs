import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { searchCatalogue } from "../site/assets/js/catalogue-search.js";

const siteRoot = fileURLToPath(new URL("../site/", import.meta.url));
const guideRoot = path.join(siteRoot, "guides/shopify-handbook");
const guideBase = "/guides/shopify-handbook/";

const ARTICLE_COUNT = 202;
const CATEGORY_COUNTS = { basic: 39, advanced: 94, liquid: 42, tools: 3 };
const GENERAL_COUNT = 24;

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

function localTarget(reference) {
  const pathname = reference.split(/[?#]/, 1)[0];
  if (!pathname.startsWith("/")) return null;
  assert.ok(pathname.startsWith(guideBase), `站内链接缺少专题前缀：${reference}`);
  const rel = pathname.slice(guideBase.length);
  return pathname.endsWith("/") || rel === ""
    ? path.join(guideRoot, rel, "index.html")
    : path.join(guideRoot, rel);
}

test("Shopify 专题知识库发布 202 篇可直达文章", async () => {
  const htmlFiles = (await walk(guideRoot)).filter((file) => file.endsWith(".html"));
  assert.equal(htmlFiles.length, ARTICLE_COUNT + 2, "202 篇文章 + 专题首页 + 404");

  for (const [category, count] of Object.entries(CATEGORY_COUNTS)) {
    const pages = (await walk(path.join(guideRoot, category))).filter((file) =>
      file.endsWith("index.html")
    );
    assert.equal(pages.length, count, `${category} 栏目页数`);
  }

  const generalPages = htmlFiles.filter((file) =>
    /^(?:topics|about|cases|contact|pricing|terms|privacy-policy|shopify-independent-site)\//.test(
      path.relative(guideRoot, file).replaceAll(path.sep, "/")
    )
  );
  assert.equal(generalPages.length, GENERAL_COUNT, "专题与站点资料页数");
});

test("Skills123 首页与全局搜索只暴露专题入口", async () => {
  const [home, guideData, catalog] = await Promise.all([
    readFile(path.join(siteRoot, "index.html"), "utf8"),
    readFile(path.join(siteRoot, "assets/data/guides.json"), "utf8").then(JSON.parse),
    readFile(path.join(siteRoot, "assets/data/catalog.json"), "utf8").then(JSON.parse),
  ]);

  assert.match(home, /href="\/guides\/shopify-handbook\/"[^>]*>专题知识库/);
  assert.match(home, /id="topic-guides"/);

  const guide = guideData.find((item) => item.id === "shopify-handbook");
  assert.equal(guide.articleCount, ARTICLE_COUNT);
  assert.equal(guide.topicCount, 5);
  assert.equal(guide.href, guideBase);

  const result = searchCatalogue({
    catalog,
    packageSkills: {},
    guides: guideData,
    query: "Liquid",
  });
  const match = result.guideMatches.find((item) => item.href === guideBase);
  assert.ok(match, "全局搜索应命中 Shopify 专题入口");
  assert.equal("articles" in match, false);
});

test("代表文章通过本地静态路由发布且不暴露上游来源", async () => {
  const routes = [
    "basic/getting-started/index.html",
    "advanced/shopify-seo/index.html",
    "liquid/getting-started/index.html",
    "topics/seo/index.html",
  ];

  for (const route of routes) {
    const html = await readFile(path.join(guideRoot, route), "utf8");
    assert.match(html, /class="xxd-prose"/, route);
    assert.doesNotMatch(
      html,
      /shopify\.baoea\.com|shopify\.pxf\.io|will@baoea\.com|callbaoea/i,
      route
    );
    assert.doesNotMatch(html, /查看原文|内容来源/, route);
  }

  const gettingStarted = await readFile(
    path.join(guideRoot, "basic/getting-started/index.html"),
    "utf8"
  );
  assert.match(
    gettingStarted,
    /href="\/guides\/shopify-handbook\/basic\/shopify-registration\/"/
  );
});

test("全部专题页面只引用可用的本地路由与本地图片", async () => {
  const htmlFiles = (await walk(guideRoot)).filter((file) => file.endsWith(".html"));
  const references = new Set();
  const images = new Set();

  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    const rel = path.relative(guideRoot, file).replaceAll(path.sep, "/");
    assert.doesNotMatch(
      html,
      /shopify\.baoea\.com|shopify\.pxf\.io|impactradius-go\.com|will@baoea\.com|callbaoea/i,
      rel
    );
    assert.doesNotMatch(
      html,
      /spm_id_from|vd_source|一键三连|会员赞助|解锁完整内容|此内容仅限VIP会员访问|会员专享特权|创作不易|1对1(?:专家)?咨询/i,
      rel
    );
    for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
      references.add(match[1].split(/[?#]/, 1)[0]);
    }
    for (const match of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
      images.add(match[1]);
    }
  }

  for (const reference of references) {
    const target = localTarget(reference);
    if (!target) continue;
    await assert.doesNotReject(access(target), `缺少本地资源或路由：${reference}`);
  }

  assert.ok(images.size > 0, "专题应包含本地图片");
  for (const image of images) {
    assert.match(
      image,
      /^\/guides\/shopify-handbook\/assets\//,
      `专题图片应来自本地快照：${image}`
    );
  }
});

test("专题内搜索索引指向带前缀的本地路由", async () => {
  const index = JSON.parse(
    await readFile(path.join(guideRoot, "search-sections.json"), "utf8")
  );
  assert.ok(index.length > 1500, `细索引条目数偏少：${index.length}`);
  for (const item of index) {
    assert.ok(item.href.startsWith(guideBase), `索引路径缺少前缀：${item.href}`);
  }
});
