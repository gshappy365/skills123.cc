import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  createPackageWorkspaceUrl,
  createReadingUrl,
  createSelectedSkillUrl,
  derivePackageWorkspaceState,
  getPackageWorkspaceNavigationFromUrl,
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
  assert.equal(state.visibleSkills.length, 37);
  assert.equal(state.selectedSkill.id, "ask-matt");
  assert.equal(state.selectedDetail.command, "/ask-matt");
  assert.deepEqual(state.selectedDetail.relatedSkillIds, [
    "code-review",
    "codebase-design",
    "diagnosing-bugs",
  ]);
});
test("detail inherits package facts and keeps entry values ahead of them", async () => {
  const skills = await loadSkills();
  const catalogUrl = new URL("../site/assets/data/catalog.json", import.meta.url);
  const catalog = JSON.parse(await readFile(catalogUrl, "utf8"));
  const pkg = catalog.packages.find((item) => item.id === "development");
  const state = derivePackageWorkspaceState({
    packageId: "development",
    packageInfo: pkg,
    skills,
  });
  const detail = state.selectedDetail;
  assert.equal(detail.descriptionEn, skills[0].descriptionEn);
  assert.notEqual(detail.descriptionEn, detail.summary);
  assert.equal(detail.platform, pkg.platform);
  assert.equal(detail.license, pkg.license);
  assert.equal(detail.upstreamVersion, pkg.source.version);
  assert.deepEqual(detail.packageSource, pkg.source);
  assert.equal(detail.sourceUrl, null);
  assert.equal(detail.upstreamCommit, null);

  const entry = {
    ...skills[0],
    platform: "Claude Code",
    license: "MIT",
    upstreamVersion: "9.9.9",
    sourceUrl: "https://example.com/skill.md",
    upstreamCommit: "a".repeat(40),
  };
  const override = derivePackageWorkspaceState({
    packageId: "development",
    packageInfo: pkg,
    skills: [entry, ...skills.slice(1)],
  });
  assert.equal(override.selectedDetail.platform, "Claude Code");
  assert.equal(override.selectedDetail.upstreamVersion, "9.9.9");
  assert.equal(override.selectedDetail.sourceUrl, "https://example.com/skill.md");
  assert.deepEqual(override.selectedDetail.packageSource, pkg.source);
});
test("detail omits package facts when no package is supplied", async () => {
  const skills = await loadSkills();
  const state = derivePackageWorkspaceState({
    packageId: "development",
    skills,
  });
  assert.equal(state.selectedDetail.platform, null);
  assert.equal(state.selectedDetail.license, null);
  assert.equal(state.selectedDetail.upstreamVersion, null);
  assert.equal(state.selectedDetail.packageSource, null);
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
    view: "directory",
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
test("reading URLs round-trip the complete package workspace state", () => {
  const navigation = {
    query: "证据验证",
    filters: { groups: ["industry-research"], lifecycles: ["published"] },
    selectedSkillId: "serenity-skill",
    view: "directory",
    directoryPosition: 486,
  };
  const readingUrl = createReadingUrl(
    "https://skills123.cc/packages/investment-research/skills/serenity-skill/",
    navigation
  );
  assert.deepEqual(getPackageWorkspaceNavigationFromUrl(readingUrl), navigation);
  assert.equal(
    createPackageWorkspaceUrl(
      "https://skills123.cc/packages/investment-research/",
      getPackageWorkspaceNavigationFromUrl(readingUrl)
    ),
    "https://skills123.cc/packages/investment-research/?skill=serenity-skill&q=%E8%AF%81%E6%8D%AE%E9%AA%8C%E8%AF%81&group=industry-research&lifecycle=published&position=486"
  );
});
test("a direct reading URL has empty state for a deterministic package fallback", () => {
  assert.deepEqual(
    getPackageWorkspaceNavigationFromUrl(
      "https://skills123.cc/packages/investment-research/skills/serenity-skill/"
    ),
    {
      query: "",
      filters: { groups: [], lifecycles: [] },
      selectedSkillId: null,
      view: "directory",
      directoryPosition: 0,
    }
  );
});
test("graph view state round-trips through workspace URLs and stays out of directory URLs", () => {
  const graphUrl = createPackageWorkspaceUrl(
    "https://skills123.cc/packages/waza/",
    { view: "graph", selectedSkillId: "check" }
  );
  assert.equal(
    graphUrl,
    "https://skills123.cc/packages/waza/?skill=check&view=graph"
  );
  assert.deepEqual(getPackageWorkspaceNavigationFromUrl(graphUrl), {
    query: "",
    filters: { groups: [], lifecycles: [] },
    selectedSkillId: "check",
    view: "graph",
    directoryPosition: 0,
  });
  const directoryUrl = createPackageWorkspaceUrl(graphUrl, { view: "directory" });
  assert.equal(directoryUrl, "https://skills123.cc/packages/waza/");
  assert.equal(
    getPackageWorkspaceNavigationFromUrl(
      "https://skills123.cc/packages/waza/?view=timeline"
    ).view,
    "directory"
  );
});
test("derivePackageWorkspaceState carries the requested view into navigation", async () => {
  const skills = await loadSkills();
  const graphState = derivePackageWorkspaceState({
    packageId: "development",
    skills,
    view: "graph",
  });
  assert.equal(graphState.navigation.view, "graph");
  const directoryState = derivePackageWorkspaceState({
    packageId: "development",
    skills,
  });
  assert.equal(directoryState.navigation.view, "directory");
});
