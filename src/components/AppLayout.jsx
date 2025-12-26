import React from 'react'
import { Outlet } from 'react-router-dom'

import { BarComponent } from 'cozy-bar'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import SidebarComponent from './Sidebar/Sidebar'

import BarTitle from '@/components/BarTitle/BarTitle'

const AppLayout = () => {
  const { isDesktop } = useBreakpoints()

  return (
    <>
      <SidebarComponent />
      <BarComponent searchOptions={{ enabled: true }} />
      <BarTitle />
      <div className={`u-w-100 ${isDesktop ? '' : 'u-pt-3'}`}>
        <Outlet />
      </div>
    </>
  )
}

export default AppLayout
