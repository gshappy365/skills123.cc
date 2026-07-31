import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildPackageGroups,
  loadPackageSkills,
  searchCatalogue,
} from "../site/assets/js/catalogue-search.js";

const catalogUrl = new URL("../site/assets/data/catalog.json", import.meta.url);
const atlasUrl = new URL("../site/assets/data/atlas-skills.json", import.meta.url);
const researchUrl = new URL(
  "../site/assets/data/research-skills.json",
  import.meta.url
);
const financialServicesUrl = new URL("../site/assets/data/financial-services-skills.json", import.meta.url);
const rayskillsUrl = new URL(
  "../site/assets/data/rayskills-skills.json",
  import.meta.url
);
const pmSkillsUrl = new URL(
  "../site/assets/data/pm-skills.json",
  import.meta.url
);
const wigoloUrl = new URL("../site/assets/data/wigolo-skills.json", import.meta.url);
const last30daysUrl = new URL("../site/assets/data/last30days-skills.json", import.meta.url);
const wazaUrl = new URL("../site/assets/data/waza-skills.json", import.meta.url);
const ljgUrl = new URL("../site/assets/data/ljg-skills.json", import.meta.url);
const founderEvaluatorUrl = new URL("../site/assets/data/founder-project-evaluator-skills.json", import.meta.url);

async function fixtures() {
  const [catalog, atlasSkills, researchSkills, financialServicesSkills, rayskills, pmSkills, wigoloSkills, last30daysSkills, wazaSkills, ljgSkills, founderEvaluatorSkills] = await Promise.all([
    readFile(catalogUrl, "utf8").then(JSON.parse),
    readFile(atlasUrl, "utf8").then(JSON.parse),
    readFile(researchUrl, "utf8").then(JSON.parse),
    readFile(financialServicesUrl, "utf8").then(JSON.parse),
    readFile(rayskillsUrl, "utf8").then(JSON.parse),
    readFile(pmSkillsUrl, "utf8").then(JSON.parse),
    readFile(wigoloUrl, "utf8").then(JSON.parse),
    readFile(last30daysUrl, "utf8").then(JSON.parse),
    readFile(wazaUrl, "utf8").then(JSON.parse),
    readFile(ljgUrl, "utf8").then(JSON.parse),
    readFile(founderEvaluatorUrl, "utf8").then(JSON.parse),
  ]);
  const packageSkills = await loadPackageSkills(catalog, async (url) => {
    if (url === "/assets/data/atlas-skills.json") return atlasSkills;
    if (url === "/assets/data/research-skills.json") return researchSkills;
    if (url === "/assets/data/financial-services-skills.json") return financialServicesSkills;
    if (url === "/assets/data/rayskills-skills.json") return rayskills;
    if (url === "/assets/data/pm-skills.json") return pmSkills;
    if (url === "/assets/data/wigolo-skills.json") return wigoloSkills;
    if (url === "/assets/data/last30days-skills.json") return last30daysSkills;
    if (url === "/assets/data/waza-skills.json") return wazaSkills;
    if (url === "/assets/data/ljg-skills.json") return ljgSkills;
    if (url === "/assets/data/founder-project-evaluator-skills.json") return founderEvaluatorSkills;
    assert.fail(`Unexpected skills URL: ${url}`);
  });
  return { catalog, packageSkills };
}

test("package groups use the approved order and retain coming-soon groups", async () => {
  const { catalog } = await fixtures();
  const groups = buildPackageGroups(catalog);

  assert.deepEqual(groups.map((group) => group.id), [
    "development",
    "research",
    "content",
    "operations",
  ]);
  assert.equal(groups[0].packages[0].id, "development");
  assert.equal(groups[1].packages[0].id, "investment-research");
  assert.equal(groups[2].status, "active");
  assert.equal(groups[2].packages[0].id, "rayskills");
  assert.equal(groups[3].status, "active");
  assert.equal(groups[3].packages[0].id, "pm-skills");
});

test("global search distinguishes package matches from owned skill matches", async () => {
  const { catalog, packageSkills } = await fixtures();

  const packageResult = searchCatalogue({
    catalog,
    packageSkills,
    query: "行业研究",
  });
  assert.deepEqual(packageResult.packageMatches.map((item) => item.id), [
    "investment-research",
  ]);

  const skillResult = searchCatalogue({
    catalog,
    packageSkills,
    query: "prototype",
  });
  assert.deepEqual(skillResult.skillMatches.map((item) => item.id), ["prototype"]);
  assert.equal(skillResult.skillMatches[0].package.id, "development");
  assert.equal(
    skillResult.skillMatches[0].href,
    "/packages/development/?skill=prototype"
  );
});

test("global search matches commands and reports Serenity package ownership", async () => {
  const { catalog, packageSkills } = await fixtures();
  const result = searchCatalogue({
    catalog,
    packageSkills,
    query: "/serenity-skill",
  });

  assert.deepEqual(result.skillMatches.map((item) => item.id), ["serenity-skill"]);
  assert.equal(result.skillMatches[0].package.name, "Serenity.skill");
  assert.equal(
    result.skillMatches[0].href,
    "/packages/investment-research/?skill=serenity-skill"
  );
});

test("global search matches a Rayskills direction and retains content package ownership", async () => {
  const { catalog, packageSkills } = await fixtures();
  const result = searchCatalogue({
    catalog,
    packageSkills,
    query: "内容",
  });

  assert.ok(result.skillMatches.some((item) => item.id === "ray-writer"));
  assert.equal(
    result.skillMatches.find((item) => item.id === "ray-writer").package.id,
    "rayskills"
  );
});

test("global search matches a PM skill and retains operations package ownership", async () => {
  const { catalog, packageSkills } = await fixtures();
  const result = searchCatalogue({
    catalog,
    packageSkills,
    query: "产品需求文档",
  });

  assert.ok(result.skillMatches.some((item) => item.id === "create-prd"));
  assert.equal(
    result.skillMatches.find((item) => item.id === "create-prd").package.id,
    "pm-skills"
  );
});

test("global search reaches the four newly catalogued packages", async () => {
  const { catalog, packageSkills } = await fixtures();
  for (const [query, packageId, skillId] of [
    ["网页搜索", "wigolo", "wigolo-search"],
    ["近况研究", "last30days", "last30days"],
    ["根因分析", "waza", "hunt"],
    ["投资", "ljg-skills", "ljg-invest"],
  ]) {
    const result = searchCatalogue({ catalog, packageSkills, query });
    const match = result.skillMatches.find((item) => item.id === skillId);
    assert.ok(match, `${query} should find ${skillId}`);
    assert.equal(match.package.id, packageId);
  }
});

test("global search reaches the founder evaluator and its Gate Review skill", async () => {
  const { catalog, packageSkills } = await fixtures();
  const result = searchCatalogue({ catalog, packageSkills, query: "Gate Review" });
  const match = result.skillMatches.find((item) => item.id === "founder-project-evaluator");
  assert.ok(match);
  assert.equal(match.package.id, "founder-project-evaluator");
  assert.equal(match.href, "/packages/founder-project-evaluator/?skill=founder-project-evaluator");
});

test("global search reaches financial services skills and preserves package ownership", async () => {
  const { catalog, packageSkills } = await fixtures();
  const result = searchCatalogue({ catalog, packageSkills, query: "comps" });
  const match = result.skillMatches.find((item) => item.id === "comps-analysis");
  assert.ok(match);
  assert.equal(match.package.id, "financial-services");
  assert.equal(match.href, "/packages/financial-services/?skill=comps-analysis");
});

test("loading featured skills does not mutate a shared package data source", async () => {
  const sourceSkills = [{ id: "existing" }];
  const packageSkills = await loadPackageSkills(
    {
      scenarios: [{ id: "development", name: "开发", status: "active" }],
      packages: [
        {
          id: "example",
          name: "Example",
          scenario: "development",
          skillCount: 2,
          status: "active",
          workspace: {
            skillsUrl: "/skills.json",
            groupLabels: { example: "示例" },
            lifecycleLabels: { published: "已发布" },
            invocationModeLabels: { "user-only": "用户触发" },
          },
          featuredSkill: {
            id: "featured",
            group: "example",
            lifecycle: "published",
            invocationMode: "user-only",
          },
        },
      ],
    },
    async () => [
      {
        ...sourceSkills[0],
        group: "example",
        lifecycle: "published",
        invocationMode: "user-only",
      },
    ]
  );

  assert.deepEqual(sourceSkills, [{ id: "existing" }]);
  assert.deepEqual(packageSkills.example.map((skill) => skill.id), [
    "existing",
    "featured",
  ]);
});
