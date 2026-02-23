export const getReadableFlashcardGenerationStatus = (rawStatus, t) => {
  if (!rawStatus || rawStatus === t('questions.generation.status.starting')) {
    return t('questions.generation.summary.status.starting')
  }

  if (rawStatus === 'Fetching chunks...') {
    return t('questions.generation.summary.status.fetching_sources')
  }

  if (rawStatus === 'No chunks found.') {
    return t('questions.generation.summary.status.no_chunks')
  }

  if (rawStatus === 'Finished.') {
    return t('questions.generation.summary.status.finalizing')
  }

  const match = rawStatus.match(/^Processing (.+) \((\d+)\/(\d+)\): (.+)$/)
  if (match) {
    const [, filename, current, total, stepWithDots] = match
    const step = stepWithDots.replace(/\.\.\.$/, '')

    if (step === 'Extracting notions') {
      return t('questions.generation.summary.status.extracting_notions', {
        filename,
        current,
        total
      })
    }

    const groupMatch = step.match(/^Generating group (\d+)\/(\d+)$/)
    if (groupMatch) {
      return t('questions.generation.summary.status.generating_flashcards', {
        filename,
        current,
        total,
        group: groupMatch[1],
        groupTotal: groupMatch[2]
      })
    }
  }

  return t('questions.generation.summary.status.processing')
}
