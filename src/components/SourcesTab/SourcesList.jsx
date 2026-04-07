import React from 'react'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'

import SourceIcon from '@/assets/icons/SourceIcon'
import SourceItem from '@/components/SourceItem/SourceItem'
import TableItemText from '@/components/TableItem/TableItemText'

const SourcesList = ({
  sources,
  onOpenImportDialog,
  onDeleteSource,
  onOpenSource
}) => {
  const { t } = useI18n()

  return (
    <List>
      <ListItem size="small" dense>
        <ListItemIcon className="u-w-2-half"></ListItemIcon>
        <TableItemText value={t('sources.table.name')} type="primary" />
        <TableItemText value={t('sources.table.addedAt')} type="secondary" />
        <div className="u-w-1-half" />
      </ListItem>

      <Divider />

      {sources &&
        sources.map(source => (
          <React.Fragment key={source._id}>
            <SourceItem
              source={source}
              deleteSource={() => onDeleteSource(source)}
              onOpen={() => onOpenSource(source)}
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
            onClick={onOpenImportDialog}
            className="u-mt-1"
          />
        </Empty>
      )}
    </List>
  )
}

export default SourcesList
