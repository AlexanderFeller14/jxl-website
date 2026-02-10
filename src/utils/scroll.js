export function createScrollProgress({ sections, onSectionChange, onProgress }) {
  const state = {
    activeId: sections[0]?.id || 'home',
    progress: 0
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        .forEach((entry) => {
          const id = entry.target.getAttribute('id');
          if (id && state.activeId !== id) {
            state.activeId = id;
            onSectionChange?.(id);
          }
        });
    },
    {
      threshold: [0.35, 0.6, 0.85]
    }
  );

  sections.forEach((section) => observer.observe(section));

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    state.progress = max <= 0 ? 0 : Math.min(window.scrollY / max, 1);
    onProgress?.(state.progress);
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  return {
    getState: () => ({ ...state }),
    destroy() {
      observer.disconnect();
      window.removeEventListener('scroll', updateProgress);
    }
  };
}

export function createLazyMediaObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const node = entry.target;
        const file = node.dataset.image;
        if (!file) return;

        node.style.backgroundImage = `url(/media/${file})`;
        node.classList.add('is-loaded');
        observer.unobserve(node);
      });
    },
    { rootMargin: '200px 0px', threshold: 0.01 }
  );

  return {
    observe(nodes) {
      nodes.forEach((node) => observer.observe(node));
    },
    disconnect() {
      observer.disconnect();
    }
  };
}
