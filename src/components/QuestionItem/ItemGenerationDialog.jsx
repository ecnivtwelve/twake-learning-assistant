import React, { useState } from 'react'
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

import { getQuestionTypes } from '@/views/QuestionsTab'

const ItemGenerationDialog = ({
  open,
  onClose,
  onGenerateFlashcards,
  onGenerateMCQs,
  numberOfQuestions,
  setNumberOfQuestions
}) => {
  const { t } = useI18n()
  const modes = getQuestionTypes(t)
  const numberOfQuestionsOptions = [
    { value: 5, label: t('questions.generation.count_option', { count: 5 }) },
    {
      value: 10,
      label: t('questions.generation.count_option', { count: 10 })
    },
    {
      value: 15,
      label: t('questions.generation.count_option', { count: 15 })
    },
    {
      value: 20,
      label: t('questions.generation.count_option', { count: 20 })
    }
  ]

  const { dialogProps, dialogTitleProps, dividerProps, dialogActionsProps } =
    useCozyDialog({
      size: 'medium',
      open: open,
      onClose: onClose,
      disableEnforceFocus: true
    })

  const [mode, setMode] = useState('choice')

  return (
    <Dialog {...dialogProps}>
      <DialogCloseButton onClick={onClose} />
      <DialogTitle {...dialogTitleProps}>
        {t('questions.generation.dialog_title')}
      </DialogTitle>
      <Divider {...dividerProps} />
      <div className="u-m-1">
        <TextField
          select
          options={numberOfQuestionsOptions}
          value={numberOfQuestions}
          onChange={e => setNumberOfQuestions(e.target.value)}
          label={t('questions.generation.count_label')}
          variant="outlined"
          fullWidth
        >
          {numberOfQuestionsOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          options={modes}
          value={mode}
          onChange={e => setMode(e.target.value)}
          label={t('questions.generation.type_label')}
          variant="outlined"
          fullWidth
          className="u-mt-1"
        >
          {modes.map(option => (
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
            if (mode === 'flashcard') {
              onGenerateFlashcards()
            } else {
              onGenerateMCQs()
            }
          }}
        />
      </DialogActions>
    </Dialog>
  )
}

export default ItemGenerationDialog
