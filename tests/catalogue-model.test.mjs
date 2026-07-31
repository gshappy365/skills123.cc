import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  createCatalogueModel,
  getPackageWorkspaceModel,
} from "../site/assets/js/catalogue-model.js";

const siteData = new URL("../site/assets/data/", import.meta.url);

async function readJson(name) {
  return JSON.parse(await readFile(new URL(name, siteData), "utf8"));
}

test("catalogue model loads and validates every package through one boundary", async () => {
  const catalog = await readJson("catalog.json");
  const sources = {
    "/assets/data/atlas-skills.json": await readJson("atlas-skills.json"),
    "/assets/data/research-skills.json": await readJson("research-skills.json"),
    "/assets/data/rayskills-skills.json": await readJson("rayskills-skills.json"),
    "/assets/data/pm-skills.json": await readJson("pm-skills.json"),
    "/assets/data/wigolo-skills.json": await readJson("wigolo-skills.json"),
    "/assets/data/last30days-skills.json": await readJson("last30days-skills.json"),
    "/assets/data/waza-skills.json": await readJson("waza-skills.json"),
    "/assets/data/ljg-skills.json": await readJson("ljg-skills.json"),
    "/assets/data/founder-project-evaluator-skills.json": await readJson("founder-project-evaluator-skills.json"),
  };
  const model = await createCatalogueModel(catalog, async (url) => sources[url]);

  assert.deepEqual(Object.keys(model.packageSkills), [
    "development",
    "investment-research",
    "rayskills",
    "pm-skills",
    "wigolo",
    "last30days",
    "founder-project-evaluator",
    "waza",
    "ljg-skills",
  ]);
  assert.equal(getPackageWorkspaceModel(model, "development").skills.length, 42);
  assert.equal(getPackageWorkspaceModel(model, "pm-skills").skills.length, 68);
  assert.equal(getPackageWorkspaceModel(model, "wigolo").skills.length, 11);
  assert.equal(getPackageWorkspaceModel(model, "last30days").skills.length, 1);
  assert.equal(getPackageWorkspaceModel(model, "waza").skills.length, 8);
  assert.equal(getPackageWorkspaceModel(model, "ljg-skills").skills.length, 21);
  assert.equal(getPackageWorkspaceModel(model, "founder-project-evaluator").skills.length, 1);
});

test("catalogue boundary rejects a skill whose group has no package label", async () => {
  const catalog = {
    scenarios: [{ id: "research", name: "研究", status: "active" }],
    packages: [
      {
        id: "broken",
        name: "Broken",
        scenario: "research",
        skillCount: 1,
        status: "active",
        workspace: {
          skillsUrl: "/broken.json",
          groupLabels: {},
          lifecycleLabels: { published: "已发布" },
          invocationModeLabels: { "user-only": "用户触发" },
        },
      },
    ],
  };

  await assert.rejects(
    createCatalogueModel(catalog, async () => [
      {
        id: "broken-skill",
        group: "missing",
        lifecycle: "published",
        invocationMode: "user-only",
      },
    ]),
    /unknown group "missing"/
  );
});

test("catalogue boundary rejects incomplete install details before rendering", async () => {
  const catalog = {
    scenarios: [{ id: "research", name: "研究", status: "active" }],
    packages: [
      {
        id: "incomplete",
        name: "Incomplete",
        scenario: "research",
        skillCount: 1,
        status: "active",
        workspace: {
          skillsUrl: "/incomplete.json",
          groupLabels: { research: "研究" },
          lifecycleLabels: { published: "已发布" },
          invocationModeLabels: { "model-allowed": "自然语言触发" },
        },
      },
    ],
  };

  await assert.rejects(
    createCatalogueModel(catalog, async () => [
      {
        id: "incomplete-skill",
        group: "research",
        lifecycle: "published",
        invocationMode: "model-allowed",
        installCommand: "/plugin install incomplete@example",
      },
    ]),
    /is missing platform/
  );
});
