import React, { useState } from 'react'
import { useI18n } from 'twake-i18n'

import { useQuery } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import {
  DialogCloseButton,
  useCozyDialog
} from 'cozy-ui/transpiled/react/CozyDialogs'
import Dialog, { DialogActions } from 'cozy-ui/transpiled/react/Dialog'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import NewIcon from 'cozy-ui/transpiled/react/Icons/New'
import { CircularProgress } from 'cozy-ui/transpiled/react/Progress'
import SearchBar from 'cozy-ui/transpiled/react/SearchBar'
import Tab from 'cozy-ui/transpiled/react/Tab'
import Tabs from 'cozy-ui/transpiled/react/Tabs'
import Typography from 'cozy-ui/transpiled/react/Typography'

import QuestionItem from '@/components/QuestionItem/QuestionItem/QuestionItem'
import { getQuestionTypes } from '@/consts/questionTypes'
import { useSubject } from '@/context/SubjectContext'
import { buildQuestionsBySubjectQuery } from '@/queries'
import { selectRelevantQuestions } from '@/queries/rag/openrag'

const ItemImportDialog = ({
  open,
  onClose,
  onSelectQuestions,
  currentQuestions,
  activityTitle,
  subject,
  numberOfQuestions = 5
}) => {
  const { t } = useI18n()
  const questionTypes = getQuestionTypes(t)
  const [searchTerm, setSearchTerm] = useState('')

  React.useEffect(() => {
    setSearchTerm('')
    setSelectedQuestions([])
  }, [open])

  const { selectedSubject } = useSubject()
  const questionsQuery = buildQuestionsBySubjectQuery(selectedSubject?._id)

  const questions = useQuery(questionsQuery.definition, {
    ...questionsQuery.options,
    enabled: !!selectedSubject?._id
  })
  const { dialogProps, dividerProps, dialogActionsProps } = useCozyDialog({
    size: 'large',
    open: open,
    onClose: onClose,
    disableEnforceFocus: true
  })

  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [selectedQuestionType, setSelectedQuestionType] = useState(0)

  const filteredQuestions = questions.data?.filter(
    question =>
      question.label?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      question.interaction === questionTypes[selectedQuestionType].value
  )

  const currentQuestionsIds = currentQuestions.map(question => question._id)

  const [isAutoSelecting, setIsAutoSelecting] = useState(false)
  const autoSelect = async () => {
    setIsAutoSelecting(true)
    try {
      const availableQuestions = filteredQuestions?.filter(
        question => !currentQuestionsIds.includes(question._id)
      )
      if (!availableQuestions || availableQuestions.length === 0) return

      const selectedIds = await selectRelevantQuestions(
        subject,
        activityTitle,
        availableQuestions,
        numberOfQuestions
      )

      const validIds = selectedIds.filter(id =>
        availableQuestions.some(q => q._id === id)
      )
      setSelectedQuestions(validIds)

      setTimeout(() => {
        const firstSelectedId = validIds[0]
        const element = document.getElementById(`question-${firstSelectedId}`)
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }
      }, 100)
    } catch {
      // Silently fail — no selection if LLM is unavailable
    } finally {
      setIsAutoSelecting(false)
    }
  }

  return (
    <Dialog {...dialogProps}>
      <DialogCloseButton onClick={onClose} />
      <div className="u-flex u-flex-items-center u-flex-justify-between u-p-2 u-pr-4 u-h-1">
        <Typography variant="h4">{t('questions.import.title')}</Typography>
        <div className="u-mr-3">
          <Button
            variant="secondary"
            startIcon={<Icon icon={NewIcon} />}
            label={t('questions.import.select_with_ai')}
            onClick={autoSelect}
            endIcon={isAutoSelecting ? <CircularProgress size={16} /> : null}
          />
        </div>
      </div>
      <Divider {...dividerProps} />
      <div className="u-m-1 u-flex u-flex-row">
        <div className="u-w-5">
          <Tabs
            size="small"
            segmented
            value={selectedQuestionType}
            onChange={(event, value) => setSelectedQuestionType(value)}
            variant="fullWidth"
          >
            {questionTypes.map(question_type => (
              <Tab
                className="u-miw-3"
                key={question_type.value}
                label={question_type.label}
              />
            ))}
          </Tabs>
        </div>

        <SearchBar
          elevation={0}
          type="search"
          value={searchTerm}
          onChange={ev => setSearchTerm(ev.target.value)}
          onClear={() => setSearchTerm('')}
          className="u-ml-half"
        />
      </div>
      <Divider {...dividerProps} />
      <div className="u-h-6" style={{ overflowY: 'scroll' }}>
        <div
          style={
            searchTerm.length === 0
              ? {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '1rem',
                  padding: '1rem'
                }
              : {}
          }
        >
          {filteredQuestions?.map(question => (
            <QuestionItem
              id={`question-${question._id}`}
              card={searchTerm.length === 0}
              key={question._id}
              question={question}
              selectedQuestions={selectedQuestions}
              setSelectedQuestions={setSelectedQuestions}
              isPresent={currentQuestionsIds.includes(question._id)}
              onOpen={() => {
                setSelectedQuestions(
                  selectedQuestions.includes(question._id)
                    ? selectedQuestions.filter(id => id !== question._id)
                    : [...selectedQuestions, question._id]
                )
              }}
            />
          ))}
        </div>
      </div>
      <Divider {...dividerProps} />
      <DialogActions {...dialogActionsProps}>
        <Button variant="secondary" label={t('cancel')} onClick={onClose} />
        <Button
          variant="primary"
          label={`${t('import')} ${
            selectedQuestions.length > 0 ? `(${selectedQuestions.length})` : ''
          }`}
          disabled={selectedQuestions.length === 0}
          onClick={() => {
            onSelectQuestions(selectedQuestions)
            onClose()
          }}
        />
      </DialogActions>
    </Dialog>
  )
}

export default ItemImportDialog
