import {
  AmbientLight,
  Box3,
  BoxGeometry,
  CapsuleGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  Vector3
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const BASE_Y_ROTATION = Math.PI / 2;
const BASE_X_ROTATION = -0.12;
const CAR_VERTICAL_OFFSET = 0.14;
const SCENE_BG_DARK = '#020409';
const SCENE_BG_LIGHT = '#e3ecf8';

function registerMaterial(material, registry) {
  if (!material || registry.some((entry) => entry.material === material)) return;

  if ('envMapIntensity' in material) {
    material.envMapIntensity = Math.max(material.envMapIntensity ?? 0, 1.35);
  }
  if ('roughness' in material) {
    material.roughness = Math.max(0.08, (material.roughness ?? 0.35) * 0.84);
  }
  if ('metalness' in material) {
    material.metalness = Math.min(1, (material.metalness ?? 0.5) + 0.12);
  }
  if ('clearcoat' in material) {
    material.clearcoat = Math.max(material.clearcoat ?? 0, 0.52);
    material.clearcoatRoughness = Math.min(material.clearcoatRoughness ?? 0.22, 0.16);
  }

  registry.push({
    material,
    baseRoughness: 'roughness' in material ? material.roughness : null,
    baseEnvMapIntensity: 'envMapIntensity' in material ? material.envMapIntensity : null
  });
}

function createWheel(materialRegistry) {
  const wheel = new Group();

  const tireMaterial = new MeshPhysicalMaterial({
    color: '#0f1318',
    roughness: 0.9,
    metalness: 0.08
  });
  registerMaterial(tireMaterial, materialRegistry);

  const rimMaterial = new MeshPhysicalMaterial({
    color: '#dce1eb',
    roughness: 0.18,
    metalness: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.05
  });
  registerMaterial(rimMaterial, materialRegistry);

  const tire = new Mesh(new CylinderGeometry(0.34, 0.34, 0.22, 32), tireMaterial);
  tire.rotation.z = Math.PI / 2;

  const rim = new Mesh(new CylinderGeometry(0.2, 0.2, 0.23, 20), rimMaterial);
  rim.rotation.z = Math.PI / 2;

  wheel.add(tire, rim);
  return wheel;
}

function createFallbackCar(materialRegistry) {
  const car = new Group();

  const bodyMaterial = new MeshPhysicalMaterial({
    color: '#f2f5fb',
    roughness: 0.16,
    metalness: 0.84,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    iridescence: 0.72,
    iridescenceIOR: 1.82,
    iridescenceThicknessRange: [190, 640]
  });
  registerMaterial(bodyMaterial, materialRegistry);

  const darkMaterial = new MeshPhysicalMaterial({
    color: '#0c1119',
    roughness: 0.42,
    metalness: 0.6,
    clearcoat: 0.6,
    clearcoatRoughness: 0.16
  });
  registerMaterial(darkMaterial, materialRegistry);

  const shell = new Mesh(new CapsuleGeometry(0.72, 2.35, 10, 18), bodyMaterial);
  shell.rotation.z = Math.PI / 2;
  shell.scale.set(1.06, 0.72, 1.18);
  shell.position.y = 0.06;

  const cabin = new Mesh(new CapsuleGeometry(0.42, 1.05, 8, 14), darkMaterial);
  cabin.rotation.z = Math.PI / 2;
  cabin.scale.set(1, 0.62, 0.92);
  cabin.position.set(-0.05, 0.48, 0);

  const wing = new Group();
  const wingPlate = new Mesh(new BoxGeometry(1.1, 0.06, 1.62), darkMaterial);
  wingPlate.position.set(-1.46, 0.92, 0);
  const wingSupportA = new Mesh(new BoxGeometry(0.05, 0.44, 0.08), darkMaterial);
  wingSupportA.position.set(-1.38, 0.64, 0.42);
  const wingSupportB = new Mesh(new BoxGeometry(0.05, 0.44, 0.08), darkMaterial);
  wingSupportB.position.set(-1.38, 0.64, -0.42);
  wing.add(wingPlate, wingSupportA, wingSupportB);

  const wheelFL = createWheel(materialRegistry);
  wheelFL.position.set(0.85, -0.34, 0.62);
  const wheelFR = createWheel(materialRegistry);
  wheelFR.position.set(0.85, -0.34, -0.62);
  const wheelRL = createWheel(materialRegistry);
  wheelRL.position.set(-1.02, -0.34, 0.62);
  const wheelRR = createWheel(materialRegistry);
  wheelRR.position.set(-1.02, -0.34, -0.62);

  car.add(shell, cabin, wing, wheelFL, wheelFR, wheelRL, wheelRR);
  car.rotation.y = BASE_Y_ROTATION;
  car.rotation.x = BASE_X_ROTATION;
  car.position.set(0, 0.02 + CAR_VERTICAL_OFFSET, 0);

  car.traverse((node) => {
    if (!node.isMesh) return;
    node.castShadow = true;
    node.receiveShadow = true;
  });

  return car;
}

function loadGlbCar(url) {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => resolve(gltf.scene),
      undefined,
      (error) => reject(error)
    );
  });
}

function normalizeCarModel(model, materialRegistry) {
  const root = new Group();
  root.add(model);

  const box = new Box3().setFromObject(root);
  const size = new Vector3();
  const center = new Vector3();
  box.getSize(size);
  box.getCenter(center);

  model.position.sub(center);

  const longest = Math.max(size.x, size.y, size.z) || 1;
  const scale = 4.7 / longest;
  root.scale.setScalar(scale);

  root.position.set(0, 0.06 + CAR_VERTICAL_OFFSET, 0);
  root.rotation.y = BASE_Y_ROTATION;
  root.rotation.x = BASE_X_ROTATION;

  root.traverse((node) => {
    if (!node.isMesh || !node.material) return;

    node.castShadow = true;
    node.receiveShadow = true;

    if (Array.isArray(node.material)) {
      node.material.forEach((mat) => registerMaterial(mat, materialRegistry));
    } else {
      registerMaterial(node.material, materialRegistry);
    }
  });

  return root;
}

export async function createPortfolioScene({ renderer, perf } = {}) {
  const scene = new Scene();
  scene.background = new Color(SCENE_BG_DARK);

  const camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 0.82, 5.3);

  const root = new Group();
  scene.add(root);

  let environmentTarget = null;
  if (renderer) {
    const pmrem = new PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    environmentTarget = pmrem.fromScene(roomEnv, perf?.isLowEnd ? 0.03 : 0.05);
    scene.environment = environmentTarget.texture;
    roomEnv.dispose();
    pmrem.dispose();
  }

  const reactiveMaterials = [];

  let carRig;
  try {
    const model = await loadGlbCar('/models/911.glb');
    carRig = normalizeCarModel(model, reactiveMaterials);
  } catch {
    carRig = createFallbackCar(reactiveMaterials);
  }
  root.add(carRig);

  const ambient = new AmbientLight('#ffffff', 0.44);

  const key = new DirectionalLight('#f2f7ff', 2.08);
  key.position.set(3.2, 3.3, 2.8);

  const fill = new DirectionalLight('#93b3d8', 1.08);
  fill.position.set(-3.4, 1.7, 2.2);

  const rim = new DirectionalLight('#ff5f67', 1.1);
  rim.position.set(-2.8, 1.0, -3.2);

  scene.add(ambient, key, fill, rim);

  const tmp = {
    cameraPos: new Vector3(),
    target: new Vector3()
  };

  const hover = {
    highlighted: -1,
    glow: 0
  };

  const drag = {
    active: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    yaw: 0,
    pitch: 0,
    velocityYaw: 0,
    velocityPitch: 0
  };

  const baseCarY = carRig.position.y;
  const motionStrength = perf?.reducedMotion ? 0 : 1;
  const lightingTheme = {
    ambient: 1,
    key: 1,
    fill: 1,
    rim: 1
  };

  function setHover(index) {
    hover.highlighted = index;
  }

  function setTheme(theme) {
    const isLight = theme === 'light';
    scene.background.set(isLight ? SCENE_BG_LIGHT : SCENE_BG_DARK);
    lightingTheme.ambient = isLight ? 1.08 : 1;
    lightingTheme.key = isLight ? 1.08 : 1;
    lightingTheme.fill = isLight ? 1.06 : 1;
    lightingTheme.rim = isLight ? 0.92 : 1;
  }

  function beginDrag(x, y, pointerId = null) {
    drag.active = true;
    drag.pointerId = pointerId;
    drag.lastX = x;
    drag.lastY = y;
    drag.velocityYaw = 0;
    drag.velocityPitch = 0;
  }

  function dragTo(x, y, pointerId = null) {
    if (!drag.active) return;
    if (drag.pointerId !== null && pointerId !== null && drag.pointerId !== pointerId) return;

    const dx = x - drag.lastX;
    const dy = y - drag.lastY;
    drag.lastX = x;
    drag.lastY = y;

    const yawDelta = (dx / Math.max(window.innerWidth, 1)) * 4.4;
    const pitchDelta = (dy / Math.max(window.innerHeight, 1)) * 2.9;

    drag.yaw += yawDelta;
    drag.pitch = MathUtils.clamp(drag.pitch + pitchDelta, -0.38, 0.38);

    drag.velocityYaw = yawDelta * 1.75;
    drag.velocityPitch = pitchDelta * 1.7;
  }

  function endDrag(pointerId = null) {
    if (!drag.active) return;
    if (drag.pointerId !== null && pointerId !== null && drag.pointerId !== pointerId) return;
    drag.active = false;
    drag.pointerId = null;
  }

  function isDragging() {
    return drag.active;
  }

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  function update(state, pointer, elapsed = 0) {
    hover.glow = MathUtils.lerp(hover.glow, hover.highlighted >= 0 ? 1 : 0, 0.12);

    const px = MathUtils.clamp(pointer.x, -0.38, 0.38);
    const py = MathUtils.clamp(pointer.y, -0.34, 0.34);
    const parallaxWeight = drag.active ? 0.16 : 1;

    const floatA = Math.sin(elapsed * 0.52);
    const floatB = Math.cos(elapsed * 0.36);

    if (!drag.active) {
      drag.velocityYaw *= 0.93;
      drag.velocityPitch *= 0.9;
      drag.yaw += drag.velocityYaw * motionStrength;
      drag.pitch = MathUtils.clamp(drag.pitch + drag.velocityPitch * motionStrength, -0.38, 0.38);
    }

    carRig.rotation.y = MathUtils.lerp(
      carRig.rotation.y,
      BASE_Y_ROTATION + drag.yaw + px * 0.11 * parallaxWeight + floatB * 0.016 * motionStrength,
      0.058
    );
    carRig.rotation.x = MathUtils.lerp(
      carRig.rotation.x,
      BASE_X_ROTATION + drag.pitch + py * 0.034 * parallaxWeight + floatA * 0.009 * motionStrength,
      0.054
    );
    carRig.position.y = MathUtils.lerp(
      carRig.position.y,
      baseCarY + floatA * 0.1 * motionStrength,
      0.05
    );

    key.color.setRGB(state.keyColor[0], state.keyColor[1], state.keyColor[2]);
    fill.color.setRGB(state.fillColor[0], state.fillColor[1], state.fillColor[2]);
    rim.color.setRGB(state.rimColor[0], state.rimColor[1], state.rimColor[2]);

    ambient.intensity = MathUtils.lerp(
      ambient.intensity,
      state.ambientIntensity * lightingTheme.ambient,
      0.08
    );
    key.intensity = MathUtils.lerp(
      key.intensity,
      (2 + hover.glow * 0.28) * lightingTheme.key,
      0.08
    );
    fill.intensity = MathUtils.lerp(
      fill.intensity,
      (1.02 + hover.glow * 0.14) * lightingTheme.fill,
      0.08
    );
    rim.intensity = MathUtils.lerp(
      rim.intensity,
      (1.04 + hover.glow * 0.22) * lightingTheme.rim,
      0.08
    );

    for (const entry of reactiveMaterials) {
      const { material, baseRoughness, baseEnvMapIntensity } = entry;

      if (baseRoughness !== null) {
        const targetRoughness = MathUtils.clamp(
          baseRoughness + (state.materialRoughness - 0.2) * 0.2,
          0.06,
          0.88
        );
        material.roughness = MathUtils.lerp(material.roughness, targetRoughness, 0.09);
      }

      if (baseEnvMapIntensity !== null) {
        const targetEnv = baseEnvMapIntensity + state.lensGlow * 0.12 + hover.glow * 0.14;
        material.envMapIntensity = MathUtils.lerp(material.envMapIntensity, targetEnv, 0.08);
      }
    }

    tmp.cameraPos.set(
      state.cameraPos[0] + px * 0.14 * parallaxWeight,
      state.cameraPos[1] + py * 0.09 * parallaxWeight,
      state.cameraPos[2]
    );
    camera.position.lerp(tmp.cameraPos, 0.1);

    tmp.target.set(state.target[0], state.target[1] + py * 0.03 * parallaxWeight, state.target[2]);
    camera.lookAt(tmp.target);
  }

  return {
    scene,
    camera,
    requiresContinuousRender: !perf?.reducedMotion,
    update,
    resize,
    setHover,
    setTheme,
    beginDrag,
    dragTo,
    endDrag,
    isDragging,
    dispose() {
      root.traverse((node) => {
        if (node.isMesh) {
          node.geometry?.dispose();
          if (Array.isArray(node.material)) {
            node.material.forEach((mat) => mat.dispose?.());
          } else {
            node.material?.dispose?.();
          }
        }
      });
      environmentTarget?.dispose();
    }
  };
}
