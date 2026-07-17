import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { derivePackageWorkspaceState } from "../site/assets/js/package-workspace-state.js";

const skillsUrl = new URL(
  "../site/assets/data/research-skills.json",
  import.meta.url
);

async function loadSkills() {
  return JSON.parse(await readFile(skillsUrl, "utf8"));
}

const labels = {
  groups: { "industry-research": "行业研究" },
  lifecycles: { published: "已发布" },
  invocationModes: { "user-only": "用户触发" },
};

test("research workspace exposes Serenity through the shared state seam", async () => {
  const skills = await loadSkills();
  const state = derivePackageWorkspaceState({
    packageId: "investment-research",
    skills,
    query: "证据验证",
    filters: { groups: ["industry-research"], lifecycles: ["published"] },
    selectedSkillId: "serenity-skill",
    labels,
  });

  assert.deepEqual(state.visibleSkills.map((skill) => skill.id), [
    "serenity-skill",
  ]);
  assert.equal(state.selectedDetail.name, "Serenity.skill");
  assert.equal(state.selectedDetail.command, "/serenity-skill");
  assert.equal(
    state.selectedDetail.readingUrl,
    "/packages/investment-research/skills/serenity-skill/"
  );
  assert.deepEqual(state.selectedDetail.tags, [
    "行业研究",
    "已发布",
    "用户触发",
    "供应链",
    "证据验证",
    "研究排序",
  ]);
  assert.deepEqual(state.selectedDetail.relationships, [
    { type: "核心方法", label: "9 步研究流程" },
    { type: "证据框架", label: "Evidence Ladder" },
    { type: "最终输出", label: "研究排序与判断" },
  ]);
});
