import { useState } from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import log from 'cozy-logger'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import {
  handleGenerationResponse,
  linkSourcesToActivity
} from './utils/questionGenerationUtils'

import { generateFlashCards, generateMCQs } from '@/queries/rag/openrag'

export const useQuestionGeneration = (activity, subject) => {
  const { t } = useI18n()
  const client = useClient()
  const { showAlert } = useAlert()
  const [isGenerating, setIsGenerating] = useState(false)
  const [customizeGenerationDialog, setCustomizeGenerationDialog] =
    useState(false)
  const [customizeImportDialog, setCustomizeImportDialog] = useState(false)
  const [numberOfQuestions, setNumberOfQuestions] = useState(5)

  const ragGenerateFlashcards = async (previousQuestions = []) => {
    try {
      setIsGenerating(true)
      const data = await generateFlashCards(
        subject,
        16,
        activity.title,
        numberOfQuestions,
        previousQuestions,
        false
      )

      const matchingSources = await linkSourcesToActivity(
        client,
        subject,
        activity,
        data
      )

      await handleGenerationResponse(
        client,
        subject,
        activity,
        data.choices[0].message.content,
        matchingSources,
        'flashcard',
        showAlert,
        t
      )
    } catch (error) {
      log.error(error)
      showAlert({
        message: t('questions.generate.error'),
        severity: 'error'
      })
    }
    setIsGenerating(false)
  }

  const ragGenerateMCQs = async () => {
    try {
      setIsGenerating(true)
      const data = await generateMCQs(
        subject,
        16,
        activity.title,
        numberOfQuestions
      )

      const matchingSources = await linkSourcesToActivity(
        client,
        subject,
        activity,
        data
      )

      await handleGenerationResponse(
        client,
        subject,
        activity,
        data.choices[0].message.content,
        matchingSources,
        'choice',
        showAlert,
        t,
        16
      )
    } catch (error) {
      log.error(error)
      showAlert({
        message: t('questions.generate.error'),
        severity: 'error'
      })
    }
    setIsGenerating(false)
  }

  return {
    isGenerating,
    ragGenerateFlashcards,
    ragGenerateMCQs,
    customizeGenerationDialog,
    setCustomizeGenerationDialog,
    customizeImportDialog,
    setCustomizeImportDialog,
    numberOfQuestions,
    setNumberOfQuestions
  }
}
