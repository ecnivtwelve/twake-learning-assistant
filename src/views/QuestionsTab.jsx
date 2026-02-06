import React from 'react'
import { useI18n } from 'twake-i18n'

import { useQuery } from 'cozy-client'
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
import SubjectDropdown from '@/components/Subjects/SubjectDropdown'
import TabTitle from '@/components/TabTitle/TabTitle'
import TableItemText from '@/components/TableItem/TableItemText'
import { buildQuestionsQuery } from '@/queries'

const QuestionsTab = () => {
  const { t } = useI18n()

  const questionsQuery = buildQuestionsQuery()
  const { data: questions, fetchStatus } = useQuery(
    questionsQuery.definition,
    questionsQuery.options
  )

  console.log(questions)

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
              <ListItem button>
                <ListItemIcon className="u-w-2-half">
                  <Icon icon={HelpIcon} size={22} />
                </ListItemIcon>
                <TableItemText
                  value={question.label}
                  secondary={question.answer}
                  type="primary"
                />
                <TableItemText
                  value={question.cozyMetadata.updatedAT}
                  type="secondary"
                />
                <TableItemText value={[]} type="chip" />
                <TableItemText value={0} type="colouredValue" />
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
    </>
  )
}

export default QuestionsTab
