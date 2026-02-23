import React from 'react'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'

const SourcesTabHeader = ({ onNewSource }) => {
  const { t } = useI18n()

  return (
    <div>
      <Button
        variant="primary"
        label={t('new')}
        startIcon={<Icon icon={PlusIcon} />}
        onClick={onNewSource}
      />
    </div>
  )
}

export default SourcesTabHeader
