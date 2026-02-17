import { ListItem } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
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
import List from 'cozy-ui/transpiled/react/List'
import ListSubheader from 'cozy-ui/transpiled/react/ListSubheader'
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
  const [questionChoices, setQuestionChoices] = useState([])
  const [questionHint, setQuestionHint] = useState('')
  const [questionCorrectId, setQuestionCorrectId] = useState('')

  useEffect(() => {
    setQuestionTitle(question?.label)
    setQuestionChoices(question?.choices)
    setQuestionHint(question?.hint)
    setQuestionCorrectId(question?.correct)
  }, [question])

  const onSave = async () => {
    await client.save({
      ...question,
      label: questionTitle,
      choices: questionChoices,
      hint: questionHint,
      correct: questionCorrectId
    })
  }

  if (!question) return null

  return (
    <Dialog {...dialogProps}>
      <DialogCloseButton onClick={onClose} />
      <DialogTitle {...dialogTitleProps}>{t('questions.edit')}</DialogTitle>
      <Divider {...dividerProps} />

      <ListSubheader>Informations</ListSubheader>
      <List>
        <ListItem>
          <TextField
            label={t('questions.table.title')}
            variant="outlined"
            fullWidth
            value={questionTitle}
            onChange={e => setQuestionTitle(e.target.value)}
          />
        </ListItem>
      </List>

      <ListSubheader>Réponses</ListSubheader>
      <List>
        {questionChoices &&
          questionChoices.map((choice, index) => (
            <ListItem key={index}>
              {question.interaction && question.interaction === 'choice' && (
                <Checkbox
                  checked={questionCorrectId === choice.id}
                  onChange={e => setQuestionCorrectId(choice.id)}
                />
              )}
              <TextField
                label={t('questions.table.answer')}
                variant="outlined"
                fullWidth
                value={choice.description}
                onChange={e => {
                  const newChoices = [...questionChoices]
                  newChoices[index].description = e.target.value
                  setQuestionChoices(newChoices)
                }}
              />
            </ListItem>
          ))}
      </List>

      <ListSubheader>Indice</ListSubheader>
      <List>
        <ListItem>
          <TextField
            label={t('questions.table.hint')}
            variant="outlined"
            fullWidth
            value={questionHint}
            onChange={e => setQuestionHint(e.target.value)}
          />
        </ListItem>
      </List>
      <Divider {...dividerProps} />
      <DialogActions {...dialogActionsProps}>
        <Button variant="secondary" label={t('cancel')} onClick={onClose} />
        <Button variant="primary" label={t('save')} onClick={saveAndClose} />
      </DialogActions>
    </Dialog>
  )
}

export default EditQuestionDialog
