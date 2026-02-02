export const detachQuestions = async (activity, questions) => {
  return activity.questions.remove(questions)
}
