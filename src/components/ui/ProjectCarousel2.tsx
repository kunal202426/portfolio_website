import { useState } from 'react'
import { motion } from 'framer-motion'
import { BrutalButton } from './BrutalButton'

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

  const next = () => setIndex((prev) => (prev + 1) % projects.length)
  const prev = () => setIndex((prev) => (prev - 1 + projects.length) % projects.length)

  // High contrast metallic theme with clear separation
  const activeCardBg = 'linear-gradient(145deg, #1e293b, #334155)' // Slate gray - lighter
  const inactiveCardBg = 'linear-gradient(145deg, #0f172a, #1e293b)' // Dark slate
  const bgColor = '#0a0e1a' // Very dark background - different from cards
  const activeBorder = '#1e40af' // Dark blue border
  const activeGlow = 'rgba(30, 64, 175, 0.5)'

  return (
    <section className="relative overflow-hidden py-24" style={{ background: bgColor }}>
      {/* Visible animated grid background */}
      <motion.div
        animate={{ x: ['0%', '-100%'] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          zIndex: 0,
          opacity: 0.4,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-6">
        <p className="text-xs uppercase tracking-[0.15em] text-text-tertiary mb-20 font-bold text-center">
          FEATURED PROJECTS
        </p>

        {/* Carousel container - perfectly centered */}
        <div className="flex flex-col items-center justify-center w-full">
          <div
            className="relative w-full flex items-center justify-center mb-16"
            style={{
              perspective: 2000,
              height: 580,
              maxWidth: '100%',
            }}
          >
            {projects.map((project, i) => {
              const offset = i - index
              const isCenter = offset === 0
              const isAdjacent = Math.abs(offset) === 1

              const xOffset = offset * 440
              const yOffset = Math.abs(offset) * 30
              const rotation = offset * -8
              const scale = isCenter ? 1 : Math.abs(offset) === 1 ? 0.85 : 0.7

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{
                    x: xOffset,
                    y: yOffset,
                    scale: scale,
                    rotateY: rotation,
                    zIndex: 10 - Math.abs(offset),
                    opacity: Math.abs(offset) > 2 ? 0 : Math.abs(offset) === 2 ? 0.4 : 1,
                  }}
                  transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
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
                    marginLeft: '-210px',
                    marginTop: '-280px',
                    width: 420,
                    height: 560,
                    borderRadius: 12,
                    background: isCenter ? activeCardBg : inactiveCardBg,
                    color: '#fff',
                    padding: '36px 32px 28px 32px',
                    boxShadow: isCenter
                      ? `0 30px 60px ${activeGlow}, 0 0 0 3px ${activeBorder}, inset 0 1px 0 rgba(255,255,255,0.15)`
                      : '0 15px 40px rgba(0,0,0,0.6), 0 0 0 2px rgba(148,163,184,0.25)',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'center',
                    willChange: 'transform, opacity',
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
                          opacity: 1,
                          border: isCenter ? '2px solid rgba(59, 130, 246, 0.7)' : '2px solid rgba(148,163,184,0.3)',
                          padding: '5px 12px',
                          background: isCenter ? 'rgba(30, 64, 175, 0.2)' : 'rgba(15, 23, 42, 0.5)',
                          color: isCenter ? '#93c5fd' : '#94a3b8',
                        }}
                      >
                        {project.year}
                      </span>
                    </div>

                    <div className="mb-4">
                      <span 
                        className="text-xs px-4 py-1.5 font-bold uppercase tracking-wider inline-block"
                        style={{
                          background: isCenter ? 'rgba(30, 64, 175, 0.3)' : 'rgba(51, 65, 85, 0.4)',
                          color: isCenter ? '#dbeafe' : '#cbd5e1',
                          border: isCenter ? '2px solid rgba(59, 130, 246, 0.6)' : '2px solid rgba(148,163,184,0.25)',
                        }}
                      >
                        {project.subtitle}
                      </span>
                    </div>

                    <h3 
                      className="font-display font-bold mb-4 leading-tight px-2"
                      style={{
                        fontSize: isCenter ? '2rem' : '1.75rem',
                        color: isCenter ? '#f1f5f9' : '#e2e8f0',
                      }}
                    >
                      {project.title}
                    </h3>

                    <p 
                      className="leading-relaxed mb-4 px-2"
                      style={{
                        fontSize: isCenter ? '0.92rem' : '0.88rem',
                        opacity: 1,
                        color: isCenter ? '#cbd5e1' : '#94a3b8',
                        flexGrow: 1,
                      }}
                    >
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 justify-center px-2 mb-4">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2.5 py-1 font-medium"
                          style={{
                            background: isCenter ? 'rgba(30, 64, 175, 0.25)' : 'rgba(51, 65, 85, 0.4)',
                            border: isCenter ? '1.5px solid rgba(59, 130, 246, 0.5)' : '1.5px solid rgba(148,163,184,0.2)',
                            color: isCenter ? '#bfdbfe' : '#94a3b8',
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
                        if (project.liveUrl) window.open(project.liveUrl, '_blank')
                      }}
                    >
                      Explore
                    </BrutalButton>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Navigation arrows - high contrast */}
          <div className="flex gap-6 justify-center">
            <button
              onClick={prev}
              className="w-14 h-14 text-white transition-all flex items-center justify-center font-bold text-2xl hover:border-blue-500"
              aria-label="Previous project"
              style={{ 
                border: '3px solid rgba(148,163,184,0.4)',
                background: 'linear-gradient(145deg, #1e293b, #334155)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              ←
            </button>
            <button
              onClick={next}
              className="w-14 h-14 text-white transition-all flex items-center justify-center font-bold text-2xl hover:border-blue-500"
              aria-label="Next project"
              style={{ 
                border: '3px solid rgba(148,163,184,0.4)',
                background: 'linear-gradient(145deg, #1e293b, #334155)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
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
