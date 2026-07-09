# Animation system

Motion here is **intentional, not decorative**. Every animation has a job:
orient the eye, reveal hierarchy, or reward interaction. Everything respects
`prefers-reduced-motion`.

## The toolkit

| Tool              | Used for                                                      |
| ----------------- | ------------------------------------------------------------- |
| **Lenis**         | Global smooth scrolling + anchor-link easing                  |
| **Framer Motion** | Reveals, staggers, card hovers, expand/collapse, layout, page |
| **Three.js / R3F**| Hero particle field (DNA ⇄ neural network morph)              |
| **GSAP**          | Installed and ready for timeline-based sequences              |
| CSS keyframes     | Aurora blobs, marquees, ambient float/pulse (see Tailwind)    |

## Primitives (reuse these)

Defined in [`src/components/ui/reveal.tsx`](../src/components/ui/reveal.tsx):

- **`<Reveal delay={0.1}>`** — fade + translate up when scrolled into view.
- **`<Stagger>` / `<StaggerItem>`** — container that staggers child reveals.
- **`<AnimatedNumber value={42} />`** — count-up when visible
  (`src/components/ui/animated-number.tsx`).

Shared easing lives in `src/lib/utils.ts` as `EASE` (a typed cubic-bezier
tuple) — use it so motion feels consistent everywhere.

```tsx
import { Reveal, Stagger, StaggerItem } from '@/components/ui/reveal'

<Stagger className="grid gap-6 sm:grid-cols-3">
  {items.map((i) => (
    <StaggerItem key={i.id}>…</StaggerItem>
  ))}
</Stagger>
```

## Section-by-section

- **Hero** — words animate in with a blur-up stagger; the R3F particle field
  morphs between a helix and a cloud and reacts to the pointer. Disabled on
  small screens and reduced-motion.
- **About** — stat tiles count up (`AnimatedNumber`) on scroll.
- **Education** — alternating timeline nodes reveal in sequence.
- **Achievements** — click-to-expand with animated height (`AnimatePresence`).
- **Gallery** — masonry items pop in; lightbox scales open.
- **Timeline** — a `layoutId` pill slides between year buttons.
- **Vision** — parallax (`useScroll` + `useTransform`) and line-by-line reveal.
- **Cards** — spring lift on hover with an electric glow.

## Reduced motion

`Providers` skips Lenis when the user prefers reduced motion; `Reveal` and
`AnimatedNumber` short-circuit to their final state; a global CSS media query
neutralizes remaining transitions/animations. **Always** gate new motion behind
`useReducedMotion()` (Framer) or the `@media (prefers-reduced-motion)` block in
`globals.css`.

## Adding a new animation

1. Prefer an existing primitive (`Reveal` / `Stagger`).
2. For bespoke motion, use Framer Motion and import `EASE` from `@/lib/utils`.
3. For scroll-timeline choreography, GSAP is installed — register
   `ScrollTrigger` inside a client component's `useEffect` and clean it up on
   unmount.
4. Verify it degrades gracefully with reduced motion before shipping.

## Performance notes

- The 3D canvas caps DPR at 1.6 and uses additive-blended points (cheap).
- Heavy visuals are `next/dynamic` with `ssr: false`.
- Reveals use `viewport={{ once: true }}` so they don't re-run on scroll.
