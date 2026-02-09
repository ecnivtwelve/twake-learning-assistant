import { AnimatePresence, motion } from 'motion/react'
import React from 'react'
import { formatLocallyDistanceToNow, useI18n } from 'twake-i18n'

import CircularProgress from 'cozy-ui/transpiled/react/CircularProgress'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import FiletypeTextIcon from 'cozy-ui/transpiled/react/Icons/FiletypeText'
import SchoolIcon from 'cozy-ui/transpiled/react/Icons/School'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import InfosBadge from 'cozy-ui/transpiled/react/InfosBadge'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Menu from 'cozy-ui/transpiled/react/Menu'
import MenuItem from 'cozy-ui/transpiled/react/MenuItem'

import TableItemText from '@/components/TableItem/TableItemText'
import { useTaskStatus } from '@/queries/hooks/useTaskStatus'

const SourceItem = ({ source, deleteSource }) => {
  const { t } = useI18n()
  const [menuShown, setMenuShown] = React.useState(false)
  const menuButtonRef = React.useRef(null)

  const processed = useTaskStatus(source)

  return (
    <>
      <ListItem key={source._id}>
        <ListItemIcon className="u-w-2-half">
          {!processed &&
            (source.metadata?.taskId || source.attributes?.metadata?.taskId) ? (
            <InfosBadge badgeContent={<CircularProgress size={16} />}>
              <Icon size={32} icon={FiletypeTextIcon} />
            </InfosBadge>
          ) : (
            <Icon size={32} icon={FiletypeTextIcon} />
          )}
        </ListItemIcon>
        <TableItemText value={source.name} type="primary" />
        <TableItemText
          value={source.metadata?.partitionFileId || ''}
          type="secondary"
        />
        <TableItemText value={source.cozyMetadata.updatedAt} type="secondary" />
        <TableItemText
          value={source.metadata?.partition || ''}
          type="secondary"
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
        </ListItemSecondaryAction>
      </ListItem>

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
        <MenuItem
          onClick={() => {
            deleteSource()
            setMenuShown(false)
          }}
        >
          <ListItemIcon>
            <Icon icon={TrashIcon} />
          </ListItemIcon>
          <ListItemText primary={t('delete')} />
        </MenuItem>
      </Menu>
    </>
  )
}

export default SourceItem
