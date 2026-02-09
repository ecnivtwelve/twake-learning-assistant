import { safeAddRelationship } from '../utils'

export const newQuestion = async (
  client,
  subject,
  activity,
  { label, answer, hint }
) => {
  const newList = await newQuestionsBatch(client, subject, activity, [
    { label, answer, hint }
  ])
  return newList[0]
}

export const newQuestionsBatch = async (
  client,
  subject,
  activity,
  questions
) => {
  const questionsList = []

  for (const question of questions) {
    const response = await client.save({
      _type: 'io.cozy.learnings.questions',
      label: question.label,
      interaction: 'flashcard',
      choices: question.answer
        ? [
          {
            id: 1,
            description: question.answer
          }
        ]
        : [],
      correct: question.answer ? [1] : [],
      hint: question.hint,
      relationships: {
        activities: {
          data: [activity]
        },
        subjects: {
          data: [subject]
        }
      }
    })
    questionsList.push(response.data)
  }

  await safeAddRelationship(client, activity, 'questions', questionsList)
  await safeAddRelationship(client, subject, 'questions', questionsList)

  if (!questionsList || questionsList.length === 0) {
    throw new Error('Failed to create questions')
  }

  return questionsList
}
