import classNames from 'classnames'
import React from 'react'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import NewIcon from 'cozy-ui/transpiled/react/Icons/New'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import UploadIcon from 'cozy-ui/transpiled/react/Icons/Upload'

import Menu from 'cozy-ui/transpiled/react/Menu'
import MenuItem from 'cozy-ui/transpiled/react/MenuItem'
import List from 'cozy-ui/transpiled/react/List'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import FilterChip from '@/components/FilterChip/FilterChip'
import TabTitle from '@/components/TabTitle/TabTitle'
import styles from '@/styles/item-view.styl'
import Divider from 'cozy-ui/transpiled/react/Divider'

const ItemHeader = ({
  activityTitle,
  setActivityTitle,
  onRenameActivity,
  onOpenGenerationDialog,
  onOpenImportDialog,
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

  const addButtonRef = React.useRef()
  const [addMenuOpen, setAddMenuOpen] = React.useState(false)

  return (
    <TabTitle
      backEnabled
      trailing={
        <>
          <Button
            variant="primary"
            className="color-learnings"
            label={t('activity.add.add')}
            startIcon={<Icon icon={PlusIcon} />}
            ref={addButtonRef}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={() => setAddMenuOpen(true)}
          />

          <Menu
            open={addMenuOpen}
            anchorEl={addButtonRef.current}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            keepMounted
            onClose={() => setAddMenuOpen(false)}
          >
            {/* TODO: simplifier ce menu */}
            <MenuItem
              onClick={() => {
                setAddMenuOpen(false)
                onOpenImportDialog()
              }}
            >
              <ListItemIcon>
                <Icon icon={UploadIcon} />
              </ListItemIcon>
              <ListItemText
                primary={t('activity.add.select')}
                secondary={t('activity.add.select_description')}
              />
            </MenuItem>
            <Divider className="u-mv-half" />
            <MenuItem
              onClick={() => {
                setAddMenuOpen(false)
                onOpenGenerationDialog()
              }}
            >
              <ListItemIcon>
                <Icon icon={NewIcon} />
              </ListItemIcon>
              <ListItemText primary={t('activity.add.generate')} />
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAddMenuOpen(false)
                onCreateQuestion()
              }}
            >
              <ListItemIcon>
                <Icon icon={PlusIcon} />
              </ListItemIcon>
              <ListItemText primary={t('activity.add.new')} />
            </MenuItem>
          </Menu>
        </>
      }
    >
      <input
        className={classNames(
          'MuiTypography-h3 MuiTypography-colorTextPrimary u-p-0 u-w-100',
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
