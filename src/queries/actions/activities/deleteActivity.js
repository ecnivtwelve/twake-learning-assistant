export const deleteActivity = async (client, activity) => {
  const response = await client.stackClient
    .collection('io.cozy.learnings')
    .destroy(activity)

  if (!response?.data) {
    throw new Error('Failed to delete activity')
  }

  return response?.data
}
