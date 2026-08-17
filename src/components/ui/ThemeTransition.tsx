import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../providers/ThemeProvider'

/**
 * Full-page theme transition animation
 * Sweeps from left to right when theme changes
 */
export const ThemeTransition = () => {
  const { resolvedTheme } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)
  const prevThemeRef = useRef<string | null>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Skip animation on first render
    if (isFirstRender.current) {
      isFirstRender.current = false
      prevThemeRef.current = resolvedTheme
      return
    }

    // Only animate if theme actually changed (not on initial load)
    if (prevThemeRef.current !== null && prevThemeRef.current !== resolvedTheme) {
      setIsAnimating(true)
      
      // Reset animation after it completes
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 700)
      
      prevThemeRef.current = resolvedTheme
      return () => clearTimeout(timer)
    }
    
    prevThemeRef.current = resolvedTheme
  }, [resolvedTheme])

  const isDark = resolvedTheme === 'dark'

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.5, 
            ease: [0.22, 1, 0.36, 1]
          }}
          style={{
            backgroundColor: isDark ? '#1C1F15' : '#F5F0E8',
            transformOrigin: 'left center'
          }}
        >
          {/* Accent line */}
          <motion.div
            className="absolute top-0 bottom-0 w-1"
            initial={{ left: '0%' }}
            animate={{ left: '100%' }}
            transition={{ 
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1]
            }}
            style={{
              backgroundColor: 'var(--accent-primary)',
              boxShadow: '0 0 20px rgba(var(--accent-primary-rgb), 0.5)'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
