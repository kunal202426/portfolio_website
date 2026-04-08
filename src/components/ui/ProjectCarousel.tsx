import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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

export const ProjectCarousel = ({ projects }: ProjectCarouselProps) => {
  const [index, setIndex] = useState(2)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  // Responsive dimensions
  const [dimensions, setDimensions] = useState({
    cardWidth: 420,
    cardHeight: 560,
    xOffset: 440,
    yOffset: 30,
    containerHeight: 580,
    marginLeft: -210,
    marginTop: -280,
    padding: '36px 32px 28px 32px'
  })

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth
      
      if (width >= 1024) {
        // Desktop
        setDimensions({
          cardWidth: 420,
          cardHeight: 560,
          xOffset: 440,
          yOffset: 30,
          containerHeight: 580,
          marginLeft: -210,
          marginTop: -280,
          padding: '36px 32px 28px 32px'
        })
      } else if (width >= 768) {
        // Tablet
        setDimensions({
          cardWidth: 320,
          cardHeight: 480,
          xOffset: 340,
          yOffset: 25,
          containerHeight: 500,
          marginLeft: -160,
          marginTop: -240,
          padding: '28px 24px 20px 24px'
        })
      } else {
        // Mobile
        setDimensions({
          cardWidth: 280,
          cardHeight: 420,
          xOffset: 300,
          yOffset: 20,
          containerHeight: 440,
          marginLeft: -140,
          marginTop: -210,
          padding: '20px 16px 16px 16px'
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

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
              perspective: 2000,
              height: dimensions.containerHeight,
              maxWidth: '100%',
            }}
          >
            {projects.map((project, i) => {
              const offset = i - index
              const isCenter = offset === 0
              const isAdjacent = Math.abs(offset) === 1

              const xOffset = offset * dimensions.xOffset
              const yOffset = Math.abs(offset) * dimensions.yOffset
              const rotation = offset * -8
              const scale = isCenter ? 1 : Math.abs(offset) === 1 ? 0.85 : 0.7

              return (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{
                    x: xOffset,
                    y: yOffset,
                    scale: scale,
                    rotateY: rotation,
                    zIndex: 10 - Math.abs(offset),
                    opacity: Math.abs(offset) > 2 ? 0 : Math.abs(offset) === 2 ? 0.4 : 1,
                  }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
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
                    width: dimensions.cardWidth,
                    height: dimensions.cardHeight,
                    borderRadius: 12,
                    background: isCenter ? activeCardBg : inactiveCardBg,
                    color: isDark ? '#F0EBE0' : '#1A1208',
                    padding: dimensions.padding,
                    boxShadow: isCenter
                      ? `0 30px 60px ${activeGlow}, 0 0 0 2px ${activeBorder}`
                      : isDark 
                        ? '0 15px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,165,116,0.15)'
                        : '0 15px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(212,165,116,0.3)',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: isAdjacent ? 'pointer' : 'default',
                    transformStyle: 'preserve-3d',
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
                        }}
                      >
                        {project.subtitle}
                      </span>
                    </div>

                    <h3 
                      className="font-display font-bold mb-4 leading-tight px-2"
                      style={{
                        fontSize: isCenter 
                          ? (dimensions.cardWidth <= 280 ? '1.5rem' : dimensions.cardWidth <= 320 ? '1.75rem' : '2rem')
                          : (dimensions.cardWidth <= 280 ? '1.25rem' : dimensions.cardWidth <= 320 ? '1.5rem' : '1.75rem'),
                        color: isCenter ? titleColor : inactiveTitleColor,
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
                        console.log('Project clicked:', project.title)
                        console.log('Live URL:', project.liveUrl)
                        console.log('GitHub URL:', project.githubUrl)
                        
                        // Prioritize live URL, fallback to GitHub URL
                        const targetUrl = project.liveUrl || project.githubUrl
                        console.log('Target URL:', targetUrl)
                        
                        if (targetUrl) {
                          window.open(targetUrl, '_blank')
                        } else {
                          console.warn('No URL available for project:', project.title)
                        }
                      }}
                    >
                      {project.liveUrl ? 'View Live' : project.githubUrl ? 'View Code' : 'Explore'}
                    </BrutalButton>
                  </div>
                </motion.div>
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
}
