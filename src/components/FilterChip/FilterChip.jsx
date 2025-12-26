import React from 'react'

import ActionsMenuMobileHeader from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuMobileHeader'
import ActionsMenuWrapper from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuWrapper'
import Chip from 'cozy-ui/transpiled/react/Chips'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DropdownIcon from 'cozy-ui/transpiled/react/Icons/Dropdown'
import Typography from 'cozy-ui/transpiled/react/Typography'

const FilterChip = ({ children, label, chipProps }) => {
  const anchorRef = React.useRef(null)

  const [state, setState] = React.useState({
    showMenu: false
  })

  const toggleMenu = () => {
    setState({
      showMenu: !state.showMenu
    })
  }

  const hideMenu = () => {
    setState({
      showMenu: false
    })
  }

  return (
    <>
      <Chip
        label={label}
        clickable={children ? true : false}
        onDelete={children ? () => {} : undefined}
        deleteIcon={children ? <Icon icon={DropdownIcon} /> : undefined}
        className="u-mr-half"
        ref={anchorRef}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={children ? toggleMenu : undefined}
        {...chipProps}
      />

      <ActionsMenuWrapper
        open={state.showMenu}
        anchorEl={anchorRef.current}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        keepMounted
        autoClose
        onClose={hideMenu}
      >
        <ActionsMenuMobileHeader>
          <Typography variant="h4">{label}</Typography>
        </ActionsMenuMobileHeader>

        {children}
      </ActionsMenuWrapper>
    </>
  )
}

export default FilterChip
