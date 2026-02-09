import { buildActivityItemQuery } from '@/queries'

export const newQuestion = async (
  client,
  subject,
  activity,
  { label, answer, hint, interaction = 'flashcard' }
) => {
  const response = await client.save({
    _type: 'io.cozy.learnings.questions',
    label: label,
    interaction: interaction,
    choices: answer
      ? [
        {
          id: 1,
          description: answer
        }
      ]
      : [],
    correct: answer ? [1] : [],
    hint: hint,
    relationships: {
      activities: {
        data: [activity]
      },
      subjects: {
        data: [subject]
      }
    }
  })

  await subject.questions.add([response.data])
  await activity.questions.add([response.data])

  if (!response.data || !response.data._id) {
    throw new Error('Failed to create question')
  }

  return response.data
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

  await activity.questions.add(questionsList)
  await subject.questions.add(questionsList)

  if (!questionsList || questionsList.length === 0) {
    throw new Error('Failed to create questions')
  }

  return questionsList
}
