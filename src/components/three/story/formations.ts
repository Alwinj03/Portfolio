/**
 * ── THE NARRATIVE, AS GEOMETRY ─────────────────────────────────────
 * One particle system morphs between these formations as you scroll.
 * Each function fills a Float32Array (length N*3) with the positions of
 * a single "idea": Life → Biology → Intelligence → Research → Engineering
 * → Innovation → Leadership → Policy → Technology → Global → Future.
 *
 * The particles never fade out — they are continuously re-targeted from
 * one formation to the next, so DNA literally becomes a neural network,
 * which becomes a brain, which becomes cells, and so on.
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

/** 1 — DNA double helix (Life / Biology). */
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
      // base-pair rung between the two strands
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

/** 2 — Layered neural network (Intelligence). */
const neural: Builder = (n) => {
  const p = new Float32Array(n * 3)
  const rng = mulberry32(2)
  const layers = 6
  const span = 11
  for (let i = 0; i < n; i++) {
    const layer = Math.floor((i / n) * layers)
    const x = (layer / (layers - 1) - 0.5) * span
    // nodes spread on a disc, denser toward the centre
    const rad = Math.pow(rng(), 0.6) * 3.2
    const ang = rng() * TAU
    p[i * 3] = x + (rng() - 0.5) * 0.6
    p[i * 3 + 1] = Math.sin(ang) * rad
    p[i * 3 + 2] = Math.cos(ang) * rad
  }
  return p
}

/** 3 — Brain-like lumpy shell (Mind). */
const brain: Builder = (n) => {
  const p = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const [x, y, z] = fibSphere(i, n, 3.2)
    // gyri/sulci folds via layered sine displacement
    const fold =
      1 +
      0.12 * Math.sin(x * 3.1) +
      0.12 * Math.sin(y * 2.7 + 1.3) +
      0.1 * Math.sin(z * 3.4 + 2.1)
    p[i * 3] = x * fold * 1.15 // slightly wider than tall
    p[i * 3 + 1] = y * fold * 0.95
    p[i * 3 + 2] = z * fold
  }
  return p
}

/** 4 — Dividing cells (Research begins). */
const cells: Builder = (n) => {
  const p = new Float32Array(n * 3)
  const rng = mulberry32(4)
  const clusters = 7
  const centers: [number, number, number][] = []
  for (let c = 0; c < clusters; c++) {
    const ang = (c / clusters) * TAU
    const rr = 3.4
    centers.push([Math.cos(ang) * rr, (rng() - 0.5) * 3, Math.sin(ang) * rr])
  }
  for (let i = 0; i < n; i++) {
    const c = centers[i % clusters]
    const [sx, sy, sz] = fibSphere(i, n, 1.0)
    p[i * 3] = c[0] + sx
    p[i * 3 + 1] = c[1] + sy
    p[i * 3 + 2] = c[2] + sz
  }
  return p
}

/** 5 — Metabolic network graph (Systems biology). */
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
      // node clusters at hubs
      const h = hubPos[i % hubs]
      p[i * 3] = h[0] + (rng() - 0.5) * 0.5
      p[i * 3 + 1] = h[1] + (rng() - 0.5) * 0.5
    } else {
      // edges: points along lines between two hubs (flux pathways)
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

/** 6 — Bioreactor / engineering vessel (Engineering). */
const reactor: Builder = (n) => {
  const p = new Float32Array(n * 3)
  const rng = mulberry32(6)
  const radius = 2.4
  const height = 8.5
  for (let i = 0; i < n; i++) {
    const r = i % 11 === 0 ? rng() * radius : radius // mostly shell, some interior sensors
    const ang = (i / n) * TAU * 24
    p[i * 3] = Math.cos(ang) * r
    p[i * 3 + 1] = (i / n - 0.5) * height
    p[i * 3 + 2] = Math.sin(ang) * r
  }
  return p
}

/** 7 — Floating architecture cubes (Software / Products). */
const cubes: Builder = (n) => {
  const p = new Float32Array(n * 3)
  const rng = mulberry32(7)
  const grid = 3
  const gap = 3.4
  const size = 1.1
  for (let i = 0; i < n; i++) {
    const gx = Math.floor(rng() * grid) - 1
    const gy = Math.floor(rng() * grid) - 1
    const gz = Math.floor(rng() * grid) - 1
    // sample a point on the edges of a cube (wireframe feel)
    const edge = Math.floor(rng() * 3)
    const a = (rng() - 0.5) * size
    const b = rng() < 0.5 ? -size / 2 : size / 2
    const c = rng() < 0.5 ? -size / 2 : size / 2
    let x = a,
      y = b,
      z = c
    if (edge === 1) {
      x = b
      y = a
      z = c
    } else if (edge === 2) {
      x = b
      y = c
      z = a
    }
    p[i * 3] = gx * gap + x
    p[i * 3 + 1] = gy * gap + y
    p[i * 3 + 2] = gz * gap + z
  }
  return p
}

/** 8 — Constellation of stars & medals (Achievements). */
const constellation: Builder = (n) => {
  const p = new Float32Array(n * 3)
  const rng = mulberry32(8)
  for (let i = 0; i < n; i++) {
    if (i % 6 === 0) {
      // bright clustered "medals"
      const [x, y, z] = fibSphere(i % 40, 40, 4.5)
      p[i * 3] = x + (rng() - 0.5) * 0.3
      p[i * 3 + 1] = y + (rng() - 0.5) * 0.3
      p[i * 3 + 2] = z + (rng() - 0.5) * 0.3
    } else {
      // scattered star field
      const [x, y, z] = fibSphere(i, n, 3 + rng() * 4)
      p[i * 3] = x
      p[i * 3 + 1] = y
      p[i * 3 + 2] = z
    }
  }
  return p
}

/** 9 — Community rings — people connecting (Leadership). */
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

/** 10 — Institutional skyline — abstract, never political (Policy). */
const institutions: Builder = (n) => {
  const p = new Float32Array(n * 3)
  const rng = mulberry32(10)
  const bars = 7
  const barW = 1.4
  for (let i = 0; i < n; i++) {
    const bar = i % bars
    const x = (bar - (bars - 1) / 2) * (barW + 0.5)
    const h = 3 + ((bar * 2.7) % 5) // varied building heights
    p[i * 3] = x + (rng() - 0.5) * barW
    p[i * 3 + 1] = rng() * h - 3.5
    p[i * 3 + 2] = (rng() - 0.5) * barW
  }
  return p
}

/** 11 — Dashboard grid — tools & instruments (Technology). */
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

/** 12 — Earth + satellite ring (Global impact). */
const globe: Builder = (n) => {
  const p = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    if (i % 8 === 0) {
      // tilted orbital ring of satellites
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

/** 13 — Converging orbit — resolves toward the logo (Future). */
const orbit: Builder = (n) => {
  const p = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * TAU * 3
    const r = 2.2
    // a luminous double torus that the CSS logo/signature rises out of
    const wobble = 0.4 * Math.sin(i * 0.05)
    p[i * 3] = Math.cos(ang) * (r + wobble)
    p[i * 3 + 1] = Math.sin(ang) * (r + wobble)
    p[i * 3 + 2] = Math.sin(ang * 2) * 0.6
  }
  return p
}

export interface Keyframe {
  name: string
  build: Builder
  /** RGB in 0..1, the dominant hue of this idea. */
  color: [number, number, number]
}

/** The ordered story. Scroll progress 0→1 sweeps through these. */
export const STORY: Keyframe[] = [
  { name: 'DNA', build: helix, color: [0.31, 0.62, 1.0] }, // electric blue
  { name: 'Neural', build: neural, color: [0.55, 0.36, 0.96] }, // violet
  { name: 'Mind', build: brain, color: [0.45, 0.5, 1.0] },
  { name: 'Cells', build: cells, color: [0.06, 0.72, 0.5] }, // emerald
  { name: 'Metabolism', build: metabolic, color: [0.1, 0.78, 0.55] },
  { name: 'Engineering', build: reactor, color: [0.24, 0.7, 0.95] },
  { name: 'Products', build: cubes, color: [0.31, 0.62, 1.0] },
  { name: 'Achievements', build: constellation, color: [1.0, 0.83, 0.47] }, // warm gold
  { name: 'Leadership', build: community, color: [0.6, 0.4, 0.98] },
  { name: 'Policy', build: institutions, color: [0.65, 0.75, 1.0] },
  { name: 'Technology', build: grid, color: [0.24, 0.8, 0.86] }, // cyan
  { name: 'Global', build: globe, color: [0.2, 0.66, 0.98] },
  { name: 'Future', build: orbit, color: [0.9, 0.93, 1.0] }, // near-white
]

/** Precompute every formation's buffer once for a given particle count. */
export function buildFormations(n: number) {
  return STORY.map((k) => ({ ...k, positions: k.build(n) }))
}
