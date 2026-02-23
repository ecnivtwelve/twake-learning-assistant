import React from 'react'
import { useI18n } from 'twake-i18n'

import { FilePickerDialog } from 'cozy-filepicker'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

const SourcesImportDialog = ({
  open,
  onClose,
  existingFiles,
  onFilesSelected
}) => {
  const { t } = useI18n()
  const { showAlert } = useAlert()

  const handleImport = async files => {
    onClose()
    showAlert({
      message: t('sources.import.loading'),
      severity: 'info',
      variant: 'filled'
    })

    try {
      await onFilesSelected(files)
      showAlert({
        message: t('sources.import.success'),
        severity: 'success',
        variant: 'filled'
      })
    } catch {
      showAlert({
        message: t('sources.import.error'),
        severity: 'error',
        variant: 'filled'
      })
    }
  }

  return (
    <FilePickerDialog
      open={open}
      onClose={onClose}
      multiple={true}
      fileTypes={[
        'application/pdf',
        'text/markdown',
        'text/plain',
        'text/vnd.cozy.note+markdown'
      ]}
      existingFiles={existingFiles}
      onFilesSelected={handleImport}
    />
  )
}

export default SourcesImportDialog
