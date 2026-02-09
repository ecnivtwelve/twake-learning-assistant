import classNames from 'classnames'
import React, { useState } from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Menu from 'cozy-ui/transpiled/react/Menu'
import MenuItem from 'cozy-ui/transpiled/react/MenuItem'
import Typography from 'cozy-ui/transpiled/react/Typography'

import TableItemText from '@/components/TableItem/TableItemText'
import { renameQuestion } from '@/queries/actions/questions/renameQuestion'
import styles from '@/styles/item-view.styl'

const QuestionItem = ({
  question,
  autoFocus,
  selectedQuestions,
  setSelectedQuestions,
  detachQuestion,
  deleteQuestion,
  onOpen,
  isOpened
}) => {
  const { t } = useI18n()
  const client = useClient()
  const [menuShown, setMenuShown] = React.useState(false)
  const menuButtonRef = React.useRef(null)
  const inputRef = React.useRef(null)

  const [questionLabel, setQuestionLabel] = useState(question.label)

  React.useEffect(() => {
    if (autoFocus && isOpened && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [autoFocus, isOpened])

  const changeLabel = label => {
    if (label.trim() === '') {
      deleteQuestion()
      return
    }

    renameQuestion(client, question, label)
  }

  return (
    <ListItem
      disableRipple
      button
      onClick={() => {
        onOpen(question)
      }}
      className={classNames(
        isOpened ? styles.listItemOpened : null,
        selectedQuestions.includes(question._id)
          ? styles.listItemSelected
          : null
      )}
    >
      <Checkbox
        checked={selectedQuestions.includes(question._id)}
        onClick={e => e.stopPropagation()}
        onChange={() => {
          setSelectedQuestions(
            selectedQuestions.includes(question._id)
              ? selectedQuestions.filter(id => id !== question._id)
              : [...selectedQuestions, question._id]
          )
        }}
      />
      <TableItemText type="primary">
        <input
          ref={inputRef}
          value={questionLabel}
          disabled={!isOpened}
          onChange={e => setQuestionLabel(e.target.value)}
          onBlur={() => changeLabel(questionLabel)}
          placeholder={t('questions.placeholder')}
          className={classNames(
            'MuiListItemText-primary MuiTypography-body1 u-w-100',
            styles.itemNameInput,
            !isOpened ? styles.itemNameInputDisabled : null
          )}
          onClick={e => e.stopPropagation()}
        />
      </TableItemText>
      <TableItemText
        value={question.choices[0]?.description ?? ''}
        type="secondary"
      />
      <TableItemText value={question.hint ?? ''} type="secondary" />

      {detachQuestion ||
        (deleteQuestion && (
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
              {detachQuestion && (
                <MenuItem onClick={() => detachQuestion()}>
                  <ListItemIcon>
                    <Icon icon={TrashIcon} />
                  </ListItemIcon>
                  <ListItemText primary={t('detach')} />
                </MenuItem>
              )}
              {deleteQuestion && (
                <MenuItem onClick={() => deleteQuestion()}>
                  <ListItemIcon>
                    <Typography color="error">
                      <Icon icon={TrashIcon} />
                    </Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography color="error">{t('delete')}</Typography>
                    }
                  />
                </MenuItem>
              )}
            </Menu>
          </ListItemSecondaryAction>
        ))}
    </ListItem>
  )
}

export default QuestionItem
