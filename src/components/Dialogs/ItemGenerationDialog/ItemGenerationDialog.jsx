import React, { useMemo, useState } from 'react'
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

import ItemGenerationDialogFields from './ItemGenerationDialogFields'
import {
  DEFAULT_GENERATION_MODE,
  getNumberOfQuestionsOptions
} from './itemGenerationOptions'
import { getQuestionTypes } from '@/consts/questionTypes'

const ItemGenerationDialog = ({
  open,
  onClose,
  onGenerateFlashcards,
  onGenerateMCQs,
  numberOfQuestions,
  setNumberOfQuestions
}) => {
  const { t } = useI18n()
  const modes = useMemo(() => getQuestionTypes(t), [t])
  const numberOfQuestionsOptions = useMemo(
    () => getNumberOfQuestionsOptions(t),
    [t]
  )

  const { dialogProps, dialogTitleProps, dividerProps, dialogActionsProps } =
    useCozyDialog({
      size: 'medium',
      open: open,
      onClose: onClose,
      disableEnforceFocus: true
    })

  const [mode, setMode] = useState(DEFAULT_GENERATION_MODE)

  const handleGenerate = () => {
    onClose()
    if (mode === 'flashcard') {
      onGenerateFlashcards()
      return
    }
    onGenerateMCQs()
  }

  return (
    <Dialog {...dialogProps}>
      <DialogCloseButton onClick={onClose} />
      <DialogTitle {...dialogTitleProps}>
        {t('questions.generation.dialog_title')}
      </DialogTitle>
      <Divider {...dividerProps} />
      <div className="u-m-1">
        <ItemGenerationDialogFields
          numberOfQuestions={numberOfQuestions}
          onChangeNumberOfQuestions={setNumberOfQuestions}
          mode={mode}
          onChangeMode={setMode}
          modes={modes}
          numberOfQuestionsOptions={numberOfQuestionsOptions}
        />
      </div>
      <Divider {...dividerProps} />
      <DialogActions {...dialogActionsProps}>
        <Button variant="secondary" label={t('cancel')} onClick={onClose} />
        <Button
          variant="primary"
          label={t('generate')}
          startIcon={<Icon icon={NewIcon} />}
          onClick={handleGenerate}
        />
      </DialogActions>
    </Dialog>
  )
}

export default ItemGenerationDialog
