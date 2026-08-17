import { motion } from 'framer-motion'
import { useMagneticEffect } from '../../hooks'

interface MagneticButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
}

export const MagneticButton = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
}: MagneticButtonProps) => {
  const { ref, position } = useMagneticEffect()

  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#1FA971',
          color: '#F5F0E8',
        }
      case 'secondary':
        return {
          backgroundColor: '#D4A574',
          color: '#1A1208',
        }
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: '#1FA971',
          border: '1px solid #1FA971',
        }
    }
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 250, damping: 20 }}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${className}`}
      style={getStyles()}
      whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(31, 169, 113, 0.3)' }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}
