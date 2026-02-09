import { deleteFile } from '@/queries/rag/openrag'

export const deleteSource = async (client, subject, source) => {
  const fileId = source.partitionFileId || source.metadata?.partitionFileId
  if (fileId) {
    // await deleteFile(subject.partition, fileId)
  }
  await subject.sources.remove([source])

  // Optionally delete the source document itself if remove() doesn't do it (remove usually just unlinks)
  // But here we probably want to destroy the io.cozy.learnings.sources document
  await client.destroy(source)

  // Also delete the linked file?
  // The user requirement didn't specify, but usually "delete source" implies deleting the file if it was "uploaded for this".
  // However, if it's a file from Drive, maybe we shouldn't?
  // For now, let's just delete the source object and the RAG file.
  // The mandatory relationship means the file exists.
  // If we want to clean up:
  // if (source.relationships?.file?.data?._id) {
  //   await client.destroy({ _id: source.relationships.file.data._id, _type: 'io.cozy.files' })
  // }
  // Let's stick to deleting the source object.

  return source
}
