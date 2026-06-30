import './styles.css';

// Leere Leinwand für das neue Design.
// Die alte Three.js-Seite liegt im Backup-Ordner (backup/old-site-2026-06-30/)
// und im Git-Tag "pre-redesign-2026-06-30".

const app = document.querySelector('#app');

app.innerHTML = `
  <main class="start">
    <p class="kicker">jxl-visuals</p>
    <h1>Neues Design — leere Leinwand</h1>
    <p class="hint">
      Hier beginnt das neue Design von Grund auf. Der alte Stand liegt im
      Ordner <code>backup/old-site-2026-06-30/</code> und im Git-Tag
      <code>pre-redesign-2026-06-30</code>.
    </p>
  </main>
`;
