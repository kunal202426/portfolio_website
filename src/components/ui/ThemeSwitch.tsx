import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { useTheme } from '../providers/ThemeProvider'

interface ThemeSwitchProps {
  className?: string
}

export const ThemeSwitch = ({ className = '' }: ThemeSwitchProps) => {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const switchStyle = {
    '--toggle-track': isDark ? '#2A221A' : '#E7DDD0',
    '--toggle-track-inset': isDark ? '#1A1510' : '#F8F3EB',
    '--toggle-knob': isDark ? '#BF5B3D' : '#D4A574',
    '--toggle-border': isDark ? 'rgba(212, 165, 116, 0.4)' : 'rgba(74, 60, 42, 0.24)',
    '--toggle-shadow': isDark ? 'rgba(0, 0, 0, 0.38)' : 'rgba(26, 18, 8, 0.18)',
    '--toggle-bar': isDark ? '#F0EBE0' : '#4A3C2A',
  } as CSSProperties

  return (
    <motion.label className={`toggle-container ${className}`.trim()} style={switchStyle} whileTap={{ scale: 0.97 }}>
      <input
        className="toggle-input"
        type="checkbox"
        checked={isDark}
        onChange={(event) => setTheme(event.target.checked ? 'dark' : 'light')}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      />
      <div className="toggle-handle-wrapper">
        <div className="toggle-handle">
          <div className="toggle-handle-knob" />
          <div className="toggle-handle-bar-wrapper">
            <div className="toggle-handle-bar" />
          </div>
        </div>
      </div>
      <div className="toggle-base">
        <div className="toggle-base-inside" />
      </div>
    </motion.label>
  )
}
