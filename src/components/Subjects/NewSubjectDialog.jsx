import React from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import {
  DialogCloseButton,
  useCozyDialog
} from 'cozy-ui/transpiled/react/CozyDialogs'
import Dialog, {
  DialogTitle,
  DialogActions
} from 'cozy-ui/transpiled/react/Dialog'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import TextField from 'cozy-ui/transpiled/react/TextField'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import { newSubject } from '@/queries/actions/subjects/newSubject'

const NewSubjectDialog = ({ open, onClose }) => {
  const { t } = useI18n()
  const client = useClient()
  const { showAlert } = useAlert()

  const subjectInputRef = React.useRef(null)
  const [subjectName, setSubjectName] = React.useState('')

  const { dialogProps, dialogTitleProps, dividerProps, dialogActionsProps } =
    useCozyDialog({
      size: 'medium',
      open: open,
      onClose: onClose,
      disableEnforceFocus: true
    })

  const saveSubject = async () => {
    await newSubject(client, subjectName)
      .then(() => {
        showAlert({
          message: t('subjects.alerts.created'),
          severity: 'success'
        })
        onClose()
        return true
      })
      .catch(() => {
        showAlert({
          message: t('subjects.alerts.error'),
          severity: 'error'
        })
        return false
      })
  }

  return (
    <Dialog {...dialogProps}>
      <DialogCloseButton onClick={onClose} />
      <DialogTitle {...dialogTitleProps}>{t('subjects.new')}</DialogTitle>
      <Divider {...dividerProps} />
      <div className="u-m-1-half">
        <TextField
          ref={subjectInputRef}
          value={subjectName}
          onChange={e => setSubjectName(e.target.value)}
          fullWidth
          autoFocus
          variant="outlined"
          label={t('subjects.input.name.label')}
          placeholder={t('subjects.input.name.placeholder')}
        />
      </div>
      <Divider {...dividerProps} />
      <DialogActions {...dialogActionsProps}>
        <Button variant="secondary" label={t('cancel')} onClick={onClose} />
        <Button
          variant="primary"
          label={t('add')}
          startIcon={<Icon icon={PlusIcon} />}
          onClick={() => {
            saveSubject()
          }}
          className="u-ml-half"
        />
      </DialogActions>
    </Dialog>
  )
}

export default NewSubjectDialog
