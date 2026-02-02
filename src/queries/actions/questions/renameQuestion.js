export const renameQuestion = async (client, question, label) => {
  const response = await client.save({
    ...question,
    label
  })

  if (!response.data || !response.data._id) {
    throw new Error('Failed to rename question')
  }

  return response.data
}
