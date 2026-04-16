"use client"

import { useEffect, useMemo, useRef, useState } from 'react'

export interface PerspectiveMarqueeProps {
  items?: string[]
  fontSize?: number
  color?: string
  fontWeight?: number
  pixelsPerFrame?: number
  rotateY?: number
  rotateX?: number
  perspective?: number
  fadeColor?: string
  background?: string
  speed?: number
  className?: string
}

const FONT_FAMILY = 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif'

const DEFAULT_ITEMS = [
  'Vercel',
  'Linear',
  'Stripe',
  'Figma',
  'Notion',
  'Raycast',
  'Arc',
  'Cursor',
]

export function PerspectiveMarquee({
  items = DEFAULT_ITEMS,
  fontSize = 84,
  color = '#fafafa',
  fontWeight = 700,
  pixelsPerFrame = 2,
  rotateY = -28,
  rotateX = 8,
  perspective = 1200,
  fadeColor = '#050505',
  background = '#050505',
  speed = 1,
  className,
}: PerspectiveMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafIdRef = useRef<number | null>(null)
  const lastTimeRef = useRef(0)
  const lastPaintTimeRef = useRef(0)
  const offsetRef = useRef(0)
  const isVisibleRef = useRef(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const itemPadding = fontSize * 0.9
  const oneCycleWidth = useMemo(
    () => items.reduce((acc, item) => acc + item.length * fontSize * 0.6 + itemPadding, 0),
    [fontSize, itemPadding, items]
  )
  const renderedItems = useMemo(() => [...items, ...items, ...items], [items])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const applyPreference = () => setPrefersReducedMotion(mediaQuery.matches)
    applyPreference()

    mediaQuery.addEventListener('change', applyPreference)
    return () => mediaQuery.removeEventListener('change', applyPreference)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    const container = containerRef.current
    if (!track || !container) return

    if (prefersReducedMotion || pixelsPerFrame === 0 || speed === 0 || oneCycleWidth <= 0) {
      track.style.transform = 'translateX(0px)'
      return
    }

    let isIntersecting = true

    const syncVisibility = () => {
      isVisibleRef.current = isIntersecting && !document.hidden
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        isIntersecting = Boolean(entry?.isIntersecting)
        syncVisibility()
      },
      { root: null, rootMargin: '180px 0px', threshold: 0.01 }
    )
    observer.observe(container)

    const onVisibilityChange = () => {
      syncVisibility()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    syncVisibility()

    const velocity = Math.abs(pixelsPerFrame) * speed
    const direction = pixelsPerFrame >= 0 ? -1 : 1
    const targetFps = 48
    const frameInterval = 1000 / targetFps
    lastTimeRef.current = performance.now()
    lastPaintTimeRef.current = lastTimeRef.current

    const tick = (now: number) => {
      const deltaFrames = (now - lastTimeRef.current) / 16.6667
      lastTimeRef.current = now

      if (now - lastPaintTimeRef.current < frameInterval) {
        rafIdRef.current = requestAnimationFrame(tick)
        return
      }

      lastPaintTimeRef.current = now

      if (isVisibleRef.current) {
        offsetRef.current += direction * velocity * deltaFrames

        if (offsetRef.current <= -oneCycleWidth) {
          offsetRef.current += oneCycleWidth
        }
        if (offsetRef.current > 0) {
          offsetRef.current -= oneCycleWidth
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(${offsetRef.current.toFixed(3)}px)`
        }
      }

      rafIdRef.current = requestAnimationFrame(tick)
    }

    rafIdRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [oneCycleWidth, pixelsPerFrame, prefersReducedMotion, speed])


  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        perspective: `${perspective}px`,
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            transform: 'translateX(0px)',
            willChange: 'transform',
          }}
        >
          {renderedItems.map((item, index) => {
            const baseIndex = index % Math.max(1, items.length)
            const progress = items.length > 1 ? baseIndex / (items.length - 1) : 0.5
            const distanceFromCenter = Math.min(1, Math.abs(progress - 0.5) * 2)
            const opacity = 1 - distanceFromCenter * 0.12

            return (
              <span
                key={`${item}-${index}`}
                style={{
                  display: 'inline-block',
                  fontFamily: FONT_FAMILY,
                  fontSize,
                  fontWeight,
                  color,
                  letterSpacing: '-0.03em',
                  paddingRight: itemPadding,
                  opacity,
                }}
              >
                {item}
              </span>
            )
          })}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `linear-gradient(90deg, ${fadeColor} 0%, transparent 10%, transparent 90%, ${fadeColor} 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `linear-gradient(180deg, ${fadeColor} 0%, transparent 12%, transparent 88%, ${fadeColor} 100%)`,
        }}
      />
    </div>
  )
}