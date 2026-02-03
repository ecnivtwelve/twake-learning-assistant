import React from 'react'

import FlashcardPlayer from '@/components/FlashcardPlayer/FlashcardPlayer'

const ItemFlashcardPreview = ({ openedQuestion }) => {
  if (!openedQuestion) return null
  if (!openedQuestion.label) return null

  return (
    <div
      className="u-p-2 u-flex u-flex-column u-flex-items-center"
      style={{ width: '24rem', borderLeft: '1px solid #4242441f' }}
    >
      <FlashcardPlayer flashcard={openedQuestion} />
    </div>
  )
}

export default ItemFlashcardPreview
