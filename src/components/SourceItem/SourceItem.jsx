import { AnimatePresence, motion } from 'motion/react'
import React from 'react'
import { formatLocallyDistanceToNow, useI18n } from 'twake-i18n'

import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import SchoolIcon from 'cozy-ui/transpiled/react/Icons/School'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Menu from 'cozy-ui/transpiled/react/Menu'
import MenuItem from 'cozy-ui/transpiled/react/MenuItem'

import TableItemText from '@/components/TableItem/TableItemText'

const SourceItem = ({ source, statusInfo, deleteSource }) => {
  const { t } = useI18n()
  const [menuShown, setMenuShown] = React.useState(false)
  const menuButtonRef = React.useRef(null)

  return (
    <ListItem button>
      <ListItemIcon className="u-w-2-half">
        <Icon icon={SchoolIcon} size={22} />
      </ListItemIcon>
      <TableItemText value={source.description} type="primary" />
      <TableItemText value={source.filename} type="secondary" />
      {source.status ? (
        <TableItemText type="secondary">
          <div className="u-flex u-flex-items-center">
            <div className="u-w-2 u-h-2 u-flex u-flex-items-center u-flex-justify-center">
              {statusInfo[source.status]
                ? statusInfo[source.status].icon
                : null}
            </div>

            <AnimatePresence>
              <motion.div
                key={source.file_id + ':' + source.status}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="u-w-100"
                style={{ position: 'absolute' }}
              >
                <TableItemText
                  value={statusInfo[source.status].label}
                  type="secondary"
                  className="u-ml-2-half u-w-100"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </TableItemText>
      ) : (
        <TableItemText
          value={formatLocallyDistanceToNow(new Date(source.created_at))}
          type="secondary"
        />
      )}
      <TableItemText value={source.author} type="secondary" />
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
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default SourceItem
