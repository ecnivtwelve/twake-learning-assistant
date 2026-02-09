import { generateFileHash, uploadFile } from '@/queries/rag/openrag'

export const newSource = async (
  client,
  subject,
  file,
  description,
  author,
  cozyFile
) => {
  const fileId = await generateFileHash(file)

  if (!fileId) {
    throw new Error('FileId not found')
  }

  console.log(subject)

  const result = await uploadFile(
    subject.partition,
    file,
    author,
    description,
    fileId
  )
  const taskId = result.task_status_url.split('/').pop()

  if (!taskId) {
    throw new Error('TaskId not found')
  }

  const savedFile = cozyFile
    ? await client.save({
      ...cozyFile,
      _id: cozyFile._id,
      _rev: cozyFile._rev,
      metadata: {
        ...cozyFile.metadata,
        partition: subject.partition,
        partitionFileId: fileId,
        taskId: taskId,
        rag_processed: false
      }
    })
    : await client.save({
      _type: 'io.cozy.files',
      type: 'file',
      name: file.name,
      contentType: file.type,
      dirId: 'io.cozy.files.root-dir',
      data: file,
      metadata: {
        partition: subject.partition,
        partitionFileId: fileId,
        taskId: taskId,
        rag_processed: false
      }
    })

  await subject.sources.add(savedFile.data)

  return taskId
}
