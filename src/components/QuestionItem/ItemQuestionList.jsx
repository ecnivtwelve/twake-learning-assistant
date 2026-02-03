import { motion } from 'motion/react'
import React from 'react'
import { useI18n } from 'twake-i18n'

import ActionsBar from 'cozy-ui/transpiled/react/ActionsBar'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import CircularProgress from 'cozy-ui/transpiled/react/CircularProgress'
import Divider from 'cozy-ui/transpiled/react/Divider'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import Typography from 'cozy-ui/transpiled/react/Typography'

import QuestionItem from '@/components/QuestionItem/QuestionItem'
import TableItemText from '@/components/TableItem/TableItemText'

const ItemQuestionList = ({
  questions,
  selectedQuestions,
  setSelectedQuestions,
  openedQuestion,
  setOpenedQuestion,
  isGenerating,
  actions,
  newQuestionId,
  onDeleteQuestion
}) => {
  const { t } = useI18n()

  const openQuestion = question => {
    if (openedQuestion?._id === question._id) {
      setOpenedQuestion(null)
    } else {
      setOpenedQuestion(question)
    }
  }

  return (
    <>
      {selectedQuestions.length > 0 && (
        <ActionsBar
          actions={actions}
          docs={selectedQuestions}
          onClose={() => setSelectedQuestions([])}
        />
      )}

      <div className="u-flex u-flex-col u-w-100 u-h-100">
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
                delay: i < 16 ? i * 0.03 : 0,
                duration: 0.5,
                ease: [0.3, 0, 0, 1]
              }}
            >
              <QuestionItem
                question={question}
                autoFocus={question._id === newQuestionId}
                selectedQuestions={selectedQuestions}
                setSelectedQuestions={setSelectedQuestions}
                onOpen={q => openQuestion(q)}
                isOpened={openedQuestion?._id === question._id}
                deleteQuestion={() => onDeleteQuestion(question._id)}
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
                <TableItemText
                  value={t('activity.generating.title')}
                  type="primary"
                />
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
                {t('activity.generating.title')}
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                align="center"
                className="u-mt-half"
              >
                {t('activity.generating.message')}
              </Typography>
            </motion.div>
          )}
        </List>
      </div>
    </>
  )
}

export default ItemQuestionList
