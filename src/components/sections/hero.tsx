'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ArrowDown, Download, Sparkles } from 'lucide-react'
import { site } from '@/lib/site'
import { EASE } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Variants } from 'framer-motion'

const ParticleField = dynamic(() => import('@/components/three/particle-field'), { ssr: false })

const word: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: 0.15 + i * 0.08, duration: 0.8, ease: EASE },
  }),
}

export function Hero() {
  const line1 = ['Engineering', 'Intelligence']
  const line2 = ['for', 'Living', 'Systems']

  return (
    <section id="hero" className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="aurora" />
      <div className="absolute inset-0">
        <ParticleField />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {site.theme}
        </motion.div>

        <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl md:text-8xl">
          <span className="block">
            {line1.map((w, i) => (
              <motion.span
                key={w}
                custom={i}
                variants={word}
                initial="hidden"
                animate="show"
                className="mr-4 inline-block"
              >
                {w}
              </motion.span>
            ))}
          </span>
          <span className="mt-2 block text-gradient">
            {line2.map((w, i) => (
              <motion.span
                key={w}
                custom={i + line1.length}
                variants={word}
                initial="hidden"
                animate="show"
                className="mr-4 inline-block"
              >
                {w}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          {site.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button asChild size="lg">
            <a href="#projects">
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

      <motion.a
        href="#about"
        aria-label="Scroll to about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-border p-1.5">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="h-1.5 w-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.a>
    </section>
  )
}
