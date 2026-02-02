import React from 'react'
import { useI18n } from 'twake-i18n'

import Typography from 'cozy-ui/transpiled/react/Typography'

import FilterChip from '@/components/FilterChip/FilterChip'
import TabTitle from '@/components/TabTitle/TabTitle'

const InsightsTab = () => {
  const { t } = useI18n()

  const [filters] = React.useState({
    subjects: {
      label: t('tags.subjects'),
      values: []
    },
    level: {
      label: t('tags.level'),
      values: []
    },
    class: {
      label: t('tags.classes_and_groups'),
      values: []
    },
    periods: {
      label: t('tags.periods'),
      values: []
    },
    activities: {
      label: t('tags.activities_filter'),
      values: []
    }
  })

  return (
    <>
      <TabTitle>
        <Typography variant="h3">{t('insights.title')}</Typography>

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
