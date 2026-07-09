'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { Card } from '@/lib/content'
import { SectionHeader } from '@/components/section-header'
import { TagList } from '@/components/cards/tags'
import { cn } from '@/lib/utils'

/** Horizontal, year-selectable life timeline. */
export function Timeline({ items }: { items: Card[] }) {
  const years = useMemo(
    () =>
      Array.from(new Set(items.map((i) => i.year).filter((y): y is number => !!y))).sort(
        (a, b) => b - a,
      ),
    [items],
  )
  const [year, setYear] = useState<number | null>(years[0] ?? null)

  if (items.length === 0) return null

  const visible = items.filter((i) => i.year === year)

  return (
    <section id="timeline" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="Timeline"
        title="A life in progress"
        description="Select a year to travel through the milestones."
      />

      {/* Year selector rail */}
      <div className="no-scrollbar -mx-6 mb-10 flex gap-2 overflow-x-auto px-6 pb-2">
        {years.map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={cn(
              'relative shrink-0 rounded-full px-5 py-2 font-mono text-sm transition-colors',
              year === y ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {year === y && (
              <motion.span
                layoutId="year-pill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{y}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((e, i) => (
          <motion.div
            key={e.url}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-3xl border border-border bg-card p-6"
          >
            <div className="font-mono text-xs uppercase tracking-widest text-primary">
              {e.category ?? e.status ?? 'Milestone'}
            </div>
            <h3 className="mt-2 font-display text-lg font-semibold">{e.title}</h3>
            {(e.subtitle || e.description) && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {e.subtitle ?? e.description}
              </p>
            )}
            {e.tags.length > 0 && (
              <div className="mt-4">
                <TagList tags={e.tags} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
