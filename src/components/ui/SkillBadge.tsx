import { motion } from 'framer-motion'

interface SkillBadgeProps {
  name: string
  level?: number
  color?: string
  index?: number
}

export const SkillBadge = ({ name, level = 80, color = '#6C63FF', index = 0 }: SkillBadgeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-text-primary group-hover:text-accent-glow transition-colors">
          {name}
        </span>
        <span className="text-xs text-text-secondary">{level}%</span>
      </div>
      <div className="w-full h-2 bg-bg-card rounded-full overflow-hidden border border-border-subtle">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ duration: 1, delay: index * 0.05, ease: 'easeOut' }}
          viewport={{ once: true }}
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}80)`,
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>
    </motion.div>
  )
}
