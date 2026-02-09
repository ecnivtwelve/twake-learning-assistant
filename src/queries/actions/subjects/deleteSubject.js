import { deleteActivity } from '../activities/deleteActivity'

import { deletePartition } from '@/queries/rag/openrag'

export const deleteSubject = async (
  client,
  subject,
  skipPartitionDeletion = false
) => {
  const partitionId = subject.partition ?? ''

  subject.activities.data.forEach(activity => {
    deleteActivity(client, activity)
  })

  if (!skipPartitionDeletion && partitionId) {
    const partitionDeleted = await deletePartition(partitionId)

    if (partitionDeleted.status !== 204) {
      throw new Error('Failed to delete partition')
    }
  }

  const response = await client.stackClient
    .collection('io.cozy.learnings.subjects')
    .destroy(subject)

  if (!response?.data) {
    throw new Error('Failed to delete subject')
  }

  return response?.data
}
