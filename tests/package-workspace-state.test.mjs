import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  createSelectedSkillUrl,
  derivePackageWorkspaceState,
  getSelectedSkillIdFromUrl,
} from "../site/assets/js/package-workspace-state.js";

const skillsUrl = new URL("../site/assets/data/atlas-skills.json", import.meta.url);

async function loadSkills() {
  return JSON.parse(await readFile(skillsUrl, "utf8"));
}

test("development workspace exposes the complete catalogue and a stable default selection", async () => {
  const skills = await loadSkills();
  const state = derivePackageWorkspaceState({
    packageId: "development",
    skills,
  });

  assert.equal(state.visibleSkills.length, 42);
  assert.equal(state.selectedSkill.id, "ask-matt");
  assert.equal(state.selectedDetail.command, "/ask-matt");
  assert.deepEqual(state.selectedDetail.relatedSkillIds, [
    "code-review",
    "codebase-design",
    "diagnosing-bugs",
  ]);
});

test("query searches skill identity, description and command then selects the first visible skill", async () => {
  const skills = await loadSkills();
  const state = derivePackageWorkspaceState({
    packageId: "development",
    skills,
    query: "prototype",
    selectedSkillId: "ask-matt",
  });

  assert.deepEqual(state.visibleSkills.map((skill) => skill.id), ["prototype"]);
  assert.equal(state.selectedSkill.id, "prototype");
  assert.equal(state.navigation.selectedSkillId, "prototype");
});

test("filters preserve a valid selection and use a deterministic fallback when it becomes invalid", async () => {
  const skills = await loadSkills();
  const filtered = derivePackageWorkspaceState({
    packageId: "development",
    skills,
    filters: { groups: ["engineering"], lifecycles: ["published"] },
    selectedSkillId: "implement",
  });

  assert.equal(filtered.selectedSkill.id, "implement");
  assert.deepEqual(filtered.visibleSkills.slice(0, 3).map((skill) => skill.id), [
    "ask-matt",
    "code-review",
    "codebase-design",
  ]);

  const fallback = derivePackageWorkspaceState({
    packageId: "development",
    skills,
    filters: { groups: ["productivity"] },
    selectedSkillId: "implement",
  });

  assert.equal(fallback.selectedSkill.id, "grill-me");
});

test("empty results and navigation state remain explicit", async () => {
  const skills = await loadSkills();
  const state = derivePackageWorkspaceState({
    packageId: "development",
    skills,
    query: "no-such-skill-123",
    filters: { groups: ["engineering"] },
    selectedSkillId: "implement",
    reading: true,
    directoryPosition: 620,
  });

  assert.deepEqual(state.visibleSkills, []);
  assert.equal(state.selectedSkill, null);
  assert.equal(state.selectedDetail, null);
  assert.deepEqual(state.navigation, {
    packageId: "development",
    query: "no-such-skill-123",
    filters: { groups: ["engineering"], lifecycles: [] },
    selectedSkillId: null,
    reading: true,
    directoryPosition: 620,
  });
});

test("selected skill URL state round-trips for search entry and direct loading", () => {
  const selectedUrl = createSelectedSkillUrl(
    "https://skills123.cc/packages/development/",
    "prototype"
  );

  assert.equal(
    selectedUrl,
    "https://skills123.cc/packages/development/?skill=prototype"
  );
  assert.equal(getSelectedSkillIdFromUrl(selectedUrl), "prototype");
  assert.equal(
    createSelectedSkillUrl(selectedUrl, null),
    "https://skills123.cc/packages/development/"
  );
});
