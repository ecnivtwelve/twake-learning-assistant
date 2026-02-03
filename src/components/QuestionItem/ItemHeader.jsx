import classNames from 'classnames'
import React from 'react'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import NewIcon from 'cozy-ui/transpiled/react/Icons/New'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'

import FilterChip from '@/components/FilterChip/FilterChip'
import TabTitle from '@/components/TabTitle/TabTitle'
import styles from '@/styles/item-view.styl'

const ItemHeader = ({
  activityTitle,
  setActivityTitle,
  onRenameActivity,
  onOpenGenerationDialog,
  onCreateQuestion,
  filters,
  isLoading
}) => {
  const { t } = useI18n()
  const titleInputRef = React.useRef()
  const hasAutoFocusedRef = React.useRef(false)

  React.useEffect(() => {
    if (
      !isLoading &&
      activityTitle !== undefined &&
      !hasAutoFocusedRef.current
    ) {
      if (!activityTitle) {
        titleInputRef.current?.focus()
      }
      hasAutoFocusedRef.current = true
    }
  }, [isLoading, activityTitle])

  return (
    <TabTitle
      backEnabled
      trailing={
        <>
          <Button
            variant="secondary"
            label={t('generate')}
            startIcon={<Icon icon={NewIcon} />}
            onClick={onOpenGenerationDialog}
            className="u-mr-1"
          />

          <Button
            variant="primary"
            label={t('new')}
            startIcon={<Icon icon={PlusIcon} />}
            onClick={onCreateQuestion}
          />
        </>
      }
    >
      <input
        className={classNames(
          'MuiTypography-h3 MuiTypography-colorTextPrimary u-p-0',
          styles.itemNameInput
        )}
        ref={titleInputRef}
        type="text"
        placeholder={!isLoading && t('activity.placeholder')}
        value={activityTitle}
        onChange={e => {
          setActivityTitle(e.target.value)
        }}
        onBlur={e => onRenameActivity(e.target.value)}
      />

      <div className="u-flex u-mt-1">
        {Object.entries(filters).map(([key, filter]) => (
          <FilterChip key={key} label={filter.label} />
        ))}
      </div>
    </TabTitle>
  )
}

export default ItemHeader
