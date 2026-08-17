import { useCallback, useEffect, useMemo, useRef, useState, startTransition, type PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'

export interface StampItem {
  image: { src: string; alt?: string }
  title: string
  caption: string
  description: string
}

const STAMP_ASPECT = 2 / 3

// Postcard swipe: the open card slides in from one side and the outgoing
// card glides off the other, like dealing physical postcards. `dir` is the
// nav direction (1 = next, -1 = prev, 0 = open/close flip).
const POSTCARD_VARIANTS = {
  enter: (dir: number) =>
    dir === 0
      ? { rotateY: 180, scale: 0.5, opacity: 0, x: 0, rotate: 0 }
      : { x: dir > 0 ? 460 : -460, opacity: 0, rotate: dir > 0 ? 4 : -4, rotateY: 0, scale: 1 },
  center: { x: 0, rotateY: 0, scale: 1, opacity: 1, rotate: 0 },
  exit: (dir: number) =>
    dir === 0
      ? { rotateY: 180, scale: 0.5, opacity: 0, x: 0, rotate: 0 }
      : { x: dir > 0 ? -460 : 460, opacity: 0, rotate: dir > 0 ? -4 : 4, rotateY: 0, scale: 1 },
}

function ringRadius(count: number, stampWidth: number, spread: number) {
  if (count < 3) return stampWidth * 0.75 * spread
  return (stampWidth / (2 * Math.tan(Math.PI / count))) * 1.18 * spread
}

// Faint ruled "writing area" lines behind the handwritten message, at a
// fixed line pitch so the script sits on the rules like a real postcard.
function ruledLines(pitch: number) {
  const lineAt = Math.round(pitch * 0.92)
  return {
    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${lineAt - 1}px, rgba(187, 187, 187, 0.55) ${lineAt - 1}px, rgba(187, 187, 187, 0.55) ${lineAt}px, transparent ${lineAt}px, transparent ${pitch}px)`,
  }
}

function StampCard({
  stamp,
  index,
  count,
  radius,
  width,
  height,
  angle,
  shadow,
  onOpen,
  wasDragged,
}: {
  stamp: StampItem
  index: number
  count: number
  radius: number
  width: number
  height: number
  angle: ReturnType<typeof useMotionValue<number>>
  shadow: boolean
  onOpen: (index: number) => void
  wasDragged: () => boolean
}) {
  const step = 360 / count
  const facing = index * step

  // Depth cue: dim cards as they travel around the back of the ring.
  const imageFilter = useTransform(angle, (value) => {
    const relative = (((facing + value) % 360) + 540) % 360 - 180
    const t = Math.abs(relative) / 180
    const brightness = 1 - 0.5 * Math.pow(t, 1.6)
    return `brightness(${brightness.toFixed(3)})${shadow ? ' drop-shadow(0 16px 24px rgba(4, 9, 22, 0.4))' : ''}`
  })

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width,
        height,
        marginLeft: -width / 2,
        marginTop: -height / 2,
        transform: `rotateY(${facing}deg) translateZ(${radius}px)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.button
        type="button"
        aria-label={`Open stamp: ${stamp.title}`}
        onClick={() => {
          if (!wasDragged()) onOpen(index)
        }}
        whileHover={{ scale: 1.05, y: -6 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        style={{ width: '100%', height: '100%', padding: 0, margin: 0, border: 'none', background: 'transparent', cursor: 'pointer', display: 'block' }}
      >
        {stamp.image?.src ? (
          <motion.img
            src={stamp.image.src}
            alt={stamp.image.alt ?? stamp.title}
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', filter: imageFilter }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 6,
              border: '2px dashed rgba(120, 100, 80, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              color: 'rgba(120, 100, 80, 0.8)',
            }}
          />
        )}
      </motion.button>
    </div>
  )
}

// Wax-seal monogram badge: double ring + gold sunburst + centred initial.
function SealBadge({ accentColor, panelColor, monogram }: { accentColor: string; panelColor: string; monogram: string }) {
  const sunburstPoints = Array.from({ length: 24 })
    .map((_, i) => {
      const a = (i / 24) * Math.PI * 2 - Math.PI / 2
      const rad = i % 2 === 0 ? 13.5 : 9
      return `${(22 + Math.cos(a) * rad).toFixed(2)},${(22 + Math.sin(a) * rad).toFixed(2)}`
    })
    .join(' ')

  return (
    <svg width="46" height="46" viewBox="0 0 44 44" aria-hidden="true" style={{ display: 'block', transform: 'rotate(-4deg)' }}>
      <defs>
        <filter id="sealTexture" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves={1} seed={4} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={1.2} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter="url(#sealTexture)">
        <circle cx="22" cy="22" r="21" fill="none" stroke={accentColor} strokeWidth="1.1" />
        <circle cx="22" cy="22" r="18" fill="none" stroke={accentColor} strokeWidth="1.1" />
        <polygon points={sunburstPoints} fill={accentColor} />
        {monogram && (
          <text x="22" y="22.5" textAnchor="middle" dominantBaseline="central" fill={panelColor} fontSize="14" fontWeight={700} fontFamily="Georgia, 'Times New Roman', serif">
            {monogram}
          </text>
        )}
      </g>
    </svg>
  )
}

// Textured "pen ink": desaturated fractal-noise fields clipped to the text
// via background-clip and blended over the ink colour, so the writing gets
// faded/denser patches like a real pen.
const inkNoiseFine = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='210'><filter id='pf'><feTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23pf)'/></svg>`
const inkNoiseCoarse = `<svg xmlns='http://www.w3.org/2000/svg' width='440' height='320'><filter id='pc'><feTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23pc)'/></svg>`
const inkFineUrl = `url("data:image/svg+xml,${encodeURIComponent(inkNoiseFine)}")`
const inkCoarseUrl = `url("data:image/svg+xml,${encodeURIComponent(inkNoiseCoarse)}")`

function texturedInk(color: string, op = 0.9, subtle = false) {
  return {
    opacity: op,
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
    backgroundColor: color,
    backgroundImage: subtle ? inkFineUrl : `${inkCoarseUrl}, ${inkFineUrl}`,
    backgroundBlendMode: subtle ? 'soft-light' : 'soft-light, soft-light',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
  } as const
}

// 3D ring of "stamps" — drag or auto-rotate to spin, click one to lift it
// out into a postcard-style detail view with a handwritten description.
export function CertificationStampCarousel({ stamps, isDark }: { stamps: StampItem[]; isDark: boolean }) {
  const stampHeight = 260
  const spread = 1.15
  const tilt = -6
  const autoRotate = true
  const speed = 8
  const cursorSteer = true
  const hoverSpeed = 20
  const scrollTilt = true
  const scrollTiltStrength = 14
  const stampShadow = true
  const panelColor = '#F7F0E1'
  const backdropColor = 'rgba(7, 15, 35, 0.86)'
  const titleColor = '#1A1208'
  const textColor = 'var(--accent-primary)'
  const accentColor = '#D4A574'
  const sealMonogram = 'K'

  const items = stamps
  const count = items.length
  const reducedMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef)
  const angle = useMotionValue(0)

  const tiltMV = useMotionValue(0)
  const yawTransform = useTransform(angle, (a) => `rotateY(${a}deg)`)
  const tiltTransform = useTransform(tiltMV, (t) => `rotateX(${tilt + t}deg)`)

  const [mounted, setMounted] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState(1)
  const [containerWidth, setContainerWidth] = useState(1200)
  const [viewportNarrow, setViewportNarrow] = useState(false)

  const cardHeight = Math.round(Math.min(stampHeight, Math.max(140, containerWidth * 0.6)))
  const cardWidth = Math.round(cardHeight * STAMP_ASPECT)
  const radius = Math.round(ringRadius(count, cardWidth, spread))

  const draggingRef = useRef(false)
  const dragDistanceRef = useRef(0)
  const lastXRef = useRef(0)
  const lastTimeRef = useRef(0)
  const flingRef = useRef(0)
  const steerVelRef = useRef(speed)
  const pointerNormXRef = useRef(0)
  const tiltTargetRef = useRef(0)
  const hoverRef = useRef(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0
      if (width > 0) startTransition(() => setContainerWidth(width))
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const STEER_RESPONSE = 3
  useAnimationFrame((_, delta) => {
    if (openIndex !== null || draggingRef.current || !inView) return
    const dt = Math.min(delta, 48) / 1000
    const idle = autoRotate && !reducedMotion ? speed : 0
    const target = cursorSteer && hoverRef.current ? pointerNormXRef.current * hoverSpeed : idle
    const ease = 1 - Math.exp(-dt * STEER_RESPONSE)
    steerVelRef.current += (target - steerVelRef.current) * ease
    flingRef.current *= Math.exp(-dt * 2.2)
    if (Math.abs(flingRef.current) < 1) flingRef.current = 0
    angle.set(angle.get() + (steerVelRef.current + flingRef.current) * dt)

    tiltTargetRef.current *= Math.exp(-dt * 3)
    tiltMV.set(tiltMV.get() + (tiltTargetRef.current - tiltMV.get()) * (1 - Math.exp(-dt * 8)))
  })

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (openIndex !== null) return
      draggingRef.current = true
      dragDistanceRef.current = 0
      flingRef.current = 0
      lastXRef.current = event.clientX
      lastTimeRef.current = event.timeStamp
    },
    [openIndex],
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const nx = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1
      pointerNormXRef.current = Math.max(-1, Math.min(1, nx))
      if (!draggingRef.current) return
      const deltaX = event.clientX - lastXRef.current
      const deltaTime = Math.max(event.timeStamp - lastTimeRef.current, 1)
      lastXRef.current = event.clientX
      lastTimeRef.current = event.timeStamp
      dragDistanceRef.current += Math.abs(deltaX)
      const degrees = deltaX * 0.28
      angle.set(angle.get() + degrees)
      flingRef.current = (degrees / deltaTime) * 1000
    },
    [angle],
  )

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false
    flingRef.current = Math.max(-260, Math.min(260, flingRef.current))
  }, [])

  const wasDragged = useCallback(() => dragDistanceRef.current > 6, [])

  const openStamp = useCallback((index: number) => {
    setDirection(0)
    startTransition(() => setOpenIndex(index))
  }, [])

  const closeStamp = useCallback(() => {
    setDirection(0)
    startTransition(() => setOpenIndex(null))
  }, [])

  const stepStamp = useCallback(
    (dir: number) => {
      setDirection(dir)
      startTransition(() => setOpenIndex((current) => (current === null ? current : (current + dir + count) % count)))
    },
    [count],
  )

  // While a stamp is open: keyboard controls + lock body/Lenis scroll (the
  // modal is a full-viewport portal, so background scroll would be
  // disorienting and Lenis would otherwise keep scrolling underneath it).
  useEffect(() => {
    if (openIndex === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeStamp()
      if (event.key === 'ArrowRight') stepStamp(1)
      if (event.key === 'ArrowLeft') stepStamp(-1)
    }
    window.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.lenis?.stop()
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      window.lenis?.start()
    }
  }, [openIndex, closeStamp, stepStamp])

  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia('(max-width: 640px)')
    const update = () => setViewportNarrow(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    let lastY = window.scrollY
    let lastT = Date.now()
    const onScroll = () => {
      const now = Date.now()
      const y = window.scrollY
      const dt = Math.max(now - lastT, 1)
      const v = ((y - lastY) / dt) * 1000
      lastY = y
      lastT = now
      const range = scrollTilt ? scrollTiltStrength : 0
      tiltTargetRef.current = Math.max(-range, Math.min(range, -(v / 2500) * range))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [scrollTilt, scrollTiltStrength])

  const openStampData = openIndex === null ? null : items[openIndex]

  const chevButtonStyle = {
    border: 'none',
    background: 'transparent',
    color: panelColor,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    padding: 6,
  } as const

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: 24,
        background: isDark ? '#1C1F15' : '#FDF9F2',
        border: `1px solid ${isDark ? 'rgba(212,165,116,0.15)' : 'rgba(var(--accent-primary-rgb),0.15)'}`,
        padding: '20px 20px 12px',
      }}
    >
      <div
        ref={rootRef}
        role="group"
        aria-roledescription="3D stamp carousel"
        style={{ position: 'relative', overflow: 'hidden', userSelect: 'none', touchAction: 'pan-y', height: 440 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onMouseEnter={() => {
          hoverRef.current = true
        }}
        onMouseLeave={() => {
          hoverRef.current = false
        }}
      >
        <div aria-hidden={openIndex !== null} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 1400 }}>
          <motion.div style={{ position: 'relative', transformStyle: 'preserve-3d', transform: tiltTransform }}>
            <motion.div style={{ position: 'relative', width: cardWidth, height: cardHeight, transformStyle: 'preserve-3d', transform: yawTransform }}>
              {items.map((stamp, index) => (
                <StampCard
                  key={stamp.title}
                  stamp={stamp}
                  index={index}
                  count={count}
                  radius={radius}
                  width={cardWidth}
                  height={cardHeight}
                  angle={angle}
                  shadow={stampShadow}
                  onOpen={openStamp}
                  wasDragged={wasDragged}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>

        {mounted &&
          createPortal(
            <AnimatePresence>
              {openStampData && (
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label={openStampData.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 2147483000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: viewportNarrow ? 16 : 20,
                    padding: viewportNarrow ? 16 : 40,
                    background: backdropColor,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    perspective: 1600,
                  }}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    if (event.target === event.currentTarget) closeStamp()
                  }}
                >
                  <AnimatePresence initial custom={direction} mode="popLayout">
                    <motion.div
                      key={openIndex}
                      custom={direction}
                      variants={POSTCARD_VARIANTS}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: 'spring', stiffness: 300, damping: 32 },
                        rotate: { type: 'spring', stiffness: 300, damping: 32 },
                        rotateY: { type: 'spring', stiffness: 70, damping: 14 },
                        scale: { type: 'spring', stiffness: 120, damping: 15 },
                        opacity: { duration: 0.28 },
                      }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.7}
                      onDragEnd={(_, info) => {
                        const power = info.offset.x + info.velocity.x * 0.2
                        if (power < -90) stepStamp(1)
                        else if (power > 90) stepStamp(-1)
                      }}
                      style={{
                        position: 'relative',
                        width: viewportNarrow ? '100%' : 380,
                        maxWidth: '100%',
                        maxHeight: 'calc(100% - 60px)',
                        cursor: 'grab',
                        pointerEvents: 'auto',
                        transformStyle: 'preserve-3d',
                        filter: 'drop-shadow(0 24px 44px rgba(2, 6, 18, 0.55))',
                      }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          background: panelColor,
                          boxSizing: 'border-box',
                          borderRadius: 6,
                          transform: 'rotate(-1.5deg)',
                          padding: viewportNarrow ? '30px 26px 26px' : '46px 44px 36px',
                          width: '100%',
                          minHeight: viewportNarrow ? undefined : 540,
                          maxHeight: '100%',
                          overflow: 'hidden',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                          <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
                            <span style={{ display: 'inline-block', marginBottom: 16, lineHeight: 0 }} aria-hidden="true">
                              <SealBadge accentColor={accentColor} panelColor={panelColor} monogram={sealMonogram} />
                            </span>
                            <h3
                              style={{
                                margin: 0,
                                fontSize: viewportNarrow ? 24 : 28,
                                lineHeight: 1.15,
                                fontFamily: "'Big Shoulders Display', sans-serif",
                                textTransform: 'uppercase',
                                ...texturedInk(titleColor, 1, true),
                              }}
                            >
                              {openStampData.title}
                            </h3>
                            <p
                              className="spec-label"
                              style={{ margin: '8px 0 0', color: accentColor, opacity: 0.85 }}
                            >
                              {openStampData.caption}
                            </p>
                          </div>
                          {openStampData.image?.src && (
                            <img
                              src={openStampData.image.src}
                              alt={openStampData.image.alt ?? openStampData.title}
                              draggable={false}
                              style={{
                                height: viewportNarrow ? 100 : 130,
                                width: 'auto',
                                objectFit: 'contain',
                                flexShrink: 0,
                                marginTop: -18,
                                marginRight: -14,
                                transform: 'rotate(-4deg)',
                                filter: 'drop-shadow(0 1px 1.5px rgba(2, 6, 18, 0.28))',
                              }}
                            />
                          )}
                        </div>
                        {openStampData.description && (
                          <p
                            style={{
                              marginTop: viewportNarrow ? 24 : 32,
                              marginBottom: 0,
                              color: textColor,
                              fontFamily: "'Caveat', 'Segoe Script', 'Bradley Hand', cursive",
                              fontSize: viewportNarrow ? 21 : 24,
                              lineHeight: viewportNarrow ? '46px' : '54px',
                              ...ruledLines(viewportNarrow ? 46 : 54),
                            }}
                          >
                            <span style={texturedInk(textColor, 0.9)}>{openStampData.description}</span>
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, pointerEvents: 'auto' }}>
                    <button type="button" aria-label="Previous stamp" onClick={() => stepStamp(-1)} style={chevButtonStyle}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <span style={{ color: panelColor, opacity: 0.75, fontSize: 15, letterSpacing: '0.08em' }}>
                      {(openIndex ?? 0) + 1} / {count}
                    </span>
                    <button type="button" aria-label="Next stamp" onClick={() => stepStamp(1)} style={chevButtonStyle}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>

                  <button
                    type="button"
                    aria-label="Close stamp detail"
                    onClick={closeStamp}
                    style={{
                      position: 'absolute',
                      top: viewportNarrow ? 16 : 28,
                      right: viewportNarrow ? 16 : 32,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      border: 'none',
                      background: 'transparent',
                      color: panelColor,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      pointerEvents: 'auto',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body,
          )}
      </div>

      <p className="spec-label" style={{ color: isDark ? '#F0EBE0' : '#1A1208', opacity: 0.4, textAlign: 'center', margin: '10px 0 4px' }}>
        Drag, scroll, or click a stamp to open it
      </p>
    </div>
  )
}
