export const newActivity = async (client, subject) => {
  const response = await client.create('io.cozy.learnings', {
    title: '',
    description: '',
    tags: [],
    relationships: {
      questions: {
        data: []
      }
    }
  })

  subject.activities.add(response.data)

  if (!response?.data) {
    throw new Error('Failed to create activity')
  }

  return response.data
}
