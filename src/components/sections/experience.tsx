import { Briefcase } from 'lucide-react'
import { all, toCards } from '@/lib/content'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/ui/reveal'
import { TagList } from '@/components/cards/tags'

export function Experience() {
  const items = toCards(all('experience'))
  if (items.length === 0) return null

  return (
    <section id="experience" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="Experience"
        title="Where I've worked"
        description="Internships, labs and teams where the ideas met reality."
      />
      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((e, i) => (
          <Reveal key={e.url} delay={i * 0.05}>
            <div className="group flex h-full flex-col rounded-3xl border border-border bg-card p-7 transition-all hover:border-primary/40 hover:glow">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald/10 text-emerald">
                  <Briefcase className="h-5 w-5" />
                </span>
                <span className="text-sm text-muted-foreground">{e.period ?? e.year}</span>
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{e.role ?? e.title}</h3>
              <p className="text-sm font-medium text-primary">{e.organization ?? e.title}</p>
              {(e.subtitle || e.description) && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {e.subtitle ?? e.description}
                </p>
              )}
              <div className="mt-auto pt-5">
                <TagList tags={e.stack.length ? e.stack : e.tags} />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
