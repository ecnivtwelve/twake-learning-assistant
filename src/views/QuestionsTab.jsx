import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from 'twake-i18n'

import { RealTimeQueries, useClient, useQuery } from 'cozy-client'
import ActionsBar from 'cozy-ui/transpiled/react/ActionsBar'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListIcon from 'cozy-ui/transpiled/react/Icons/List'
import NewIcon from 'cozy-ui/transpiled/react/Icons/New'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import Tab from 'cozy-ui/transpiled/react/Tab'
import Tabs from 'cozy-ui/transpiled/react/Tabs'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import QuestionIcon from '@/assets/icons/QuestionIcon'
import PageLayout from '@/components/PageLayout/PageLayout'
import EditQuestionDialog from '@/components/Dialogs/EditQuestionDialog/EditQuestionDialog'
import FlashcardGenerationDialog from '@/components/Dialogs/FlashcardGenerationDialog/FlashcardGenerationDialog'
import QuestionItem from '@/components/QuestionItem/QuestionItem/QuestionItem'
import { getQuestionTypes } from '@/consts/questionTypes'
import TableItemText from '@/components/TableItem/TableItemText'
import { useSubject } from '@/context/SubjectContext'
import { buildQuestionsBySubjectQuery } from '@/queries'
import { newQuestionsBatch } from '@/queries/actions/questions/newQuestion'
import { useQuestionActions } from '@/queries/hooks/useQuestionActions'
import { runFlashcardPipeline } from '@/queries/rag/openrag'

const QuestionsTab = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const client = useClient()
  const { showAlert } = useAlert()

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

  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStatus, setGenerationStatus] = useState('')
  const [generationResults, setGenerationResults] = useState([])
  const [showRecapDialog, setShowRecapDialog] = useState(false)
  const [hasStartedGeneration, setHasStartedGeneration] = useState(false)
  const questionTypes = getQuestionTypes(t)

  const filteredQuestions = questions?.filter(
    question =>
      question.interaction === questionTypes[selectedQuestionType].value
  )

  const handleCloseGenerationDialog = () => {
    setShowRecapDialog(false)
    setIsGenerating(false)
    setGenerationStatus('')
    setGenerationResults([])
    setHasStartedGeneration(false)
  }

  const handleNewQuestion = () => {
    if (selectedSubject?.partition) {
      setGenerationResults([])
      setGenerationStatus('')
      setHasStartedGeneration(false)
      setShowRecapDialog(true)
    } else {
      // eslint-disable-next-line no-console
      console.warn('No partition selected for current subject.')
    }
  }

  const handleConfirmGeneration = async () => {
    if (!selectedSubject?.partition) return

    setHasStartedGeneration(true)
    setIsGenerating(true)
    setGenerationStatus(t('questions.generation.status.starting'))
    setGenerationResults([])
    try {
      const generatedCards = await runFlashcardPipeline(
        selectedSubject.partition,
        setGenerationStatus
      )
      setGenerationResults(generatedCards)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Flashcard pipeline failed', e)
      showAlert({
        message: t('questions.generate.error'),
        severity: 'error'
      })
      handleCloseGenerationDialog()
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddGeneratedCards = async selectedCards => {
    try {
      const allCards = selectedCards.map(card => ({
        label: card.text,
        choices: [
          {
            id: 1,
            description: card.answer
          }
        ],
        correct: 1,
        hint: card.tip
      }))

      if (allCards.length === 0) return

      await newQuestionsBatch(
        client,
        selectedSubject,
        null,
        allCards,
        'flashcard'
      )
      showAlert({
        message: t('questions.generate.added_success', {
          count: allCards.length
        }),
        severity: 'success'
      })
      setShowRecapDialog(false)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to add generated cards', e)
      showAlert({
        message: t('questions.alerts.error'),
        severity: 'error'
      })
    }
  }

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
              {questionTypes.map(question_type => (
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
            label={t('generate')}
            startIcon={<Icon icon={NewIcon} />}
            className="u-ml-1"
            onClick={handleNewQuestion}
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
      <FlashcardGenerationDialog
        open={showRecapDialog}
        onClose={handleCloseGenerationDialog}
        loading={isGenerating}
        status={generationStatus}
        results={generationResults}
        hasStartedGeneration={hasStartedGeneration}
        onConfirmGeneration={handleConfirmGeneration}
        onAddAll={handleAddGeneratedCards}
      />

      <List>
        <ListItem size="small" dense>
          <Checkbox
            checked={
              filteredQuestions?.length > 0 &&
              filteredQuestions.every(q => selectedQuestions.includes(q._id))
            }
            mixed={
              filteredQuestions?.some(q => selectedQuestions.includes(q._id)) &&
              !filteredQuestions?.every(q => selectedQuestions.includes(q._id))
            }
            onChange={() => {
              if (
                filteredQuestions?.every(q => selectedQuestions.includes(q._id))
              ) {
                setSelectedQuestions(
                  selectedQuestions.filter(
                    id => !filteredQuestions.some(q => q._id === id)
                  )
                )
              } else {
                const newSelection = [
                  ...new Set([
                    ...selectedQuestions,
                    ...filteredQuestions.map(q => q._id)
                  ])
                ]
                setSelectedQuestions(newSelection)
              }
            }}
          />
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
    </PageLayout>
  )
}

export default QuestionsTab
