export const renameActivity = async (client, activity, title) => {
  const response = await client.save({
    ...activity,
    title
  })

  if (!response?.data) {
    throw new Error('Failed to rename activity')
  }

  return response?.data
}
