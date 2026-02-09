import React, { useState } from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'

import PageLayout from '@/components/PageLayout/PageLayout'
import QuestionItem from '@/components/QuestionItem/QuestionItem'
import TableItemText from '@/components/TableItem/TableItemText'
import { useSubject } from '@/context/SubjectContext'
import { deleteQuestion } from '@/queries/actions/questions/deleteQuestion'

const QuestionsTab = () => {
  const { t } = useI18n()
  const client = useClient()

  const { selectedSubject } = useSubject()
  const questions = selectedSubject?.questions.data || []

  // const [openedQuestion, setOpenedQuestion] = useState(null)
  // const handleOpenQuestion = question => {
  //   setOpenedQuestion(question)
  // }
  // These were unused, so commenting them out or removing them.
  // The original code had them but didn't use them (lint error).

  const [selectedQuestions, setSelectedQuestions] = useState([])

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
      <List>
        <ListItem size="small" dense>
          <ListItemIcon className="u-w-2-half"></ListItemIcon>
          <TableItemText
            value={t('questions.table.questions')}
            type="primary"
          />
          <TableItemText value={t('questions.table.source')} type="secondary" />
          <TableItemText value={t('questions.table.tags')} type="secondary" />
          <TableItemText value={t('questions.table.level')} type="secondary" />
          <div className="u-w-1-half" />
        </ListItem>

        <Divider />

        {questions &&
          questions.map(question => (
            <React.Fragment key={question._id}>
              <QuestionItem
                question={question}
                autoFocus={false}
                isOpened={false}
                onOpen={() => {}}
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
