import React from 'react'
import { useNavigate } from 'react-router-dom'

import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import PreviousIcon from 'cozy-ui/transpiled/react/Icons/Previous'

const TabTitle = ({ children, trailing, backEnabled = false }) => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="u-flex u-flex-items-start u-p-2">
      <div className="u-flex u-flex-row u-flex-justify-center u-flex-grow-1">
        {backEnabled && (
          <IconButton
            className="u-p-0 u-mr-1 u-w-2 u-h-2"
            style={{ marginTop: -2 }}
            onClick={handleBack}
          >
            <Icon icon={PreviousIcon} />
          </IconButton>
        )}
        <div className="u-flex u-flex-column u-flex-justify-center u-flex-grow-1">
          <div className="u-w-100">{children}</div>
        </div>
      </div>
      <div className="u-flex u-flex-items-center">{trailing}</div>
    </div>
  )
}

export default TabTitle
