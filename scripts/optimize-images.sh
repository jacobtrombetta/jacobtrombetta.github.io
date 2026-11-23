#!/usr/bin/env bash
# Resize and recompress images for the web, in place.
#
#   scripts/optimize-images.sh assets/img/jt/new-photo.jpg   # some files
#   scripts/optimize-images.sh                               # everything in assets/img
#
# - Longest side capped at 1500px (the content column is 750px wide, so this
#   covers 2x/retina screens). Smaller images are never enlarged.
# - JPEG quality 80, progressive, 4:2:0 chroma, metadata stripped.
# - Display P3 / other color profiles are converted to sRGB first, so colors
#   don't shift when the profile is stripped.
# - A file is only replaced if the result is at least 10% smaller, so running
#   this twice does nothing.
#
# Needs ImageMagick (brew install imagemagick). macOS only (uses the system
# sRGB profile).
set -euo pipefail

MAX=1500
QUALITY=80
SRGB="/System/Library/ColorSync/Profiles/sRGB Profile.icc"

cd "$(dirname "$0")/.."
command -v magick >/dev/null || { echo "ImageMagick not found: brew install imagemagick" >&2; exit 1; }

if [ $# -eq 0 ]; then
  files=()
  while IFS= read -r -d '' f; do files+=("$f"); done < <(find assets/img -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0)
  set -- "${files[@]}"
fi

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT
before_total=0
after_total=0

for f in "$@"; do
  ext=$(printf '%s' "${f##*.}" | tr '[:upper:]' '[:lower:]')
  out="$tmpdir/out.$ext"
  profile=$(magick identify -format '%[profile:icc]' "$f[0]" 2>/dev/null || true)
  convert_profile=()
  note=""
  if [ -n "$profile" ] && [[ "$profile" != sRGB* ]]; then
    convert_profile=(-profile "$SRGB")
    note="  ($profile -> sRGB)"
  fi

  if [ "$ext" = png ]; then
    magick "$f" -auto-orient ${convert_profile[@]+"${convert_profile[@]}"} -resize "${MAX}x${MAX}>" -strip \
      -define png:compression-level=9 "$out"
  else
    magick "$f" -auto-orient ${convert_profile[@]+"${convert_profile[@]}"} -resize "${MAX}x${MAX}>" -strip \
      -sampling-factor 4:2:0 -interlace Plane -quality "$QUALITY" "$out"
  fi

  before=$(stat -f %z "$f")
  after=$(stat -f %z "$out")
  before_total=$((before_total + before))
  if [ $((after * 10)) -lt $((before * 9)) ]; then
    mv "$out" "$f"
    after_total=$((after_total + after))
    printf '%6dK -> %5dK  %s%s\n' $((before / 1024)) $((after / 1024)) "$f" "$note"
  else
    after_total=$((after_total + before))
  fi
done

printf 'Total: %dK -> %dK\n' $((before_total / 1024)) $((after_total / 1024))
