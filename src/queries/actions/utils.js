import CozyClient, { Q } from 'cozy-client'

export const safeAddRelationship = async (
  client,
  doc,
  relationshipName,
  items,
  retries = 3
) => {
  let currentDoc = doc
  for (let i = 0; i < retries; i++) {
    try {
      const query = Q(currentDoc._type).getById(currentDoc._id)
      const result = await client.query(query, {
        as: `${currentDoc._type}/${currentDoc._id}`,
        fetchPolicy: CozyClient.fetchPolicies.olderThan(0)
      })
      currentDoc = result.data

      const itemsToAdd = Array.isArray(items) ? items : [items]
      const existingData =
        currentDoc.relationships?.[relationshipName]?.data || []

      const newData = [...existingData, ...itemsToAdd]
        .filter(
          (item, index, self) =>
            index === self.findIndex(t => t._id === item._id)
        )
        .map(item => ({ _id: item._id, _type: item._type }))

      await client.save({
        ...currentDoc,
        relationships: {
          ...currentDoc.relationships,
          [relationshipName]: {
            data: newData
          }
        }
      })
      return
    } catch (error) {
      if (error.message && error.message.includes('409') && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)))
        continue
      }
      throw error
    }
  }
}
