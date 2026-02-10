# cinematic-3d-portfolio

Premium One-Page Portfolio mit interaktivem Desktop-Look und Three.js Studio-Stage (911 Hero) für Foto- und Videografie.

## Install / Run

```bash
cd cinematic-3d-portfolio
npm install
npm run dev
```

Production Build:

```bash
npm run build
npm run preview
```

## Customize Text / Colors

- Sections und Texte:
  - `src/ui/sections/home.js`
  - `src/ui/sections/work.js`
  - `src/ui/sections/gear.js`
  - `src/ui/sections/contact.js`
- Designsystem (Farben, Glas-Look, Spacing, Widgets):
  - `src/styles.css` (`:root` Variablen)
- Kamera-/Lichtbeats über Panel-Wechsel:
  - `src/three/timeline.js`
- 3D Szene (Model, Stage, Lights, Materialien):
  - `src/three/scene.js`

## Replace Media Assets

Lege deine Medien in `public/media/`:

- JPG/PNG für Work-Items (Dateinamen in `src/ui/sections/work.js` eintragen)
- optional `showreel.mp4`

Danach Optimized Varianten erzeugen:

```bash
npm run optimize:media
```

Das Script erstellt responsive JPEGs in:

- `public/media/optimized/main-900/`
- `public/media/optimized/main-1800/`
- `public/media/optimized/thumb-360/`

### Empfohlene Bildgrößen

- Work/Case Stills (Source): 3000-6000px lange Kante, JPG, Qualität 90+
- Auslieferung erfolgt automatisch über optimierte Varianten (`900/1800/360`)

### Empfohlene Video Encodes

- Codec: H.264 High Profile
- Auflösung: 1920x1080 (oder 3840x2160)
- Bitrate: 12-20 Mbps (1080p), 35-60 Mbps (4K)
- Audio: AAC, 320 kbps, 48 kHz

## Replace 3D Car Model

- Standardpfad: `public/models/911.glb`
- Neues Modell einfach unter gleichem Namen ersetzen
- Wenn das Modell nicht geladen werden kann, fällt die Szene auf ein prozedurales Fallback-Car zurück

## Edit Work Grid Items

Work-Items werden in `src/ui/sections/work.js` über `WORK_ITEMS` gepflegt:

```js
{ id: 11, title: 'Neues Projekt', category: 'Commercial', year: 2026, image: 'dein-bild.jpg' }
```

Erlaubte Kategorien im Filter: `Automotive`, `Commercial`, `Events`, `Social`

## Deploy Steps

### Vercel

1. Repository pushen
2. Projekt in Vercel importieren
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy

### Netlify

1. Repo verbinden
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy

## Performance Notes

Bereits implementiert:

- `requestAnimationFrame` pausiert, wenn der Tab nicht sichtbar ist
- Bei `prefers-reduced-motion` läuft keine dauerhafte Idle-Animation
- PixelRatio Clamp (`1.5`, bei Low-End `1.0`)
- Debounced Resize
- `ACESFilmicToneMapping` + `outputColorSpace = sRGB`
