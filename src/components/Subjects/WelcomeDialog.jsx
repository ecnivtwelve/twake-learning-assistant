import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { useCozyDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Dialog from 'cozy-ui/transpiled/react/Dialog'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CheckSquareIcon from 'cozy-ui/transpiled/react/Icons/CheckSquare'
import FileIcon from 'cozy-ui/transpiled/react/Icons/File'
import NewIcon from 'cozy-ui/transpiled/react/Icons/New'
import NextIcon from 'cozy-ui/transpiled/react/Icons/Next'
import TextField from 'cozy-ui/transpiled/react/TextField'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import TwakeLearningsWordmark from '@/assets/icons/TwakeLearningsWordmark'
import { newSubject } from '@/queries/actions/subjects/newSubject'

const WelcomeDialog = ({ open, onClose }) => {
  const { dialogProps, dialogTitleProps, dividerProps, dialogActionsProps } =
    useCozyDialog({
      size: 'large',
      open: open,
      onClose: onClose,
      disableEnforceFocus: true
    })

  const [step, setStep] = useState(0)

  return (
    <Dialog {...dialogProps}>
      <div
        className="u-h-6 u-flex u-flex-column u-flex-items-center u-flex-justify-center"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            initial={{ opacity: 0, x: 150 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -150 }}
            transition={{ duration: 0.3 }}
            key={'step:' + step}
            style={{ position: 'absolute' }}
          >
            {step === 0 && <WelcomeIntro setStep={setStep} />}
            {step === 1 && (
              <WelcomeCreateSubject setStep={setStep} onClose={onClose} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Dialog>
  )
}

const WelcomeIntro = ({ setStep }) => {
  const { t } = useI18n()

  return (
    <div className="u-p-2">
      <div className="u-pt-1 u-flex u-flex-row u-flex-items-center u-flex-justify-center">
        <Typography variant="h2" color="textPrimary" align="center">
          {t('welcome.title')}
        </Typography>
        <TwakeLearningsWordmark size={310} className="u-ml-1" />
      </div>
      <Typography
        variant="body1"
        color="textSecondary"
        align="center"
        className="u-mt-half"
      >
        {t('welcome.message')}
      </Typography>

      <div className="u-mt-3 u-flex u-w-100 u-flex-items-center u-flex-justify-center">
        <WelcomeDialogItem
          icon={CheckSquareIcon}
          title={t('welcome.item1.title')}
          description={t('welcome.item1.description')}
        />
        <WelcomeDialogItem
          icon={NewIcon}
          title={t('welcome.item2.title')}
          description={t('welcome.item2.description')}
        />
        <WelcomeDialogItem
          icon={FileIcon}
          title={t('welcome.item3.title')}
          description={t('welcome.item3.description')}
        />
      </div>

      <div className="u-mt-3 u-flex u-flex-row u-flex-items-center u-flex-justify-center">
        <Button
          variant="primary"
          label={t('welcome.start')}
          endIcon={<Icon icon={NextIcon} className="u-ml-half" />}
          onClick={() => {
            setStep(1)
          }}
          className="u-ml-half"
        />
      </div>
    </div>
  )
}

const WelcomeCreateSubject = ({ setStep, onClose }) => {
  const { t } = useI18n()
  const client = useClient()
  const { showAlert } = useAlert()

  const subjectInputRef = React.useRef(null)
  const [subjectName, setSubjectName] = React.useState('')

  const saveSubject = async () => {
    await newSubject(client, subjectName)
      .then(() => {
        showAlert({
          message: t('subjects.alerts.created'),
          severity: 'success'
        })
        onClose()
        return true
      })
      .catch(() => {
        showAlert({
          message: t('subjects.alerts.error'),
          severity: 'error'
        })
        return false
      })
  }

  return (
    <div className="u-p-2">
      <Typography
        variant="h2"
        color="textPrimary"
        align="center"
        className="u-pt-1"
      >
        {t('welcome.createSubject.title')}
      </Typography>
      <Typography
        variant="body1"
        color="textSecondary"
        align="center"
        className="u-mt-half"
      >
        {t('welcome.createSubject.message')}
      </Typography>

      <div className="u-mt-3">
        <TextField
          ref={subjectInputRef}
          value={subjectName}
          onChange={e => setSubjectName(e.target.value)}
          fullWidth
          autoFocus
          variant="outlined"
          label={t('subjects.input.name.label')}
          placeholder={t('subjects.input.name.placeholder')}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              saveSubject()
              e.stopPropagation()
            }
          }}
        />
      </div>

      <div className="u-mt-3 u-flex u-flex-row u-flex-items-center u-flex-justify-center">
        <Button
          variant="secondary"
          label={t('back')}
          onClick={() => {
            setStep(0)
          }}
          className="u-ml-half"
        />
        <Button
          variant="primary"
          label={t('welcome.end')}
          endIcon={<Icon icon={NextIcon} className="u-ml-half" />}
          onClick={() => {
            saveSubject()
          }}
          className="u-ml-half"
        />
      </div>
    </div>
  )
}

const WelcomeDialogItem = ({ icon, title, description }) => {
  return (
    <div className="u-w-100 u-m-half u-flex u-flex-column u-flex-items-center u-flex-justify-center">
      <Icon
        color="var(--primaryColor)"
        size={32}
        icon={icon}
        className="u-mb-1"
      />
      <Typography align="center" variant="h4">
        {title}
      </Typography>
      <Typography
        align="center"
        variant="body1"
        color="textSecondary"
        className="u-mt-half"
      >
        {description}
      </Typography>
    </div>
  )
}

export default WelcomeDialog
