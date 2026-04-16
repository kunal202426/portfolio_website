import { useEffect, useMemo, useRef } from 'react'
import { useLenis } from '../../providers/LenisProvider'
import './RolesInterestSection.css'

const CONFIG = {
  itemCount: 20,
  starCount: 150,
  zGap: 800,
  camSpeed: 2.5,
}

const LOOP_SIZE = CONFIG.itemCount * CONFIG.zGap
const TUNNEL_SCROLL_DISTANCE = ((CONFIG.itemCount - 1) * CONFIG.zGap) / CONFIG.camSpeed
const VELOCITY_SMOOTHING = 0.06
const LOCK_SCROLL_DISTANCE = 4800
const RENDER_PROGRESS_SMOOTHING = 0.18

const TEXTS = [
  'FULL STACK DEVELOPER',
  'SOFTWARE DESIGNER',
  'FULL STACK INTERN',
  'AI SOFTWARE ENGINEER',
  'ML ENGINEER',
  'DATA ANALYST',
  'BACKEND ENGINEER',
  'FRONTEND ENGINEER',
  'REACT DEVELOPER',
  'NODE JS DEVELOPER',
  'FASTAPI DEVELOPER',
  'AI ENGINEER',
  'DATA ENGINEER',
  'ANALYTICS ENGINEER',
  'MICROSERVICES ENGINEER',
  'TRADING PLATFORM DEV',
  'SYSTEM DESIGN ENGINEER',
  'DISTRIBUTED SYSTEMS',
  'DATA PIPELINE DEV',
  'BLOCKCHAIN DEVELOPER',
  'SMART CONTRACT DEV',
  'WEB3 DEVELOPER',
  'FINTECH DEVELOPER',
  'COMPUTER VISION',
  'NLP ENGINEER',
  'THREE JS DEVELOPER',
  'WEBGL DEVELOPER',
  'THREE D WEB DEVELOPER',
  'PRODUCT ENGINEER',
  'RESEARCH ENGINEER',
]

type TextSceneItem = {
  id: string
  kind: 'text'
  text: string
  x: number
  y: number
  rot: number
  baseZ: number
}

type CardSceneItem = {
  id: string
  kind: 'card'
  text: string
  randId: number
  gridX: number
  gridY: number
  dataSize: string
  indexLabel: string
  x: number
  y: number
  rot: number
  baseZ: number
}

type StarSceneItem = {
  id: string
  kind: 'star'
  x: number
  y: number
  rot: number
  baseZ: number
}

type SceneItem = TextSceneItem | CardSceneItem | StarSceneItem

function buildSceneItems(): SceneItem[] {
  const items: SceneItem[] = []

  for (let i = 0; i < CONFIG.itemCount; i++) {
    const isFinalItem = i === CONFIG.itemCount - 1
    const isHeading = i % 4 === 0 && !isFinalItem

    if (isHeading) {
      items.push({
        id: `text-${i}`,
        kind: 'text',
        text: TEXTS[i % TEXTS.length],
        x: 0,
        y: 0,
        rot: 0,
        baseZ: -i * CONFIG.zGap,
      })
      continue
    }

    const angle = (i / CONFIG.itemCount) * Math.PI * 6
    const x = isFinalItem ? 0 : Math.cos(angle) * (window.innerWidth * 0.3)
    const y = isFinalItem ? 0 : Math.sin(angle) * (window.innerHeight * 0.3)
    const rot = isFinalItem ? 0 : (Math.random() - 0.5) * 30

    items.push({
      id: `card-${i}`,
      kind: 'card',
      text: TEXTS[i % TEXTS.length],
      randId: Math.floor(Math.random() * 9999),
      gridX: Math.floor(Math.random() * 10),
      gridY: Math.floor(Math.random() * 10),
      dataSize: (Math.random() * 100).toFixed(1),
      indexLabel: i < 10 ? `0${i}` : `${i}`,
      x,
      y,
      rot,
      baseZ: -i * CONFIG.zGap,
    })
  }

  for (let i = 0; i < CONFIG.starCount; i++) {
    items.push({
      id: `star-${i}`,
      kind: 'star',
      x: (Math.random() - 0.5) * 3000,
      y: (Math.random() - 0.5) * 3000,
      rot: 0,
      baseZ: -Math.random() * LOOP_SIZE,
    })
  }

  return items
}

export const RolesInterestSection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const rafIdRef = useRef<number | null>(null)
  const lastTimeRef = useRef(0)
  const isVisibleRef = useRef(false)
  const isScrollLockedRef = useRef(false)
  const hasCompletedLockRef = useRef(false)
  const lockProgressRef = useRef(0)
  const renderProgressRef = useRef(0)
  const lockAnchorYRef = useRef<number | null>(null)
  const lastTouchYRef = useRef<number | null>(null)

  const lenis = useLenis()

  const animState = useRef({
    scroll: 0,
    velocity: 0,
    targetSpeed: 0,
    mouseX: 0,
    mouseY: 0,
  })

  const sceneItems = useMemo(() => buildSceneItems(), [])

  useEffect(() => {
    const sectionNode = sectionRef.current
    if (!sectionNode) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        isVisibleRef.current = Boolean(entry?.isIntersecting)
      },
      { root: null, threshold: 0.01 }
    )

    observer.observe(sectionNode)

    return () => {
      observer.disconnect()
      isVisibleRef.current = false
    }
  }, [])

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      animState.current.mouseX = (event.clientX / window.innerWidth - 0.5) * 2
      animState.current.mouseY = (event.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('mousemove', onMouseMove)

    let detachLenis: (() => void) | null = null
    let detachScrollFallback: (() => void) | null = null

    if (lenis) {
      const onLenisScroll = ({ velocity }: { velocity: number }) => {
        animState.current.targetSpeed = velocity
      }

      lenis.on('scroll', onLenisScroll)
      detachLenis = () => {
        lenis.off('scroll', onLenisScroll)
      }
    } else {
      let lastScrollY = window.scrollY
      const onWindowScroll = () => {
        const current = window.scrollY
        animState.current.targetSpeed = current - lastScrollY
        lastScrollY = current
      }
      window.addEventListener('scroll', onWindowScroll, { passive: true })
      detachScrollFallback = () => {
        window.removeEventListener('scroll', onWindowScroll)
      }
    }

    const setScrollLocked = (locked: boolean) => {
      if (isScrollLockedRef.current === locked) return
      isScrollLockedRef.current = locked

      if (!lenis) return
      if (locked) {
        lenis.stop()
      } else {
        lenis.start()
      }
    }

    const getSectionMetrics = () => {
      const node = sectionRef.current
      if (!node) return null

      const rect = node.getBoundingClientRect()
      const topDoc = window.scrollY + rect.top
      const scrollableDistance = Math.max(node.offsetHeight - window.innerHeight, 1)

      return { rect, topDoc, scrollableDistance }
    }

    const shouldCaptureLock = () => {
      if (hasCompletedLockRef.current) return false

      const metrics = getSectionMetrics()
      if (!metrics) return false

      if (isScrollLockedRef.current) return true

      return (
        metrics.rect.top <= 0 &&
        metrics.rect.bottom >= window.innerHeight * 0.35
      )
    }

    const completeLock = () => {
      hasCompletedLockRef.current = true
      lockProgressRef.current = 1
      renderProgressRef.current = 1

      const handoffTargetY = (() => {
        const metrics = getSectionMetrics()
        if (!metrics) return null
        return metrics.topDoc + metrics.scrollableDistance
      })()

      setScrollLocked(false)
      lockAnchorYRef.current = null
      lastTouchYRef.current = null

      if (handoffTargetY === null) return

      if (lenis) {
        requestAnimationFrame(() => {
          lenis.scrollTo(handoffTargetY)
        })
      } else {
        window.scrollTo({ top: handoffTargetY, behavior: 'smooth' })
      }
    }

    const releaseToPreviousSection = () => {
      hasCompletedLockRef.current = false
      lockProgressRef.current = 0
      renderProgressRef.current = 0

      const metrics = getSectionMetrics()
      if (metrics) {
        window.scrollTo({
          top: Math.max(0, metrics.topDoc - 2),
          behavior: 'auto',
        })
      }

      setScrollLocked(false)
      lockAnchorYRef.current = null
      lastTouchYRef.current = null
    }

    const rearmReverseLockIfNeeded = (delta: number) => {
      if (!hasCompletedLockRef.current) return
      if (delta >= 0) return

      const metrics = getSectionMetrics()
      if (!metrics) return

      const nearLockZone =
        metrics.rect.top <= 0 &&
        metrics.rect.bottom >= window.innerHeight * 0.35

      if (!nearLockZone) return

      hasCompletedLockRef.current = false
      lockProgressRef.current = 1
      renderProgressRef.current = 1
      lockAnchorYRef.current = metrics.topDoc
      setScrollLocked(true)
      window.scrollTo({ top: metrics.topDoc, behavior: 'auto' })
    }

    const updateLockProgress = (delta: number) => {
      if (hasCompletedLockRef.current) return

      if (!isScrollLockedRef.current) {
        const metrics = getSectionMetrics()
        if (!metrics) return
        lockAnchorYRef.current = metrics.topDoc
        setScrollLocked(true)
      }

      if (!isScrollLockedRef.current) return

      const normalizedDelta = Math.sign(delta) * Math.min(Math.abs(delta), 120)
      const next = Math.min(1, Math.max(0, lockProgressRef.current + normalizedDelta / LOCK_SCROLL_DISTANCE))
      lockProgressRef.current = next

      if (next >= 1 && normalizedDelta > 0) {
        completeLock()
        return
      }

      if (next <= 0 && normalizedDelta < 0) {
        releaseToPreviousSection()
      }
    }

    const onWheel = (event: WheelEvent) => {
      rearmReverseLockIfNeeded(event.deltaY)

      // If animation is at start and user scrolls up, allow leaving section.
      if (!hasCompletedLockRef.current && lockProgressRef.current <= 0.001 && event.deltaY < 0) {
        setScrollLocked(false)
        lockAnchorYRef.current = null
        return
      }

      if (!shouldCaptureLock()) return
      event.preventDefault()

      if (!isScrollLockedRef.current) {
        const metrics = getSectionMetrics()
        if (metrics) {
          lockAnchorYRef.current = metrics.topDoc
          setScrollLocked(true)
        }
      }

      updateLockProgress(event.deltaY)

      if (lockAnchorYRef.current !== null) {
        window.scrollTo({ top: lockAnchorYRef.current, behavior: 'auto' })
      }
    }

    const onTouchStart = (event: TouchEvent) => {
      if (!shouldCaptureLock()) return

      if (!isScrollLockedRef.current) {
        const metrics = getSectionMetrics()
        if (metrics) {
          lockAnchorYRef.current = metrics.topDoc
          setScrollLocked(true)
        }
      }

      const touch = event.touches[0]
      if (!touch) return
      lastTouchYRef.current = touch.clientY
    }

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return

      if (lastTouchYRef.current === null) {
        lastTouchYRef.current = touch.clientY
        return
      }

      const delta = lastTouchYRef.current - touch.clientY
      lastTouchYRef.current = touch.clientY

      // On reverse at section-start, let native upward scrolling continue.
      if (!hasCompletedLockRef.current && lockProgressRef.current <= 0.001 && delta < 0) {
        setScrollLocked(false)
        lockAnchorYRef.current = null
        return
      }

      rearmReverseLockIfNeeded(delta)
      if (!shouldCaptureLock()) return

      event.preventDefault()
      updateLockProgress(delta)

      if (lockAnchorYRef.current !== null) {
        window.scrollTo({ top: lockAnchorYRef.current, behavior: 'auto' })
      }
    }

    const onTouchEnd = () => {
      lastTouchYRef.current = null
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'PageDown' || (event.key === ' ' && !event.shiftKey)) {
        if (!shouldCaptureLock()) return
        event.preventDefault()
        updateLockProgress(120)

        if (lockAnchorYRef.current !== null) {
          window.scrollTo({ top: lockAnchorYRef.current, behavior: 'auto' })
        }

        return
      }

      if (event.key === 'ArrowUp' || event.key === 'PageUp' || (event.key === ' ' && event.shiftKey)) {
        if (!hasCompletedLockRef.current && lockProgressRef.current <= 0.001) {
          setScrollLocked(false)
          lockAnchorYRef.current = null
          return
        }

        rearmReverseLockIfNeeded(-120)
        if (!shouldCaptureLock()) return

        event.preventDefault()
        updateLockProgress(-120)

        if (lockAnchorYRef.current !== null) {
          window.scrollTo({ top: lockAnchorYRef.current, behavior: 'auto' })
        }
      }
    }

    const onNativeScroll = () => {
      if (!isScrollLockedRef.current || hasCompletedLockRef.current) return
      if (lockAnchorYRef.current === null) return

      if (Math.abs(window.scrollY - lockAnchorYRef.current) > 1) {
        window.scrollTo({ top: lockAnchorYRef.current, behavior: 'auto' })
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: false })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onNativeScroll, { passive: true })

    const raf = (time: number) => {
      const delta = time - lastTimeRef.current || 16.67
      lastTimeRef.current = time

      const s = animState.current

      const targetProgress = hasCompletedLockRef.current ? 1 : lockProgressRef.current
      renderProgressRef.current += (targetProgress - renderProgressRef.current) * RENDER_PROGRESS_SMOOTHING

      let localProgress = renderProgressRef.current

      const metrics = getSectionMetrics()
      if (metrics && !hasCompletedLockRef.current && isScrollLockedRef.current) {
        if (lockAnchorYRef.current !== null) {
          window.scrollTo({ top: lockAnchorYRef.current, behavior: 'auto' })
        }

        localProgress = lockProgressRef.current
      } else if (metrics && !hasCompletedLockRef.current && metrics.rect.top > window.innerHeight * 0.9) {
        localProgress = 0
        lockProgressRef.current = 0
        renderProgressRef.current = 0
        lockAnchorYRef.current = null
        setScrollLocked(false)
      }

      s.scroll = localProgress * TUNNEL_SCROLL_DISTANCE
      s.velocity += (s.targetSpeed - s.velocity) * VELOCITY_SMOOTHING

      if (isVisibleRef.current) {
        const tiltX = s.mouseY * 4 - s.velocity * 0.18
        const tiltY = s.mouseX * 4

        if (worldRef.current) {
          worldRef.current.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
        }

        const baseFov = 1000
        const fov = baseFov - Math.min(Math.abs(s.velocity) * 5, 260)
        if (viewportRef.current) {
          viewportRef.current.style.perspective = `${fov}px`
        }

        const cameraZ = s.scroll * CONFIG.camSpeed

        for (const item of sceneItems) {
          const el = itemRefs.current[item.id]
          if (!el) continue

          const relZ = item.baseZ + cameraZ
          let vizZ = relZ

          if (item.kind === 'star') {
            const modC = LOOP_SIZE
            vizZ = ((relZ % modC) + modC) % modC
            if (vizZ > 500) vizZ -= modC
          }

          let alpha = 1

          if (vizZ < -3000) alpha = 0
          else if (vizZ < -2000) alpha = (vizZ + 3000) / 1000

          if (vizZ > 100 && item.kind !== 'star') {
            alpha = 1 - (vizZ - 100) / 400
          }

          if (item.kind === 'star' && alpha < 0.14) {
            alpha = 0.14
          }

          if (alpha < 0) alpha = 0
          el.style.opacity = `${alpha}`

          if (alpha > 0) {
            let transform = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px)`

            if (item.kind === 'star') {
              const stretch = Math.max(1, Math.min(1 + Math.abs(s.velocity) * 0.05, 5))
              transform += ` scale3d(1, 1, ${stretch})`
              el.style.textShadow = 'none'
            } else if (item.kind === 'text') {
              transform += ` rotateZ(${item.rot}deg)`

              if (Math.abs(s.velocity) > 0.8) {
                const offset = s.velocity * 1.2
                el.style.textShadow = `${offset}px 0 red, ${-offset}px 0 cyan`
              } else {
                el.style.textShadow = 'none'
              }
            } else {
              const t = time * 0.001
              const floating = Math.sin(t + item.x) * 6
              transform += ` rotateZ(${item.rot}deg) rotateY(${floating}deg)`
              el.style.textShadow = 'none'
            }

            el.style.transform = transform
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(raf)
    }

    rafIdRef.current = requestAnimationFrame(raf)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onNativeScroll)

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }

      setScrollLocked(false)

      if (detachLenis) detachLenis()
      if (detachScrollFallback) detachScrollFallback()
    }
  }, [lenis, sceneItems])

  return (
    <section
      ref={sectionRef}
      id="role-interests"
      className="roles-hyper-section"
    >
      <div className="roles-hyper-sticky">
        <div className="roles-hyper-scanlines" />
        <div className="roles-hyper-vignette" />
        <div className="roles-hyper-noise" />

        <div className="roles-hyper-viewport" ref={viewportRef}>
          <div className="roles-hyper-world" ref={worldRef}>
            {sceneItems.map((item) => {
              if (item.kind === 'star') {
                return (
                  <div
                    key={item.id}
                    className="roles-hyper-star"
                    ref={(el) => {
                      itemRefs.current[item.id] = el
                    }}
                  />
                )
              }

              return (
                <div
                  key={item.id}
                  className="roles-hyper-item"
                  ref={(el) => {
                    itemRefs.current[item.id] = el
                  }}
                >
                  {item.kind === 'text' ? (
                    <div className="roles-hyper-big-text">{item.text}</div>
                  ) : (
                    <div className={`roles-hyper-card${item.id === `card-${CONFIG.itemCount - 1}` ? ' roles-hyper-card-final' : ''}`}>
                      <div className="roles-hyper-card-header">
                        <span className="roles-hyper-card-id">ID-{item.randId}</span>
                        <div className="roles-hyper-card-accent-dot" />
                      </div>

                      <h3>{item.text}</h3>

                      <div className="roles-hyper-card-footer">
                        <span>
                          GRID: {item.gridX}x{item.gridY}
                        </span>
                        <span>DATA_SIZE: {item.dataSize}MB</span>
                      </div>

                      <div className="roles-hyper-card-bg-index">{item.indexLabel}</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
