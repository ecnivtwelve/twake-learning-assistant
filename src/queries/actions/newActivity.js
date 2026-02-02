export const newActivity = async (client, t, showAlert, navigate) => {
  const response = await client.save({
    _type: 'io.cozy.learnings',
    title: ''
  })

  if (response?.data) {
    showAlert({
      message: t('activities.alerts.created'),
      severity: 'success'
    })
    navigate(`/item/${response.data._id}`)
  } else {
    showAlert({
      message: t('activities.alerts.error'),
      severity: 'error'
    })
  }
}
