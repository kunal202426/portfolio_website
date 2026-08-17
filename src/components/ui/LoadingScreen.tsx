import { useEffect, useState } from 'react'
import { motion, animate, useMotionValue } from 'framer-motion'

interface LoadingScreenProps {
  onLoadComplete: () => void
}

const BRAND = 'KUNAL MATHUR'

// Adapted from a Framer "Animation loader" reference: brand name types in
// character-by-character, a thin bar fills alongside a counting-up
// percentage, then the whole panel irises out into a circle to reveal the
// site. The counter runs on a fixed short animation (like the reference) -
// the actual show/hide timing still tracks real page-load completion.
export const LoadingScreen = ({ onLoadComplete }: LoadingScreenProps) => {
  const [isComplete, setIsComplete] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [displayCount, setDisplayCount] = useState(0)
  const countValue = useMotionValue(0)

  useEffect(() => {
    const controls = animate(countValue, 100, {
      duration: 2.2,
      ease: [0.12, 0.23, 0.5, 1],
      onUpdate: (v) => setDisplayCount(Math.round(v)),
    })
    return () => controls.stop()
  }, [countValue])

  useEffect(() => {
    const startedAt = performance.now()
    const minimumVisibleMs = 2400
    const fallbackMaxWaitMs = 3200
    const exitDurationMs = 650

    let done = false
    let completeTimer: number | null = null
    let exitTimer: number | null = null
    let fallbackTimer: number | null = null

    const complete = () => {
      if (done) return
      done = true

      const elapsed = performance.now() - startedAt
      const remaining = Math.max(0, minimumVisibleMs - elapsed)

      completeTimer = window.setTimeout(() => {
        setExiting(true)
        exitTimer = window.setTimeout(() => {
          setIsComplete(true)
          onLoadComplete()
        }, exitDurationMs)
      }, remaining)
    }

    if (document.readyState === 'complete') {
      complete()
    } else {
      window.addEventListener('load', complete, { once: true })
      fallbackTimer = window.setTimeout(complete, fallbackMaxWaitMs)
    }

    return () => {
      window.removeEventListener('load', complete)
      if (completeTimer !== null) clearTimeout(completeTimer)
      if (exitTimer !== null) clearTimeout(exitTimer)
      if (fallbackTimer !== null) clearTimeout(fallbackTimer)
    }
  }, [onLoadComplete])

  if (isComplete) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col justify-between"
      style={{ backgroundColor: 'var(--bg-primary)', padding: 'clamp(20px, 4vw, 48px)' }}
      initial={{ borderRadius: 0, scale: 1, opacity: 1 }}
      animate={exiting ? { borderRadius: '50%', scale: 0.2, opacity: 0 } : { borderRadius: 0, scale: 1, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.77, 0.02, 0.24, 1.02] }}
    >
      {/* Brand name - types in character by character */}
      <div className="flex flex-wrap" aria-hidden="true">
        {BRAND.split('').map((char, i) => (
          <motion.span
            key={i}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'var(--text-primary)',
            }}
            initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.05 + i * 0.03, duration: 0.5, type: 'spring', damping: 40, stiffness: 200 }}
          >
            {char === ' ' ? ' ' : char}
          </motion.span>
        ))}
      </div>

      {/* Progress line */}
      <div
        style={{
          position: 'relative',
          height: 2,
          width: '100%',
          overflow: 'hidden',
          background: 'rgba(var(--accent-primary-rgb), 0.15)',
        }}
      >
        <motion.div
          style={{ position: 'absolute', inset: 0, background: 'var(--accent-primary)', transformOrigin: 'left' }}
          animate={{ scaleX: displayCount / 100 }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </div>

      {/* Counter */}
      <div className="flex justify-end">
        <span
          className="font-display"
          style={{ fontSize: 'clamp(64px, 14vw, 160px)', lineHeight: 0.85, color: 'var(--text-primary)' }}
        >
          {displayCount}
          <span style={{ fontSize: '0.3em', verticalAlign: 'top' }}>%</span>
        </span>
      </div>
    </motion.div>
  )
}
