import React, { createContext, useContext, useEffect, useState } from 'react'

import { RealTimeQueries, useQuery } from 'cozy-client'

import { buildSubjectsQuery } from '@/queries'

const SubjectContext = createContext()

export const SubjectProvider = ({ children }) => {
  const [selectedSubject, setSelectedSubject] = useState(null)

  const subjectsQuery = buildSubjectsQuery()
  const subjects = useQuery(subjectsQuery.definition, subjectsQuery.options)

  const [prevLength, setPrevLength] = useState(0)
  const data = subjects.data || []

  useEffect(() => {
    const currentLength = data.length

    if (currentLength > 0) {
      if (currentLength > prevLength && prevLength !== 0) {
        setSelectedSubject(data[data.length - 1])
      } else if (
        !selectedSubject ||
        !data.find(s => s._id === selectedSubject._id)
      ) {
        setSelectedSubject(data[0])
      }
    } else {
      setSelectedSubject(null)
    }

    setPrevLength(currentLength)
  }, [data, selectedSubject, prevLength])

  const value = {
    selectedSubject,
    setSelectedSubject,
    subjects
  }

  return (
    <>
      <RealTimeQueries doctype="io.cozy.learnings.subjects" />
      <RealTimeQueries doctype="io.cozy.learnings.questions" />
      <RealTimeQueries doctype="io.cozy.files" />
      <SubjectContext.Provider value={value}>
        {children}
      </SubjectContext.Provider>
    </>
  )
}

export const useSubject = () => {
  const context = useContext(SubjectContext)
  if (!context) {
    throw new Error('useSubject must be used within a SubjectProvider')
  }
  return context
}
