import classNames from 'classnames'
import React from 'react'
import { useI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import NewIcon from 'cozy-ui/transpiled/react/Icons/New'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import UploadIcon from 'cozy-ui/transpiled/react/Icons/Upload'
import Viewer from 'cozy-viewer'

import Menu from 'cozy-ui/transpiled/react/Menu'
import MenuItem from 'cozy-ui/transpiled/react/MenuItem'
import List from 'cozy-ui/transpiled/react/List'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Chip from 'cozy-ui/transpiled/react/Chips'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'
import FileOutlineIcon from "cozy-ui/transpiled/react/Icons/FileOutline"
import FiletypeTextIcon from 'cozy-ui/transpiled/react/Icons/FiletypeText'

import FilterChip from '@/components/FilterChip/FilterChip'
import TabTitle from '@/components/TabTitle/TabTitle'
import styles from '@/styles/item-view.styl'
import Divider from 'cozy-ui/transpiled/react/Divider'
import { useClient } from 'cozy-client'

const ItemHeader = ({
  activityTitle,
  setActivityTitle,
  onRenameActivity,
  onOpenGenerationDialog,
  onOpenImportDialog,
  onCreateQuestion,
  filters,
  isLoading,
  sources
}) => {
  const { t } = useI18n()
  const titleInputRef = React.useRef()
  const hasAutoFocusedRef = React.useRef(false)
  const client = useClient()

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

  const [openedFile, setOpenedFile] = React.useState({
    files: [],
    index: 0
  })


  return (
    <>
      {openedFile.files.length > 0 && (
        <Viewer
          files={openedFile.files}
          onCloseRequest={() => setOpenedFile({ files: [], index: 0 })}
          currentIndex={openedFile.index}
        />
      )}

      <TabTitle
        backEnabled
        trailing={
          <>
            <Button
              variant="primary"
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

        {sources.length > 0 && (
          <div className="u-flex u-mt-1"
            style={{
              width: "100%",
              overflowX: "scroll",
              maskImage: "linear-gradient(to right, black 90%, transparent 100%)",
            }}
          >
            {sources.map(source => (
              <Chip
                icon={<Icon icon={FiletypeTextIcon} className="u-ml-half" />}
                key={source._id}
                label={source.name}
                className="u-mr-half"
                clickable
                onClick={async () => {
                  const fileId = source.relationships?.file?.data?._id
                  if (!fileId) {
                    return
                  }
                  const query = await client.get('io.cozy.files', fileId)
                  const file = await client.query(query)
                  if (!file.data) {
                    return
                  }
                  setOpenedFile({
                    files: [file.data],
                    index: 0
                  })
                }}
              />
            ))}
          </div>
        )}
      </TabTitle>
    </>
  )
}

export default ItemHeader
