export function initCaseModal({ items }) {
  const modal = document.createElement('dialog');
  modal.className = 'case-modal';
  modal.setAttribute('aria-label', 'Case Details');

  modal.innerHTML = `
    <article class="case-modal-inner">
      <button class="modal-close" type="button" aria-label="Close">×</button>
      <div id="case-content"></div>
    </article>
  `;

  document.body.appendChild(modal);

  const content = modal.querySelector('#case-content');
  const closeButton = modal.querySelector('.modal-close');

  const gallery = (id) => {
    const mediaPool = items.map((entry) => entry.image).filter(Boolean);
    return Array.from({ length: 6 }, (_, i) => {
      const file = mediaPool[(id + i - 1) % mediaPool.length];
      return `<li><img src="/media/${file}" alt="Gallery ${i + 1}" loading="lazy" onerror="this.style.opacity='0.2'" /></li>`;
    }).join('');
  };

  function render(item) {
    content.innerHTML = `
      <header class="case-head">
        <h3>${item.title}</h3>
        <p>${item.category} · ${item.year}</p>
      </header>
      <div class="case-hero" role="img" aria-label="Case Hero Placeholder">
        <img src="/media/${item.image}" alt="${item.title}" loading="lazy" onerror="this.style.display='none'" />
        <span>Case Preview</span>
      </div>
      <ul class="case-facts">
        <li>Format: 16:9 + 9:16 Deliverables</li>
        <li>Turnaround: 7 Tage</li>
        <li>Team: Director + 1st AC + Gaffer</li>
      </ul>
      <p class="case-copy">
        Produktion mit starkem Fokus auf Lichtcharakter, Texturen und präzise Schnittpunkte für Markenkommunikation.
      </p>
      <ul class="case-gallery">${gallery(item.id)}</ul>
    `;
  }

  function openById(id) {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    render(item);
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', 'true');
    }
  }

  function close() {
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
  }

  closeButton.addEventListener('click', close);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.open) {
      close();
    }
  });

  return { openById, close };
}
