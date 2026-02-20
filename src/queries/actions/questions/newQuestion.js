import { safeAddRelationship } from '../utils'

export const newQuestion = async (
  client,
  subject,
  activity,
  { label, answer, hint },
  sources = []
) => {
  const newList = await newQuestionsBatch(
    client,
    subject,
    activity,
    [{ label, answer, hint }],
    sources
  )
  return newList[0]
}

export const newQuestionsBatch = async (
  client,
  subject,
  activity,
  questions,
  interaction = 'flashcard',
  sources = []
) => {
  const questionsList = []

  for (const question of questions) {
    const relationships = {
      subjects: {
        data: [subject]
      },
      sources: {
        data: sources
      }
    }
    if (activity) {
      relationships.activities = {
        data: [activity]
      }
    }

    const response = await client.save({
      _type: 'io.cozy.learnings.questions',
      label: question.label,
      interaction: interaction,
      choices: question.choices,
      correct: question.correct ?? 1,
      hint: question.hint,
      relationships
    })
    questionsList.push(response.data)
  }

  if (activity)
    await safeAddRelationship(client, activity, 'questions', questionsList)
  if (subject)
    await safeAddRelationship(client, subject, 'questions', questionsList)

  if (!questionsList || questionsList.length === 0) {
    throw new Error('Failed to create questions')
  }

  return questionsList
}
