import { CanvasTexture, LinearFilter, TextureLoader } from 'three';

function makePlaceholder(index) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext('2d');

  const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  g.addColorStop(0, '#191a1f');
  g.addColorStop(1, '#2b2f37');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

  ctx.fillStyle = 'rgba(243, 194, 132, 0.9)';
  ctx.font = '600 44px "Helvetica Neue", Arial, sans-serif';
  ctx.fillText(`FRAME ${String(index).padStart(2, '0')}`, 64, 96);

  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = '400 24px "Helvetica Neue", Arial, sans-serif';
  ctx.fillText('Photo / Video Placeholder', 64, 140);

  for (let i = 0; i < 60; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const a = Math.random() * 0.18;
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fillRect(x, y, 2, 2);
  }

  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

function loadTexture(loader, file, index) {
  return new Promise((resolve) => {
    loader.load(
      `/media/${file}`,
      (texture) => resolve(texture),
      undefined,
      () => resolve(makePlaceholder(index))
    );
  });
}

export async function loadFrameTextures(files = []) {
  const loader = new TextureLoader();
  const list = files.length ? files : Array.from({ length: 12 }, (_, i) => `photo${i + 1}.jpg`);
  const textures = await Promise.all(
    list.map((file, i) => loadTexture(loader, file, i + 1))
  );

  return textures;
}
