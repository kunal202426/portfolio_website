import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export interface WormholeCard {
  caption: string
  title: string
  description: string
}

interface CareerWormholeProps {
  cards: WormholeCard[]
  scrollLengthVh?: number
}

// Adapted from a Framer "Wormhole" reference: a sticky scroll-jacked 3D
// tunnel (Three.js tube geometry + a procedural grid texture) that the
// camera flies through as the page scrolls, with glass cards positioned
// along the tube walls and projected onto the 2D screen every frame.
export const CareerWormhole = ({ cards, scrollLengthVh = 320 }: CareerWormholeProps) => {
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
      scrollPercent += (targetScrollPercent - scrollPercent) * 0.08
      const cameraEval = Math.min(Math.max(scrollPercent, 0), 0.99)
      const lookAtEval = Math.min(Math.max(scrollPercent + 0.04, 0), 1)
      const camPos = curve.getPointAt(cameraEval)
      const lookPos = curve.getPointAt(lookAtEval)
      camera.position.copy(camPos)
      camera.lookAt(lookPos)

      texture.offset.x += tunnelSpeed
      texture.offset.y = scrollPercent * 2

      cardsData.forEach((card) => {
        if (!card.el) return
        const cardPos3D = curve.getPointAt(card.progress)
        const wallDistance = 1.2
        cardPos3D.x += Math.cos(card.angle) * wallDistance
        cardPos3D.y += Math.sin(card.angle) * wallDistance
        const wp = cardPos3D.clone()
        wp.project(camera)
        const distance = camera.position.distanceTo(cardPos3D)

        if (wp.z < 1 && distance < 14 && distance > 0.4) {
          const currentWidth = container.offsetWidth
          const currentHeight = container.offsetHeight
          const x = (wp.x * 0.5 + 0.5) * currentWidth
          const y = (-(wp.y * 0.5) + 0.5) * currentHeight
          const scale = Math.max(0, 1 - distance / 14)
          card.el.style.opacity = String(scale * 1.4)
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
            <div
              key={card.title}
              ref={(node) => { cardRefs.current[i] = node }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: 14,
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                padding: 24,
                width: 280,
                color: '#fff',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
                opacity: 0,
                pointerEvents: 'auto',
                willChange: 'transform, opacity',
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
                  color: 'var(--accent-glow)',
                }}
              >
                {card.caption}
              </span>
              <h3 className="font-display" style={{ margin: '0 0 12px', fontSize: 22, color: '#fff' }}>
                {card.title}
              </h3>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.8)' }}>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
