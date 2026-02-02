import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useI18n } from 'twake-i18n'

import { useClient, useQuery } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import { renameActivity } from '../../queries/actions/renameActivity'

import ActivityPreview from '@/components/ActivityPreview/ActivityPreview'
import FilterChip from '@/components/FilterChip/FilterChip'
import TabTitle from '@/components/TabTitle/TabTitle'
import TableItemText from '@/components/TableItem/TableItemText'
import { buildActivityItemQuery } from '@/queries'
import styles from '@/styles/item-view.styl'

const ItemView = () => {
  const { t } = useI18n()
  const client = useClient()
  const { showAlert } = useAlert()
  const location = useLocation()
  const activityId = location.pathname.split('/').pop()

  const activityItemQuery = buildActivityItemQuery(activityId)
  const { data: activity } = useQuery(
    activityItemQuery.definition,
    activityItemQuery.options
  )

  const [activityTitle, setActivityTitle] = useState()

  const titleInputRef = React.useRef()

  useEffect(() => {
    setActivityTitle(activity?.title)
    if (activity?.title.trim() === '') {
      titleInputRef.current.focus()
    }
  }, [activity])

  const [filters] = React.useState({
    subjects: {
      label: t('tags.types'),
      values: []
    },
    level: {
      label: t('tags.sources'),
      values: []
    },
    notion: {
      label: t('tags.notions'),
      values: []
    }
  })

  const [openedQuestion, setOpenedQuestion] = React.useState(null)

  const openQuestion = React.useCallback(
    question => {
      if (question == openedQuestion) {
        setOpenedQuestion(null)
      } else {
        setOpenedQuestion(question)
      }
    },
    [openedQuestion]
  )

  const [selectedQuestions, setSelectedQuestions] = React.useState([])

  return (
    <div className="u-flex u-flex-column u-h-100">
      <TabTitle
        backEnabled
        trailing={
          <Button
            variant="primary"
            label={t('new')}
            startIcon={<Icon icon={PlusIcon} />}
          />
        }
      >
        <input
          className={classNames(
            'MuiTypography-h3 MuiTypography-colorTextPrimary u-p-0',
            styles.itemNameInput
          )}
          ref={titleInputRef}
          type="text"
          placeholder={t('activity.placeholder')}
          value={activityTitle}
          onChange={e => setActivityTitle(e.target.value)}
          onBlur={e =>
            renameActivity(client, t, showAlert, activity, e.target.value)
          }
        />

        <div className="u-flex u-mt-1">
          {Object.entries(filters).map(([key, filter]) => (
            <FilterChip key={key} label={filter.label} />
          ))}
        </div>
      </TabTitle>

      <div className="u-flex u-flex-col u-h-100">
        <List className="u-w-100">
          <ListItem size="small" dense>
            <Checkbox
              checked={selectedQuestions.length > 0}
              mixed={
                selectedQuestions.length > 0 &&
                selectedQuestions.length < activity.length
              }
              onChange={() => {
                if (selectedQuestions.length === activity.length) {
                  setSelectedQuestions([])
                } else {
                  setSelectedQuestions(activity.map(q => q.id))
                }
              }}
            />
            <TableItemText value="Question" type="primary" />
            <TableItemText value="Sources" type="secondary" />
            <TableItemText value="Notions" type="secondary" />
            {selectedQuestions.length === 0 ? (
              <div className="u-w-1-half" />
            ) : (
              <ListItemSecondaryAction className="u-pr-1">
                <IconButton>
                  <Icon icon={DotsIcon} />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListItem>

          <Divider />

          {1 == 2 &&
            activity.map((question, i) => (
              <React.Fragment key={question.id ?? i}>
                <ListItem
                  button
                  onClick={() => openActivity(question)}
                  className={classNames(
                    selectedQuestions.includes(question.id)
                      ? styles.listItemSelected
                      : null
                  )}
                >
                  <Checkbox
                    checked={selectedQuestions.includes(question.id)}
                    onClick={e => e.stopPropagation()}
                    onChange={() => {
                      setSelectedQuestions(
                        selectedQuestions.includes(question.id)
                          ? selectedQuestions.filter(id => id !== question.id)
                          : [...selectedQuestions, question.id]
                      )
                    }}
                  />
                  <TableItemText value={question.question} type="primary" />
                  <TableItemText value={[question.sources]} type="chip" />
                  <TableItemText value={question.notions} type="chip" />
                  <ListItemSecondaryAction className="u-pr-1">
                    <IconButton>
                      <Icon icon={DotsIcon} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
        </List>

        {openedQuestion && <ActivityPreview activity={openedQuestion} />}
      </div>
    </div>
  )
}

export default ItemView
