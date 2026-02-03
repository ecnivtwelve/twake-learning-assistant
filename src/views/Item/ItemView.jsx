import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useI18n } from 'twake-i18n'

import { useClient, useQuery } from 'cozy-client'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import { renameActivity } from '../../queries/actions/activities/renameActivity'

import ItemFlashcardPreview from '@/components/QuestionItem/ItemFlashcardPreview'
import ItemGenerationDialog from '@/components/QuestionItem/ItemGenerationDialog'
import ItemHeader from '@/components/QuestionItem/ItemHeader'
import ItemQuestionList from '@/components/QuestionItem/ItemQuestionList'
import { buildActivityItemQuery } from '@/queries'
import { useQuestionActions } from '@/queries/hooks/useQuestionActions'
import { useQuestionGeneration } from '@/queries/hooks/useQuestionGeneration'

const ItemView = () => {
  const { t } = useI18n()
  const client = useClient()
  const { showAlert } = useAlert()
  const location = useLocation()

  const activityId = useMemo(
    () => location.pathname.split('/').pop(),
    [location]
  )

  const activityItemQuery = useMemo(
    () => buildActivityItemQuery(activityId),
    [activityId]
  )
  const { data: activity } = useQuery(
    activityItemQuery.definition,
    activityItemQuery.options
  )

  const questions = activity?.questions?.data || []

  // Activity Title Logic
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

  // Filters (Static for now, could be moved if it grows)
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

  // Hooks
  const {
    isGenerating,
    ragGenerate,
    customizeGenerationDialog,
    setCustomizeGenerationDialog,
    numberOfQuestions,
    setNumberOfQuestions
  } = useQuestionGeneration(activity)

  const {
    selectedQuestions,
    setSelectedQuestions,
    createQuestion,
    deleteQuestion,
    actions,
    newQuestionId
  } = useQuestionActions(activity, questions)

  // UI State
  const [openedQuestion, setOpenedQuestion] = React.useState(null)

  return (
    <div className="u-flex u-flex-column u-h-100">
      <ItemHeader
        activityTitle={activityTitle}
        setActivityTitle={setActivityTitle}
        onRenameActivity={handleRenameActivity}
        onOpenGenerationDialog={() => setCustomizeGenerationDialog(true)}
        onCreateQuestion={createQuestion}
        filters={filters}
      />

      <ItemGenerationDialog
        open={customizeGenerationDialog}
        onClose={() => setCustomizeGenerationDialog(false)}
        onGenerate={ragGenerate}
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
          actions={actions}
          newQuestionId={newQuestionId}
          onDeleteQuestion={deleteQuestion}
        />

        <ItemFlashcardPreview openedQuestion={openedQuestion} />
      </div>
    </div>
  )
}

export default ItemView
