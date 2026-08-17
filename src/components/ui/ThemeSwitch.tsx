import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { useTheme } from '../providers/ThemeProvider'

interface ThemeSwitchProps {
  className?: string
}

const THEME_ORDER = ['light', 'green', 'dark'] as const

const THEME_STYLES: Record<(typeof THEME_ORDER)[number], Record<string, string>> = {
  light: {
    '--toggle-track': '#E7DDD0',
    '--toggle-track-inset': '#F8F3EB',
    '--toggle-knob': '#D4A574',
    '--toggle-border': 'rgba(74, 60, 42, 0.24)',
    '--toggle-shadow': 'rgba(26, 18, 8, 0.18)',
    '--toggle-bar': '#4A3C2A',
  },
  green: {
    '--toggle-track': '#232619',
    '--toggle-track-inset': '#2A2E1F',
    '--toggle-knob': '#E8560C',
    '--toggle-border': 'rgba(212, 165, 116, 0.4)',
    '--toggle-shadow': 'rgba(0, 0, 0, 0.38)',
    '--toggle-bar': '#F0EBE0',
  },
  dark: {
    '--toggle-track': '#2A221A',
    '--toggle-track-inset': '#242218',
    '--toggle-knob': '#BF5B3D',
    '--toggle-border': 'rgba(212, 165, 116, 0.4)',
    '--toggle-shadow': 'rgba(0, 0, 0, 0.38)',
    '--toggle-bar': '#F0EBE0',
  },
}

// Knob travels 0 -> 24px across the track; middle sits at the halfway point.
const THEME_KNOB_X: Record<(typeof THEME_ORDER)[number], number> = {
  light: 0,
  green: 12,
  dark: 24,
}

const THEME_LABEL: Record<(typeof THEME_ORDER)[number], string> = {
  light: 'light',
  green: 'green',
  dark: 'dark',
}

export const ThemeSwitch = ({ className = '' }: ThemeSwitchProps) => {
  const { resolvedTheme, setTheme } = useTheme()

  const cycleTheme = () => {
    const currentIndex = THEME_ORDER.indexOf(resolvedTheme)
    const next = THEME_ORDER[(currentIndex + 1) % THEME_ORDER.length]
    setTheme(next)
  }

  const switchStyle = THEME_STYLES[resolvedTheme] as CSSProperties

  return (
    <motion.button
      type="button"
      onClick={cycleTheme}
      className={`toggle-container ${className}`.trim()}
      style={switchStyle}
      whileTap={{ scale: 0.97 }}
      aria-label={`Theme: ${THEME_LABEL[resolvedTheme]}. Click to switch.`}
    >
      <motion.div
        className="toggle-handle-wrapper"
        animate={{ x: THEME_KNOB_X[resolvedTheme] }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <div className="toggle-handle">
          <div className="toggle-handle-knob" />
          <div className="toggle-handle-bar-wrapper">
            <div className="toggle-handle-bar" />
          </div>
        </div>
      </motion.div>
      <div className="toggle-base">
        <div className="toggle-base-inside" />
      </div>
    </motion.button>
  )
}
