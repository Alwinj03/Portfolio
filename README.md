# Portfolio OS — Engineering Intelligence for Living Systems

A content-driven personal **operating system** — not a portfolio — for research,
projects, papers, and ideas at the intersection of **AI, biotechnology and
engineering**. Built to feel like a hybrid of Apple, OpenAI, Anthropic, Linear
and DeepMind: cinematic, elegant, and memorable.

> **The core promise:** you never edit React. You only add Markdown/MDX files.
> Drop `content/projects/new-thing.mdx` and it automatically becomes a page, a
> card, a search result, a sitemap entry, and (where relevant) a timeline item.

---

## Tech stack

| Layer         | Choice                                                        |
| ------------- | ------------------------------------------------------------- |
| Framework     | **Next.js 15** (App Router, RSC) + **TypeScript**             |
| Styling       | **Tailwind CSS** + shadcn-style primitives, glassmorphism     |
| Content       | **Velite** — type-safe MDX → data at build time               |
| Motion        | **Framer Motion**, **GSAP**-ready, **Lenis** smooth scroll    |
| 3D            | **Three.js** + **React Three Fiber** (hero particle field)    |
| Search        | **cmdk** command palette (⌘K) over an auto-generated index    |
| SEO           | Native Metadata API, OpenGraph, Twitter cards, JSON-LD        |
| Feeds         | `sitemap.xml`, `robots.txt`, `rss.xml`, PWA `manifest`        |
| Theming       | `next-themes` — dark + light                                  |

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build (runs Velite automatically)
npm run start        # serve the production build
npm run content      # regenerate content data only (Velite)
npm run typecheck    # tsc --noEmit
```

## How it works (the content engine)

1. Every folder in [`content/`](./content) maps to a **collection** defined in
   [`velite.config.ts`](./velite.config.ts).
2. On `dev`/`build`, Velite validates each `.mdx` file's frontmatter, compiles
   the body, and emits typed JSON into `.velite/`.
3. [`src/lib/content.ts`](./src/lib/content.ts) is the single access layer —
   sorting, filtering, related content, stats, and the search index all come
   from here.
4. UI components read from that layer. **The UI never changes; only content
   does.**

Adding a file to a collection automatically produces:

- A **detail page** at `/<collection>/<slug>` (for page-type collections)
- A **card** in the matching home-page section
- A **search entry** in the ⌘K command palette
- A **sitemap** URL + optional **RSS** item
- **SEO** metadata (OpenGraph, Twitter, JSON-LD)
- **Related content** links (by shared tags)

See **[docs/CONTENT.md](./docs/CONTENT.md)** for the full frontmatter reference
and copy-paste templates, and **[docs/ANIMATIONS.md](./docs/ANIMATIONS.md)** for
the motion system.

## Project structure

```
content/                 ← YOU LIVE HERE (just add .mdx files)
  about/ education/ research/ projects/ achievements/
  leadership/ whitepapers/ tools/ gallery/ timeline/ blog/ experience/
public/
  images/                ← put cover / gallery images here, reference as /images/..
  icon.svg
src/
  app/
    layout.tsx           ← root shell, metadata, fonts
    page.tsx             ← the single-scroll home (composes all sections)
    [collection]/[slug]/ ← auto detail pages for every MDX file
    sitemap.ts robots.ts manifest.ts rss.xml/
  components/
    sections/            ← one file per website section
    cards/  ui/  three/  layout/
    command-palette.tsx  mdx.tsx  providers.tsx
  lib/
    content.ts           ← the content access layer
    site.ts              ← global config (name, links, nav) — the only knob file
    utils.ts
velite.config.ts         ← collection schemas
```

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new) — framework preset **Next.js**
   is detected automatically. No build settings needed.
3. Set the environment variable **`NEXT_PUBLIC_SITE_URL`** to your final domain
   (used for absolute SEO/OG/sitemap URLs).
4. Deploy. That's it — everything is statically generated.

The build runs Velite automatically via `next.config.mjs`, so no extra step is
required in CI.

## Customization

- **Identity & links:** [`src/lib/site.ts`](./src/lib/site.ts) — name, email,
  social links, nav, resume path.
- **Colors & theme:** CSS variables in
  [`src/app/globals.css`](./src/app/globals.css) (light + dark).
- **Resume:** drop `public/resume.pdf`.
- **Images:** drop files in `public/images/` and reference `/images/name.jpg` in
  frontmatter (`cover`, `gallery`).

## Performance & accessibility

- Three.js is dynamically imported and disabled on small screens / reduced-motion.
- All animations respect `prefers-reduced-motion`.
- Images are lazy-loaded; pages are statically pre-rendered.
- Semantic landmarks, keyboard-accessible palette (⌘K) and controls.

## Easter eggs

- **⌘K / Ctrl-K** — command palette search.
- **Konami code** (↑↑↓↓←→←→ B A) — toggles "lab mode".
- Hero particle field morphs between a **DNA helix** and a **neural network**.

---

Built as a living system. Replace the template MDX in `content/` with your own,
and it's yours. The current content is clearly-marked **TEMPLATE** text — safe to
delete and replace.
