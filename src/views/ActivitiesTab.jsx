import React, { useEffect } from 'react'
import { useI18n } from 'twake-i18n'

import { RealTimeQueries, useClient, useQuery } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import ActivityItem from '@/components/ActivityItem/ActivityItem'
import SubjectDropdown from '@/components/Subjects/SubjectDropdown'
import TabTitle from '@/components/TabTitle/TabTitle'
import { useSubject } from '@/context/SubjectContext'
import { buildActivitiesQuery } from '@/queries'
import { deleteActivity } from '@/queries/actions/activities/deleteActivity'
import { newActivity } from '@/queries/actions/activities/newActivity'
import { useNavigate } from 'react-router-dom'

const ActivitiesTab = () => {
  const { t } = useI18n()
  const client = useClient()
  const navigate = useNavigate()

  const { selectedSubject } = useSubject()
  const activities = selectedSubject?.activities.data

  return (
    <>
      <RealTimeQueries doctype="io.cozy.learnings" />

      <TabTitle
        trailing={
          <Button
            variant="primary"
            label={t('new')}
            startIcon={<Icon icon={PlusIcon} />}
            disabled={!selectedSubject}
            onClick={() => {
              newActivity(client, selectedSubject)
              setTimeout(() => {
                navigate(`/item/${selectedSubject._id}`)
              }, 100)
            }}
          />
        }
      >
        <SubjectDropdown />
      </TabTitle>

      <List>
        <ListItem dense size="small">
          <ListItemIcon className="u-w-2-half" />
          <ListItemText primary="Nom" />
          <ListItemText secondary="Date" />
          <div className="u-w-half" />
        </ListItem>
        <Divider />
        <div>
          {activities &&
            activities.map(activity => (
              <>
                <ActivityItem
                  key={activity._id}
                  activity={activity}
                  deleteActivity={() => deleteActivity(client, activity)}
                />
                <Divider />
              </>
            ))}
        </div>
      </List>
    </>
  )
}

export default ActivitiesTab
