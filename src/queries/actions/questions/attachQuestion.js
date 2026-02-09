export const attachQuestions = async (activity, questions) => {
  return activity.questions.add(questions)
}
