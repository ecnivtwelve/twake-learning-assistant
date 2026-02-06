import { useState } from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import log from 'cozy-logger'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import { newQuestionsBatch } from '@/queries/actions/questions/newQuestion'
import { extractJSONObject, generateFlashCards } from '@/queries/rag/openrag'

export const useQuestionGeneration = (activity, subject) => {
  const { t } = useI18n()
  const client = useClient()
  const { showAlert } = useAlert()
  const [isGenerating, setIsGenerating] = useState(false)
  const [customizeGenerationDialog, setCustomizeGenerationDialog] =
    useState(false)
  const [numberOfQuestions, setNumberOfQuestions] = useState(5)

  const ragGenerate = async (previousQuestions = []) => {
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
      const json = extractJSONObject(data.choices[0].message.content)
      if (json.cards && json.cards.length > 0 && json.cards[0].answer) {
        newQuestionsBatch(
          client,
          subject,
          activity,
          json.cards.map(card => {
            return {
              label: card.text,
              answer: card.answer,
              hint: card.tip
            }
          })
        )

        showAlert({
          message: t('questions.generate.success'),
          severity: 'success'
        })
      } else {
        log.error(json)
        showAlert({
          message: t('questions.generate.error'),
          severity: 'error'
        })
      }
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
    ragGenerate,
    customizeGenerationDialog,
    setCustomizeGenerationDialog,
    numberOfQuestions,
    setNumberOfQuestions
  }
}
