import { useEffect, useLayoutEffect, useRef, useState } from 'react'

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

export const LimelightNav = ({
  items,
  activeIndex = 0,  
  onTabChange,
  className = '',
  isDark = false,
}: LimelightNavProps) => {
  const NAV_HEIGHT_PX = 48
  const CONE_HEIGHT_PX = 58
  const [isReady, setIsReady] = useState(false)
  const [limelightWidth, setLimelightWidth] = useState(72)
  const [limelightLeft, setLimelightLeft] = useState(-999)
  const navItemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const currentIndex = Math.min(Math.max(activeIndex, 0), Math.max(items.length - 1, 0))

  const positionLimelight = () => {
    const activeItem = navItemRefs.current[currentIndex]

    if (!activeItem) return

    const nextWidth = Math.max(68, Math.round(activeItem.offsetWidth - 10))
    const nextLeft = activeItem.offsetLeft + activeItem.offsetWidth / 2 - nextWidth / 2

    setLimelightWidth((prev) => (prev === nextWidth ? prev : nextWidth))
    setLimelightLeft((prev) => (prev === nextLeft ? prev : nextLeft))
  }

  useLayoutEffect(() => {
    if (items.length === 0) return

    positionLimelight()

    if (!isReady) {
      const frameId = window.requestAnimationFrame(() => setIsReady(true))
      return () => window.cancelAnimationFrame(frameId)
    }
  }, [currentIndex, isReady, items.length])

  useEffect(() => {
    const handleResize = () => {
      positionLimelight()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentIndex, items.length])

  if (items.length === 0) return null

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    onTabChange?.(index)
    itemOnClick?.()
  }

  return (
    <nav
      className={`relative inline-flex items-center h-12 rounded-lg border px-2 overflow-visible ${className}`}
      style={{
        backgroundColor: isDark ? 'rgba(26, 21, 16, 0.72)' : 'rgba(255, 255, 255, 0.72)',
        borderColor: isDark ? 'rgba(212, 165, 116, 0.22)' : 'rgba(212, 165, 116, 0.36)',
      }}
      aria-label="Primary navigation"
    >
      {items.map(({ id, label, onClick }, index) => (
        <button
          key={id}
          type="button"
          ref={(el) => {
            navItemRefs.current[index] = el
          }}
          className="relative z-20 flex h-full items-center justify-center px-4 text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
          style={{
            color: currentIndex === index ? '#E8570C' : isDark ? '#D4C4A8' : '#4A3C2A',
          }}
          onClick={() => handleItemClick(index, onClick)}
          aria-current={currentIndex === index ? 'page' : undefined}
        >
          {label}
        </button>
      ))}

      <div
        className={`absolute top-0 z-10 h-[6px] rounded-full bg-[#E8570C] shadow-[0_40px_14px_rgba(232,87,12,0.42)] ${
          isReady ? 'transition-[left,width] duration-300 ease-out' : ''
        }`}
        style={{ left: `${limelightLeft}px`, width: `${limelightWidth}px` }}
      >
        <div
          className="pointer-events-none absolute"
          style={{
            left: '-18%',
            top: '6px',
            width: '136%',
            height: `${NAV_HEIGHT_PX - 8}px`,
            borderRadius: '10px',
            background: 'linear-gradient(to bottom, rgba(232,87,12,0.18), rgba(232,87,12,0.06), rgba(232,87,12,0))',
            filter: 'blur(2px)',
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            left: '-30%',
            top: '6px',
            width: '160%',
            height: `${CONE_HEIGHT_PX}px`,
            clipPath: 'polygon(8% 100%, 28% 0, 72% 0, 92% 100%)',
            background: 'linear-gradient(to bottom, rgba(232,87,12,0.48), rgba(232,87,12,0.2), rgba(232,87,12,0.08), rgba(232,87,12,0))',
            filter: 'blur(1.8px)',
          }}
        />
      </div>
    </nav>
  )
}