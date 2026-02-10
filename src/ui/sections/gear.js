const GEAR = {
  Cameras: [
    { name: 'Sony FX3', use: 'Low-light cine body mit sauberem Skin-Tone Verhalten.', bestFor: 'Run-and-gun ads' },
    { name: 'Sony A7 IV', use: 'Hybrid Allrounder für Foto + Video Sets.', bestFor: 'Campaign Stills' }
  ],
  Lenses: [
    { name: 'Sigma 24-70 f/2.8', use: 'Schneller Workhorse Zoom für flexible Framing-Setups.', bestFor: 'Commercial day shoots' },
    { name: 'Sony 85mm f/1.8', use: 'Kompression und sauberes Motiv-Separieren.', bestFor: 'Portrait + Interviews' }
  ],
  Audio: [
    { name: 'Rode Wireless PRO', use: 'Stabile Funkstrecken mit Backup Recording.', bestFor: 'Talking head reels' },
    { name: 'Deity D3 Pro', use: 'Richtmikro für sauberen Production Sound.', bestFor: 'Outdoor interviews' }
  ],
  Support: [
    { name: 'DJI RS4', use: 'Glatte Kameraachsen bei dynamischen Bewegungen.', bestFor: 'Tracking shots' },
    { name: 'Sachtler Ace M', use: 'Verlässliche, weiche Pan/Tilt Kontrolle.', bestFor: 'Studio dialogue' }
  ],
  Lighting: [
    { name: 'Aputure 300D II', use: 'Punchy key light mit kontrollierter Abstrahlung.', bestFor: 'Hero products' },
    { name: 'Nanlite Pavotube II', use: 'Schnelle Accent-Lights für Farbakzente.', bestFor: 'Music + social sets' }
  ]
};

export function gearSection() {
  const blocks = Object.entries(GEAR)
    .map(([category, items]) => {
      const entries = items
        .map(
          (item) => `
            <li class="gear-card" tabindex="0">
              <h3>${item.name}</h3>
              <p>${item.use}</p>
              <small>Best for: ${item.bestFor}</small>
            </li>
          `
        )
        .join('');

      return `
        <article class="gear-group" aria-labelledby="gear-${category.toLowerCase()}">
          <h2 id="gear-${category.toLowerCase()}">${category}</h2>
          <ul>${entries}</ul>
        </article>
      `;
    })
    .join('');

  return `
    <article class="desktop-window" id="panel-gear" role="region" aria-labelledby="gear-title">
      <header class="window-head">
        <span>Gear</span>
      </header>
      <div class="window-body">
        <div class="section-head">
          <p class="eyebrow">Production Toolkit</p>
          <h2 id="gear-title">Gear</h2>
          <p class="lede-small">Kuratierte Ausrüstung für robuste, filmische Ergebnisse am Set.</p>
        </div>
        <div class="gear-grid">${blocks}</div>
      </div>
    </article>
  `;
}
