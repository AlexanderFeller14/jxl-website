const FILTERS = ['All', 'Automotive', 'Commercial', 'Events', 'Social'];

export function initWorkFilter({ mount, grid, onChange }) {
  if (!mount || !grid) return;

  mount.innerHTML = `
    <div class="filter-row" role="radiogroup" aria-label="Kategorien">
      ${FILTERS.map(
        (filter, index) => `
          <button
            type="button"
            class="filter-chip magnetic ${index === 0 ? 'is-active' : ''}"
            data-filter="${filter}"
            role="radio"
            aria-checked="${index === 0 ? 'true' : 'false'}"
          >${filter}</button>
        `
      ).join('')}
    </div>
  `;

  const chips = mount.querySelectorAll('.filter-chip');

  const applyFilter = (name) => {
    grid.querySelectorAll('.work-item').forEach((item) => {
      const category = item.dataset.category;
      const visible = name === 'All' || category === name;
      item.hidden = !visible;
    });

    chips.forEach((chip) => {
      const active = chip.dataset.filter === name;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-checked', String(active));
    });

    if (typeof onChange === 'function') {
      onChange(name);
    }
  };

  mount.addEventListener('click', (event) => {
    const chip = event.target.closest('.filter-chip');
    if (!chip) return;
    applyFilter(chip.dataset.filter);
  });
}
