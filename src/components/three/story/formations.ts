/**
 * ── THE NARRATIVE, AS GEOMETRY ─────────────────────────────────────
 * One particle system morphs between these formations as you scroll.
 * Each formation is aligned to a real page section (`section` id), so the
 * transformation happens exactly as you cross from one chapter into the next:
 *
 *   hero (DNA / Life) → about (neural net / Intelligence) → education (mind /
 *   Learning) → research (metabolic network / Discovery) → leadership
 *   (community / People) → achievements (constellation / Recognition) →
 *   whitepapers (institutions / Policy) → tools (grid / Technology) →
 *   contact (globe / Global impact).
 *
 * The particles never fade — they are continuously re-targeted, so DNA
 * literally becomes a neural network, which becomes a brain, and so on.
 * ───────────────────────────────────────────────────────────────────
 */

/** Deterministic RNG so every formation is stable across renders. */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Builder = (n: number) => Float32Array

const TAU = Math.PI * 2

/** Evenly distribute points on a sphere (Fibonacci lattice). */
function fibSphere(i: number, n: number, radius: number): [number, number, number] {
  const golden = Math.PI * (3 - Math.sqrt(5))
  const y = 1 - (i / Math.max(1, n - 1)) * 2
  const r = Math.sqrt(Math.max(0, 1 - y * y))
  const theta = golden * i
  return [Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]
}

/** DNA double helix (Life). */
const helix: Builder = (n) => {
  const p = new Float32Array(n * 3)
  const rng = mulberry32(1)
  const turns = 5
  const height = 13
  const radius = 2.3
  for (let i = 0; i < n; i++) {
    const isRung = i % 9 === 0
    const t = (i / n) * turns * TAU
    const strand = i % 2 === 0 ? 0 : Math.PI
    const y = (i / n - 0.5) * height
    if (isRung) {
      const lerp = rng()
      const a = Math.cos(t) * radius
      const b = Math.cos(t + Math.PI) * radius
      const za = Math.sin(t) * radius
      const zb = Math.sin(t + Math.PI) * radius
      p[i * 3] = a + (b - a) * lerp
      p[i * 3 + 1] = y
      p[i * 3 + 2] = za + (zb - za) * lerp
    } else {
      p[i * 3] = Math.cos(t + strand) * radius
      p[i * 3 + 1] = y
      p[i * 3 + 2] = Math.sin(t + strand) * radius
    }
  }
  return p
}

/** Layered neural network (Intelligence). */
const neural: Builder = (n) => {
  const p = new Float32Array(n * 3)
  const rng = mulberry32(2)
  const layers = 6
  const span = 11
  for (let i = 0; i < n; i++) {
    const layer = Math.floor((i / n) * layers)
    const x = (layer / (layers - 1) - 0.5) * span
    const rad = Math.pow(rng(), 0.6) * 3.2
    const ang = rng() * TAU
    p[i * 3] = x + (rng() - 0.5) * 0.6
    p[i * 3 + 1] = Math.sin(ang) * rad
    p[i * 3 + 2] = Math.cos(ang) * rad
  }
  return p
}

/** Brain-like lumpy shell (Learning / Mind). */
const brain: Builder = (n) => {
  const p = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const [x, y, z] = fibSphere(i, n, 3.2)
    const fold =
      1 +
      0.12 * Math.sin(x * 3.1) +
      0.12 * Math.sin(y * 2.7 + 1.3) +
      0.1 * Math.sin(z * 3.4 + 2.1)
    p[i * 3] = x * fold * 1.15
    p[i * 3 + 1] = y * fold * 0.95
    p[i * 3 + 2] = z * fold
  }
  return p
}

/** Metabolic network graph — nodes + flux pathways (Research). */
const metabolic: Builder = (n) => {
  const p = new Float32Array(n * 3)
  const rng = mulberry32(5)
  const hubs = 9
  const hubPos: [number, number][] = []
  for (let h = 0; h < hubs; h++) {
    const ang = (h / hubs) * TAU
    const rr = 1.5 + rng() * 3
    hubPos.push([Math.cos(ang) * rr, Math.sin(ang) * rr])
  }
  for (let i = 0; i < n; i++) {
    if (i % 3 === 0) {
      const h = hubPos[i % hubs]
      p[i * 3] = h[0] + (rng() - 0.5) * 0.5
      p[i * 3 + 1] = h[1] + (rng() - 0.5) * 0.5
    } else {
      const a = hubPos[i % hubs]
      const b = hubPos[(i * 7) % hubs]
      const t = rng()
      p[i * 3] = a[0] + (b[0] - a[0]) * t
      p[i * 3 + 1] = a[1] + (b[1] - a[1]) * t
    }
    p[i * 3 + 2] = (rng() - 0.5) * 0.6
  }
  return p
}

/** Community rings — people connecting (Leadership). */
const community: Builder = (n) => {
  const p = new Float32Array(n * 3)
  const rings = 5
  for (let i = 0; i < n; i++) {
    const ring = i % rings
    const radius = 1.4 + ring * 1.1
    const ang = (i / n) * TAU * 8
    p[i * 3] = Math.cos(ang) * radius
    p[i * 3 + 1] = Math.sin(ang) * radius
    p[i * 3 + 2] = (ring - rings / 2) * 0.5
  }
  return p
}

/** Constellation of stars & medals (Achievements / Recognition). */
const constellation: Builder = (n) => {
  const p = new Float32Array(n * 3)
  const rng = mulberry32(8)
  for (let i = 0; i < n; i++) {
    if (i % 6 === 0) {
      const [x, y, z] = fibSphere(i % 40, 40, 4.5)
      p[i * 3] = x + (rng() - 0.5) * 0.3
      p[i * 3 + 1] = y + (rng() - 0.5) * 0.3
      p[i * 3 + 2] = z + (rng() - 0.5) * 0.3
    } else {
      const [x, y, z] = fibSphere(i, n, 3 + rng() * 4)
      p[i * 3] = x
      p[i * 3 + 1] = y
      p[i * 3 + 2] = z
    }
  }
  return p
}

/** Institutional skyline — abstract, never political (White Papers / Policy). */
const institutions: Builder = (n) => {
  const p = new Float32Array(n * 3)
  const rng = mulberry32(10)
  const bars = 7
  const barW = 1.4
  for (let i = 0; i < n; i++) {
    const bar = i % bars
    const x = (bar - (bars - 1) / 2) * (barW + 0.5)
    const h = 3 + ((bar * 2.7) % 5)
    p[i * 3] = x + (rng() - 0.5) * barW
    p[i * 3 + 1] = rng() * h - 3.5
    p[i * 3 + 2] = (rng() - 0.5) * barW
  }
  return p
}

/** Dashboard grid — tools & instruments (Technology). */
const grid: Builder = (n) => {
  const p = new Float32Array(n * 3)
  const cols = 40
  for (let i = 0; i < n; i++) {
    const gx = i % cols
    const gy = Math.floor(i / cols) % cols
    p[i * 3] = (gx / cols - 0.5) * 12
    p[i * 3 + 1] = (gy / cols - 0.5) * 12
    p[i * 3 + 2] = Math.sin(gx * 0.4) * Math.cos(gy * 0.4) * 0.8
  }
  return p
}

/** Earth + satellite ring (Global impact / Contact). */
const globe: Builder = (n) => {
  const p = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    if (i % 8 === 0) {
      const ang = (i / n) * TAU * 20
      const r = 4.4
      p[i * 3] = Math.cos(ang) * r
      p[i * 3 + 1] = Math.sin(ang) * r * 0.35
      p[i * 3 + 2] = Math.sin(ang) * r
    } else {
      const [x, y, z] = fibSphere(i, n, 3)
      p[i * 3] = x
      p[i * 3 + 1] = y
      p[i * 3 + 2] = z
    }
  }
  return p
}

export interface Keyframe {
  /** The page section id this formation is anchored to. */
  section: string
  name: string
  build: Builder
  /** RGB in 0..1, the dominant hue of this idea. */
  color: [number, number, number]
}

/** The ordered story, one formation per page section (in scroll order). */
export const STORY: Keyframe[] = [
  { section: 'hero', name: 'DNA', build: helix, color: [0.31, 0.62, 1.0] },
  { section: 'about', name: 'Neural', build: neural, color: [0.55, 0.36, 0.96] },
  { section: 'education', name: 'Mind', build: brain, color: [0.45, 0.5, 1.0] },
  { section: 'research', name: 'Research', build: metabolic, color: [0.1, 0.78, 0.55] },
  { section: 'leadership', name: 'Leadership', build: community, color: [0.6, 0.4, 0.98] },
  { section: 'achievements', name: 'Recognition', build: constellation, color: [1.0, 0.83, 0.47] },
  { section: 'whitepapers', name: 'Policy', build: institutions, color: [0.65, 0.75, 1.0] },
  { section: 'tools', name: 'Technology', build: grid, color: [0.24, 0.8, 0.86] },
  { section: 'contact', name: 'Global', build: globe, color: [0.2, 0.66, 0.98] },
]

/** Precompute every formation's buffer once for a given particle count. */
export function buildFormations(n: number) {
  return STORY.map((k) => ({ ...k, positions: k.build(n) }))
}
