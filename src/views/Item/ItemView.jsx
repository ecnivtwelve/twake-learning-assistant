import classNames from 'classnames'
import React from 'react'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import HelpIcon from 'cozy-ui/transpiled/react/Icons/HelpOutlined'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'

import ActivityPreview from '@/components/ActivityPreview/ActivityPreview'
import FilterChip from '@/components/FilterChip/FilterChip'
import TabTitle from '@/components/TabTitle/TabTitle'
import TableItemText from '@/components/TableItem/TableItemText'
import styles from '@/styles/item-view.styl'
import item from '@/utils/data/item.json'

const ItemView = () => {
  const { t } = useI18n()

  const [activityName, setActivityName] = React.useState(t('activity.title'))
  const [selectedActivity, setSelectedActivity] = React.useState(null)

  const activity = React.useMemo(() => item, [])

  const [filters] = React.useState({
    subjects: {
      label: t('tags.types'),
      values: []
    },
    level: {
      label: t('sources'),
      values: []
    },
    notion: {
      label: t('tags.notions'),
      values: []
    }
  })

  const openActivity = React.useCallback(
    activity => {
      if (activity == selectedActivity) {
        setSelectedActivity(null)
      } else {
        setSelectedActivity(activity)
      }
    },
    [selectedActivity]
  )

  return (
    <div className="u-flex u-flex-column u-h-100">
      <TabTitle
        backEnabled
        trailing={
          <Button
            variant="primary"
            label={t('new')}
            startIcon={<Icon icon={PlusIcon} />}
          />
        }
      >
        <input
          className={classNames(
            'MuiTypography-h3 MuiTypography-colorTextPrimary u-p-0',
            styles.itemNameInput
          )}
          type="text"
          placeholder={t('activity_tab.placeholder')}
          value={activityName}
          onChange={e => setActivityName(e.target.value)}
        />

        <div className="u-flex u-mt-1">
          {Object.entries(filters).map(([key, filter]) => (
            <FilterChip key={key} label={filter.label} />
          ))}
        </div>
      </TabTitle>

      <Divider />

      <div className="u-flex u-flex-col u-h-100">
        <List className="u-w-100">
          <ListItem size="small" dense>
            <ListItemIcon className="u-w-2-half"></ListItemIcon>
            <TableItemText value="Question" type="primary" />
            <TableItemText value="Sources" type="secondary" />
            <TableItemText value="Notions" type="secondary" />
            <div className="u-w-1-half" />
          </ListItem>

          <Divider />

          {activity.map((source, i) => (
            <React.Fragment key={source.id ?? i}>
              <ListItem button onClick={() => openActivity(source)}>
                <ListItemIcon className="u-w-2-half">
                  <Icon icon={HelpIcon} size={22} />
                </ListItemIcon>
                <TableItemText value={source.question} type="primary" />
                <TableItemText value={[source.sources]} type="chip" />
                <TableItemText value={source.notions} type="chip" />
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

        {selectedActivity && <ActivityPreview activity={selectedActivity} />}
      </div>
    </div>
  )
}

export default ItemView
