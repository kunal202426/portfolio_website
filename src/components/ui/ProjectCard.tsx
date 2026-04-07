import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Code2 } from 'lucide-react'

interface ProjectCardProps {
  title: string
  subtitle: string
  description: string
  tags: string[]
  year: string
  image?: string
  liveUrl?: string
  githubUrl?: string
  featured?: boolean
  color: string
  index?: number
}

export const ProjectCard = ({
  title,
  subtitle,
  description,
  tags,
  year,
  liveUrl,
  githubUrl,
  featured = false,
  color,
  index = 0,
}: ProjectCardProps) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientY - rect.top) / rect.height - 0.5
    const y = (e.clientX - rect.left) / rect.width - 0.5

    setRotate({ x: x * -12, y: y * 12 })
  }

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 })
    setIsHovering(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: (index || 0) * 0.05 }}
      viewport={{ once: true, amount: 0.2 }}
      className={`group relative overflow-hidden rounded-xl transition-all duration-200 ${
        featured ? 'col-span-1 md:col-span-2' : ''
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="w-full h-full rounded-xl border border-border-subtle overflow-hidden bg-bg-card shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
        style={{
          boxShadow: isHovering ? `0 10px 20px ${color}15` : undefined,
        }}
      >
        {/* Image/Gradient */}
        <div
          className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden transition-transform duration-200 hover:scale-105"
        >
          <div
            className="w-full h-full opacity-30"
            style={{
              background: `linear-gradient(135deg, ${color}30, ${color}15)`,
            }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-xs font-mono text-text-secondary mb-2 uppercase tracking-wider">{year}</p>
              <h3 className="text-xl font-display font-bold text-text-primary mb-1">{title}</h3>
              <p className="text-sm font-accent text-text-secondary" style={{ color }}>
                {subtitle}
              </p>
            </div>
          </div>

          {/* Description */}
          <motion.p
            className="text-sm text-text-secondary mb-4 overflow-hidden"
            initial={{ opacity: 0.7 }}
            animate={{ 
              opacity: isHovering ? 1 : 0.7,
              maxHeight: isHovering ? '200px' : '48px'
            }}
            transition={{ duration: 0.3 }}
          >
            {description}
          </motion.p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <motion.span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-bg-secondary text-text-secondary border border-border-subtle"
                whileHover={{ scale: 1.05, borderColor: color }}
              >
                {tag}
              </motion.span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 text-xs rounded-full bg-bg-secondary text-text-tertiary">
                +{tags.length - 3}
              </span>
            )}
          </div>

          {/* Links */}
          <div className={`flex gap-3 pt-4 border-t border-border-subtle transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-accent-primary hover:text-accent-glow transition-colors"
              >
                <ExternalLink size={14} />
                Live
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-accent-cyan hover:text-accent-glow transition-colors"
              >
                <Code2 size={14} />
                Code
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
