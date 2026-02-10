export function contactSection() {
  return `
    <article class="desktop-window" id="panel-contact" role="region" aria-labelledby="contact-title">
      <header class="window-head">
        <span>Contact</span>
      </header>
      <div class="window-body contact-layout">
        <div>
          <p class="eyebrow">Book a Project</p>
          <h2 id="contact-title">Contact</h2>
          <p class="lede-small">Erzähl kurz, was du drehen oder fotografieren willst.</p>
          <p><a href="mailto:hello@jxl-visuals.com">hello@jxl-visuals.com</a></p>
          <nav aria-label="Social Links" class="social-row">
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="Vimeo">Vimeo</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
          </nav>
        </div>
        <form id="contact-form" class="contact-form" novalidate>
          <label>
            Name
            <input type="text" name="name" required autocomplete="name" />
          </label>
          <label>
            Email
            <input type="email" name="email" required autocomplete="email" />
          </label>
          <label>
            Message
            <textarea name="message" rows="5" required></textarea>
          </label>
          <label>
            Budget (optional)
            <input type="text" name="budget" placeholder="z.B. 2.000 - 5.000 EUR" />
          </label>
          <p class="form-feedback" id="form-feedback" aria-live="polite"></p>
          <button type="submit" class="btn magnetic">Let's shoot</button>
        </form>
      </div>
    </article>
  `;
}
