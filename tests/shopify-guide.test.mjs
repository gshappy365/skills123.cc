import assert from "node:assert/strict";
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  assertSafeMediaSource,
  resolveSnapshotMarkdown,
} from "../scripts/lib/shopify-guide-security.mjs";
import { searchCatalogue } from "../site/assets/js/catalogue-search.js";

const guideIndexUrl = new URL(
  "../site/guides/shopify-handbook/assets/guide-index.json",
  import.meta.url
);
const siteRoot = fileURLToPath(new URL("../site/", import.meta.url));

async function assertLocalTargetExists(reference) {
  const pathname = reference.split(/[?#]/, 1)[0];
  if (!pathname.startsWith("/")) return;
  const target = pathname.endsWith("/")
    ? path.join(siteRoot, pathname, "index.html")
    : path.join(siteRoot, pathname);
  await assert.doesNotReject(access(target), `缺少本地资源或路由：${pathname}`);
  const hash = reference.includes("#") ? reference.split("#", 2)[1] : "";
  if (hash) {
    const targetHtml = await readFile(target, "utf8");
    const decodedHash = decodeURIComponent(hash);
    const escapedHash = decodedHash.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(
      targetHtml,
      new RegExp(`\\bid="${escapedHash}"`),
      `失效的片段锚点：${reference}`
    );
  }
}

test("Shopify 专题知识库发布 157 篇可直达文章", async () => {
  const guideIndex = JSON.parse(await readFile(guideIndexUrl, "utf8"));

  assert.equal(guideIndex.guide.id, "shopify-handbook");
  assert.equal(guideIndex.guide.label, "整理与归档");
  assert.equal(guideIndex.articles.length, 157);
  assert.deepEqual(guideIndex.counts, {
    basic: 38,
    advanced: 74,
    liquid: 42,
    tools: 3,
  });
  assert.ok(
    guideIndex.articles.some(
      (article) => article.path === "/guides/shopify-handbook/basic/getting-started/"
    )
  );
  assert.ok(
    guideIndex.articles.some(
      (article) => article.path === "/guides/shopify-handbook/advanced/shopify-seo/"
    )
  );
  assert.ok(
    guideIndex.articles.some(
      (article) => article.path === "/guides/shopify-handbook/liquid/getting-started/"
    )
  );
});

test("Skills123 首页与全局搜索只暴露专题入口", async () => {
  const [home, guideData, catalog] = await Promise.all([
    readFile(new URL("../site/index.html", import.meta.url), "utf8"),
    readFile(new URL("../site/assets/data/guides.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../site/assets/data/catalog.json", import.meta.url), "utf8").then(JSON.parse),
  ]);

  assert.match(home, /href="\/guides\/shopify-handbook\/"[^>]*>专题知识库/);
  assert.match(home, /id="topic-guides"/);
  assert.equal(guideData.length, 1);
  assert.equal(guideData[0].articleCount, 157);

  const result = searchCatalogue({
    catalog,
    packageSkills: {},
    guides: guideData,
    query: "Liquid",
  });
  assert.equal(result.guideMatches.length, 1);
  assert.equal(result.guideMatches[0].href, "/guides/shopify-handbook/");
  assert.equal("articles" in result.guideMatches[0], false);
});

test("代表文章通过本地静态路由发布且不暴露上游来源入口", async () => {
  const representativeRoutes = [
    "../site/guides/shopify-handbook/basic/getting-started/index.html",
    "../site/guides/shopify-handbook/advanced/shopify-seo/index.html",
    "../site/guides/shopify-handbook/liquid/getting-started/index.html",
  ];

  for (const route of representativeRoutes) {
    const html = await readFile(new URL(route, import.meta.url), "utf8");
    assert.match(html, /<article class="guide-article"/);
    assert.match(html, /整理与归档/);
    assert.doesNotMatch(html, /shopify\.baoea\.com/i);
    assert.doesNotMatch(html, /查看原文|内容来源/);
  }

  const gettingStarted = await readFile(
    new URL(
      "../site/guides/shopify-handbook/basic/getting-started/index.html",
      import.meta.url
    ),
    "utf8"
  );
  assert.match(
    gettingStarted,
    /href="\/guides\/shopify-handbook\/basic\/shopify-registration\/"/
  );
});

test("全部专题页面只引用可用的本地路由与本地图片", async () => {
  const guideIndex = JSON.parse(await readFile(guideIndexUrl, "utf8"));

  for (const article of guideIndex.articles) {
    const htmlPath = path.join(siteRoot, article.path, "index.html");
    const html = await readFile(htmlPath, "utf8");
    assert.doesNotMatch(
      html,
      /shopify\.baoea\.com|shopify\.pxf\.io|impactradius-go\.com|查看原文|内容来源/i,
      article.path
    );
    assert.doesNotMatch(
      html,
      /spm_id_from|vd_source|一键三连|会员赞助|VIP会员|1对1(?:专家)?咨询|创作不易|密码\s*[:：]\s*1\b|callbaoea|will@baoea\.com|请随时联系我们|请随时联系我|联系我(?:交流|获取(?:更多)?支持)|联系我们(?:安排|获取)|欢迎关注本站或联系我/i,
      article.path
    );

    const references = [
      ...html.matchAll(/<(?:a|link)\b[^>]*\bhref="([^"]+)"/g),
      ...html.matchAll(/<(?:img|script)\b[^>]*\bsrc="([^"]+)"/g),
    ].map((match) => match[1]);
    for (const reference of references) {
      await assertLocalTargetExists(reference);
      if (/^https?:\/\//.test(reference)) {
        const url = new URL(reference);
        for (const key of url.searchParams.keys()) {
          assert.doesNotMatch(
            key,
            /^(?:aff|affiliate|fbclid|gclid|ref|referrer|spm_id_from|utm(?:_.+)?|vd_source)$/i,
            `外链仍包含跟踪参数：${reference}`
          );
        }
      }
    }

    const images = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(
      (match) => match[1]
    );
    for (const image of images) {
      assert.match(image, /^\/assets\/images\/shopify-handbook\//);
    }
  }

  const mediaManifest = JSON.parse(
    await readFile(
      new URL(
        "../content/guides/shopify-handbook/media-manifest.json",
        import.meta.url
      ),
      "utf8"
    )
  );
  const omissions = JSON.parse(
    await readFile(
      new URL(
        "../content/guides/shopify-handbook/media-omissions.json",
        import.meta.url
      ),
      "utf8"
    )
  );
  const failures = JSON.parse(
    await readFile(
      new URL(
        "../content/guides/shopify-handbook/media-failures.json",
        import.meta.url
      ),
      "utf8"
    )
  );
  assert.equal(mediaManifest.length, 74);
  assert.equal(omissions.length, 1);
  assert.deepEqual(failures, []);

  const releaseProduct = await readFile(
    new URL(
      "../site/guides/shopify-handbook/basic/release-product/index.html",
      import.meta.url
    ),
    "utf8"
  );
  assert.match(releaseProduct, /产品系列关联图示未包含在本次归档中/);
});

test("快照读取拒绝目录穿越、绝对路径和符号链接逃逸", async () => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), "shopify-guide-security-"));
  const pages = path.join(fixture, "pages");
  const outside = path.join(fixture, "outside.md");
  await mkdir(path.join(pages, "basic"), { recursive: true });
  await writeFile(path.join(pages, "basic", "safe.md"), "## Safe\n");
  await writeFile(outside, "secret");
  await symlink(outside, path.join(pages, "basic", "escape.md"));

  await assert.doesNotReject(
    resolveSnapshotMarkdown({
      snapshotRoot: fixture,
      file: "pages/basic/safe.md",
      url: "https://shopify.baoea.com/basic/safe",
    })
  );
  for (const [file, url] of [
    ["../outside.md", "https://shopify.baoea.com/basic/safe"],
    ["pages/../outside.md", "https://shopify.baoea.com/basic/safe"],
    [outside, "https://shopify.baoea.com/basic/safe"],
    ["pages/basic/escape.md", "https://shopify.baoea.com/basic/escape"],
  ]) {
    await assert.rejects(
      resolveSnapshotMarkdown({
        snapshotRoot: fixture,
        file,
        url,
      })
    );
  }
  await rm(fixture, { recursive: true, force: true });
});

test("媒体同步只接受归档站点的 HTTPS 图片地址", () => {
  assert.doesNotThrow(() =>
    assertSafeMediaSource(
      "https://shopify.baoea.com/_next/image?url=%2Fimages%2Fsafe.png&w=1200&q=75"
    )
  );
  for (const url of [
    "http://shopify.baoea.com/images/a.png",
    "https://example.com/a.png",
    "http://127.0.0.1/a.png",
    "http://169.254.169.254/latest/meta-data",
  ]) {
    assert.throws(() => assertSafeMediaSource(url));
  }
});
