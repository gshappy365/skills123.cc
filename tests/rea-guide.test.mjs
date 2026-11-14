import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const site = fileURLToPath(new URL("../site/", import.meta.url));
const guide = path.join(site, "guides/rea-handbook");
const prefix = "/guides/rea-handbook/";

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const name = path.join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(name) : entry.name.endsWith(".html") ? [name] : [];
  }))).flat();
}

test("专题可从首页进入，并保留界面组件的许可声明", async () => {
  const home = await readFile(path.join(site, "index.html"), "utf8");
  const guides = JSON.parse(await readFile(path.join(site, "assets/data/guides.json"), "utf8"));
  const license = await readFile(path.join(guide, "xxd/LICENSE"), "utf8");
  const readme = await readFile(path.join(guide, "SOURCE-README.md"), "utf8");

  assert.ok(home.includes(`href="${prefix}"`));
  assert.match(home, /<small>5 个专题<\/small>/);
  const entry = guides.find((item) => item.id === "rea-handbook");
  assert.equal(entry.href, prefix);
  assert.equal(entry.articleCount, 54);
  assert.equal(entry.topicCount, 6);
  assert.match(readme, /PolyForm Noncommercial/);
  assert.match(license, /PolyForm Noncommercial License 1\.0\.0/);
  assert.match(license, /Required Notice: Copyright/);
  assert.match(license, /Required Notice: Commercial use requires a separate license/);
});

test("站内链接、资源、canonical 与两个搜索索引都落在专题前缀下", async () => {
  const pages = await htmlFiles(guide);
  assert.equal(pages.length, 56);

  const sectionBytes = await readFile(path.join(guide, "search-sections.json"));
  const version = createHash("sha256").update(sectionBytes).digest("hex").slice(0, 16);
  const broken = [];

  for (const page of pages) {
    const html = await readFile(page, "utf8");
    assert.match(
      html,
      /<link rel="canonical" href="https:\/\/skills123\.cc\/guides\/rea-handbook\//,
      path.relative(site, page)
    );
    // PStack 快照里的移动端菜单故障：X.init 之后不要再单独调 sync()
    assert.doesNotMatch(html, /X\.init\(document\);\s*sync\(\)/);
    assert.ok(
      html.includes(`data-sections="${prefix}search-sections.json?v=${version}"`),
      `搜索索引未盖章：${path.relative(site, page)}`
    );

    for (const [, url] of html.matchAll(/(?:href|src|data-sections)="(\/(?!\/)[^"#?]*)/g)) {
      // 顶栏那个「← Skills123」按设计指向宿主站点根，是全站唯一允许逃出前缀的链接
      if (url === "/") { await access(path.join(site, "index.html")); continue; }
      if (!url.startsWith(prefix)) { broken.push(`${page}: ${url}`); continue; }
      const target = path.join(site, decodeURIComponent(url));
      try { await access(url.endsWith("/") ? path.join(target, "index.html") : target); }
      catch { broken.push(`${page}: ${url}`); }
    }

    const match = html.match(/<script type="application\/json" id="site-search-index"[^>]*>(.*?)<\/script>/s);
    assert.ok(match);
    for (const item of JSON.parse(match[1])) assert.ok(item.href.startsWith(prefix));
  }

  assert.deepEqual(broken, []);

  const sections = JSON.parse(sectionBytes.toString("utf8"));
  assert.ok(sections.length > 200);
  for (const item of sections) {
    assert.ok(item.href.startsWith(prefix), item.href);
    await access(path.join(site, item.href.split("#")[0], "index.html"));
  }
});

test("归档源码与校验清单逐字节一致", async () => {
  const root = fileURLToPath(new URL("../docs/rea-handbook-source/", import.meta.url));
  const source = path.join(root, "source");
  const manifest = (await readFile(path.join(root, "source-sha256.txt"), "utf8")).trim().split("\n");
  const expected = new Set();

  for (const line of manifest) {
    const match = /^([a-f0-9]{64})  (.+)$/.exec(line);
    assert.ok(match, line);
    const [, hash, name] = match;
    assert.ok(!path.isAbsolute(name) && !name.split("/").includes(".."), name);
    assert.ok(!expected.has(name), `清单重复：${name}`);
    expected.add(name);
    const bytes = await readFile(path.join(source, name));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), hash, name);
  }

  const actual = [];
  async function visit(dir) {
    for (const entry of await readdir(path.join(source, dir), { withFileTypes: true })) {
      const name = path.join(dir, entry.name);
      if (entry.isDirectory()) await visit(name);
      else { assert.ok(entry.isFile()); actual.push(name); }
    }
  }
  await visit("");
  assert.deepEqual(actual.sort(), [...expected].sort());

  const lock = JSON.parse(await readFile(path.join(root, "package-lock.json"), "utf8"));
  assert.equal(lock.packages[""].name, "rea-handbook");
});
