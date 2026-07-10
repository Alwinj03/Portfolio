'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Download } from 'lucide-react'
import { site } from '@/lib/site'
import { EASE } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Variants } from 'framer-motion'

// Entrance choreography — everything is calm, sequential, intentional.
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: d, duration: 0.9, ease: EASE },
  }),
}

const letter: Variants = {
  hidden: { opacity: 0, y: '0.5em', filter: 'blur(6px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: 0.6 + i * 0.045, duration: 0.7, ease: EASE },
  }),
}

export function Hero() {
  const name = site.fullName.toUpperCase()

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      <div className="aurora" />
      {/* DNA helix is drawn by the global <StoryBackground> at scroll progress 0;
          this gradient just seats the hero copy above it. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/85" />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center">
        {/* Primary headline — manifesto, above the name */}
        <motion.p
          custom={0.15}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="font-display text-lg font-medium uppercase tracking-[0.35em] text-primary sm:text-xl"
        >
          {site.tagline}
        </motion.p>

        {/* The visual anchor — the name, revealed letter by letter */}
        <h1 className="mt-5 flex flex-wrap items-center justify-center font-display text-[clamp(2.75rem,11vw,7.5rem)] font-bold leading-[0.95] tracking-tight">
          {name.split('').map((ch, i) => (
            <motion.span
              key={`${ch}-${i}`}
              custom={i}
              variants={letter}
              initial="hidden"
              animate="show"
              className={ch === ' ' ? 'inline-block w-[0.35em]' : 'inline-block text-gradient'}
              style={{
                filter: 'drop-shadow(0 0 32px hsl(var(--electric) / 0.25))',
              }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </h1>

        {/* Disciplines — refined uppercase, staggered, dot-separated */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { delayChildren: 1.15, staggerChildren: 0.1 } } }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground sm:text-sm"
        >
          {site.disciplines.map((d, i) => (
            <motion.span
              key={d}
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
              className="flex items-center gap-x-3"
            >
              {i > 0 && <span className="text-primary/60">•</span>}
              {d}
            </motion.span>
          ))}
        </motion.div>

        {/* Supporting statement */}
        <motion.p
          custom={1.7}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mx-auto mt-8 max-w-[700px] text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {site.statement}
        </motion.p>

        {/* Buttons — appear last */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button asChild size="lg">
            <a href="#about">
              Explore My Work <ArrowDown className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild size="lg" variant="glass">
            <a href={site.resume} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" /> Download Resume
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        aria-label="Scroll to begin"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Scroll to Begin
        </span>
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-border p-1.5">
          <motion.span
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="h-1.5 w-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.a>
    </section>
  )
}
