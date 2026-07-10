import { GraduationCap } from 'lucide-react'
import { all } from '@/lib/content'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/ui/reveal'
import { MDX } from '@/components/mdx'
import { TagList } from '@/components/cards/tags'
import { EmptyState } from './empty-state'

/**
 * Education renders each entry's full MDX body — the real academic detail
 * (institution, CGPA, coursework) is written in Markdown, so we show it.
 */
export function Education() {
  const items = all('education')

  return (
    <section id="education" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="Education"
        title="Academic journey"
        description="Institutions, coursework, and the pivot that shaped how I think."
      />
      {items.length === 0 ? (
        <EmptyState collection="education" />
      ) : (
        <div className="space-y-6">
          {items.map((e, i) => (
            <Reveal key={e.url} delay={i * 0.05}>
              <article className="rounded-3xl border border-border bg-card/70 p-7 backdrop-blur-xl sm:p-9">
                <div className="mb-4 flex items-center gap-3 text-sm text-primary">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <span className="font-medium">
                    {e.organization ?? e.period ?? (e.year ? String(e.year) : 'Education')}
                  </span>
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
