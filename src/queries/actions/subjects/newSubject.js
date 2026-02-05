import { deleteSubject } from './deleteSubject'

import { createPartition } from '@/queries/rag/openrag'

export const newSubject = async (client, title) => {
  const response = await client.create('io.cozy.learnings.subjects', {
    title: title || 'Untitled',
    relationships: {
      activities: {
        data: []
      },
      sources: {
        data: []
      }
    }
  })

  if (!response?.data) {
    throw new Error('Failed to create subject')
  }

  const partitionName = 'subject-' + response.data._id

  // if 201
  const partitionCreated = await createPartition(partitionName)

  if (partitionCreated.status !== 201) {
    await deleteSubject(client, response.data, true)

    throw new Error('Failed to create partition')
  }

  const response2 = await client.save({
    ...response.data,
    partition: partitionName
  })

  if (!response2?.data) {
    throw new Error('Failed to create subject')
  }

  return response2.data
}
