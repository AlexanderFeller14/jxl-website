import './styles.css';

import { homeSection } from './ui/sections/home.js';
import { workSection, getWorkItems } from './ui/sections/work.js';
import { contactSection } from './ui/sections/contact.js';

import { initMagneticButtons } from './ui/components/button.js';
import { initCaseModal } from './ui/components/modal.js';

import { createPostFX, createRenderer } from './three/renderer.js';
import { createPortfolioScene } from './three/scene.js';
import { createTimelineState } from './three/timeline.js';

import { detectPerfProfile, onVisibilityChange, debounce } from './utils/perf.js';
import { createPointerTracker } from './utils/input.js';

const THEME_STORAGE_KEY = 'jxl-theme';

const app = document.querySelector('#app');
const workItems = getWorkItems();

app.innerHTML = `
  <main class="desktop" aria-label="Interactive Desktop Portfolio">
    <div class="desktop-shell">
      <nav class="app-launcher" aria-label="Desktop Apps">
        <button class="app-icon is-active magnetic" data-panel="home" aria-label="Open Home">HOME</button>
        <button class="app-icon magnetic" data-panel="work" aria-label="Open Work">WORK</button>
        <button class="app-icon magnetic" data-panel="contact" aria-label="Open Contact">CONTACT</button>
      </nav>

      <section class="desktop-center" aria-label="Hero Stage">
        <div class="canvas-shell" aria-hidden="true">
          <canvas id="hero-canvas"></canvas>
          <div class="grain-overlay"></div>
        </div>

        <aside class="jazz-widget" aria-label="Jazz Player Widget">
          <div class="spotify-frame-wrap">
            <iframe
              class="spotify-frame"
              title="Spotify Jazz Playlist"
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DXbITWG1ZJKYt?utm_source=generator&theme=0"
              width="100%"
              height="152"
              frameborder="0"
              allowfullscreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>
        </aside>

        <section class="window-stack" aria-live="polite">
          ${homeSection()}
          ${workSection()}
          ${contactSection()}
        </section>
      </section>

      <button
        class="theme-fab app-icon app-icon-theme magnetic"
        id="theme-toggle"
        type="button"
        aria-label="Switch theme"
        aria-pressed="false"
      >
        LIGHT
      </button>
    </div>
  </main>
`;

function getPreferredTheme() {
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function lockSpotifyThemeDark() {
  const iframe = document.querySelector('.spotify-frame');
  if (!iframe) return;

  const current = iframe.getAttribute('src');
  if (!current) return;

  const url = new URL(current, window.location.origin);
  if (url.searchParams.get('theme') === '0') return;
  url.searchParams.set('theme', '0');
  iframe.setAttribute('src', url.toString());
}

function applyTheme(theme) {
  const next = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);

  const toggle = document.querySelector('#theme-toggle');
  if (toggle) {
    const isLight = next === 'light';
    toggle.textContent = isLight ? 'DARK' : 'LIGHT';
    toggle.setAttribute('aria-pressed', String(isLight));
    toggle.setAttribute(
      'aria-label',
      isLight ? 'Switch to dark mode' : 'Switch to light mode'
    );
  }
  window.dispatchEvent(new CustomEvent('app-theme-change', { detail: { theme: next } }));
}

function initThemeToggle() {
  const toggle = document.querySelector('#theme-toggle');
  if (!toggle) return;

  let theme = getPreferredTheme();
  applyTheme(theme);

  toggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyTheme(theme);
  });

  const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: light)');
  const onSchemeChange = (event) => {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return;
    applyTheme(event.matches ? 'light' : 'dark');
  };

  colorSchemeMedia.addEventListener?.('change', onSchemeChange);
  window.addEventListener('beforeunload', () => {
    colorSchemeMedia.removeEventListener?.('change', onSchemeChange);
  });
}

initThemeToggle();
lockSpotifyThemeDark();

initMagneticButtons(document);

const modal = initCaseModal({ items: workItems });
const grid = document.querySelector('#work-grid');
const viewport = document.querySelector('#work-viewport');
const prevBtn = document.querySelector('#work-prev');
const nextBtn = document.querySelector('#work-next');
const counter = document.querySelector('#work-counter');
const slides = Array.from(grid?.querySelectorAll('.work-slide') || []);

function getActiveSlideIndex() {
  if (!viewport || slides.length === 0) return 0;
  const center = viewport.scrollLeft + viewport.clientWidth * 0.5;
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide, index) => {
    const slideCenter = slide.offsetLeft + slide.clientWidth * 0.5;
    const distance = Math.abs(slideCenter - center);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function updateWorkCounter() {
  if (!counter || slides.length === 0) return;
  counter.textContent = `${getActiveSlideIndex() + 1} / ${slides.length}`;
}

function scrollToSlide(index) {
  if (!viewport || slides.length === 0) return;
  const clamped = Math.max(0, Math.min(index, slides.length - 1));
  const slide = slides[clamped];
  viewport.scrollTo({
    left: slide.offsetLeft,
    behavior: 'smooth'
  });
}

if (viewport && slides.length > 0) {
  let scrollTick = 0;
  viewport.addEventListener('scroll', () => {
    if (scrollTick) cancelAnimationFrame(scrollTick);
    scrollTick = requestAnimationFrame(updateWorkCounter);
  });
  updateWorkCounter();
}

prevBtn?.addEventListener('click', () => {
  scrollToSlide(getActiveSlideIndex() - 1);
});

nextBtn?.addEventListener('click', () => {
  scrollToSlide(getActiveSlideIndex() + 1);
});

viewport?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    scrollToSlide(getActiveSlideIndex() - 1);
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    scrollToSlide(getActiveSlideIndex() + 1);
  }
});

grid.addEventListener('click', (event) => {
  const card = event.target.closest('.work-item');
  if (!card) return;
  modal.openById(Number(card.dataset.id));
});

grid.addEventListener('keydown', (event) => {
  const card = event.target.closest('.work-item');
  if (!card) return;

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    modal.openById(Number(card.dataset.id));
  }
});

const form = document.querySelector('#contact-form');
const feedback = document.querySelector('#form-feedback');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const message = String(data.get('message') || '').trim();
  const budget = String(data.get('budget') || '').trim();

  if (!name || !email || !message) {
    feedback.textContent = 'Bitte Name, Email und Message ausfüllen.';
    return;
  }

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!validEmail) {
    feedback.textContent = 'Bitte eine gültige Email-Adresse eingeben.';
    return;
  }

  const subject = encodeURIComponent(`Projektanfrage von ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nBudget: ${budget || 'n/a'}\n\n${message}`
  );

  window.location.href = `mailto:alex@jxl-visuals.com?subject=${subject}&body=${body}`;
  feedback.textContent = 'Mail-App wird geöffnet. Danke!';
  form.reset();
});

async function initThreeExperience() {
  const perf = detectPerfProfile();
  const pointer = createPointerTracker(window);
  const canvas = document.querySelector('#hero-canvas');
  const renderer = createRenderer(canvas, perf);
  const world = await createPortfolioScene({ renderer, perf });
  const postFX = createPostFX({ renderer, scene: world.scene, camera: world.camera, perf });

  let running = !document.hidden;
  let raf = 0;
  let progressCurrent = 0.06;
  let progressTarget = 0.06;

  const panelToProgress = {
    home: 0.06,
    work: 0.36,
    contact: 0.95
  };

  const panels = document.querySelectorAll('.desktop-window');
  const appIcons = document.querySelectorAll('.app-icon[data-panel]');
  const heroCta = document.querySelector('#hero-cta');

  function syncThreeTheme(theme) {
    const next = theme === 'light' ? 'light' : 'dark';
    renderer.setClearColor(next === 'light' ? '#e2ebf8' : '#04070c', 1);
    world.setTheme?.(next);
    requestRender();
  }

  syncThreeTheme(document.documentElement.getAttribute('data-theme'));

  const onThemeChange = (event) => {
    syncThreeTheme(event.detail?.theme);
  };
  window.addEventListener('app-theme-change', onThemeChange);

  function requestRender() {
    if (!running || raf) return;
    raf = requestAnimationFrame(frameLoop);
  }

  function setActivePanel(panelId) {
    panels.forEach((panel) => panel.classList.toggle('is-active', panel.id === `panel-${panelId}`));
    appIcons.forEach((icon) => {
      icon.classList.toggle('is-active', icon.dataset.panel === panelId);
    });
    heroCta?.classList.toggle('is-visible', panelId === 'home');
    progressTarget = panelToProgress[panelId] ?? 0.06;
    requestRender();
  }

  appIcons.forEach((icon) => {
    icon.addEventListener('click', () => setActivePanel(icon.dataset.panel));
  });

  document.querySelectorAll('[data-open-panel]').forEach((button) => {
    button.addEventListener('click', () => setActivePanel(button.dataset.openPanel));
  });

  let lastTime = performance.now();

  function renderFrame(timeMs = performance.now()) {
    const pointerState = pointer.update(0.16);
    progressCurrent += (progressTarget - progressCurrent) * 0.12;
    const state = createTimelineState(progressCurrent);
    world.update(state, pointerState, timeMs * 0.001);

    const delta = Math.min((timeMs - lastTime) * 0.001, 0.05);
    lastTime = timeMs;

    if (postFX) {
      postFX.render(delta);
    } else {
      renderer.render(world.scene, world.camera);
    }
  }

  function frameLoop(now) {
    raf = 0;
    if (!running) return;

    renderFrame(now);

    if (Math.abs(progressTarget - progressCurrent) > 0.001 || world.requiresContinuousRender) {
      raf = requestAnimationFrame(frameLoop);
    }
  }

  function setLoopState(next) {
    running = next;
    if (!running && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    if (running) {
      requestRender();
    }
  }

  const onDragStart = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    canvas.classList.add('is-grabbing');
    canvas.setPointerCapture?.(event.pointerId);
    world.beginDrag(event.clientX, event.clientY, event.pointerId);
    requestRender();
  };

  const onDragMove = (event) => {
    if (!world.isDragging()) return;
    world.dragTo(event.clientX, event.clientY, event.pointerId);
    requestRender();
  };

  const onDragEnd = (event) => {
    if (!world.isDragging()) return;
    world.endDrag(event.pointerId);
    canvas.classList.remove('is-grabbing');
    if (canvas.hasPointerCapture?.(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    requestRender();
  };

  canvas.addEventListener('pointerdown', onDragStart);
  canvas.addEventListener('pointermove', onDragMove);
  canvas.addEventListener('pointerup', onDragEnd);
  canvas.addEventListener('pointercancel', onDragEnd);

  const workCards = document.querySelectorAll('.work-item');
  workCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      world.setHover(Number(card.dataset.index));
      requestRender();
    });
    card.addEventListener('mouseleave', () => {
      world.setHover(-1);
      requestRender();
    });
    card.addEventListener('focus', () => {
      world.setHover(Number(card.dataset.index));
      requestRender();
    });
    card.addEventListener('blur', () => {
      world.setHover(-1);
      requestRender();
    });
  });

  const onPointerWake = () => requestRender();
  window.addEventListener('pointermove', onPointerWake, { passive: true });
  window.addEventListener('touchmove', onPointerWake, { passive: true });

  const stopVisibility = onVisibilityChange((isVisible) => {
    setLoopState(isVisible);
  });

  const onResize = debounce(() => {
    const pixelRatio = perf.isLowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    postFX?.setPixelRatio(pixelRatio);
    postFX?.setSize(window.innerWidth, window.innerHeight);
    world.resize();
    requestRender();
  }, 120);

  window.addEventListener('resize', onResize);

  requestRender();

  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(raf);
    stopVisibility();
    pointer.destroy();
    window.removeEventListener('app-theme-change', onThemeChange);
    canvas.removeEventListener('pointerdown', onDragStart);
    canvas.removeEventListener('pointermove', onDragMove);
    canvas.removeEventListener('pointerup', onDragEnd);
    canvas.removeEventListener('pointercancel', onDragEnd);
    window.removeEventListener('pointermove', onPointerWake);
    window.removeEventListener('touchmove', onPointerWake);
    world.dispose();
    postFX?.dispose();
    renderer.dispose();
  });
}

initThreeExperience();
