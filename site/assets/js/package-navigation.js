import {
  buildPackageGroups,
  loadPackageSkills,
  searchCatalogue,
} from "./catalogue-search.js?v=20260731-2";

const state = {
  catalog: null,
  packageSkills: {},
  guides: [],
  query: new URL(location.href).searchParams.get("q") ?? "",
};

const elements = {
  query: document.querySelector("#catalogue-query"),
  form: document.querySelector("#catalogue-search-form"),
  groups: document.querySelector("#package-group-index"),
  topicGuides: document.querySelector("#topic-guides"),
  results: document.querySelector("#catalogue-results"),
  resultCount: document.querySelector("#result-count"),
  packageResults: document.querySelector("#package-results"),
  skillResults: document.querySelector("#skill-results"),
  guideResults: document.querySelector("#guide-results"),
  noResults: document.querySelector("#catalogue-no-results"),
  clearSearch: document.querySelector("#clear-catalogue-search"),
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function packageHref(pkg) {
  return `/packages/${encodeURIComponent(pkg.id)}/`;
}

function renderGroups() {
  const groups = buildPackageGroups(state.catalog);
  elements.groups.innerHTML = groups
    .map((group, index) => {
      const activePackages = group.packages.filter((pkg) => pkg.status === "active");
      const countLabel = activePackages.length
        ? `${activePackages.length} 个技能包`
        : "即将添加";
      const packageRows = activePackages.length
        ? activePackages
            .map((pkg) => {
              const groupCount = Object.keys(pkg.workspace?.groupLabels ?? {}).length;
              const secondaryMetric = groupCount
                ? `${groupCount} GROUPS`
                : pkg.featuredSkill
                  ? "FEATURED SKILL"
                  : `${pkg.tags.length} TAGS`;
              return `<a class="package-index-row" href="${packageHref(pkg)}">
                <h3>${escapeHtml(pkg.name)}</h3>
                <p>${escapeHtml(pkg.description)}</p>
                <span class="package-metrics">${escapeHtml(pkg.skillCount)} SKILLS<br>${escapeHtml(secondaryMetric)}</span>
                <strong>进入工作台 →</strong>
              </a>`;
            })
            .join("")
        : `<div class="package-index-row is-coming-soon" aria-label="${escapeHtml(group.name)} 即将添加">
            <h3>${escapeHtml(group.name)}技能包</h3>
            <p>${escapeHtml(group.description)}</p>
            <span class="package-metrics">COMING SOON</span>
            <strong>即将添加</strong>
          </div>`;

      return `<section class="package-index-group${activePackages.length ? "" : " is-coming-soon"}">
        <header><span>${String(index + 1).padStart(2, "0")}</span><h2>${escapeHtml(group.name)}</h2><small>${countLabel}</small></header>
        ${packageRows}
      </section>`;
    })
    .join("");
  elements.groups.setAttribute("aria-busy", "false");
}

function resultSummary(skill) {
  return skill.descriptionZh ?? skill.description ?? skill.descriptionEn ?? "";
}

function renderSearchResults() {
  const normalizedQuery = state.query.trim();
  const searching = normalizedQuery.length > 0;
  elements.results.hidden = !searching;
  elements.groups.hidden = searching;
  elements.topicGuides.hidden = searching;
  if (!searching) return;

  const { packageMatches, skillMatches, guideMatches } = searchCatalogue({
    catalog: state.catalog,
    packageSkills: state.packageSkills,
    guides: state.guides,
    query: normalizedQuery,
  });
  const total = packageMatches.length + skillMatches.length + guideMatches.length;
  elements.resultCount.textContent = total;
  elements.noResults.hidden = total > 0;

  elements.packageResults.innerHTML = packageMatches.length
    ? `<section class="result-group"><h3>技能包 · ${packageMatches.length}</h3>${packageMatches
        .map(
          (pkg) => `<a class="catalogue-result package-result" href="${escapeHtml(pkg.href)}">
            <span class="result-type">技能包</span>
            <div><strong>${escapeHtml(pkg.name)}</strong><p>${escapeHtml(pkg.description)}</p></div>
            <small>${escapeHtml(pkg.skillCount)} 项技能</small><b>进入 →</b>
          </a>`
        )
        .join("")}</section>`
    : "";

  elements.skillResults.innerHTML = skillMatches.length
    ? `<section class="result-group"><h3>具体技能 · ${skillMatches.length}</h3>${skillMatches
        .map(
          (skill) => `<a class="catalogue-result skill-result" href="${escapeHtml(skill.href)}">
            <span class="result-type">具体技能</span>
            <div><strong>${escapeHtml(skill.name ?? skill.id)}</strong><p>${escapeHtml(resultSummary(skill))}</p></div>
            <small>归属 · ${escapeHtml(skill.package.name)}<code>${escapeHtml(skill.command ?? "")}</code></small><b>定位 →</b>
          </a>`
        )
        .join("")}</section>`
    : "";

  elements.guideResults.innerHTML = guideMatches.length
    ? `<section class="result-group"><h3>专题知识库 · ${guideMatches.length}</h3>${guideMatches
        .map(
          (guide) => `<a class="catalogue-result guide-result" href="${escapeHtml(guide.href)}">
            <span class="result-type">专题知识库</span>
            <div><strong>${escapeHtml(guide.name)}</strong><p>${escapeHtml(guide.description)}</p></div>
            <small>${escapeHtml(guide.articleCount)} 篇文章 · ${escapeHtml(guide.label)}</small><b>进入 →</b>
          </a>`
        )
        .join("")}</section>`
    : "";
}

function syncQueryUrl() {
  const nextUrl = new URL(location.href);
  if (state.query.trim()) nextUrl.searchParams.set("q", state.query);
  else nextUrl.searchParams.delete("q");
  history.replaceState({}, "", nextUrl);
}

function setQuery(query, { syncUrl = true } = {}) {
  state.query = query;
  elements.query.value = query;
  if (syncUrl) syncQueryUrl();
  renderSearchResults();
}

function bindEvents() {
  elements.query.addEventListener("input", (event) => setQuery(event.target.value));
  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    setQuery(elements.query.value);
  });
  elements.clearSearch.addEventListener("click", () => {
    setQuery("");
    elements.query.focus();
  });
  window.addEventListener("popstate", () => {
    setQuery(new URL(location.href).searchParams.get("q") ?? "", { syncUrl: false });
  });
}

async function init() {
  [state.catalog, state.guides] = await Promise.all([
    fetch("/assets/data/catalog.json?v=20260731-2").then((response) => response.json()),
    fetch("/assets/data/guides.json?v=20260731-2").then((response) => response.json()),
  ]);
  state.packageSkills = await loadPackageSkills(state.catalog, (url) =>
    fetch(url).then((response) => response.json())
  );
  elements.query.value = state.query;
  renderGroups();
  renderSearchResults();
  bindEvents();
}

init().catch((error) => {
  console.error(error);
  elements.groups.innerHTML = '<p class="catalogue-load-error">技能包目录暂时无法加载，请稍后重试。</p>';
  elements.groups.setAttribute("aria-busy", "false");
});
