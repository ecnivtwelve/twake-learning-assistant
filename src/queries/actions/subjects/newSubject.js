export const newSubject = async (client, title) => {
  const response = await client.save({
    _type: 'io.cozy.learnings.subjects',
    title: title || 'Untitled'
  })

  if (!response?.data) {
    throw new Error('Failed to create subject')
  }

  return response.data
}
