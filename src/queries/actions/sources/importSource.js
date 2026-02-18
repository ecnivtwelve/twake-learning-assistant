import { safeAddRelationship } from '../utils'

import { deleteTask, generateFileHash, uploadFile } from '@/queries/rag/openrag'

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

  const partitionId = subject.partition || 'subject-' + subject._id

  const result = await uploadFile(
    partitionId,
    file,
    author,
    description,
    fileId
  )
  const taskId = result.task_status_url.split('/').pop()

  if (!taskId) {
    throw new Error('TaskId not found')
  }

  const fileDoc = cozyFile
    ? cozyFile
    : (
        await client.save({
          _type: 'io.cozy.files',
          type: 'file',
          name: file.name,
          contentType: file.type,
          dirId: 'io.cozy.files.root-dir',
          data: file
        })
      ).data

  const source = await client.save({
    _type: 'io.cozy.learnings.sources',
    name: file.name,
    description: description,
    author: author,
    partition: partitionId,
    partitionFileId: fileId,
    taskId: taskId,
    rag_processed: false,
    uploadedAt: new Date().toISOString(),
    relationships: {
      file: {
        data: {
          _id: fileDoc._id,
          _type: 'io.cozy.files'
        }
      }
    }
  })

  if (!source.data) {
    await deleteTask(taskId)
    throw new Error('Failed to create source')
  }

  try {
    await safeAddRelationship(client, subject, 'sources', source.data)
  } catch (error) {
    await deleteTask(taskId)
    await client.destroy(source)
    throw new Error('Failed to add source to subject: ' + error.message)
  }

  return taskId
}
