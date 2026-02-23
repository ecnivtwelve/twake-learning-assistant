import React from 'react'

import { useClient } from 'cozy-client'
import Viewer from 'cozy-viewer'

import SourcesImportDialog from '@/components/Dialogs/SourcesImportDialog/SourcesImportDialog'
import PageLayout from '@/components/PageLayout/PageLayout'
import SourcesList from '@/components/SourcesTab/SourcesList'
import SourcesTabHeader from '@/components/SourcesTab/SourcesTabHeader'
import { useSubject } from '@/context/SubjectContext'
import { useSourceImport } from '@/hooks/useSourceImport'
import { deleteSource } from '@/queries/actions/sources/deleteSource'

const SourcesTab = () => {
  const client = useClient()

  const { selectedSubject } = useSubject()
  const sources = selectedSubject?.sources.data || []

  const [isFilePickerDialogOpen, setIsFileDialogOpen] = React.useState(false)

  const { handleFilesSelected } = useSourceImport(client, selectedSubject)

  const [openedFile, setOpenedFile] = React.useState({
    files: [],
    index: 0
  })

  const existingFiles = sources.map(
    source => source.relationships?.file?.data?._id
  )

  return (
    <>
      {openedFile.files.length > 0 && (
        <Viewer
          files={openedFile.files}
          onCloseRequest={() => setOpenedFile({ files: [], index: 0 })}
          currentIndex={openedFile.index}
        />
      )}

      <PageLayout
        trailing={
          <SourcesTabHeader onNewSource={() => setIsFileDialogOpen(true)} />
        }
      >
        <SourcesImportDialog
          open={isFilePickerDialogOpen}
          onClose={() => setIsFileDialogOpen(false)}
          existingFiles={existingFiles}
          onFilesSelected={handleFilesSelected}
        />

        <SourcesList
          sources={sources}
          onOpenImportDialog={() => setIsFileDialogOpen(true)}
          onDeleteSource={async source => {
            await deleteSource(client, selectedSubject, source)
          }}
          onOpenSource={async source => {
            const fileId = source.relationships?.file?.data?._id
            if (!fileId) {
              return
            }
            const query = await client.get('io.cozy.files', fileId)
            const file = await client.query(query)
            if (!file.data) {
              return
            }
            setOpenedFile({
              files: [file.data],
              index: 0
            })
          }}
        />
      </PageLayout>
    </>
  )
}

export default SourcesTab
