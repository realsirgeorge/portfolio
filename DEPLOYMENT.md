# Deployment

The site runs on **knight-labs** as a Docker compose project named
`george-wanyoike-portfolio`, exposed publicly at
<https://realsirgeorge.knightlabs.co.ke> through the Cloudflare tunnel.

There are two independent paths to production.

## 1. Push-to-deploy (primary)

A bare git repository on the server acts as the deploy target:

```
ssh://real@100.107.100.32:4444/home/real/apps/portfolio.git
```

The `post-receive` hook checks out `main` into
`/home/real/apps/George-Wanyoike-Portfolio` and starts `docker compose up -d
--build` in the background. The push returns immediately; the build log is at
`~/deploy.log` on the server.

One-time local setup:

```bash
git remote add deploy ssh://real@100.107.100.32:4444/home/real/apps/portfolio.git
```

Deploy:

```bash
./scripts/deploy.sh
```

Verify:

```bash
curl -fsS https://realsirgeorge.knightlabs.co.ke/api/health
ssh -p 4444 real@100.107.100.32 'tail -f ~/deploy.log'
```

### What the hook does *not* delete

`content/blog` is a bind mount and is also tracked in git. The hook uses
`git checkout -f`, which overwrites tracked files but leaves untracked files
alone. That means:

- posts uploaded through the admin UI survive a deploy;
- `.env` and `.env.local` are never touched (they are not in git);
- images added only on the server survive too, but will be missing locally.

If you need a clean deploy, do it deliberately, not by adding `git clean` to the
hook.

## 2. Manual deploy

Useful when the git remote is unavailable or you are debugging a build.

```bash
rsync -az --delete \
  --exclude '.git' --exclude 'node_modules' --exclude '.next' \
  --exclude '.env*' --exclude 'content/blog' \
  -e "ssh -p 4444" ./ real@100.107.100.32:apps/George-Wanyoike-Portfolio/

rsync -az -e "ssh -p 4444" ./content/blog/ \
  real@100.107.100.32:apps/George-Wanyoike-Portfolio/content/blog/

ssh -p 4444 real@100.107.100.32 \
  'cd ~/apps/George-Wanyoike-Portfolio && docker compose up -d --build'
```

Back up first:

```bash
ssh -p 4444 real@100.107.100.32 \
  'cd ~/apps && tar czf ~/backups/portfolio-$(date +%Y%m%d-%H%M%S).tar.gz \
   --exclude=node_modules --exclude=.next George-Wanyoike-Portfolio'
```

## 3. GitHub Actions (CI)

`.github/workflows/ci.yml` runs on every push and pull request:

- `npm ci`
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- a production Docker image build (no push)

It uses placeholder build-time secrets only. Deployment is not wired into
GitHub Actions because the server sits behind NAT; the push-to-deploy remote
above is the delivery path. If you later add a self-hosted runner or a Tailscale
OAuth client, add a deploy job that runs `./scripts/deploy.sh`.

Dependabot is configured for npm (weekly, grouped minor/patch) and GitHub
Actions (monthly).

## Secrets

Runtime secrets live only in `/home/real/apps/George-Wanyoike-Portfolio/.env`
and `.env.local` on the server. They are excluded from rsync and from git.
Required values:

| Variable | Purpose |
|---|---|
| `PORT` | Container port (9090) |
| `ADMIN_PASSWORD` | Admin login, minimum 12 characters |
| `SESSION_SECRET` | Session signing, minimum 32 characters |
| `SESSION_DURATION` | Session lifetime in seconds |
| `ADMIN_USER_ID` | Admin username |

Rotate `ADMIN_PASSWORD` and `SESSION_SECRET` by editing `.env.local` and
running `docker compose up -d` (no rebuild needed for env-only changes).

## Rollback

```bash
ssh -p 4444 real@100.107.100.32
cd ~/apps
ls -t ~/backups/portfolio-*.tar.gz | head
mkdir -p /tmp/rollback && tar xzf ~/backups/portfolio-<stamp>.tar.gz -C /tmp/rollback
rsync -a /tmp/rollback/George-Wanyoike-Portfolio/ George-Wanyoike-Portfolio/
cd George-Wanyoike-Portfolio && docker compose up -d --build
```

## Health and logs

```bash
curl -fsS https://realsirgeorge.knightlabs.co.ke/api/health
ssh -p 4444 real@100.107.100.32 'docker logs --tail 100 cyberstories-app'
ssh -p 4444 real@100.107.100.32 'docker compose -f ~/apps/George-Wanyoike-Portfolio/docker-compose.yml ps'
```
