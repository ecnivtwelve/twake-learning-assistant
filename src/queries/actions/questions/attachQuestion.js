import { Q } from 'cozy-client'

import { safeAddRelationship } from '../utils'

export const attachQuestions = async (client, activity, questions) => {
  await activity.questions.add(questions)

  const sources = []
  for (const question of questions) {
    if (
      question.relationships &&
      question.relationships.sources &&
      question.relationships.sources.data
    ) {
      sources.push(...question.relationships.sources.data)
    } else {
      // Fetch full question if relationships are missing
      try {
        const { data: fullQuestion } = await client.query(
          Q('io.cozy.learnings.questions').getById(question._id)
        )
        if (
          fullQuestion.relationships &&
          fullQuestion.relationships.sources &&
          fullQuestion.relationships.sources.data
        ) {
          sources.push(...fullQuestion.relationships.sources.data)
        }
      } catch (e) {
        // Failed to fetch full question, ignoring
      }
    }
  }

  if (sources.length > 0) {
    await safeAddRelationship(client, activity, 'sources', sources)
  }

  return true
}
