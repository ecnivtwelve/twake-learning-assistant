import classNames from 'classnames'
import { AnimatePresence, motion, stagger } from 'motion/react'
import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useI18n } from 'twake-i18n'

import { useClient, useQuery } from 'cozy-client'
import log from 'cozy-logger'
import ActionsBar from 'cozy-ui/transpiled/react/ActionsBar'
import { makeActions } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import CircularProgress from 'cozy-ui/transpiled/react/CircularProgress'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import NewIcon from 'cozy-ui/transpiled/react/Icons/New'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import { renameActivity } from '../../queries/actions/activities/renameActivity'

// import ActivityPreview from '@/components/ActivityPreview/ActivityPreview'
import FilterChip from '@/components/FilterChip/FilterChip'
import FlashcardPlayer from '@/components/FlashcardPlayer/FlashcardPlayer'
import QuestionItem from '@/components/QuestionItem/QuestionItem'
import TabTitle from '@/components/TabTitle/TabTitle'
import TableItemText from '@/components/TableItem/TableItemText'
import { buildActivityItemQuery } from '@/queries'
import { detachQuestions } from '@/queries/actions/questions/detachQuestion'
import {
  newQuestion,
  newQuestionsBatch
} from '@/queries/actions/questions/newQuestion'
import { extractJSONObject, generateFlashCards } from '@/queries/rag/openrag'
import styles from '@/styles/item-view.styl'

const ItemView = () => {
  const { t } = useI18n()
  const client = useClient()
  const { showAlert } = useAlert()
  const location = useLocation()
  const activityId = useMemo(
    () => location.pathname.split('/').pop(),
    [location]
  )

  const activityItemQuery = useMemo(
    () => buildActivityItemQuery(activityId),
    [activityId]
  )
  const { data: activity } = useQuery(
    activityItemQuery.definition,
    activityItemQuery.options
  )

  const questions = activity?.questions?.data || []

  const [activityTitle, setActivityTitle] = useState()

  const titleInputRef = React.useRef()

  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    if (firstLoad && activity) {
      setActivityTitle(activity?.title)
      if (activity?.title.trim() === '') {
        titleInputRef.current.focus()
      }
      setFirstLoad(false)
    }
  }, [activity, firstLoad])

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
  const [selectedQuestions, setSelectedQuestions] = React.useState([])

  const [newQuestionId, setNewQuestionId] = useState(null)

  const deleteSelected = () => ({
    name: 'deleteSelected',
    icon: TrashIcon,
    action: async () => {
      const questionsIds = selectedQuestions.map(q => {
        return { _id: q }
      })
      await detachQuestions(activity, questionsIds)
    },
    label: t('delete')
  })

  const actions = makeActions([deleteSelected])

  const openQuestion = question => {
    if (openedQuestion?._id === question._id) {
      setOpenedQuestion(null)
    } else {
      setOpenedQuestion(question)
    }
  }

  const [isGenerating, setIsGenerating] = useState(false)

  const ragGenerate = async () => {
    try {
      setIsGenerating(true)
      const data = await generateFlashCards(
        activity,
        'Numérique et sciences informatiques',
        16,
        activity.title,
        5,
        false
      )
      const json = extractJSONObject(data.choices[0].message.content)
      if (json.cards && json.cards.length > 0 && json.cards[0].answer) {
        newQuestionsBatch(
          client,
          activity,
          json.cards.map(card => {
            return {
              label: card.text,
              answer: card.answer,
              hint: card.hint
            }
          })
        )
      } else {
        log.error(json)
        showAlert({
          message: t('questions.generate.error'),
          severity: 'error'
        })
      }
    } catch (error) {
      log.error(error)
      showAlert({
        message: t('questions.generate.error'),
        severity: 'error'
      })
    }
    setIsGenerating(false)
  }

  return (
    <div className="u-flex u-flex-column u-h-100">
      <TabTitle
        backEnabled
        trailing={
          <>
            <Button
              variant="secondary"
              label={t('generate')}
              startIcon={<Icon icon={NewIcon} />}
              onClick={() => ragGenerate()}
              className="u-mr-1"
            />

            <Button
              variant="primary"
              label={t('new')}
              startIcon={<Icon icon={PlusIcon} />}
              onClick={() =>
                newQuestion(client, activity, '')
                  .then(question => {
                    setNewQuestionId(question._id)
                    return showAlert({
                      message: t('questions.alerts.created'),
                      severity: 'success'
                    })
                  })
                  .catch(() => {
                    return showAlert({
                      message: t('questions.alerts.error'),
                      severity: 'error'
                    })
                  })
              }
            />
          </>
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
          onChange={e => {
            setActivityTitle(e.target.value)
          }}
          onBlur={e => {
            renameActivity(client, activity, e.target.value)
              .then(() => {
                return showAlert({
                  message: t('activities.alerts.updated'),
                  severity: 'success'
                })
              })
              .catch(() => {
                return showAlert({
                  message: t('activities.alerts.error'),
                  severity: 'error'
                })
              })
          }}
        />

        <div className="u-flex u-mt-1">
          {Object.entries(filters).map(([key, filter]) => (
            <FilterChip key={key} label={filter.label} />
          ))}
        </div>
      </TabTitle>

      {selectedQuestions.length > 0 && (
        <ActionsBar
          actions={actions}
          docs={selectedQuestions}
          onClose={() => setSelectedQuestions([])}
        />
      )}

      <div className="u-flex u-flex-col u-h-100">
        <List className="u-w-100">
          <ListItem size="small" dense>
            <Checkbox
              checked={selectedQuestions.length > 0}
              mixed={
                selectedQuestions.length > 0 &&
                selectedQuestions.length < questions.length
              }
              onChange={() => {
                if (selectedQuestions.length === questions.length) {
                  setSelectedQuestions([])
                } else {
                  setSelectedQuestions(questions.map(q => q._id))
                }
              }}
            />
            <TableItemText value="Question" type="primary" />
            <TableItemText value="Réponse" type="secondary" />
            <TableItemText value="Indice" type="secondary" />
            <div className="u-w-2-half u-p-1" />
          </ListItem>

          <Divider />

          {questions.map((question, i) => (
            <motion.div
              key={question.id ?? i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i < 16 ? i * 0.05 : 0,
                duration: 0.5,
                type: 'spring',
                bounce: 0.3
              }}
            >
              <QuestionItem
                question={question}
                autoFocus={question._id === newQuestionId}
                selectedQuestions={selectedQuestions}
                setSelectedQuestions={setSelectedQuestions}
                onOpen={q => openQuestion(q)}
                isOpened={openedQuestion?._id === question._id}
                deleteQuestion={() =>
                  detachQuestions(activity, [{ _id: question._id }])
                    .then(() => {
                      return showAlert({
                        message: t('questions.alerts.deleted'),
                        severity: 'success'
                      })
                    })
                    .catch(() => {
                      return showAlert({
                        message: t('questions.alerts.error'),
                        severity: 'error'
                      })
                    })
                }
              />
              <Divider />
            </motion.div>
          ))}

          {isGenerating && questions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
            >
              <ListItem>
                <ListItemIcon className="u-pl-half">
                  <CircularProgress size={24} />
                </ListItemIcon>
                <TableItemText value="Génération en cours..." type="primary" />
                <div className="u-w-2-half u-p-1" />
              </ListItem>
            </motion.div>
          )}

          {isGenerating && questions.length == 0 && (
            <motion.div
              className="u-flex u-flex-column u-flex-items-center u-flex-justify-center u-mt-2"
              initial={{ opacity: 0, scale: 0.97, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
            >
              <CircularProgress size={56} />
              <Typography variant="h3" align="center" className="u-mt-1-half">
                Génération des flashcards...
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                align="center"
                className="u-mt-half"
              >
                Cela peut prendre jusqu'a 30 secondes, veuillez patienter.
              </Typography>
            </motion.div>
          )}
        </List>

        {openedQuestion && (
          <div
            className="u-p-2 u-flex u-flex-column u-flex-items-center"
            style={{ width: '24rem', borderLeft: '1px solid #4242441f' }}
          >
            <FlashcardPlayer flashcard={openedQuestion} />
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemView
