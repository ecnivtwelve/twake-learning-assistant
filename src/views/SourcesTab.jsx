import React, { useEffect } from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import { fetchBlobFileById } from 'cozy-client/dist/models/file'
import { FilePickerDialog } from 'cozy-filepicker'
import log from 'cozy-logger'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'

import SourceItem from '@/components/SourceItem/SourceItem'
import AddSourceDialog from '@/components/Sources/AddSourceDialog'
import SubjectDropdown from '@/components/Subjects/SubjectDropdown'
import TabTitle from '@/components/TabTitle/TabTitle'
import TableItemText from '@/components/TableItem/TableItemText'
import { useSubject } from '@/context/SubjectContext'
import { deleteSource } from '@/queries/actions/sources/deleteSource'
import { newSource } from '@/queries/actions/sources/importSource'

const SourcesTab = () => {
  const { t } = useI18n()
  const client = useClient()

  const { selectedSubject } = useSubject()
  const sources = selectedSubject?.sources.data || []

  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isFilePickerDialogOpen, setIsFileDialogOpen] = React.useState(false)

  return (
    <>
      <TabTitle
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
        <SubjectDropdown />
      </TabTitle>

      <FilePickerDialog
        open={isFilePickerDialogOpen}
        onClose={() => setIsFileDialogOpen(false)}
        onFilesSelected={async files => {
          if (files && files.length > 0) {
            const file = files[0]
            const blob = await fetchBlobFileById(client, file._id)
            const fileObj = new File([blob], file.name, { type: file.mime })
            await newSource(
              client,
              selectedSubject,
              fileObj,
              'Imported from Cozy Drive',
              'User'
            )
          }
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
          <TableItemText value={t('sources.table.filename')} type="secondary" />
          <TableItemText value={t('sources.table.update')} type="secondary" />
          <TableItemText value={t('sources.table.tags')} type="secondary" />
          <div className="u-w-2-half" />
        </ListItem>

        <Divider />

        {sources &&
          sources.map(source => (
            <>
              <SourceItem
                source={source}
                deleteSource={async () => {
                  await deleteSource(client, selectedSubject, source)
                }}
              />
              <Divider />
            </>
          ))}
      </List>
    </>
  )
}

export default SourcesTab
