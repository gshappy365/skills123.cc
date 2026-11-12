import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  createSkillRelationshipGraph,
  skillRelationshipGraphSvg,
} from "../site/assets/js/skill-relationship-graph.js";

async function loadJson(relativePath) {
  return JSON.parse(
    await readFile(new URL(relativePath, import.meta.url), "utf8")
  );
}

async function loadWorkspace(packageId) {
  const catalog = await loadJson("../site/assets/data/catalog.json");
  const pkg = catalog.packages.find((item) => item.id === packageId);
  const skills = await loadJson(`../site${pkg.workspace.skillsUrl}`);
  return {
    packageInfo: pkg,
    skills,
    labels: {
      groups: pkg.workspace.groupLabels ?? {},
      lifecycles: pkg.workspace.lifecycleLabels ?? {},
      invocationModes: pkg.workspace.invocationModeLabels ?? {},
    },
  };
}

test("waza graph keeps every skill exactly once inside configured direction order", async () => {
  const { packageInfo, skills, labels } = await loadWorkspace("waza");
  const graph = createSkillRelationshipGraph({ packageInfo, skills, labels });

  assert.deepEqual(
    graph.clusters.map((cluster) => cluster.label),
    ["工程质量", "思考学习", "研究写作", "界面设计"]
  );
  assert.deepEqual(
    graph.clusters.map((cluster) => cluster.count),
    [3, 2, 2, 1]
  );
  const chipIds = graph.clusters.flatMap((cluster) =>
    cluster.rows.flat().map((chip) => chip.id)
  );
  assert.deepEqual(
    [...chipIds].sort(),
    skills.map((skill) => skill.id).sort()
  );
  assert.equal(chipIds.length, new Set(chipIds).size);
  assert.equal(graph.pack.skillCount, 8);
});

test("chip geometry stays inside the band area without overlaps", async () => {
  const { packageInfo, skills, labels } = await loadWorkspace("pstack");
  const graph = createSkillRelationshipGraph({ packageInfo, skills, labels });

  const chipStart = 56 + 168;
  const chipAreaWidth = graph.width - chipStart - 20;
  let previousBottom = -1;
  for (const cluster of graph.clusters) {
    assert.ok(cluster.height >= 40 + 8, "band must fit its direction node");
    for (const [rowIndex, row] of cluster.rows.entries()) {
      let cursor = chipStart;
      for (const chip of row) {
        assert.ok(chip.width >= 110 && chip.width <= 190, "chip width clamp");
        assert.equal(chip.x, cursor, "chips are packed left to right");
        assert.ok(
          chip.x + chip.width <= chipStart + chipAreaWidth,
          "chip stays inside the band"
        );
        assert.equal(
          chip.y,
          cluster.rowTop + rowIndex * (44 + 10),
          "rows advance uniformly"
        );
        cursor += chip.width + 8;
      }
    }
    assert.ok(cluster.y > previousBottom, "bands stack top to bottom");
    previousBottom = cluster.y + cluster.height;
  }
});

test("svg lists every skill once, marks the selection and escapes markup", () => {
  const graph = createSkillRelationshipGraph({
    packageInfo: { id: "tiny", name: 'Tiny "测试" <包>' },
    skills: [
      {
        id: "alpha",
        name: 'Alpha <b>',
        command: "/alpha",
        group: "g1",
        invocationMode: "user-only",
        lifecycle: "experimental",
      },
      {
        id: "beta",
        name: "Beta",
        command: "/beta & co",
        group: "g1",
        invocationMode: "model-allowed",
        lifecycle: "published",
      },
    ],
    labels: { groups: { g1: "方向一" } },
  });
  const svg = skillRelationshipGraphSvg(graph, { selectedSkillId: "alpha" });

  assert.equal(svg.match(/data-skill-id="alpha"/g).length, 1);
  assert.equal(svg.match(/data-skill-id="beta"/g).length, 1);
  assert.match(svg, /is-selected/);
  assert.match(svg, /aria-pressed="true"/);
  assert.match(svg, /aria-pressed="false"/);
  assert.doesNotMatch(svg, /<b>|<script/);
  assert.match(svg, /Alpha &lt;b&gt;/);
  assert.match(svg, /&quot;测试&quot;/);
  assert.match(svg, /role="button"/);
  assert.match(svg, /<title>/);
  // 未发布技能带状态点，已发布技能不带。
  assert.match(svg, /chip-status lifecycle-experimental/);
  assert.doesNotMatch(svg, /chip-status lifecycle-published/);
  // 选中节点不重复：同一 id 只出现在一个 chip 上。
  assert.equal(svg.match(/skill-graph-chip[^"]*is-selected/g).length, 1);
});

test("legend only lists facets that actually differ inside the package", async () => {
  const waza = await loadWorkspace("waza");
  const wazaGraph = createSkillRelationshipGraph(waza);
  assert.deepEqual(wazaGraph.legend, []);

  const development = await loadWorkspace("development");
  const developmentGraph = createSkillRelationshipGraph(development);
  assert.deepEqual(
    developmentGraph.legend.map((item) => `${item.kind}:${item.label}`),
    [
      "invocation:用户触发",
      "invocation:模型可调用",
      "lifecycle:已发布",
      "lifecycle:实验中",
      "lifecycle:仓库内",
    ]
  );
  const svg = skillRelationshipGraphSvg(developmentGraph);
  assert.match(svg, /图例/);
  assert.match(svg, /legend-swatch invocation-user-only/);
  assert.match(svg, /legend-swatch lifecycle-repository-only/);
});

test("single-skill packages still render pack, direction and skill nodes", async () => {
  const catalog = await loadJson("../site/assets/data/catalog.json");
  const pkg = catalog.packages.find((item) => item.id === "last30days");
  const skills = await loadJson(`../site${pkg.workspace.skillsUrl}`);
  const graph = createSkillRelationshipGraph({
    packageInfo: pkg,
    skills,
    labels: {
      groups: pkg.workspace.groupLabels ?? {},
      lifecycles: pkg.workspace.lifecycleLabels ?? {},
      invocationModes: pkg.workspace.invocationModeLabels ?? {},
    },
  });
  assert.equal(graph.clusters.length, 1);
  assert.equal(graph.clusters[0].rows.flat().length, 1);
  const svg = skillRelationshipGraphSvg(graph);
  assert.match(svg, /last30days/);
  assert.match(svg, /1 项技能/);
  assert.match(svg, /data-skill-id="last30days"/);
});

test("svg spine reaches the last direction node and legend sits inside the canvas", async () => {
  const { packageInfo, skills, labels } = await loadWorkspace("development");
  const graph = createSkillRelationshipGraph({ packageInfo, skills, labels });
  const svg = skillRelationshipGraphSvg(graph);
  const lastCluster = graph.clusters[graph.clusters.length - 1];
  assert.match(
    svg,
    new RegExp(`M 36 62 V ${lastCluster.directionCenterY}`)
  );
  assert.ok(graph.height >= lastCluster.y + lastCluster.height);
  assert.ok(graph.width === 900);
});
