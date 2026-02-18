import { ListItem } from '@material-ui/core'
import { Reorder, useDragControls } from 'motion/react'
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
import BurgerIcon from 'cozy-ui/transpiled/react/Icons/Burger'
import List from 'cozy-ui/transpiled/react/List'
import ListSubheader from 'cozy-ui/transpiled/react/ListSubheader'
import TextField from 'cozy-ui/transpiled/react/TextField'

const DraggableAnswerItem = ({
  choice,
  question,
  setQuestionChoices,
  questionChoices,
  setQuestionCorrectId,
  questionCorrectId,
  t
}) => {
  const controls = useDragControls()

  return (
    <Reorder.Item
      value={choice}
      id={choice.id} // Ensure each item has a unique ID
      dragListener={false}
      dragControls={controls}
      style={{ listStyle: 'none', userSelect: 'none' }} // Remove default list styling
    >
      <ListItem component="div">
        <div
          onPointerDown={e => controls.start(e)}
          style={{
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            opacity: 0.5
          }}
        >
          <Icon icon={BurgerIcon} />
        </div>
        {question.interaction && question.interaction === 'choice' && (
          <Checkbox
            checked={questionCorrectId === choice.id}
            onChange={() => setQuestionCorrectId(choice.id)}
          />
        )}
        <TextField
          label={t('questions.table.answer')}
          variant="outlined"
          fullWidth
          value={choice.description}
          onChange={e => {
            const newChoices = [...questionChoices]
            const choiceIndex = newChoices.findIndex(c => c.id === choice.id)
            if (choiceIndex !== -1) {
              newChoices[choiceIndex].description = e.target.value
              setQuestionChoices(newChoices)
            }
          }}
        />
      </ListItem>
    </Reorder.Item>
  )
}

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
    setQuestionChoices(question?.choices || [])
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
      <List
        component={Reorder.Group}
        axis="y"
        values={questionChoices}
        onReorder={setQuestionChoices}
      >
        {questionChoices.map((choice, index) => (
          <DraggableAnswerItem
            key={choice.id || index} // Use unique ID if available
            choice={choice}
            question={question}
            setQuestionChoices={setQuestionChoices}
            questionChoices={questionChoices}
            setQuestionCorrectId={setQuestionCorrectId}
            questionCorrectId={questionCorrectId}
            t={t}
          />
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
