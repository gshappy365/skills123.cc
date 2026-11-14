import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const site = fileURLToPath(new URL("../site/", import.meta.url));
const guide = path.join(site, "guides/aihero-handbook");
const prefix = "/guides/aihero-handbook/";

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const name = path.join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(name) : entry.name.endsWith(".html") ? [name] : [];
  }))).flat();
}

test("专题可从首页进入，版权说明与 UI Kit 许可齐备", async (t) => {
  const home = await readFile(path.join(site, "index.html"), "utf8");
  const guides = JSON.parse(await readFile(path.join(site, "assets/data/guides.json"), "utf8"));
  const license = await readFile(path.join(guide, "xxd/LICENSE"), "utf8");
  const readme = await readFile(path.join(guide, "SOURCE-README.md"), "utf8");

  assert.ok(home.includes(`href="${prefix}"`));
  assert.match(home, /<small>6 个专题<\/small>/);
  const entry = guides.find((item) => item.id === "aihero-handbook");
  assert.equal(entry.href, prefix);
  assert.equal(entry.articleCount, 210);
  assert.equal(entry.topicCount, 6);
  // 内容版权：抓取自 aihero.dev，版权归原作者，非商业存档
  assert.match(readme, /aihero\.dev/);
  assert.match(readme, /Matt Pocock/);
  assert.match(readme, /非商业/);
  assert.match(license, /PolyForm Noncommercial License 1\.0\.0/);
  await t.diagnostic("内容版权归 Matt Pocock / AI Hero，商用前必须重新评估");
});

test("站内链接、资源、canonical 与搜索索引都落在专题前缀下", async () => {
  const pages = await htmlFiles(guide);
  assert.equal(pages.length, 218);

  const sectionBytes = await readFile(path.join(guide, "search-sections.json"));
  const version = createHash("sha256").update(sectionBytes).digest("hex").slice(0, 16);
  const broken = [];

  for (const page of pages) {
    const html = await readFile(page, "utf8");
    assert.match(
      html,
      /<link rel="canonical" href="https:\/\/skills123\.cc\/guides\/aihero-handbook\//,
      path.relative(site, page)
    );
    assert.doesNotMatch(html, /X\.init\(document\);\s*sync\(\)/);
    assert.ok(
      html.includes(`data-sections="${prefix}search-sections.json?v=${version}"`),
      `搜索索引未盖章：${path.relative(site, page)}`
    );

    for (const [, url] of html.matchAll(/(?:href|src|data-sections)="(\/(?!\/)[^"#?]*)/g)) {
      const rel = url.replace(prefix, "").split(/[?#]/)[0];
      if (url.startsWith(prefix)) {
        const target = path.join(guide, rel);
        try {
          await access(target);
        } catch {
          try {
            await access(path.join(target, "index.html"));
          } catch {
            broken.push(`${path.relative(site, page)} → ${url}`);
          }
        }
      } else {
        const hostTarget = path.join(site, url.split(/[?#]/)[0]);
        try {
          await access(hostTarget);
        } catch {
          try {
            await access(path.join(hostTarget, "index.html"));
          } catch {
            broken.push(`${path.relative(site, page)} → ${url}`);
          }
        }
      }
    }
  }
  assert.deepEqual(broken, []);
});

test("每个内容页都带来源声明与原站链接", async () => {
  const pages = await htmlFiles(guide);
  let withSource = 0;
  for (const page of pages) {
    const html = await readFile(page, "utf8");
    if (html.includes("xxd-prose")) {
      assert.ok(
        html.includes("aihero.dev") || html.includes("skills123.cc/guides/aihero-handbook/"),
        `正文页缺少来源信息：${path.relative(site, page)}`
      );
      if (html.includes("版权归 Matt Pocock")) withSource++;
    }
  }
  // 209 = 210 个正文页 - 关于页（其版权说明在正文 <strong> 内，不带「原文」链接行）
  assert.equal(withSource, 209);
});
