import { motion } from 'framer-motion'
import { GraduationCap, MapPin, Calendar } from 'lucide-react'
import { containerVariants, itemVariants } from '../../lib/animation-variants'
import { resumeData } from '../../lib/resume-data'

export const EducationSection = () => {
  return (
    <section id="education" className="relative w-full py-24 px-6 bg-bg-secondary overflow-hidden">
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
            className="text-sm text-accent-gold font-mono uppercase tracking-widest mb-4"
          >
            // 05 Education
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4"
          >
            Academic Journey
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-text-secondary max-w-2xl"
          >
            Building a strong foundation in computer science and software engineering.
          </motion.p>
        </motion.div>

        {/* Education Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="space-y-6"
        >
          {resumeData.education.map((edu, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group relative bg-bg-card border border-border-subtle rounded-xl p-6 md:p-8 hover:border-accent-gold transition-all duration-300"
            >
              {/* Accent Line */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-1 bg-accent-gold rounded-l-xl"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              />

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 ml-4">
                {/* Left Content */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <motion.div
                      className="p-2 rounded-lg bg-accent-gold/10 border border-accent-gold/30"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <GraduationCap className="w-5 h-5 text-accent-gold" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl font-display font-bold text-text-primary mb-1">
                        {edu.school}
                      </h3>
                      <p className="text-base font-accent text-accent-gold mb-2">
                        {edu.degree}
                        {edu.specialization && (
                          <span className="text-text-secondary"> • {edu.specialization}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-text-secondary ml-11">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent-gold/70" />
                      <span>{edu.period}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent-gold/70" />
                      <span>{edu.location}</span>
                    </div>
                  </div>
                </div>

                {/* Right Stats */}
                <div className="flex flex-col items-end gap-2">
                  {edu.cgpa && (
                    <motion.div
                      className="px-4 py-2 rounded-lg bg-accent-gold/10 border border-accent-gold/30"
                      whileHover={{ scale: 1.05 }}
                    >
                      <p className="text-xs font-mono text-text-secondary mb-1">CGPA</p>
                      <p className="text-2xl font-display font-bold text-accent-gold">{edu.cgpa}</p>
                    </motion.div>
                  )}
                  {edu.percentage && (
                    <motion.div
                      className="px-4 py-2 rounded-lg bg-accent-gold/10 border border-accent-gold/30"
                      whileHover={{ scale: 1.05 }}
                    >
                      <p className="text-xs font-mono text-text-secondary mb-1">Score</p>
                      <p className="text-2xl font-display font-bold text-accent-gold">{edu.percentage}</p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Hover Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at center, rgba(245, 197, 66, 0.05), transparent 70%)',
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
