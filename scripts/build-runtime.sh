#!/usr/bin/env bash
# Assemble a self-contained runtime directory from the Next.js standalone
# build. Pair with Dockerfile.prebuilt on hosts where a full image build is too
# expensive (no npm install, no Next compile on the server).
#
#   ./scripts/build-runtime.sh
#   rsync -az .deploy-runtime/ server:.../.runtime-build/
#   docker build -f .runtime-build/Dockerfile -t <image> .runtime-build
set -euo pipefail

cd "$(dirname "$0")/.."

OUT=".deploy-runtime"

echo "→ building Next.js (standalone output required)"
npm run build

echo "→ assembling $OUT"
rm -rf "$OUT"
mkdir -p "$OUT"

cp -a .next/standalone/. "$OUT/"
mkdir -p "$OUT/.next"
cp -a .next/static "$OUT/.next/static"
mkdir -p "$OUT/public"
cp -a public/. "$OUT/public/"
mkdir -p "$OUT/content"
cp -a content/. "$OUT/content/"
cp Dockerfile.prebuilt "$OUT/Dockerfile"

# The standalone server only needs these at runtime; trim obvious build fat.
rm -rf "$OUT/.next/cache"

echo "→ size: $(du -sh "$OUT" | cut -f1)"
echo "done. next:"
echo "  rsync -az $OUT/ real@<host>:<app>/.runtime-build/"
echo "  ssh real@<host> 'cd <app> && docker build -f .runtime-build/Dockerfile -t <image> .runtime-build'"
echo "  ssh real@<host> 'cd <app> && docker compose up -d --no-build'"
