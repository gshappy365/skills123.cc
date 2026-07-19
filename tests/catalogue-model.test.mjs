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
    "/assets/data/dair-academy-skills.json": await readJson(
      "dair-academy-skills.json"
    ),
  };
  const model = await createCatalogueModel(catalog, async (url) => sources[url]);

  assert.deepEqual(Object.keys(model.packageSkills), [
    "development",
    "investment-research",
    "dair-academy",
  ]);
  assert.equal(getPackageWorkspaceModel(model, "development").skills.length, 42);
  assert.equal(getPackageWorkspaceModel(model, "dair-academy").skills.length, 8);
});

test("DAIR Academy skills expose the confirmed plugin detail contract", async () => {
  const catalog = await readJson("catalog.json");
  const dairSkills = await readJson("dair-academy-skills.json");
  const model = await createCatalogueModel(catalog, async (url) => {
    if (url === "/assets/data/dair-academy-skills.json") return dairSkills;
    return url.includes("atlas") ? await readJson("atlas-skills.json") : await readJson("research-skills.json");
  });
  const workspace = getPackageWorkspaceModel(model, "dair-academy");

  assert.equal(workspace.package.name, "DAIR Academy 技能包");
  assert.deepEqual(Object.values(workspace.labels.groups), [
    "视觉生成",
    "学习与课程",
    "研究与调研",
    "知识管理",
    "情报监控",
  ]);
  for (const skill of workspace.skills) {
    assert.match(skill.installCommand, /^\/plugin install /);
    assert.equal(skill.platform, "Claude Code plugin");
    assert.ok(Array.isArray(skill.requirements));
    assert.ok(Array.isArray(skill.environmentVariables));
    assert.ok(Array.isArray(skill.outputs) && skill.outputs.length > 0);
    assert.match(skill.sourceUrl, /^https:\/\/github\.com\/dair-ai\//);
    assert.equal(skill.upstreamCommit.length, 40);
    assert.ok(["MIT", "unconfirmed"].includes(skill.license));
  }
  assert.equal(workspace.skills.filter((skill) => skill.license === "MIT").length, 2);
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
