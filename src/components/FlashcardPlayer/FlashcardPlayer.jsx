import classNames from 'classnames'
import { motion, AnimatePresence } from 'motion/react'
import React, { useEffect } from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'

import styles from './FlashcardPlayer.styl'

export default function FlashcardPlayer({ flashcard }) {
  const { label: question, answer, hint } = flashcard
  const [showAnswer, setShowAnswer] = React.useState(false)

  useEffect(() => {
    setShowAnswer(false)
  }, [flashcard])

  return (
    <AnimatePresence>
      <motion.div
        className={classNames(
          'u-flex u-flex-column u-flex-items-center u-flex-justify-center',
          styles.flashcard,
          showAnswer && styles.flashcardAnswer
        )}
        onClick={() => setShowAnswer(!showAnswer)}
        initial={{ rotateY: -180, scale: 0.8 }}
        animate={{ rotateY: 0, scale: 1 }}
        exit={{ rotateY: 180, scale: 0.8 }}
        transition={{ duration: 1.2, type: 'spring', bounce: 0.3 }}
        key={flashcard._id + (showAnswer ? ':answer' : ':question')}
      >
        {!showAnswer ? (
          <>
            <Typography variant="h3" align="center">
              {question}
            </Typography>
            {hint && (
              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                className="u-mt-1"
              >
                {hint}
              </Typography>
            )}
          </>
        ) : (
          <>
            <Typography variant="h3" align="center" color="white">
              {answer}
            </Typography>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
