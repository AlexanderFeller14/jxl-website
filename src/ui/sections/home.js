export function homeSection() {
  return `
    <article class="desktop-window home-window is-active" id="panel-home" role="region" aria-labelledby="home-title">
      <div class="window-body home-body">
        <section class="home-2026" aria-label="Hero Widget">
          <h1 id="home-title" class="visually-hidden">jxl-visuals</h1>
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
    </article>
  `;
}
