import { safeAddRelationship } from '../utils'

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

  await safeAddRelationship(client, subject, 'activities', response.data)

  if (!response?.data) {
    throw new Error('Failed to create activity')
  }

  return response.data
}
