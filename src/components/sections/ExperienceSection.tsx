import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '../../lib/animation-variants'
import { resumeData } from '../../lib/resume-data'

export const ExperienceSection = () => {
  const experiences = [...resumeData.experience].sort((a, b) => b.year - a.year)

  return (
    <section id="experience" className="relative w-full py-24 px-6 bg-bg-secondary overflow-hidden">
      <div className="max-w-4xl mx-auto">
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
            className="text-sm text-accent-primary font-mono uppercase tracking-widest mb-4"
          >
            // 03 Experience
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-display font-bold text-text-primary"
          >
            Career Journey
          </motion.h2>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="relative"
        >
          {/* Vertical Line */}
          <motion.div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-primary via-accent-glow to-accent-cyan"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{ originY: 0 }}
          />

          {/* Experience Items */}
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              variants={itemVariants}
              className={`relative mb-12 pl-20 md:pl-0 md:mb-12 ${
                index % 2 === 0 ? 'md:mr-auto md:pr-12 md:w-1/2' : 'md:ml-auto md:pl-12 md:w-1/2'
              }`}
            >
              {/* Timeline Dot */}
              <motion.div
                className="absolute left-0 md:left-1/2 top-0 w-8 h-8 rounded-full bg-bg-primary border-2 border-accent-primary flex items-center justify-center md:-ml-4"
                whileHover={{ scale: 1.2 }}
                animate={{ boxShadow: '0 0 20px rgba(108, 99, 255, 0.5)' }}
              >
                <div className="w-2 h-2 rounded-full bg-accent-primary" />
              </motion.div>

              {/* Content Card */}
              <motion.div
                className="p-6 rounded-lg bg-bg-card border border-border-subtle hover:border-accent-primary/50 transition-colors"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-bold text-lg text-text-primary">{exp.company}</h3>
                    <p className="text-accent-primary font-accent text-sm">{exp.title}</p>
                  </div>
                  <span className="text-xs font-mono text-text-secondary whitespace-nowrap ml-4">{exp.period}</span>
                </div>

                <p className="text-xs text-text-tertiary mb-4">{exp.location}</p>

                {/* Achievements */}
                <ul className="space-y-2">
                  {exp.achievements.map((achievement, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="text-sm text-text-secondary flex gap-3 leading-relaxed"
                    >
                      <span className="text-accent-primary flex-shrink-0 mt-1">▸</span>
                      <span>{achievement}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
