import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Github, FileText, Play, Globe } from 'lucide-react'
import {
  all,
  bySlug,
  pageCollections,
  related,
  type CollectionKey,
} from '@/lib/content'
import { site } from '@/lib/site'
import { formatDate } from '@/lib/utils'
import { MDX } from '@/components/mdx'
import { Cover } from '@/components/cards/cover'
import { TagList } from '@/components/cards/tags'
import { EntryCard } from '@/components/cards/entry-card'
import { Reveal } from '@/components/ui/reveal'
import { Badge } from '@/components/ui/badge'

type Params = { collection: string; slug: string }

/** Pre-render every detail page for every MDX file — fully static. */
export function generateStaticParams() {
  return pageCollections.flatMap((collection) =>
    all(collection).map((e) => ({ collection, slug: e.slug })),
  )
}

function resolve(params: Params) {
  const collection = params.collection as CollectionKey
  if (!pageCollections.includes(collection)) return null
  const entry = bySlug(collection, params.slug)
  return entry ? { collection, entry } : null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const resolved = resolve(await params)
  if (!resolved) return {}
  const { entry } = resolved
  const title = entry.seo.title ?? entry.title
  const description = entry.seo.description ?? entry.description ?? entry.subtitle
  return {
    title,
    description,
    keywords: entry.seo.keywords.length ? entry.seo.keywords : entry.tags,
    openGraph: {
      title,
      description: description ?? undefined,
      type: 'article',
      url: `${site.url}${entry.url}`,
      images: entry.cover ? [{ url: entry.cover }] : undefined,
      publishedTime: entry.date,
      tags: entry.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description ?? undefined,
      images: entry.cover ? [entry.cover] : undefined,
    },
  }
}

export default async function EntryPage({ params }: { params: Promise<Params> }) {
  const resolved = resolve(await params)
  if (!resolved) notFound()
  const { collection, entry } = resolved
  const links = entry.links
  const relatedItems = related(entry)

  const linkDefs = [
    { href: links.github, label: 'GitHub', Icon: Github },
    { href: links.demo, label: 'Live Demo', Icon: Globe },
    { href: links.paper, label: 'Read Paper', Icon: FileText },
    { href: links.video, label: 'Watch', Icon: Play },
    { href: links.website, label: 'Website', Icon: Globe },
  ].filter((l) => l.href)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: entry.title,
    description: entry.description ?? entry.subtitle,
    datePublished: entry.date,
    keywords: entry.tags.join(', '),
    author: { '@type': 'Person', name: entry.author ?? site.name },
    url: `${site.url}${entry.url}`,
  }

  return (
    <article className="relative">
      <div className="aurora opacity-50" />
      <div className="relative mx-auto max-w-3xl px-6 pb-24 pt-32">
        <Link
          href={`/#${collection}`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {collection}
        </Link>

        <Reveal>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Badge>{collection}</Badge>
            {entry.status && <span className="text-primary">{entry.status}</span>}
            <span>{formatDate(entry.date) ?? entry.year ?? entry.period}</span>
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {entry.title}
          </h1>
          {entry.subtitle && (
            <p className="mt-4 text-xl text-muted-foreground">{entry.subtitle}</p>
          )}

          {(entry.stack.length > 0 || entry.tags.length > 0) && (
            <div className="mt-6">
              <TagList tags={entry.stack.length ? entry.stack : entry.tags} max={10} />
            </div>
          )}

          {linkDefs.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {linkDefs.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-accent"
                >
                  <Icon className="h-4 w-4" /> {label}
                </a>
              ))}
            </div>
          )}
        </Reveal>

        {entry.cover && (
          <Reveal delay={0.1}>
            <div className="mt-10 overflow-hidden rounded-3xl border border-border">
              <Cover src={entry.cover} alt={entry.title} aspect="aspect-[16/9]" priority />
            </div>
          </Reveal>
        )}

        <Reveal delay={0.15} className="mt-12">
          <MDX code={entry.body} />
        </Reveal>

        {entry.gallery.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {entry.gallery.map((src) => (
              <div
                key={src}
                className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border"
              >
                <Image
                  src={src}
                  alt={entry.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {relatedItems.length > 0 && (
        <div className="mx-auto max-w-6xl px-6 pb-24">
          <h2 className="mb-8 font-display text-2xl font-semibold">Related</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedItems.map((r) => (
              <EntryCard key={r.url} entry={r} />
            ))}
          </div>
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  )
}
