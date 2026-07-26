import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const siteRoot = new URL("../site/", import.meta.url);
const readSiteFile = (path) => readFile(new URL(path, siteRoot), "utf8");

function versionFor(source, modulePath) {
  const escapedPath = modulePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return source.match(new RegExp(`${escapedPath}\\?v=([^"'\\s)]+)`))?.[1];
}

test("homepage cache version propagates through the changed catalogue module graph", async () => {
  const [homepage, navigation, search] = await Promise.all([
    readSiteFile("index.html"),
    readSiteFile("assets/js/package-navigation.js"),
    readSiteFile("assets/js/catalogue-search.js"),
  ]);

  const version = versionFor(homepage, "/assets/js/package-navigation.js");
  assert.ok(version, "homepage entry module must be cache-versioned");
  assert.equal(versionFor(navigation, "./catalogue-search.js"), version);
  assert.equal(versionFor(search, "./catalogue-model.js"), version);
});

test("package pages propagate one cache version through the changed workspace module graph", async () => {
  const [packageEntries, workspacePage, workspace] = await Promise.all([
    readdir(new URL("packages/", siteRoot), { withFileTypes: true }),
    readSiteFile("assets/js/package-workspace-page.js"),
    readSiteFile("assets/js/package-workspace.js"),
  ]);

  const packagePages = packageEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => `packages/${entry.name}/index.html`);
  const pages = await Promise.all(packagePages.map(readSiteFile));
  const versions = pages.map((page) =>
    versionFor(page, "/assets/js/package-workspace-page.js")
  );

  assert.ok(versions.length > 0, "at least one package page must exist");
  assert.ok(versions.every(Boolean), "every package page entry must be cache-versioned");
  assert.equal(new Set(versions).size, 1, "package pages must share one cache version");

  const [version] = versions;
  assert.equal(versionFor(workspacePage, "./package-workspace.js"), version);
  assert.equal(versionFor(workspace, "./catalogue-model.js"), version);
});
