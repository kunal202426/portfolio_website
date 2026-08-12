import { ProjectCarousel } from '../ProjectCarousel'
import { GithubTumbleweed } from '../GithubTumbleweed'
import { resumeData } from '../../../lib/resume-data'
import { useTheme } from '../../providers/ThemeProvider'

export const ProjectsSection = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <section 
      id="projects" 
      className="relative w-full py-12 md:py-24 px-4 md:px-6 overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: isDark ? '#0E0E0B' : '#F5F0E8',
        contentVisibility: 'auto',
        containIntrinsicSize: '1200px',
      }}
    >
      {/* Decorative glow */}
      <div className="absolute top-40 left-20 w-96 h-96 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(232,87,12,0.38) 0%, rgba(232,87,12,0) 72%)' }} />
      <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.32) 0%, rgba(212,165,116,0) 70%)' }} />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <ProjectCarousel projects={resumeData.projects} />
      </div>

      <GithubTumbleweed />
    </section>
  )
}
