import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../providers/ThemeProvider'

export interface ThemeTogglerButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  direction?: 'horizontal' | 'vertical'
  modes?: Array<'light' | 'dark' | 'system'>
}

export const ThemeTogglerButton = ({
  variant = 'ghost',
  size = 'md',
  direction = 'horizontal',
  modes = ['light', 'dark']
}: ThemeTogglerButtonProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const cycleTheme = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const currentIndex = modes.indexOf(theme as 'light' | 'dark' | 'system')
    const nextIndex = (currentIndex + 1) % modes.length
    setTheme(modes[nextIndex])
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  }

  const getVariantStyles = () => {
    const isDark = resolvedTheme === 'dark'
    
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          border: isDark ? '1px solid rgba(240, 235, 224, 0.2)' : '1px solid rgba(26, 18, 8, 0.2)',
          color: isDark ? '#F0EBE0' : '#1A1208'
        }
      case 'ghost':
        return {
          backgroundColor: isDark ? 'rgba(240, 235, 224, 0.1)' : 'rgba(26, 18, 8, 0.05)',
          border: 'none',
          color: isDark ? '#F0EBE0' : '#1A1208'
        }
      default:
        return {
          backgroundColor: isDark ? 'var(--accent-primary)' : 'var(--accent-primary)',
          border: 'none',
          color: '#F5F0E8'
        }
    }
  }

  const getIcon = () => {
    if (theme === 'system') {
      return <Monitor size={iconSizes[size]} />
    }
    return resolvedTheme === 'dark' ? (
      <Moon size={iconSizes[size]} />
    ) : (
      <Sun size={iconSizes[size]} />
    )
  }

  return (
    <motion.button
      onClick={cycleTheme}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-colors relative overflow-hidden`}
      style={getVariantStyles()}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Current: ${theme}. Click to change.`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ 
            rotate: direction === 'vertical' ? -90 : 0,
            opacity: 0,
            y: direction === 'vertical' ? -20 : 0,
            x: direction === 'horizontal' ? -20 : 0
          }}
          animate={{ 
            rotate: 0, 
            opacity: 1,
            y: 0,
            x: 0
          }}
          exit={{ 
            rotate: direction === 'vertical' ? 90 : 0,
            opacity: 0,
            y: direction === 'vertical' ? 20 : 0,
            x: direction === 'horizontal' ? 20 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          {getIcon()}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
}
