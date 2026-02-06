import React, { useState } from 'react'
import { useI18n } from 'twake-i18n'

import { useClient, useQuery } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import HelpIcon from 'cozy-ui/transpiled/react/Icons/HelpOutlined'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import Typography from 'cozy-ui/transpiled/react/Typography'

import FilterChip from '@/components/FilterChip/FilterChip'
import QuestionItem from '@/components/QuestionItem/QuestionItem'
import SubjectDropdown from '@/components/Subjects/SubjectDropdown'
import TabTitle from '@/components/TabTitle/TabTitle'
import TableItemText from '@/components/TableItem/TableItemText'
import { useSubject } from '@/context/SubjectContext'
import { buildQuestionsQuery } from '@/queries'
import { deleteQuestion } from '@/queries/actions/questions/deleteQuestion'

const QuestionsTab = () => {
  const { t } = useI18n()
  const client = useClient()

  const { selectedSubject } = useSubject()
  const questions = selectedSubject?.questions.data || []

  console.log(questions)

  const [openedQuestion, setOpenedQuestion] = useState(null)

  const handleOpenQuestion = question => {
    setOpenedQuestion(question)
  }

  const [selectedQuestions, setSelectedQuestions] = useState([])

  return (
    <>
      <TabTitle
        trailing={
          <Button
            variant="primary"
            label={t('new')}
            startIcon={<Icon icon={PlusIcon} />}
          />
        }
      >
        <SubjectDropdown />
      </TabTitle>

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
          questions.map((question, i) => (
            <React.Fragment key={i}>
              <QuestionItem
                question={question}
                autoFocus={false}
                isOpened={false}
                onOpen={() => { }}
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
    </>
  )
}

export default QuestionsTab
