import { useMemo } from 'react'
import { GraduationCap } from 'lucide-react'
import { resumeData } from '../../../lib/resume-data'
import { useTheme } from '../../providers/ThemeProvider'
import { ExpandOnHoverList, type ExpandListItem } from '../ExpandOnHoverList'

export const EducationSection = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  const items = useMemo<ExpandListItem[]>(
    () =>
      resumeData.education.map((edu, index) => ({
        index: String(index + 1).padStart(2, '0'),
        title: edu.school,
        subtitle: edu.specialization ? `${edu.degree} · ${edu.specialization}` : edu.degree,
        meta: [
          { icon: 'calendar', label: edu.period },
          { icon: 'map', label: edu.location },
        ],
        url: edu.url,
      })),
    [],
  )

  return (
    <section
      id="education"
      className="relative w-full py-10 md:py-16 px-6 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: isDark ? 'var(--bg-primary)' : '#FFFBF5' }}
    >
      {/* Decorative */}
      <div className="absolute top-10 right-20 w-32 h-32 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #D4A574 0%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6 md:mb-10">
          <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-medium mb-3" style={{ color: '#D4A574' }}>
            <GraduationCap size={16} />
            Education
          </span>
          <h2 className="font-brush text-4xl md:text-5xl transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Academic Journey
          </h2>
        </div>

        {/* Numbered expand-on-hover list, kept deliberately compact (each
            row is a single fixed-height line until opened) - the section
            as a whole is scroll-scaled away as Certifications slides up
            over it (see App.tsx's educationCertRef transform), and the old
            tall stacked cards were getting covered before ever fully
            showing. */}
        <ExpandOnHoverList items={items} isDark={isDark} />
      </div>
    </section>
  )
}
