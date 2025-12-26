import React from 'react'
import { Outlet } from 'react-router-dom'

import { BarComponent } from 'cozy-bar'

import SidebarComponent from './Sidebar/Sidebar'

import BarTitle from '@/components/BarTitle/BarTitle'

const AppLayout = () => {
  return (
    <>
      <SidebarComponent />
      <BarComponent searchOptions={{ enabled: true }} />
      <BarTitle />
      <Outlet />
    </>
  )
}

export default AppLayout
