import { ProjectCarousel } from '../ui/ProjectCarousel'
import { resumeData } from '../../lib/resume-data'
import { useTheme } from '../providers/ThemeProvider'

export const ProjectsSection = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <section 
      id="projects" 
      className="relative w-full py-24 px-6 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: isDark ? '#0E0E0B' : '#F5F0E8' }}
    >
      {/* Decorative glow */}
      <div className="absolute top-40 left-20 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #E8570C 0%, transparent 70%)', filter: 'blur(100px)' }} />
      <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #D4A574 0%, transparent 70%)', filter: 'blur(80px)' }} />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <ProjectCarousel projects={resumeData.projects} />
      </div>
    </section>
  )
}
