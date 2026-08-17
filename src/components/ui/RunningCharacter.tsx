import { motion } from 'framer-motion'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

// A looping lottie character that runs left-to-right across the full width
// of wherever it's dropped, then resets and does it again. Takes up real
// vertical space (unlike an earlier version that overlaid a heading via a
// zero-height/negative-top hack) since it now sits as its own block between
// two sections. Faded down by default so it reads as a background touch
// rather than competing with the list content around it.
export const RunningCharacter = ({
  size = 90,
  duration = 9,
  opacity = 0.18,
  top,
}: {
  size?: number
  duration?: number
  opacity?: number
  top?: number
}) => (
  <div style={{ position: 'relative', height: size, overflow: 'visible', pointerEvents: 'none', opacity }}>
    <motion.div
      // `left` as a % is relative to this wrapper's own width (the full row
      // width), unlike a transform x% which would only be relative to the
      // character's own tiny size - that's what actually gets it moving
      // left-to-right across the whole section instead of twitching in place.
      style={{ position: 'absolute', top: top ?? 0, width: size, height: size }}
      initial={{ left: '-10%' }}
      animate={{ left: '105%' }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      <DotLottieReact src="/animations/among-us-runner.lottie" loop autoplay style={{ width: '100%', height: '100%' }} />
    </motion.div>
  </div>
)
