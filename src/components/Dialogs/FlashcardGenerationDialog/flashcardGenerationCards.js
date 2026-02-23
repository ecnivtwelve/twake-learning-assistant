export const buildGeneratedCards = results =>
  results.flatMap((res, resIdx) =>
    res.cards.map((card, cardIdx) => ({
      ...card,
      id: `${resIdx}-${cardIdx}`,
      filename: res.filename
    }))
  )
