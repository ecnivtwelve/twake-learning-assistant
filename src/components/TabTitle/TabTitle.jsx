import React from 'react'

const TabTitle = ({ children, trailing }) => {
  return (
    <div className="u-flex u-flex-items-start u-p-2">
      <div className="u-flex u-flex-column u-flex-justify-center u-flex-grow-1">{children}</div>
      <div className="u-flex u-flex-items-center">{trailing}</div>
    </div>
  )
}

export default TabTitle
