import { AnimatePresence, motion } from 'motion/react'
import React from 'react'
import { useI18n } from 'twake-i18n'

import { RealTimeQueries, useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { Dialog, ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import DropdownIcon from 'cozy-ui/transpiled/react/Icons/Dropdown'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Menu from 'cozy-ui/transpiled/react/Menu'
import MenuItem from 'cozy-ui/transpiled/react/MenuItem'
import Typography from 'cozy-ui/transpiled/react/Typography'

import NewSubjectDialog from './NewSubjectDialog'

import { useSubject } from '@/context/SubjectContext'
import { deleteSubject } from '@/queries/actions/subjects/deleteSubject'

const SubjectDropdown = ({ ...props }) => {
  const { t } = useI18n()
  const client = useClient()
  const { selectedSubject, setSelectedSubject, subjects } = useSubject()

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [newSubjectDialogOpen, setNewSubjectDialogOpen] = React.useState(false)

  const [aboutToDelete, setAboutToDelete] = React.useState(null)

  const ConfirmDialogActions = () => {
    return (
      <>
        <Button
          variant="secondary"
          label={t('cancel')}
          onClick={() => setAboutToDelete(null)}
        />
        <Button
          color="error"
          label={t('delete')}
          onClick={() => {
            deleteSubject(client, aboutToDelete)
            setAboutToDelete(null)
          }}
        />
      </>
    )
  }

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
        className="u-mt-half"
      >
        {subjects.data?.map(subject => {
          return (
            <SubjectMenuItem
              key={subject.id}
              subject={subject}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              setAboutToDelete={subject => {
                setAboutToDelete(subject)
                setAnchorEl(null)
              }}
              setAnchorEl={setAnchorEl}
            />
          )
        })}

        {subjects.data?.length > 0 && <Divider className="u-mv-half" />}

        <MenuItem
          onClick={() => {
            setNewSubjectDialogOpen(true)
            setAnchorEl(null)
          }}
        >
          <ListItemIcon>
            <Icon icon={PlusIcon} />
          </ListItemIcon>
          <ListItemText primary={t('subjects.new')} />
        </MenuItem>
      </Menu>

      <NewSubjectDialog
        open={newSubjectDialogOpen}
        onClose={() => {
          setNewSubjectDialogOpen(false)
        }}
      />

      <ConfirmDialog
        open={Boolean(aboutToDelete)}
        onClose={() => setAboutToDelete(null)}
        title={t('subjects.delete.title')}
        content={t('subjects.delete.confirm')}
        actions={<ConfirmDialogActions />}
      />
    </>
  )
}

const SubjectMenuItem = ({
  subject,
  selectedSubject,
  setSelectedSubject,
  setAboutToDelete,
  setAnchorEl
}) => {
  const { t } = useI18n()
  const [subMenuEl, setSubMenuEl] = React.useState(null)

  return (
    <>
      <MenuItem
        key={subject.id}
        onClick={() => {
          setSelectedSubject(subject)
          setAnchorEl(null)
        }}
        selected={selectedSubject?.id === subject.id}
      >
        <ListItemText
          primary={subject.title}
          style={{
            maxWidth: 180,
            marginRight: 28
          }}
        />
        <ListItemSecondaryAction>
          <IconButton
            onClick={e => {
              e.stopPropagation()
              setSubMenuEl(e.currentTarget)
            }}
          >
            <Icon icon={DotsIcon} />
          </IconButton>
        </ListItemSecondaryAction>
      </MenuItem>
      <Menu
        open={Boolean(subMenuEl)}
        anchorEl={subMenuEl}
        onClose={() => setSubMenuEl(null)}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        className="u-mt-half"
      >
        <MenuItem
          onClick={() => {
            setAboutToDelete(subject)
            setSubMenuEl(null)
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

export default SubjectDropdown
