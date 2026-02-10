const LOW_END_GPU_HINTS = ['mali', 'adreno', 'intel(r) uhd', 'apple gpu'];

export function detectPerfProfile() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hardware = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const ua = navigator.userAgent.toLowerCase();
  const narrowViewport = window.matchMedia('(max-width: 900px)').matches;

  const lowEndFromUA = LOW_END_GPU_HINTS.some((hint) => ua.includes(hint));
  const isLowEnd = lowEndFromUA || hardware <= 4 || memory <= 4 || narrowViewport;

  return {
    reducedMotion,
    isLowEnd,
    pixelRatio: isLowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
  };
}

export function onVisibilityChange(callback) {
  const handler = () => callback(!document.hidden);
  document.addEventListener('visibilitychange', handler);
  return () => document.removeEventListener('visibilitychange', handler);
}

export function debounce(fn, delay = 150) {
  let timer = 0;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}
