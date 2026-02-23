const QUESTION_COUNT_VALUES = [5, 10, 15, 20]

export const DEFAULT_GENERATION_MODE = 'choice'

export const getNumberOfQuestionsOptions = t => {
  return QUESTION_COUNT_VALUES.map(count => ({
    value: count,
    label: t('questions.generation.count_option', { count })
  }))
}
