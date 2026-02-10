function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerp3(a, b, t) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

const BEATS = {
  home: {
    cameraPos: [0.02, 0.86, 5.35],
    target: [0.0, 0.23, 0.0],
    frameSpread: 2.2,
    frameDepth: 4.6,
    frameGridness: 0.08,
    keyColor: [0.97, 0.99, 1.0],
    fillColor: [0.56, 0.67, 0.8],
    rimColor: [0.92, 0.3, 0.34],
    lensGlow: 1.22,
    materialRoughness: 0.16,
    ambientIntensity: 0.46
  },
  work: {
    cameraPos: [0.55, 1.06, 6.35],
    target: [0.14, 0.2, 0],
    frameSpread: 1.4,
    frameDepth: 1.2,
    frameGridness: 0.86,
    keyColor: [0.95, 0.95, 0.95],
    fillColor: [0.46, 0.5, 0.57],
    rimColor: [0.86, 0.2, 0.24],
    lensGlow: 0.9,
    materialRoughness: 0.24,
    ambientIntensity: 0.4
  },
  contact: {
    cameraPos: [0.02, 0.84, 5.12],
    target: [0.0, 0.2, 0.02],
    frameSpread: 0.95,
    frameDepth: 0.5,
    frameGridness: 0.7,
    keyColor: [0.99, 0.9, 0.84],
    fillColor: [0.49, 0.43, 0.42],
    rimColor: [0.9, 0.35, 0.3],
    lensGlow: 0.68,
    materialRoughness: 0.28,
    ambientIntensity: 0.42
  }
};

const MOBILE_BEATS = {
  home: {
    cameraPos: [0.02, 0.96, 4.82],
    target: [0.01, 0.24, 0.03],
    frameSpread: 2.2,
    frameDepth: 4.6,
    frameGridness: 0.08,
    keyColor: [0.97, 0.99, 1.0],
    fillColor: [0.56, 0.67, 0.8],
    rimColor: [0.92, 0.3, 0.34],
    lensGlow: 1.22,
    materialRoughness: 0.16,
    ambientIntensity: 0.46
  },
  work: {
    cameraPos: [0.04, 1.05, 5.52],
    target: [0.02, 0.22, 0.02],
    frameSpread: 1.4,
    frameDepth: 1.2,
    frameGridness: 0.86,
    keyColor: [0.95, 0.95, 0.95],
    fillColor: [0.46, 0.5, 0.57],
    rimColor: [0.86, 0.2, 0.24],
    lensGlow: 0.9,
    materialRoughness: 0.24,
    ambientIntensity: 0.4
  },
  contact: {
    cameraPos: [0.02, 0.84, 5.12],
    target: [0.0, 0.2, 0.02],
    frameSpread: 0.95,
    frameDepth: 0.5,
    frameGridness: 0.7,
    keyColor: [0.99, 0.9, 0.84],
    fillColor: [0.49, 0.43, 0.42],
    rimColor: [0.9, 0.35, 0.3],
    lensGlow: 0.68,
    materialRoughness: 0.28,
    ambientIntensity: 0.42
  }
};

const ORDER = ['home', 'work', 'contact'];

export function createTimelineState(progress, options = {}) {
  const beats = options.mobile ? MOBILE_BEATS : BEATS;
  const clamped = Math.min(Math.max(progress, 0), 1);
  const scaled = clamped * (ORDER.length - 1);
  const fromIndex = Math.floor(scaled);
  const toIndex = Math.min(fromIndex + 1, ORDER.length - 1);

  const from = beats[ORDER[fromIndex]];
  const to = beats[ORDER[toIndex]];
  const t = smoothstep(scaled - fromIndex);

  return {
    cameraPos: lerp3(from.cameraPos, to.cameraPos, t),
    target: lerp3(from.target, to.target, t),
    frameSpread: lerp(from.frameSpread, to.frameSpread, t),
    frameDepth: lerp(from.frameDepth, to.frameDepth, t),
    frameGridness: lerp(from.frameGridness, to.frameGridness, t),
    keyColor: lerp3(from.keyColor, to.keyColor, t),
    fillColor: lerp3(from.fillColor, to.fillColor, t),
    rimColor: lerp3(from.rimColor, to.rimColor, t),
    lensGlow: lerp(from.lensGlow, to.lensGlow, t),
    materialRoughness: lerp(from.materialRoughness, to.materialRoughness, t),
    ambientIntensity: lerp(from.ambientIntensity, to.ambientIntensity, t)
  };
}
