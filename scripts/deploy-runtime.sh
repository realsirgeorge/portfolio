#!/usr/bin/env bash
# Deploy the prebuilt Next.js runtime to knight-labs.
#
# Why not `docker compose build`? The host runs a log pipeline that keeps the
# disk at ~90% iowait; a full npm install + Next build there takes tens of
# minutes and starves every other service. Building locally and shipping ~35MB
# of runtime artifacts is faster and safer.
#
# Usage: ./scripts/deploy-runtime.sh
set -euo pipefail

cd "$(dirname "$0")/.."

REMOTE="${REMOTE:-real@100.107.100.32}"
SSH_PORT="${SSH_PORT:-4444}"
APP="${APP:-/home/real/apps/George-Wanyoike-Portfolio}"
SITE="${SITE:-https://realsirgeorge.knightlabs.co.ke}"
TARBALL="$(mktemp -t portfolio-runtime.XXXXXX.tar.gz)"

cleanup() { rm -f "$TARBALL"; }
trap cleanup EXIT

echo "→ build runtime"
./scripts/build-runtime.sh >/dev/null

echo "→ package"
tar -czf "$TARBALL" -C .deploy-runtime .

echo "→ upload ($(du -h "$TARBALL" | cut -f1))"
scp -P "$SSH_PORT" -o BatchMode=yes "$TARBALL" "$REMOTE:$APP/runtime-next.tar.gz"

echo "→ swap and restart"
ssh -p "$SSH_PORT" -o BatchMode=yes "$REMOTE" APP="$APP" 'bash -s' <<'REMOTE_SCRIPT'
set -euo pipefail
cd "$APP"

pid=$(ss -ltnp 2>/dev/null | grep ':9090' | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2 || true)
if [ -n "$pid" ]; then
  kill "$pid" || true
  sleep 2
fi

rm -rf .runtime-build.old
if [ -d .runtime-build ]; then mv .runtime-build .runtime-build.old; fi
mkdir .runtime-build
tar xzf runtime-next.tar.gz -C .runtime-build
rm -f runtime-next.tar.gz

nohup setsid ./start-runtime.sh > "$HOME/portfolio.log" 2>&1 < /dev/null &
REMOTE_SCRIPT

echo "→ health check"
for attempt in $(seq 1 30); do
  if curl -fsS -m 5 "$SITE/api/health" >/dev/null 2>&1; then
    echo "live: $SITE"
    exit 0
  fi
  sleep 2
done

echo "error: health check did not pass; inspect ~/portfolio.log on the server" >&2
exit 1
