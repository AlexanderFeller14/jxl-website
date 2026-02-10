import {
  createMainImagePath,
  createMainImageSrcSet,
  createOriginalMediaPath,
  createThumbImagePath,
  createThumbImageSrcSet
} from '../../utils/media.js';

const MEDIA_FILES = [
  'CK1A1682.JPG',
  'CK1A1879.JPG',
  'CK1A2044.JPG',
  'CK1A2185.JPG',
  'CK1A2347.JPG',
  'CK1A2429.JPG',
  'CK1A2572.JPG',
  'CK1A4624 2.JPG',
  'CK1A5161 2.JPG',
  'CK1A6184-2 2.JPG',
  'CK1A6585.JPG',
  'CK1A6916 2.JPG',
  'CK1A6968.JPG',
  'CK1A7012.JPG',
  'CK1A7138.JPG',
  'CK1A7249.JPG',
  'CK1A7967.JPG',
  'CK1A8005.JPG',
  'CK1A8575-Enhanced-NR.JPG',
  'CK1A8986.JPG',
  'CK1A9013.JPG',
  'CK1A9107.JPG',
  'CK1A9131.JPG',
  'CK1A9960.JPG',
  '_MG_9897.JPG',
  '_MG_9944.JPG'
];

const CATEGORIES = ['Automotive', 'Commercial', 'Events', 'Social'];
const BASE_YEAR = 2026;
const FEATURED_IMAGE = 'CK1A8005.JPG';

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createTitleFromFileName(fileName) {
  return fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim();
}

const SHUFFLED_MEDIA_FILES = shuffle(MEDIA_FILES.filter((file) => file !== FEATURED_IMAGE));
const ORDERED_MEDIA_FILES = [FEATURED_IMAGE, ...SHUFFLED_MEDIA_FILES];

const WORK_ITEMS = ORDERED_MEDIA_FILES.map((image, index) => ({
  id: index + 1,
  title: createTitleFromFileName(image),
  category: CATEGORIES[index % CATEGORIES.length],
  year: BASE_YEAR - (index % 4),
  image
}));

export function getWorkItems() {
  return WORK_ITEMS;
}

export function getMediaFiles() {
  return MEDIA_FILES;
}

export function workSection() {
  const cards = WORK_ITEMS.map((item) => {
    const imagePath = createMainImagePath(item.image);
    const imageSrcSet = createMainImageSrcSet(item.image);
    const fallbackImagePath = createOriginalMediaPath(item.image);

    return `
      <button
        type="button"
        class="work-item work-slide"
        data-id="${item.id}"
        data-category="${item.category}"
        data-index="${item.id - 1}"
        data-image="${item.image}"
        aria-label="Case öffnen: ${item.title}"
      >
        <div class="work-thumb is-loading" data-image="${item.image}">
          <img
            class="work-main-image"
            data-work-main-image
            data-work-index="${item.id - 1}"
            data-src="${imagePath}"
            data-srcset="${imageSrcSet}"
            data-sizes="(max-width: 1100px) 92vw, min(84vw, 860px)"
            data-fallback-src="${fallbackImagePath}"
            data-fallback-sizes="(max-width: 1100px) 92vw, min(84vw, 860px)"
            alt=""
            decoding="async"
          />
        </div>
      </button>
    `;
  }).join('');

  const thumbs = WORK_ITEMS.map((item, index) => {
    const isActive = index === 0;
    const thumbPath = createThumbImagePath(item.image);
    const thumbSrcSet = createThumbImageSrcSet(item.image);
    const fallbackImagePath = createOriginalMediaPath(item.image);

    return `
      <button
        type="button"
        class="work-thumb-chip magnetic${isActive ? ' is-active' : ''}"
        data-work-thumb-index="${index}"
        aria-label="Bild ${index + 1} anzeigen"
        aria-pressed="${isActive ? 'true' : 'false'}"
      >
        <img
          data-work-thumb-image
          data-work-index="${index}"
          data-src="${thumbPath}"
          data-srcset="${thumbSrcSet}"
          data-sizes="(max-width: 640px) 50px, (max-width: 1100px) 58px, 64px"
          data-fallback-src="${fallbackImagePath}"
          data-fallback-sizes="(max-width: 640px) 50px, (max-width: 1100px) 58px, 64px"
          alt=""
          loading="lazy"
          decoding="async"
          fetchpriority="low"
        />
      </button>
    `;
  }).join('');

  return `
    <article class="desktop-window" id="panel-work" role="region" aria-labelledby="work-title">
      <header class="window-head">
        <span>Work</span>
      </header>
      <div class="window-body work-body">
        <div class="work-head">
          <p class="eyebrow">Portfolio</p>
          <h2 id="work-title">Work</h2>
        </div>
        <div class="work-carousel" aria-label="Portfolio Carousel">
          <button class="work-carousel-nav magnetic" id="work-prev" type="button" aria-label="Vorheriges Bild">‹</button>
          <div class="work-carousel-viewport" id="work-viewport" tabindex="0" aria-label="Work Bilder">
            <div class="work-grid work-carousel-track" id="work-grid">${cards}</div>
          </div>
          <button class="work-carousel-nav magnetic" id="work-next" type="button" aria-label="Nächstes Bild">›</button>
        </div>
        <div class="work-thumbs-wrap" aria-label="Thumbnail Vorschau">
          <div class="work-thumbs" id="work-thumbs">${thumbs}</div>
        </div>
        <p class="work-counter" id="work-counter">1 / ${WORK_ITEMS.length}</p>
      </div>
    </article>
  `;
}
