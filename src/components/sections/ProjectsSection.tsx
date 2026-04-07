import { ProjectCarousel } from '../ui/ProjectCarousel'
import { resumeData } from '../../lib/resume-data'

export const ProjectsSection = () => {
  return (
    <section id="projects" className="relative w-full py-24 px-6 bg-bg-secondary overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <ProjectCarousel projects={resumeData.projects} />
      </div>
    </section>
  )
}
