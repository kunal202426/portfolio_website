import { useMemo } from 'react'
import { useTheme } from '../../providers/ThemeProvider'
import { PerspectiveMarquee } from '../remocn-perspective-marquee'
import { resumeData } from '../../../lib/resume-data'

export const TechMarquee = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const [row1Skills, row2Skills] = useMemo(() => {
    const allTech = [
      ...resumeData.skills.languages,
      ...resumeData.skills.frontend.map((skill) => skill.name),
      ...resumeData.skills.backend.map((skill) => skill.name),
      ...resumeData.skills.databases,
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

    return [row1, row2.length > 0 ? row2 : row1]
  }, [])

  return (
    <section 
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
          <div className="w-16 h-px mx-auto" style={{ backgroundColor: '#E8570C' }} />
        </div>

        <div
          className="relative overflow-hidden rounded-2xl border"
          style={{
            borderColor: isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.32)',
            background: isDark ? 'linear-gradient(145deg, #17130F, #0E0E0B)' : 'linear-gradient(145deg, #FFFEFC, #F5F0E8)',
          }}
        >
          <div className="relative h-[140px] sm:h-[165px]">
            <PerspectiveMarquee
              items={row1Skills}
              fontSize={42}
              fontWeight={700}
              pixelsPerFrame={-1.2}
              rotateY={-16}
              rotateX={5}
              perspective={1000}
              fadeColor={isDark ? '#1A1510' : '#FFFBF5'}
              background="transparent"
              color={isDark ? '#F0EBE0' : '#1A1208'}
            />
          </div>

          <div className="relative h-[140px] sm:h-[165px] border-t" style={{ borderColor: isDark ? 'rgba(212, 165, 116, 0.15)' : 'rgba(212, 165, 116, 0.25)' }}>
            <PerspectiveMarquee
              items={row2Skills}
              fontSize={42}
              fontWeight={700}
              pixelsPerFrame={1.2}
              rotateY={16}
              rotateX={5}
              perspective={1000}
              fadeColor={isDark ? '#1A1510' : '#FFFBF5'}
              background="transparent"
              color={isDark ? '#F0EBE0' : '#1A1208'}
            />
          </div>
        </div>
      </div>
    </section>
  )
}