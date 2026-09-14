# Soubhik Chakraborty — Portfolio

Interactive data-engineering portfolio. Ethereal-glass dark theme, Vite + React, zero backend. Deploys anywhere static.

## Run locally

```bash
cd portfolio
npm install
npm run dev
```

## Deploy — Vercel (recommended, free)

1. Push this `portfolio/` folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → Add New → Project → import the repo.
3. Framework preset: **Vite**. Build command: `npm run build`. Output: `dist`.
4. Deploy. Done — `vercel.json` already handles SPA rewrites.

## Deploy — GitHub Pages (free)

**Option A — one command (uses `gh-pages` branch):**
```bash
npm run deploy
```
Then in GitHub → repo Settings → Pages → Source: `gh-pages` branch, `/ (root)`.

**Option B — GitHub Actions (auto-deploy on push):**
The workflow at `.github/workflows/deploy.yml` builds and publishes `dist/` on every push to `main`. Just push, then set Pages source to **GitHub Actions**.

## Hidden admin panel (owner only, invisible to visitors)
Tweak copy, links, section visibility, accent theme and defaults from the frontend. Stored in the browser via localStorage, with JSON export/import and reset.

- Unlock: `Ctrl/⌘ + Shift + A`, or visit `#admin`, or triple-click the footer name.
- No button or link to it exists anywhere in the UI.

## SEO

- Semantic headings, meta + Open Graph + Twitter tags, JSON-LD `Person` schema, `robots.txt`.
- After deploying, put your real domain in `public/sitemap.xml` (replacing `example.com`) and submit it in Search Console.

## Resume

`public/Soubhik-Chakraborty-Resume.pdf` ships with the site. Download buttons live in the hero, overlay menu, contact section and footer, plus an in-browser preview modal.

## What's inside

- Fit-to-screen hero with live typewriter + clickable mini-terminal card
- Filterable showcase: web apps, Python automations, FMCG usecases
- Colored tech-logo strip (vendored SVGs in `public/icons`: Python, Django, SAP, Fabric, Power BI, T-SQL, Azure, Excel, Teams, SharePoint, Power Apps, Power Automate, Redshift; org logos in `public/logos`)
- 🎮 Playground: Pipeline Panic game, Deploy Roulette, Data Quiz, Excuse Generator, Gravity Pit (Matter.js physics with draggable logo bodies)
- 📊 Funny widgets: Excel-export incident counter, Time-to-trust meter
- 🥚 Easter eggs: Konami code party mode, secret terminal (press `` ` ``, try `sudo hire`), console jokes, clickable name
- Compact approach rows, track record with org logos, rotating quote line, contact CTA

## Fonts (3 families + system mono)

Clash Display (headings), Satoshi (body), EB Garamond Italic (accents), system monospace (terminal/logs).

## Updating content (dynamic data)

- Edit `src/data.js` — projects, jobs, quiz, excuses, stack, quotes all live there in plain structures.
- Or use the hidden admin panel and Export JSON as backup; Import it on another device.
- Performance: the Matter.js physics engine loads as a separate lazy chunk only when the Gravity Pit tab opens; canvases clean up on unmount.
