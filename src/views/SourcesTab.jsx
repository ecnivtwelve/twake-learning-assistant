import React from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import { FilePickerDialog } from 'cozy-filepicker'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'

import PageLayout from '@/components/PageLayout/PageLayout'
import SourceItem from '@/components/SourceItem/SourceItem'
import AddSourceDialog from '@/components/Sources/AddSourceDialog'
import TableItemText from '@/components/TableItem/TableItemText'
import { useSubject } from '@/context/SubjectContext'
import { useSourceImport } from '@/hooks/useSourceImport'
import { deleteSource } from '@/queries/actions/sources/deleteSource'

const SourcesTab = () => {
  const { t } = useI18n()
  const client = useClient()

  const { selectedSubject } = useSubject()
  const sources = selectedSubject?.sources.data || []

  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isFilePickerDialogOpen, setIsFileDialogOpen] = React.useState(false)

  const { handleFilesSelected } = useSourceImport(client, selectedSubject)

  return (
    <>
      <PageLayout
        trailing={
          <div>
            <Button
              variant="secondary"
              label={t('import')}
              startIcon={<Icon icon={PlusIcon} />}
              onClick={() => setIsFileDialogOpen(true)}
              className="u-mr-half"
            />

            <Button
              variant="primary"
              label={t('new')}
              startIcon={<Icon icon={PlusIcon} />}
              onClick={() => setIsAddDialogOpen(true)}
            />
          </div>
        }
      >
        <FilePickerDialog
          open={isFilePickerDialogOpen}
          onClose={() => setIsFileDialogOpen(false)}
          onFilesSelected={files => {
            handleFilesSelected(files)
            setIsFileDialogOpen(false)
          }}
          multiple={false}
        />

        <AddSourceDialog
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          subject={selectedSubject}
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
            <div className="u-w-2-half" />
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
                />
                <Divider />
              </React.Fragment>
            ))}
        </List>
      </PageLayout>
    </>
  )
}

export default SourcesTab
