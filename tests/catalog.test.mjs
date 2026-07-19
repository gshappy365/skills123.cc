import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const catalogUrl = new URL("../site/assets/data/catalog.json", import.meta.url);
const atlasSkillsUrl = new URL(
  "../site/assets/data/atlas-skills.json",
  import.meta.url
);

async function loadCatalog() {
  return JSON.parse(await readFile(catalogUrl, "utf8"));
}

test("launch catalog exposes the three active packages and coming-soon scenarios", async () => {
  const catalog = await loadCatalog();
  const activePackages = catalog.packages.filter((item) => item.status === "active");
  const scenarios = Object.fromEntries(catalog.scenarios.map((item) => [item.id, item]));

  assert.deepEqual(
    activePackages.map((item) => item.id).sort(),
    ["dair-academy", "development", "investment-research"]
  );
  assert.equal(scenarios.content.status, "coming-soon");
  assert.equal(scenarios.operations.status, "coming-soon");
});

test("DAIR Academy package keeps its approved identity and fixed upstream snapshot", async () => {
  const catalog = await loadCatalog();
  const dair = catalog.packages.find((item) => item.id === "dair-academy");

  assert.equal(dair.name, "DAIR Academy 技能包");
  assert.equal(dair.scenario, "research");
  assert.equal(dair.skillCount, 8);
  assert.equal(dair.workspace.groupFacetLabel, "技能方向");
  assert.equal(
    dair.source.commit,
    "945b237049a08765c0cd164774f974647a6b7f97"
  );
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

test("every development skill has a Chinese introduction and keeps its English source", async () => {
  const skills = JSON.parse(await readFile(atlasSkillsUrl, "utf8"));

  assert.equal(skills.length, 42);
  for (const skill of skills) {
    assert.match(skill.descriptionZh, /[\u3400-\u9fff]/, `${skill.id} 缺少中文介绍`);
    assert.ok(skill.descriptionEn, `${skill.id} 缺少英文来源介绍`);
  }
});

test("investment research package makes Serenity discoverable", async () => {
  const catalog = await loadCatalog();
  const investmentResearch = catalog.packages.find(
    (item) => item.id === "investment-research"
  );

  assert.equal(investmentResearch.featuredSkill.id, "serenity-skill");
  assert.equal(investmentResearch.featuredSkill.name, "Serenity.skill");
  assert.equal(
    investmentResearch.workspace.skillsUrl,
    "/assets/data/research-skills.json"
  );
  assert.equal(
    investmentResearch.workspace.groupLabels["industry-research"],
    "行业研究"
  );
});
