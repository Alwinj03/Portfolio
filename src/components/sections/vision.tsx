'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { site } from '@/lib/site'

/** Cinematic manifesto with parallax. */
export function Vision() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3])

  const lines = [
    'Biology is the most advanced',
    'technology ever written.',
    'I build the tools to read it,',
    'engineer it, and extend it.',
  ]

  return (
    <section
      id="vision"
      ref={ref}
      className="relative flex min-h-[90vh] scroll-mt-24 items-center overflow-hidden py-32"
    >
      <div className="aurora" />
      <motion.div style={{ y }} className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[15%] right-[12%] h-72 w-72 rounded-full bg-violet/10 blur-3xl" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative mx-auto max-w-5xl px-6 text-center">
        <p className="mb-8 font-mono text-sm uppercase tracking-[0.3em] text-primary">
          The Vision
        </p>
        <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl md:text-7xl">
          {lines.map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={i >= 2 ? 'block text-gradient' : 'block'}
            >
              {line}
            </motion.span>
          ))}
        </h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mx-auto mt-10 max-w-xl text-lg text-muted-foreground"
        >
          {site.theme}. A commitment to open science, elegant engineering, and the long arc of
          discovery.
        </motion.p>
      </motion.div>
    </section>
  )
}
