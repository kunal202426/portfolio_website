import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HashLoader } from 'react-spinners'

interface LoadingScreenProps {
  onLoadComplete: () => void
}

export const LoadingScreen = ({ onLoadComplete }: LoadingScreenProps) => {
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Show loader for 3.5 seconds (cinematic loading experience)
    const timer = setTimeout(() => {
      setIsComplete(true)
      setTimeout(onLoadComplete, 400)
    }, 3500)

    return () => clearTimeout(timer)
  }, [onLoadComplete])

  if (isComplete) return null
  return (
    <motion.div
      exit={{
        opacity: 0,
        transition: { duration: 0.4 }
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: '#F5F0E8' }}
    >
      {/* HashLoader Spinner */}
      <HashLoader
        color="#E8570C"
        size={50}
        speedMultiplier={1.2}
      />

      {/* Loading Text */}
      <p className="text-sm mt-8 tracking-wide" style={{ color: '#9B8B70' }}>
        Loading portfolio...
      </p>
    </motion.div>
  )
}
