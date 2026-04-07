import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { resumeData } from '../../lib/resume-data'
import { useTheme } from '../providers/ThemeProvider'

gsap.registerPlugin(ScrollTrigger)

/**
 * Warm Editorial Contact Section
 * Clean contact form with animated elements
 */
export const ContactSection = () => {
  const containerRef = useRef<HTMLElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.contact-item', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%'
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={containerRef}
      id="contact" 
      className="relative py-24 px-6 overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: isDark ? '#0E0E0B' : '#1A1208' }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #E8570C 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #D4A574 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 contact-item">
          <span className="text-sm uppercase tracking-[0.2em] font-medium mb-4 block" style={{ color: '#E8570C' }}>
            Get in Touch
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6" style={{ color: '#F5F0E8' }}>
            Let's Build Something
            <br />
            <span style={{ color: '#E8570C' }}>Together</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#D4C4A8' }}>
            Have a project in mind? I'm always open to discussing new opportunities and ideas.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="contact-item">
              <h3 className="font-display text-2xl font-bold mb-6" style={{ color: '#F5F0E8' }}>
                Contact Information
              </h3>
              
              <div className="space-y-6">
                {/* Email */}
                <motion.a
                  href={`mailto:${resumeData.personal.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all group"
                  style={{ backgroundColor: 'rgba(245, 240, 232, 0.05)' }}
                  whileHover={{ x: 8, backgroundColor: 'rgba(232, 87, 12, 0.1)' }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8570C' }}>
                    <Mail size={20} color="#F5F0E8" />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: '#9B8B70' }}>Email</p>
                    <p className="font-medium" style={{ color: '#F5F0E8' }}>{resumeData.personal.email}</p>
                  </div>
                </motion.a>

                {/* Phone */}
                <motion.a
                  href={`tel:${resumeData.personal.phone}`}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all group"
                  style={{ backgroundColor: 'rgba(245, 240, 232, 0.05)' }}
                  whileHover={{ x: 8, backgroundColor: 'rgba(232, 87, 12, 0.1)' }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D4A574' }}>
                    <Phone size={20} color="#1A1208" />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: '#9B8B70' }}>Phone</p>
                    <p className="font-medium" style={{ color: '#F5F0E8' }}>{resumeData.personal.phone}</p>
                  </div>
                </motion.a>

                {/* Location */}
                <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(245, 240, 232, 0.05)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(245, 240, 232, 0.1)' }}>
                    <MapPin size={20} color="#F5F0E8" />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: '#9B8B70' }}>Location</p>
                    <p className="font-medium" style={{ color: '#F5F0E8' }}>India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="contact-item">
              <h4 className="text-sm uppercase tracking-[0.2em] font-medium mb-4" style={{ color: '#9B8B70' }}>
                Connect With Me
              </h4>
              <div className="flex gap-4">
                <motion.a
                  href={resumeData.personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'rgba(245, 240, 232, 0.1)' }}
                  whileHover={{ scale: 1.1, backgroundColor: '#E8570C' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#F5F0E8">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </motion.a>
                <motion.a
                  href={resumeData.personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'rgba(245, 240, 232, 0.1)' }}
                  whileHover={{ scale: 1.1, backgroundColor: '#E8570C' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#F5F0E8">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </motion.a>
              </div>
            </div>

            {/* Availability */}
            <div className="contact-item flex items-center gap-3">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#22C55E' }} />
              <span style={{ color: '#D4C4A8' }}>Available for new projects</span>
            </div>
          </div>

          {/* Contact Form */}
          <motion.form 
            className="contact-item p-8 rounded-2xl"
            style={{ backgroundColor: 'rgba(245, 240, 232, 0.05)', border: '1px solid rgba(245, 240, 232, 0.1)' }}
            onSubmit={e => e.preventDefault()}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2" style={{ color: '#D4C4A8' }}>Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-lg bg-transparent border outline-none transition-colors focus:border-orange-500"
                  style={{ borderColor: 'rgba(245, 240, 232, 0.2)', color: '#F5F0E8' }}
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: '#D4C4A8' }}>Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg bg-transparent border outline-none transition-colors focus:border-orange-500"
                  style={{ borderColor: 'rgba(245, 240, 232, 0.2)', color: '#F5F0E8' }}
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: '#D4C4A8' }}>Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3 rounded-lg bg-transparent border outline-none transition-colors resize-none focus:border-orange-500"
                  style={{ borderColor: 'rgba(245, 240, 232, 0.2)', color: '#F5F0E8' }}
                />
              </div>
              <motion.button
                type="submit"
                className="w-full py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                style={{ backgroundColor: '#E8570C', color: '#F5F0E8' }}
                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(232, 87, 12, 0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                <Send size={18} />
                Send Message
              </motion.button>
            </div>
          </motion.form>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t text-center" style={{ borderColor: 'rgba(245, 240, 232, 0.1)' }}>
          <p className="text-sm" style={{ color: '#9B8B70' }}>
            © {new Date().getFullYear()} Kunal Mathur. Crafted with attention to detail.
          </p>
        </div>
      </div>
    </section>
  )
}
