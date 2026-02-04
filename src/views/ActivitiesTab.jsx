import React from 'react'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'

import SubjectDropdown from '@/components/Subjects/SubjectDropdown'
import TabTitle from '@/components/TabTitle/TabTitle'
import { useSubject } from '@/context/SubjectContext'

const ActivitiesTab = () => {
  const { t } = useI18n()
  const { selectedSubject } = useSubject()

  return (
    <>
      <TabTitle
        trailing={
          <Button
            variant="primary"
            label={t('new')}
            startIcon={<Icon icon={PlusIcon} />}
            disabled={!selectedSubject}
          />
        }
      >
        <SubjectDropdown />
      </TabTitle>
    </>
  )
}

export default ActivitiesTab
