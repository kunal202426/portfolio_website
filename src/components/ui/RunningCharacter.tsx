import { motion } from 'framer-motion'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

// A small looping lottie character that runs left-to-right across whatever
// it's dropped into, then resets and does it again. Absolutely positioned
// and pointer-events:none so it never blocks clicks on the list rows it
// runs over.
export const RunningCharacter = ({ size = 56, duration = 7, top = -28 }: { size?: number; duration?: number; top?: number }) => (
  <div style={{ position: 'relative', height: 0, overflow: 'visible', pointerEvents: 'none' }}>
    <motion.div
      // `left` as a % is relative to this wrapper's own width (the full row
      // width), unlike a transform x% which would only be relative to the
      // character's own tiny size - that's what actually gets it moving
      // left-to-right across the whole section instead of twitching in place.
      style={{ position: 'absolute', top, width: size, height: size }}
      initial={{ left: '-8%' }}
      animate={{ left: '106%' }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      <DotLottieReact src="/animations/among-us-runner.lottie" loop autoplay style={{ width: '100%', height: '100%' }} />
    </motion.div>
  </div>
)
