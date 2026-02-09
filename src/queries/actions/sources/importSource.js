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

  console.log(subject)

  const result = await uploadFile(
    subject.partition,
    file,
    author,
    description,
    fileId
  )
  const taskId = result.task_status_url.split('/').pop()

  const savedFileMeta = cozyFile
    ? {
        ...cozyFile,
        metadata: {
          ...cozyFile.metadata,
          partition: subject.partition,
          partitionFileId: fileId,
          taskId: taskId,
          rag_processed: false
        }
      }
    : {
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
      }

  const savedFile = await client.save(savedFileMeta)

  await subject.sources.add(savedFile.data)

  return taskId
}
