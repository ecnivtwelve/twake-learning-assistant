import React from 'react'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import NewIcon from 'cozy-ui/transpiled/react/Icons/New'
import Tab from 'cozy-ui/transpiled/react/Tab'
import Tabs from 'cozy-ui/transpiled/react/Tabs'

const QuestionsTabHeader = ({
  questionTypes,
  selectedQuestionType,
  onQuestionTypeChange,
  onGenerate
}) => {
  const { t } = useI18n()

  return (
    <>
      <div className="u-w-5">
        <Tabs
          size="small"
          segmented
          value={selectedQuestionType}
          onChange={(event, value) => onQuestionTypeChange(value)}
          variant="fullWidth"
        >
          {questionTypes.map(questionType => (
            <Tab
              className="u-miw-3"
              key={questionType.value}
              label={questionType.label}
            />
          ))}
        </Tabs>
      </div>
      <Button
        variant="primary"
        label={t('generate')}
        startIcon={<Icon icon={NewIcon} />}
        className="u-ml-1"
        onClick={onGenerate}
      />
    </>
  )
}

export default QuestionsTabHeader
