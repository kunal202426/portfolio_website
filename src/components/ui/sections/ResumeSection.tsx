import { Suspense, lazy, useState, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Eye, Download, FileText, ExternalLink } from 'lucide-react'
import { useTheme } from '../../providers/ThemeProvider'
import { KeycapButton } from '../KeycapButton'

const RESUME_PATH = '/Resume_general.pdf'
const LazyResumeModal = lazy(() => import('../ResumeModal').then((module) => ({ default: module.ResumeModal })))

export const ResumeSection = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const smoothTiltX = useSpring(tiltX, { stiffness: 220, damping: 24, mass: 0.45 })
  const smoothTiltY = useSpring(tiltY, { stiffness: 220, damping: 24, mass: 0.45 })
  const hoverGlareOpacity = useMotionValue(0)
  const smoothHoverGlareOpacity = useSpring(hoverGlareOpacity, { stiffness: 180, damping: 22 })
  const hoverGlareX = useTransform(smoothTiltY, [-5, 5], ['-50%', '50%'])
  const hoverGlareY = useTransform(smoothTiltX, [-4.5, 4.5], ['10%', '-10%'])

  
  const openResume = () => {
    setIsModalOpen(true)
  }

  const handlePhoneMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const pointerX = (event.clientX - rect.left) / rect.width - 0.5
    const pointerY = (event.clientY - rect.top) / rect.height - 0.5
    tiltX.set(-pointerY * 9)
    tiltY.set(pointerX * 10)
    hoverGlareOpacity.set(1)
  }

  const resetPhoneTilt = () => {
    tiltX.set(0)
    tiltY.set(0)
    hoverGlareOpacity.set(0)
  }

  return (
    <section id="resume" className="pt-0 pb-24 px-6 transition-colors duration-500" style={{ backgroundColor: isDark ? '#1A1510' : '#EFEBE3' }}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-brush text-4xl md:text-5xl mb-4 transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
            Professional Background
          </h2>
          <p className="text-lg max-w-xl mx-auto transition-colors duration-500" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
            A detailed overview of my experience, skills, and achievements
          </p>
        </motion.div>

        {/* Mobile Phone Mockup with PDF Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col lg:flex-row items-center justify-center gap-12"
        >
          {/* Phone Mockup */}
          <div 
            className="relative cursor-pointer group"
            onClick={openResume}
            onMouseMove={handlePhoneMove}
            onMouseLeave={resetPhoneTilt}
          >
            {/* Phone Frame */}
            <motion.div 
              className="relative w-[280px] md:w-[320px] rounded-[3rem] p-3 shadow-2xl transition-transform duration-500 group-hover:scale-105"
              style={{ 
                backgroundColor: isDark ? '#0E0E0B' : '#1A1208',
                boxShadow: isDark ? '0 50px 100px -20px rgba(0, 0, 0, 0.6)' : '0 50px 100px -20px rgba(26, 18, 8, 0.4)',
                rotateX: smoothTiltX,
                rotateY: smoothTiltY,
              }}
              initial={{ opacity: 0, y: 28, scale: 0.93 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 rounded-b-2xl" style={{ backgroundColor: isDark ? '#0E0E0B' : '#1A1208' }} />
              
              {/* Screen */}
              <div
                className="relative rounded-[2.5rem] overflow-hidden transition-colors duration-500"
                style={{
                  backgroundColor: isDark ? '#1A1510' : '#F5F0E8',
                  aspectRatio: '9/19.5'
                }}
              >
                {/* Continuous reflection sweep */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(115deg, transparent 20%, rgba(255,220,180,0.07) 40%, rgba(255,255,255,0.14) 50%, rgba(255,220,180,0.07) 60%, transparent 80%)',
                    zIndex: 1,
                    borderRadius: '2.5rem',
                  }}
                  animate={{ x: ['-110%', '110%'] }}
                  transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
                />

                {/* Ambient orange pulse */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at 30% 40%, rgba(191, 91, 61,0.07) 0%, transparent 60%)',
                    zIndex: 1,
                    borderRadius: '2.5rem',
                  }}
                  animate={{ opacity: [0.4, 1, 0.4], x: ['-8%', '8%', '-8%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Hover-driven glare */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(110deg, transparent 25%, rgba(255,245,210,0.15) 45%, rgba(255,255,255,0.28) 52%, rgba(255,245,210,0.15) 60%, transparent 78%)',
                    zIndex: 2,
                    borderRadius: '2.5rem',
                    opacity: smoothHoverGlareOpacity,
                    x: hoverGlareX,
                    y: hoverGlareY,
                  }}
                />

                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 py-2 text-xs font-medium transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208', position: 'relative', zIndex: 3 }}>
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-2 rounded-sm" style={{ backgroundColor: isDark ? '#F0EBE0' : '#1A1208' }} />
                  </div>
                </div>

                {/* PDF Preview Placeholder */}
                <div className="p-2 h-full overflow-hidden flex items-center justify-center" style={{ position: 'relative', zIndex: 3 }}>
                  <div className="w-full h-full rounded-lg shadow-inner flex flex-col items-center justify-center gap-4 p-4 transition-colors duration-500" style={{ backgroundColor: isDark ? '#0E0E0B' : 'white' }}>
                    <FileText size={48} style={{ color: '#BF5B3D' }} />
                    <span className="text-sm font-medium text-center transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
                      Resume
                    </span>
                    <span className="text-xs text-center transition-colors duration-500" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
                      Kunal Mathur
                    </span>
                    <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: '#9B8B70' }}>
                      <ExternalLink size={12} />
                      <span>Tap to open</span>
                    </div>
                  </div>
                </div>

                {/* Tap to view overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center rounded-[2.5rem]">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-sm font-medium" style={{ color: '#1A1208' }}>
                    <ExternalLink size={16} />
                    Open in new tab
                  </div>
                </div>
              </div>

              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full" style={{ backgroundColor: isDark ? '#F0EBE0' : '#4A3C2A' }} />
            </motion.div>

            {/* Reflection */}
            <div 
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[200px] h-8 rounded-full blur-2xl opacity-20"
              style={{ backgroundColor: isDark ? '#F0EBE0' : '#1A1208' }}
            />
          </div>

          {/* Info Panel */}
          <div className="text-center lg:text-left max-w-md">
            <h3 className="font-display text-2xl font-bold mb-4 transition-colors duration-500" style={{ color: isDark ? '#F0EBE0' : '#1A1208' }}>
              View My Resume
            </h3>
            <p className="mb-6 transition-colors duration-500" style={{ color: isDark ? '#D4C4A8' : '#4A3C2A' }}>
              Click the phone or use the buttons below to view my complete resume. You can also download a copy for your records.
            </p>
            
            <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
              <KeycapButton
                onClick={openResume}
                label="View Resume"
                icon={<Eye size={18} />}
                tone="orange"
                size="wide"
              />

              <KeycapButton
                href={RESUME_PATH}
                download
                label="Download PDF"
                icon={<Download size={18} />}
                tone="blue"
                size="wide"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Resume Modal */}
      {isModalOpen ? (
        <Suspense fallback={null}>
          <LazyResumeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Suspense>
      ) : null}
    </section>
  )
}
