import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo
} from 'react'

import { RealTimeQueries, useQuery } from 'cozy-client'

import { buildSubjectsQuery } from '@/queries'

const SubjectContext = createContext()

export const SubjectProvider = ({ children }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null)

  const subjectsQuery = buildSubjectsQuery()
  const subjects = useQuery(subjectsQuery.definition, subjectsQuery.options)

  const [prevLength, setPrevLength] = useState(0)
  const data = subjects.data || []

  // TODO : filtrer dès la query plutôt qu'ici
  const selectedSubject =
    data.find(s => s._id === selectedSubjectId) || null

  console.log(data)

  useEffect(() => {
    const currentLength = data.length

    if (currentLength > 0) {
      if (currentLength > prevLength && prevLength !== 0) {
        setSelectedSubjectId(data[data.length - 1]._id)
      } else if (
        !selectedSubjectId ||
        !data.find(s => s._id === selectedSubjectId)
      ) {
        setSelectedSubjectId(data[0]._id)
      }
    } else {
      setSelectedSubjectId(null)
    }

    setPrevLength(currentLength)
  }, [data, selectedSubjectId, prevLength])

  const value = {
    selectedSubject,
    setSelectedSubject: subject => setSelectedSubjectId(subject?._id || null),
    subjects
  }

  return (
    <>
      <RealTimeQueries doctype="io.cozy.learnings" />
      <RealTimeQueries doctype="io.cozy.learnings.subjects" />
      <RealTimeQueries doctype="io.cozy.learnings.questions" />
      <RealTimeQueries doctype="io.cozy.learnings.sources" />
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
