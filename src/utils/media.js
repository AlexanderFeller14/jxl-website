const MEDIA_ROOT = '/media';
const OPTIMIZED_ROOT = `${MEDIA_ROOT}/optimized`;

function encodeMediaFile(file) {
  return encodeURIComponent(String(file || '').trim()).replace(/%2F/g, '/');
}

export function createOriginalMediaPath(file) {
  return `${MEDIA_ROOT}/${encodeMediaFile(file)}`;
}

export function createMainImagePath(file) {
  return `${OPTIMIZED_ROOT}/main-1800/${encodeMediaFile(file)}`;
}

export function createMainImagePathSmall(file) {
  return `${OPTIMIZED_ROOT}/main-900/${encodeMediaFile(file)}`;
}

export function createThumbImagePath(file) {
  return `${OPTIMIZED_ROOT}/thumb-360/${encodeMediaFile(file)}`;
}

export function createMainImageSrcSet(file) {
  return `${createMainImagePathSmall(file)} 900w, ${createMainImagePath(file)} 1800w`;
}

export function createThumbImageSrcSet(file) {
  return `${createThumbImagePath(file)} 360w`;
}
