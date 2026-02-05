import React, { useState } from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import log from 'cozy-logger'
import Button from 'cozy-ui/transpiled/react/Buttons'
import {
  DialogCloseButton,
  useCozyDialog
} from 'cozy-ui/transpiled/react/CozyDialogs'
import Dialog, {
  DialogTitle,
  DialogActions,
  DialogContent
} from 'cozy-ui/transpiled/react/Dialog'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CloudUploadIcon from 'cozy-ui/transpiled/react/Icons/Cloud'
import FileIcon from 'cozy-ui/transpiled/react/Icons/File'
import TextField from 'cozy-ui/transpiled/react/TextField'
import Typography from 'cozy-ui/transpiled/react/Typography'

import { newSource } from '@/queries/actions/sources/importSource'

const AddSourceDialog = ({ open, onClose, subject }) => {
  const { t } = useI18n()
  const client = useClient()
  const [file, setFile] = useState(null)
  const [description, setDescription] = useState('')
  const [author, setAuthor] = useState('')
  const [uploading, setUploading] = useState(false)

  React.useEffect(() => {
    if (open) {
      setFile(null)
      setDescription('')
      setAuthor('moi')
    }
  }, [open])

  const { dialogProps, dialogTitleProps, dividerProps, dialogActionsProps } =
    useCozyDialog({
      size: 'medium',
      open: open,
      onClose: onClose,
      disableEnforceFocus: true
    })

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      if (!description) {
        setDescription(selectedFile.name.split('.').slice(0, -1).join('.'))
      }
    }
  }

  const handleUpload = async () => {
    if (!file || !description || !author) return

    setUploading(true)
    onClose()
    try {
      const task = await newSource(client, subject, file, description, author)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      log.error(error)
    } finally {
      setUploading(false)
    }
  }

  const fileInputRef = React.useRef(null)

  return (
    <Dialog {...dialogProps}>
      <DialogCloseButton onClick={onClose} />
      <DialogTitle {...dialogTitleProps}>Ajouter une source</DialogTitle>
      <Divider {...dividerProps} />
      <DialogContent>
        <div className="u-flex u-flex-column u-g-1 u-mb-1-half">
          <div className="u-flex u-flex-items-center">
            <Button
              variant="secondary"
              label="Choisir un fichier"
              startIcon={<Icon icon={FileIcon} />}
              component="label"
              onClick={() => fileInputRef.current.click()}
              className="u-mr-1"
            />
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={handleFileChange}
            />
            {file && <Typography variant="body1">{file.name}</Typography>}
          </div>

          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="u-mt-1"
          />

          <TextField
            label="Auteur"
            variant="outlined"
            fullWidth
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="u-mt-1"
          />
        </div>
      </DialogContent>
      <Divider {...dividerProps} />
      <DialogActions {...dialogActionsProps}>
        <Button
          variant="secondary"
          label={t('cancel')}
          onClick={onClose}
          disabled={uploading}
        />
        <Button
          variant="primary"
          label="Ajouter"
          startIcon={<Icon icon={CloudUploadIcon} />}
          onClick={handleUpload}
          busy={uploading}
          disabled={!file || !description || !author}
        />
      </DialogActions>
    </Dialog>
  )
}

export default AddSourceDialog
