import React from 'react'
import { useNavigate } from 'react-router-dom'
import { formatLocallyDistanceToNow, useI18n } from 'twake-i18n'

import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Menu from 'cozy-ui/transpiled/react/Menu'
import MenuItem from 'cozy-ui/transpiled/react/MenuItem'

import ActivityIcon from '@/assets/icons/ActivityIcon'

const ActivityItem = ({ activity, deleteActivity }) => {
  const { t } = useI18n()

  const navigate = useNavigate()
  const [menuShown, setMenuShown] = React.useState(false)
  const menuButtonRef = React.useRef(null)

  return (
    <ListItem button onClick={() => navigate(`/item/${activity.id}`)}>
      <ListItemIcon className="u-w-2-half">
        <ActivityIcon size={32} />
      </ListItemIcon>
      <ListItemText
        className="u-w-100"
        primary={
          activity.title?.trim() === ''
            ? t('activity.untitled')
            : activity.title
        }
      />
      <ListItemText
        className="u-w-100"
        secondary={formatLocallyDistanceToNow(
          new Date(activity.cozyMetadata.updatedAt)
        )}
      />
      <ListItemSecondaryAction className="u-pr-1">
        <IconButton
          ref={menuButtonRef}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={() => setMenuShown(!menuShown)}
        >
          <Icon icon={DotsIcon} />
        </IconButton>

        <Menu
          open={menuShown}
          anchorEl={menuButtonRef.current}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          keepMounted
          onClose={() => setMenuShown(false)}
        >
          <MenuItem onClick={() => deleteActivity()}>
            <ListItemIcon>
              <Icon icon={TrashIcon} />
            </ListItemIcon>
            <ListItemText primary={t('delete')} />
          </MenuItem>
        </Menu>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default ActivityItem
