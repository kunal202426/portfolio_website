import { useEffect, useState } from 'react'
import { HashLoader } from 'react-spinners'

interface LoadingScreenProps {
  onLoadComplete: () => void
}

export const LoadingScreen = ({ onLoadComplete }: LoadingScreenProps) => {
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const startedAt = performance.now()
    const minimumVisibleMs = 650
    const fallbackMaxWaitMs = 1600

    let done = false
    let completeTimer: number | null = null
    let fallbackTimer: number | null = null

    const complete = () => {
      if (done) return
      done = true

      const elapsed = performance.now() - startedAt
      const remaining = Math.max(0, minimumVisibleMs - elapsed)

      completeTimer = window.setTimeout(() => {
        setIsComplete(true)
        window.setTimeout(onLoadComplete, 180)
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
      if (completeTimer !== null) {
        clearTimeout(completeTimer)
      }
      if (fallbackTimer !== null) {
        clearTimeout(fallbackTimer)
      }
    }
  }, [onLoadComplete])

  if (isComplete) return null
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        backgroundColor: '#F5F0E8',
        position: 'fixed',
      }}
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
    </div>
  )
}
