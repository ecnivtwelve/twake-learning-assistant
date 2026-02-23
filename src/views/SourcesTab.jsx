import React from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import { FilePickerDialog } from 'cozy-filepicker'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import Viewer from 'cozy-viewer'

import SourceIcon from '@/assets/icons/SourceIcon'
import PageLayout from '@/components/PageLayout/PageLayout'
import SourceItem from '@/components/SourceItem/SourceItem'
import TableItemText from '@/components/TableItem/TableItemText'
import { useSubject } from '@/context/SubjectContext'
import { useSourceImport } from '@/hooks/useSourceImport'
import { deleteSource } from '@/queries/actions/sources/deleteSource'

const SourcesTab = () => {
  const { t } = useI18n()
  const client = useClient()
  const { showAlert } = useAlert()

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
          <div>
            <Button
              variant="primary"
              label={t('new')}
              startIcon={<Icon icon={PlusIcon} />}
              onClick={() => setIsFileDialogOpen(true)}
            />
          </div>
        }
      >
        <FilePickerDialog
          open={isFilePickerDialogOpen}
          onClose={() => setIsFileDialogOpen(false)}
          multiple={true}
          fileTypes={[
            'application/pdf',
            'text/markdown',
            'text/plain',
            'text/vnd.cozy.note+markdown'
          ]}
          existingFiles={existingFiles}
          onFilesSelected={async files => {
            setIsFileDialogOpen(false)
            showAlert({
              message: t('sources.import.loading'),
              severity: 'info',
              variant: 'filled'
            })
            try {
              await handleFilesSelected(files)
              showAlert({
                message: t('sources.import.success'),
                severity: 'success',
                variant: 'filled'
              })
            } catch (error) {
              showAlert({
                message: t('sources.import.error'),
                severity: 'error',
                variant: 'filled'
              })
            }
          }}
        />

        <List>
          <ListItem size="small" dense>
            <ListItemIcon className="u-w-2-half"></ListItemIcon>
            <TableItemText value={t('sources.table.name')} type="primary" />
            <TableItemText
              value={t('sources.table.filename')}
              type="secondary"
            />
            <TableItemText value={t('sources.table.update')} type="secondary" />
            <TableItemText value={t('sources.table.tags')} type="secondary" />
            <div className="u-w-1-half" />
          </ListItem>

          <Divider />

          {sources &&
            sources.map(source => (
              <React.Fragment key={source._id}>
                <SourceItem
                  source={source}
                  deleteSource={async () => {
                    await deleteSource(client, selectedSubject, source)
                  }}
                  onOpen={async () => {
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
                <Divider />
              </React.Fragment>
            ))}

          {sources.length === 0 && (
            <Empty
              icon={<SourceIcon size={96} />}
              title={t('sources.empty.title')}
              text={t('sources.empty.message')}
              centered
            >
              <Button
                variant="primary"
                label={t('sources.empty.select')}
                startIcon={<Icon icon={PlusIcon} />}
                onClick={() => setIsFileDialogOpen(true)}
                className="u-mt-1"
              />
            </Empty>
          )}
        </List>
      </PageLayout>
    </>
  )
}

export default SourcesTab
