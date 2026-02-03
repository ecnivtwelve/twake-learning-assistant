import classNames from 'classnames'
import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'

import styles from './FlashcardPlayer.styl'

export default function FlashcardPlayer({ flashcard }) {
  const { label: question, answer, hint } = flashcard
  const [showAnswer, setShowAnswer] = React.useState(false)

  return (
    <div
      className={classNames(
        'u-flex u-flex-column u-flex-items-center u-flex-justify-center',
        styles.flashcard
      )}
      onClick={() => setShowAnswer(!showAnswer)}
    >
      {!showAnswer ? (
        <>
          <Typography variant="h3" align="center">
            {question}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h3" align="center">
            {answer}
          </Typography>
        </>
      )}
    </div>
  )
}
