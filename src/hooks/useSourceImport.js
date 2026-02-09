import { fetchBlobFileById } from 'cozy-client/dist/models/file'

import { newSource } from '@/queries/actions/sources/importSource'

export const useSourceImport = (client, selectedSubject) => {
  const handleFilesSelected = async files => {
    if (files && files.length > 0) {
      const file = files[0]
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
    }
  }

  return { handleFilesSelected }
}
