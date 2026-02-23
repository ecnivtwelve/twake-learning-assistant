import React, { useEffect, useState } from 'react'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import CircularProgress from 'cozy-ui/transpiled/react/CircularProgress'
import {
  DialogCloseButton,
  useCozyDialog
} from 'cozy-ui/transpiled/react/CozyDialogs'
import Dialog, {
  DialogActions,
  DialogTitle
} from 'cozy-ui/transpiled/react/Dialog'
import Divider from 'cozy-ui/transpiled/react/Divider'

import FlashcardGenerationDialogBody from './FlashcardGenerationDialogBody'
import { buildGeneratedCards } from './flashcardGenerationCards'

const FlashcardGenerationDialog = ({
  open,
  onClose,
  loading,
  status,
  results,
  onAddAll,
  onConfirmGeneration,
  hasStartedGeneration
}) => {
  const { t } = useI18n()
  const { dialogProps, dialogTitleProps, dividerProps, dialogActionsProps } =
    useCozyDialog({
      size: 'medium',
      open: open,
      onClose: onClose,
      disableEnforceFocus: true
    })

  const [selectedCards, setSelectedCards] = useState([])
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    if (!loading && results.length > 0) {
      const allCards = buildGeneratedCards(results)
      setSelectedCards(allCards.map(c => c.id))
    }
  }, [loading, results])

  const allCards = buildGeneratedCards(results)

  const toggleCard = id => {
    setSelectedCards(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedCards.length === allCards.length) {
      setSelectedCards([])
    } else {
      setSelectedCards(allCards.map(c => c.id))
    }
  }

  const hasCards = allCards.length > 0
  const isWaitingForConfirmation = !loading && !hasStartedGeneration

  const handleAdd = async () => {
    setIsAdding(true)
    const cardsToAdd = allCards.filter(c => selectedCards.includes(c.id))
    await onAddAll(cardsToAdd)
    setIsAdding(false)
    onClose()
  }

  return (
    <Dialog {...dialogProps}>
      {!loading && <DialogCloseButton onClick={onClose} />}
      <DialogTitle {...dialogTitleProps}>
        {loading && t('questions.generation.summary.loading_title')}
        {isWaitingForConfirmation &&
          t('questions.generation.summary.confirm_title')}
        {!loading &&
          !isWaitingForConfirmation &&
          t('questions.generation.summary.title')}
      </DialogTitle>
      <Divider {...dividerProps} />
      <FlashcardGenerationDialogBody
        loading={loading}
        status={status}
        isWaitingForConfirmation={isWaitingForConfirmation}
        hasCards={hasCards}
        allCards={allCards}
        results={results}
        selectedCards={selectedCards}
        onToggleCard={toggleCard}
        onToggleAll={toggleAll}
      />
      <Divider {...dividerProps} />
      <DialogActions {...dialogActionsProps}>
        <Button variant="secondary" label={t('cancel')} onClick={onClose} />
        {isWaitingForConfirmation && (
          <Button
            variant="primary"
            label={t('questions.generation.summary.confirm_button')}
            onClick={onConfirmGeneration}
          />
        )}
        {!isWaitingForConfirmation && hasCards && (
          <Button
            variant="primary"
            label={t('questions.generation.summary.add_selected', {
              count: selectedCards.length
            })}
            endIcon={isAdding && <CircularProgress color="white" size={20} />}
            disabled={selectedCards.length === 0}
            onClick={handleAdd}
          />
        )}
      </DialogActions>
    </Dialog>
  )
}

export default FlashcardGenerationDialog
