'use client'

import { useScroll, useTransform, motion, MotionValue } from 'motion/react'
import React, { useRef, forwardRef } from 'react'
import { Award, GraduationCap } from 'lucide-react'
import { resumeData } from '@/lib/resume-data'

interface SectionProps {
  scrollYProgress: MotionValue<number>
}

const Section1: React.FC<SectionProps> = ({ scrollYProgress }) => {
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5])

  return (
    <motion.section
      style={{ scale, rotate }}
      className="sticky font-semibold top-0 h-screen bg-gradient-to-t to-[#dadada] from-[#ebebeb] flex flex-col items-center justify-center text-black"
    >
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 text-center px-8">
        <div className="inline-flex items-center gap-2 uppercase tracking-[0.2em] text-xs md:text-sm mb-5 text-[#E8570C]">
          <GraduationCap size={14} />
          Academic Journey
        </div>
        <h1 className="2xl:text-7xl text-5xl md:text-6xl font-semibold tracking-tight leading-[120%]">
          Scroll From Learning
          <br />
          To Credentials
        </h1>
      </div>
    </motion.section>
  )
}

const Section2: React.FC<SectionProps> = ({ scrollYProgress }) => {
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const rotate = useTransform(scrollYProgress, [0, 1], [5, 0])
  const certCards = resumeData.certifications.slice(0, 4)

  return (
    <motion.section
      style={{ scale, rotate }}
      className="relative h-screen bg-gradient-to-t to-[#1a1919] from-[#06060e] text-white"
    >
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <article className="container mx-auto relative z-10 px-4 md:px-6">
        <div className="inline-flex items-center gap-2 uppercase tracking-[0.2em] text-xs md:text-sm mt-10 mb-4 text-[#D4A574]">
          <Award size={14} />
          Professional Credentials
        </div>

        <h1 className="text-3xl md:text-6xl leading-[100%] py-6 md:py-10 font-semibold tracking-tight">
          Paper Cards That Show
          <br />
          Your Certifications
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {certCards.map((cert, index) => (
            <div
              key={`${cert.title}-${cert.year}`}
              className={`rounded-xl border border-white/20 bg-[#12131A]/90 p-4 md:p-5 shadow-[0_16px_34px_rgba(0,0,0,0.35)] ${
                index % 2 === 0 ? '-rotate-[1.5deg]' : 'rotate-[1.5deg]'
              }`}
            >
              <div className="inline-flex items-center gap-2 uppercase tracking-[0.14em] text-[10px] text-[#D4A574] mb-3">
                <Award size={12} />
                Verified
              </div>
              <h3 className="text-base md:text-lg font-semibold leading-tight mb-2">{cert.title}</h3>
              <p className="text-sm text-[#E0D3C1] mb-3">{cert.issuer}</p>
              <p className="text-xs text-[#B69A74]">{cert.year}</p>
            </div>
          ))}
        </div>
      </article>
    </motion.section>
  )
}

const Component = forwardRef<HTMLElement>((_props, ref) => {
  const container = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  const setRefs = (node: HTMLDivElement | null) => {
    container.current = node
    if (!ref) return

    if (typeof ref === 'function') {
      ref(node as unknown as HTMLElement | null)
      return
    }

    ref.current = node as unknown as HTMLElement | null
  }

  return (
    <main ref={setRefs} className="relative h-[200vh] bg-black">
      <Section1 scrollYProgress={scrollYProgress} />
      <Section2 scrollYProgress={scrollYProgress} />
    </main>
  )
})

Component.displayName = 'Component'

export default Component
