import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { ResumeModal } from '../ui/ResumeModal'
import { containerVariants, itemVariants } from '../../lib/animation-variants'

export const ResumeSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {/* Resume Link/Button - can be placed anywhere */}
      <motion.button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-accent-primary text-accent-primary hover:bg-accent-primary/10 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Eye size={16} />
        <span className="text-sm">Preview Resume</span>
      </motion.button>

      {/* Resume Modal */}
      <ResumeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Alternative: Dedicated section */}
      <section id="resume" className="hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-display font-bold mb-4">
            View My Resume
          </motion.h2>
          <motion.button
            variants={itemVariants}
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-lg bg-accent-primary text-bg-primary font-medium hover:shadow-lg transition-all"
          >
            Open Resume
          </motion.button>
        </motion.div>
      </section>
    </>
  )
}
