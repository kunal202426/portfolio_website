import { useState, useEffect } from 'react'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { Navbar } from './components/ui/Navbar'
import { ScrollProgress } from './components/ui/ScrollProgress'
import { HeroSection } from './components/sections/HeroSection'
import { AboutSection } from './components/sections/AboutSection'
import { ProjectsSection } from './components/sections/ProjectsSection'
import { ExperienceSection } from './components/sections/ExperienceSection'
import { SkillsSection } from './components/sections/SkillsSection'
import { EducationSection } from './components/sections/EducationSection'
import { CertificationsSection } from './components/sections/CertificationsSection'
import { ResumeSection } from './components/sections/ResumeSection'
import { ContactSection } from './components/sections/ContactSection'
import { LenisProvider } from './components/providers/LenisProvider'


function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <LenisProvider>
      <div className="w-full overflow-hidden bg-bg-primary">
        {isLoading && <LoadingScreen onLoadComplete={() => setIsLoading(false)} />}

        <ScrollProgress />
        <Navbar />

        <main className="min-h-screen">
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <ExperienceSection />
          <SkillsSection />
          <EducationSection />
          <CertificationsSection />
          <ResumeSection />
          <ContactSection />
        </main>
      </div>
    </LenisProvider>
  )
}

export default App
