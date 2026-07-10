import {
  about,
  achievements,
  blog,
  contact,
  education,
  experience,
  gallery,
  leadership,
  projects,
  research,
  timeline,
  tools,
  whitepapers,
} from '#content'

/** A single entry from any collection (they all share the same shape). */
export type Entry = (typeof projects)[number]

/** Lightweight shape passed to client components (no MDX body). */
export type Card = Omit<Entry, 'body'>

export const collections = {
  about,
  education,
  achievements,
  projects,
  research,
  whitepapers,
  experience,
  leadership,
  tools,
  gallery,
  timeline,
  blog,
  contact,
} satisfies Record<string, readonly Entry[]>

export type CollectionKey = keyof typeof collections

/** Collections that get full detail pages at /<collection>/<slug>. */
export const pageCollections: CollectionKey[] = [
  'projects',
  'research',
  'whitepapers',
  'achievements',
  'blog',
  'education',
  'experience',
  'leadership',
  'tools',
]

const byDateDesc = (a: Entry, b: Entry) => {
  if (a.order !== b.order) return a.order - b.order
  const da = a.date ? +new Date(a.date) : a.year ? +new Date(`${a.year}-01-01`) : 0
  const db = b.date ? +new Date(b.date) : b.year ? +new Date(`${b.year}-01-01`) : 0
  return db - da
}

/** Published entries of a collection, sorted (order asc, then date desc). */
export function all(key: CollectionKey): Entry[] {
  return [...collections[key]].filter((e) => !e.draft).sort(byDateDesc)
}

export function featured(key: CollectionKey): Entry[] {
  const items = all(key)
  const pinned = items.filter((e) => e.featured)
  return pinned.length > 0 ? pinned : items
}

export function bySlug(key: CollectionKey, slug: string): Entry | undefined {
  return all(key).find((e) => e.slug === slug)
}

/** Strip the compiled MDX body so entries can be passed to client components. */
export function toCard(entry: Entry): Card {
  const { body: _body, ...rest } = entry
  return rest
}

export function toCards(entries: Entry[]): Card[] {
  return entries.map(toCard)
}

/** Related content: shared tags first, then same collection. */
export function related(entry: Entry, limit = 3): Card[] {
  const pool = pageCollections
    .flatMap((key) => all(key))
    .filter((e) => e.url !== entry.url)
  const score = (e: Entry) =>
    e.tags.filter((t) => entry.tags.includes(t)).length * 2 +
    (e.collection === entry.collection ? 1 : 0)
  return pool
    .map((e) => ({ e, s: score(e) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ e }) => toCard(e))
}

/** Search index across the entire site (consumed by the command palette). */
export interface SearchDoc {
  title: string
  subtitle?: string
  url: string
  type: string
  tags: string[]
}

const typeLabels: Record<string, string> = {
  projects: 'Project',
  research: 'Research',
  whitepapers: 'White Paper',
  achievements: 'Achievement',
  blog: 'Blog',
  education: 'Education',
  experience: 'Experience',
  leadership: 'Leadership',
  tools: 'Tool',
  timeline: 'Timeline',
  gallery: 'Gallery',
}

export function searchIndex(): SearchDoc[] {
  return (Object.keys(collections) as CollectionKey[])
    .filter((k) => k !== 'about' && k !== 'contact')
    .flatMap((key) =>
      all(key).map((e) => ({
        title: e.title,
        subtitle: e.subtitle ?? e.description,
        url: pageCollections.includes(key) ? e.url : `/#${key}`,
        type: typeLabels[key] ?? key,
        tags: e.tags,
      })),
    )
}

/** Automatic statistics for the About section. */
export function stats() {
  const years = all('timeline')
    .map((e) => e.year)
    .filter((y): y is number => typeof y === 'number')
  return [
    { label: 'Research Projects', value: all('research').length },
    { label: 'Products & Projects', value: all('projects').length },
    { label: 'Achievements', value: all('achievements').length },
    {
      label: 'Years of Curiosity',
      value: years.length > 1 ? Math.max(...years) - Math.min(...years) : all('timeline').length,
    },
  ].filter((s) => s.value > 0)
}
