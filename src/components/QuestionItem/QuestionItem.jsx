import classNames from 'classnames'
import React from 'react'
import { useI18n } from 'twake-i18n'

import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import PenIcon from 'cozy-ui/transpiled/react/Icons/Pen'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Menu from 'cozy-ui/transpiled/react/Menu'
import MenuItem from 'cozy-ui/transpiled/react/MenuItem'
import Paper from 'cozy-ui/transpiled/react/Paper'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Chip from 'cozy-ui/transpiled/react/Chips'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FiletypeTextIcon from 'cozy-ui/transpiled/react/Icons/FiletypeText'

import TableItemText from '@/components/TableItem/TableItemText'
import styles from '@/styles/item-view.styl'

const QuestionItem = ({
  id,
  question,
  selectedQuestions,
  setSelectedQuestions,
  detachQuestion,
  deleteQuestion,
  editQuestion,
  onOpen,
  isOpened,
  card,
  isPresent,
  showSources
}) => {
  const { t } = useI18n()
  const [menuShown, setMenuShown] = React.useState(false)
  const menuButtonRef = React.useRef(null)

  const selectQuestion = () => {
    setSelectedQuestions(
      selectedQuestions.includes(question._id)
        ? selectedQuestions.filter(id => id !== question._id)
        : [...selectedQuestions, question._id]
    )
  }

  if (card) {
    return (
      <Paper
        id={id}
        className="u-p-1"
        onClick={!isPresent && selectQuestion}
        button
        style={{
          outline: selectedQuestions.includes(question._id)
            ? '2px solid var(--primaryColor)'
            : 'none',
          cursor: isPresent ? 'default' : 'pointer',
          background: selectedQuestions.includes(question._id)
            ? 'var(--secondaryBackground)'
            : undefined,
          opacity: isPresent ? 0.5 : 1
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h5" color="textPrimary" style={{ flex: 1 }}>
            {question.label}
          </Typography>
          <Checkbox
            checked={selectedQuestions.includes(question._id)}
            onClick={e => e.stopPropagation()}
            onChange={selectQuestion}
            className="u-p-0 u-ml-1"
          />
        </div>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          className="u-mt-1"
        >
          {question.choices[0]?.description ?? ''}
        </Typography>
      </Paper>
    )
  }

  return (
    <ListItem
      id={id}
      disableRipple
      disabled={isPresent}
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
        onChange={selectQuestion}
      />
      <TableItemText type="primary" value={question.label} />
      {showSources && (
        question.sources ? (
          <ListItemText className='u-w-1 u-w-half-s'>
            <div className='u-w-100 u-flex-row u-flex' style={{
              maskImage: "linear-gradient(to right, black 70%, transparent 100%)",
              pointerEvents: "none"
            }}>
              {question.sources?.data?.map(source => (
                <Chip
                  key={source.id}
                  label={source.name}
                  icon={<Icon className={"u-ml-half"} icon={FiletypeTextIcon} />}
                  variant="outlined"
                  className="u-mr-half"
                />
              ))}
            </div>
          </ListItemText>
        ) : (
          <ListItemText className='u-w-1 u-w-half-s' secondary={t('questions.noSource')} />
        )
      )}
      <TableItemText
        value={question.choices[0]?.description ?? ''}
        type="secondary"
      />

      {(detachQuestion || deleteQuestion) && (
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
            {editQuestion && (
              <MenuItem
                onClick={() => {
                  editQuestion()
                  setMenuShown(false)
                }}
              >
                <ListItemIcon>
                  <Icon icon={PenIcon} />
                </ListItemIcon>
                <ListItemText primary={t('edit')} />
              </MenuItem>
            )}
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
                  primary={<Typography color="error">{t('delete')}</Typography>}
                />
              </MenuItem>
            )}
          </Menu>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  )
}

export default QuestionItem
