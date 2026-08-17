import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react'
import { motion, useMotionValue } from 'framer-motion'

type GooeyNavItem = { id: string; label: string; onClick?: () => void }

interface GooeyNavbarProps {
  items: GooeyNavItem[]
  activeIndex?: number
  onTabChange?: (index: number) => void
  className?: string
  isDark?: boolean
}

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

function round(value: number) {
  return (Math.round(value * 100) / 100).toString()
}

// A rounded rectangle, drawn with arcs so the corners stay true circles.
function pillPath(rect: Rect, radius: number) {
  const r = Math.min(radius, rect.width / 2, rect.height / 2)
  const { x, y, width: w, height: h } = rect
  return [
    `M${round(x)} ${round(y + r)}`,
    `A${round(r)} ${round(r)} 0 0 1 ${round(x + r)} ${round(y)}`,
    `L${round(x + w - r)} ${round(y)}`,
    `A${round(r)} ${round(r)} 0 0 1 ${round(x + w)} ${round(y + r)}`,
    `L${round(x + w)} ${round(y + h - r)}`,
    `A${round(r)} ${round(r)} 0 0 1 ${round(x + w - r)} ${round(y + h)}`,
    `L${round(x + r)} ${round(y + h)}`,
    `A${round(r)} ${round(r)} 0 0 1 ${round(x)} ${round(y + h - r)}`,
    'Z',
  ].join(' ')
}

// The waist joining two pills: a true fillet tangent to both pills' corner
// circles, lowered until its underside just grazes the requested neck width.
function waistPath(left: Rect, right: Rect, radius: number, neck: number, openness: number) {
  if (openness <= 0.02) return null
  const h = left.height
  const cy = left.y + h / 2
  const r = Math.min(radius, h / 2, left.width / 2, right.width / 2)
  if (r <= 0) return null
  const xa = left.x + left.width
  const xb = right.x
  const gap = xb - xa
  if (gap < 0) return null
  const waistHalf = Math.min((neck / 2) * openness, h / 2 - 0.5)
  const across = gap / 2 + r
  const drop = waistHalf - h / 2 + r
  const denom = 2 * (drop - r)
  if (Math.abs(denom) < 1e-4) return null
  const fillet = (r * r - across * across - drop * drop) / denom
  if (!(fillet > 0) || r + fillet < across) return null
  const rise = Math.sqrt(Math.max(0, (r + fillet) * (r + fillet) - across * across))
  const midX = (xa + xb) / 2
  const cornerX = xa - r
  const cornerY = left.y + r
  const vx = midX - cornerX
  const vy = left.y + r - rise - cornerY
  const len = Math.hypot(vx, vy) || 1
  const tax = cornerX + (r * vx) / len
  const tay = cornerY + (r * vy) / len
  const tbx = 2 * midX - tax
  return [
    `M${round(tax)} ${round(tay)}`,
    `A${round(fillet)} ${round(fillet)} 0 0 0 ${round(tbx)} ${round(tay)}`,
    `L${round(tbx)} ${round(2 * cy - tay)}`,
    `A${round(fillet)} ${round(fillet)} 0 0 0 ${round(tax)} ${round(2 * cy - tay)}`,
    'Z',
  ].join(' ')
}

// A row of separate pills that grow a waist to their neighbour when hovered
// or current, drawn as one SVG path (not per-pill elements, so the halo's
// translucent fill never double-paints an overlap into a bright seam).
export const GooeyNavbar = ({ items, activeIndex = 0, onTabChange, className = '', isDark = false }: GooeyNavbarProps) => {
  const fontSize = 12
  const letterSpacing = 1.2
  const paddingX = 16
  const paddingY = 16
  const gap = 6
  const neighborPush = 6
  const neckRatio = 0.4
  const glowSize = 70
  const cornerRadius = 999

  const pillColor = 'var(--bg-card)'
  const glowColor = 'var(--accent-primary)'
  const textColor = isDark ? '#D4C4A8' : '#4A3C2A'
  const hoverTextColor = isDark ? '#F5F0E8' : '#1A1208'
  const currentTextColor = 'var(--accent-primary)'

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [pointerInside, setPointerInside] = useState(false)
  const [rects, setRects] = useState<Rect[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLElement | null)[]>([])
  const rectsRef = useRef<Rect[]>([])
  const hoveredRef = useRef<number | null>(null)

  const pointerX = useMotionValue(-9999)
  const pointerY = useMotionValue(-9999)

  const trackPointer = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current
      if (!container) return
      const bounds = container.getBoundingClientRect()
      const x = event.clientX - bounds.left
      pointerX.set(x)
      pointerY.set(event.clientY - bounds.top)

      const list = rectsRef.current
      let nearest: number | null = null
      let shortest = Infinity
      for (let index = 0; index < list.length; index++) {
        const rect = list[index]
        const distance = x < rect.x ? rect.x - x : x > rect.x + rect.width ? x - (rect.x + rect.width) : 0
        if (distance < shortest) {
          shortest = distance
          nearest = index
        }
      }
      if (nearest !== hoveredRef.current) {
        hoveredRef.current = nearest
        setHoveredIndex(nearest)
      }
      if (!pointerInside) setPointerInside(true)
    },
    [pointerX, pointerY, pointerInside],
  )

  const activate = useCallback((index: number) => {
    hoveredRef.current = index
    setHoveredIndex(index)
  }, [])

  const deactivate = useCallback(() => {
    hoveredRef.current = null
    setHoveredIndex(null)
    setPointerInside(false)
  }, [])

  const setItemRef = useCallback((index: number, node: HTMLElement | null) => {
    itemRefs.current[index] = node
  }, [])

  const measure = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const next: Rect[] = []
    for (let index = 0; index < items.length; index++) {
      const element = itemRefs.current[index]
      if (!element) return
      let x = element.offsetLeft
      let y = element.offsetTop
      let parent = element.offsetParent as HTMLElement | null
      while (parent && parent !== container) {
        x += parent.offsetLeft
        y += parent.offsetTop
        parent = parent.offsetParent as HTMLElement | null
      }
      next.push({ x, y, width: element.offsetWidth, height: element.offsetHeight })
    }
    setRects(next)
  }, [items.length])

  useEffect(() => {
    measure()
    const container = containerRef.current
    if (!container) return
    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => measure())
      resizeObserver.observe(container)
      for (const node of itemRefs.current) {
        if (node) resizeObserver.observe(node)
      }
    }
    const onResize = () => measure()
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(() => measure())
    return () => {
      window.removeEventListener('resize', onResize)
      resizeObserver?.disconnect()
    }
  }, [items, measure])

  // Rough first-paint geometry so the row is never empty before measuring.
  const estimatedRects = useMemo<Rect[]>(() => {
    let x = 0
    return items.map((item) => {
      const width = item.label.length * (fontSize * 0.62 + letterSpacing) + paddingX * 2
      const height = fontSize + paddingY * 2
      const rect = { x, y: 0, width, height }
      x += width + gap
      return rect
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  const hasMeasured = rects.length === items.length && rects.length > 0
  const baseRects = hasMeasured ? rects : estimatedRects
  const pillHeight = baseRects[0]?.height ?? fontSize + paddingY * 2
  const radiusPx = Math.min(cornerRadius, pillHeight / 2)

  const currentIndex = Math.min(Math.max(activeIndex, 0), Math.max(items.length - 1, 0))

  const targets = useMemo(() => {
    const isOpen = (index: number) => index === hoveredIndex || index === currentIndex
    return baseRects.slice(0, -1).map((_, index) => (isOpen(index) || isOpen(index + 1) ? 1 : 0))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseRects.length, hoveredIndex, currentIndex])

  // Each gap eases toward its target under a lightweight spring - one value
  // per gap is all the state the animation needs to rebuild the whole shape.
  const [openness, setOpenness] = useState<number[]>([])
  const valuesRef = useRef<number[]>([])
  const velocityRef = useRef<number[]>([])

  useEffect(() => {
    const stiffness = 260
    const damping = 30
    const mass = 1
    let frame = 0
    let last = performance.now()
    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now
      const values = valuesRef.current
      const velocity = velocityRef.current
      let settling = false
      for (let index = 0; index < targets.length; index++) {
        const target = targets[index]
        const x = values[index] ?? target
        const v = velocity[index] ?? 0
        const accel = (-stiffness * (x - target) - damping * v) / mass
        const nextV = v + accel * dt
        const nextX = x + nextV * dt
        if (Math.abs(nextX - target) > 0.002 || Math.abs(nextV) > 0.02) {
          values[index] = nextX
          velocity[index] = nextV
          settling = true
        } else {
          values[index] = target
          velocity[index] = 0
        }
      }
      values.length = targets.length
      velocity.length = targets.length
      setOpenness([...values])
      if (settling) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [targets])

  const openAt = useCallback((index: number) => openness[index] ?? targets[index] ?? 0, [openness, targets])

  const layoutRef = useRef({ baseRects, gap, neighborPush })
  layoutRef.current = { baseRects, gap, neighborPush }

  const spreadFrom = useCallback((open: number[]) => {
    const { baseRects: rects, gap: g, neighborPush: push } = layoutRef.current
    const out = new Array(rects.length)
    if (rects.length === 0) return out
    out[0] = rects[0].x
    for (let index = 1; index < rects.length; index++) {
      out[index] = out[index - 1] + rects[index - 1].width + g + push * (open[index - 1] ?? 0)
    }
    return out
  }, [])

  // Opening a gap widens the row; the row is centred, so growth is split
  // and balanced on the ink (each pill's midpoint carried by its width)
  // rather than the outer bounding box, which keeps it looking planted.
  const shifts = useMemo(() => {
    const count = baseRects.length
    if (count === 0) return []
    const open = baseRects.slice(0, -1).map((_, index) => openAt(index))
    const positions = spreadFrom(open)
    const balance = (xs: number[]) => {
      let moment = 0
      let total = 0
      for (let index = 0; index < count; index++) {
        const width = baseRects[index].width
        moment += (xs[index] + width / 2) * width
        total += width
      }
      return total > 0 ? moment / total : 0
    }
    const offset = balance(baseRects.map((rect) => rect.x)) - balance(positions)
    return positions.map((x, index) => x + offset - baseRects[index].x)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseRects, openAt, spreadFrom])

  const shapeRects = useMemo(
    () => baseRects.map((rect, index) => ({ ...rect, x: rect.x + (shifts[index] ?? 0) })),
    [baseRects, shifts],
  )
  rectsRef.current = shapeRects

  const shapeData = useMemo(() => {
    const parts: string[] = []
    for (const rect of shapeRects) parts.push(pillPath(rect, radiusPx))
    for (let index = 0; index < shapeRects.length - 1; index++) {
      const d = waistPath(shapeRects[index], shapeRects[index + 1], radiusPx, pillHeight * neckRatio, openAt(index))
      if (d) parts.push(d)
    }
    return parts.join(' ')
  }, [shapeRects, radiusPx, pillHeight, openAt])

  const reactId = useId()
  const glowId = `goo-glow-${reactId.replace(/:/g, '')}`
  const gradientRef = useRef<SVGRadialGradientElement>(null)

  useEffect(() => {
    const stopX = pointerX.on('change', (next) => gradientRef.current?.setAttribute('cx', String(next)))
    const stopY = pointerY.on('change', (next) => gradientRef.current?.setAttribute('cy', String(next)))
    return () => {
      stopX()
      stopY()
    }
  }, [pointerX, pointerY])

  const dotSize = Math.max(3, Math.round(fontSize * 0.28))
  const dotBottom = Math.max(3, Math.round(paddingY * 0.32))

  if (items.length === 0) return null

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', display: 'block', width: 'max-content' }}
      onMouseMove={trackPointer}
      onMouseLeave={deactivate}
    >
      <svg
        width="100%"
        height="100%"
        aria-hidden="true"
        focusable="false"
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'visible' }}
      >
        <defs>
          <radialGradient ref={gradientRef} id={glowId} gradientUnits="userSpaceOnUse" cx={-9999} cy={-9999} r={glowSize}>
            <stop offset="0" stopColor={glowColor} stopOpacity={0.9} />
            <stop offset="0.45" stopColor={glowColor} stopOpacity={0.4} />
            <stop offset="1" stopColor={glowColor} stopOpacity={0} />
          </radialGradient>
        </defs>
        <path d={shapeData} fill={pillColor} fillRule="nonzero" />
        <motion.path
          d={shapeData}
          fill={`url(#${glowId})`}
          fillRule="nonzero"
          initial={false}
          animate={{ opacity: pointerInside ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />
      </svg>

      <nav
        aria-label="Primary navigation"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap, width: 'max-content', position: 'relative', zIndex: 1 }}
      >
        {items.map((item, index) => {
          const isHovered = hoveredIndex === index
          const isCurrent = currentIndex === index
          const sharedStyle: CSSProperties = {
            fontSize,
            letterSpacing: `${letterSpacing}px`,
            textTransform: 'uppercase',
            fontWeight: 700,
            color: isHovered ? hoverTextColor : isCurrent ? currentTextColor : textColor,
            paddingTop: paddingY,
            paddingBottom: paddingY,
            paddingLeft: paddingX,
            paddingRight: paddingX,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            borderRadius: cornerRadius,
            cursor: 'pointer',
            boxSizing: 'border-box',
            position: 'relative',
            whiteSpace: 'nowrap',
            transform: `translateX(${shifts[index] ?? 0}px)`,
          }
          return (
            <button
              key={item.id}
              type="button"
              ref={(node) => setItemRef(index, node)}
              style={sharedStyle}
              onMouseEnter={() => activate(index)}
              onFocus={() => activate(index)}
              onBlur={deactivate}
              onClick={() => {
                onTabChange?.(index)
                item.onClick?.()
              }}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {item.label}
              {isCurrent && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: dotBottom,
                    marginLeft: -dotSize / 2,
                    width: dotSize,
                    height: dotSize,
                    borderRadius: '50%',
                    backgroundColor: 'currentColor',
                  }}
                />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
