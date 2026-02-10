const MEDIA_FILES = [
  'CK1A1682.JPG',
  'CK1A1879.JPG',
  'CK1A2044.JPG',
  'CK1A2185.JPG',
  'CK1A2347.JPG',
  'CK1A2429.JPG',
  'CK1A2572.JPG',
  'CK1A7967.JPG',
  'CK1A8005.JPG',
  'CK1A8575-Enhanced-NR.JPG',
  'CK1A8986.JPG',
  'CK1A9013.JPG'
];

const WORK_ITEMS = [
  { id: 1, title: 'Velocity Noir', category: 'Automotive', year: 2025, image: MEDIA_FILES[0] },
  { id: 2, title: 'Cold Engine', category: 'Automotive', year: 2024, image: MEDIA_FILES[1] },
  { id: 3, title: 'Launch Sequence', category: 'Commercial', year: 2025, image: MEDIA_FILES[2] },
  { id: 4, title: 'Urban Pulse', category: 'Commercial', year: 2023, image: MEDIA_FILES[3] },
  { id: 5, title: 'Night Protocol', category: 'Events', year: 2024, image: MEDIA_FILES[4] },
  { id: 6, title: 'Main Stage Arc', category: 'Events', year: 2023, image: MEDIA_FILES[5] },
  { id: 7, title: '48h Campaign', category: 'Social', year: 2025, image: MEDIA_FILES[6] },
  { id: 8, title: 'City Sprint', category: 'Social', year: 2024, image: MEDIA_FILES[7] },
  { id: 9, title: 'Drive Unit', category: 'Automotive', year: 2023, image: MEDIA_FILES[8] },
  { id: 10, title: 'Brand Texture', category: 'Commercial', year: 2022, image: MEDIA_FILES[9] }
];

export function getWorkItems() {
  return WORK_ITEMS;
}

export function getMediaFiles() {
  return MEDIA_FILES;
}

export function workSection() {
  const cards = WORK_ITEMS.map((item) => {
    return `
      <article
        class="work-item"
        data-id="${item.id}"
        data-category="${item.category}"
        data-index="${item.id - 1}"
        data-image="${item.image}"
        tabindex="0"
        role="button"
        aria-label="Case öffnen: ${item.title}"
      >
        <div class="work-thumb" data-image="${item.image}" style="background-image:url('/media/${item.image}')"></div>
        <div class="work-caption">
          <h3>${item.title}</h3>
          <p>${item.category} · ${item.year}</p>
        </div>
      </article>
    `;
  }).join('');

  return `
    <article class="desktop-window" id="panel-work" role="region" aria-labelledby="work-title">
      <header class="window-head">
        <span>Work</span>
      </header>
      <div class="window-body">
        <div class="section-head">
          <p class="eyebrow">Selected Cases</p>
          <h2 id="work-title">Work</h2>
        </div>
        <div class="work-filter-wrap" id="work-filter" aria-label="Work Filter"></div>
        <div class="work-grid" id="work-grid">${cards}</div>
      </div>
    </article>
  `;
}
