import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  createPackageWorkspaceModel,
  getPackageWorkspaceModel,
} from "../site/assets/js/catalogue-model.js";
import { derivePackageWorkspaceState } from "../site/assets/js/package-workspace-state.js";

const dataRoot = new URL("../site/assets/data/", import.meta.url);
const readJson = (name) => readFile(new URL(name, dataRoot), "utf8").then(JSON.parse);

test("PM Skills workspace exposes all 68 skills across nine product directions", async () => {
  const catalog = await readJson("catalog.json");
  const skills = await readJson("pm-skills.json");
  const model = await createPackageWorkspaceModel(catalog, "pm-skills", async () => skills);
  const workspace = getPackageWorkspaceModel({ catalog, packageSkills: { "pm-skills": model.skills } }, "pm-skills");

  assert.equal(workspace.skills.length, 68);
  assert.deepEqual(Object.values(workspace.labels.groups), [
    "产品发现",
    "产品策略",
    "产品执行",
    "用户研究",
    "数据分析",
    "上市增长",
    "产品营销",
    "工具箱",
    "AI 交付",
  ]);

  const state = derivePackageWorkspaceState({
    packageId: "pm-skills",
    skills: workspace.skills,
    labels: workspace.labels,
    query: "PRD",
  });
  assert.equal(state.selectedSkill.id, "create-prd");
  assert.equal(state.selectedDetail.groupLabel, "产品执行");
});
