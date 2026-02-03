import classNames from 'classnames'
import { motion, AnimatePresence } from 'motion/react'
import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'

import styles from './FlashcardPlayer.styl'

export default function FlashcardPlayer({ flashcard }) {
  const { label: question, answer, hint } = flashcard
  const [showAnswer, setShowAnswer] = React.useState(false)

  return (
    <AnimatePresence>
      <motion.div
        className={classNames(
          'u-flex u-flex-column u-flex-items-center u-flex-justify-center',
          styles.flashcard
        )}
        onClick={() => setShowAnswer(!showAnswer)}
        initial={{ rotateY: -180, scale: 0.8 }}
        animate={{ rotateY: 0, scale: 1 }}
        exit={{ rotateY: 180, scale: 0.8 }}
        transition={{ duration: 1.3, type: 'spring', bounce: 0.3 }}
        key={flashcard._id + (showAnswer ? ':answer' : ':question')}
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
      </motion.div>
    </AnimatePresence>
  )
}
