import classNames from 'classnames'
import React from 'react'
import { useI18n } from 'twake-i18n'

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

import TableItemText from '@/components/TableItem/TableItemText'
import styles from '@/styles/item-view.styl'

const QuestionItem = ({
  question,
  selectedQuestions,
  setSelectedQuestions,
  deleteQuestion
}) => {
  const { t } = useI18n()
  const [menuShown, setMenuShown] = React.useState(false)
  const menuButtonRef = React.useRef(null)

  return (
    <ListItem
      disableRipple
      button
      onClick={() => {
        return
      }}
      className={classNames(
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
      <TableItemText value={question.label} type="primary" />
      <TableItemText value={[]} type="chip" />
      <TableItemText value={[]} type="chip" />
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
          <MenuItem onClick={() => deleteQuestion()}>
            <ListItemIcon>
              <Icon icon={TrashIcon} />
            </ListItemIcon>
            <ListItemText primary={t('delete')} />
          </MenuItem>
        </Menu>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default QuestionItem
