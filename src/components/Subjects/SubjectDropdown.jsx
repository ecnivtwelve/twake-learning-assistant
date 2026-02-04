import { AnimatePresence, motion } from 'motion/react'
import React from 'react'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DropdownIcon from 'cozy-ui/transpiled/react/Icons/Dropdown'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Menu from 'cozy-ui/transpiled/react/Menu'
import MenuItem from 'cozy-ui/transpiled/react/MenuItem'
import Typography from 'cozy-ui/transpiled/react/Typography'

import NewSubjectDialog from './NewSubjectDialog'

import { useSubject } from '@/context/SubjectContext'

const SubjectDropdown = ({ ...props }) => {
  const { t } = useI18n()
  const { selectedSubject, setSelectedSubject, subjects } = useSubject()

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [newSubjectDialogOpen, setNewSubjectDialogOpen] = React.useState(false)

  return (
    <>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={event => setAnchorEl(event.currentTarget)}
        {...props}
        variant="text"
        color="text"
        label={
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selectedSubject?.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.3, ease: [0.3, 0, 0, 1] }
              }}
              exit={{
                opacity: 0,
                y: -10,
                transition: { duration: 0.2, ease: [0, 0, 1, 0] }
              }}
              layout
              className="u-flex u-flex-items-center"
            >
              <Typography
                variant="h3"
                style={{
                  opacity: selectedSubject?.title ? 1 : 0.5
                }}
              >
                {selectedSubject?.title || t('subjects.select')}
              </Typography>

              <Icon icon={DropdownIcon} className="u-ml-half" />
            </motion.div>
          </AnimatePresence>
        }
      />

      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        {subjects.data?.map(subject => (
          <MenuItem
            key={subject.id}
            onClick={() => {
              setSelectedSubject(subject)
              setAnchorEl(null)
            }}
            selected={selectedSubject?.id === subject.id}
          >
            <ListItemText primary={subject.title} />
          </MenuItem>
        ))}

        {subjects.data?.length > 0 && <Divider />}

        <MenuItem onClick={() => setNewSubjectDialogOpen(true)}>
          <ListItemIcon>
            <Icon icon={PlusIcon} />
          </ListItemIcon>
          <ListItemText primary={t('subjects.new')} />
        </MenuItem>
      </Menu>

      <NewSubjectDialog
        open={newSubjectDialogOpen}
        onClose={() => setNewSubjectDialogOpen(false)}
      />
    </>
  )
}

export default SubjectDropdown
