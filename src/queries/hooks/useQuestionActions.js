import { useState } from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import { deleteQuestions } from '../actions/questions/deleteQuestion'

import { useSubject } from '@/context/SubjectContext'
import { attachQuestions } from '@/queries/actions/questions/attachQuestion'
import { detachQuestions } from '@/queries/actions/questions/detachQuestion'
import { newQuestion } from '@/queries/actions/questions/newQuestion'

export const useQuestionActions = (activity, questions = []) => {
  const { t } = useI18n()
  const client = useClient()
  const { showAlert } = useAlert()
  const { selectedSubject: subject } = useSubject()

  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [newQuestionId, setNewQuestionId] = useState(null)

  const createQuestion = () => {
    newQuestion(client, subject, activity, { label: '' })
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

  const deleteQuestion = question => {
    deleteQuestions(client, [question])
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

  const detachQuestion = questionId => {
    detachQuestions(activity, [{ _id: questionId }])
      .then(() => {
        return showAlert({
          message: t('questions.alerts.detached'),
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

  const attachQuestion = questionIds => {
    const questions = questionIds.map(id => ({ _id: id }))
    attachQuestions(client, activity, questions)
      .then(() => {
        return showAlert({
          message: t('questions.alerts.added'),
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

  const detachSelected = () => ({
    name: 'detachSelected',
    icon: TrashIcon,
    action: async () => {
      const questionsIds = selectedQuestions.map(q => {
        return { _id: q }
      })
      await detachQuestions(activity, questionsIds)
      setSelectedQuestions([])
    },
    label: t('detach')
  })

  const deleteSelected = () => ({
    name: 'deleteSelected',
    icon: TrashIcon,
    action: async () => {
      const questionsToDelete = selectedQuestions
        .map(id => questions.find(q => q._id === id))
        .filter(Boolean)
      await deleteQuestions(client, questionsToDelete)
      setSelectedQuestions([])
    },
    label: t('delete')
  })

  const availableActions = [deleteSelected]
  if (activity) {
    availableActions.push(detachSelected)
  }

  const actions = makeActions(availableActions)

  return {
    selectedQuestions,
    setSelectedQuestions,
    createQuestion,
    deleteQuestion,
    detachQuestion,
    attachQuestion,
    actions,
    newQuestionId,
    resetNewQuestionId: () => setNewQuestionId(null)
  }
}
