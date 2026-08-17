import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import * as THREE from 'three'

export interface WormholeCard {
  caption: string
  title: string
  description: string
  details?: string[]
}

interface CareerWormholeProps {
  cards: WormholeCard[]
  scrollLengthVh?: number
}

const CARD_HEIGHT = 220

// The outer (ref'd) element's transform/opacity/zIndex are driven
// imperatively by the render loop every frame for the 3D projection, so the
// click-reveal has to live on an inner wrapper instead - React/framer-motion
// only ever touch that inner tree, never the outer positioned box.
//
// The reveal itself is the original peel-away: the front card (company/
// title/period) sits over an achievements panel and slides down + rotates
// clear on tap/click, like a note peeling off a photo, instead of a plain
// accordion - ported over from the old vertical-timeline ExperienceCard.
// Click-only (not hover) to match the Education/Achievement cards elsewhere.
function WormholeCardEl({ card, cardRef }: { card: WormholeCard; cardRef: (node: HTMLDivElement | null) => void }) {
  const [open, setOpen] = useState(false)
  const hasDetails = !!card.details?.length

  return (
    <div
      ref={cardRef}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 280,
        opacity: 0,
        pointerEvents: 'auto',
        willChange: 'transform, opacity',
      }}
    >
      <div
        onClick={() => setOpen((h) => !h)}
        style={{
          position: 'relative',
          height: CARD_HEIGHT,
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
          cursor: hasDetails ? 'pointer' : 'default',
        }}
      >
        {/* Back: achievements panel, always present underneath */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: 22,
            overflowY: 'auto',
            background: 'rgba(10, 9, 16, 0.94)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
          }}
        >
          <span
            style={{
              display: 'block',
              marginBottom: 10,
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent-glow)',
            }}
          >
            {card.caption} highlights
          </span>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {card.details?.map((line, i) => (
              <li key={i} style={{ display: 'flex', gap: 8, fontSize: 12.5, lineHeight: 1.5, color: 'rgba(255,255,255,0.82)' }}>
                <span style={{ flexShrink: 0, color: 'var(--accent-glow)' }}>▸</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Front: slides fully clear on reveal, clipped by the container's
            overflow:hidden so it reads as peeling away rather than overlapping. */}
        <motion.div
          animate={{ y: open ? '108%' : 0, rotate: open ? 3 : 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          style={{
            position: 'absolute',
            inset: 0,
            padding: 22,
            transformOrigin: 'center',
            background: open ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.13)',
            backdropFilter: 'blur(18px) saturate(180%)',
            WebkitBackdropFilter: 'blur(18px) saturate(180%)',
            border: `1px solid ${open ? 'transparent' : 'rgba(255, 255, 255, 0.32)'}`,
            transition: 'background-color 0.2s ease, border-color 0.2s ease',
            color: '#fff',
          }}
        >
          <span
            style={{
              display: 'block',
              marginBottom: 8,
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: open ? 'rgba(255,255,255,0.85)' : 'var(--accent-glow)',
            }}
          >
            {card.caption}
          </span>
          <h3 className="font-display" style={{ margin: '0 0 12px', fontSize: 22, color: '#fff' }}>
            {card.title}
          </h3>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.85)' }}>{card.description}</p>

          {hasDetails && (
            <p
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                margin: '14px 0 0',
                fontSize: 11,
                color: open ? 'rgba(255,255,255,0.85)' : 'var(--accent-glow)',
                opacity: 0.9,
              }}
            >
              <Sparkles size={11} />
              Tap to see highlights
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}

// Adapted from a Framer "Wormhole" reference: a sticky scroll-jacked 3D
// tunnel (Three.js tube geometry + a procedural grid texture) that the
// camera flies through as the page scrolls, with glass cards positioned
// along the tube walls and projected onto the 2D screen every frame.
export const CareerWormhole = ({ cards, scrollLengthVh = 460 }: CareerWormholeProps) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const rootStyles = getComputedStyle(document.documentElement)
    const accent = rootStyles.getPropertyValue('--accent-primary').trim() || '#BF5B3D'
    const backgroundColor = '#050508'
    const tunnelSpeed = 0.0008

    let width = container.offsetWidth
    let height = container.offsetHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1.5, 2, -10),
      new THREE.Vector3(-2, -1, -20),
      new THREE.Vector3(1, -2.5, -30),
      new THREE.Vector3(0, 0, -45),
    ])

    const texCanvas = document.createElement('canvas')
    texCanvas.width = 256
    texCanvas.height = 256
    const ctx = texCanvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, 256, 256)
      ctx.strokeStyle = accent
      ctx.lineWidth = 2
      for (let i = 0; i <= 256; i += 32) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, 256)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(256, i)
        ctx.stroke()
      }
    }
    const texture = new THREE.CanvasTexture(texCanvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(12, 4)

    const tubeGeo = new THREE.TubeGeometry(curve, 100, 2.8, 16, false)
    const tubeMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })
    scene.add(new THREE.Mesh(tubeGeo, tubeMat))

    const angles = [0.5, 2.6, 4.5, 1.2, 3.6, 5.4]
    const cardsData = cards.map((card, i) => ({
      progress: (i + 1) / (cards.length + 1),
      angle: angles[i % angles.length],
      el: cardRefs.current[i] ?? null,
    }))

    let scrollPercent = 0
    let targetScrollPercent = 0

    const handleScroll = () => {
      const rect = track.getBoundingClientRect()
      const totalScrollableDistance = rect.height - window.innerHeight
      if (totalScrollableDistance <= 0) return
      const relativeProgress = -rect.top / totalScrollableDistance
      targetScrollPercent = Math.min(Math.max(relativeProgress, 0), 1)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    let frameId = 0
    const animate = () => {
      // Plain constant-rate smoothing, same speed the whole way through -
      // no per-card slowdown. That dwell mechanic (several iterations of it)
      // made the pacing feel inconsistent and was part of what broke on
      // phone; a flat, predictable scroll-to-camera mapping is simpler and
      // more robust across devices.
      scrollPercent += (targetScrollPercent - scrollPercent) * 0.045
      const cameraEval = Math.min(Math.max(scrollPercent, 0), 0.99)
      const lookAtEval = Math.min(Math.max(scrollPercent + 0.02, 0), 1)
      const camPos = curve.getPointAt(cameraEval)
      const lookPos = curve.getPointAt(lookAtEval)
      camera.position.copy(camPos)
      camera.lookAt(lookPos)

      texture.offset.x += tunnelSpeed
      texture.offset.y = scrollPercent * 2

      const maxDistance = 16
      // Narrow (phone) viewports leave little margin around a fixed-width
      // card, so the same world-space wall offset that reads fine on
      // desktop pushes the card visibly off-center there - pull cards in
      // closer to the tube's centerline on narrow screens instead.
      const isNarrowViewport = container.offsetWidth < 640
      cardsData.forEach((card) => {
        if (!card.el) return
        const cardPos3D = curve.getPointAt(card.progress)
        const wallDistance = isNarrowViewport ? 0.45 : 1.05
        cardPos3D.x += Math.cos(card.angle) * wallDistance
        cardPos3D.y += Math.sin(card.angle) * wallDistance
        const wp = cardPos3D.clone()
        wp.project(camera)
        const distance = camera.position.distanceTo(cardPos3D)

        if (wp.z < 1 && distance < maxDistance && distance > 0.3) {
          const currentWidth = container.offsetWidth
          const currentHeight = container.offsetHeight
          const x = (wp.x * 0.5 + 0.5) * currentWidth
          const y = (-(wp.y * 0.5) + 0.5) * currentHeight
          // Floors both scale and opacity so a card is still legible well
          // before it's right on top of the camera, instead of only
          // resolving into something readable for the last instant.
          const proximity = Math.min(Math.max(1 - distance / maxDistance, 0), 1)
          const scale = 0.55 + proximity * 0.6
          card.el.style.opacity = String(Math.min(proximity * 1.8, 1))
          card.el.style.transform = `translate3d(-50%, -50%, 0px) translate3d(${x}px, ${y}px, 0px) scale(${scale})`
          card.el.style.zIndex = String(Math.round((1 - wp.z) * 100))
        } else {
          card.el.style.opacity = '0'
        }
      })

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      if (!container) return
      width = container.offsetWidth
      height = container.offsetHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      tubeGeo.dispose()
      tubeMat.dispose()
      texture.dispose()
      container.innerHTML = ''
    }
  }, [cards])

  return (
    <div ref={trackRef} style={{ width: '100%', height: `${scrollLengthVh}vh`, position: 'relative', background: '#050508' }}>
      <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', perspective: 1000 }}>
          {cards.map((card, i) => (
            <WormholeCardEl key={card.title} card={card} cardRef={(node) => { cardRefs.current[i] = node }} />
          ))}
        </div>
      </div>
    </div>
  )
}
