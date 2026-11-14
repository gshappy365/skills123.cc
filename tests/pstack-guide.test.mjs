import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const site = fileURLToPath(new URL("../site/", import.meta.url));
const guide = path.join(site, "guides/pstack");

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const name = path.join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(name) : entry.name.endsWith(".html") ? [name] : [];
  }))).flat();
}

test("PStack guide ships licenses and links from both entry points", async () => {
  const [home, guides, workspace, license, kitLicense] = await Promise.all([
    readFile(path.join(site, "index.html"), "utf8"),
    readFile(path.join(site, "assets/data/guides.json"), "utf8").then(JSON.parse),
    readFile(path.join(site, "assets/js/package-workspace.js"), "utf8"),
    readFile(path.join(guide, "LICENSE"), "utf8"),
    readFile(path.join(guide, "xxd/LICENSE"), "utf8"),
  ]);
  assert.match(home, /href="\/guides\/pstack\/"/);
  assert.equal(guides.find((item) => item.id === "pstack").href, "/guides/pstack/");
  assert.match(workspace, /href="\/guides\/pstack\/"/);
  assert.match(license, /MIT License/);
  assert.match(kitLicense, /PolyForm Noncommercial License 1\.0\.0/);
  assert.match(kitLicense, /Required Notice: Commercial use requires a separate license/);
});

test("PStack generated HTML uses the subpath and resolves local links and assets", async () => {
  const pages = await htmlFiles(guide);
  assert.ok(pages.length >= 200);
  const broken = [];
  for (const page of pages) {
    const html = await readFile(page, "utf8");
    for (const [, url] of html.matchAll(/(?:href|src)="(\/(?!\/)[^"#?]*)/g)) {
      if (!url.startsWith("/guides/pstack/")) {
        broken.push(`${path.relative(site, page)}: ${url} (outside subpath)`);
        continue;
      }
      const target = path.join(site, decodeURIComponent(url));
      const candidates = url.endsWith("/") ? [path.join(target, "index.html")] : [target];
      try { await access(candidates[0]); } catch { broken.push(`${path.relative(site, page)}: ${url}`); }
    }
  }
  assert.deepEqual(broken, []);
});
