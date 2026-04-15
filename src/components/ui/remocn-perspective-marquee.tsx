"use client"

import { useEffect, useRef, useState } from 'react'

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
  const [frame, setFrame] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(1280)

  useEffect(() => {
    let rafId = 0
    let previousTime = performance.now()

    const tick = (now: number) => {
      const deltaFrames = (now - previousTime) / 16.6667
      previousTime = now
      setFrame((prev) => prev + deltaFrames * speed)
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [speed])

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? 0
      if (width > 0) {
        setContainerWidth(width)
      }
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const itemPadding = fontSize * 0.9
  const approxItemWidth = items.reduce((acc, item) => acc + item.length * fontSize * 0.6 + itemPadding, 0)

  const distance = (frame * Math.abs(pixelsPerFrame)) % approxItemWidth
  const offset = pixelsPerFrame >= 0 ? -distance : -approxItemWidth + distance
  const rendered = [...items, ...items, ...items]
  const halfWidth = Math.max(1, containerWidth / 2)

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
          style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            transform: `translateX(${offset}px)`,
          }}
        >
          {rendered.map((item, index) => {
            const itemCenter =
              index * (approxItemWidth / items.length) + approxItemWidth / items.length / 2 + offset
            const norm = (itemCenter - halfWidth) / halfWidth
            const distanceFromCenter = Math.min(1, Math.abs(norm))
            const blurPx = distanceFromCenter * 0.8
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
                  filter: `blur(${blurPx}px)`,
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