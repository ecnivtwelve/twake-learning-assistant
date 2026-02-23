import React from 'react'
import { useI18n } from 'twake-i18n'

import CircularProgress from 'cozy-ui/transpiled/react/CircularProgress'
import Typography from 'cozy-ui/transpiled/react/Typography'

import FlashcardGenerationResultsList from './FlashcardGenerationResultsList'
import { getReadableFlashcardGenerationStatus } from './flashcardGenerationStatus'

const FlashcardGenerationDialogBody = ({
  loading,
  status,
  isWaitingForConfirmation,
  hasCards,
  allCards,
  results,
  selectedCards,
  onToggleCard,
  onToggleAll
}) => {
  const { t } = useI18n()

  if (loading) {
    return (
      <div className="u-flex u-flex-column u-flex-items-center u-m-2">
        <CircularProgress size={48} />
        <Typography variant="h5" className="u-mt-1" align="center">
          {t('questions.generation.summary.loading_title')}
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          className="u-mt-half"
          align="center"
        >
          {getReadableFlashcardGenerationStatus(status, t)}
        </Typography>
      </div>
    )
  }

  if (isWaitingForConfirmation) {
    return (
      <div className="u-m-2">
        <Typography variant="body1">
          {t('questions.generation.summary.confirm_description')}
        </Typography>
      </div>
    )
  }

  if (!hasCards) {
    return (
      <div className="u-m-2">
        <Typography variant="body1">
          {t('questions.generation.summary.no_results')}
        </Typography>
      </div>
    )
  }

  return (
    <FlashcardGenerationResultsList
      allCards={allCards}
      results={results}
      selectedCards={selectedCards}
      onToggleCard={onToggleCard}
      onToggleAll={onToggleAll}
    />
  )
}

export default FlashcardGenerationDialogBody
