import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import MenuItem from 'cozy-ui/transpiled/react/MenuItem'
import Typography from 'cozy-ui/transpiled/react/Typography'

import ActivityIcon from '@/assets/icons/ActivityIcon'
import FilterChip from '@/components/FilterChip/FilterChip'
import TabTitle from '@/components/TabTitle/TabTitle'
import TableItemText from '@/components/TableItem/TableItemText'
import activities from '@/utils/data/activities.json'

const ActivitiesTab = () => {
  const { t } = useI18n()
  const navigate = useNavigate()

  const allClasses = [...new Set(activities.map(activity => activity.classe))]
  const [selectedClass, setSelectedClass] = React.useState(null)

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

  const filteredActivities = activities.filter(activity => {
    if (selectedClass) {
      return activity.classe === selectedClass
    }
    return true
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
            <FilterChip
              key={key}
              label={
                key == 'class' && selectedClass ? selectedClass : filter.label
              }
            >
              {key == 'class' &&
                allClasses.map(value => (
                  <MenuItem key={value} onClick={() => setSelectedClass(value)}>
                    <ListItemText primary={value} />
                  </MenuItem>
                ))}
            </FilterChip>
          ))}
        </div>
      </TabTitle>

      <List>
        <ListItem size="small" dense>
          <ListItemIcon className="u-w-2-half"></ListItemIcon>
          <TableItemText value="Entraînements" type="primary" />
          <TableItemText value="Mise à jour" type="secondary" />
          <TableItemText value="Questions" type="secondary" />
          <TableItemText value="Transmis" type="secondary" />
          <TableItemText value="Maîtrise" type="secondary" />
          <div className="u-w-1-half" />
        </ListItem>

        <Divider />

        {filteredActivities.map((activity, i) => (
          <React.Fragment key={i}>
            <ListItem button onClick={() => navigate(`/item/${activity.id}`)}>
              <ListItemIcon className="u-w-2-half">
                <ActivityIcon size={32} />
              </ListItemIcon>
              <TableItemText value={activity.titre} type="primary" />
              <TableItemText value={activity.date} type="secondary" />
              <TableItemText value={activity.questions} type="secondary" />
              <TableItemText value={[activity.classe]} type="chip" />
              <TableItemText
                value={Math.round(activity.score * 100)}
                type="colouredValue"
              />
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

export default ActivitiesTab
