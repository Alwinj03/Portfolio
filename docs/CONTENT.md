# Adding content

Everything on this site is an `.mdx` file in [`content/`](../content). You never
touch React. This guide is the full reference.

## The golden rule

> **Filename → slug → URL.** A file at `content/projects/syntorch.mdx` becomes
> the page `/projects/syntorch`, a card in the Projects section, a ⌘K search
> entry, a sitemap URL, and a related-content candidate — automatically.

To add anything, copy a template below into the right folder, edit the
frontmatter, write Markdown under it, and save. In `npm run dev` it appears live.

## Folders → sections

| Folder                 | Section on site      | Has detail page? |
| ---------------------- | -------------------- | ---------------- |
| `about/`               | About                | no (inline)      |
| `education/`           | Education timeline   | yes              |
| `research/`            | Research grid        | yes              |
| `projects/`            | Projects grid        | yes              |
| `achievements/`        | Achievements (expand)| yes              |
| `leadership/`          | Leadership           | yes              |
| `whitepapers/`         | White Papers         | yes              |
| `tools/`               | Tools (coming soon)  | yes              |
| `experience/`          | Experience           | yes              |
| `gallery/`             | Gallery (masonry)    | no               |
| `timeline/`            | Life timeline        | no               |
| `blog/`                | Writing              | yes              |

## Frontmatter reference

Every field is **optional except `title`**. Unknown fields are ignored, so you
can't break the build by adding extra keys.

```yaml
---
title: Required — the headline
subtitle: One-line supporting sentence (shown on cards + detail pages)
description: Longer summary used for SEO + card fallback text
date: 2025-06-01           # ISO date; drives sorting + RSS
year: 2025                 # used by timeline + as a date fallback
featured: true             # pins/highlights the item
status: active             # any label: active | completed | coming-soon | in-review …
cover: /images/thing.jpg   # card + hero image (optional; a gradient is used if absent)
gallery:                   # extra images (achievements, gallery, detail pages)
  - /images/a.jpg
  - /images/b.jpg
tags: [AI, Biology]        # powers filtering, related content, search
stack: [Python, PyTorch]   # technology stack (shown as chips)
author: Your Name
organization: Institution / Company / Host
role: Your role            # experience / leadership
period: "2023 — Present"   # freeform date range
location: City, Country
category: research         # gallery/timeline grouping (gallery infers from subfolder)
order: 0                   # manual sort override; lower = earlier
draft: false               # true = hidden everywhere
links:
  github: https://github.com/...
  demo: https://...
  paper: https://...
  video: https://...
  website: https://...
seo:
  title: Custom SEO title
  description: Custom SEO description
  keywords: [keyword, keyword]
---

Markdown body goes here. Standard MDX — headings, lists, links, images, code.
```

### Sorting

Items sort by `order` ascending, then `date` (or `year`) descending. Set
`featured: true` to surface something first in grids.

## Recipes

### Add a project

Create `content/projects/my-project.mdx`:

```yaml
---
title: My Project
subtitle: What it does in one line.
date: 2025-06-01
featured: true
status: in-development
cover: /images/my-project.jpg
tags: [Machine Learning, Open Source]
stack: [TypeScript, Python]
links:
  github: https://github.com/you/my-project
  demo: https://my-project.dev
---

## Overview
...

## Architecture
...

## Roadmap
- [ ] Next thing
```

### Add a research entry

Create `content/research/my-study.mdx` — same shape; use `links.paper` for the
publication and describe **methods / tools / impact** in the body.

### Add an achievement

Create `content/achievements/my-award.mdx`. Use `organization`, `date`,
`status` (e.g. `Awarded`), and a `gallery:` list for certificates/photos — they
render inside the expandable card.

### Add a timeline milestone

Create `content/timeline/2025-thing.mdx` with just `title`, `subtitle`, `year`,
and `category`. The year selector updates automatically.

### Add a gallery photo set

Create `content/gallery/<category>/my-shots.mdx`. The **subfolder becomes the
category filter**. Point `cover` and `gallery` at images in `public/images/`.

### Add a tool / future product

Create `content/tools/my-tool.mdx` with a `status` (e.g. `Coming Soon`) and a
`stack:` list. Add `links.website` to show a "Preview" link.

## Images

Put image files in `public/images/`, then reference them with an absolute path
from the site root: `cover: /images/my-photo.jpg`. Missing images fall back to a
branded gradient, so nothing ever looks broken.

## Removing the templates

The seed files in each folder are marked `> TEMPLATE`. Delete them or overwrite
them with your real content — the sections re-render from whatever exists.
