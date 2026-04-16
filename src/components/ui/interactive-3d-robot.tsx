'use client'

import { Suspense, lazy, memo, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

import { cn } from '@/lib/utils'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface InteractiveRobotSplineProps {
  scene: string
  className?: string
}

type PointerVector = {
  x: number
  y: number
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function InteractiveRobotSplineComponent({ scene, className }: InteractiveRobotSplineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasShellRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const trackingRafRef = useRef<number | null>(null)
  const targetPointerRef = useRef<PointerVector>({ x: 0, y: 0 })
  const currentPointerRef = useRef<PointerVector>({ x: 0, y: 0 })
  const headObjectRef = useRef<{
    rotation?: {
      x?: number
      y?: number
    }
  } | null>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isCoarsePointer, setIsCoarsePointer] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)')

    const updatePointerMode = () => {
      setIsCoarsePointer(mediaQuery.matches)
    }

    updatePointerMode()
    mediaQuery.addEventListener('change', updatePointerMode)

    return () => {
      mediaQuery.removeEventListener('change', updatePointerMode)
    }
  }, [])

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry?.isIntersecting) return

        const loadWhenIdle = () => setShouldLoad(true)
        if ('requestIdleCallback' in window) {
          ;(window as Window & { requestIdleCallback: (callback: () => void, options?: { timeout: number }) => number }).requestIdleCallback(loadWhenIdle, {
            timeout: isCoarsePointer ? 700 : 900,
          })
        } else {
          globalThis.setTimeout(loadWhenIdle, isCoarsePointer ? 80 : 120)
        }

        observer.disconnect()
      },
      { root: null, rootMargin: isCoarsePointer ? '140px 0px' : '220px 0px', threshold: 0.01 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [isCoarsePointer])

  useEffect(() => {
    return () => {
      if (trackingRafRef.current !== null) {
        cancelAnimationFrame(trackingRafRef.current)
      }
    }
  }, [])

  const applyTracking = (pointer: PointerVector) => {
    const headObject = headObjectRef.current
    const rotation = headObject?.rotation

    if (rotation) {
      const yaw = pointer.x * 0.55
      const pitch = -pointer.y * 0.3

      if (typeof rotation.y === 'number') {
        rotation.y = yaw
      }

      if (typeof rotation.x === 'number') {
        rotation.x = pitch
      }
      return
    }

    if (canvasShellRef.current) {
      canvasShellRef.current.style.transform = `translate3d(${pointer.x * 4}px, ${pointer.y * 4}px, 0)`
    }
  }

  const startTrackingLoop = () => {
    if (trackingRafRef.current !== null) return

    const step = () => {
      const current = currentPointerRef.current
      const target = targetPointerRef.current

      const nextX = current.x + (target.x - current.x) * 0.14
      const nextY = current.y + (target.y - current.y) * 0.14
      currentPointerRef.current = { x: nextX, y: nextY }

      applyTracking(currentPointerRef.current)

      const remaining = Math.abs(target.x - nextX) + Math.abs(target.y - nextY)
      if (remaining > 0.002 || isDraggingRef.current) {
        trackingRafRef.current = requestAnimationFrame(step)
      } else {
        trackingRafRef.current = null
      }
    }

    trackingRafRef.current = requestAnimationFrame(step)
  }

  const updatePointerTarget = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const normalizedX = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1)
    const normalizedY = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1)

    targetPointerRef.current = { x: normalizedX, y: normalizedY }
    startTrackingLoop()
  }

  const resetTracking = () => {
    targetPointerRef.current = { x: 0, y: 0 }
    startTrackingLoop()
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isCoarsePointer && !isDraggingRef.current) return
    if (isCoarsePointer && isDraggingRef.current) {
      event.preventDefault()
    }

    updatePointerTarget(event)
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isCoarsePointer) return
    isDraggingRef.current = true
    event.currentTarget.setPointerCapture?.(event.pointerId)
    updatePointerTarget(event)
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isCoarsePointer) {
      resetTracking()
      return
    }

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    isDraggingRef.current = false
    resetTracking()
  }

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    isDraggingRef.current = false
    resetTracking()
  }

  const handlePointerLeave = () => {
    if (isCoarsePointer && isDraggingRef.current) return
    resetTracking()
  }

  const handleSplineLoad = (splineApp: unknown) => {
    const app = splineApp as {
      findObjectByName?: (name: string) => unknown
    }

    if (!app?.findObjectByName) return

    const headNameCandidates = ['Head', 'head', 'RobotHead', 'robot_head', 'Character_Head']
    for (const name of headNameCandidates) {
      const found = app.findObjectByName(name) as {
        rotation?: {
          x?: number
          y?: number
        }
      } | null

      if (found?.rotation) {
        headObjectRef.current = found
        break
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative h-full w-full overflow-hidden', className)}
      style={{ touchAction: isCoarsePointer ? 'none' : 'auto' }}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerLeave}
    >
      {shouldLoad ? (
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-[#14110D] text-white">
              <svg className="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"
                />
              </svg>
              <span className="text-xs tracking-[0.18em] uppercase">Loading Robot</span>
            </div>
          }
        >
          <div ref={canvasShellRef} className="h-full w-full transition-transform duration-100 ease-out will-change-transform">
            <Spline scene={scene} className="h-full w-full" onLoad={handleSplineLoad} />
          </div>
        </Suspense>
      ) : (
        <div className="h-full w-full animate-pulse bg-[#14110D]" />
      )}
    </div>
  )
}

export const InteractiveRobotSpline = memo(InteractiveRobotSplineComponent)
