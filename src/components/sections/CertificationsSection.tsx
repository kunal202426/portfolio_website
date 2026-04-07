import { motion } from 'framer-motion'
import { Award, CheckCircle2, ExternalLink } from 'lucide-react'
import { containerVariants, itemVariants } from '../../lib/animation-variants'
import { resumeData } from '../../lib/resume-data'

export const CertificationsSection = () => {
  return (
    <section id="certifications" className="relative w-full py-24 px-6 bg-bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mb-16"
        >
          <motion.p
            variants={itemVariants}
            className="text-sm text-accent-cyan font-mono uppercase tracking-widest mb-4"
          >
            // 06 Certifications
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4"
          >
            Professional Credentials
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-text-secondary max-w-2xl"
          >
            Verified expertise backed by industry-recognized certifications.
          </motion.p>
        </motion.div>

        {/* Certifications Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {resumeData.certifications.map((cert, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -8 }}
              className="group relative bg-bg-card border border-border-subtle rounded-xl p-6 overflow-hidden hover:border-accent-cyan transition-all duration-300"
            >
              {/* Background Gradient */}
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle, #00E5FF 0%, transparent 70%)',
                }}
              />

              {/* Badge Icon */}
              <motion.div
                className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Award className="w-6 h-6 text-accent-cyan" />
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-display font-bold text-text-primary pr-4">
                    {cert.title}
                  </h3>
                  <motion.span
                    className="flex-shrink-0 px-2 py-1 text-xs font-mono rounded-full bg-accent-cyan/20 text-accent-cyan"
                    whileHover={{ scale: 1.1 }}
                  >
                    {cert.year}
                  </motion.span>
                </div>

                <p className="text-sm font-accent text-accent-cyan mb-3">
                  {cert.issuer}
                </p>

                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  {cert.description}
                </p>

                {/* Verification Badge */}
                <motion.div
                  className="flex items-center gap-2 text-xs text-text-tertiary"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan" />
                  <span>Verified Certification</span>
                </motion.div>
              </div>

              {/* Hover Shine Effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, transparent 0%, rgba(0, 229, 255, 0.05) 50%, transparent 100%)',
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mt-20"
        >
          <motion.h3
            variants={itemVariants}
            className="text-2xl font-display font-bold text-text-primary mb-8"
          >
            Notable Achievements
          </motion.h3>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {resumeData.achievements.map((achievement, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                className="flex gap-4 p-6 bg-bg-card border border-border-subtle rounded-xl hover:border-accent-primary transition-colors"
              >
                <motion.div
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                >
                  <Award className="w-5 h-5 text-accent-primary" />
                </motion.div>
                <div className="flex-1">
                  <h4 className="text-base font-display font-bold text-text-primary mb-1">
                    {achievement.title}
                  </h4>
                  {achievement.subtitle && (
                    <p className="text-sm font-accent text-accent-primary mb-2">
                      {achievement.subtitle}
                    </p>
                  )}
                  <p className="text-sm text-text-secondary">
                    {achievement.description}
                  </p>
                  <span className="inline-block mt-2 text-xs font-mono text-text-tertiary">
                    {achievement.year}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
