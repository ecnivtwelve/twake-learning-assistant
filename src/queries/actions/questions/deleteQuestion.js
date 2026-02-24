export const deleteQuestion = async (client, question) => {
  const response = await client.stackClient
    .collection('io.cozy.learnings.questions')
    .destroy(question)

  if (!response?.data) {
    throw new Error('Failed to delete question')
  }

  return response?.data
}

export const deleteQuestions = async (client, questions) => {
  return Promise.all(
    questions.map(question => deleteQuestion(client, question))
  )
}
