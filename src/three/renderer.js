import {
  ACESFilmicToneMapping,
  PCFSoftShadowMap,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer
} from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

export function createRenderer(canvas, perf) {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: !perf.isLowEnd,
    alpha: true,
    powerPreference: perf.isLowEnd ? 'low-power' : 'high-performance'
  });

  renderer.shadowMap.enabled = !perf.isLowEnd;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.useLegacyLights = false;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setPixelRatio(perf.pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor('#04070c', 1);

  return renderer;
}

export function createPostFX({ renderer, scene, camera, perf }) {
  if (perf.isLowEnd) return null;

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(perf.pixelRatio);
  composer.setSize(window.innerWidth, window.innerHeight);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new Vector2(window.innerWidth, window.innerHeight),
    perf.reducedMotion ? 0.08 : 0.14,
    0.42,
    1.02
  );
  bloomPass.enabled = !perf.reducedMotion;
  composer.addPass(bloomPass);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  return {
    render(delta = 0.016) {
      composer.render(delta);
    },
    setSize(width, height) {
      composer.setSize(width, height);
      bloomPass.setSize(width, height);
    },
    setPixelRatio(pixelRatio) {
      composer.setPixelRatio(pixelRatio);
    },
    dispose() {
      composer.dispose();
      bloomPass.dispose?.();
    }
  };
}
