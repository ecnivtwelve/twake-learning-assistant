export const newQuestion = async (client, activity, label) => {
  const response = await client.save({
    _type: 'io.cozy.learnings.questions',
    label: label
  })

  await activity.questions.add(response.data)

  if (!response.data || !response.data._id) {
    throw new Error('Failed to create question')
  }

  return response.data
}
