# uditk2.github.io

Personal brochure site for **Udit Khandelwal** — founder, engineer-builder, eternal learner.
Futuristic single-page site, hand-coded (no frameworks, no build step), deployed to GitHub Pages
via GitHub Actions.

## Structure
```
index.html              # the whole page (semantic, SEO + OG meta, JSON-LD)
assets/style.css        # futuristic theme, animations, responsive, reduced-motion
assets/main.js          # constellation canvas, reveals, tilt, typed rotator, PiP tour
assets/og.svg           # social share image
.github/workflows/deploy.yml   # Actions → GitHub Pages
.nojekyll robots.txt sitemap.xml
PLAN.md                 # the content + design plan
```

## Local preview
Any static server works, e.g.:
```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy (GitHub Actions → Pages)
1. Push this repo to `https://github.com/uditk2/uditk2.github.io` on the `main` branch.
2. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow deploys on every push to `main` (or run it manually from the **Actions** tab →
   *Deploy to GitHub Pages* → **Run workflow**).
4. Live at **https://uditk2.github.io**.

### First push
```bash
cd uditk2.github.io
git init
git add .
git commit -m "Launch personal brochure site"
git branch -M main
git remote add origin https://github.com/uditk2/uditk2.github.io.git
git push -u origin main
```

## Notes
- All visuals are drawn in code (canvas/CSS/SVG) — no external image/video downloads, no extra
  hardware needed. AI-generated hero art/video can be layered in later without changing structure.
- Honors `prefers-reduced-motion`.
