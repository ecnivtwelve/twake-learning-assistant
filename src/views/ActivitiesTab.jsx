import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from 'twake-i18n'

import { useClient, RealTimeQueries, useQuery } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import MenuItem from 'cozy-ui/transpiled/react/MenuItem'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import ActivityItem from '../components/ActivityItem/ActivityItem'
import { deleteActivity } from '../queries/actions/deleteActivity'
import { newActivity } from '../queries/actions/newActivity'

import ActivityIcon from '@/assets/icons/ActivityIcon'
import FilterChip from '@/components/FilterChip/FilterChip'
import TabTitle from '@/components/TabTitle/TabTitle'
import TableItemText from '@/components/TableItem/TableItemText'
import { buildActivitiesQuery } from '@/queries'

const ActivitiesTab = () => {
  const { t } = useI18n()
  const client = useClient()
  const navigate = useNavigate()
  const { showAlert } = useAlert()

  const activitiesQuery = buildActivitiesQuery()
  const { data: activities, fetchState } = useQuery(
    activitiesQuery.definition,
    activitiesQuery.options
  )

  const [filters, setFilters] = React.useState({
    subjects: {
      label: t('tags.subjects'),
      values: []
    },
    level: {
      label: t('tags.level'),
      values: []
    },
    class: {
      label: t('tags.classes_and_groups'),
      values: useMemo(
        () => [...new Set(activities?.map(activity => activity.classe))],
        [activities]
      ),
      selected: null
    }
  })

  const filteredActivities =
    activities?.length > 0 &&
    activities.filter(activity => {
      if (filters.class.selected) {
        return activity.classe === filters.class.selected
      }
      return true
    })

  const selectClass = React.useCallback(value => {
    setFilters(prev => ({
      ...prev,
      class: {
        ...prev.class,
        selected: prev.class.selected === value ? null : value
      }
    }))
  }, [])

  return (
    <>
      <RealTimeQueries doctype="io.cozy.learnings" />

      <TabTitle
        trailing={
          <Button
            variant="primary"
            label={t('new')}
            startIcon={<Icon icon={PlusIcon} />}
            onClick={() => newActivity(client, t, showAlert, navigate)}
          />
        }
      >
        <Typography variant="h3">{t('activities.title')}</Typography>

        <div className="u-flex u-mt-1">
          {Object.entries(filters).map(([key, filter]) => (
            <FilterChip
              key={key}
              label={
                key == 'class' && filter.selected
                  ? filter.selected
                  : filter.label
              }
            >
              {key == 'class' && filter.values.length > 0 ? (
                filter.values.map(value => (
                  <MenuItem key={value} onClick={() => selectClass(value)}>
                    <ListItemText primary={value} />
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  <ListItemText primary={t('activities.table.empty')} />
                </MenuItem>
              )}
            </FilterChip>
          ))}
        </div>
      </TabTitle>

      {filteredActivities && (
        <List>
          <ListItem size="small" dense>
            <ListItemIcon className="u-w-2-half"></ListItemIcon>
            <TableItemText
              value={t('activities.table.activities')}
              type="primary"
            />
            <TableItemText
              value={t('activities.table.update')}
              type="secondary"
            />
            <TableItemText
              value={t('activities.table.questions')}
              type="secondary"
            />
            <TableItemText
              value={t('activities.table.classes')}
              type="secondary"
            />
            <TableItemText
              value={t('activities.table.level')}
              type="secondary"
            />
            <div className="u-w-1-half" />
          </ListItem>

          <Divider />

          {filteredActivities.map((activity, i) => (
            <React.Fragment key={activity._id ?? i}>
              <ActivityItem
                activity={activity}
                deleteActivity={() =>
                  deleteActivity(client, t, showAlert, activity)
                }
              />
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}

      {activities?.length === 0 && fetchState === 'loaded' && (
        <Empty
          icon={<ActivityIcon size={96} />}
          title={t('activities.empty.title')}
          text={t('activities.empty.message')}
          centered
        >
          <Button
            variant="primary"
            label={t('new')}
            startIcon={<Icon icon={PlusIcon} />}
            onClick={() => newActivity(client, t, showAlert, navigate)}
            className="u-mt-1"
          />
        </Empty>
      )}
    </>
  )
}

export default ActivitiesTab
