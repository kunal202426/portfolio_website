'use client'

import { Suspense, lazy, memo, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface InteractiveRobotSplineProps {
  scene: string
  className?: string
}

function InteractiveRobotSplineComponent({ scene, className }: InteractiveRobotSplineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

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
            timeout: 900,
          })
        } else {
          window.setTimeout(loadWhenIdle, 120)
        }

        observer.disconnect()
      },
      { root: null, rootMargin: '220px 0px', threshold: 0.01 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className={cn('relative h-full w-full overflow-hidden', className)}>
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
          <Spline scene={scene} className="h-full w-full" />
        </Suspense>
      ) : (
        <div className="h-full w-full animate-pulse bg-[#14110D]" />
      )}
    </div>
  )
}

export const InteractiveRobotSpline = memo(InteractiveRobotSplineComponent)
