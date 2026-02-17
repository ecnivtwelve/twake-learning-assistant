import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useI18n } from 'twake-i18n'

import { useClient, useQuery } from 'cozy-client'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import { renameActivity } from '../../queries/actions/activities/renameActivity'

import ItemFlashcardPreview from '@/components/QuestionItem/ItemFlashcardPreview'
import ItemGenerationDialog from '@/components/QuestionItem/ItemGenerationDialog'
import ItemHeader from '@/components/QuestionItem/ItemHeader'
import ItemImportDialog from '@/components/QuestionItem/ItemImportDialog'
import ItemQuestionList from '@/components/QuestionItem/ItemQuestionList'
import { useSubject } from '@/context/SubjectContext'
import { buildActivityItemQuery } from '@/queries'
import { useQuestionActions } from '@/queries/hooks/useQuestionActions'
import { useQuestionGeneration } from '@/queries/hooks/useQuestionGeneration'

const ItemView = () => {
  const { t } = useI18n()
  const client = useClient()
  const { showAlert } = useAlert()
  const location = useLocation()
  const { selectedSubject, setSelectedSubject } = useSubject()

  const activityId = useMemo(
    () => location.pathname.split('/').pop(),
    [location]
  )

  const activityItemQuery = useMemo(
    () => buildActivityItemQuery(activityId),
    [activityId]
  )
  const { data: activityData, fetchStatus } = useQuery(
    activityItemQuery.definition,
    activityItemQuery.options
  )

  useEffect(() => {
    const activitySubjectId = activityData?.relationships?.subjects?.data?._id
    if (!activitySubjectId || !selectedSubject) return
    if (activitySubjectId !== selectedSubject._id) {
      setSelectedSubject({
        _id: activitySubjectId,
        type: 'io.cozy.learnings.subjects'
      })
    }
  }, [activityData, selectedSubject, setSelectedSubject])

  const [activity, setActivity] = useState(activityData)

  useEffect(() => {
    if (activityData) {
      setActivity(activityData)
    }
  }, [activityData])

  const isLoading = fetchStatus === 'loading'

  const questions = useMemo(
    () => activity?.questions?.data || [],
    [activity?.questions?.data]
  )

  const [activityTitle, setActivityTitle] = useState()
  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    if (firstLoad && activity) {
      setActivityTitle(activity?.title)
      setFirstLoad(false)
    }
  }, [activity, firstLoad])

  const handleRenameActivity = newTitle => {
    renameActivity(client, activity, newTitle)
      .then(() => {
        return showAlert({
          message: t('activities.alerts.updated'),
          severity: 'success'
        })
      })
      .catch(() => {
        return showAlert({
          message: t('activities.alerts.error'),
          severity: 'error'
        })
      })
  }

  const [filters] = React.useState({
    subjects: {
      label: t('tags.types'),
      values: []
    },
    level: {
      label: t('tags.sources'),
      values: []
    },
    notion: {
      label: t('tags.notions'),
      values: []
    }
  })

  const {
    isGenerating,
    ragGenerateFlashcards,
    ragGenerateMCQs,
    customizeGenerationDialog,
    setCustomizeGenerationDialog,
    customizeImportDialog,
    setCustomizeImportDialog,
    numberOfQuestions,
    setNumberOfQuestions
  } = useQuestionGeneration(activity, selectedSubject)

  const {
    selectedQuestions,
    setSelectedQuestions,
    createQuestion,
    deleteQuestion,
    detachQuestion,
    attachQuestion,
    actions,
    newQuestionId,
    resetNewQuestionId
  } = useQuestionActions(activity, questions)

  const [openedQuestion, setOpenedQuestion] = React.useState(null)

  useEffect(() => {
    if (newQuestionId) {
      const newQuestion = questions.find(q => q._id === newQuestionId)
      if (newQuestion) {
        setOpenedQuestion(newQuestion)
        const timer = setTimeout(() => {
          resetNewQuestionId()
        }, 100)
        return () => clearTimeout(timer)
      }
    }
  }, [newQuestionId, questions, resetNewQuestionId])

  useEffect(() => {
    if (openedQuestion) {
      const updatedQuestion = questions.find(q => q._id === openedQuestion._id)
      if (updatedQuestion && updatedQuestion !== openedQuestion) {
        setOpenedQuestion(updatedQuestion)
      }
    }
  }, [questions, openedQuestion])

  return (
    <div className="u-flex u-flex-column u-h-100">
      <ItemHeader
        activityTitle={activityTitle}
        setActivityTitle={setActivityTitle}
        onRenameActivity={handleRenameActivity}
        onOpenGenerationDialog={() => setCustomizeGenerationDialog(true)}
        onOpenImportDialog={() => setCustomizeImportDialog(true)}
        onCreateQuestion={createQuestion}
        filters={filters}
        isLoading={isLoading}
        sources={activity?.sources?.data || []}
      />

      <ItemImportDialog
        open={customizeImportDialog}
        onClose={() => setCustomizeImportDialog(false)}
        onSelectQuestions={attachQuestion}
        currentQuestions={questions}
      />

      <ItemGenerationDialog
        open={customizeGenerationDialog}
        onClose={() => setCustomizeGenerationDialog(false)}
        onGenerateFlashcards={() =>
          ragGenerateFlashcards(questions.map(q => q.label))
        }
        onGenerateMCQs={() => ragGenerateMCQs()}
        numberOfQuestions={numberOfQuestions}
        setNumberOfQuestions={setNumberOfQuestions}
      />

      <div className="u-flex u-flex-col u-h-100">
        <ItemQuestionList
          questions={questions}
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
          openedQuestion={openedQuestion}
          setOpenedQuestion={setOpenedQuestion}
          isGenerating={isGenerating}
          numberOfQuestions={numberOfQuestions}
          isLoading={isLoading}
          actions={actions}
          newQuestionId={newQuestionId}
          onDetachQuestion={detachQuestion}
          onDeleteQuestion={deleteQuestion}
          selectQuestions={() => setCustomizeImportDialog(true)}
        />

        <ItemFlashcardPreview openedQuestion={openedQuestion} />
      </div>
    </div>
  )
}

export default ItemView
