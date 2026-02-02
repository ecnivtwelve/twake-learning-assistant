import React from 'react'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import SchoolIcon from 'cozy-ui/transpiled/react/Icons/School'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import Typography from 'cozy-ui/transpiled/react/Typography'

import FilterChip from '@/components/FilterChip/FilterChip'
import TabTitle from '@/components/TabTitle/TabTitle'
import TableItemText from '@/components/TableItem/TableItemText'
import sources from '@/utils/data/sources.json'

const SourcesTab = () => {
  const { t } = useI18n()

  const [filters] = React.useState({
    types: {
      label: t('tags.types'),
      values: []
    },
    level: {
      label: t('tags.level'),
      values: []
    },
    tags: {
      label: t('tags.tags'),
      values: []
    }
  })

  return (
    <>
      <TabTitle
        trailing={
          <Button
            variant="primary"
            label={t('new')}
            startIcon={<Icon icon={PlusIcon} />}
          />
        }
      >
        <Typography variant="h3">{t('sources.title')}</Typography>

        <div className="u-flex u-mt-1">
          {Object.entries(filters).map(([key, filter]) => (
            <FilterChip key={key} label={filter.label} />
          ))}
        </div>
      </TabTitle>

      <List>
        <ListItem size="small" dense>
          <ListItemIcon className="u-w-2-half"></ListItemIcon>
          <TableItemText value={t('sources.table.name')} type="primary" />
          <TableItemText value={t('sources.table.update')} type="secondary" />
          <TableItemText value={t('sources.table.tags')} type="secondary" />
          <div className="u-w-1-half" />
        </ListItem>

        <Divider />

        {sources.map((source, i) => (
          <React.Fragment key={i}>
            <ListItem button>
              <ListItemIcon className="u-w-2-half">
                <Icon icon={SchoolIcon} size={22} />
              </ListItemIcon>
              <TableItemText value={source.nom} type="primary" />
              <TableItemText value={source.mise_a_jour} type="secondary" />
              <TableItemText value={source.tags} type="chip" />
              <ListItemSecondaryAction className="u-pr-1">
                <IconButton>
                  <Icon icon={DotsIcon} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </>
  )
}

export default SourcesTab
