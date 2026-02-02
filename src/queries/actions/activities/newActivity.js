export const newActivity = async client => {
  const response = await client.save({
    _type: 'io.cozy.learnings',
    title: '',
    relationships: {
      questions: {
        data: []
      }
    }
  })

  if (!response?.data) {
    throw new Error('Failed to create activity')
  }

  return response.data
}
