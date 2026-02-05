import { deleteFile } from '@/queries/rag/openrag'

export const deleteSource = async (client, subject, source) => {
  await deleteFile(subject.partition, source.metadata.partitionFileId)
  await subject.sources.remove([source])

  const response = await client.stackClient
    .collection('io.cozy.files')
    .destroy(source)

  return response
}
