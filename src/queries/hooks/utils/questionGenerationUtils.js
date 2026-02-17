import { Q } from 'cozy-client'
import log from 'cozy-logger'

import { newQuestionsBatch } from '@/queries/actions/questions/newQuestion'
import { safeAddRelationship } from '@/queries/actions/utils'
import { extractJSONObject, runDistractorPipeline } from '@/queries/rag/openrag'

export const linkSourcesToActivity = async (
  client,
  subject,
  activity,
  data
) => {
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
  return matchingSources
}

export const handleGenerationResponse = async (
  client,
  subject,
  activity,
  rawContent,
  matchingSources,
  type,
  showAlert,
  t,
  age,
  onStatusUpdate
) => {
  try {
    const json = extractJSONObject(rawContent)
    let questions = []

    if (type === 'flashcard') {
      if (json.cards && json.cards.length > 0 && json.cards[0].answer) {
        questions = json.cards.map(card => ({
          label: card.text,
          choices: [
            {
              id: 1,
              description: card.answer
            }
          ],
          correct: 1,
          hint: card.tip
        }))
      }
    } else if (type === 'choice') {
      const items = Array.isArray(json) ? json : json.questions || []
      if (items.length > 0 && items[0].reponse) {
        if (onStatusUpdate) {
          onStatusUpdate(`LUCIE 0/${items.length}`)
        }
        let completedCount = 0
        questions = await Promise.all(
          items.map(async card => {
            const distractorData = await runDistractorPipeline(
              card.question,
              card.reponse,
              subject,
              age
            )
            completedCount++
            if (onStatusUpdate) {
              onStatusUpdate(`LUCIE ${completedCount}/${items.length}`)
            }
            if (distractorData) {
              return {
                label: distractorData.question,
                choices: distractorData.options.map((opt, index) => ({
                  id: index + 1,
                  description: opt
                })),
                correct:
                  distractorData.options.indexOf(
                    distractorData.correct_answer
                  ) + 1
              }
            } else {
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
            }
          })
        )
      }
    }

    if (questions.length > 0) {
      await newQuestionsBatch(
        client,
        subject,
        activity,
        questions,
        type,
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
}
