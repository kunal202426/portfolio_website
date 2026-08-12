import { memo, useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { BrutalButton } from './BrutalButton'
import { useTheme } from '../providers/ThemeProvider'

interface ProjectCarouselProps {
  projects: Array<{
    title: string
    subtitle: string
    description: string
    tags: string[]
    year: string
    liveUrl?: string
    githubUrl?: string
    color: string
    starred?: boolean
  }>
}

type CarouselDimensions = {
  cardWidth: number
  cardHeight: number
  xOffset: number
  yOffset: number
  containerHeight: number
  marginLeft: number
  marginTop: number
  padding: string
}

const DESKTOP_DIMENSIONS: CarouselDimensions = {
  cardWidth: 340,
  cardHeight: 460,
  xOffset: 360,
  yOffset: 20,
  containerHeight: 476,
  marginLeft: -170,
  marginTop: -230,
  padding: '24px 22px 18px 22px',
}

const TABLET_DIMENSIONS: CarouselDimensions = {
  cardWidth: 278,
  cardHeight: 398,
  xOffset: 292,
  yOffset: 17,
  containerHeight: 412,
  marginLeft: -139,
  marginTop: -199,
  padding: '20px 18px 16px 18px',
}

const MOBILE_DIMENSIONS: CarouselDimensions = {
  cardWidth: 248,
  cardHeight: 358,
  xOffset: 264,
  yOffset: 14,
  containerHeight: 372,
  marginLeft: -124,
  marginTop: -179,
  padding: '15px 12px 12px 12px',
}

const getDimensionsForWidth = (width: number): CarouselDimensions => {
  if (width >= 1024) return DESKTOP_DIMENSIONS
  if (width >= 768) return TABLET_DIMENSIONS
  return MOBILE_DIMENSIONS
}

const hasSameDimensions = (prev: CarouselDimensions, next: CarouselDimensions) => (
  prev.cardWidth === next.cardWidth &&
  prev.cardHeight === next.cardHeight &&
  prev.xOffset === next.xOffset &&
  prev.yOffset === next.yOffset
)

export const ProjectCarousel = memo(function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [index, setIndex] = useState(0)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const [dimensions, setDimensions] = useState<CarouselDimensions>(() =>
    getDimensionsForWidth(typeof window === 'undefined' ? 1280 : window.innerWidth)
  )

  useEffect(() => {
    let resizeFrame = 0

    const updateDimensions = () => {
      const next = getDimensionsForWidth(window.innerWidth)
      setDimensions((prev) => (hasSameDimensions(prev, next) ? prev : next))
    }

    updateDimensions()

    const onResize = () => {
      if (resizeFrame) return
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0
        updateDimensions()
      })
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame)
      }
    }
  }, [])

  useEffect(() => {
    if (projects.length === 0) {
      setIndex(0)
      return
    }

    setIndex((prev) => (prev >= projects.length ? projects.length - 1 : prev))
  }, [projects.length])

  if (projects.length === 0) return null

  const next = () => setIndex((prev) => (prev + 1) % projects.length)
  const prev = () => setIndex((prev) => (prev - 1 + projects.length) % projects.length)

  // Theme-aware colors - FIXED for light mode
  const bgColor = isDark ? '#0E0E0B' : '#F5F0E8'
  const activeCardBg = isDark 
    ? 'linear-gradient(145deg, #1A1510, #2A221A)' 
    : 'linear-gradient(145deg, #FFFFFF, #FAF7F2)'
  const inactiveCardBg = isDark 
    ? 'linear-gradient(145deg, #0E0E0B, #1A1510)' 
    : 'linear-gradient(145deg, #F5F0E8, #EDE8E0)'
  const activeBorder = '#E8570C'
  const activeGlow = 'rgba(232, 87, 12, 0.4)'
  const isCompactMotion = dimensions.cardWidth <= 320
  
  // Text colors
  const titleColor = isDark ? '#F0EBE0' : '#1A1208'
  const inactiveTitleColor = isDark ? '#C4B49A' : '#4A3C2A'
  const descColor = isDark ? '#C4B49A' : '#4A3C2A'
  const inactiveDescColor = isDark ? '#9B8B70' : '#6B5D4A'

  // Grid line color based on theme
  const gridColor = isDark ? 'rgba(232, 87, 12, 0.06)' : 'rgba(232, 87, 12, 0.08)'

  return (
    <section className="relative overflow-hidden py-6 md:py-10 transition-colors duration-500" style={{ background: bgColor }}>
      {/* Static grid background - no animation for performance */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-3 md:px-6">
        <p
          className="text-xs uppercase tracking-[0.15em] mb-5 md:mb-7 font-bold text-center"
          style={{ color: isDark ? '#9B8B70' : '#6B5D4A' }}
        >
          FEATURED PROJECTS
        </p>

        {/* Carousel container - perfectly centered */}
        <div className="flex flex-col items-center justify-center w-full">
          <div
            className="relative w-full flex items-center justify-center mb-4 md:mb-6"
            style={{
              perspective: isCompactMotion ? 1200 : 2000,
              height: dimensions.containerHeight,
              maxWidth: '100%',
            }}
          >
            {projects.map((project, i) => {
              const offset = i - index
              const maxVisibleOffset = dimensions.cardWidth <= 320 ? 1 : 2
              if (Math.abs(offset) > maxVisibleOffset) return null

              const isCenter = offset === 0
              const isAdjacent = Math.abs(offset) === 1
              const isEdge = maxVisibleOffset === 2 && Math.abs(offset) === 2

              const xOffset = offset * dimensions.xOffset
              const yOffset = Math.abs(offset) * dimensions.yOffset
              const rotation = isCompactMotion ? 0 : offset * -6
              const scale = isCenter ? 1 : Math.abs(offset) === 1 ? (isCompactMotion ? 0.9 : 0.85) : (isCompactMotion ? 0.82 : 0.7)
              const transform = `translate3d(${xOffset}px, ${yOffset}px, 0) scale(${scale})${isCompactMotion ? '' : ` rotateY(${rotation}deg)`}`

              return (
                <div
                  key={i}
                  onClick={() => {
                    if (offset === -1) prev()
                    if (offset === 1) next()
                  }}
                  role={isAdjacent ? 'button' : undefined}
                  tabIndex={isAdjacent ? 0 : -1}
                  onKeyDown={(event) => {
                    if (!isAdjacent) return
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      if (offset === -1) prev()
                      if (offset === 1) next()
                    }
                  }}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    marginLeft: dimensions.marginLeft,
                    marginTop: dimensions.marginTop,
                    transform,
                    transition: `transform ${isCompactMotion ? '260ms' : '340ms'} cubic-bezier(0.25, 0.1, 0.25, 1), opacity ${isCompactMotion ? '260ms' : '340ms'} cubic-bezier(0.25, 0.1, 0.25, 1)`,
                    zIndex: 10 - Math.abs(offset),
                    opacity: isEdge ? 0.45 : 1,
                    width: dimensions.cardWidth,
                    height: dimensions.cardHeight,
                    borderRadius: 12,
                    background: isCenter ? activeCardBg : inactiveCardBg,
                    color: isDark ? '#F0EBE0' : '#1A1208',
                    padding: dimensions.padding,
                    boxShadow: isCenter
                      ? isCompactMotion
                        ? `0 18px 34px ${activeGlow}, 0 0 0 1px ${activeBorder}`
                        : `0 30px 60px ${activeGlow}, 0 0 0 2px ${activeBorder}`
                      : isDark 
                        ? (isCompactMotion
                          ? '0 10px 24px rgba(0,0,0,0.36), 0 0 0 1px rgba(212,165,116,0.15)'
                          : '0 15px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,165,116,0.15)')
                        : (isCompactMotion
                          ? '0 10px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(212,165,116,0.3)'
                          : '0 15px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(212,165,116,0.3)'),
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: isAdjacent ? 'pointer' : 'default',
                    transformStyle: isCompactMotion ? 'flat' : 'preserve-3d',
                    overflow: 'hidden',
                    backfaceVisibility: 'hidden',
                    willChange: 'transform, opacity',
                  }}
                >
                  {/* Star badge for highlighted projects */}
                  {project.starred && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 20,
                        background: 'rgba(245, 197, 66, 0.18)',
                        border: '1.5px solid rgba(245, 197, 66, 0.7)',
                        borderRadius: '50%',
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Star size={13} fill="#F5C542" color="#F5C542" />
                    </div>
                  )}

                  {/* Top section */}
                  <div className="w-full flex-1 flex flex-col">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span
                        className="text-xs font-mono uppercase tracking-widest font-bold"
                        style={{
                          border: isCenter ? '2px solid rgba(232, 87, 12, 0.7)' : `2px solid ${isDark ? 'rgba(212,165,116,0.3)' : 'rgba(212,165,116,0.5)'}`,
                          padding: '4px 10px',
                          background: isCenter ? 'rgba(232, 87, 12, 0.15)' : isDark ? 'rgba(26, 21, 16, 0.5)' : 'rgba(212,165,116,0.1)',
                          color: isCenter ? '#E8570C' : '#D4A574',
                        }}
                      >
                        {project.year}
                      </span>
                    </div>

                    <div className="mb-2">
                      <span
                        className="text-xs px-3 py-1 font-bold uppercase tracking-wider inline-block"
                        style={{
                          background: isCenter ? 'rgba(232, 87, 12, 0.2)' : isDark ? 'rgba(212,165,116,0.1)' : 'rgba(212,165,116,0.15)',
                          color: isCenter ? '#E8570C' : '#D4A574',
                          border: isCenter ? '2px solid rgba(232, 87, 12, 0.4)' : `2px solid ${isDark ? 'rgba(212,165,116,0.15)' : 'rgba(212,165,116,0.3)'}`,
                          maxWidth: '100%',
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          lineHeight: 1.2,
                          fontSize: '0.68rem',
                        }}
                      >
                        {project.subtitle}
                      </span>
                    </div>

                    <h3
                      className="font-display font-bold mb-2 leading-tight px-2"
                      style={{
                        fontSize: isCenter
                          ? (dimensions.cardWidth <= 260 ? '1.15rem' : dimensions.cardWidth <= 300 ? '1.35rem' : '1.7rem')
                          : (dimensions.cardWidth <= 260 ? '1.1rem' : dimensions.cardWidth <= 300 ? '1.3rem' : '1.5rem'),
                        color: isCenter ? titleColor : inactiveTitleColor,
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden',
                      }}
                    >
                      {project.title}
                    </h3>

                    <p
                      className="leading-snug mb-2 px-2"
                      style={{
                        fontSize: isCenter
                          ? (dimensions.cardWidth <= 260 ? '0.75rem' : dimensions.cardWidth <= 300 ? '0.8rem' : '0.85rem')
                          : (dimensions.cardWidth <= 260 ? '0.7rem' : dimensions.cardWidth <= 300 ? '0.75rem' : '0.8rem'),
                        opacity: isCenter ? 0.9 : 0.7,
                        color: isCenter ? descColor : inactiveDescColor,
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: isCenter
                          ? (dimensions.cardWidth <= 260 ? 4 : dimensions.cardWidth <= 300 ? 4 : 5)
                          : (dimensions.cardWidth <= 260 ? 3 : dimensions.cardWidth <= 300 ? 4 : 4),
                        overflow: 'hidden',
                      }}
                    >
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 justify-center px-2 mb-1">
                      {project.tags.slice(0, dimensions.cardWidth <= 260 ? 2 : dimensions.cardWidth <= 300 ? 3 : 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2.5 py-1 font-medium"
                          style={{
                            fontSize: dimensions.cardWidth <= 260 ? '0.65rem' : '0.7rem',
                            padding: dimensions.cardWidth <= 260 ? '3px 7px' : '3px 8px',
                            background: isCenter ? 'rgba(232, 87, 12, 0.15)' : isDark ? 'rgba(212,165,116,0.08)' : 'rgba(212,165,116,0.15)',
                            border: isCenter ? '1px solid rgba(232, 87, 12, 0.3)' : `1px solid ${isDark ? 'rgba(212,165,116,0.12)' : 'rgba(212,165,116,0.25)'}`,
                            color: isCenter ? '#E8570C' : '#D4A574',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Button at bottom - fixed height container */}
                  <div className="w-full flex justify-center pt-1">
                    <BrutalButton
                      tone={isCenter ? 'on-dark' : 'default'}
                      onClick={(e) => {
                        e.stopPropagation()
                        const targetUrl = project.liveUrl || project.githubUrl

                        if (targetUrl) {
                          window.open(targetUrl, '_blank', 'noopener,noreferrer')
                        }
                      }}
                    >
                      {project.liveUrl ? 'View Live' : project.githubUrl ? 'View Code' : 'Explore'}
                    </BrutalButton>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Navigation arrows - responsive size */}
          <div className="flex justify-center" style={{ gap: dimensions.cardWidth <= 260 ? '14px' : '18px' }}>
            <button
              onClick={prev}
              className="transition-all flex items-center justify-center font-bold hover:scale-105"
              aria-label="Previous project"
              style={{
                width: dimensions.cardWidth <= 260 ? '38px' : '44px',
                height: dimensions.cardWidth <= 260 ? '38px' : '44px',
                fontSize: dimensions.cardWidth <= 260 ? '15px' : '18px',
                border: '2px solid rgba(232, 87, 12, 0.4)',
                background: isDark 
                  ? 'linear-gradient(145deg, #1A1510, #0E0E0B)' 
                  : 'linear-gradient(145deg, #FFFFFF, #F5F0E8)',
                boxShadow: isDark 
                  ? '0 4px 12px rgba(0,0,0,0.5)'
                  : '0 4px 12px rgba(0,0,0,0.1)',
                color: '#E8570C',
              }}
            >
              ←
            </button>
            <button
              onClick={next}
              className="transition-all flex items-center justify-center font-bold hover:scale-105"
              aria-label="Next project"
              style={{
                width: dimensions.cardWidth <= 260 ? '38px' : '44px',
                height: dimensions.cardWidth <= 260 ? '38px' : '44px',
                fontSize: dimensions.cardWidth <= 260 ? '15px' : '18px',
                border: '2px solid rgba(232, 87, 12, 0.4)',
                background: isDark 
                  ? 'linear-gradient(145deg, #1A1510, #0E0E0B)' 
                  : 'linear-gradient(145deg, #FFFFFF, #F5F0E8)',
                boxShadow: isDark 
                  ? '0 4px 12px rgba(0,0,0,0.5)'
                  : '0 4px 12px rgba(0,0,0,0.1)',
                color: '#E8570C',
              }}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
})

ProjectCarousel.displayName = 'ProjectCarousel'
