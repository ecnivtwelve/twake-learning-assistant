import React, { useState } from 'react'
import { useI18n } from 'twake-i18n'

import { RealTimeQueries, useQuery } from 'cozy-client'
import ActionsBar from 'cozy-ui/transpiled/react/ActionsBar'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import Tab from 'cozy-ui/transpiled/react/Tab'
import Tabs from 'cozy-ui/transpiled/react/Tabs'

import PageLayout from '@/components/PageLayout/PageLayout'
import EditQuestionDialog from '@/components/QuestionItem/EditQuestionDialog'
import QuestionItem from '@/components/QuestionItem/QuestionItem'
import TableItemText from '@/components/TableItem/TableItemText'
import { useSubject } from '@/context/SubjectContext'
import { buildQuestionsBySubjectQuery } from '@/queries'
import { useQuestionActions } from '@/queries/hooks/useQuestionActions'

export const question_types = [
  {
    label: 'Flashcards',
    value: 'flashcard'
  },
  {
    label: 'QCM',
    value: 'choice'
  }
]

const QuestionsTab = () => {
  const { t } = useI18n()

  const { selectedSubject } = useSubject()
  const questionsQuery = buildQuestionsBySubjectQuery(selectedSubject?._id)
  const { data: questions } = useQuery(
    questionsQuery.definition,
    questionsQuery.options
  )

  const { selectedQuestions, setSelectedQuestions, actions, deleteQuestion } =
    useQuestionActions(null, questions)
  const [editedQuestion, setEditedQuestion] = useState(null)

  const [selectedQuestionType, setSelectedQuestionType] = useState(0)

  const filteredQuestions = questions?.filter(
    question =>
      question.interaction === question_types[selectedQuestionType].value
  )

  return (
    <PageLayout
      trailing={
        <>
          <div className="u-w-5">
            <Tabs
              size="small"
              segmented
              value={selectedQuestionType}
              onChange={(event, value) => setSelectedQuestionType(value)}
              variant="fullWidth"
            >
              {question_types.map(question_type => (
                <Tab
                  className="u-miw-3"
                  key={question_type.value}
                  label={question_type.label}
                />
              ))}
            </Tabs>
          </div>
          <Button
            variant="primary"
            label={t('new')}
            startIcon={<Icon icon={PlusIcon} />}
            className="u-ml-1"
          />
        </>
      }
    >
      <RealTimeQueries doctype="io.cozy.learnings.questions" />
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

      <List>
        <ListItem size="small" dense>
          <ListItemIcon className="u-w-2-half"></ListItemIcon>
          <TableItemText
            value={t('questions.table.questions')}
            type="primary"
          />
          <TableItemText value={t('questions.table.source')} type="secondary" />
          <TableItemText value={t('questions.table.answer')} type="secondary" />
          <div className="u-w-3 u-pr-half" />
        </ListItem>

        <Divider />

        {filteredQuestions &&
          filteredQuestions.map(question => (
            <React.Fragment key={question._id}>
              <QuestionItem
                question={question}
                autoFocus={false}
                isOpened={false}
                onOpen={() => {
                  setEditedQuestion(question)
                }}
                selectedQuestions={selectedQuestions}
                setSelectedQuestions={setSelectedQuestions}
                deleteQuestion={() => {
                  deleteQuestion(question)
                }}
                showSources
              />
              <Divider />
            </React.Fragment>
          ))}
      </List>
    </PageLayout>
  )
}

export default QuestionsTab
