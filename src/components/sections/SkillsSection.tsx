import { motion } from 'framer-motion'
import { SkillBadge } from '../ui/SkillBadge'
import { containerVariants, itemVariants } from '../../lib/animation-variants'
import { resumeData } from '../../lib/resume-data'

const skillCategories = [
  { name: 'Frontend', skills: resumeData.skills.frontend, color: '#6C63FF' },
  { name: 'Backend', skills: resumeData.skills.backend, color: '#00E5FF' },
  { name: 'ML/AI', skills: resumeData.skills.mlai, color: '#F5C542' },
  { name: 'Tools & Cloud', skills: resumeData.skills.tools, color: '#FF3CAC' },
]

const tools = [
  'React', 'Three.js', 'Node.js', 'FastAPI', 'TypeScript', 'Python',
  'PostgreSQL', 'MongoDB', 'AWS', 'Vercel', 'TensorFlow', 'Solidity',
  'Git', 'Figma', 'Blender', 'WebSocket'
]

export const SkillsSection = () => {
  return (
    <section id="skills" className="relative w-full py-24 px-6 bg-bg-primary overflow-hidden">
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
            className="text-sm text-accent-primary font-mono uppercase tracking-widest mb-4"
          >
            // 04 Skills
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4"
          >
            Technical Arsenal
          </motion.h2>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20"
        >
          {skillCategories.map((category) => (
            <motion.div key={category.name} variants={itemVariants}>
              <h3 className="text-lg font-display font-bold text-text-primary mb-6">{category.name}</h3>
              <div className="space-y-4">
                {category.skills.slice(0, 4).map((skill, skillIndex) => (
                  <SkillBadge
                    key={typeof skill === 'string' ? skill : skill.name}
                    name={typeof skill === 'string' ? skill : skill.name}
                    level={typeof skill === 'string' ? 85 : skill.level}
                    color={category.color}
                    index={skillIndex}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tools Marquee */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={itemVariants}
          className="relative"
        >
          <h3 className="text-lg font-display font-bold text-text-primary mb-8">Tech Stack</h3>
          <div className="relative overflow-hidden rounded-lg bg-bg-card border border-border-subtle p-8">
            <motion.div
              className="flex gap-8 w-fit"
              animate={{ x: [0, -1000] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              {[...tools, ...tools].map((tool, i) => (
                <motion.span
                  key={`${tool}-${i}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-secondary border border-border-subtle text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors cursor-default"
                  whileHover={{ scale: 1.05 }}
                >
                  {tool}
                </motion.span>
              ))}
            </motion.div>

            {/* Gradient fade edges */}
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-bg-primary to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-bg-primary to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Languages */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={itemVariants}
          className="mt-12"
        >
          <h3 className="text-lg font-display font-bold text-text-primary mb-6">Languages</h3>
          <motion.div
            variants={containerVariants}
            className="flex flex-wrap gap-3"
          >
            {resumeData.skills.languages.map((lang) => (
              <motion.span
                key={lang}
                variants={itemVariants}
                className="px-4 py-2 rounded-lg bg-accent-primary/10 border border-accent-primary/50 text-accent-glow font-accent text-sm"
                whileHover={{ scale: 1.05, borderColor: '#9D97FF' }}
              >
                {lang}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
