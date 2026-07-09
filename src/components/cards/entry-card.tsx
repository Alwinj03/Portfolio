'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Github, FileText, Play, Globe } from 'lucide-react'
import type { Card } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import { Cover } from './cover'
import { TagList } from './tags'

/** The universal content card. Works for projects, research, papers, blog, etc. */
export function EntryCard({ entry, href }: { entry: Card; href?: string }) {
  const url = href ?? entry.url
  const meta = formatDate(entry.date) ?? (entry.year ? String(entry.year) : entry.period)

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-colors hover:border-primary/40 hover:glow"
    >
      <Link href={url} className="absolute inset-0 z-10" aria-label={entry.title} />

      <Cover src={entry.cover} alt={entry.title} label={entry.title} />

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>{meta}</span>
          {entry.status && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
              {entry.status}
            </span>
          )}
        </div>

        <h3 className="font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
          {entry.title}
        </h3>
        {(entry.subtitle || entry.description) && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {entry.subtitle ?? entry.description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <TagList tags={entry.tags} />
          <div className="relative z-20 flex items-center gap-2 text-muted-foreground">
            {entry.links.github && (
              <IconAnchor href={entry.links.github} label="GitHub">
                <Github className="h-4 w-4" />
              </IconAnchor>
            )}
            {entry.links.paper && (
              <IconAnchor href={entry.links.paper} label="Paper">
                <FileText className="h-4 w-4" />
              </IconAnchor>
            )}
            {entry.links.demo && (
              <IconAnchor href={entry.links.demo} label="Demo">
                <Globe className="h-4 w-4" />
              </IconAnchor>
            )}
            {entry.links.video && (
              <IconAnchor href={entry.links.video} label="Video">
                <Play className="h-4 w-4" />
              </IconAnchor>
            )}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function IconAnchor({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-colors hover:text-foreground"
    >
      {children}
    </a>
  )
}
