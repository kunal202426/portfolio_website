import { motion } from 'framer-motion'
import { Mail, Briefcase, Code2, MessageCircle } from 'lucide-react'
import { MagneticButton } from '../ui/MagneticButton'
import { containerVariants, itemVariants } from '../../lib/animation-variants'
import { resumeData } from '../../lib/resume-data'

export const ContactSection = () => {
  const socialLinks = [
    { icon: Briefcase, href: resumeData.personal.linkedin, label: 'LinkedIn' },
    { icon: Code2, href: resumeData.personal.github, label: 'GitHub' },
    { icon: Mail, href: `mailto:${resumeData.personal.email}`, label: 'Email' },
    { icon: MessageCircle, href: 'https://twitter.com', label: 'Twitter' },
  ]

  return (
    <section id="contact" className="relative w-full py-24 px-6 bg-bg-secondary overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.p
            variants={itemVariants}
            className="text-sm text-accent-primary font-mono uppercase tracking-widest mb-4"
          >
            // 05 Contact
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6"
          >
            Let's Build Something Remarkable
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
          >
            Have an exciting project or idea? I'm always open to collaborating on innovative solutions.
            Reach out and let's create something amazing together.
          </motion.p>
        </motion.div>

        {/* Contact Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {/* Left - Contact Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="p-6 rounded-lg border border-border-subtle bg-bg-card hover:border-accent-primary/50 transition-colors">
              <h3 className="text-text-primary font-bold mb-2">Email</h3>
              <a
                href={`mailto:${resumeData.personal.email}`}
                className="text-accent-primary hover:text-accent-glow transition-colors break-all"
              >
                {resumeData.personal.email}
              </a>
            </div>

            <div className="p-6 rounded-lg border border-border-subtle bg-bg-card hover:border-accent-primary/50 transition-colors">
              <h3 className="text-text-primary font-bold mb-2">Phone</h3>
              <a
                href={`tel:${resumeData.personal.phone}`}
                className="text-accent-primary hover:text-accent-glow transition-colors"
              >
                {resumeData.personal.phone}
              </a>
            </div>

            <div className="p-6 rounded-lg border border-border-subtle bg-bg-card hover:border-accent-primary/50 transition-colors">
              <h3 className="text-text-primary font-bold mb-4">Connect</h3>
              <div className="flex gap-4">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-3 rounded-lg bg-bg-secondary hover:bg-accent-primary/20 text-text-secondary hover:text-accent-primary transition-colors"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Quick Links / CTA */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-between p-8 rounded-lg border border-border-subtle bg-bg-card"
          >
            <div>
              <h3 className="text-text-primary font-bold font-display text-xl mb-4">Ready to start?</h3>
              <p className="text-text-secondary mb-6">
                Got an exciting opportunity? Drop me a line and let's discuss how we can work together to bring your
                vision to life.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <MagneticButton
                variant="primary"
                onClick={() => window.location.href = `mailto:${resumeData.personal.email}`}
                className="w-full"
              >
                Send Me an Email
              </MagneticButton>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center pt-8 border-t border-border-subtle"
        >
          <motion.p variants={itemVariants} className="text-sm text-text-secondary">
            Designed & built with <span className="text-accent-rose">♥</span> by Kunal Mathur
          </motion.p>
          <motion.p variants={itemVariants} className="text-xs text-text-tertiary mt-2">
            © 2026. All rights reserved.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
