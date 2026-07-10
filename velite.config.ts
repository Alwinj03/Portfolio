import { defineCollection, defineConfig, s } from 'velite'

/**
 * ── THE CONTENT ENGINE ─────────────────────────────────────────────
 * Every collection below maps 1:1 to a folder inside /content.
 * Drop an .mdx file into a folder → it automatically becomes a page,
 * a card, a search entry, a sitemap URL, and (where relevant) a
 * timeline item. The UI never changes. Only content changes.
 * ───────────────────────────────────────────────────────────────────
 */

/** Pull the first Markdown heading (used as a title fallback). */
function firstHeading(md?: string): string | undefined {
  if (!md) return undefined
  const m = md.match(/^\s*#{1,6}\s+(.+?)\s*$/m)
  return m ? m[1].replace(/[*_`~]/g, '').trim() : undefined
}

/** Turn a filename slug into a readable title, e.g. "future-of-bio" → "Future Of Bio". */
function prettify(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

/** Frontmatter every content type shares. All fields optional. */
const shared = {
  // Title is optional: if omitted we fall back to the first heading in the body,
  // then to a prettified filename — so a bare Markdown file never breaks the build.
  title: s.string().optional(),
  subtitle: s.string().optional(),
  description: s.string().optional(),             // used for cards + SEO
  date: s.isodate().optional(),                   // e.g. 2025-06-01
  year: s.number().optional(),                    // timeline year
  featured: s.boolean().default(false),           // pinned / highlighted
  status: s.string().optional(),                  // e.g. active | completed | coming-soon | in-review
  cover: s.string().optional(),                   // /images/... (put files in /public/images)
  gallery: s.array(s.string()).default([]),       // extra image paths
  tags: s.array(s.string()).default([]),
  stack: s.array(s.string()).default([]),         // technology stack
  author: s.string().optional(),
  location: s.string().optional(),                // used by education / experience / gallery
  organization: s.string().optional(),            // institution / company / event host
  role: s.string().optional(),                    // used by experience / leadership
  period: s.string().optional(),                  // freeform, e.g. "2023 — Present"
  category: s.string().optional(),                // used by gallery (internship, travel, ...)
  order: s.number().default(0),                   // manual sort override (lower = earlier)
  draft: s.boolean().default(false),              // true → hidden everywhere
  links: s
    .object({
      github: s.string().optional(),
      demo: s.string().optional(),
      paper: s.string().optional(),
      video: s.string().optional(),
      website: s.string().optional(),
    })
    .default({}),
  seo: s
    .object({
      title: s.string().optional(),
      description: s.string().optional(),
      keywords: s.array(s.string()).default([]),
    })
    .default({}),
}

/** Factory: one line per content type. `dirs` lets several folders feed one
 *  collection (e.g. both `achievements/` and `Awards/`). */
function collection(name: string, dir: string, dirs: string[] = [dir]) {
  const pattern = dirs.length > 1 ? `{${dirs.join(',')}}/**/*.mdx` : `${dir}/**/*.mdx`
  return defineCollection({
    name,
    pattern,
    schema: s
      .object({
        ...shared,
        path: s.path(),
        raw: s.raw(),
        body: s.mdx(),
        metadata: s.metadata(),
      })
      .transform(({ raw, ...data }) => {
        const segments = data.path.split('/')
        const slug = segments[segments.length - 1]
        return {
          ...data,
          title: data.title ?? firstHeading(raw) ?? prettify(slug),
          slug,
          collection: dir,
          url: `/${dir}/${slug}`,
          // gallery items nested in subfolders inherit the folder as category
          category: data.category ?? (segments.length > 2 ? segments[1] : undefined),
        }
      }),
  })
}

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: {
    about: collection('About', 'about'),
    education: collection('Education', 'education'),
    achievements: collection('Achievement', 'achievements', ['achievements', 'Awards']),
    projects: collection('Project', 'projects'),
    research: collection('Research', 'research'),
    whitepapers: collection('Whitepaper', 'whitepapers'),
    experience: collection('Experience', 'experience'),
    leadership: collection('Leadership', 'leadership'),
    tools: collection('Tool', 'tools'),
    gallery: collection('GalleryItem', 'gallery'),
    timeline: collection('TimelineEntry', 'timeline'),
    blog: collection('Post', 'blog'),
    contact: collection('Contact', 'contact'),
  },
  mdx: {
    rehypePlugins: [],
    remarkPlugins: [],
  },
})
