# Deployment

The site runs on **knight-labs** at
<https://realsirgeorge.knightlabs.co.ke>, behind the Cloudflare tunnel.

Production is currently a **prebuilt Node runtime**, not a container. The host
runs a log pipeline that keeps the disk close to 90% iowait; a full
`npm ci` + `next build` there takes tens of minutes and starves every other
service. Building locally and shipping ~35 MB of runtime artifacts is faster,
safer, and leaves the rest of the box alone.

## Current layout

| Piece | Location |
|---|---|
| App source / env | `/home/real/apps/George-Wanyoike-Portfolio` |
| Runtime artifact | `/home/real/apps/George-Wanyoike-Portfolio/.runtime-build` |
| Launcher | `./start-runtime.sh` (sources `.env` + `.env.local`, runs `node .runtime-build/server.js`) |
| Port | `9090` |
| Process log | `/home/real/portfolio.log` |
| Watchdog | user crontab: `@reboot` + health check every 2 minutes |
| Old container | `cyberstories-app` (stopped, kept for rollback) |

The cron watchdog calls `start-runtime.sh`; the script exits early if
`/api/health` already answers, so it can never start a second copy.

## Deploy

From the workstation:

```bash
./scripts/deploy-runtime.sh
```

What it does:

1. `npm run build` locally (standalone output).
2. Assembles `.deploy-runtime/`: `server.js`, `.next/server`, `.next/static`,
   `node_modules`, `public`, `content`.
3. Uploads a ~35 MB tarball over Tailscale.
4. Stops only the process listening on `9090`, moves the old runtime to
   `.runtime-build.old`, extracts the new one, symlinks
   `.runtime-build/content` to the durable source `content/` tree (so admin
   uploads survive deploys), starts it, and polls the public health endpoint.

Failures leave `.runtime-build.old` in place for a one-command rollback.

## Source sync (git)

A bare repo on the server receives pushes:

```
ssh://real@100.107.100.32:4444/home/real/apps/portfolio.git
```

Its `post-receive` hook checks out `main` into the app directory and logs the
event. It deliberately does **not** build or restart anything: a source-only
checkout must never disturb a working runtime. Deployment is the artifact step
above.

One-time local setup:

```bash
git remote add deploy ssh://real@100.107.100.32:4444/home/real/apps/portfolio.git
```

## GitHub Actions (CI)

`.github/workflows/ci.yml` runs on every push and pull request:

- `npm ci`
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- a production Docker image build (no push)

Dependabot is configured for npm (weekly, grouped minor/patch) and GitHub
Actions (monthly).

GitHub Actions does not deploy: the server sits behind NAT and cannot afford to
pull images. If you later add a self-hosted runner on the LAN or a Tailscale
OAuth client, add a final job that runs `./scripts/deploy-runtime.sh`.

## Secrets

Runtime secrets live only in `/home/real/apps/George-Wanyoike-Portfolio/.env`
and `.env.local` on the server. They are excluded from rsync and from git.

| Variable | Purpose |
|---|---|
| `PORT` | Runtime port (9090) |
| `ADMIN_PASSWORD` | Admin login, minimum 12 characters |
| `SESSION_SECRET` | Session signing, minimum 32 characters |
| `SESSION_DURATION` | Session lifetime in seconds |
| `ADMIN_USER_ID` | Admin username |

Rotate `ADMIN_PASSWORD` and `SESSION_SECRET` by editing `.env.local`, then
restarting the runtime:

```bash
ssh -p 4444 real@100.107.100.32 \
  'pid=$(ss -ltnp | grep :9090 | grep -o "pid=[0-9]*" | cut -d= -f2); kill $pid'
ssh -p 4444 real@100.107.100.32 \
  '~/apps/George-Wanyoike-Portfolio/start-runtime.sh >/dev/null 2>&1 &'
```

The cron watchdog restarts it within two minutes if you only kill it.

## Health and logs

```bash
curl -fsS https://realsirgeorge.knightlabs.co.ke/api/health
ssh -p 4444 real@100.107.100.32 'tail -50 ~/portfolio.log'
ssh -p 4444 real@100.107.100.32 'ss -ltnp | grep 9090'
```

## Rollback

```bash
ssh -p 4444 real@100.107.100.32
cd ~/apps/George-Wanyoike-Portfolio
pid=$(ss -ltnp | grep :9090 | grep -o 'pid=[0-9]*' | cut -d= -f2); kill "$pid"
rm -rf .runtime-build.bad
mv .runtime-build .runtime-build.bad
mv .runtime-build.old .runtime-build
./start-runtime.sh >~/portfolio.log 2>&1 &
```

To fall back to the last Docker image instead:

```bash
# stop the host runtime first, or the port will conflict
pid=$(ss -ltnp | grep :9090 | grep -o 'pid=[0-9]*' | cut -d= -f2); kill "$pid"
docker start cyberstories-app
```

## Docker path (legacy / fallback)

`Dockerfile` and `docker-compose.yml` still work on a host with spare I/O:

```bash
cd ~/apps/George-Wanyoike-Portfolio
docker compose up -d --build
```

`Dockerfile.prebuilt` + `scripts/build-runtime.sh` are the escape hatch used for
the current deployment; they package the standalone output without running npm
on the server.

Back up before large changes:

```bash
ssh -p 4444 real@100.107.100.32 \
  'cd ~/apps && tar czf ~/backups/portfolio-$(date +%Y%m%d-%H%M%S).tar.gz \
   --exclude=node_modules --exclude=.next --exclude=.runtime-build \
   George-Wanyoike-Portfolio'
```
