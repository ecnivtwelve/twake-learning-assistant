import React from 'react'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'

import SubjectDropdown from '@/components/Subjects/SubjectDropdown'
import TabTitle from '@/components/TabTitle/TabTitle'

const ActivitiesTab = () => {
  const { t } = useI18n()

  return (
    <>
      <TabTitle
        trailing={
          <Button
            variant="primary"
            label={t('new')}
            startIcon={<Icon icon={PlusIcon} />}
          />
        }
      >
        <SubjectDropdown />
      </TabTitle>
    </>
  )
}

export default ActivitiesTab
