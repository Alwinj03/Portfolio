import { Users } from 'lucide-react'
import { all, toCards } from '@/lib/content'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/ui/reveal'
import { TagList } from '@/components/cards/tags'
import { EmptyState } from './empty-state'

export function Leadership() {
  const items = toCards(all('leadership'))

  return (
    <section id="leadership" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="Leadership"
        title="Community & impact"
        description="Events organized, workshops led, and communities built."
      />
      {items.length === 0 ? (
        <EmptyState collection="leadership" />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((e, i) => (
            <Reveal key={e.url} delay={i * 0.05}>
              <div className="group flex h-full flex-col rounded-3xl border border-border bg-card p-7 transition-all hover:border-primary/40 hover:glow">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet/10 text-violet">
                    <Users className="h-5 w-5" />
                  </span>
                  <span className="text-sm text-muted-foreground">{e.period ?? e.year}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{e.title}</h3>
                {e.role && <p className="text-sm font-medium text-primary">{e.role}</p>}
                {(e.subtitle || e.description) && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {e.subtitle ?? e.description}
                  </p>
                )}
                <div className="mt-auto pt-5">
                  <TagList tags={e.tags} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  )
}
