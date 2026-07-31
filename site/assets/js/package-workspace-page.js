const app = document.querySelector("#package-workspace-app");

app.innerHTML = `
  <header class="workspace-header">
    <a class="workspace-brand" href="/" aria-label="返回 Skills123 首页">
      <span class="mark">S</span>
      <span><strong>Skills123</strong><small id="package-name">技能包</small></span>
    </a>
    <nav class="workspace-nav" aria-label="技能包导航">
      <a href="/packages/">技能包总览</a>
      <strong>技能目录</strong>
    </nav>
    <p class="workspace-count"><strong id="total-count">--</strong><small>SKILLS</small></p>
  </header>
  <div class="package-install-banner" id="package-install" hidden></div>

  <main class="workspace-shell" aria-busy="true">
    <aside class="workspace-filters" aria-labelledby="filters-title">
      <div class="workspace-section-head">
        <span>01</span>
        <div><small>FILTER</small><h1 id="filters-title">筛选技能</h1></div>
      </div>
      <div class="filter-surface">
        <label class="workspace-search">
          <span>搜索名称、说明或命令</span>
          <input id="skill-search" type="search" placeholder="例如技能名称" autocomplete="off">
        </label>
        <fieldset>
          <legend id="group-filter-label">领域</legend>
          <div class="filter-chips" id="group-filters"></div>
        </fieldset>
        <fieldset>
          <legend>状态</legend>
          <div class="filter-chips" id="lifecycle-filters"></div>
        </fieldset>
      </div>
    </aside>

    <section class="workspace-directory" aria-labelledby="directory-title">
      <div class="workspace-section-head directory-head">
        <span>02</span>
        <div><small>CATALOGUE</small><h2 id="directory-title">技能目录</h2></div>
        <p><strong id="visible-count">0</strong> / <span id="directory-total">0</span></p>
      </div>
      <ol class="skill-list" id="skill-list"></ol>
      <div class="workspace-empty" id="workspace-empty" hidden>
        <strong>没有匹配的技能</strong>
        <p>清除搜索词或减少筛选条件后再试。</p>
        <button type="button" id="clear-filters">清除筛选</button>
      </div>
    </section>

    <button class="detail-backdrop" id="detail-backdrop" type="button" aria-label="关闭技能详情" tabindex="-1"></button>
    <aside class="workspace-detail" id="workspace-detail" aria-labelledby="detail-title">
      <button class="detail-close" id="detail-close" type="button" title="关闭技能详情" aria-label="关闭技能详情">×</button>
      <div id="detail-content"></div>
    </aside>
  </main>

  <template id="detail-empty-template">
    <div class="detail-empty">
      <p class="detail-eyebrow">SELECTED SKILL</p>
      <h2 id="detail-title">等待选择</h2>
      <p>从技能目录中选择一项，查看用途、命令和关联信息。</p>
    </div>
  </template>`;

await import("./package-workspace.js?v=20260731-2");
