import { memo, useEffect, useState } from 'react'
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
  cardWidth: 420,
  cardHeight: 560,
  xOffset: 440,
  yOffset: 30,
  containerHeight: 580,
  marginLeft: -210,
  marginTop: -280,
  padding: '36px 32px 28px 32px',
}

const TABLET_DIMENSIONS: CarouselDimensions = {
  cardWidth: 320,
  cardHeight: 480,
  xOffset: 340,
  yOffset: 25,
  containerHeight: 500,
  marginLeft: -160,
  marginTop: -240,
  padding: '28px 24px 20px 24px',
}

const MOBILE_DIMENSIONS: CarouselDimensions = {
  cardWidth: 280,
  cardHeight: 420,
  xOffset: 300,
  yOffset: 20,
  containerHeight: 440,
  marginLeft: -140,
  marginTop: -210,
  padding: '20px 16px 16px 16px',
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
  const [index, setIndex] = useState(Math.min(2, Math.max(projects.length - 1, 0)))
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
    <section className="relative overflow-hidden py-12 md:py-24 transition-colors duration-500" style={{ background: bgColor }}>
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
          className="text-xs uppercase tracking-[0.15em] mb-12 md:mb-20 font-bold text-center" 
          style={{ color: isDark ? '#9B8B70' : '#6B5D4A' }}
        >
          FEATURED PROJECTS
        </p>

        {/* Carousel container - perfectly centered */}
        <div className="flex flex-col items-center justify-center w-full">
          <div
            className="relative w-full flex items-center justify-center mb-8 md:mb-16"
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
                  {/* Top section */}
                  <div className="w-full flex-1 flex flex-col">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <span 
                        className="text-xs font-mono uppercase tracking-widest font-bold"
                        style={{ 
                          border: isCenter ? '2px solid rgba(232, 87, 12, 0.7)' : `2px solid ${isDark ? 'rgba(212,165,116,0.3)' : 'rgba(212,165,116,0.5)'}`,
                          padding: '5px 12px',
                          background: isCenter ? 'rgba(232, 87, 12, 0.15)' : isDark ? 'rgba(26, 21, 16, 0.5)' : 'rgba(212,165,116,0.1)',
                          color: isCenter ? '#E8570C' : '#D4A574',
                        }}
                      >
                        {project.year}
                      </span>
                    </div>

                    <div className="mb-4">
                      <span 
                        className="text-xs px-4 py-1.5 font-bold uppercase tracking-wider inline-block"
                        style={{
                          background: isCenter ? 'rgba(232, 87, 12, 0.2)' : isDark ? 'rgba(212,165,116,0.1)' : 'rgba(212,165,116,0.15)',
                          color: isCenter ? '#E8570C' : '#D4A574',
                          border: isCenter ? '2px solid rgba(232, 87, 12, 0.4)' : `2px solid ${isDark ? 'rgba(212,165,116,0.15)' : 'rgba(212,165,116,0.3)'}`,
                          maxWidth: '100%',
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          lineHeight: 1.25,
                        }}
                      >
                        {project.subtitle}
                      </span>
                    </div>

                    <h3 
                      className="font-display font-bold mb-4 leading-tight px-2"
                      style={{
                        fontSize: isCenter 
                          ? (dimensions.cardWidth <= 280 ? '1.25rem' : dimensions.cardWidth <= 320 ? '1.5rem' : '2rem')
                          : (dimensions.cardWidth <= 280 ? '1.25rem' : dimensions.cardWidth <= 320 ? '1.5rem' : '1.75rem'),
                        color: isCenter ? titleColor : inactiveTitleColor,
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: dimensions.cardWidth <= 280 ? 3 : 2,
                        overflow: 'hidden',
                      }}
                    >
                      {project.title}
                    </h3>

                    <p 
                      className="leading-relaxed mb-4 px-2"
                      style={{
                        fontSize: isCenter 
                          ? (dimensions.cardWidth <= 280 ? '0.8rem' : dimensions.cardWidth <= 320 ? '0.85rem' : '0.92rem')
                          : (dimensions.cardWidth <= 280 ? '0.75rem' : dimensions.cardWidth <= 320 ? '0.8rem' : '0.88rem'),
                        opacity: isCenter ? 0.9 : 0.7,
                        color: isCenter ? descColor : inactiveDescColor,
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: isCenter
                          ? (dimensions.cardWidth <= 280 ? 5 : dimensions.cardWidth <= 320 ? 6 : 7)
                          : (dimensions.cardWidth <= 280 ? 4 : dimensions.cardWidth <= 320 ? 5 : 6),
                        overflow: 'hidden',
                      }}
                    >
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 justify-center px-2 mb-4">
                      {project.tags.slice(0, dimensions.cardWidth <= 280 ? 2 : dimensions.cardWidth <= 320 ? 3 : 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2.5 py-1 font-medium"
                          style={{
                            fontSize: dimensions.cardWidth <= 280 ? '0.7rem' : '0.75rem',
                            padding: dimensions.cardWidth <= 280 ? '4px 8px' : '4px 10px',
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
                  <div className="w-full flex justify-center pt-3">
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
          <div className="flex justify-center" style={{ gap: dimensions.cardWidth <= 280 ? '16px' : '24px' }}>
            <button
              onClick={prev}
              className="transition-all flex items-center justify-center font-bold hover:scale-105"
              aria-label="Previous project"
              style={{ 
                width: dimensions.cardWidth <= 280 ? '48px' : '56px',
                height: dimensions.cardWidth <= 280 ? '48px' : '56px',
                fontSize: dimensions.cardWidth <= 280 ? '18px' : '24px',
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
                width: dimensions.cardWidth <= 280 ? '48px' : '56px',
                height: dimensions.cardWidth <= 280 ? '48px' : '56px',
                fontSize: dimensions.cardWidth <= 280 ? '18px' : '24px',
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
