export const detachQuestions = async (
  client,
  t,
  showAlert,
  activity,
  questions
) => {
  return activity.questions.remove(questions)
}
