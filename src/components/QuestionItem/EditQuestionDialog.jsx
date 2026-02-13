import React, { useEffect, useState } from 'react'
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
import NewIcon from 'cozy-ui/transpiled/react/Icons/New'
import MenuItem from 'cozy-ui/transpiled/react/MenuItem'
import TextField from 'cozy-ui/transpiled/react/TextField'

const EditQuestionDialog = ({ open, onClose, question }) => {
  const { t } = useI18n()
  const client = useClient()

  const saveAndClose = async () => {
    await onSave()
    onClose()
  }

  const { dialogProps, dialogTitleProps, dividerProps, dialogActionsProps } =
    useCozyDialog({
      size: 'medium',
      open: open,
      onClose: saveAndClose,
      disableEnforceFocus: true
    })

  const [questionTitle, setQuestionTitle] = useState('')
  const [questionAnswer, setQuestionAnswer] = useState('')
  const [questionHint, setQuestionHint] = useState('')

  useEffect(() => {
    setQuestionTitle(question?.label)
    setQuestionAnswer(question?.choices[0]?.description)
    setQuestionHint(question?.hint)
  }, [question])

  const onSave = async () => {
    await client.save({
      ...question,
      label: questionTitle,
      choices: [
        {
          description: questionAnswer
        }
      ],
      hint: questionHint
    })
  }

  return (
    <Dialog {...dialogProps}>
      <DialogCloseButton onClick={onClose} />
      <DialogTitle {...dialogTitleProps}>{t('questions.edit')}</DialogTitle>
      <Divider {...dividerProps} />
      <div className="u-m-1">
        <TextField
          label={t('questions.table.title')}
          variant="outlined"
          fullWidth
          value={questionTitle}
          onChange={e => setQuestionTitle(e.target.value)}
        />

        <TextField
          label={t('questions.table.answer')}
          variant="outlined"
          fullWidth
          value={questionAnswer}
          onChange={e => setQuestionAnswer(e.target.value)}
          className="u-mt-1"
        />

        <TextField
          label={t('questions.table.hint')}
          variant="outlined"
          fullWidth
          value={questionHint}
          onChange={e => setQuestionHint(e.target.value)}
          className="u-mt-1"
        />
      </div>
      <Divider {...dividerProps} />
      <DialogActions {...dialogActionsProps}>
        <Button variant="secondary" label={t('cancel')} onClick={onClose} />
        <Button variant="primary" label={t('save')} onClick={saveAndClose} />
      </DialogActions>
    </Dialog>
  )
}

export default EditQuestionDialog
