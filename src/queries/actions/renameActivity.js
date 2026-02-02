export const renameActivity = async (client, t, showAlert, activity, title) => {
  const response = await client.save({
    ...activity,
    title
  })

  if (!response?.data) {
    showAlert({
      message: t('activity.alerts.rename.error'),
      severity: 'error'
    })
  }
}
