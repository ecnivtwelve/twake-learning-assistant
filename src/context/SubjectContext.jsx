import React, { createContext, useContext, useEffect, useState } from 'react'

import { useQuery } from 'cozy-client'

import { buildSubjectsQuery } from '@/queries'

const SubjectContext = createContext()

export const SubjectProvider = ({ children }) => {
  const [selectedSubject, setSelectedSubject] = useState(null)

  const subjectsQuery = buildSubjectsQuery()
  const subjects = useQuery(subjectsQuery.definition, subjectsQuery.options)

  useEffect(() => {
    if (subjects.data?.length > 0 && !selectedSubject) {
      setSelectedSubject(subjects.data[0])
    }
  }, [subjects.data, selectedSubject])

  const value = {
    selectedSubject,
    setSelectedSubject,
    subjects
  }

  return (
    <SubjectContext.Provider value={value}>{children}</SubjectContext.Provider>
  )
}

export const useSubject = () => {
  const context = useContext(SubjectContext)
  if (!context) {
    throw new Error('useSubject must be used within a SubjectProvider')
  }
  return context
}
