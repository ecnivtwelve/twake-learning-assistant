export default {
  learnings: {
    doctype: 'io.cozy.learnings',
    relationships: {
      subjects: {
        doctype: 'io.cozy.learnings.subjects',
        type: 'has-one'
      },
      questions: {
        doctype: 'io.cozy.learnings.questions',
        type: 'has-many'
      }
    }
  },
  subjects: {
    doctype: 'io.cozy.learnings.subjects',
    relationships: {
      activities: {
        doctype: 'io.cozy.learnings',
        type: 'has-many'
      },
      sources: {
        doctype: 'io.cozy.files',
        type: 'has-many'
      },
      questions: {
        doctype: 'io.cozy.learnings.questions',
        type: 'has-many'
      }
    }
  },
  questions: {
    doctype: 'io.cozy.learnings.questions',
    relationships: {
      activities: {
        doctype: 'io.cozy.learnings',
        type: 'has-many'
      },
      subjects: {
        doctype: 'io.cozy.learnings.subjects',
        type: 'has-many'
      }
    }
  }
}
