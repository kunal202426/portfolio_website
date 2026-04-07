import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { useTheme } from '../providers/ThemeProvider'

/**
 * Horizontal Scrolling Tech Marquee
 * Auto-scrolling marquee of technologies - no bars, no percentages, no grid
 */
export const TechMarquee = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.to('.tech-marquee', {
        x: '-50%',
        duration: 30,
        repeat: -1,
        ease: 'none'
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Simple, safe skill extraction
  const allSkills = [
    'Java', 'Python', 'JavaScript', 'TypeScript', 'Solidity',
    'React.js', 'Three.js', 'ReactFlow', 'HTML5', 'CSS3', 'Responsive Design', 'Framer Motion', 'Tailwind CSS',
    'Node.js', 'FastAPI', 'Express.js', 'RESTful APIs', 'WebSocket', 'Microservices', 'System Design',
    'PostgreSQL', 'MongoDB', 'Firebase',
    'TensorFlow', 'Scikit-learn', 'LSTM', 'LightGBM', 'Deep Learning', 'Computer Vision', 'Data Analysis',
    'Ethereum', 'Smart Contracts', 'Web3.js', 'DApps',
    'Git', 'GitHub', 'AWS', 'Vercel', 'Figma', 'VS Code',
    'Distributed Systems', 'Chaos Engineering', 'CI/CD', 'Agile/Scrum'
  ]

  // Duplicate for seamless loop
  const duplicatedSkills = [...allSkills, ...allSkills]

  return (
    <section 
      id="skills" 
      className="py-20 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: isDark ? '#1A1510' : '#FFFBF5' }}
    >
      <div ref={containerRef} className="relative">
        {/* Section Label */}
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl mb-2 transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Technologies & Tools
          </h2>
          <div className="w-16 h-px mx-auto" style={{ backgroundColor: '#E8570C' }} />
        </div>

        {/* Scrolling Marquee Container */}
        <div className="relative overflow-hidden">
          <div className="tech-marquee flex items-center gap-8 whitespace-nowrap">
            {duplicatedSkills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="inline-flex items-center px-4 py-2 font-medium transition-all duration-300 rounded-lg hover:scale-105"
                style={{ 
                  minWidth: 'fit-content',
                  color: isDark ? '#D4C4A8' : '#4A3C2A',
                  border: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.4)'}`,
                  backgroundColor: isDark ? 'rgba(14, 14, 11, 0.8)' : 'rgba(245, 240, 232, 0.8)'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Gradient Fade Edges */}
        <div 
          className="absolute inset-y-0 left-0 w-32 pointer-events-none z-10 transition-colors duration-500" 
          style={{ background: isDark ? 'linear-gradient(to right, #1A1510, transparent)' : 'linear-gradient(to right, #FFFBF5, transparent)' }}
        />
        <div 
          className="absolute inset-y-0 right-0 w-32 pointer-events-none z-10 transition-colors duration-500" 
          style={{ background: isDark ? 'linear-gradient(to left, #1A1510, transparent)' : 'linear-gradient(to left, #FFFBF5, transparent)' }}
        />
      </div>
    </section>
  )
}