import { useScrollProgress } from '../../hooks'

export const ScrollProgress = () => {
  const progress = useScrollProgress()

  return (
    <div className="fixed top-0 left-0 h-1 w-full bg-bg-secondary z-40">
      <div
        className="h-full bg-gradient-to-r from-accent-primary via-accent-glow to-accent-cyan transition-all duration-200"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
