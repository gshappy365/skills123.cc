const state = { catalog: null, query: "" };

function packageUrl(pkg) {
  return pkg.id === "development"
    ? "/packages/development/"
    : "/packages/investment-research/";
}

function render() {
  const { scenarios, packages } = state.catalog;
  const normalized = state.query.trim().toLowerCase();
  const matches = packages.filter((pkg) =>
    [pkg.name, pkg.description, ...pkg.tags].join(" ").toLowerCase().includes(normalized)
  );

  document.querySelector("#scenario-grid").innerHTML = scenarios.map((scenario, index) => {
    const content = `<span class="number">0${index + 1}</span><strong>${scenario.name}</strong><small>${scenario.description}</small>`;
    return scenario.status === "active"
      ? `<a class="scenario-card" href="/packages/?scenario=${scenario.id}">${content}</a>`
      : `<div class="scenario-card is-soon" aria-label="${scenario.name} 即将添加">${content}<em>即将添加</em></div>`;
  }).join("");

  document.querySelector("#package-grid").innerHTML = matches.length
    ? matches.map((pkg) => `<a class="package-card" href="${packageUrl(pkg)}">
        <div><div class="tags"><span>${scenarios.find((s) => s.id === pkg.scenario).name}</span><span>${pkg.skillCount} 项技能</span></div>
        <h3>${pkg.name}</h3><p>${pkg.description}</p></div>
        <div class="card-foot"><span>${pkg.tags.join(" · ")}</span><b>查看技能包 →</b></div></a>`).join("")
    : '<p class="empty">没有匹配的技能包。请尝试更短的关键词。</p>';
}

async function init() {
  const response = await fetch("/assets/data/catalog.json");
  state.catalog = await response.json();
  document.querySelector("#package-search").addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });
  render();
}

init().catch(() => {
  document.querySelector("#package-grid").innerHTML = '<p class="empty">技能包目录暂时无法加载。</p>';
});
