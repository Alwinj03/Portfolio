import { GraduationCap } from 'lucide-react'
import { all, toCards } from '@/lib/content'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/ui/reveal'
import { TagList } from '@/components/cards/tags'
import { EmptyState } from './empty-state'

export function Education() {
  const items = toCards(all('education'))

  return (
    <section id="education" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="Education"
        title="An academic foundation"
        description="Institutions, coursework, and the ideas that shaped the way I think."
      />
      {items.length === 0 ? (
        <EmptyState collection="education" />
      ) : (
        <div className="relative">
          <div className="absolute left-6 top-2 h-full w-px bg-gradient-to-b from-primary/60 via-border to-transparent md:left-1/2" />
          <div className="space-y-10">
            {items.map((e, i) => (
              <Reveal
                key={e.url}
                delay={i * 0.05}
                className="relative grid gap-4 pl-16 md:grid-cols-2 md:gap-12 md:pl-0"
              >
                <span className="absolute left-6 top-6 z-10 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full border-2 border-primary bg-background md:left-1/2" />
                <div
                  className={
                    i % 2 === 0
                      ? 'md:col-start-1 md:pr-12 md:text-right'
                      : 'md:col-start-2 md:pl-12'
                  }
                >
                  <div className="glass rounded-3xl p-6">
                    <div className="flex items-center gap-2 text-sm text-primary md:justify-end">
                      <GraduationCap className="h-4 w-4" />
                      {e.period ?? e.year}
                    </div>
                    <h3 className="mt-2 font-display text-xl font-semibold">{e.title}</h3>
                    {e.organization && (
                      <p className="text-sm text-muted-foreground">{e.organization}</p>
                    )}
                    {e.subtitle && <p className="mt-3 text-sm">{e.subtitle}</p>}
                    {e.tags.length > 0 && (
                      <div className="mt-4 md:flex md:justify-end">
                        <TagList tags={e.tags} max={5} />
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
