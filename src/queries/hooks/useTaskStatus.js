import { useState, useEffect, useRef } from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import { deleteSource } from '../actions/sources/deleteSource'

import { deleteTask, fetchPartitionTask } from '@/queries/rag/openrag'

export const useTaskStatus = source => {
  const client = useClient()
  const { t } = useI18n
  const taskId = source.taskId || source.metadata?.taskId
  // Check top-level rag_processed first, then metadata
  const isRagProcessed =
    source.rag_processed !== undefined
      ? source.rag_processed
      : source.metadata?.rag_processed

  const [isCompleted, setIsCompleted] = useState(isRagProcessed)
  const timerRef = useRef(null)
  const { showAlert } = useAlert()

  useEffect(() => {
    if (!taskId || isCompleted || isRagProcessed) return

    const checkStatus = async () => {
      try {
        const task = await fetchPartitionTask(taskId)
        console.log('task', task)
        if (task.task_state === 'COMPLETED') {
          setIsCompleted(true)
          if (source._type === 'io.cozy.learnings.sources') {
            await client.save({
              ...source,
              rag_processed: true,
              processed: true // legacy?
            })
          } else {
            // Backward compatibility for io.cozy.files
            await client.save({
              _id: source._id,
              _type: 'io.cozy.files',
              _rev: source._rev,
              metadata: {
                ...source.metadata,
                taskId: null,
                processed: true,
                rag_processed: true
              }
            })
          }
        } else if (task.task_state === 'FAILED') {
          await deleteTask(taskId)
          await client.destroy(source)
          showAlert({
            message: t('sources.import.error'),
            severity: 'error',
            variant: 'filled'
          })
        } else {
          timerRef.current = setTimeout(checkStatus, 3000)
        }
      } catch (err) {
        console.error('Polling error:', err)
        timerRef.current = setTimeout(checkStatus, 5000)
      }
    }

    checkStatus()

    // Cleanup timer on unmount
    return () => clearTimeout(timerRef.current)
  }, [taskId, isCompleted, isRagProcessed, client, source])

  return isCompleted
}
