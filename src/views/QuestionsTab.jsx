import React, { useState } from 'react'
import { useI18n } from 'twake-i18n'

import { RealTimeQueries, useClient, useQuery } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'

import PageLayout from '@/components/PageLayout/PageLayout'
import EditQuestionDialog from '@/components/QuestionItem/EditQuestionDialog'
import QuestionItem from '@/components/QuestionItem/QuestionItem'
import TableItemText from '@/components/TableItem/TableItemText'
import { useSubject } from '@/context/SubjectContext'
import { buildQuestionsBySubjectQuery } from '@/queries'
import { deleteQuestion } from '@/queries/actions/questions/deleteQuestion'

const QuestionsTab = () => {
  const { t } = useI18n()
  const client = useClient()

  const { selectedSubject } = useSubject()
  const questionsQuery = buildQuestionsBySubjectQuery(selectedSubject?._id)
  const { data: questions } = useQuery(
    questionsQuery.definition,
    questionsQuery.options
  )

  // const [openedQuestion, setOpenedQuestion] = useState(null)
  // const handleOpenQuestion = question => {
  //   setOpenedQuestion(question)
  // }
  // These were unused, so commenting them out or removing them.
  // The original code had them but didn't use them (lint error).

  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [editedQuestion, setEditedQuestion] = useState(null)

  return (
    <PageLayout
      trailing={
        <Button
          variant="primary"
          label={t('new')}
          startIcon={<Icon icon={PlusIcon} />}
        />
      }
    >
      <RealTimeQueries doctype="io.cozy.learnings.questions" />
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
          <TableItemText value={t('questions.table.answer')} type="secondary" />
          <TableItemText value={t('questions.table.hint')} type="secondary" />
          <div className="u-w-3 u-pr-half" />
        </ListItem>

        <Divider />

        {questions &&
          questions.map(question => (
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
                  deleteQuestion(client, question)
                }}
              />
              <Divider />
            </React.Fragment>
          ))}
      </List>
    </PageLayout>
  )
}

export default QuestionsTab
