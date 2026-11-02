'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

/** The footer content rises out from under the page as it scrolls into view, and the wordmark spreads out. */
export function FooterReveal({ children, wordmark }: { children: ReactNode; wordmark: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-35%', '0%'])
  const spacing = useTransform(scrollYProgress, [0.4, 1], reduce ? ['0em', '0em'] : ['-0.08em', '0em'])
  const wordY = useTransform(scrollYProgress, [0.3, 1], reduce ? ['0%', '0%'] : ['60%', '0%'])
  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div style={{ y }}>
        {children}
        <motion.div aria-hidden style={{ letterSpacing: spacing, y: wordY }} className="select-none">
          {wordmark}
        </motion.div>
      </motion.div>
    </div>
  )
}
