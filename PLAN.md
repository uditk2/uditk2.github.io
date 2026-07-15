# uditk2.github.io — Site Plan

A futuristic, single-page **brochure** for Udit Khandelwal. Purpose: showcase who Udit is
and the kind of work he does, open the door to collaborations, and surface his writing/notes.
Hosted at `https://uditk2.github.io` via GitHub Pages (GitHub Actions deploy).

---

## 1. Positioning (the call, and why)

**Lead identity: Founder + Versatile Engineer-Builder** — *"A 15-year engineer who now
founds and ships."*

Why this over a pure "AI Builder":
- "AI builder" is the single most crowded label on the internet right now. It signals *trend*,
  not *depth*. Udit's edge is that he has both.
- The differentiated, hard-to-fake story is **range + tenure + shipping velocity**: Principal
  Engineer at Microsoft, SDE at Amazon (Alexa, Prime, Transportation), Palo Alto Networks,
  Flipkart — *and* a founder (Seerly) building AI-native product — *and* someone who ships a
  playable AR game in a weekend. Very few people credibly hold all three.
- For every audience that matters here, "Founder + versatile builder" sells better:
  - **Investors / partners** want a founder who can actually build and has enterprise judgment.
  - **Prospective collaborators / hires** want range and shipping speed.
  - **Seerly customers** want to trust the person behind the product.
- AI is then the *current headline act* within that story (Seerly, agents, GEO) — front and
  center, but framed as the latest thing a proven builder is doing, not the whole identity.

So: **Founder-builder as the frame, AI/Seerly as the current spotlight, the corporate pedigree
as the credibility spine, and the games/experiments as living proof of shipping velocity.**

## 2. Audience
1. Founders, operators, and marketers evaluating Seerly / AI-visibility work.
2. Potential collaborators, co-builders, advisors, and hires.
3. Recruiters / partners scanning the enterprise track record.
4. Indie/maker community drawn in by the AR games and experiments.

## 3. Voice
Direct, builder-first, lightly contrarian, no fluff. Mirrors Udit's own LinkedIn/X voice:
*"capability isn't the bottleneck anymore — taste and the willingness to start are."*

## 4. Design direction (futuristic, JS-driven, no extra hardware)
- **Aesthetic:** deep-space dark canvas, neon-cyan → violet gradient accents, glassmorphism
  cards, thin mono labels, generous whitespace, subtle grain.
- **Signature animations (all lightweight canvas/CSS/JS, `prefers-reduced-motion` respected):**
  - Animated starfield / particle constellation hero (2D canvas, capped DPR, pauses off-screen).
  - Gradient aurora that drifts behind the hero.
  - Scroll-reveal (IntersectionObserver) fade/rise on sections.
  - Magnetic / tilt hover on work cards.
  - Typed-rotator tagline ("Founder", "Principal Engineer", "AR game maker", "AI tinkerer").
- **Picture-in-picture guided tour:** a dismissible floating PiP panel ("Take the tour") that
  glides through the page, auto-scrolling and spotlighting each section with a one-line pitch —
  the "tour in picture" the brief asked for. Fully optional, keyboard-dismissible.
- **Performance guardrails:** no external image/video downloads required; particle count scales
  to viewport; animation loop halts when tab hidden; all vector/CSS so it stays crisp and light.

## 5. Structure (single page, anchored nav)
1. **Hero** — name, rotating role tagline, one-line mission, primary CTAs (Collaborate, Seerly,
   Play a game), animated constellation backdrop, floating PiP tour launcher.
2. **About / Snapshot** — 3-4 sentence story of the founder-builder arc; quick stat chips
   (15+ yrs, ex-Microsoft/Amazon, NITW, 4+ shipped products).
3. **What I do / How I work** — three pillars: *Build AI-native products*, *Ship fast &
   end-to-end*, *Bring enterprise-grade depth*. Each with a short proof line.
4. **Selected work** (the core, card grid):
   - **Seerly** — AI visibility / GEO platform (flagship). → seerly.app
   - **SlayFit** — webcam AR fitness games, no install/headset. → slayfit.fun
   - **Temple Collapse** — 3D maze-runner, going to CrazyGames.
   - **AI / ML experiments** — agents, SLM-RL extraction, VLM playground, transformer study.
   - **Quant / markets** — India trading system design, backtesting, Bank Nifty studies.
   - **Enterprise track record** — condensed Microsoft / Amazon / PAN / Flipkart timeline.
5. **Writing / Field notes** — curated brochure section (NOT a full blog engine). 2-3 short
   pieces adapted from Udit's real material: the "weekend AR game / capability isn't the
   bottleneck" essay, a GEO/AI-visibility take, and a D2C-organic-traffic note. Each is a
   card linking to an on-page reader or external post.
6. **Collaborate / Contact** — clear "open to" line, email (uditk2@gmail.com), LinkedIn, GitHub,
   and Seerly links. Strong closing CTA.
7. **Footer** — minimal, built-in-the-open note, year.

## 6. Tech
- Single `index.html` + `assets/style.css` + `assets/main.js` (+ small JSON/inline data).
- Zero framework, zero build step — pure static, GitHub-Pages-native.
- Vanilla JS: canvas particles, IntersectionObserver reveals, tour controller, typed rotator.
- `.nojekyll` so Pages serves files as-is.
- SEO/meta: Open Graph + Twitter cards, title, description, favicon (inline SVG), JSON-LD Person.

## 7. Deployment (GitHub Actions → Pages)
- `.github/workflows/deploy.yml` using `actions/upload-pages-artifact` + `actions/deploy-pages`
  on push to `main` (and manual `workflow_dispatch`).
- Repo `uditk2.github.io` → Pages source set to **GitHub Actions**.
- Flow: build files → commit/push to `main` → Action runs → live at uditk2.github.io.

## 8. Out of scope (v1)
- CMS / dynamic blog backend, contact-form backend, analytics beyond a lightweight tag,
  AI-generated hero art/video (can be layered in later; v1 is fully code-drawn).
