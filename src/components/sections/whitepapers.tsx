import Link from 'next/link'
import { FileText, ArrowUpRight } from 'lucide-react'
import { all, toCards } from '@/lib/content'
import { SectionHeader } from '@/components/section-header'
import { Reveal } from '@/components/ui/reveal'
import { formatDate } from '@/lib/utils'
import { EmptyState } from './empty-state'

/** Government / institutional-paper inspired layout — elegant, document-like. */
export function WhitePapers() {
  const items = toCards(all('whitepapers'))

  return (
    <section id="whitepapers" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="White Papers"
        title="Ideas, formalized"
        description="Position papers and technical documents on science, technology and policy."
      />
      {items.length === 0 ? (
        <EmptyState collection="whitepapers" />
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
          {items.map((p, i) => (
            <Reveal key={p.url} delay={i * 0.04}>
              <Link
                href={p.url}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 p-6 transition-colors hover:bg-accent/40 sm:gap-8 sm:p-8"
              >
                <div className="hidden font-mono text-sm text-muted-foreground sm:block">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex items-start gap-4">
                  <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-secondary/50 text-primary">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="font-display text-lg font-semibold sm:text-xl">{p.title}</h3>
                      {p.status && (
                        <span className="rounded-full border border-border px-2 py-0.5 text-xs uppercase tracking-wide text-muted-foreground">
                          {p.status}
                        </span>
                      )}
                    </div>
                    {p.subtitle && (
                      <p className="mt-1 max-w-xl text-sm text-muted-foreground">{p.subtitle}</p>
                    )}
                    <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      {p.author ?? 'Working paper'} · {formatDate(p.date) ?? p.year ?? 'Draft'}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  )
}
