'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const CinematicScene = dynamic(() => import('@/components/three/story/cinematic-scene'), {
  ssr: false,
})

/**
 * Fixed, full-viewport 3D backdrop that tells the story as you scroll.
 * Lives behind all content (pointer-events: none) so the whole page scrolls
 * over one continuous, morphing particle system.
 *
 * Gracefully disabled for reduced-motion, small screens, and devices without
 * WebGL — in those cases the CSS aurora backdrops carry the ambience.
 */
export function StoryBackground() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const smallScreen = window.innerWidth < 768
    const lowCores = (navigator.hardwareConcurrency ?? 8) <= 2
    let webgl = false
    try {
      const c = document.createElement('canvas')
      webgl = !!(c.getContext('webgl2') || c.getContext('webgl'))
    } catch {
      webgl = false
    }
    setEnabled(!reduce && !smallScreen && !lowCores && webgl)
  }, [])

  if (!enabled) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ maskImage: 'radial-gradient(ellipse at center, black 55%, transparent 100%)' }}
    >
      <CinematicScene />
    </div>
  )
}
