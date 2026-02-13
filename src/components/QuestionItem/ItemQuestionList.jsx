import { AnimatePresence, motion } from 'motion/react'
import React from 'react'
import { useI18n } from 'twake-i18n'

import ActionsBar from 'cozy-ui/transpiled/react/ActionsBar'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Icon from 'cozy-ui/transpiled/react/Icon'
import NewIcon from 'cozy-ui/transpiled/react/Icons/New'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemSkeleton from 'cozy-ui/transpiled/react/Skeletons/ListItemSkeleton'

import ActivityIcon from '@/assets/icons/ActivityIcon'
import EditQuestionDialog from '@/components/QuestionItem/EditQuestionDialog'
import QuestionItem from '@/components/QuestionItem/QuestionItem'
import TableItemText from '@/components/TableItem/TableItemText'

const ItemQuestionList = ({
  questions,
  selectedQuestions,
  setSelectedQuestions,
  openedQuestion,
  setOpenedQuestion,
  isGenerating,
  numberOfQuestions,
  isLoading,
  actions,
  newQuestionId,
  onDeleteQuestion,
  onDetachQuestion,
  selectQuestions
}) => {
  const { t } = useI18n()

  const openQuestion = question => {
    if (openedQuestion?._id === question._id) {
      setOpenedQuestion(null)
    } else {
      setOpenedQuestion(question)
    }
  }
  const [editedQuestion, setEditedQuestion] = React.useState(null)

  return (
    <>
      {selectedQuestions.length > 0 && (
        <ActionsBar
          actions={actions}
          docs={selectedQuestions}
          onClose={() => setSelectedQuestions([])}
        />
      )}

      <EditQuestionDialog
        open={editedQuestion !== null}
        onClose={() => setEditedQuestion(null)}
        question={editedQuestion}
      />

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

          <AnimatePresence>
            {questions.length == 0 && !isGenerating && !isLoading && (
              <motion.div
                className="u-flex u-flex-column u-flex-items-center u-flex-justify-center u-mt-2"
                style={{
                  position: 'absolute',
                  width: '100%'
                }}
                initial={{
                  opacity: 0,
                  scale: 0.97,
                  y: 30
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    duration: 0.7,
                    type: 'spring',
                    bounce: 0.3,
                    delay: 0.2
                  }
                }}
              >
                <Empty
                  icon={<ActivityIcon size={96} />}
                  title={t('activity.empty.title')}
                  text={t('activity.empty.message')}
                  centered
                >
                  <Button
                    variant="primary"
                    label={t('activity.empty.select')}
                    startIcon={<Icon icon={NewIcon} />}
                    onClick={() => selectQuestions()}
                    className="u-mt-1"
                  />
                </Empty>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {questions.map((question, i) => (
              <motion.div
                key={question.id ?? i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i < 16 ? i * 0.05 : 0,
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
                  detachQuestion={() => onDetachQuestion(question._id)}
                  deleteQuestion={() => onDeleteQuestion(question)}
                  editQuestion={() => setEditedQuestion(question)}
                />
                <Divider />
              </motion.div>
            ))}
          </AnimatePresence>
          <AnimatePresence>
            {isGenerating &&
              Array.from({ length: numberOfQuestions }).map((_, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    delay: i < 16 ? i * 0.05 : 0,
                    duration: 0.5,
                    ease: [0.3, 0, 0, 1]
                  }}
                  key={i}
                >
                  <ListItem
                    size="small"
                    dense
                    disableGutters
                    className="u-ph-half u-pv-half"
                  >
                    <ListItemSkeleton />
                  </ListItem>
                  <Divider />
                </motion.div>
              ))}
          </AnimatePresence>
        </List>
      </div>
    </>
  )
}

export default ItemQuestionList
