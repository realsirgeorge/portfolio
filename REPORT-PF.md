# REPORT-PF: portfolio redesign (realsirgeorge.knightlabs.co.ke)

Status: built and verified locally. Nothing was committed or deployed.

## What changed
- **Design:** a new ink-and-paper palette with one verdigris accent. There are light and dark themes; the default follows the system setting and there is a toggle.
- **Fonts:** self-hosted OFL fonts in `app/fonts/` (licences included), loaded with `next/font/local`: Newsreader for display, IBM Plex Sans for text and IBM Plex Mono for mono. The Google Fonts CDN is gone.
- **Layout and motion:** an editorial layout with hairline rules and numbered sections. Motion is limited to CSS-only rise and scroll reveals, all turned off under `prefers-reduced-motion`.
- **Terminal:** kept and restyled as a fixed dark panel. It respects reduced motion and has new `knightlabs` and `open knight-labs` commands.
- **Navigation and footer:** now in the root layout. The mobile menu sets aria-expanded, closes on Escape and locks scrolling. The skip link, focus rings and `aria-current` are in place.
- **New page `/knight-labs`:** sectors, the five service lines, the four tiers (no prices), principles, and the Quick-Start CTA plus `hello@knightlabs.co.ke`, with Organization JSON-LD.
- **Home:** hero, proof points, practice, selected work, a Knight Labs band, roles, recent writing, and two routes in ("organisations go to Knight Labs", "everything else comes here").
- **About:** rewritten as a five-chapter story, capabilities, "How I work", community and practice, and credentials.
- **Work and case studies, Lab, Library:** restyled. Audit case studies now have a Knight Labs CTA. Resume data moved to `lib/resume-data.ts` and a Knight Labs founder entry was added.
- **Contact:** the fake contact form (it submitted nowhere) and the placeholder PGP fingerprint are removed. Business enquiries go to Knight Labs; personal channels are listed separately.
- **Blog:** listing and posts are now server-rendered (SEO), with query-string filter and search and BlogPosting JSON-LD. Pages render per request, so admin uploads and deletes show immediately (before this, SSG kept deleted posts live).
- **Drafts:** frontmatter `draft: true` hides a post publicly; the admin still lists it.
- **New draft post** (hidden): `content/blog/kenya-dpa-sacco-it-team.md`.
- **SEO:** metadata and canonicals, OG and Twitter tags, `/opengraph-image`, dynamic `/sitemap.xml`, and `/robots.txt` (disallows `/admin` and `/api/`). `metadataBase` was the wrong domain; it now uses `NEXT_PUBLIC_SITE_URL`, defaulting to `https://realsirgeorge.knightlabs.co.ke`.
- **Person JSON-LD** with `worksFor` set to Knight Labs. New 404 page.
- **Removed:** `@vercel/analytics` (a tracker that also 404s when self-hosted; the lockfile URLs are all registry.npmjs.org), unused components, and `.cursor/debug.log`.

## Security (admin review)
Fixed:
1. **Sessions never expired on the server, and logout did nothing.** The token is now `id.exp.HMAC`, with the expiry checked on every request and an in-memory revocation on logout. Cookies stay HttpOnly, SameSite=Strict, and Secure in production.
2. **No login throttling.** Now limited to 5 failures per IP per 15 minutes, then the server returns 429.
3. **Password comparison leaked the length.** It now compares HMACs with timingSafeEqual.
4. **Debug beacons.** `app/admin/page.tsx` was POSTing preview data to `127.0.0.1:7242` (Cursor agent logging). Removed.
5. **`/api/admin/template` was unauthenticated.** It now requires a session.
6. **Admin dashboard gating.** `proxy.ts` now redirects `/admin` to login without a valid session. Admin pages are noindex/no-store, and the public "Admin" link is removed.
7. **Uploads over 5 MB are rejected** before the file is read.

Headers: CSP (self only, `frame-ancestors 'none'`, `object-src 'none'`), HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP and CORP. X-Powered-By is off.
- `script-src` still needs `'unsafe-inline'` for the Next.js bootstrap and the next-themes pre-paint script. Nonces would make every page dynamic.
- `img-src` allows `https:` because one post embeds remote images.

Not changed:
- The revocation list and rate limiter are per process and reset on restart.
- `x-forwarded-for` can be spoofed if the origin port is reached directly rather than through Cloudflare.
- The upload XSS regexes are crude. Markdown is rendered without raw HTML, so there is no stored XSS.
- There is a single shared admin password with no MFA.

## Routes
`/`, `/work`, `/work/[slug]` (10, static), `/knight-labs`, `/about`, `/blog` (dynamic), `/blog/[slug]` (dynamic), `/infrastructure`, `/library`, `/resume`, `/contact`, `/admin`, `/admin/login`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, and the APIs `/api/admin/*`, `/api/blog/*` and `/api/health`.

Redirects: `/projects`, `/skills`, `/knightlabs` and `/writing`. Home and About revalidate every 5 minutes.

## Build and run
The project uses npm: the Dockerfile runs `npm ci --include=dev`, and `pnpm-lock.yaml` is an empty stub.
```
npm ci --include=dev   # locally: --registry=https://registry.npmmirror.com
ADMIN_PASSWORD=... SESSION_SECRET=<32+ chars> SESSION_DURATION=86400 npm run build
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/ && cp -r content .next/standalone/
PORT=3025 node .next/standalone/server.js
```
Docker is unchanged: `docker compose up -d --build`.

## Verification
- **Build:** the production build passed.
- **Routes:** run on the local standalone server. Every route returned 200, except the draft post (404, intended) and `/admin` (307 without a session).
- **Admin flow:** login, a draft visible in the admin list, a tampered expiry gives 401, a token reused after logout gives 401, and the 6th bad password gives 429.
- **Browser check:** headless Chromium crawl of 14 routes. There were no console errors and no overflow at 390 px. Four screenshots were reviewed (light and dark, mobile and desktop).
- **After the build:** two tiny edits (terminal word-wrap, and the top margin on a post's first heading). `tsc` passes, but these are not yet in a production build.

## Deployment notes
- **`content/blog` is a runtime volume.** No post was deleted or renamed. To stage the new draft on the server, copy `kenya-dpa-sacco-it-team.md` into the volume; it stays hidden until `draft: true` is removed.
- **Environment variables** are unchanged: `ADMIN_PASSWORD`, `SESSION_SECRET` (32 or more characters), `SESSION_DURATION`, optional `ADMIN_USER_ID`, plus `PORT` and `HOSTNAME`. There is one new, optional variable, `NEXT_PUBLIC_SITE_URL`, which is read at build time.
- **Admins must log in again after deploy**, because the token format changed.

## TODO(owner)
1. `lib/portfolio-data.ts`: confirm `george@knight-labs.co` is still live. The site now shows realsirgeorge@gmail.com for personal mail and hello@knightlabs.co.ke for business.
2. `lib/resume-data.ts`: the month and year Knight Labs was founded.
3. `lib/resume-data.ts`: the Anga Networks start date. The site says April 2024; the CV says January 2024.
4. `lib/resume-data.ts`: the NACOSTI end date. The site says January 2026; the CV says December 2025.
5. `app/about/page.tsx`: talks or community roles. There are none in the repo, so no Speaking section is shown.
6. `app/library/page.tsx`: a reading list, if wanted.
7. `app/contact/page.tsx`: a real PGP key, if you have one.
8. Review the draft DPA post (check the statutory points), then remove `draft: true`.

## Known gaps
- The CV PDF is outdated: it has an old email and no Knight Labs.
- The admin UI was cleaned, not redesigned. Drafts are not badged there.
- `/api/blog/*` is no longer used by the pages and is kept for compatibility.
- `lib/knight-labs.ts` mirrors the Knight Labs `catalogue.ts`. Keep the two in sync.
