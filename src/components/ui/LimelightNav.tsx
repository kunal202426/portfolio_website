import { memo } from 'react'

type LimelightItem = {
  id: string
  label: string
  onClick?: () => void
}

type LimelightNavProps = {
  items: LimelightItem[]
  activeIndex?: number
  onTabChange?: (index: number) => void
  className?: string
  isDark?: boolean
}

export const LimelightNav = memo(function LimelightNav({
  items,
  activeIndex = 0,
  onTabChange,
  className = '',
  isDark = false,
}: LimelightNavProps) {
  const currentIndex = Math.min(Math.max(activeIndex, 0), Math.max(items.length - 1, 0))

  if (items.length === 0) return null

  const tabWidthPercent = 100 / items.length

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    onTabChange?.(index)
    itemOnClick?.()
  }

  return (
    <nav
      className={`relative inline-flex items-center h-12 rounded-lg border px-1 overflow-hidden ${className}`}
      style={{
        backgroundColor: isDark ? 'rgba(26, 21, 16, 0.72)' : 'rgba(255, 255, 255, 0.72)',
        borderColor: isDark ? 'rgba(212, 165, 116, 0.22)' : 'rgba(212, 165, 116, 0.36)',
      }}
      aria-label="Primary navigation"
    >
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-[3px] bg-[#E8570C] shadow-[0_10px_20px_rgba(232,87,12,0.45)] transition-transform duration-300 ease-out"
        style={{
          width: `${tabWidthPercent}%`,
          transform: `translateX(${currentIndex * 100}%)`,
        }}
      />

      {items.map(({ id, label, onClick }, index) => (
        <button
          key={id}
          type="button"
          className="relative z-20 flex-1 h-full min-w-0 flex items-center justify-center px-3 text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
          style={{
            color: currentIndex === index ? '#E8570C' : isDark ? '#D4C4A8' : '#4A3C2A',
          }}
          onClick={() => handleItemClick(index, onClick)}
          aria-current={currentIndex === index ? 'page' : undefined}
        >
          {label}
        </button>
      ))}
    </nav>
  )
})