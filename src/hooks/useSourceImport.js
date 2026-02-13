import { useState } from 'react'

import { fetchBlobFileById } from 'cozy-client/dist/models/file'

import { useSubject } from '@/context/SubjectContext'
import { newSource } from '@/queries/actions/sources/importSource'

export const useSourceImport = client => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { selectedSubject } = useSubject()

  const handleFilesSelected = async files => {
    if (files && files.length > 0) {
      setIsLoading(true)
      setError(null)
      try {
        await Promise.all(
          files.map(async file => {
            const blob = await fetchBlobFileById(client, file._id)
            const fileObj = new File([blob], file.name, { type: file.mime })
            await newSource(
              client,
              selectedSubject,
              fileObj,
              'Imported from Cozy Drive',
              'User',
              file
            )
          })
        )
      } catch (e) {
        setError(e)
        throw e
      } finally {
        setIsLoading(false)
      }
    }
  }

  return { handleFilesSelected, isLoading, error }
}
