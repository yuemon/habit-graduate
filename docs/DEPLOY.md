# Deploying Habit Graduate (web)

One-click browser app, same idea as [Buddy](https://yuemon.github.io/buddy-app/).

Built as an Expo **static SPA** (`web.output: "single"`, Metro). Export output is `dist/` (gitignored; built in CI).

`experiments.baseUrl` is set to `/habit-graduate` for the GitHub Pages project URL.

## A) GitHub Pages (chosen) — `https://yuemon.github.io/habit-graduate/`

Requirements:

1. Repo is **public** (GitHub Pages for user/org project sites).
2. Pages source is **GitHub Actions** (not “Deploy from a branch”).
3. Push to `master` (or run **Deploy GitHub Pages** → *Run workflow*).

Workflow: `.github/workflows/pages.yml`

- `npm ci`
- `npm run web:export` → `expo export --platform web` + `.nojekyll` + `404.html`
- Upload `dist/` and deploy with `actions/deploy-pages`

### First-time / go-live commands

```bash
# From a machine with gh auth as yuemon:
gh repo edit yuemon/habit-graduate --visibility public

# Point Pages at GitHub Actions
gh api -X POST repos/yuemon/habit-graduate/pages \
  -f build_type=workflow \
  -f source[branch]=master \
  -f source[path]=/ || true

# Or: Settings → Pages → Build and deployment → Source: GitHub Actions

git push origin master
# Watch: https://github.com/yuemon/habit-graduate/actions
```

Expected URL: **https://yuemon.github.io/habit-graduate/**

### Local verify before push

```bash
npm run web:export
npm run web:serve
# Open http://localhost:8081/habit-graduate/  (baseUrl is baked into asset paths)
```

Note: `serve` at repo root may need you to open the path that matches how assets are referenced. After deploy, always use the Pages URL above.

## B) Vercel / Netlify (keep GitHub private)

Root hosting does **not** use `/habit-graduate` as a path prefix.

1. In `app.json`, set `"experiments": { "baseUrl": "/" }` **or remove** `experiments.baseUrl`.
2. Build command: `npm run web:export` (or `npx expo export --platform web && node scripts/prepare-web-dist.js`)
3. Output directory: `dist`
4. Framework: Other / None
5. SPA fallback:
   - **Vercel**: rewrite `/(.*)` → `/index.html` (or use `vercel.json` rewrites to `/`)
   - **Netlify**: `public/_redirects` with `/* /index.html 200` (copied into `dist` via `public/`)

Re-export after changing `baseUrl`.

## Why `output: "single"` (not `"static"`)

This app uses React Navigation, not Expo Router. Expo’s `web.output: "static"` prerenders Expo Router routes. `single` emits one `index.html` SPA — correct for static hosts and GitHub Pages.

## `.nojekyll`

Expo puts assets under `_expo/`. GitHub Pages’ Jekyll ignores underscore paths unless `.nojekyll` is present. `public/.nojekyll` is copied on export; `scripts/prepare-web-dist.js` also ensures it exists and copies `index.html` → `404.html` for SPA deep-link fallback.
