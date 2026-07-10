'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, ChevronDown, FlaskConical, Github, FileText, Globe } from 'lucide-react'
import type { Entry } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import { SectionHeader } from '@/components/section-header'
import { TagList } from '@/components/cards/tags'
import { MDX } from '@/components/mdx'

const ICONS = { award: Award, research: FlaskConical } as const

/**
 * Expand-on-click list that renders each entry's full MDX body. Used for
 * Research and Achievements — the real content (methods, story, results) is
 * written in the Markdown body, so we render it in place instead of hiding it
 * behind a metadata card.
 */
export function ExpandableDocs({
  id,
  eyebrow,
  title,
  description,
  icon = 'award',
  items,
}: {
  id: string
  eyebrow: string
  title: string
  description?: string
  icon?: keyof typeof ICONS
  items: Entry[]
}) {
  const [open, setOpen] = useState<string | null>(items[0]?.url ?? null)
  const Icon = ICONS[icon]

  if (items.length === 0) return null

  return (
    <section id={id} className="section scroll-mt-24">
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="space-y-3">
        {items.map((a, i) => {
          const isOpen = open === a.url
          const meta = [a.organization, formatDate(a.date) ?? (a.year ? String(a.year) : a.period)]
            .filter(Boolean)
            .join(' · ')
          const links = [
            { href: a.links.github, label: 'GitHub', Icon: Github },
            { href: a.links.paper, label: 'Paper', Icon: FileText },
            { href: a.links.demo ?? a.links.website, label: 'Link', Icon: Globe },
          ].filter((l) => l.href)

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
                  <Icon className="h-5 w-5" />
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
                  {meta && <p className="truncate text-sm text-muted-foreground">{meta}</p>}
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
                    <div className="border-t border-border px-6 pb-8 pt-6">
                      <MDX code={a.body} />

                      {a.gallery.length > 0 && (
                        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
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

                      {(a.tags.length > 0 || links.length > 0) && (
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                          <TagList tags={a.tags} max={8} />
                          <div className="flex items-center gap-3">
                            {links.map(({ href, label, Icon }) => (
                              <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                              >
                                <Icon className="h-4 w-4" /> {label}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
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
