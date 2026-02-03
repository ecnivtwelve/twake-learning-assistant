import { buildActivityItemQuery } from '@/queries'

export const newQuestion = async (client, activity, label, answer, hint) => {
  const response = await client.save({
    _type: 'io.cozy.learnings.questions',
    label: label,
    answer: answer,
    hint: hint
  })

  await activity.questions.add(response.data)

  if (!response.data || !response.data._id) {
    throw new Error('Failed to create question')
  }

  return response.data
}

export const newQuestionsBatch = async (client, activity, questions) => {
  const questionsList = []

  for (const question of questions) {
    const response = await client.save({
      _type: 'io.cozy.learnings.questions',
      label: question.label,
      answer: question.answer,
      hint: question.hint
    })
    questionsList.push(response.data)
  }

  await activity.questions.add(questionsList)

  if (!questionsList || questionsList.length === 0) {
    throw new Error('Failed to create questions')
  }

  return questionsList
}
