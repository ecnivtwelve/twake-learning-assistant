import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Chip from 'cozy-ui/transpiled/react/Chips'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListSubheader from 'cozy-ui/transpiled/react/ListSubheader'
import Typography from 'cozy-ui/transpiled/react/Typography'

import ActivityIcon from '@/assets/icons/ActivityIcon'
import FilterChip from '@/components/FilterChip/FilterChip'
import TabTitle from '@/components/TabTitle/TabTitle'
import activities from '@/utils/data/activities.json'

const ActivitiesTab = () => {
  const { t } = useI18n()
  const navigate = useNavigate()

  const [filters] = React.useState({
    subjects: {
      label: t('subjects'),
      values: []
    },
    level: {
      label: t('level'),
      values: []
    },
    class: {
      label: t('classes_and_groups'),
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
            onClick={() => navigate('/item/new')}
          />
        }
      >
        <Typography variant="h3">{t('activities')}</Typography>

        <div className="u-flex u-mt-1">
          {Object.entries(filters).map(([key, filter]) => (
            <FilterChip key={key} label={filter.label} />
          ))}
        </div>
      </TabTitle>

      <List subheader={<ListSubheader>Subheader title</ListSubheader>}>
        {activities.map((activity, i) => (
          <ListItem button key={i}>
            <ListItemIcon className="u-w-2-half">
              <ActivityIcon size={32} />
            </ListItemIcon>
            <ListItemText primary={activity.titre} className="u-w-5" />
            <ListItemText
              primary={activity.date}
              className="u-w-1"
              primaryTypographyProps={{ color: 'textSecondary' }}
            />
            <ListItemText
              primary={activity.questions}
              className="u-w-1"
              primaryTypographyProps={{ color: 'textSecondary' }}
            />
            <ListItemText className="u-w-1">
              <Chip label={activity.classe} />
            </ListItemText>
            <ListItemText
              primary={activity.score * 100 + '%'}
              className="u-w-1"
              primaryTypographyProps={{
                style: {
                  color: activity.score < 0.7 ? '#CB8100' : '#09AE1C',
                  fontWeight: 600
                }
              }}
            />
            <ListItemSecondaryAction className="u-pr-1">
              <IconButton>
                <Icon icon={DotsIcon} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default ActivitiesTab
