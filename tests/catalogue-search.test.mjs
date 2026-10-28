import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildPackageGroups,
  loadPackageSkills,
  searchCatalogue,
} from "../site/assets/js/catalogue-search.js";

const catalogUrl = new URL("../site/assets/data/catalog.json", import.meta.url);
async function fixtures() {
  const catalog = JSON.parse(await readFile(catalogUrl, "utf8"));
  const packageSkills = await loadPackageSkills(catalog, async (url) => JSON.parse(await readFile(new URL("../site" + url, import.meta.url), "utf8")));
  return { catalog, packageSkills };
}

test("package groups use the approved order and retain coming-soon groups", async () => {
  const { catalog } = await fixtures();
  const groups = buildPackageGroups(catalog);

  assert.deepEqual(groups.map((group) => group.id), [
    "development",
    "research",
  ]);
  assert.equal(groups[0].packages[0].id, "development");
  assert.equal(groups[1].packages[0].id, "investment-research");
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
  assert.deepEqual(skillResult.skillMatches.map((item) => item.id), [
    "prototype",
    "principle-exhaust-the-design-space",
  ]);
  assert.equal(skillResult.skillMatches[0].package.id, "development");
  assert.equal(
    skillResult.skillMatches[0].href,
    "/packages/development/?skill=prototype"
  );
  assert.equal(skillResult.skillMatches[1].package.id, "pstack");
});

test("identically named skills remain discoverable under each source package", async () => {
  const { catalog, packageSkills } = await fixtures();
  const result = searchCatalogue({ catalog, packageSkills, query: "teach" });
  const matches = result.skillMatches.filter((item) => item.id === "teach");

  assert.deepEqual(matches.map((item) => item.package.id), ["development", "pstack"]);
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



test("global search reaches PStack skills and retains development package ownership", async () => {
  const { catalog, packageSkills } = await fixtures();
  const result = searchCatalogue({ catalog, packageSkills, query: "验证关键假设" });
  const match = result.skillMatches.find((item) => item.id === "blast-radius");

  assert.ok(match);
  assert.equal(match.package.id, "pstack");
  assert.equal(match.href, "/packages/pstack/?skill=blast-radius");
});

test("global search reaches the four newly catalogued packages", async () => {
  const { catalog, packageSkills } = await fixtures();
  for (const [query, packageId, skillId] of [
    ["网页搜索", "wigolo", "wigolo-search"],
    ["近况研究", "last30days", "last30days"],
    ["根因分析", "waza", "hunt"],
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

test("global search finds an Addy Osmani skill and excludes removed packages", async () => {
 const {catalog, packageSkills} = await fixtures();
 const match=searchCatalogue({catalog,packageSkills,query:"test-driven-development"}).skillMatches.find(s=>s.package.id === "addyosmani-agent-skills");
 assert.equal(match?.id,"test-driven-development");
 assert.equal(match.href,"/packages/addyosmani-agent-skills/?skill=test-driven-development");
 assert.equal(searchCatalogue({catalog,packageSkills,query:"ray-writer"}).skillMatches.length,0);
});
