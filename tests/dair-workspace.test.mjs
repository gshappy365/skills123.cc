import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { derivePackageWorkspaceState } from "../site/assets/js/package-workspace-state.js";

const skillsUrl = new URL(
  "../site/assets/data/dair-academy-skills.json",
  import.meta.url
);

const labels = {
  groups: {
    "visual-content": "视觉生成",
    learning: "学习与课程",
    "research-generation": "研究与调研",
    "knowledge-management": "知识管理",
    "intelligence-monitoring": "情报监控",
  },
  lifecycles: { published: "已发布" },
  invocationModes: { "model-allowed": "自然语言触发" },
};

async function loadSkills() {
  return JSON.parse(await readFile(skillsUrl, "utf8"));
}

test("DAIR workspace searches skill directions and selects the owned skill", async () => {
  const state = derivePackageWorkspaceState({
    packageId: "dair-academy",
    skills: await loadSkills(),
    query: "情报监控",
    labels,
  });

  assert.deepEqual(state.visibleSkills.map((skill) => skill.id), [
    "x-agent-intelligence",
  ]);
  assert.equal(state.selectedDetail.groupLabel, "情报监控");
});

test("DAIR detail preserves the complete install and provenance contract", async () => {
  const state = derivePackageWorkspaceState({
    packageId: "dair-academy",
    skills: await loadSkills(),
    selectedSkillId: "survey-generator",
    labels,
  });
  const detail = state.selectedDetail;

  assert.equal(
    detail.installCommand,
    "/plugin install survey-generator@dair-academy-plugins"
  );
  assert.equal(detail.platform, "Claude Code plugin");
  assert.deepEqual(detail.environmentVariables, [
    {
      name: "FIREWORKS_API_KEY",
      description: "必需，用于访问 Fireworks AI",
    },
  ]);
  assert.equal(detail.license, "MIT");
  assert.equal(detail.upstreamVersion, "1.0.0");
  assert.equal(detail.upstreamCommit.length, 40);
  assert.ok(detail.requirements.length > 0);
  assert.ok(detail.outputs.length > 0);
  assert.ok(detail.usageExamples.length > 0);
});
