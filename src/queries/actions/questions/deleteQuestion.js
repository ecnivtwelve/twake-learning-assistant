export const deleteQuestion = async (client, question) => {
  const response = await client.stackClient
    .collection('io.cozy.learnings.question')
    .destroy(question)

  if (!response?.data) {
    throw new Error('Failed to delete question')
  }

  return response?.data
}

export const deleteQuestions = async (client, questions) => {
  const response = await client.stackClient
    .collection('io.cozy.learnings.question')
    .destroy(questions)

  if (!response?.data) {
    throw new Error('Failed to delete questions')
  }

  return response?.data
}
