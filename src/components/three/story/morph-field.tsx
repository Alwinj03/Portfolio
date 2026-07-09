'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { buildFormations } from './formations'

const COUNT = 4200

/** A soft radial dot so every particle glows instead of drawing a hard square. */
function makeSprite() {
  const s = 64
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.3, 'rgba(255,255,255,0.7)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const smoothstep = (t: number) => t * t * (3 - 2 * t)

/**
 * The single, persistent particle system. It reads the page's scroll
 * progress every frame and lerps the live positions toward a blend of the
 * two nearest story formations — so the geometry is always mid-transformation,
 * never cutting or fading between scenes.
 */
export function MorphField() {
  const pointsRef = useRef<THREE.Points>(null)
  const { pointer, camera } = useThree()

  const sprite = useMemo(() => makeSprite(), [])
  const formations = useMemo(() => buildFormations(COUNT), [])

  // Live buffer the particles currently occupy (starts at the first formation).
  const live = useMemo(() => new Float32Array(formations[0].positions), [formations])

  const color = useMemo(() => new THREE.Color(...formations[0].color), [formations])
  const tmpColor = useMemo(() => new THREE.Color(), [])
  const smoothed = useRef(0)
  const rot = useRef({ x: 0, y: 0 })

  useFrame((_, delta) => {
    const geom = pointsRef.current?.geometry
    if (!geom) return
    const dt = Math.min(delta, 0.05)

    // 1 — Scroll → target progress (0 at top of page, 1 at the very bottom).
    const doc = document.documentElement
    const max = doc.scrollHeight - window.innerHeight
    const target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    // Ease the progress itself so morphs settle with weight instead of snapping.
    smoothed.current += (target - smoothed.current) * Math.min(1, dt * 3.5)
    const p = smoothed.current

    // 2 — Which two formations are we between?
    const seg = p * (formations.length - 1)
    const i = Math.min(formations.length - 2, Math.floor(seg))
    const f = smoothstep(seg - i)
    const A = formations[i].positions
    const B = formations[i + 1].positions

    // 3 — Re-target live positions toward the blend (continuous morph).
    const arr = live
    const follow = Math.min(1, dt * 2.4)
    for (let k = 0; k < arr.length; k++) {
      const goal = A[k] + (B[k] - A[k]) * f
      arr[k] += (goal - arr[k]) * follow
    }
    const attr = geom.attributes.position as THREE.BufferAttribute
    attr.array.set(arr)
    attr.needsUpdate = true

    // 4 — Blend the dominant hue between the two ideas.
    tmpColor.setRGB(
      formations[i].color[0] + (formations[i + 1].color[0] - formations[i].color[0]) * f,
      formations[i].color[1] + (formations[i + 1].color[1] - formations[i].color[1]) * f,
      formations[i].color[2] + (formations[i + 1].color[2] - formations[i].color[2]) * f,
    )
    color.lerp(tmpColor, follow)
    ;(pointsRef.current!.material as THREE.PointsMaterial).color.copy(color)

    // 5 — Alive: gentle idle spin + mouse parallax with spring-like easing.
    rot.current.y += (pointer.x * 0.35 - rot.current.y) * 0.04
    rot.current.x += (-pointer.y * 0.25 - rot.current.x) * 0.04
    pointsRef.current!.rotation.y += dt * 0.05
    pointsRef.current!.rotation.x = rot.current.x
    pointsRef.current!.rotation.z = rot.current.y * 0.3

    // 6 — Cinematic camera: push in through the middle, pull back for the finale.
    const dolly = 12 + Math.sin(p * Math.PI) * -1.5 + (p > 0.8 ? (p - 0.8) * 22 : 0)
    camera.position.z += (dolly - camera.position.z) * 0.04
    camera.lookAt(0, 0, 0)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[live, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        size={0.14}
        sizeAttenuation
        transparent
        opacity={0.92}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
