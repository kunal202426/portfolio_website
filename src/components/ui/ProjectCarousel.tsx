import { memo, useEffect, useRef, useState, type PanInfo } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { Star } from 'lucide-react'
import { BrutalButton } from './BrutalButton'
import { GithubTumbleweed } from './GithubTumbleweed'
import { useTheme } from '../providers/ThemeProvider'

interface Project {
  title: string
  subtitle: string
  description: string
  tags: string[]
  year: string
  liveUrl?: string
  githubUrl?: string
  color: string
  starred?: boolean
  screenshots?: string[]
}

interface ProjectCarouselProps {
  projects: Project[]
}

// Kept low so a light, natural swipe registers — not a hard, deliberate drag.
const SWIPE_DISTANCE_THRESHOLD = 40
const SWIPE_VELOCITY_THRESHOLD = 280
const SCREENSHOT_CYCLE_MS = 3800

// Old channel recedes back and slides off, new one enters small from the
// opposite side and grows to fill the screen — the "TV channel change" beat.
// Durations kept short so the gesture feels immediate rather than laggy.
const screenVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '55%' : '-55%',
    scale: 0.55,
    opacity: 0,
  }),
  center: {
    x: 0,
    scale: 1,
    opacity: 1,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-55%' : '55%',
    scale: 0.55,
    opacity: 0,
    transition: { duration: 0.26, ease: [0.5, 0, 1, 1] },
  }),
}

const ScreenshotStack = ({ screenshots, title }: { screenshots: string[]; title: string }) => {
  const [shot, setShot] = useState(0)
  const [broken, setBroken] = useState<boolean[]>(() => screenshots.map(() => false))

  useEffect(() => {
    if (screenshots.length < 2) return
    const id = setInterval(() => setShot((s) => (s + 1) % screenshots.length), SCREENSHOT_CYCLE_MS)
    return () => clearInterval(id)
  }, [screenshots.length])

  const allBroken = broken.every(Boolean)

  return (
    <div className="absolute inset-0">
      {allBroken ? (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(145deg, #1A1510, #0E0E0B)' }}
        >
          <span className="text-xs uppercase tracking-widest" style={{ color: '#6B5D4A' }}>
            Preview coming soon
          </span>
        </div>
      ) : (
        screenshots.map((src, i) =>
          broken[i] ? null : (
            <img
              key={src}
              src={src}
              alt={`${title} screenshot ${i + 1}`}
              draggable={false}
              onError={() =>
                setBroken((prev) => {
                  const next = [...prev]
                  next[i] = true
                  return next
                })
              }
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              style={{ opacity: shot === i ? 1 : 0 }}
            />
          )
        )
      )}
    </div>
  )
}

export const ProjectCarousel = memo(function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const screenRef = useRef<HTMLDivElement>(null)
  const [screenWidth, setScreenWidth] = useState(560)

  useEffect(() => {
    if (projects.length === 0) return
    setIndex((prev) => (prev >= projects.length ? projects.length - 1 : prev))
  }, [projects.length])

  useEffect(() => {
    const el = screenRef.current
    if (!el) return
    const update = () => setScreenWidth(el.getBoundingClientRect().width)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (projects.length === 0) return null

  const goTo = (nextIndex: number) => {
    setDirection(nextIndex > index ? 1 : -1)
    setIndex(nextIndex)
  }
  const next = () => goTo((index + 1) % projects.length)
  const prev = () => goTo((index - 1 + projects.length) % projects.length)

  const handleDragEnd = (_e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    if (info.offset.x < -SWIPE_DISTANCE_THRESHOLD || info.velocity.x < -SWIPE_VELOCITY_THRESHOLD) {
      next()
    } else if (info.offset.x > SWIPE_DISTANCE_THRESHOLD || info.velocity.x > SWIPE_VELOCITY_THRESHOLD) {
      prev()
    }
  }

  const project = projects[index]
  const hasShots = !!project.screenshots?.length
  const isCompact = screenWidth <= 340

  const titleColor = '#F5F0E8'
  const descColor = '#C4B49A'

  // Grid line color based on theme (matches the section's own background pattern)
  const gridColor = isDark ? 'rgba(232, 87, 12, 0.06)' : 'rgba(232, 87, 12, 0.08)'

  return (
    <section className="relative overflow-hidden pt-6 pb-28 md:pt-10 md:pb-44 transition-colors duration-500" style={{ background: isDark ? '#0E0E0B' : '#F5F0E8' }}>
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

      <div className="relative z-10 w-full px-3 md:px-6">
        <p
          className="text-xs uppercase tracking-[0.15em] mb-5 md:mb-7 font-bold text-center"
          style={{ color: isDark ? '#9B8B70' : '#6B5D4A' }}
        >
          FEATURED PROJECTS
        </p>

        <div className="flex flex-col items-center w-full">
          {/* TV set */}
          <div
            className="w-full flex flex-col items-center relative"
            style={{ maxWidth: 620, perspective: 1400 }}
          >
            {/* Ambient rim glow — keeps the set separated from the page background
                at any brightness/theme, not just relying on the bezel's own contrast */}
            <div
              aria-hidden="true"
              className="absolute pointer-events-none"
              style={{
                inset: '-6% -4%',
                background: 'radial-gradient(ellipse at 50% 40%, rgba(232,87,12,0.16), transparent 68%)',
                filter: 'blur(18px)',
                zIndex: 0,
              }}
            />

            <div
              className="relative w-full"
              style={{
                borderRadius: '20px 20px 14px 14px',
                background: 'linear-gradient(155deg, #3A2F26, #120D08)',
                padding: isCompact ? '14px 14px 18px' : '20px 20px 26px',
                transform: 'rotateX(2.5deg)',
                transformStyle: 'preserve-3d',
                boxShadow: [
                  '0 36px 70px rgba(0,0,0,0.6)',
                  '0 0 0 1.5px rgba(232,87,12,0.4)',
                  '0 0 0 6px rgba(0,0,0,0.35)',
                  'inset 0 2px 0 rgba(255,255,255,0.1)',
                  'inset 0 -10px 18px rgba(0,0,0,0.55)',
                  'inset -4px 0 12px rgba(0,0,0,0.3)',
                ].join(', '),
              }}
            >
              {/* Corner screws for a hand-built, not-generic feel */}
              {[
                { top: 7, left: 8 },
                { top: 7, right: 8 },
                { bottom: 10, left: 8 },
                { bottom: 10, right: 8 },
              ].map((pos, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className="absolute rounded-full"
                  style={{
                    ...pos,
                    width: 5,
                    height: 5,
                    background: 'radial-gradient(circle at 35% 35%, #6b5c4a, #1a140d 70%)',
                    boxShadow: '0 1px 0 rgba(255,255,255,0.12)',
                  }}
                />
              ))}

              {/* Brand strip */}
              <div className="flex items-center justify-between mb-2 md:mb-3 px-1">
                <span
                  className="font-display font-bold tracking-wide"
                  style={{ fontSize: isCompact ? '0.65rem' : '0.75rem', color: 'rgba(212,165,116,0.6)' }}
                >
                  KM&nbsp;TV
                </span>
                <div className="flex items-center gap-2">
                  {/* Tiny speaker grille */}
                  <div className="flex gap-[3px]" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                      <span key={i} style={{ width: 2, height: 9, borderRadius: 1, background: 'rgba(212,165,116,0.25)' }} />
                    ))}
                  </div>
                  <motion.span
                    aria-hidden="true"
                    className="rounded-full"
                    style={{ width: 7, height: 7, background: '#E8570C', boxShadow: '0 0 6px rgba(232,87,12,0.7)' }}
                    animate={{ opacity: [1, 0.35, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </div>

              {/* Screen */}
              <div
                ref={screenRef}
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: '16 / 10',
                  borderRadius: 8,
                  background: '#0A0806',
                  boxShadow: [
                    'inset 0 0 0 1px rgba(0,0,0,0.7)',
                    'inset 0 0 0 3px rgba(212,165,116,0.12)',
                    'inset 0 14px 34px rgba(0,0,0,0.6)',
                    'inset 0 -6px 16px rgba(0,0,0,0.4)',
                  ].join(', '),
                }}
              >
                <AnimatePresence custom={direction} initial={false}>
                  <motion.div
                    key={index}
                    custom={direction}
                    variants={screenVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.3}
                    dragMomentum={false}
                    onDragEnd={handleDragEnd}
                    className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing touch-pan-y"
                    style={{ willChange: 'transform' }}
                  >
                    {hasShots ? (
                      <>
                        <ScreenshotStack screenshots={project.screenshots!} title={project.title} />
                        {/* Bottom info overlay */}
                        <div
                          className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center gap-2 px-3 pb-3 pt-10 pointer-events-none"
                          style={{ background: 'linear-gradient(to top, rgba(10,8,6,0.92) 10%, rgba(10,8,6,0.55) 55%, transparent 100%)' }}
                        >
                          <h3
                            className="font-display font-bold leading-tight px-2 pointer-events-none"
                            style={{ fontSize: isCompact ? '1rem' : '1.3rem', color: titleColor }}
                          >
                            {project.title}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 justify-center px-2 pointer-events-none">
                            {project.tags.slice(0, isCompact ? 3 : 4).map((tag) => (
                              <span
                                key={tag}
                                className="text-[0.65rem] px-2 py-0.5 font-medium rounded-sm"
                                style={{
                                  background: 'rgba(232, 87, 12, 0.18)',
                                  border: '1px solid rgba(232, 87, 12, 0.35)',
                                  color: '#E8570C',
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="pointer-events-auto pt-1">
                            <BrutalButton
                              tone="on-dark"
                              onClick={(e) => {
                                e.stopPropagation()
                                const targetUrl = project.liveUrl || project.githubUrl
                                if (targetUrl) window.open(targetUrl, '_blank', 'noopener,noreferrer')
                              }}
                            >
                              {project.liveUrl ? 'View Live' : project.githubUrl ? 'View Code' : 'Explore'}
                            </BrutalButton>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 py-4"
                        style={{ background: 'linear-gradient(160deg, #1A1510, #0E0E0B)' }}
                      >
                        {project.starred && (
                          <div
                            className="absolute rounded-full flex items-center justify-center"
                            style={{ top: 10, right: 10, width: 26, height: 26, background: 'rgba(245,197,66,0.18)', border: '1.5px solid rgba(245,197,66,0.7)' }}
                          >
                            <Star size={12} fill="#F5C542" color="#F5C542" />
                          </div>
                        )}
                        <span
                          className="text-xs font-mono uppercase tracking-widest font-bold mb-2"
                          style={{ border: '2px solid rgba(232,87,12,0.5)', padding: '3px 9px', background: 'rgba(232,87,12,0.12)', color: '#E8570C' }}
                        >
                          {project.year}
                        </span>
                        <span
                          className="text-[0.65rem] px-2.5 py-1 font-bold uppercase tracking-wider mb-2"
                          style={{ background: 'rgba(212,165,116,0.12)', color: '#D4A574', border: '1px solid rgba(212,165,116,0.25)' }}
                        >
                          {project.subtitle}
                        </span>
                        <h3
                          className="font-display font-bold leading-tight px-2 mb-2"
                          style={{ fontSize: isCompact ? '1.05rem' : '1.35rem', color: titleColor }}
                        >
                          {project.title}
                        </h3>
                        <p
                          className="leading-snug px-2 mb-2"
                          style={{ fontSize: isCompact ? '0.72rem' : '0.8rem', color: descColor, maxWidth: 420 }}
                        >
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 justify-center px-2 mb-3">
                          {project.tags.slice(0, isCompact ? 3 : 4).map((tag) => (
                            <span
                              key={tag}
                              className="text-[0.65rem] px-2 py-0.5 font-medium rounded-sm"
                              style={{ background: 'rgba(212,165,116,0.1)', border: '1px solid rgba(212,165,116,0.2)', color: '#D4A574' }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <BrutalButton
                          tone="on-dark"
                          onClick={(e) => {
                            e.stopPropagation()
                            const targetUrl = project.liveUrl || project.githubUrl
                            if (targetUrl) window.open(targetUrl, '_blank', 'noopener,noreferrer')
                          }}
                        >
                          {project.liveUrl ? 'View Live' : project.githubUrl ? 'View Code' : 'Explore'}
                        </BrutalButton>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Glass glare, purely decorative */}
                <div
                  className="absolute inset-0 pointer-events-none z-20"
                  style={{ background: 'linear-gradient(115deg, rgba(255,255,255,0.07) 0%, transparent 30%)' }}
                />
              </div>
            </div>

            {/* TV stand */}
            <div
              aria-hidden="true"
              style={{
                width: isCompact ? 64 : 88,
                height: isCompact ? 14 : 18,
                background: 'linear-gradient(155deg, #241C16, #100C08)',
                clipPath: 'polygon(18% 0%, 82% 0%, 100% 100%, 0% 100%)',
              }}
            />
            <div
              aria-hidden="true"
              style={{
                width: isCompact ? 96 : 130,
                height: 6,
                borderRadius: 3,
                marginTop: -2,
                background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.25), transparent)',
              }}
            />
          </div>

          {/* Dot indicators replace the old arrow buttons — click to jump, or swipe the screen */}
          <div className="flex items-center gap-2 mt-6" role="tablist" aria-label="Select project">
            {projects.map((p, i) => (
              <button
                key={p.title}
                role="tab"
                aria-selected={i === index}
                aria-label={`Show ${p.title}`}
                onClick={() => goTo(i)}
                className="transition-all rounded-full"
                style={{
                  width: i === index ? 22 : 8,
                  height: 8,
                  background: i === index ? '#E8570C' : isDark ? 'rgba(212,165,116,0.3)' : 'rgba(212,165,116,0.45)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Tumbleweed rolls across the open background here, outside and behind the TV — untouched, same component as elsewhere */}
        <GithubTumbleweed />
      </div>
    </section>
  )
})

ProjectCarousel.displayName = 'ProjectCarousel'
