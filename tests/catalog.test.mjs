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
test("launch catalog exposes the thirteen active packages and scenario statuses", async () => {
  const catalog = await loadCatalog();
  const activePackages = catalog.packages.filter((item) => item.status === "active");
  const scenarios = Object.fromEntries(catalog.scenarios.map((item) => [item.id, item]));
  assert.deepEqual(
    activePackages.map((item) => item.id).sort(),
    [
      "awesome-ecom-skills",
      "development",
      "founder-project-evaluator",
      "gbrain",
      "investment-research",
      "last30days",
      "ljg-skills",
      "pm-skills",
      "pstack",
      "rayskills",
      "shopify-ai-toolkit",
      "waza",
      "wigolo",
    ]
  );
  assert.equal(scenarios.content.status, "active");
  assert.equal(scenarios.operations.status, "active");
});
test("new upstream libraries preserve their package placement and snapshots", async () => {
  const catalog = await loadCatalog();
  const expected = {
    wigolo: ["research", 11, "unconfirmed", "56da0c80d52bba51cc428545f468ec0dbd6651c3"],
    last30days: ["research", 1, "MIT", "a22c8e7576c2c69885b895002cc15968cd4cb25a"],
    waza: ["development", 8, "MIT", "9c97ccb6d96e776bf814e27498d0afc0ed3d1e94"],
    "ljg-skills": ["content", 21, "unconfirmed", "c41540f7a5a9770698e2fe15f1f6f2243eec5128"],
  };
  for (const [id, [scenario, skillCount, license, commit]] of Object.entries(expected)) {
    const pkg = catalog.packages.find((item) => item.id === id);
    assert.equal(pkg.scenario, scenario);
    assert.equal(pkg.skillCount, skillCount);
    assert.equal(pkg.license, license);
    assert.equal(pkg.source.commit, commit);
    assert.equal(pkg.status, "active");
  }
});
test("founder project evaluator is catalogued as a research Gate Review skill", async () => {
  const catalog = await loadCatalog();
  const pkg = catalog.packages.find((item) => item.id === "founder-project-evaluator");
  assert.equal(pkg.scenario, "research");
  assert.equal(pkg.skillCount, 1);
  assert.equal(pkg.workspace.skillsUrl, "/assets/data/founder-project-evaluator-skills.json");
  assert.equal(pkg.workspace.groupLabels["founder-evaluation"], "创业项目评估");
});
test("PM Skills package preserves its operations placement and upstream snapshot", async () => {
  const catalog = await loadCatalog();
  const pmSkills = catalog.packages.find((item) => item.id === "pm-skills");
  assert.equal(pmSkills.name, "PM Skills 产品管理技能包");
  assert.equal(pmSkills.scenario, "operations");
  assert.equal(pmSkills.skillCount, 68);
  assert.match(pmSkills.installCommand, /^codex plugin marketplace add phuryn\/pm-skills && codex plugin add pm-toolkit@pm-skills/);
  assert.match(pmSkills.installCommand, /codex plugin add pm-ai-shipping@pm-skills$/);
  assert.equal(pmSkills.license, "MIT");
  assert.equal(pmSkills.source.commit, "18468a95b427e70e258b51389796367c6f684e7d");
});
test("Rayskills package preserves its content placement, scope, license and snapshot", async () => {
  const catalog = await loadCatalog();
  const rayskills = catalog.packages.find((item) => item.id === "rayskills");
  assert.equal(rayskills.name, "Rayskills 内容技能包");
  assert.equal(rayskills.scenario, "content");
  assert.equal(rayskills.skillCount, 21);
  assert.equal(rayskills.installCommand, "npx -y skills add imraywang/rayskills -g --all");
  assert.equal(rayskills.license, "CC BY-NC 4.0");
  assert.equal(rayskills.workspace.groupFacetLabel, "技能方向");
  assert.equal(rayskills.source.commit, "454bff330bb3ddae9d3c639bd0f791e6c61dd830");
});
test("GBrain package preserves its content placement, scope and upstream snapshot", async () => {
  const catalog = await loadCatalog();
  const gbrain = catalog.packages.find((item) => item.id === "gbrain");
  assert.equal(gbrain.name, "GBrain Agent Brain 知识技能包");
  assert.equal(gbrain.scenario, "content");
  assert.equal(gbrain.skillCount, 53);
  assert.equal(gbrain.installCommand, "bun install -g github:garrytan/gbrain && gbrain init --pglite");
  assert.equal(gbrain.license, "MIT");
  assert.equal(gbrain.workspace.groupFacetLabel, "技能方向");
  assert.equal(gbrain.source.commit, "c6dc0adf26a2d20df1147d2ec87c8922ca86d410");
});
test("Shopify AI Toolkit package preserves its operations placement and snapshot", async () => {
  const catalog = await loadCatalog();
  const shopify = catalog.packages.find((item) => item.id === "shopify-ai-toolkit");
  assert.equal(shopify.name, "Shopify AI Toolkit 开发技能包");
  assert.equal(shopify.scenario, "operations");
  assert.equal(shopify.skillCount, 21);
  assert.equal(shopify.installCommand, "codex plugin add shopify@openai-curated");
  assert.equal(shopify.license, "MIT");
  assert.equal(shopify.source.commit, "0e06bc35611e505e372de7f8cdf265e6d6dbc311");
});
test("Awesome Ecom Skills package preserves its operations placement and snapshot", async () => {
  const catalog = await loadCatalog();
  const ecom = catalog.packages.find((item) => item.id === "awesome-ecom-skills");
  assert.equal(ecom.name, "Awesome Ecom Skills 电商运营技能包");
  assert.equal(ecom.scenario, "operations");
  assert.equal(ecom.skillCount, 9);
  assert.equal(ecom.installCommand, "claude plugin marketplace add kgelster/awesome-ecom-skills && claude plugin install ecom@kgelster");
  assert.equal(ecom.license, "MIT");
  assert.equal(ecom.source.commit, "6d6f1d4e5e0f9ece9e66a3c859d5fbbc99558688");
});
test("development package is updated to mattpocock/skills v1.3.1", async () => {
  const catalog = await loadCatalog();
  const development = catalog.packages.find((item) => item.id === "development");
  assert.equal(development.skillCount, 37);
  assert.equal(development.name, "Mattpocock 技能包");
  assert.equal(development.installCommand, "npx -y skills add mattpocock/skills");
  assert.equal(development.license, "MIT");
  assert.equal(development.platform, "Claude Code / Codex / Cursor");
  assert.equal(development.source.name, "mattpocock/skills");
  assert.equal(development.source.url, "https://github.com/mattpocock/skills");
  assert.equal(development.source.version, "1.3.1");
  assert.equal(development.source.commit, "24fe0ef7737efae15c87225755e9f6f5965e4888");
  assert.equal(development.groups.length, 4);
  assert.equal(development.workspace.skillsUrl, "/assets/data/atlas-skills.json");
  assert.equal(development.workspace.groupLabels.engineering, "软件工程");
  assert.equal(development.workspace.groupFacetLabel, "技能方向");
  assert.equal(development.workspace.lifecycleLabels.published, "已发布");
});
test("every development skill has a Chinese introduction and keeps its English source", async () => {
  const skills = JSON.parse(await readFile(atlasSkillsUrl, "utf8"));
  assert.equal(skills.length, 37);
  assert.ok(skills.some((skill) => skill.id === "implement-spec"));
  assert.ok(skills.some((skill) => skill.id === "pr"));
  assert.ok(skills.some((skill) => skill.id === "retro"));
  assert.ok(!skills.some((skill) => skill.id === "resolving-merge-conflicts"));
  assert.deepEqual(
    Object.fromEntries(
      ["engineering", "in-progress", "productivity", "misc"].map((group) => [
        group,
        skills.filter((skill) => skill.group === group).length,
      ])
    ),
    { engineering: 20, "in-progress": 6, productivity: 7, misc: 4 }
  );
  for (const [id, invocationMode] of [
    ["implement-spec", "user-only"],
    ["pr", "model-allowed"],
    ["retro", "user-only"],
  ]) {
    const skill = skills.find((item) => item.id === id);
    assert.equal(skill.group, "engineering");
    assert.equal(skill.invocationMode, invocationMode);
    assert.equal(skill.lifecycle, "published");
  }
  for (const skill of skills) {
    assert.match(skill.descriptionZh, /[\u3400-\u9fff]/, `${skill.id} 缺少中文介绍`);
    assert.ok(skill.descriptionEn, `${skill.id} 缺少英文来源介绍`);
  }
});

test("PStack package preserves its Cursor plugin snapshot and all 51 skills", async () => {
  const catalog = await loadCatalog();
  const pstack = catalog.packages.find((item) => item.id === "pstack");
  assert.equal(pstack.name, "PStack 工程技能包");
  assert.equal(pstack.scenario, "development");
  assert.equal(pstack.skillCount, 51);
  assert.equal(pstack.installCommand, "/add-plugin pstack");
  assert.equal(pstack.platform, "Cursor");
  assert.equal(pstack.license, "MIT");
  assert.equal(pstack.source.type, "plugin");
  assert.equal(pstack.source.version, "0.15.10");
  assert.equal(pstack.source.commit, "4e5b1cf2ccb0ea3716f08c8ee0a5856b5ab93536");
  assert.equal(pstack.workspace.skillsUrl, "/assets/data/pstack-skills.json");
  assert.deepEqual(pstack.groups, Object.values(pstack.workspace.groupLabels));
});

test("PStack has localized descriptions, pinned skill sources, and a static package route", async () => {
  const skills = JSON.parse(
    await readFile(new URL("../site/assets/data/pstack-skills.json", import.meta.url), "utf8")
  );
  assert.equal(skills.length, 51);
  assert.deepEqual(
    Object.fromEntries(
      [
        "workflow-collaboration",
        "engineering-principles",
        "quality-verification",
        "writing-communication",
        "product-design",
      ].map((group) => [group, skills.filter((skill) => skill.group === group).length])
    ),
    {
      "workflow-collaboration": 14,
      "engineering-principles": 24,
      "quality-verification": 8,
      "writing-communication": 4,
      "product-design": 1,
    }
  );
  for (const skill of skills) {
    assert.match(skill.descriptionZh, /[\u3400-\u9fff]/, `${skill.id} 缺少中文介绍`);
    assert.ok(skill.descriptionEn, `${skill.id} 缺少上游英文描述`);
    assert.match(skill.sourceUrl, /4e5b1cf2ccb0ea3716f08c8ee0a5856b5ab93536/);
    assert.equal(skill.upstreamCommit, "4e5b1cf2ccb0ea3716f08c8ee0a5856b5ab93536");
  }
  await assert.doesNotReject(
    readFile(new URL("../site/packages/pstack/index.html", import.meta.url), "utf8")
  );
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
