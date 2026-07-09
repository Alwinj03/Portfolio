import { ArrowRight, Wrench } from 'lucide-react'
import { all, toCards } from '@/lib/content'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/ui/reveal'
import { TagList } from '@/components/cards/tags'

export function Tools() {
  const items = toCards(all('tools'))
  if (items.length === 0) return null

  return (
    <section id="tools" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <div className="aurora opacity-60" />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Tools"
          title="Building the infrastructure I wish existed"
          description="Products and platforms in development — the tools that turn research into reality."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.url} delay={i * 0.05}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-xl transition-all hover:border-primary/40 hover:glow">
                <div className="absolute right-5 top-5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {t.status ?? 'Coming Soon'}
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-violet/20 text-primary">
                  <Wrench className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">
                  {t.title}
                </h3>
                {t.subtitle && (
                  <p className="mt-1 text-sm font-medium text-primary">{t.subtitle}</p>
                )}
                {t.description && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t.description}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                  <TagList tags={t.stack.length ? t.stack : t.tags} />
                  {t.links.website ? (
                    <a
                      href={t.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2"
                    >
                      Preview <ArrowRight className="h-4 w-4 transition-all" />
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">On the roadmap</span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
