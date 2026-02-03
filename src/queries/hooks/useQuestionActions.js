import { useState } from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import { detachQuestions } from '@/queries/actions/questions/detachQuestion'
import { newQuestion } from '@/queries/actions/questions/newQuestion'

export const useQuestionActions = (activity, questions) => {
  const { t } = useI18n()
  const client = useClient()
  const { showAlert } = useAlert()

  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [newQuestionId, setNewQuestionId] = useState(null)

  const createQuestion = () => {
    newQuestion(client, activity, '')
      .then(question => {
        setNewQuestionId(question._id)
        return showAlert({
          message: t('questions.alerts.created'),
          severity: 'success'
        })
      })
      .catch(() => {
        return showAlert({
          message: t('questions.alerts.error'),
          severity: 'error'
        })
      })
  }

  const deleteQuestion = questionId => {
    detachQuestions(activity, [{ _id: questionId }])
      .then(() => {
        return showAlert({
          message: t('questions.alerts.deleted'),
          severity: 'success'
        })
      })
      .catch(() => {
        return showAlert({
          message: t('questions.alerts.error'),
          severity: 'error'
        })
      })
  }

  const deleteSelected = () => ({
    name: 'deleteSelected',
    icon: TrashIcon,
    action: async () => {
      const questionsIds = selectedQuestions.map(q => {
        return { _id: q }
      })
      await detachQuestions(activity, questionsIds)
      setSelectedQuestions([])
    },
    label: t('delete')
  })

  const actions = makeActions([deleteSelected])

  return {
    selectedQuestions,
    setSelectedQuestions,
    createQuestion,
    deleteQuestion,
    actions,
    newQuestionId
  }
}
