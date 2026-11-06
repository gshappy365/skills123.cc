// 技能关系图：只用技能目录数据边界内的结构关系（技能包 → 技能方向 → 技能条目），
// 节点标注调用方式与状态；不虚构技能条目之间的连线。布局计算与 SVG 渲染均为纯函数。

const WIDTH = 900;
const PAD = 20;
const PACK_Y = 16;
const PACK_H = 46;
const SPINE_X = 36;
const BAND_X = 56;
const DIRECTION_COL = 168;
const DIRECTION_H = 40;
const CHIP_START_X = BAND_X + DIRECTION_COL;
const CHIP_H = 44;
const CHIP_GAP = 8;
const ROW_GAP = 10;
const BAND_PAD_Y = 10;
const BAND_GAP = 14;
const LEGEND_GAP = 18;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// 粗略文本宽度估算：CJK/全角按 1em，其余按 0.62em，保证无 DOM 也能确定换行。
function estimateTextWidth(text, fontSize) {
  let width = 0;
  for (const char of String(text)) {
    width +=
      (/[\u2e80-\u9fff\u3000-\u303f\uff00-\uffef]/.test(char)
        ? fontSize
        : fontSize * 0.62);
  }
  return width;
}

function truncateToWidth(text, fontSize, maxWidth) {
  if (estimateTextWidth(text, fontSize) <= maxWidth) return String(text);
  let truncated = String(text);
  while (truncated.length > 1 && estimateTextWidth(`${truncated}…`, fontSize) > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return `${truncated}…`;
}

function chipWidthFor(chip) {
  const inner = Math.max(
    estimateTextWidth(chip.name, 11),
    estimateTextWidth(chip.command, 9)
  );
  return Math.min(190, Math.max(110, Math.ceil(inner) + 24));
}

function facetValues(present, configured) {
  const available = [...new Set(present)];
  const known = (configured ?? []).filter((value) => available.includes(value));
  return [...known, ...available.filter((value) => !known.includes(value))];
}

function createChip(skill) {
  return {
    id: skill.id,
    name: skill.name ?? skill.id,
    command: skill.command ?? "",
    invocationMode: skill.invocationMode,
    lifecycle: skill.lifecycle,
    summary: skill.descriptionZh ?? skill.descriptionEn ?? "",
  };
}

// 图例只保留包内真正出现的区分度：单一取值的维度不进图例。
function createLegend(skills, labels) {
  const legend = [];
  const invocationModes = facetValues(
    skills.map((skill) => skill.invocationMode),
    Object.keys(labels.invocationModes ?? {})
  );
  if (invocationModes.length > 1) {
    for (const value of invocationModes) {
      legend.push({
        kind: "invocation",
        value,
        label: labels.invocationModes?.[value] ?? value,
      });
    }
  }
  const lifecycles = facetValues(
    skills.map((skill) => skill.lifecycle),
    Object.keys(labels.lifecycles ?? {})
  );
  if (lifecycles.length > 1) {
    for (const value of lifecycles) {
      legend.push({
        kind: "lifecycle",
        value,
        label: labels.lifecycles?.[value] ?? value,
      });
    }
  }
  return legend;
}

export function createSkillRelationshipGraph({ packageInfo, skills, labels }) {
  if (!packageInfo?.id) throw new TypeError("packageInfo with id is required");
  if (!Array.isArray(skills)) throw new TypeError("skills must be an array");

  const labels_ = {
    groups: labels?.groups ?? {},
    lifecycles: labels?.lifecycles ?? {},
    invocationModes: labels?.invocationModes ?? {},
  };
  const directionValues = facetValues(
    skills.map((skill) => skill.group),
    Object.keys(labels_.groups)
  );

  const chipAreaWidth = WIDTH - CHIP_START_X - PAD;
  const clusters = directionValues.map((group) => {
    const members = skills.filter((skill) => skill.group === group).map(createChip);
    const rows = [[]];
    let rowWidth = 0;
    for (const chip of members) {
      chip.width = chipWidthFor(chip);
      if (rowWidth > 0 && rowWidth + CHIP_GAP + chip.width > chipAreaWidth) {
        rows.push([]);
        rowWidth = 0;
      }
      if (rowWidth > 0) rowWidth += CHIP_GAP;
      rowWidth += chip.width;
      rows[rows.length - 1].push(chip);
    }
    return {
      id: group,
      label: labels_.groups[group] ?? group,
      count: members.length,
      rows,
    };
  });

  // 逐段确定 band 几何，保证方向节点与技能行在同一 band 内垂直居中。
  let cursorY = PACK_Y + PACK_H + 28;
  for (const cluster of clusters) {
    const contentHeight =
      cluster.rows.length * CHIP_H + (cluster.rows.length - 1) * ROW_GAP;
    cluster.height = Math.max(contentHeight + BAND_PAD_Y * 2, DIRECTION_H + 8);
    cluster.y = cursorY;
    cluster.directionY = cluster.y + (cluster.height - DIRECTION_H) / 2;
    cluster.directionCenterY = cluster.directionY + DIRECTION_H / 2;
    cluster.rowTop = cluster.y + (cluster.height - contentHeight) / 2;
    for (const [index, row] of cluster.rows.entries()) {
      let x = CHIP_START_X;
      const y = cluster.rowTop + index * (CHIP_H + ROW_GAP);
      for (const chip of row) {
        chip.x = x;
        chip.y = y;
        x += chip.width + CHIP_GAP;
      }
    }
    cursorY += cluster.height + BAND_GAP;
  }

  const pack = {
    name: packageInfo.name ?? packageInfo.id,
    skillCount: skills.length,
    installCommand: packageInfo.installCommand ?? null,
  };

  return {
    pack,
    clusters,
    legend: createLegend(skills, labels_),
    width: WIDTH,
    height: Math.round(cursorY - BAND_GAP + LEGEND_GAP + 20),
  };
}

function chipMarkup(chip, selected) {
  const name = truncateToWidth(chip.name, 11, chip.width - 20);
  const command = truncateToWidth(chip.command, 9, chip.width - 20);
  const label = chip.summary ? `${chip.name} · ${chip.summary}` : chip.name;
  const statusDot =
    chip.lifecycle && chip.lifecycle !== "published"
      ? `<circle class="chip-status lifecycle-${escapeHtml(chip.lifecycle)}" cx="${chip.x + chip.width - 10}" cy="${chip.y + 11}" r="3" />`
      : "";
  return `<g class="skill-graph-chip${selected ? " is-selected" : ""} invocation-${escapeHtml(chip.invocationMode ?? "")} lifecycle-${escapeHtml(chip.lifecycle ?? "")}" role="button" tabindex="0" aria-pressed="${selected ? "true" : "false"}" data-skill-id="${escapeHtml(chip.id)}">
    <title>${escapeHtml(label)}</title>
    <rect class="chip-rect" rx="7" x="${chip.x}" y="${chip.y}" width="${chip.width}" height="${CHIP_H}" />${statusDot}
    <text class="chip-name" x="${chip.x + 12}" y="${chip.y + 19}">${escapeHtml(name)}</text>
    <text class="chip-command" x="${chip.x + 12}" y="${chip.y + 33}">${escapeHtml(command)}</text>
  </g>`;
}

function clusterMarkup(cluster, selectedId) {
  const bandWidth = WIDTH - (BAND_X - 12) - PAD;
  const rows = cluster.rows
    .map((row) => row.map((chip) => chipMarkup(chip, chip.id === selectedId)).join(""))
    .join("");
  const directionCount = `${cluster.count} 项`;
  return `<g class="skill-graph-band">
    <rect class="band-rect" rx="10" x="${BAND_X - 12}" y="${cluster.y}" width="${bandWidth}" height="${cluster.height}" />
    <path class="band-link" d="M ${SPINE_X} ${cluster.directionCenterY} H ${BAND_X}" />
    <circle class="band-joint" cx="${SPINE_X}" cy="${cluster.directionCenterY}" r="2.5" />
    <g class="skill-graph-direction">
      <rect class="direction-rect" rx="7" x="${BAND_X}" y="${cluster.directionY}" width="${DIRECTION_COL - 12}" height="${DIRECTION_H}" />
      <text class="direction-label" x="${BAND_X + 12}" y="${cluster.directionY + 17}">${escapeHtml(truncateToWidth(cluster.label, 11, DIRECTION_COL - 36))}</text>
      <text class="direction-count" x="${BAND_X + 12}" y="${cluster.directionY + 32}">${escapeHtml(directionCount)}</text>
    </g>
    ${rows}
  </g>`;
}

function legendMarkup(legend, y) {
  if (!legend.length) return "";
  const items = legend
    .map((item, index) => {
      const x = BAND_X + 46 + index * 140;
      const swatch =
        item.kind === "invocation"
          ? `<rect class="legend-swatch invocation-${escapeHtml(item.value)}" rx="3" x="${x}" y="${y - 9}" width="18" height="14" />`
          : `<rect class="legend-swatch lifecycle-${escapeHtml(item.value)}" rx="3" x="${x}" y="${y - 9}" width="18" height="14" />`;
      const dot =
        item.kind === "lifecycle" && item.value !== "published"
          ? `<circle class="chip-status lifecycle-${escapeHtml(item.value)}" cx="${x + 9}" cy="${y - 2}" r="3" />`
          : "";
      return `${swatch}${dot}<text class="legend-label" x="${x + 24}" y="${y}">${escapeHtml(item.label)}</text>`;
    })
    .join("");
  return `<g class="skill-graph-legend"><text class="legend-title" x="${BAND_X}" y="${y}">图例</text>${items}</g>`;
}

export function skillRelationshipGraphSvg(graph, { selectedSkillId = null } = {}) {
  const spineBottom = graph.clusters.length
    ? graph.clusters[graph.clusters.length - 1].directionCenterY
    : PACK_Y + PACK_H;
  const packWidth = Math.min(
    WIDTH - PAD * 2,
    Math.ceil(estimateTextWidth(graph.pack.name, 13)) + 150
  );
  return `<svg class="skill-graph-svg" viewBox="0 0 ${graph.width} ${graph.height}" width="${graph.width}" height="${graph.height}" role="img" aria-label="${escapeHtml(graph.pack.name)}技能关系图">
    <title>${escapeHtml(graph.pack.name)}技能关系图</title>
    <path class="pack-spine" d="M ${SPINE_X} ${PACK_Y + PACK_H} V ${spineBottom}" />
    <g class="skill-graph-pack">
      <rect class="pack-rect" rx="9" x="${PAD}" y="${PACK_Y}" width="${packWidth}" height="${PACK_H}" />
      <text class="pack-eyebrow" x="${PAD + 16}" y="${PACK_Y + 18}">SKILL PACKAGE</text>
      <text class="pack-name" x="${PAD + 16}" y="${PACK_Y + 36}">${escapeHtml(graph.pack.name)}</text>
      <text class="pack-count" x="${PAD + packWidth - 16}" y="${PACK_Y + 28}" text-anchor="end">${escapeHtml(String(graph.pack.skillCount))} 项技能</text>
    </g>
    ${graph.clusters.map((cluster) => clusterMarkup(cluster, selectedSkillId)).join("")}
    ${legendMarkup(graph.legend, graph.height - 20)}
  </svg>`;
}
