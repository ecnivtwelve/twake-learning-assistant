import { useState } from 'react'
import { useI18n } from 'twake-i18n'

import { useClient, Q } from 'cozy-client'
import log from 'cozy-logger'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import { newQuestionsBatch } from '@/queries/actions/questions/newQuestion'
import { safeAddRelationship } from '@/queries/actions/utils'
import {
  extractJSONObject,
  generateFlashCards,
  generateMCQs
} from '@/queries/rag/openrag'

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

      let matchingSources = []
      if (data.extra) {
        try {
          const extra = JSON.parse(data.extra)
          if (extra.sources && extra.sources.length > 0) {
            const sourceIds = extra.sources.map(s => s.file_id)
            const { data: allSources } = await client.query(
              Q('io.cozy.learnings.sources')
                .where({
                  partition: subject.partition || 'subject-' + subject._id
                })
                .indexFields(['partition'])
                .limitBy(1000)
            )

            matchingSources = allSources.filter(source =>
              sourceIds.includes(source.partitionFileId)
            )

            if (matchingSources.length > 0) {
              await safeAddRelationship(
                client,
                activity,
                'sources',
                matchingSources
              )
            }
          }
        } catch (error) {
          log.error('Failed to link sources to activity', error)
        }
      }
      const json = extractJSONObject(data.choices[0].message.content)
      if (json.cards && json.cards.length > 0 && json.cards[0].answer) {
        newQuestionsBatch(
          client,
          subject,
          activity,
          json.cards.map(card => {
            return {
              label: card.text,
              choices: [
                {
                  id: 1,
                  description: card.answer
                }
              ],
              correct: 1,
              hint: card.tip
            }
          }),
          'flashcard',
          matchingSources
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

  const ragGenerateMCQs = async () => {
    try {
      setIsGenerating(true)
      const data = await generateMCQs(
        subject,
        16,
        activity.title,
        numberOfQuestions
      )

      let matchingSources = []
      if (data.extra) {
        try {
          const extra = JSON.parse(data.extra)
          if (extra.sources && extra.sources.length > 0) {
            const sourceIds = extra.sources.map(s => s.file_id)
            const { data: allSources } = await client.query(
              Q('io.cozy.learnings.sources')
                .where({
                  partition: subject.partition || 'subject-' + subject._id
                })
                .indexFields(['partition'])
                .limitBy(1000)
            )

            matchingSources = allSources.filter(source =>
              sourceIds.includes(source.partitionFileId)
            )

            if (matchingSources.length > 0) {
              await safeAddRelationship(
                client,
                activity,
                'sources',
                matchingSources
              )
            }
          }
        } catch (error) {
          log.error('Failed to link sources to activity', error)
        }
      }
      const json = extractJSONObject(data.choices[0].message.content)
      console.log(json)
      if (json && json.length > 0 && json[0].reponse) {
        newQuestionsBatch(
          client,
          subject,
          activity,
          json.map(card => {
            return {
              label: card.question,
              choices: [
                {
                  id: 1,
                  description: card.reponse
                },
                {
                  id: 2,
                  description: 'TBD'
                },
                {
                  id: 3,
                  description: 'TBD'
                },
                {
                  id: 4,
                  description: 'TBD'
                }
              ],
              correct: 1
            }
          }),
          'choice',
          matchingSources
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
