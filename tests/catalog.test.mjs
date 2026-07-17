import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const catalogUrl = new URL("../site/assets/data/catalog.json", import.meta.url);

async function loadCatalog() {
  return JSON.parse(await readFile(catalogUrl, "utf8"));
}

test("launch catalog exposes the two active packages and coming-soon scenarios", async () => {
  const catalog = await loadCatalog();
  const activePackages = catalog.packages.filter((item) => item.status === "active");
  const scenarios = Object.fromEntries(catalog.scenarios.map((item) => [item.id, item]));

  assert.deepEqual(
    activePackages.map((item) => item.id).sort(),
    ["development", "investment-research"]
  );
  assert.equal(scenarios.content.status, "coming-soon");
  assert.equal(scenarios.operations.status, "coming-soon");
});

test("development package retains the Atlas catalogue boundary", async () => {
  const catalog = await loadCatalog();
  const development = catalog.packages.find((item) => item.id === "development");

  assert.equal(development.skillCount, 42);
  assert.equal(development.source.name, "Skills Atlas");
  assert.equal(development.groups.length, 6);
  assert.equal(development.workspace.skillsUrl, "/assets/data/atlas-skills.json");
  assert.equal(development.workspace.groupLabels.engineering, "软件工程");
  assert.equal(development.workspace.lifecycleLabels.published, "已发布");
});

test("investment research package makes Serenity discoverable", async () => {
  const catalog = await loadCatalog();
  const investmentResearch = catalog.packages.find(
    (item) => item.id === "investment-research"
  );

  assert.equal(investmentResearch.featuredSkill.id, "serenity-skill");
  assert.equal(investmentResearch.featuredSkill.name, "Serenity.skill");
});
