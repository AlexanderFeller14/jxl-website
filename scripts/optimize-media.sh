#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MEDIA_DIR="$ROOT_DIR/public/media"
OUT_ROOT="$MEDIA_DIR/optimized"
OUT_MAIN_SMALL="$OUT_ROOT/main-900"
OUT_MAIN_LARGE="$OUT_ROOT/main-1800"
OUT_THUMB="$OUT_ROOT/thumb-360"

if ! command -v sips >/dev/null 2>&1; then
  echo "Error: 'sips' is required for media optimization on macOS."
  exit 1
fi

if [[ ! -d "$MEDIA_DIR" ]]; then
  echo "Error: media directory not found at $MEDIA_DIR"
  exit 1
fi

mkdir -p "$OUT_MAIN_SMALL" "$OUT_MAIN_LARGE" "$OUT_THUMB"

build_variant() {
  local source="$1"
  local output="$2"
  local max_width="$3"
  local quality="$4"

  if [[ -f "$output" && "$output" -nt "$source" ]]; then
    return
  fi

  local src_width
  src_width="$(sips -g pixelWidth "$source" | awk '/pixelWidth/ { print $2; exit }')"
  if [[ -z "$src_width" ]]; then
    return
  fi

  local target_width="$max_width"
  if (( src_width < max_width )); then
    target_width="$src_width"
  fi

  sips \
    --resampleWidth "$target_width" \
    -s format jpeg \
    -s formatOptions "$quality" \
    "$source" \
    --out "$output" >/dev/null
}

count=0
while IFS= read -r -d '' source; do
  base_name="$(basename "$source")"

  case "$base_name" in
    README.md|logo-jxl.png|logo-jxl-source.png)
      continue
      ;;
  esac

  build_variant "$source" "$OUT_MAIN_SMALL/$base_name" 900 82
  build_variant "$source" "$OUT_MAIN_LARGE/$base_name" 1800 86
  build_variant "$source" "$OUT_THUMB/$base_name" 360 74
  ((count += 1))
done < <(
  find "$MEDIA_DIR" -maxdepth 1 -type f \
    \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) \
    -print0
)

echo "Optimized media files: $count"
du -sh "$OUT_ROOT"
