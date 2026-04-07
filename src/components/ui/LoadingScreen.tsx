import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  onLoadComplete: () => void
}

export const LoadingScreen = ({ onLoadComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsComplete(true)
            setTimeout(onLoadComplete, 800)
          }, 500)
          return 100
        }
        return prev + Math.random() * 30
      })
    }, 200)

    return () => clearInterval(interval)
  }, [onLoadComplete])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          exit={{
            clipPath: ['inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)'],
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 bg-bg-primary z-50 flex flex-col items-center justify-center"
        >
          {/* Logo */}
          <motion.svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="mb-12"
            initial={false}
          >
            <motion.text
              x="60"
              y="75"
              fontSize="80"
              fontWeight="bold"
              textAnchor="middle"
              fill="url(#gradient)"
              fontFamily="'Clash Display', sans-serif"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              K
            </motion.text>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6C63FF" />
                <stop offset="100%" stopColor="#00E5FF" />
              </linearGradient>
            </defs>
          </motion.svg>

          {/* Progress Counter */}
          <motion.div
            className="text-4xl font-mono font-bold text-accent-primary mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {Math.min(Math.round(progress), 100)}%
          </motion.div>

          {/* Progress Bar */}
          <div className="w-64 h-1 bg-bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-primary via-accent-glow to-accent-cyan"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            />
          </div>

          {/* Loading Text */}
          <motion.p
            className="text-text-secondary text-sm mt-8 font-accent letter-spacing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Initializing portfolio...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
