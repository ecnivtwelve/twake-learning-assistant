import { useState, useEffect, useRef } from 'react'

import { useClient } from 'cozy-client'

import { fetchPartitionTask } from '@/queries/rag/openrag'

export const useTaskStatus = source => {
  const client = useClient()
  const metadata = source.metadata || source.attributes?.metadata
  const taskId = metadata && metadata.taskId
  const isRagProcessed = metadata && metadata.rag_processed

  const [isCompleted, setIsCompleted] = useState(isRagProcessed)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!taskId || isCompleted || isRagProcessed) return

    const checkStatus = async () => {
      try {
        const task = await fetchPartitionTask(taskId)
        if (task.task_state === 'COMPLETED') {
          setIsCompleted(true)
          await client.save({
            _id: source._id,
            _type: 'io.cozy.files',
            _rev: source._rev,
            metadata: {
              taskId: null,
              processed: true,
              rag_processed: true
            }
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
  }, [taskId, isCompleted, isRagProcessed, client, source._id, source._rev])

  return isCompleted
}
