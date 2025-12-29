import React from 'react'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import Typography from 'cozy-ui/transpiled/react/Typography'

import FilterChip from '@/components/FilterChip/FilterChip'
import TabTitle from '@/components/TabTitle/TabTitle'

const ItemView = () => {
  const { t } = useI18n()

  const [filters] = React.useState({
    subjects: {
      label: t('types'),
      values: []
    },
    level: {
      label: t('sources'),
      values: []
    },
    notion: {
      label: t('notions'),
      values: []
    }
  })

  return (
    <>
      <TabTitle
        backEnabled
        trailing={
          <Button
            variant="primary"
            label={t('new')}
            startIcon={<Icon icon={PlusIcon} />}
          />
        }
      >
        <Typography variant="h3">{t('activity')}</Typography>

        <div className="u-flex u-mt-1">
          {Object.entries(filters).map(([key, filter]) => (
            <FilterChip key={key} label={filter.label} />
          ))}
        </div>
      </TabTitle>
    </>
  )
}

export default ItemView
