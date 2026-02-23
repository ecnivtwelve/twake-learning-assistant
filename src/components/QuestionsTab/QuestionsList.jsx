import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListIcon from 'cozy-ui/transpiled/react/Icons/List'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'

import QuestionIcon from '@/assets/icons/QuestionIcon'
import QuestionItem from '@/components/QuestionItem/QuestionItem/QuestionItem'
import TableItemText from '@/components/TableItem/TableItemText'

const QuestionsList = ({
  filteredQuestions,
  selectedQuestions,
  setSelectedQuestions,
  onOpenQuestion,
  onDeleteQuestion
}) => {
  const { t } = useI18n()
  const navigate = useNavigate()

  const allSelected =
    filteredQuestions?.length > 0 &&
    filteredQuestions.every(question =>
      selectedQuestions.includes(question._id)
    )

  const partiallySelected =
    filteredQuestions?.some(question =>
      selectedQuestions.includes(question._id)
    ) &&
    !filteredQuestions?.every(question =>
      selectedQuestions.includes(question._id)
    )

  const handleToggleAll = () => {
    if (!filteredQuestions) return

    if (allSelected) {
      setSelectedQuestions(
        selectedQuestions.filter(
          id => !filteredQuestions.some(question => question._id === id)
        )
      )
      return
    }

    const newSelection = [
      ...new Set([...selectedQuestions, ...filteredQuestions.map(q => q._id)])
    ]
    setSelectedQuestions(newSelection)
  }

  return (
    <List>
      <ListItem size="small" dense>
        <Checkbox
          checked={allSelected}
          mixed={partiallySelected}
          onChange={handleToggleAll}
        />
        <TableItemText value={t('questions.table.questions')} type="primary" />
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
              onOpen={() => onOpenQuestion(question)}
              selectedQuestions={selectedQuestions}
              setSelectedQuestions={setSelectedQuestions}
              deleteQuestion={() => onDeleteQuestion(question)}
              showSources
            />
            <Divider />
          </React.Fragment>
        ))}

      {filteredQuestions && filteredQuestions.length === 0 && (
        <Empty
          icon={<QuestionIcon size={96} />}
          title={t('questions.empty.title')}
          text={t('questions.empty.message')}
          centered
        >
          <Button
            variant="primary"
            label={t('questions.empty.select')}
            startIcon={<Icon icon={ListIcon} />}
            onClick={() => navigate('/activities')}
            className="u-mt-1"
          />
        </Empty>
      )}
    </List>
  )
}

export default QuestionsList
