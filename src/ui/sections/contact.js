export function contactSection() {
  return `
    <article class="desktop-window" id="panel-contact" role="region" aria-labelledby="contact-title">
      <header class="window-head">
        <span>Contact</span>
      </header>
      <div class="window-body contact-layout contact-redesign">
        <section class="contact-card contact-intro">
          <p class="eyebrow">Book a Project</p>
          <h2 id="contact-title">Contact</h2>
          <p class="lede-small">Schick mir ein kurzes Briefing, ich melde mich mit einem klaren Vorschlag zurück.</p>
          <a class="contact-mail" href="mailto:alex@jxl-visuals.com">alex@jxl-visuals.com</a>
          <nav aria-label="Social Links" class="social-row">
            <a href="https://www.instagram.com/jxl_visuals/" target="_blank" rel="noreferrer noopener" aria-label="Instagram">Instagram</a>
          </nav>
          <div class="contact-meta-grid" aria-label="Kontakt Infos">
            <article class="contact-meta-item">
              <small>Response</small>
              <strong>innerhalb 24h</strong>
            </article>
            <article class="contact-meta-item">
              <small>Deliverables</small>
              <strong>Photo, Video, Reels</strong>
            </article>
          </div>
          <ul class="contact-points">
            <li>Projektziel in 1-2 Sätzen</li>
            <li>Wunschdatum oder Zeitraum</li>
            <li>Format (Photo, Video oder beides)</li>
          </ul>
        </section>

        <form id="contact-form" class="contact-form contact-card" novalidate>
          <div class="contact-row">
            <label>
              Name
              <input type="text" name="name" required autocomplete="name" />
            </label>
            <label>
              Email
              <input type="email" name="email" required autocomplete="email" />
            </label>
          </div>
          <label>
            Budget (optional)
            <input type="text" name="budget" placeholder="z.B. CHF 2'000 - 5'000" />
          </label>
          <label class="contact-message-field">
            Message
            <textarea name="message" rows="6" required placeholder="Erzähl kurz über Projekt, Ziel und Timing."></textarea>
          </label>
          <p class="form-feedback" id="form-feedback" aria-live="polite"></p>
          <button type="submit" class="btn magnetic contact-submit">Let's shoot</button>
        </form>
      </div>
    </article>
  `;
}
