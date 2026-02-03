import React from 'react'
import { useI18n } from 'twake-i18n'

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
import NewIcon from 'cozy-ui/transpiled/react/Icons/New'
import MenuItem from 'cozy-ui/transpiled/react/MenuItem'
import TextField from 'cozy-ui/transpiled/react/TextField'

const ItemGenerationDialog = ({
  open,
  onClose,
  onGenerate,
  numberOfQuestions,
  setNumberOfQuestions
}) => {
  const { t } = useI18n()
  const numberOfQuestionsOptions = [
    { value: 5, label: '5 questions' },
    { value: 10, label: '10 questions' },
    { value: 15, label: '15 questions' },
    { value: 20, label: '20 questions' }
  ]

  const { dialogProps, dialogTitleProps, dividerProps, dialogActionsProps } =
    useCozyDialog({
      size: 'medium',
      open: open,
      onClose: onClose,
      disableEnforceFocus: true
    })

  return (
    <Dialog {...dialogProps}>
      <DialogCloseButton onClick={onClose} />
      <DialogTitle {...dialogTitleProps}>Générer des questions</DialogTitle>
      <Divider {...dividerProps} />
      <div className="u-m-1">
        <TextField
          select
          options={numberOfQuestionsOptions}
          value={numberOfQuestions}
          onChange={e => setNumberOfQuestions(e.target.value)}
          label="Nombre de questions"
          variant="outlined"
          fullWidth
        >
          {numberOfQuestionsOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <Divider {...dividerProps} />
      <DialogActions {...dialogActionsProps}>
        <Button variant="secondary" label={t('cancel')} onClick={onClose} />
        <Button
          variant="primary"
          label={t('generate')}
          startIcon={<Icon icon={NewIcon} />}
          onClick={() => {
            onClose()
            onGenerate()
          }}
        />
      </DialogActions>
    </Dialog>
  )
}

export default ItemGenerationDialog
