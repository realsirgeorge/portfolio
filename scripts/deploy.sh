#!/usr/bin/env bash
# Deploy the portfolio to knight-labs.
#
# The server hosts a bare git repo at ~/apps/portfolio.git with a post-receive
# hook that checks out main into ~/apps/George-Wanyoike-Portfolio and rebuilds
# the Docker compose project. Pushing is deploying.
#
# Usage:
#   ./scripts/deploy.sh            # push main to the deploy remote
#   REMOTE=origin ./scripts/deploy.sh
set -euo pipefail

REMOTE="${REMOTE:-deploy}"
BRANCH="${BRANCH:-main}"

if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
  echo "error: git remote '$REMOTE' is not configured." >&2
  echo "add it with: git remote add deploy ssh://real@100.107.100.32:4444/home/real/apps/portfolio.git" >&2
  exit 1
fi

echo "→ pushing $BRANCH to $REMOTE"
git push "$REMOTE" "$BRANCH"

echo
echo "Build runs in the background on the server."
echo "  watch:  ssh -p 4444 real@100.107.100.32 'tail -f ~/deploy.log'"
echo "  health: curl -fsS https://realsirgeorge.knightlabs.co.ke/api/health"
