import React from 'react'
import { Navigate, RouterProvider, createHashRouter } from 'react-router-dom'

import AppLayout from '@/components/AppLayout'
import ActivitiesTab from '@/views/ActivitiesTab'
import InsightsTab from '@/views/InsightsTab'
import QuestionsTab from '@/views/QuestionsTab'
import SourcesTab from '@/views/SourcesTab'

const routes = [
  {
    element: <AppLayout />,
    children: [
      {
        path: 'activities',
        element: <ActivitiesTab />
      },
      {
        path: 'insights',
        element: <InsightsTab />
      },
      {
        path: 'questions',
        element: <QuestionsTab />
      },
      {
        path: 'sources',
        element: <SourcesTab />
      },
      {
        path: '',
        element: <Navigate replace to="/activities" />
      }
    ]
  }
]

const router = createHashRouter(routes)

const AppRouter = () => {
  return <RouterProvider router={router} />
}

export default AppRouter
