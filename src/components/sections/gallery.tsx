'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { Card } from '@/lib/content'
import { SectionHeader } from '@/components/section-header'
import { cn } from '@/lib/utils'

// Repeating aspect ratios give the grid a masonry rhythm while letting
// next/image reserve exact space (no layout shift) even for unknown dimensions.
const ASPECTS = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/3]']

interface Shot {
  src: string
  title: string
  category?: string
}

/** Masonry gallery with category filter + lightbox. */
export function Gallery({ items }: { items: Card[] }) {
  // Flatten: each entry contributes its cover + any gallery images.
  const shots: Shot[] = useMemo(
    () =>
      items.flatMap((e) => {
        const imgs = [e.cover, ...e.gallery].filter(Boolean) as string[]
        return imgs.map((src) => ({ src, title: e.title, category: e.category }))
      }),
    [items],
  )

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(shots.map((s) => s.category).filter(Boolean) as string[]))],
    [shots],
  )
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState<Shot | null>(null)

  if (shots.length === 0) return null

  const visible = filter === 'All' ? shots : shots.filter((s) => s.category === filter)

  return (
    <section id="gallery" className="section scroll-mt-24">
      <SectionHeader
        eyebrow="Gallery"
        title="Moments & fieldwork"
        description="Research, internships, hackathons, travel and campus life."
      />

      {categories.length > 2 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm capitalize transition-colors',
                filter === c
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="columns-2 gap-4 [column-fill:_balance] md:columns-3 lg:columns-4">
        {visible.map((shot, i) => (
          <motion.button
            key={shot.src + i}
            layout
            onClick={() => setActive(shot)}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (i % 8) * 0.03 }}
            className={cn(
              'group relative mb-4 block w-full overflow-hidden rounded-2xl border border-border',
              ASPECTS[i % ASPECTS.length],
            )}
          >
            <Image
              src={shot.src}
              alt={shot.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-6 backdrop-blur"
          >
            <button
              className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={active.src}
              alt={active.title}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
