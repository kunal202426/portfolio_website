import { useMemo } from 'react'
import { resumeData } from '../../../lib/resume-data'
import { Briefcase } from 'lucide-react'
import { useTheme } from '../../providers/ThemeProvider'
import { ClickExpandList, type ClickExpandItem } from '../ClickExpandList'

export const ExperienceSection = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  // Oldest first, so the list reads as a career progression.
  const items = useMemo<ClickExpandItem[]>(
    () =>
      [...resumeData.experience]
        .sort((a, b) => a.year - b.year)
        .map((exp, index) => ({
          index: String(index + 1).padStart(2, '0'),
          title: exp.company,
          subtitle: exp.title,
          badge: 'Experience',
          bullets: exp.achievements,
          meta: [
            { icon: 'calendar', label: exp.period },
            { icon: 'map', label: exp.location },
          ],
        })),
    [],
  )

  return (
    <section
      id="experience"
      className="relative w-full py-24 px-6 transition-colors duration-500"
      style={{ backgroundColor: isDark ? 'var(--bg-primary)' : '#F5F0E8' }}
    >
      <div className="max-w-5xl mx-auto relative z-10">
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

        <ClickExpandList items={items} isDark={isDark} />
      </div>
    </section>
  )
}
