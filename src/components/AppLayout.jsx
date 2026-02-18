import { AnimatePresence, motion } from 'motion/react'
import React from 'react'
import { useLocation, useOutlet } from 'react-router-dom'

import { BarComponent } from 'cozy-bar'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import SidebarComponent from './Sidebar/Sidebar'

import BarTitle from '@/components/BarTitle/BarTitle'

const AppLayout = () => {
  const { isDesktop } = useBreakpoints()
  const outlet = useOutlet()
  const location = useLocation()

  const getLayoutKey = () => {
    if (location.pathname.includes('/item')) {
      return 'item-view'
    }
    return 'tabs-view:' + location.pathname
  }

  return (
    <>
      <SidebarComponent />
      <BarComponent searchOptions={{ enabled: true }} />
      <BarTitle />
      <div
        className={`u-w-100 ${isDesktop ? '' : 'u-pt-3'}`}
        style={{
          padding: isDesktop ? 16 : 0,
          backgroundColor: 'var(--defaultBackgroundColor)'
        }}
      >
        <div
          style={{
            height: '100%',
            overflowY: 'auto',
            position: 'relative',
            backgroundColor: 'var(--paperBackgroundColor)',
            borderRadius: isDesktop ? '1rem' : 0
          }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={getLayoutKey()}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: 0.3, ease: [0.3, 0, 0, 1], delay: 0.1 }
              }}
              exit={{
                opacity: 0,
                scale: 0.99,
                transition: { duration: 0.2, ease: 'easeInOut' }
              }}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                position: 'absolute'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {outlet}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default AppLayout
