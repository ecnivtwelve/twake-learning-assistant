import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import { RealTimeQueries, useQuery } from 'cozy-client'

import WelcomeDialog from '@/components/Subjects/WelcomeDialog'
import { buildSubjectsQuery } from '@/queries'

const SubjectContext = createContext()

export const SubjectProvider = ({ children }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState(() =>
    localStorage.getItem('selectedSubjectId')
  )

  const subjectsQuery = buildSubjectsQuery()
  const subjects = useQuery(subjectsQuery.definition, subjectsQuery.options)

  const [prevLength, setPrevLength] = useState(0)
  const data = useMemo(() => subjects.data || [], [subjects.data])

  // TODO : filtrer dès la query plutôt qu'ici
  const selectedSubject = data.find(s => s._id === selectedSubjectId) || null

  useEffect(() => {
    if (!subjects.data || subjects.fetchStatus === 'loading') return

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
  }, [data, selectedSubjectId, prevLength, subjects.data, subjects.fetchStatus])

  useEffect(() => {
    if (selectedSubjectId) {
      localStorage.setItem('selectedSubjectId', selectedSubjectId)
    } else {
      localStorage.removeItem('selectedSubjectId')
    }
  }, [selectedSubjectId])

  const value = {
    selectedSubject,
    setSelectedSubject: subject => setSelectedSubjectId(subject?._id || null),
    subjects
  }

  const [welcomeDialogOpen, setWelcomeDialogOpen] = useState(false)

  useEffect(() => {
    if (welcomeDialogOpen) {
      if (subjects.data && subjects.data.length !== 0) {
        setWelcomeDialogOpen(false)
      }
    }
    if (
      subjects.fetchStatus !== 'loading' &&
      subjects.data &&
      subjects.data.length === 0
    ) {
      setWelcomeDialogOpen(true)
    }
  }, [subjects.fetchStatus, subjects.data, welcomeDialogOpen])

  return (
    <>
      <RealTimeQueries doctype="io.cozy.learnings" />
      <RealTimeQueries doctype="io.cozy.learnings.subjects" />
      <RealTimeQueries doctype="io.cozy.learnings.questions" />
      <RealTimeQueries doctype="io.cozy.learnings.sources" />
      <RealTimeQueries doctype="io.cozy.files" />

      <WelcomeDialog
        open={welcomeDialogOpen}
        onClose={() => setWelcomeDialogOpen(false)}
      />

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
