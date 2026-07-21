import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { derivePackageWorkspaceState } from "../site/assets/js/package-workspace-state.js";

const skillsUrl = new URL(
  "../site/assets/data/rayskills-skills.json",
  import.meta.url
);

const labels = {
  groups: {
    routing: "路由",
    infrastructure: "基建",
    knowledge: "知识库",
    content: "内容",
    consulting: "咨询",
    product: "产品",
    collaboration: "协作",
    operations: "内务",
  },
  lifecycles: { published: "已发布" },
  invocationModes: { "model-allowed": "自然语言触发" },
};

async function loadSkills() {
  return JSON.parse(await readFile(skillsUrl, "utf8"));
}

test("Rayskills workspace exposes all 21 members and the approved directions", async () => {
  const skills = await loadSkills();
  assert.equal(skills.length, 21);
  assert.deepEqual([...new Set(skills.map((skill) => skill.group))], [
    "routing",
    "infrastructure",
    "knowledge",
    "content",
    "consulting",
    "product",
    "collaboration",
    "operations",
  ]);
});

test("Rayskills search matches a direction and detail keeps call command separate", async () => {
  const state = derivePackageWorkspaceState({
    packageId: "rayskills",
    skills: await loadSkills(),
    query: "内容",
    selectedSkillId: "ray-writer",
    labels,
  });

  assert.ok(state.visibleSkills.some((skill) => skill.id === "ray-writer"));
  assert.equal(state.selectedDetail.command, "/ray-writer");
  assert.equal(state.selectedDetail.installCommand, null);
  assert.equal(state.selectedDetail.license, "CC BY-NC 4.0");
  assert.equal(state.selectedDetail.platform, "Claude Code / Codex");
  assert.equal(state.selectedDetail.upstreamCommit.length, 40);
  assert.ok(state.selectedDetail.safetyNotes.length > 0);
});
