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

  function shuffle(list) {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const gallery = (currentImage) => {
    const mediaPool = items.map((entry) => entry.image).filter(Boolean);
    const randomized = shuffle(mediaPool.filter((file) => file !== currentImage));
    return Array.from({ length: 6 }, (_, i) => {
      const file = randomized[i % randomized.length] || currentImage;
      return `<li><img src="/media/${file}" alt="Gallery ${i + 1}" loading="lazy" onerror="this.style.opacity='0.2'" /></li>`;
    }).join('');
  };

  function render(item) {
    content.innerHTML = `
      <div class="case-hero" role="img" aria-label="Case Hero Placeholder">
        <img src="/media/${item.image}" alt="${item.title}" loading="lazy" onerror="this.style.display='none'" />
        <span>Case Preview</span>
      </div>
      <p class="case-gallery-title">weitere Bilder</p>
      <ul class="case-gallery">${gallery(item.image)}</ul>
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
