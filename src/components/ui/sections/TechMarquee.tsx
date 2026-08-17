import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '../../providers/ThemeProvider'
import { PerspectiveMarquee } from '../remocn-perspective-marquee'
import { resumeData } from '../../../lib/resume-data'

type GravityModule = typeof import('../gravity')
type GravityRuntimeMode = 'off' | 'mobile' | 'desktop'

function supportsTouchInput() {
  if (typeof window === 'undefined') return false

  const canMatchMedia = typeof window.matchMedia === 'function'
  const coarsePrimary = canMatchMedia ? window.matchMedia('(pointer: coarse)').matches : false
  const coarseAny = canMatchMedia ? window.matchMedia('(any-pointer: coarse)').matches : false
  const touchPoints = navigator.maxTouchPoints ?? 0
  const legacyTouchEvents = 'ontouchstart' in window

  return coarsePrimary || coarseAny || touchPoints > 0 || legacyTouchEvents
}

export const TechMarquee = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const sectionRef = useRef<HTMLElement>(null)
  const [gravityMode, setGravityMode] = useState<GravityRuntimeMode>('off')
  const [shouldLoadPhysics, setShouldLoadPhysics] = useState(false)
  const [gravityModule, setGravityModule] = useState<GravityModule | null>(null)

  const [row1Skills, row2Skills, gravitySkills] = useMemo(() => {
    const allTech = [
      ...resumeData.skills.languages,
      ...resumeData.skills.frontend.map((skill) => skill.name),
      ...resumeData.skills.backend.map((skill) => skill.name),
      ...resumeData.skills.databases.map((db) => db.name),
      ...resumeData.skills.mlai.map((skill) => skill.name),
      ...resumeData.skills.blockchain,
      ...resumeData.skills.tools.map((skill) => skill.name),
      ...resumeData.skills.concepts,
      ...resumeData.projects.flatMap((project) => project.tags),
    ]

    const dedupedTech = allTech.filter((tech, index, source) => {
      const normalized = tech.toLowerCase().trim()
      return source.findIndex((item) => item.toLowerCase().trim() === normalized) === index
    })

    const splitPoint = Math.ceil(dedupedTech.length / 2)
    const row1 = dedupedTech.slice(0, splitPoint)
    const row2 = dedupedTech.slice(splitPoint)

    const gravityPriority = [
      'React.js', 'Java', 'PostgreSQL', 'MongoDB',
      'Redis', 'Node.js', 'FastAPI', 'TypeScript', 'Docker',
    ]
    const gravityItems = gravityPriority.filter((item) =>
      dedupedTech.some((t) => t.toLowerCase() === item.toLowerCase())
    )

    return [row1, row2.length > 0 ? row2 : row1, gravityItems]
  }, [])

  const gravityPalette = [
    '#BF5B3D',
    '#D4A574',
    '#2F6B9A',
    '#0F766E',
    '#B45309',
    '#7C3AED',
    '#BE123C',
    '#2563EB',
    '#047857',
    '#C2410C',
  ]

  const gravityPositions = [
    { x: '16%', y: '18%' },
    { x: '34%', y: '16%' },
    { x: '52%', y: '18%' },
    { x: '70%', y: '16%' },
    { x: '24%', y: '44%' },
    { x: '44%', y: '46%' },
    { x: '64%', y: '44%' },
    { x: '30%', y: '68%' },
    { x: '58%', y: '68%' },
  ]

  const allowInteractivePhysics = gravityMode !== 'off'

  const gravityConfig = useMemo(() => {
    if (gravityMode === 'desktop') {
      return {
        gravityY: 0.72,
        maxFps: 44,
        restitution: 0.28,
        density: 0.0012,
      }
    }

    if (gravityMode === 'mobile') {
      return {
        gravityY: 0.56,
        maxFps: 30,
        restitution: 0.18,
        density: 0.001,
      }
    }

    return {
      gravityY: 0.72,
      maxFps: 44,
      restitution: 0.22,
      density: 0.0011,
    }
  }, [gravityMode])

  const activeGravitySkills = useMemo(
    () => (gravityMode === 'mobile' ? gravitySkills.slice(0, 6) : gravitySkills),
    [gravityMode, gravitySkills]
  )

  useEffect(() => {
    const decidePhysicsMode = () => {
      const canMatchMedia = typeof window.matchMedia === 'function'
      const hasFinePointer = canMatchMedia ? window.matchMedia('(pointer: fine)').matches : false
      const hasHover = canMatchMedia ? window.matchMedia('(hover: hover)').matches : false
      const reduceMotion = canMatchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
      const isDesktop = window.innerWidth >= 1024
      const canUseTouch = supportsTouchInput()

      if (reduceMotion) {
        setGravityMode('off')
        return
      }

      if (hasFinePointer && hasHover && isDesktop) {
        setGravityMode('desktop')
        return
      }

      if (canUseTouch) {
        setGravityMode('mobile')
        return
      }

      setGravityMode('off')
    }

    decidePhysicsMode()
    window.addEventListener('resize', decidePhysicsMode)

    return () => {
      window.removeEventListener('resize', decidePhysicsMode)
    }
  }, [])

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    if (!allowInteractivePhysics) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry?.isIntersecting) return
        setShouldLoadPhysics(true)
        observer.disconnect()
      },
      { root: null, rootMargin: '320px 0px', threshold: 0.01 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [allowInteractivePhysics])

  useEffect(() => {
    if (!shouldLoadPhysics || gravityModule) return

    let cancelled = false
    import('../gravity').then((module) => {
      if (!cancelled) {
        setGravityModule(module)
      }
    })

    return () => {
      cancelled = true
    }
  }, [gravityModule, shouldLoadPhysics])

  const GravityComponent = gravityModule?.Gravity
  const MatterBodyComponent = gravityModule?.MatterBody

  return (
    <section 
      ref={sectionRef}
      id="skills" 
      className="py-20 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: isDark ? '#1A1510' : '#FFFBF5' }}
    >
      <div className="relative">
        {/* Section Label */}
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl mb-2 transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Technologies & Tools
          </h2>
          <div className="w-16 h-px mx-auto" style={{ backgroundColor: '#BF5B3D' }} />
        </div>

        <div
          className="relative overflow-hidden rounded-2xl border -mx-2 sm:-mx-3 md:mx-0"
          style={{
            borderColor: isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.32)',
            background: isDark ? 'linear-gradient(145deg, #17130F, #0E0E0B)' : 'linear-gradient(145deg, #FFFEFC, #F5F0E8)',
          }}
        >
          <div className="absolute inset-0 z-0">
            {allowInteractivePhysics && GravityComponent && MatterBodyComponent ? (
              <GravityComponent
                gravity={{ x: 0, y: gravityConfig.gravityY }}
                className="w-full h-full"
                resetOnResize
                pauseWhenOffscreen
                maxFps={gravityConfig.maxFps}
              >
                {activeGravitySkills.map((skill, index) => {
                  const position = gravityPositions[index] ?? { x: '50%', y: '18%' }
                  const bg = gravityPalette[index % gravityPalette.length]

                  return (
                    <MatterBodyComponent
                      key={`${skill}-${index}`}
                      matterBodyOptions={{
                        friction: 0.42,
                        restitution: gravityConfig.restitution,
                        density: gravityConfig.density,
                      }}
                      x={position.x}
                      y={position.y}
                    >
                      <div
                        className="rounded-full px-3 sm:px-5 py-2 sm:py-3 text-[11px] sm:text-sm font-semibold text-white whitespace-nowrap shadow-lg"
                        style={{ backgroundColor: bg }}
                      >
                        {skill}
                      </div>
                    </MatterBodyComponent>
                  )
                })}
              </GravityComponent>
            ) : (
              <div className="absolute inset-0">
                {activeGravitySkills.map((skill, index) => {
                  const position = gravityPositions[index] ?? { x: '50%', y: '18%' }
                  const bg = gravityPalette[index % gravityPalette.length]

                  return (
                    <div
                      key={`${skill}-fallback-${index}`}
                      className="absolute rounded-full px-3 sm:px-5 py-2 sm:py-3 text-[11px] sm:text-sm font-semibold text-white whitespace-nowrap shadow-lg pointer-events-none opacity-85"
                      style={{
                        left: position.x,
                        top: position.y,
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: bg,
                      }}
                    >
                      {skill}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="relative z-10 h-[170px] sm:h-[180px] pointer-events-none">
            <PerspectiveMarquee
              items={row1Skills}
              fontSize={34}
              fontWeight={700}
              pixelsPerFrame={-1.2}
              rotateY={-16}
              rotateX={5}
              perspective={1000}
              fadeColor={isDark ? '#1A1510' : '#FFFBF5'}
              background="transparent"
              color={isDark ? 'rgba(240,235,224,0.78)' : 'rgba(26,18,8,0.72)'}
            />
          </div>

          <div className="relative z-10 h-[170px] sm:h-[180px] border-t pointer-events-none" style={{ borderColor: isDark ? 'rgba(212, 165, 116, 0.15)' : 'rgba(212, 165, 116, 0.25)' }}>
            <PerspectiveMarquee
              items={row2Skills}
              fontSize={34}
              fontWeight={700}
              pixelsPerFrame={1.2}
              rotateY={16}
              rotateX={5}
              perspective={1000}
              fadeColor={isDark ? '#1A1510' : '#FFFBF5'}
              background="transparent"
              color={isDark ? 'rgba(240,235,224,0.78)' : 'rgba(26,18,8,0.72)'}
            />
          </div>
        </div>
      </div>
    </section>
  )
}