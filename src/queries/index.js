import CozyClient, { Q } from 'cozy-client'

const DEFAULT_CACHE_TIMEOUT_QUERIES = 9 * 60 * 1000 // 10 minutes
const defaultFetchPolicy = CozyClient.fetchPolicies.olderThan(
  DEFAULT_CACHE_TIMEOUT_QUERIES
)

export const buildSubjectsQuery = () => ({
  definition: () =>
    Q('io.cozy.learnings.subjects').include([
      'activities',
      'sources',
      'questions'
    ]),
  options: {
    as: 'io.cozy.calendar.learnings.subjects/*',
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildActivitiesQuery = () => ({
  definition: () => Q('io.cozy.learnings'),
  options: {
    as: 'io.cozy.calendar.learnings/*',
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildActivityItemQuery = id => ({
  definition: () => Q('io.cozy.learnings').getById(id).include(['questions']),
  options: {
    as: `io.cozy.calendar.learnings/${id}`,
    fetchPolicy: defaultFetchPolicy,
    singleDocData: true
  }
})

export const buildQuestionsQuery = () => ({
  definition: () => Q('io.cozy.learnings.questions'),
  options: {
    as: 'io.cozy.learnings.questions/*',
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildQuestionsBySubjectQuery = subjectId => ({
  definition: () =>
    Q('io.cozy.learnings.questions').where({
      'relationships.subjects.data': {
        $elemMatch: {
          _id: subjectId
        }
      }
    }),
  options: {
    as: `io.cozy.learnings.questions/subject/${subjectId}`,
    fetchPolicy: defaultFetchPolicy
  }
})
