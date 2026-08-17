import { useScrollProgress } from '../../hooks'

export const ScrollProgress = () => {
  const progress = useScrollProgress()

  return (
    <div className="fixed top-0 left-0 h-1 w-full z-40" style={{ backgroundColor: 'rgba(26, 18, 8, 0.1)' }}>
      <div
        className="h-full transition-all duration-200"
        style={{ 
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--accent-primary), #D4A574)'
        }}
      />
    </div>
  )
}
