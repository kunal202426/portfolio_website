import { useMemo } from 'react'
import { resumeData } from '../../../lib/resume-data'
import { Briefcase } from 'lucide-react'
import { useTheme } from '../../providers/ThemeProvider'
import { CareerWormhole } from '../CareerWormhole'

export const ExperienceSection = () => {
  // Oldest first, so flying through the tunnel reads as a career progression.
  const experiences = useMemo(() => [...resumeData.experience].sort((a, b) => a.year - b.year), [])
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  const wormholeCards = useMemo(
    () =>
      experiences.map((exp) => ({
        caption: exp.company,
        title: exp.title,
        description: `${exp.period} · ${exp.location}`,
        details: exp.achievements,
      })),
    [experiences],
  )

  return (
    <section
      id="experience"
      className="relative w-full py-24 transition-colors duration-500"
      style={{
        backgroundColor: isDark ? 'var(--bg-primary)' : '#F5F0E8',
      }}
    >
      <div className="max-w-5xl mx-auto relative z-10 px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-medium mb-4" style={{ color: 'var(--accent-primary)' }}>
            <Briefcase size={16} />
            Experience
          </span>
          <h2 className="font-brush text-4xl md:text-5xl transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Career Journey
          </h2>
        </div>
      </div>

      {/* Scroll-driven 3D tunnel - scroll through it to fly past each role */}
      <CareerWormhole cards={wormholeCards} />
    </section>
  )
}
