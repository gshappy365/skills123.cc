const input = document.querySelector("[data-guide-search]");

if (input) {
  const cards = [...document.querySelectorAll("[data-guide-card]")];
  const sections = [...document.querySelectorAll("[data-guide-section]")];
  const resultCount = document.querySelector("[data-guide-result-count]");
  const empty = document.querySelector("[data-guide-empty]");

  const filter = () => {
    const query = input.value.trim().toLocaleLowerCase();
    let visible = 0;

    for (const card of cards) {
      const matches = !query || card.dataset.search.includes(query);
      card.hidden = !matches;
      if (matches) visible += 1;
    }

    for (const section of sections) {
      section.hidden = !section.querySelector("[data-guide-card]:not([hidden])");
    }

    resultCount.textContent = `${visible} 篇文章`;
    empty.hidden = visible > 0;
  };

  input.addEventListener("input", filter);
  filter();
}
