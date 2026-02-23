import React from 'react'
import { useI18n } from 'twake-i18n'

import MenuItem from 'cozy-ui/transpiled/react/MenuItem'
import TextField from 'cozy-ui/transpiled/react/TextField'

const ItemGenerationDialogFields = ({
  numberOfQuestions,
  onChangeNumberOfQuestions,
  mode,
  onChangeMode,
  modes,
  numberOfQuestionsOptions
}) => {
  const { t } = useI18n()

  return (
    <>
      <TextField
        select
        options={numberOfQuestionsOptions}
        value={numberOfQuestions}
        onChange={e => onChangeNumberOfQuestions(e.target.value)}
        label={t('questions.generation.count_label')}
        variant="outlined"
        fullWidth
      >
        {numberOfQuestionsOptions.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        options={modes}
        value={mode}
        onChange={e => onChangeMode(e.target.value)}
        label={t('questions.generation.type_label')}
        variant="outlined"
        fullWidth
        className="u-mt-1"
      >
        {modes.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </>
  )
}

export default ItemGenerationDialogFields
