import {
  createPackageWorkspaceUrl,
  createReadingUrl,
  derivePackageWorkspaceState,
  getPackageWorkspaceNavigationFromUrl,
} from "./package-workspace-state.js";
import { createPackageWorkspaceModel } from "./catalogue-model.js";

const packageId = document.body.dataset.packageId;
const workspaceInput = {
  packageId,
  query: "",
  filters: { groups: [], lifecycles: [] },
  selectedSkillId: null,
  reading: false,
  directoryPosition: 0,
};

let packageData;
let skills = [];
let labels = {};
let detailOpen = false;

function usesDetailDrawer() {
  return window.matchMedia("(max-width: 900px)").matches;
}

const elements = {
  shell: document.querySelector(".workspace-shell"),
  packageName: document.querySelector("#package-name"),
  search: document.querySelector("#skill-search"),
  groupFilters: document.querySelector("#group-filters"),
  groupFilterLabel: document.querySelector("#group-filter-label"),
  lifecycleFilters: document.querySelector("#lifecycle-filters"),
  list: document.querySelector("#skill-list"),
  empty: document.querySelector("#workspace-empty"),
  clearFilters: document.querySelector("#clear-filters"),
  totalCount: document.querySelector("#total-count"),
  directoryTotal: document.querySelector("#directory-total"),
  visibleCount: document.querySelector("#visible-count"),
  detail: document.querySelector("#workspace-detail"),
  detailContent: document.querySelector("#detail-content"),
  detailClose: document.querySelector("#detail-close"),
  detailBackdrop: document.querySelector("#detail-backdrop"),
  detailEmptyTemplate: document.querySelector("#detail-empty-template"),
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function optionsFor(facet) {
  return [...new Set(skills.map((skill) => skill[facet]).filter(Boolean))];
}

function toggleFilter(filterName, value) {
  const values = workspaceInput.filters[filterName];
  workspaceInput.filters = {
    ...workspaceInput.filters,
    [filterName]: values.includes(value)
      ? values.filter((item) => item !== value)
      : [...values, value],
  };
  render({ syncUrl: true });
}

function renderFilterGroup(container, filterName, facet, facetLabels) {
  const selectedValues = workspaceInput.filters[filterName];
  const availableValues = optionsFor(facet);
  const configuredValues = Object.keys(facetLabels).filter((value) =>
    availableValues.includes(value)
  );
  const remainingValues = availableValues.filter(
    (value) => !configuredValues.includes(value)
  );
  container.innerHTML = [...configuredValues, ...remainingValues]
    .map((value) => {
      const active = selectedValues.includes(value);
      return `<button class="filter-chip${active ? " is-active" : ""}" type="button" data-filter="${filterName}" data-value="${escapeHtml(value)}" aria-pressed="${active}">${escapeHtml(facetLabels[value] ?? value)}</button>`;
    })
    .join("");
}

function renderList(state) {
  elements.list.innerHTML = state.visibleSkills
    .map((skill, index) => {
      const selected = skill.id === state.selectedSkill?.id;
      const summary = skill.descriptionZh ?? skill.descriptionEn ?? "";
      return `<li>
        <button class="skill-row${selected ? " is-selected" : ""}" type="button" data-skill-id="${escapeHtml(skill.id)}" aria-pressed="${selected}">
          <span class="skill-number">${String(index + 1).padStart(2, "0")}</span>
          <span class="skill-identity"><strong>${escapeHtml(skill.id)}</strong><code>${escapeHtml(skill.command)}</code></span>
          <span class="skill-copy"><strong>${escapeHtml(summary)}</strong><small>${escapeHtml(labels.groups[skill.group] ?? skill.group)} · ${escapeHtml(labels.lifecycles[skill.lifecycle] ?? skill.lifecycle)}</small></span>
          <span class="skill-status">${escapeHtml(labels.lifecycles[skill.lifecycle] ?? skill.lifecycle)}</span>
        </button>
      </li>`;
    })
    .join("");
  elements.visibleCount.textContent = state.visibleSkills.length;
  elements.empty.hidden = state.visibleSkills.length > 0;
}

function renderDetail(state) {
  const detail = state.selectedDetail;
  if (!detail) {
    elements.detailContent.replaceChildren(elements.detailEmptyTemplate.content.cloneNode(true));
    return;
  }

  const tagMarkup = detail.tags
    .map((tag) => `<span>${escapeHtml(tag)}</span>`)
    .join("");
  const relatedMarkup = detail.relatedSkillIds.length
    ? detail.relatedSkillIds
        .map(
          (id) =>
            `<button type="button" data-related-id="${escapeHtml(id)}"><span>同领域</span><strong>${escapeHtml(id)}</strong></button>`
        )
        .join("")
    : "";
  const relationshipMarkup = detail.relationships
    .map(
      (relationship) =>
        `<div class="relationship-row"><span>${escapeHtml(relationship.type)}</span><strong>${escapeHtml(relationship.label)}</strong></div>`
    )
    .join("");
  const readingMarkup = detail.readingUrl
    ? `<a class="reading-link" href="${escapeHtml(detail.readingUrl)}"><span>完整方法、证据与案例</span><strong>完整阅读 →</strong></a>`
    : "";
  const command = detail.installCommand ?? detail.command;
  const copyLabel = detail.installCommand ? "复制安装命令" : "复制";
  const commandMarkup = command
    ? `<div class="command-bar"><code>${escapeHtml(command)}</code><button type="button" id="copy-command">${copyLabel}</button></div>`
    : "";
  const licenseLabel = detail.license === "unconfirmed" ? "未确认" : detail.license;
  const extraFacts = [
    detail.platform ? ["适用平台", detail.platform] : null,
    detail.upstreamVersion ? ["上游版本", `v${detail.upstreamVersion}`] : null,
    detail.license ? ["许可证", licenseLabel] : null,
  ]
    .filter(Boolean)
    .map(([term, value]) => `<div><dt>${term}</dt><dd>${escapeHtml(value)}</dd></div>`)
    .join("");
  const renderList = (title, items, emptyText = "无额外要求") => `
    <section class="detail-section">
      <h3>${title}</h3>
      ${items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : `<p>${emptyText}</p>`}
    </section>`;
  const environmentMarkup = detail.environmentVariables.length
    ? `<section class="detail-section"><h3>环境变量</h3><dl class="environment-list">${detail.environmentVariables
        .map(
          (variable) =>
            `<div><dt><code>${escapeHtml(variable.name)}</code></dt><dd>${escapeHtml(variable.description)}</dd></div>`
        )
        .join("")}</dl></section>`
    : detail.installCommand
      ? `<section class="detail-section"><h3>环境变量</h3><p>无需配置</p></section>`
      : "";
  const pluginDetailMarkup = detail.installCommand
    ? `${renderList("使用示例", detail.usageExamples, "使用自然语言描述任务")}
       ${renderList("外部依赖", detail.requirements)}
       ${environmentMarkup}
       ${renderList("输出产物", detail.outputs, "根据任务直接返回结果")}
       <a class="source-link" href="${escapeHtml(detail.sourceUrl)}" target="_blank" rel="noreferrer"><span>固定上游版本</span><strong>查看源文件 →</strong><small>${escapeHtml(detail.upstreamCommit.slice(0, 7))}</small></a>`
    : "";

  elements.detailContent.innerHTML = `
    <p class="detail-eyebrow">SELECTED SKILL</p>
    <h2 id="detail-title">${escapeHtml(detail.name)}</h2>
    <p class="detail-summary">${escapeHtml(detail.summary)}</p>
    <div class="detail-tags">${tagMarkup}</div>
    ${commandMarkup}
    ${readingMarkup}
    <dl class="detail-facts">
      <div><dt>${escapeHtml(packageData.workspace.groupFacetLabel ?? "领域")}</dt><dd>${escapeHtml(detail.groupLabel)}</dd></div>
      <div><dt>状态</dt><dd>${escapeHtml(detail.lifecycleLabel)}</dd></div>
      <div><dt>调用方式</dt><dd>${escapeHtml(detail.invocationModeLabel)}</dd></div>
      <div><dt>技能包</dt><dd>${escapeHtml(packageData.name)}</dd></div>
      ${extraFacts}
    </dl>
    ${pluginDetailMarkup}
    <section class="related-skills" aria-labelledby="related-title">
      <h3 id="related-title">关联信息</h3>
      ${relationshipMarkup}${relatedMarkup || (!relationshipMarkup ? "<p>当前没有关联信息。</p>" : "")}
    </section>`;
}

function setDetailOpen(open) {
  detailOpen = open;
  elements.detail.classList.toggle("is-open", open);
  elements.detailBackdrop.classList.toggle("is-open", open);
  document.body.classList.toggle("has-detail-drawer", open);
}

function updateSelectedSkillUrl(selectedSkillId, historyMode = "replaceState") {
  const nextUrl = createPackageWorkspaceUrl(location.href, {
    ...workspaceInput,
    selectedSkillId,
  });
  history[historyMode]({}, "", nextUrl);
}

function selectSkill(
  skillId,
  { openDetail = true, historyMode = "pushState" } = {}
) {
  workspaceInput.directoryPosition = window.scrollY;
  workspaceInput.selectedSkillId = skillId;
  const state = render();
  updateSelectedSkillUrl(state.navigation.selectedSkillId, historyMode);
  if (openDetail) setDetailOpen(true);
}

function render({ syncUrl = false } = {}) {
  const state = derivePackageWorkspaceState({
    ...workspaceInput,
    skills,
    labels,
  });
  workspaceInput.selectedSkillId = state.navigation.selectedSkillId;
  renderFilterGroup(elements.groupFilters, "groups", "group", labels.groups);
  renderFilterGroup(
    elements.lifecycleFilters,
    "lifecycles",
    "lifecycle",
    labels.lifecycles
  );
  renderList(state);
  renderDetail(state);
  if (syncUrl) updateSelectedSkillUrl(state.navigation.selectedSkillId);
  return state;
}

function bindEvents() {
  elements.search.addEventListener("input", (event) => {
    workspaceInput.query = event.target.value;
    render({ syncUrl: true });
  });

  document.addEventListener("click", async (event) => {
    const filter = event.target.closest("[data-filter]");
    if (filter) toggleFilter(filter.dataset.filter, filter.dataset.value);

    const skill = event.target.closest("[data-skill-id]");
    if (skill) selectSkill(skill.dataset.skillId);

    const related = event.target.closest("[data-related-id]");
    if (related) {
      workspaceInput.query = "";
      workspaceInput.filters = { groups: [], lifecycles: [] };
      elements.search.value = "";
      selectSkill(related.dataset.relatedId, { openDetail: false });
    }

    const copy = event.target.closest("#copy-command");
    if (copy) {
      const command = copy.closest(".command-bar")?.querySelector("code")?.textContent ?? "";
      await navigator.clipboard.writeText(command);
      copy.textContent = "已复制";
    }

    const readingLink = event.target.closest(".reading-link");
    if (readingLink) {
      event.preventDefault();
      workspaceInput.directoryPosition = detailOpen
        ? workspaceInput.directoryPosition
        : window.scrollY;
      const state = derivePackageWorkspaceState({ ...workspaceInput, skills, labels });
      const workspaceUrl = createPackageWorkspaceUrl(location.href, state.navigation);
      history.replaceState({}, "", workspaceUrl);
      location.assign(
        createReadingUrl(new URL(readingLink.getAttribute("href"), location.origin), {
          ...state.navigation,
          reading: true,
        })
      );
    }
  });

  elements.clearFilters.addEventListener("click", () => {
    workspaceInput.query = "";
    workspaceInput.filters = { groups: [], lifecycles: [] };
    elements.search.value = "";
    render({ syncUrl: true });
  });

  const closeDetail = () => {
    setDetailOpen(false);
    requestAnimationFrame(() => window.scrollTo({ top: workspaceInput.directoryPosition }));
  };
  elements.detailClose.addEventListener("click", closeDetail);
  elements.detailBackdrop.addEventListener("click", closeDetail);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && detailOpen) closeDetail();
  });
  window.addEventListener("popstate", () => {
    Object.assign(
      workspaceInput,
      getPackageWorkspaceNavigationFromUrl(location.href)
    );
    const hasRequestedSkill = Boolean(workspaceInput.selectedSkillId);
    elements.search.value = workspaceInput.query;
    render();
    if (usesDetailDrawer()) setDetailOpen(hasRequestedSkill);
    requestAnimationFrame(() =>
      window.scrollTo({ top: workspaceInput.directoryPosition })
    );
  });
}

async function init() {
  const fetchJson = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Unable to load ${url}: ${response.status}`);
    return response.json();
  };
  const catalog = await fetchJson("/assets/data/catalog.json");
  const workspace = await createPackageWorkspaceModel(catalog, packageId, fetchJson);
  packageData = workspace.package;
  skills = workspace.skills;
  labels = workspace.labels;

  elements.packageName.textContent = packageData.name;
  elements.groupFilterLabel.textContent = packageData.workspace.groupFacetLabel ?? "领域";
  elements.totalCount.textContent = skills.length;
  elements.directoryTotal.textContent = skills.length;
  Object.assign(
    workspaceInput,
    getPackageWorkspaceNavigationFromUrl(location.href)
  );
  const hasRequestedSkill = Boolean(workspaceInput.selectedSkillId);
  elements.search.value = workspaceInput.query;
  bindEvents();
  render({ syncUrl: Boolean(workspaceInput.selectedSkillId) });
  if (usesDetailDrawer() && hasRequestedSkill) setDetailOpen(true);
  elements.shell.setAttribute("aria-busy", "false");
  if (workspaceInput.directoryPosition) {
    requestAnimationFrame(() =>
      window.scrollTo({ top: workspaceInput.directoryPosition })
    );
  }
}

init().catch((error) => {
  console.error(error);
  elements.list.innerHTML = '<li class="load-error">技能目录暂时无法加载，请稍后重试。</li>';
  elements.shell.setAttribute("aria-busy", "false");
});
