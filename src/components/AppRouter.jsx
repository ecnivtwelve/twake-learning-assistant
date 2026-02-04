import React from 'react'
import { Navigate, RouterProvider, createHashRouter } from 'react-router-dom'

import LayoutTransitioner from './Animation/LayoutTransitioner'
import AppItemLayout from './AppItemLayout'

import AppLayout from '@/components/AppLayout'
import ActivitiesTab from '@/views/ActivitiesTab'
import InsightsTab from '@/views/InsightsTab'
import ItemView from '@/views/Item/ItemView'
import QuestionsTab from '@/views/QuestionsTab'
import SourcesTab from '@/views/SourcesTab'

const routes = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        children: [
          { path: 'activities', element: <ActivitiesTab /> },
          { path: 'insights', element: <InsightsTab /> },
          { path: 'questions', element: <QuestionsTab /> },
          { path: 'sources', element: <SourcesTab /> },
          { path: '', element: <Navigate replace to="/activities" /> }
        ]
      },
      {
        children: [{ path: 'item/:id', element: <ItemView /> }]
      }
    ]
  }
]

const router = createHashRouter(routes)

const AppRouter = () => {
  return <RouterProvider router={router} />
}

export default AppRouter
