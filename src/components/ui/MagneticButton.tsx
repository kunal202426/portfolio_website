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

  const variantClasses = {
    primary: 'bg-gradient-to-r from-accent-primary to-accent-glow text-bg-primary',
    secondary: 'bg-accent-primary text-bg-primary',
    ghost: 'border border-accent-primary text-accent-primary hover:bg-accent-primary/10',
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 250, damping: 20 }}
      className={`
        px-6 py-3 rounded-lg font-medium transition-all duration-300
        hover:shadow-lg hover:shadow-accent-primary/50
        focus-visible:outline-offset-2
        ${variantClasses[variant]}
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}
