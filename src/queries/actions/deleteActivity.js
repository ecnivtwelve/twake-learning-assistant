export const deleteActivity = async (client, t, showAlert, activity) => {
  const response = await client.stackClient
    .collection('io.cozy.learnings')
    .destroy(activity)

  if (response?.data) {
    showAlert({
      message: t('activities.alerts.deleted'),
      severity: 'success'
    })
  } else {
    showAlert({
      message: t('activities.alerts.error'),
      severity: 'error'
    })
  }
}
