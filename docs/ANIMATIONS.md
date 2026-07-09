# Animation system

Motion here is **intentional, not decorative**. Every animation has a job:
orient the eye, reveal hierarchy, or reward interaction. Everything respects
`prefers-reduced-motion`.

## The cinematic story background (the spine)

The whole home page scrolls over **one continuous, morphing particle system** —
not a series of separate scenes. As you scroll, ~4,200 GPU-blended particles are
re-targeted from one procedural "idea" to the next, so nothing ever fades: DNA
literally unwinds into a neural network, which becomes a brain, then cells, a
metabolic network, a bioreactor, architecture cubes, a constellation, community
rings, an institutional skyline, a tools dashboard, a globe, and finally a
converging orbit that the logo/signature rises out of.

This maps the narrative **Life → Biology → Intelligence → Research →
Engineering → Innovation → Leadership → Policy → Technology → Global → Future**.

Where it lives:

| File | Role |
| ---- | ---- |
| `src/components/three/story/formations.ts` | The 13 procedural formations + their colors. Each is a pure function filling a `Float32Array` of particle positions. **Edit the story here.** |
| `src/components/three/story/morph-field.tsx` | The persistent `<points>` system. Every frame it reads scroll progress, blends the two nearest formations, eases position + color, applies mouse parallax, and dollies the camera. |
| `src/components/three/story/cinematic-scene.tsx` | Canvas + ambient light + **Bloom / Vignette** post-processing. |
| `src/components/story-background.tsx` | Client gate + dynamic import. Renders a fixed, `pointer-events:none` layer behind the content, disabled for reduced-motion / small screens / ≤2 cores / no-WebGL. |

How it composites with content:

- The base background color is on `<html>`; `<body>` is transparent so the fixed
  canvas (behind a `z-10` content layer) shows through.
- **Hero** and the **Vision/Contact finale** sit on transparent sections, so the
  DNA and the globe/orbit read vividly.
- The **text chapters** in between sit on a translucent `bg-background/60
  backdrop-blur-md` scrim — the morph keeps evolving behind them as soft ambient
  light while copy stays perfectly legible.

**To change the narrative:** reorder or edit the `STORY` array in
`formations.ts`. Add a formation by writing a `Builder` (fill `Float32Array`
of length `n*3`) and inserting it with a color; the morph engine picks it up
automatically — no other file changes.

**Scroll = timeline.** Progress is `scrollY / (scrollHeight - innerHeight)`,
smoothed each frame, so the transformation is fully scrubbable in both
directions and settles with weight instead of snapping.

**Performance:** one draw call, instanced points, DPR capped at 1.6, additive
blending + a soft sprite for the glow, and the entire scene is `next/dynamic`
(`ssr:false`) so it never touches the first-load bundle.

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
