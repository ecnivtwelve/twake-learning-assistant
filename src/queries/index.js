import CozyClient, { Q } from 'cozy-client'

const DEFAULT_CACHE_TIMEOUT_QUERIES = 9 * 60 * 1000 // 10 minutes
const defaultFetchPolicy = CozyClient.fetchPolicies.olderThan(
  DEFAULT_CACHE_TIMEOUT_QUERIES
)

export const buildActivitiesQuery = () => ({
  definition: () => Q('io.cozy.learnings'),
  options: {
    as: 'io.cozy.calendar.learnings',
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildActivityItemQuery = id => ({
  definition: () => Q('io.cozy.learnings').getById(id),
  options: {
    as: `io.cozy.calendar.learnings/${id}`,
    fetchPolicy: defaultFetchPolicy,
    singleDocData: true
  }
})
