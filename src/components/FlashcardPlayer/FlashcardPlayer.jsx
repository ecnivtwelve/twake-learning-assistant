import classNames from 'classnames'
import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect } from 'react'

import Paper from 'cozy-ui/transpiled/react/Paper'
import Typography from 'cozy-ui/transpiled/react/Typography'

import styles from './FlashcardPlayer.styl'

export default function FlashcardPlayer({ flashcard }) {
  const { label: question, choices, hint, interaction, correct } = flashcard
  const [showAnswer, setShowAnswer] = React.useState(false)

  useEffect(() => {
    setShowAnswer(false)
  }, [flashcard])

  if (interaction === 'choice') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
          key={flashcard._id}
          style={{
            position: 'absolute',
            padding: 20,
            width: 'calc(100% - 40px)'
          }}
        >
          <Typography variant="h3" align="center" className="u-mb-2">
            {question}
          </Typography>
          {choices.map((choice, index) => (
            <Paper
              key={index}
              className="u-mt-half"
              style={{
                backgroundColor:
                  correct == choice.id ? 'var(--primaryColor)' : undefined
              }}
            >
              <div className="u-flex u-flex-row u-flex-items-center u-flex-justify-start u-p-1">
                <Typography
                  variant="body1"
                  className="u-mr-1"
                  color="textSecondary"
                  style={{
                    color: correct == choice.id ? 'white' : undefined
                  }}
                >
                  {index + 1}
                </Typography>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  style={{
                    color: correct == choice.id ? 'white' : undefined,
                    fontWeight: correct == choice.id ? 'bold' : undefined,
                    width: '100%',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}
                >
                  {choice.description}
                </Typography>
              </div>
            </Paper>
          ))}
        </motion.div>
      </AnimatePresence>
    )
  }

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
              {choices[0]?.description}
            </Typography>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
