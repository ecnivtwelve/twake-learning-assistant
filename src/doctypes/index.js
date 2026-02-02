export default {
  learnings: {
    doctype: 'io.cozy.learnings',
    relationships: {
      questions: {
        doctype: 'io.cozy.learnings.questions',
        type: 'has-many'
      }
    }
  },
  questions: {
    doctype: 'io.cozy.learnings.questions',
    relationships: {
      activity: {
        doctype: 'io.cozy.learnings',
        type: 'has-many'
      }
    }
  }
}
