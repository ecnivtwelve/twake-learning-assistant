import React from 'react'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import Typography from 'cozy-ui/transpiled/react/Typography'

import FilterChip from '@/components/FilterChip/FilterChip'
import TabTitle from '@/components/TabTitle/TabTitle'

const InsightsTab = () => {
  const { t } = useI18n()

  const [filters] = React.useState({
    subjects: {
      label: t('subjects'),
      values: []
    },
    level: {
      label: t('level'),
      values: []
    },
    class: {
      label: t('classes_and_groups'),
      values: []
    },
    periods: {
      label: t('periods'),
      values: []
    },
    activities: {
      label: t('activities_filter'),
      values: []
    }
  })

  return (
    <>
      <TabTitle>
        <Typography variant="h3">{t('insights')}</Typography>

        <div className="u-flex u-mt-1">
          {Object.entries(filters).map(([key, filter]) => (
            <FilterChip key={key} label={filter.label} />
          ))}
        </div>
      </TabTitle>
    </>
  )
}

export default InsightsTab
