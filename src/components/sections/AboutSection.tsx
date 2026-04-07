import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '../../lib/animation-variants'

export const AboutSection = () => {
  const stats = [
    { label: 'Years Coding', value: '5+' },
    { label: 'Projects Built', value: '20+' },
    { label: 'Teams Led', value: '3' },
  ]

  const achievements = [
    'Global Hyperloop Winner',
    'Flipkart GRiD Semi-Finalist',
    'Blockchain Certified',
    'Full Stack Expertise',
  ]

  return (
    <section id="about" className="relative w-full py-24 px-6 bg-bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column */}
          <div>
            {/* Section Tag */}
            <motion.p
              variants={itemVariants}
              className="text-sm text-accent-primary font-mono uppercase tracking-widest mb-4"
            >
              // 01 About
            </motion.p>

            {/* Heading */}
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6 leading-tight"
            >
              I design experiences, not just interfaces.
            </motion.h2>

            {/* Bio */}
            <motion.div variants={itemVariants} className="space-y-4 mb-8">
              <p className="text-text-secondary text-lg leading-relaxed">
                I'm a full-stack developer and designer obsessed with creating digital experiences that feel
                alive. From real-time 3D simulations to distributed system architectures, I think beyond the
                surface.
              </p>
              <p className="text-text-secondary text-lg leading-relaxed">
                Currently exploring ML systems, blockchain platforms, and the intersection of beautiful design
                with bulletproof engineering. I believe the best products live at the edge of art and science.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-3 gap-4 mb-8 py-8 border-y border-border-subtle"
            >
              {stats.map((stat) => (
                <motion.div key={stat.label} variants={itemVariants} className="text-center">
                  <div className="text-3xl font-bold text-accent-primary mb-2">{stat.value}</div>
                  <div className="text-xs text-text-secondary uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Achievement Pills */}
            <motion.div
              variants={containerVariants}
              className="flex flex-wrap gap-3"
            >
              {achievements.map((achievement) => (
                <motion.span
                  key={achievement}
                  variants={itemVariants}
                  className="px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/30 text-sm text-accent-glow font-accent"
                  whileHover={{ scale: 1.05, borderColor: '#9D97FF' }}
                >
                  {achievement}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Abstract Visual */}
          <motion.div
            variants={itemVariants}
            className="h-full min-h-96 rounded-xl relative overflow-hidden bg-gradient-to-br from-bg-card to-bg-secondary p-8 flex items-center justify-center"
          >
            {/* Geometric Pattern */}
            <svg className="w-full h-full" viewBox="0 0 300 300">
              {/* Outer Circle */}
              <motion.circle
                cx="150"
                cy="150"
                r="140"
                fill="none"
                stroke="url(#grad1)"
                strokeWidth="1"
                opacity="0.3"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />

              {/* Middle Circle */}
              <motion.circle
                cx="150"
                cy="150"
                r="100"
                fill="none"
                stroke="url(#grad2)"
                strokeWidth="1"
                opacity="0.5"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />

              {/* Inner Circle */}
              <circle cx="150" cy="150" r="60" fill="none" stroke="#6C63FF" strokeWidth="2" opacity="0.7" />

              {/* Center Glow */}
              <motion.circle
                cx="150"
                cy="150"
                r="30"
                fill="#6C63FF"
                opacity="0.2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* K Letter */}
              <text x="150" y="160" textAnchor="middle" fontSize="48" fontWeight="bold" fill="#6C63FF" opacity="0.5">
                K
              </text>

              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="100%" stopColor="#00E5FF" />
                </linearGradient>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="100%" stopColor="#FF3CAC" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
