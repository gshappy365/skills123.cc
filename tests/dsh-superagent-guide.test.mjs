import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const site = fileURLToPath(new URL("../site/", import.meta.url));
const guide = path.join(site, "guides/dsh-superagent");
const prefix = "/guides/dsh-superagent/";

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const name = path.join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(name) : entry.name.endsWith(".html") ? [name] : [];
  }))).flat();
}

test("tutorial is discoverable and preserves licensing notices", async () => {
  const home = await readFile(path.join(site, "index.html"), "utf8");
  const guides = JSON.parse(await readFile(path.join(site, "assets/data/guides.json"), "utf8"));
  const license = await readFile(path.join(guide, "xxd/LICENSE"), "utf8");
  const readme = await readFile(path.join(guide, "SOURCE-README.md"), "utf8");
  assert.ok(home.includes(`href="${prefix}"`));
  assert.equal(guides.find((item) => item.id === "dsh-superagent").href, prefix);
  assert.match(readme, /MIT/);
  assert.match(license, /PolyForm Noncommercial License 1\.0\.0/);
  assert.match(license, /Required Notice: Copyright/);
  assert.match(license, /Required Notice: Commercial use requires a separate license/);
});

test("generated links, assets, canonical URLs and search entries stay under the guide", async () => {
  const pages = await htmlFiles(guide);
  assert.equal(pages.length, 52);
  const sectionJson = await readFile(path.join(guide, "search-sections.json"));
  const version = createHash("sha256").update(sectionJson).digest("hex").slice(0, 16);
  const broken = [];
  for (const page of pages) {
    const html = await readFile(page, "utf8");
    assert.match(html, /<link rel="canonical" href="https:\/\/skills123\.cc\/guides\/dsh-superagent\//);
    assert.doesNotMatch(html, /X\.init\(document\);\s*sync\(\)/);
    assert.ok(html.includes(`data-sections="${prefix}search-sections.json?v=${version}"`));
    for (const [, url] of html.matchAll(/(?:href|src|data-sections)="(\/(?!\/)[^"#?]*)/g)) {
      if (!url.startsWith(prefix)) { broken.push(`${page}: ${url}`); continue; }
      const target = path.join(site, decodeURIComponent(url));
      try { await access(url.endsWith("/") ? path.join(target, "index.html") : target); }
      catch { broken.push(`${page}: ${url}`); }
    }
    const match = html.match(/<script type="application\/json" id="site-search-index"[^>]*>(.*?)<\/script>/s);
    assert.ok(match);
    for (const item of JSON.parse(match[1])) assert.ok(item.href.startsWith(prefix));
  }
  const sections = JSON.parse(await readFile(path.join(guide, "search-sections.json"), "utf8"));
  assert.ok(sections.length > 200);
  for (const item of sections) {
    assert.ok(item.href.startsWith(prefix));
    await access(path.join(site, item.href.split("#")[0], "index.html"));
  }
  assert.deepEqual(broken, []);
});

test("archived source contains exactly the verified manifest inputs", async () => {
  const root = fileURLToPath(new URL("../docs/dsh-superagent-source/", import.meta.url));
  const source = path.join(root, "source");
  const manifest = (await readFile(path.join(root, "source-sha256.txt"), "utf8")).trim().split("\n");
  const expected = new Set();
  for (const line of manifest) {
    const match = /^([a-f0-9]{64})  (.+)$/.exec(line);
    assert.ok(match);
    const [, hash, name] = match;
    assert.ok(!path.isAbsolute(name) && !name.split("/").includes(".."));
    assert.ok(!expected.has(name));
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
});
