import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMousePosition, useReducedMotion } from '../../hooks'

/**
 * Detect mobile device
 */
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Adaptive particle count based on device
 */
const getParticleCount = () => {
  if (isMobile()) return 800 // Reduced for mobile
  return window.innerWidth < 1024 ? 1200 : 2000
}

/**
 * Generates points on a torus knot curve for particle placement
 */
function torusKnotPoints(segments: number = 300, scale: number = 3) {
  const points: THREE.Vector3[] = []
  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2 * 2
    const p = 3
    const q = 4
    const r = 5

    const x = r * Math.cos(t) * (Math.cos((p * t) / q) + 2) * scale
    const y = r * Math.sin(t) * (Math.cos((p * t) / q) + 2) * scale
    const z = r * Math.sin((p * t) / q) * scale * 0.8

    points.push(new THREE.Vector3(x, y, z))
  }
  return points
}

/**
 * ParticleField - Interactive particle system with performance optimizations
 */
const ParticleField = ({ mouseX, mouseY }: { mouseX: number; mouseY: number }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const positionsRef = useRef<Float32Array | null>(null)
  const velocityRef = useRef<Float32Array | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const frameCountRef = useRef(0)

  // Adaptive particle count
  const particleCount = useMemo(() => getParticleCount(), [])
  
  // Throttle mouse tracking on mobile
  const shouldUpdateMouse = useMemo(() => !isMobile() || frameCountRef.current % 3 === 0, [])

  useEffect(() => {
    if (!meshRef.current) return

    const trajectory = torusKnotPoints(300)
    const positions = new Float32Array(particleCount * 3)
    const velocity = new Float32Array(particleCount * 3)

    // Place particles around trajectory
    for (let i = 0; i < particleCount; i++) {
      const point = trajectory[Math.floor(Math.random() * trajectory.length)]
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 1.5

      positions[i * 3] = point.x + Math.cos(angle) * radius
      positions[i * 3 + 1] = point.y + Math.sin(angle) * radius
      positions[i * 3 + 2] = point.z + (Math.random() - 0.5) * 1.5

      velocity[i * 3] = (Math.random() - 0.5) * 0.15
      velocity[i * 3 + 1] = (Math.random() - 0.5) * 0.15
      velocity[i * 3 + 2] = (Math.random() - 0.5) * 0.15
    }

    positionsRef.current = positions
    velocityRef.current = velocity

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: new THREE.Color('#6C63FF'),
      size: isMobile() ? 0.3 : 0.4, // Smaller on mobile
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    })

    const points = new THREE.Points(geometry, material)
    meshRef.current.add(points)

    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [particleCount])

  useFrame(() => {
    if (!meshRef.current || !positionsRef.current || !velocityRef.current) return

    frameCountRef.current++
    
    const vel = velocityRef.current
    const repulsionRadius = 15
    const repulsionForce = 0.6

    // Slow rotation
    meshRef.current.rotation.x += 0.0001
    meshRef.current.rotation.y += 0.0003
    meshRef.current.rotation.z += 0.00005

    const points = meshRef.current.children[0] as THREE.Points

    if (points && points.geometry instanceof THREE.BufferGeometry) {
      const posAttr = points.geometry.getAttribute('position') as THREE.BufferAttribute
      const posArray = posAttr.array as Float32Array

      // Process only every Nth frame on mobile for mouse tracking
      const processMouseRepulsion = !prefersReducedMotion && (frameCountRef.current % 2 === 0 || !isMobile())

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3

        // Apply velocity
        posArray[i3] += vel[i3] * 0.03
        posArray[i3 + 1] += vel[i3 + 1] * 0.03
        posArray[i3 + 2] += vel[i3 + 2] * 0.03

        // Damping
        vel[i3] *= 0.95
        vel[i3 + 1] *= 0.95
        vel[i3 + 2] *= 0.95

        if (processMouseRepulsion) {
          // Mouse repulsion (convert screen space to world space)
          const screenX = (mouseX / window.innerWidth) * 2 - 1
          const screenY = -(mouseY / window.innerHeight) * 2 + 1

          const worldPos = new THREE.Vector3(screenX * 15, screenY * 10, -5)

          const dx = posArray[i3] - worldPos.x
          const dy = posArray[i3 + 1] - worldPos.y
          const dz = posArray[i3 + 2] - worldPos.z
          const distanceSq = dx * dx + dy * dy + dz * dz
          const distance = Math.sqrt(distanceSq)

          if (distance < repulsionRadius && distance > 0.1) {
            const force = (repulsionRadius - distance) / repulsionRadius * repulsionForce
            vel[i3] += (dx / distance) * force * 0.08
            vel[i3 + 1] += (dy / distance) * force * 0.08
            vel[i3 + 2] += (dz / distance) * force * 0.08
          }
        }

        // Keep particles within bounds
        if (Math.abs(posArray[i3]) > 30) {
          vel[i3] *= -0.5
        }
        if (Math.abs(posArray[i3 + 1]) > 30) {
          vel[i3 + 1] *= -0.5
        }
        if (Math.abs(posArray[i3 + 2]) > 30) {
          vel[i3 + 2] *= -0.5
        }
      }

      posAttr.needsUpdate = true
    }
  })

  return <mesh ref={meshRef} />
}

/**
 * Glow Orb - Ambient drifting sphere with LOD
 */
const GlowOrb = ({
  position,
  color,
  size,
}: {
  position: [number, number, number]
  color: string
  size: number
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  // Reduced geometry quality on mobile
  const segments = useMemo(() => (isMobile() ? 16 : 32), [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    meshRef.current.position.x = position[0] + Math.sin(clock.elapsedTime * 0.3) * 3
    meshRef.current.position.y = position[1] + Math.cos(clock.elapsedTime * 0.25) * 3
    meshRef.current.position.z = position[2] + Math.sin(clock.elapsedTime * 0.2) * 2
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, segments, segments]} />
      <meshPhongMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.15}
        wireframe={false}
      />
    </mesh>
  )
}

/**
 * Scene content
 */
const HeroSceneContent = () => {
  const { x: mouseX, y: mouseY } = useMousePosition()

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[20, 20, 20]} intensity={0.4} />
      <pointLight position={[-20, -20, 20]} intensity={0.2} color="#00E5FF" />

      <ParticleField mouseX={mouseX} mouseY={mouseY} />

      {/* Glow orbs */}
      <GlowOrb position={[15, -10, -20]} color="#6C63FF" size={6} />
      <GlowOrb position={[-15, 10, -15]} color="#00E5FF" size={8} />
      <GlowOrb position={[5, 0, -25]} color="#FF3CAC" size={7} />
    </>
  )
}

/**
 * HeroScene - Full viewport WebGL canvas with performance optimizations
 */
export const HeroScene = () => {
  // Adaptive DPR based on device
  const dpr = useMemo(() => {
    if (isMobile()) return 1
    return Math.min(window.devicePixelRatio, 2)
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60, near: 0.1, far: 1000 }}
        dpr={dpr}
        gl={{
          antialias: !isMobile(), // Disable AA on mobile
          alpha: true,
          powerPreference: 'high-performance',
          logarithmicDepthBuffer: false,
          stencil: false, // Disable stencil buffer
        }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        frameloop="demand" // Only render on changes
      >
        <HeroSceneContent />
      </Canvas>
    </div>
  )
}
