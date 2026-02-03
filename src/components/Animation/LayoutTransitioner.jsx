import { motion, AnimatePresence } from 'motion/react'
import React from 'react'
import { useLocation, useOutlet } from 'react-router-dom'

const LayoutTransitioner = () => {
  const location = useLocation()
  const outlet = useOutlet()

  const getLayoutKey = () => {
    if (location.pathname.startsWith('/item')) return 'layout-item'
    return 'layout-main'
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={getLayoutKey()}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { duration: 0.4, ease: [0.3, 0, 0, 1] }
        }}
        exit={{
          opacity: 0,
          scale: 1,
          transition: { duration: 0.15, ease: 'easeInOut' }
        }}
        style={{ width: '100%', height: '100%', display: 'flex' }}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  )
}

export default LayoutTransitioner
