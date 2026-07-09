'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, ChevronDown } from 'lucide-react'
import type { Card } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import { SectionHeader } from '@/components/section-header'
import { TagList } from '@/components/cards/tags'

/** Expand-on-click achievement timeline (client component, content injected). */
export function Achievements({ items }: { items: Card[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.url ?? null)

  if (items.length === 0) return null

  return (
    <section id="achievements" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="Achievements"
        title="Milestones & recognition"
        description="Click any milestone to expand the story, photos, and certificates."
      />
      <div className="space-y-3">
        {items.map((a, i) => {
          const isOpen = open === a.url
          return (
            <motion.div
              key={a.url}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.04 }}
              className="overflow-hidden rounded-3xl border border-border bg-card"
            >
              <button
                onClick={() => setOpen(isOpen ? null : a.url)}
                className="flex w-full items-center gap-4 p-6 text-left transition-colors hover:bg-accent/40"
                aria-expanded={isOpen}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Award className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-semibold">{a.title}</h3>
                    {a.status && (
                      <span className="rounded-full bg-emerald/10 px-2 py-0.5 text-xs font-medium text-emerald">
                        {a.status}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {a.organization ? `${a.organization} · ` : ''}
                    {formatDate(a.date) ?? a.year}
                  </p>
                </div>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="border-t border-border px-6 pb-6 pt-5">
                      {a.subtitle && <p className="text-sm leading-relaxed">{a.subtitle}</p>}
                      {a.description && (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {a.description}
                        </p>
                      )}
                      {a.gallery.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {a.gallery.map((src) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={src}
                              src={src}
                              alt={a.title}
                              loading="lazy"
                              className="aspect-video w-full rounded-xl border border-border object-cover"
                            />
                          ))}
                        </div>
                      )}
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <TagList tags={a.tags} max={6} />
                        {a.links.website && (
                          <a
                            href={a.links.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            Learn more →
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
