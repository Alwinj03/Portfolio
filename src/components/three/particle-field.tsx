'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Interactive particle field that oscillates between a DNA double-helix
 * and a neural-network cloud, reacting to the pointer. This is the
 * signature hero background — "DNA becomes neural network".
 */
function Particles({ count = 1400 }: { count?: number }) {
  const points = useRef<THREE.Points>(null)
  const { pointer } = useThree()

  // Precompute the two target formations: helix + cloud.
  const { positions, helix, cloud } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const helix = new Float32Array(count * 3)
    const cloud = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 12
      const strand = i % 2 === 0 ? 0 : Math.PI
      const radius = 2.4
      helix[i * 3] = Math.cos(t + strand) * radius
      helix[i * 3 + 1] = (i / count) * 16 - 8
      helix[i * 3 + 2] = Math.sin(t + strand) * radius

      cloud[i * 3] = (Math.random() - 0.5) * 14
      cloud[i * 3 + 1] = (Math.random() - 0.5) * 14
      cloud[i * 3 + 2] = (Math.random() - 0.5) * 8

      positions[i * 3] = helix[i * 3]
      positions[i * 3 + 1] = helix[i * 3 + 1]
      positions[i * 3 + 2] = helix[i * 3 + 2]
    }
    return { positions, helix, cloud }
  }, [count])

  useFrame((state) => {
    const geo = points.current?.geometry
    if (!geo) return
    const arr = geo.attributes.position.array as Float32Array
    // Morph factor breathes slowly between helix (0) and cloud (1).
    const m = (Math.sin(state.clock.elapsedTime * 0.18) + 1) / 2
    for (let i = 0; i < arr.length; i++) {
      arr[i] += (helix[i] * (1 - m) + cloud[i] * m - arr[i]) * 0.02
    }
    geo.attributes.position.needsUpdate = true

    if (points.current) {
      points.current.rotation.y += 0.0015
      points.current.rotation.x = THREE.MathUtils.lerp(
        points.current.rotation.x,
        pointer.y * 0.3,
        0.03,
      )
      points.current.rotation.z = THREE.MathUtils.lerp(
        points.current.rotation.z,
        pointer.x * 0.2,
        0.03,
      )
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#4f9dff"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function ParticleField() {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const smallScreen = window.innerWidth < 640
    setEnabled(!reduce && !smallScreen)
  }, [])

  if (!enabled) return null

  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 12], fov: 60 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <Particles />
    </Canvas>
  )
}
