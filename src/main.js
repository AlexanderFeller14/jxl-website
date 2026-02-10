import './styles.css';

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
const CONTACT_EMAIL = 'alex@jxl-visuals.com';
const CONTACT_ENDPOINT = '/api/contact';

const app = document.querySelector('#app');
const workItems = getWorkItems();

app.innerHTML = `
  <main class="desktop" aria-label="Interactive Desktop Portfolio">
    <div class="desktop-shell">
      <nav class="app-launcher" aria-label="Desktop Apps">
        <button class="app-icon magnetic" data-panel="home" aria-label="Open Home">HOME</button>
        <button class="app-icon is-active magnetic" data-panel="work" aria-label="Open Work">WORK</button>
        <button class="app-icon magnetic" data-panel="contact" aria-label="Open Contact">CONTACT</button>
        <button
          class="app-icon app-icon-theme nav-theme-toggle magnetic"
          data-theme-toggle
          type="button"
          aria-label="Switch theme"
          aria-pressed="false"
        >
          LIGHT
        </button>
      </nav>

      <section class="desktop-center" aria-label="Hero Stage">
        <div class="canvas-shell" aria-hidden="true">
          <canvas id="hero-canvas"></canvas>
          <div class="grain-overlay"></div>
        </div>

        <aside class="home-widget-persistent" aria-label="JXL Home Widget">
          <div class="window-body home-body">
            <section class="home-2026" aria-label="Hero Widget">
              <h1 id="home-widget-title" class="visually-hidden">jxl-visuals</h1>
              <div class="home-title-logo-wrap">
                <img
                  class="home-title-logo"
                  src="/media/logo-jxl.png"
                  alt="JXL Visuals"
                  loading="eager"
                  decoding="async"
                  onerror="this.classList.add('is-hidden'); this.nextElementSibling.classList.add('is-visible')"
                />
                <span class="home-title-logo-fallback">JXL Visuals</span>
              </div>
              <p class="lede">Cinematic Photo &amp; Film mit Fokus auf Automotive, Commercial und schnelle Social Deliverables.</p>
              <div class="home-tags" aria-label="Leistungsbereiche">
                <span>Photo</span>
                <span>Video</span>
                <span>Short-form</span>
                <span>Commercial</span>
              </div>
            </section>
          </div>
        </aside>

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
          ${workSection()}
          ${contactSection()}
        </section>
      </section>

      <button
        class="theme-fab app-icon app-icon-theme magnetic"
        data-theme-toggle
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

  const toggles = document.querySelectorAll('[data-theme-toggle]');
  toggles.forEach((toggle) => {
    const isLight = next === 'light';
    toggle.textContent = isLight ? 'DARK' : 'LIGHT';
    toggle.setAttribute('aria-pressed', String(isLight));
    toggle.setAttribute(
      'aria-label',
      isLight ? 'Switch to dark mode' : 'Switch to light mode'
    );
  });
  window.dispatchEvent(new CustomEvent('app-theme-change', { detail: { theme: next } }));
}

function initThemeToggle() {
  const toggles = document.querySelectorAll('[data-theme-toggle]');
  if (!toggles.length) return;

  let theme = getPreferredTheme();
  applyTheme(theme);

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      applyTheme(theme);
    });
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
const thumbsTrack = document.querySelector('#work-thumbs');
const thumbButtons = Array.from(thumbsTrack?.querySelectorAll('.work-thumb-chip') || []);
const mainImages = Array.from(grid?.querySelectorAll('[data-work-main-image]') || []);
const thumbImages = Array.from(thumbsTrack?.querySelectorAll('[data-work-thumb-image]') || []);
const workPanel = document.querySelector('#panel-work');

const MAIN_PRELOAD_RADIUS = 1;
const THUMB_PRELOAD_RADIUS = 4;
let workAssetsPrimed = false;
let workAllAssetsPreloaded = false;

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

function hydrateImage(img, { priority = 'auto', frame = null } = {}) {
  if (!img) return;
  const src = img.dataset.src;
  if (!src) return;

  img.fetchPriority = priority;

  if (img.dataset.loaded === 'true') return;

  const srcset = img.dataset.srcset;
  const sizes = img.dataset.sizes;
  const fallbackSrc = img.dataset.fallbackSrc;
  const fallbackSrcSet = img.dataset.fallbackSrcset;
  const fallbackSizes = img.dataset.fallbackSizes;

  const applySource = (nextSrc, nextSrcSet = '', nextSizes = '') => {
    if (nextSrcSet) {
      img.srcset = nextSrcSet;
    } else {
      img.removeAttribute('srcset');
    }
    if (nextSizes) {
      img.sizes = nextSizes;
    } else {
      img.removeAttribute('sizes');
    }
    img.src = nextSrc;
  };

  const markLoaded = () => {
    img.removeEventListener('load', markLoaded);
    img.removeEventListener('error', markError);
    img.classList.add('is-loaded');
    frame?.classList.remove('is-loading');
  };

  const markError = () => {
    if (!img.dataset.fallbackTried && fallbackSrc) {
      img.dataset.fallbackTried = 'true';
      applySource(fallbackSrc, fallbackSrcSet, fallbackSizes || sizes);
      return;
    }
    img.removeEventListener('load', markLoaded);
    img.removeEventListener('error', markError);
    frame?.classList.remove('is-loading');
    frame?.classList.add('is-error');
  };

  img.addEventListener('load', markLoaded);
  img.addEventListener('error', markError);
  applySource(src, srcset, sizes);
  img.dataset.loaded = 'true';

  if (img.complete && img.naturalWidth > 0) {
    markLoaded();
  }
}

function preloadMainImages(activeIndex, { background = false, radius = MAIN_PRELOAD_RADIUS } = {}) {
  mainImages.forEach((img, index) => {
    if (Math.abs(index - activeIndex) > radius) return;
    const frame = img.closest('.work-thumb');
    hydrateImage(img, {
      priority: background ? 'low' : index === activeIndex ? 'high' : 'auto',
      frame
    });
  });
}

function preloadThumbImages(activeIndex, { background = false, radius = THUMB_PRELOAD_RADIUS } = {}) {
  thumbImages.forEach((img, index) => {
    if (Math.abs(index - activeIndex) > radius) return;
    hydrateImage(img, {
      priority: background ? 'low' : index === activeIndex ? 'high' : 'low'
    });
  });
}

function primeWorkAssets({ background = false } = {}) {
  if (workAssetsPrimed) return;
  workAssetsPrimed = true;
  const activeIndex = getActiveSlideIndex();
  preloadMainImages(activeIndex, { background });
  preloadThumbImages(activeIndex, { background });
}

function preloadAllWorkAssetsLowPriority() {
  if (workAllAssetsPreloaded) return;
  workAllAssetsPreloaded = true;

  mainImages.forEach((img) => {
    const frame = img.closest('.work-thumb');
    hydrateImage(img, { priority: 'low', frame });
  });

  thumbImages.forEach((img) => {
    hydrateImage(img, { priority: 'low' });
  });
}

function scheduleBackgroundWorkPreload() {
  const connection =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
  const saveData = Boolean(connection?.saveData);
  const effectiveType = String(connection?.effectiveType || '').toLowerCase();
  const slowNetwork = effectiveType.includes('2g');
  const shouldPreloadAll = !saveData && !slowNetwork;

  const run = () => {
    primeWorkAssets({ background: true });

    const loadAll = () => {
      if (!shouldPreloadAll) return;
      preloadAllWorkAssetsLowPriority();
    };

    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(loadAll, { timeout: 3500 });
    } else {
      window.setTimeout(loadAll, 1200);
    }
  };

  if (document.readyState === 'complete') {
    window.setTimeout(run, 300);
    return;
  }

  window.addEventListener(
    'load',
    () => {
      window.setTimeout(run, 300);
    },
    { once: true }
  );
}

function setActiveWorkThumb(index) {
  if (thumbButtons.length === 0) return;
  thumbButtons.forEach((button, buttonIndex) => {
    const isActive = buttonIndex === index;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
    if (isActive) {
      button.setAttribute('aria-current', 'true');
    } else {
      button.removeAttribute('aria-current');
    }
  });

  const active = thumbButtons[index];
  active?.scrollIntoView({
    block: 'nearest',
    inline: 'center',
    behavior: 'smooth'
  });
}

function updateWorkUI() {
  if (!counter || slides.length === 0) return;
  const activeIndex = getActiveSlideIndex();
  counter.textContent = `${activeIndex + 1} / ${slides.length}`;
  setActiveWorkThumb(activeIndex);
  if (!workAssetsPrimed) return;
  preloadMainImages(activeIndex);
  preloadThumbImages(activeIndex);
}

function scrollToSlide(index) {
  if (!viewport || slides.length === 0) return;
  if (!workAssetsPrimed) primeWorkAssets();
  const clamped = Math.max(0, Math.min(index, slides.length - 1));
  const slide = slides[clamped];
  setActiveWorkThumb(clamped);
  preloadMainImages(clamped);
  preloadThumbImages(clamped);
  viewport.scrollTo({
    left: slide.offsetLeft,
    behavior: 'smooth'
  });
}

if (viewport && slides.length > 0) {
  let scrollTick = 0;
  viewport.addEventListener('scroll', () => {
    if (scrollTick) cancelAnimationFrame(scrollTick);
    scrollTick = requestAnimationFrame(updateWorkUI);
  });
  updateWorkUI();
}

const onPanelChange = (event) => {
  if (event.detail?.panelId !== 'work') return;
  primeWorkAssets();
  updateWorkUI();
};
window.addEventListener('panel-change', onPanelChange);
scheduleBackgroundWorkPreload();

if (workPanel && 'IntersectionObserver' in window) {
  const workIntersectionObserver = new IntersectionObserver(
    (entries) => {
      const isVisible = entries.some((entry) => entry.isIntersecting);
      if (!isVisible) return;
      primeWorkAssets();
      updateWorkUI();
      workIntersectionObserver.disconnect();
    },
    { threshold: 0.2 }
  );
  workIntersectionObserver.observe(workPanel);
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

thumbsTrack?.addEventListener('click', (event) => {
  const thumb = event.target.closest('.work-thumb-chip');
  if (!thumb) return;
  const index = Number(thumb.dataset.workThumbIndex);
  if (Number.isNaN(index)) return;
  scrollToSlide(index);
});

window.addEventListener('beforeunload', () => {
  window.removeEventListener('panel-change', onPanelChange);
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

function setFormFeedback(message, state = 'neutral') {
  if (!feedback) return;
  feedback.textContent = message;
  feedback.dataset.state = state;
}

function buildMailtoUrl({ name, email, budget, message }) {
  const subject = encodeURIComponent(`Projektanfrage von ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nBudget (CHF): ${budget || 'nicht angegeben'}\n\n${message}`
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

function openMailtoFallback(payload) {
  window.location.href = buildMailtoUrl(payload);
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const message = String(data.get('message') || '').trim();
  const budget = String(data.get('budget') || '').trim();
  const website = String(data.get('website') || '').trim();
  const submitButton = form.querySelector('.contact-submit');
  const buttonLabel = submitButton?.textContent || "Let's shoot";

  if (!name || !email || !message) {
    setFormFeedback('Bitte Name, Email und Message ausfüllen.', 'error');
    return;
  }

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!validEmail) {
    setFormFeedback('Bitte eine gültige Email-Adresse eingeben.', 'error');
    return;
  }

  submitButton?.setAttribute('disabled', 'true');
  submitButton?.setAttribute('aria-busy', 'true');
  if (submitButton) submitButton.textContent = 'Sending...';
  setFormFeedback('Anfrage wird gesendet ...');

  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        budget,
        message,
        website
      })
    });
    const payload = await response.json().catch(() => null);
    const success = response.ok && payload?.ok === true;

    if (!success) {
      throw new Error(payload?.error || payload?.message || 'send_failed');
    }

    setFormFeedback('Danke! Deine Anfrage wurde gesendet.', 'success');
    form.reset();
  } catch (error) {
    setFormFeedback('Senden fehlgeschlagen. Mail-App wird als Fallback geöffnet.', 'error');
    openMailtoFallback({ name, email, budget, message });
  } finally {
    submitButton?.removeAttribute('disabled');
    submitButton?.removeAttribute('aria-busy');
    if (submitButton) submitButton.textContent = buttonLabel;
  }
});

async function initThreeExperience() {
  const perf = detectPerfProfile();
  const pointer = createPointerTracker(window);
  const canvas = document.querySelector('#hero-canvas');
  const renderer = createRenderer(canvas, perf);
  const world = await createPortfolioScene({ renderer, perf });
  const postFX = createPostFX({ renderer, scene: world.scene, camera: world.camera, perf });
  const mobileViewportMedia = window.matchMedia(
    '(max-width: 1100px), (hover: none) and (pointer: coarse)'
  );

  let running = !document.hidden;
  let raf = 0;
  let progressCurrent = 0.06;
  let progressTarget = 0.06;
  let isMobileViewport = mobileViewportMedia.matches;

  const panelToProgress = {
    home: 0.06,
    work: 0.36,
    contact: 0.95
  };

  const panels = document.querySelectorAll('.desktop-window');
  const appIcons = document.querySelectorAll('.app-icon[data-panel]');
  const heroCta = document.querySelector('#hero-cta');
  const desktopCenter = document.querySelector('.desktop-center');
  const windowStack = document.querySelector('.window-stack');
  let workScrollLockRaf = 0;

  const enforceWorkVerticalLock = () => {
    if (document.documentElement.getAttribute('data-active-panel') !== 'work') return;
    if (workScrollLockRaf) return;

    workScrollLockRaf = requestAnimationFrame(() => {
      workScrollLockRaf = 0;
      if (desktopCenter && desktopCenter.scrollTop !== 0) desktopCenter.scrollTop = 0;
      if (windowStack && windowStack.scrollTop !== 0) windowStack.scrollTop = 0;
      if (workPanel && workPanel.scrollTop !== 0) workPanel.scrollTop = 0;
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    });
  };

  desktopCenter?.addEventListener('scroll', enforceWorkVerticalLock, { passive: true });
  windowStack?.addEventListener('scroll', enforceWorkVerticalLock, { passive: true });
  workPanel?.addEventListener('scroll', enforceWorkVerticalLock, { passive: true });
  window.addEventListener('scroll', enforceWorkVerticalLock, { passive: true });

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

  function syncMobileViewportClass() {
    document.documentElement.classList.toggle('is-mobile-ui', isMobileViewport);
  }
  syncMobileViewportClass();

  const onMobileViewportChange = (event) => {
    isMobileViewport = event.matches;
    syncMobileViewportClass();
    requestRender();
  };
  mobileViewportMedia.addEventListener?.('change', onMobileViewportChange);

  function setActivePanel(panelId) {
    document.documentElement.setAttribute('data-active-panel', panelId);
    panels.forEach((panel) => panel.classList.toggle('is-active', panel.id === `panel-${panelId}`));
    appIcons.forEach((icon) => {
      icon.classList.toggle('is-active', icon.dataset.panel === panelId);
    });
    heroCta?.classList.toggle('is-visible', panelId === 'home');
    progressTarget = panelToProgress[panelId] ?? 0.06;

    requestAnimationFrame(() => {
      desktopCenter?.scrollTo(0, 0);
      windowStack?.scrollTo(0, 0);
      panels.forEach((panel) => {
        panel.scrollTop = 0;
        panel.scrollLeft = 0;
      });
      window.scrollTo(0, 0);
    });

    window.dispatchEvent(new CustomEvent('panel-change', { detail: { panelId } }));
    if (panelId === 'work') enforceWorkVerticalLock();
    requestRender();
  }

  appIcons.forEach((icon) => {
    icon.addEventListener('click', () => setActivePanel(icon.dataset.panel));
  });

  document.querySelectorAll('[data-open-panel]').forEach((button) => {
    button.addEventListener('click', () => setActivePanel(button.dataset.openPanel));
  });

  // Start on home so the landing state is the hero scene.
  setActivePanel('home');

  let lastTime = performance.now();

  function renderFrame(timeMs = performance.now()) {
    const pointerState = pointer.update(0.16);
    progressCurrent += (progressTarget - progressCurrent) * 0.12;
    const state = createTimelineState(progressCurrent, { mobile: isMobileViewport });
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
    desktopCenter?.removeEventListener('scroll', enforceWorkVerticalLock);
    windowStack?.removeEventListener('scroll', enforceWorkVerticalLock);
    workPanel?.removeEventListener('scroll', enforceWorkVerticalLock);
    window.removeEventListener('scroll', enforceWorkVerticalLock);
    if (workScrollLockRaf) cancelAnimationFrame(workScrollLockRaf);
    mobileViewportMedia.removeEventListener?.('change', onMobileViewportChange);
    world.dispose();
    postFX?.dispose();
    renderer.dispose();
  });
}

initThreeExperience();
