import React, { useState } from 'react'
import { useI18n } from 'twake-i18n'

import { RealTimeQueries, useClient, useQuery } from 'cozy-client'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import EditQuestionDialog from '@/components/Dialogs/EditQuestionDialog/EditQuestionDialog'
import FlashcardGenerationDialog from '@/components/Dialogs/FlashcardGenerationDialog/FlashcardGenerationDialog'
import PageLayout from '@/components/PageLayout/PageLayout'
import QuestionsActionsBar from '@/components/QuestionsTab/QuestionsActionsBar'
import QuestionsList from '@/components/QuestionsTab/QuestionsList'
import QuestionsTabHeader from '@/components/QuestionsTab/QuestionsTabHeader'
import { getQuestionTypes } from '@/consts/questionTypes'
import { useSubject } from '@/context/SubjectContext'
import { buildQuestionsBySubjectQuery } from '@/queries'
import { newQuestionsBatch } from '@/queries/actions/questions/newQuestion'
import { useQuestionActions } from '@/queries/hooks/useQuestionActions'
import { runFlashcardPipeline } from '@/queries/rag/openrag'

const QuestionsTab = () => {
  const { t } = useI18n()
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
  const flashcardTabIndex = questionTypes.findIndex(
    questionType => questionType.value === 'flashcard'
  )

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
      if (flashcardTabIndex >= 0) {
        setSelectedQuestionType(flashcardTabIndex)
      }
      setShowRecapDialog(false)
    } catch {
      showAlert({
        message: t('questions.alerts.error'),
        severity: 'error'
      })
    }
  }

  return (
    <PageLayout
      trailing={
        <QuestionsTabHeader
          questionTypes={questionTypes}
          selectedQuestionType={selectedQuestionType}
          onQuestionTypeChange={setSelectedQuestionType}
          onGenerate={handleNewQuestion}
        />
      }
    >
      <RealTimeQueries doctype="io.cozy.learnings.questions" />
      <QuestionsActionsBar
        selectedQuestions={selectedQuestions}
        actions={actions}
        onCloseSelection={() => setSelectedQuestions([])}
      />
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

      <QuestionsList
        filteredQuestions={filteredQuestions}
        selectedQuestions={selectedQuestions}
        setSelectedQuestions={setSelectedQuestions}
        onOpenQuestion={setEditedQuestion}
        onDeleteQuestion={deleteQuestion}
      />
    </PageLayout>
  )
}

export default QuestionsTab
