import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { useTheme } from '../../providers/ThemeProvider'

/**
 * Dual Direction Tech Marquee with 3D Cards
 * Two strips moving in opposite directions with 3D effect
 */
export const TechMarquee = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // First strip - moves left
      gsap.to('.tech-marquee-1', {
        x: '-50%',
        duration: 40,
        repeat: -1,
        ease: 'none'
      })

      // Second strip - moves right
      gsap.to('.tech-marquee-2', {
        x: '50%',
        duration: 40,
        repeat: -1,
        ease: 'none'
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Split skills into two rows
  const row1Skills = [
    'Java', 'Python', 'JavaScript', 'TypeScript', 'Solidity',
    'React.js', 'Three.js', 'Node.js', 'FastAPI', 'Express.js',
    'PostgreSQL', 'MongoDB', 'Firebase', 'TensorFlow', 'Scikit-learn'
  ]

  const row2Skills = [
    'LSTM', 'LightGBM', 'Deep Learning', 'Computer Vision', 'Data Analysis',
    'Ethereum', 'Smart Contracts', 'Web3.js', 'Git', 'GitHub',
    'AWS', 'Vercel', 'Docker', 'CI/CD', 'System Design'
  ]

  // Duplicate for seamless loop
  const duplicatedRow1 = [...row1Skills, ...row1Skills]
  const duplicatedRow2 = [...row2Skills, ...row2Skills]

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

        {/* First Marquee Strip - Left Direction */}
        <div className="relative overflow-hidden mb-6">
          <div className="tech-marquee-1 flex items-center gap-6 whitespace-nowrap">
            {duplicatedRow1.map((skill, index) => (
              <span
                key={`row1-${skill}-${index}`}
                className="inline-flex items-center px-6 py-3 font-medium transition-all duration-300 rounded-xl group cursor-pointer"
                style={{ 
                  minWidth: 'fit-content',
                  color: isDark ? '#F0EBE0' : '#1A1208',
                  background: isDark 
                    ? 'linear-gradient(145deg, #1F1A15, #141410)' 
                    : 'linear-gradient(145deg, #FFFFFF, #F5F0E8)',
                  border: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.3)'}`,
                  boxShadow: isDark 
                    ? '4px 4px 8px rgba(0, 0, 0, 0.5), -2px -2px 6px rgba(40, 35, 30, 0.3)' 
                    : '4px 4px 12px rgba(0, 0, 0, 0.1), -2px -2px 8px rgba(255, 255, 255, 0.9)'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
          
          {/* Gradient Fades */}
          <div 
            className="absolute inset-y-0 left-0 w-32 pointer-events-none z-10 transition-colors duration-500" 
            style={{ background: isDark ? 'linear-gradient(to right, #1A1510, transparent)' : 'linear-gradient(to right, #FFFBF5, transparent)' }}
          />
          <div 
            className="absolute inset-y-0 right-0 w-32 pointer-events-none z-10 transition-colors duration-500" 
            style={{ background: isDark ? 'linear-gradient(to left, #1A1510, transparent)' : 'linear-gradient(to left, #FFFBF5, transparent)' }}
          />
        </div>

        {/* Second Marquee Strip - Right Direction */}
        <div className="relative overflow-hidden">
          <div className="tech-marquee-2 flex items-center gap-6 whitespace-nowrap" style={{ transform: 'translateX(-50%)' }}>
            {duplicatedRow2.map((skill, index) => (
              <span
                key={`row2-${skill}-${index}`}
                className="inline-flex items-center px-6 py-3 font-medium transition-all duration-300 rounded-xl group cursor-pointer"
                style={{ 
                  minWidth: 'fit-content',
                  color: isDark ? '#F0EBE0' : '#1A1208',
                  background: isDark 
                    ? 'linear-gradient(145deg, #1F1A15, #141410)' 
                    : 'linear-gradient(145deg, #FFFFFF, #F5F0E8)',
                  border: `1px solid ${isDark ? 'rgba(212, 165, 116, 0.2)' : 'rgba(212, 165, 116, 0.3)'}`,
                  boxShadow: isDark 
                    ? '4px 4px 8px rgba(0, 0, 0, 0.5), -2px -2px 6px rgba(40, 35, 30, 0.3)' 
                    : '4px 4px 12px rgba(0, 0, 0, 0.1), -2px -2px 8px rgba(255, 255, 255, 0.9)'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
          
          {/* Gradient Fades */}
          <div 
            className="absolute inset-y-0 left-0 w-32 pointer-events-none z-10 transition-colors duration-500" 
            style={{ background: isDark ? 'linear-gradient(to right, #1A1510, transparent)' : 'linear-gradient(to right, #FFFBF5, transparent)' }}
          />
          <div 
            className="absolute inset-y-0 right-0 w-32 pointer-events-none z-10 transition-colors duration-500" 
            style={{ background: isDark ? 'linear-gradient(to left, #1A1510, transparent)' : 'linear-gradient(to left, #FFFBF5, transparent)' }}
          />
        </div>
      </div>
    </section>
  )
}