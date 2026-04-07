import { useState, useEffect } from 'react'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { Navbar } from './components/ui/Navbar'
import { ScrollProgress } from './components/ui/ScrollProgress'
import { ThemeTransition } from './components/ui/ThemeTransition'
import { HeroSection } from './components/sections/HeroSection'
import { AboutSection } from './components/sections/AboutSection'
import { ProjectsSection } from './components/sections/ProjectsSection'
import { ExperienceSection } from './components/sections/ExperienceSection'
import { TechMarquee } from './components/sections/TechMarquee'
import { EducationSection } from './components/sections/EducationSection'
import { CertificationsSection } from './components/sections/CertificationsSection'
import { ResumeSection } from './components/sections/ResumeSection'
import { ContactSection } from './components/sections/ContactSection'
import { LenisProvider } from './components/providers/LenisProvider'
import { ThemeProvider, useTheme } from './components/providers/ThemeProvider'

function AppContent() {
  const [isLoading, setIsLoading] = useState(true)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    // Simulate loading time - reduced for better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const isDark = resolvedTheme === 'dark'

  return (
    <div 
      className="w-full overflow-hidden transition-colors duration-500" 
      style={{ 
        backgroundColor: isDark ? '#0E0E0B' : '#F5F0E8', 
        color: isDark ? '#F0EBE0' : '#1A1208' 
      }}
    >
      {isLoading && <LoadingScreen onLoadComplete={() => setIsLoading(false)} />}

      <ThemeTransition />
      <ScrollProgress />
      <Navbar />

      <main className="min-h-screen">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <TechMarquee />
        <ExperienceSection />
        <ResumeSection />
        <EducationSection />
        <CertificationsSection />
        <ContactSection />
      </main>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <LenisProvider>
        <AppContent />
      </LenisProvider>
    </ThemeProvider>
  )
}

export default App
