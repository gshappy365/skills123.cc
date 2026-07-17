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

async function fixtures() {
  const [catalog, atlasSkills] = await Promise.all([
    readFile(catalogUrl, "utf8").then(JSON.parse),
    readFile(atlasUrl, "utf8").then(JSON.parse),
  ]);
  const packageSkills = await loadPackageSkills(catalog, async (url) => {
    assert.equal(url, "/assets/data/atlas-skills.json");
    return atlasSkills;
  });
  return { catalog, packageSkills };
}

test("package groups use the approved order and retain coming-soon groups", async () => {
  const { catalog } = await fixtures();
  const groups = buildPackageGroups(catalog);

  assert.deepEqual(groups.map((group) => group.id), [
    "development",
    "research",
    "operations",
    "content",
  ]);
  assert.equal(groups[0].packages[0].id, "development");
  assert.equal(groups[1].packages[0].id, "investment-research");
  assert.equal(groups[2].status, "coming-soon");
  assert.equal(groups[3].status, "coming-soon");
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
  assert.equal(result.skillMatches[0].package.name, "投研与行业研究技能包");
  assert.equal(
    result.skillMatches[0].href,
    "/packages/investment-research/?skill=serenity-skill"
  );
});

test("loading featured skills does not mutate a shared package data source", async () => {
  const sourceSkills = [{ id: "existing" }];
  const packageSkills = await loadPackageSkills(
    {
      packages: [
        {
          id: "example",
          workspace: { skillsUrl: "/skills.json" },
          featuredSkill: { id: "featured" },
        },
      ],
    },
    async () => sourceSkills
  );

  assert.deepEqual(sourceSkills, [{ id: "existing" }]);
  assert.deepEqual(packageSkills.example.map((skill) => skill.id), [
    "existing",
    "featured",
  ]);
});
