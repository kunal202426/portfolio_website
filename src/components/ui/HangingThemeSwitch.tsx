import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, useAnimation, type PanInfo } from 'framer-motion'
import { Sun, Moon, Leaf } from 'lucide-react'
import { useTheme } from '../providers/ThemeProvider'

const THEME_ORDER = ['light', 'dark', 'green'] as const
type ResolvedTheme = (typeof THEME_ORDER)[number]

const THEME_ICON: Record<ResolvedTheme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  green: Leaf,
}

// A pull-cord theme switch: a knob hangs on a string from the navbar. Drag
// it down past the threshold and let go to cycle light -> dark -> green,
// with the knob springing back up on release either way.
export const HangingThemeSwitch = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const knobSize = isMobile ? 40 : 62
  const stringLength = isMobile ? 36 : 58
  const threshold = isMobile ? 32 : 50
  const anchorX = knobSize / 2 + 4

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const controls = useAnimation()

  const path = useTransform([x, y], ([cx, cy]: number[]) => `M ${anchorX} 0 L ${anchorX + cx} ${stringLength + cy}`)

  const cycleTheme = () => {
    const currentIndex = THEME_ORDER.indexOf(resolvedTheme)
    setTheme(THEME_ORDER[(currentIndex + 1) % THEME_ORDER.length])
    if (navigator.vibrate) navigator.vibrate(30)
  }

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (info.offset.y > threshold) cycleTheme()
    controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 320, damping: 18 } })
  }

  const Icon = THEME_ICON[resolvedTheme]

  return (
    <div
      style={{
        position: 'relative',
        width: knobSize + 16,
        height: stringLength + knobSize,
        display: 'flex',
        justifyContent: 'center',
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}
        aria-hidden="true"
      >
        <motion.path d={path} stroke="var(--accent-primary)" strokeWidth={2} strokeLinecap="round" fill="none" />
      </svg>

      <motion.button
        type="button"
        aria-label={`Theme: ${resolvedTheme}. Drag down or click to switch.`}
        drag
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: threshold * 1.8 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        onClick={cycleTheme}
        animate={controls}
        style={{
          x,
          y,
          marginTop: stringLength,
          width: knobSize,
          height: knobSize,
          borderRadius: '50%',
          background: 'var(--bg-card)',
          border: '3px solid var(--accent-primary)',
          boxShadow: '0 10px 26px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab',
          pointerEvents: 'auto',
          padding: 0,
        }}
        whileTap={{ cursor: 'grabbing', scale: 0.94 }}
      >
        <Icon size={knobSize * 0.46} color="var(--accent-primary)" strokeWidth={2} />
      </motion.button>
    </div>
  )
}
