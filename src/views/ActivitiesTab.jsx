import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import ActivityIcon from '@/assets/icons/ActivityIcon'
import ActivityItem from '@/components/ActivityItem/ActivityItem'
import PageLayout from '@/components/PageLayout/PageLayout'
import { useSubject } from '@/context/SubjectContext'
import { deleteActivity } from '@/queries/actions/activities/deleteActivity'
import { newActivity } from '@/queries/actions/activities/newActivity'

const ActivitiesTab = () => {
  const { t } = useI18n()
  const client = useClient()
  const navigate = useNavigate()

  const { selectedSubject } = useSubject()
  const activities = selectedSubject?.activities.data

  return (
    <PageLayout
      trailing={
        <Button
          variant="primary"
          label={t('new')}
          startIcon={<Icon icon={PlusIcon} />}
          disabled={!selectedSubject}
          onClick={async () => {
            const activity = await newActivity(client, selectedSubject)
            if (activity) {
              navigate(`/item/${activity._id}`)
            }
          }}
        />
      }
    >
      <List>
        <ListItem dense size="small">
          <ListItemIcon className="u-w-2-half" />
          <ListItemText primary="Nom" />
          <ListItemText secondary="Date" />
          <div className="u-w-3 u-mr-half" />
        </ListItem>
        <Divider />
        <div>
          {activities &&
            activities.map(activity => (
              <React.Fragment key={activity._id}>
                <ActivityItem
                  activity={activity}
                  deleteActivity={() => deleteActivity(client, activity)}
                />
                <Divider />
              </React.Fragment>
            ))}

          {activities && activities.length === 0 && (
            <Empty
              icon={<ActivityIcon size={96} />}
              title={t('activities.empty.title')}
              text={t('activities.empty.message')}
              centered
            >
              <Button
                variant="primary"
                label={t('activities.empty.select')}
                startIcon={<Icon icon={PlusIcon} />}
                onClick={async () => {
                  const activity = await newActivity(client, selectedSubject)
                  if (activity) {
                    navigate(`/item/${activity._id}`)
                  }
                }}
                className="u-mt-1"
              />
            </Empty>
          )}
        </div>
      </List>
    </PageLayout>
  )
}

export default ActivitiesTab
