import React from 'react'

import ActionsBar from 'cozy-ui/transpiled/react/ActionsBar'

const QuestionsActionsBar = ({
  selectedQuestions,
  actions,
  onCloseSelection
}) => {
  if (selectedQuestions.length === 0) return null

  return (
    <ActionsBar
      actions={actions}
      docs={selectedQuestions}
      onClose={onCloseSelection}
    />
  )
}

export default QuestionsActionsBar
