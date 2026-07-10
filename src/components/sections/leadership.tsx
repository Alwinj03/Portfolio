import { Users } from 'lucide-react'
import { all } from '@/lib/content'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/ui/reveal'
import { MDX } from '@/components/mdx'
import { TagList } from '@/components/cards/tags'
import { EmptyState } from './empty-state'

/** Leadership renders the full MDX body — events, workshops, and impact. */
export function Leadership() {
  const items = all('leadership')

  return (
    <section id="leadership" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="Leadership"
        title="Community & impact"
        description="Clubs founded, events organized, and communities built."
      />
      {items.length === 0 ? (
        <EmptyState collection="leadership" />
      ) : (
        <div className="grid gap-6">
          {items.map((e, i) => (
            <Reveal key={e.url} delay={i * 0.05}>
              <article className="rounded-3xl border border-border bg-card p-7 sm:p-9">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-violet/10 text-violet">
                      <Users className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-display text-lg font-semibold leading-tight">{e.title}</p>
                      {e.organization && (
                        <p className="text-sm text-muted-foreground">{e.organization}</p>
                      )}
                    </div>
                  </div>
                  {(e.period || e.year) && (
                    <span className="text-sm text-muted-foreground">{e.period ?? e.year}</span>
                  )}
                </div>
                <MDX code={e.body} />
                {e.tags.length > 0 && (
                  <div className="mt-5">
                    <TagList tags={e.tags} max={8} />
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  )
}
