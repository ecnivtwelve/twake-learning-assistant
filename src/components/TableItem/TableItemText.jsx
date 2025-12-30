import cx from 'classnames'
import React from 'react'

import Chip from 'cozy-ui/transpiled/react/Chips'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

const TYPE_CONFIGS = {
  primary: {
    widthClass: 'u-w-5 u-w-4-s',
    typography: { noWrap: true }
  },
  secondary: {
    widthClass: 'u-w-1 u-w-half-s',
    typography: { color: 'textSecondary', noWrap: true }
  },
  chip: {
    widthClass: 'u-w-1',
    renderValue: value =>
      value.map((v, i) => <Chip key={i} label={v} className="u-mr-half" />)
  },
  colouredValue: {
    widthClass: 'u-w-1',
    renderValue: value => (typeof value === 'number' ? `${value}%` : value),
    getTypography: value => {
      const numValue = parseFloat(value)
      const threshold = numValue > 1 ? 70 : 0.7
      const isLow = numValue < threshold

      return {
        style: {
          color: isLow ? '#CB8100' : '#09AE1C',
          fontWeight: 600
        }
      }
    }
  }
}

const TableItemText = ({
  value,
  type,
  className,
  typographyProps,
  ...restProps
}) => {
  const config = TYPE_CONFIGS[type] || {}

  const content = config.renderValue ? config.renderValue(value) : value

  const primaryTypographyProps = {
    ...config.typography,
    ...(config.getTypography ? config.getTypography(value) : {}),
    ...typographyProps
  }

  return (
    <ListItemText
      primary={content}
      className={cx(config.widthClass, className)}
      primaryTypographyProps={primaryTypographyProps}
      {...restProps}
    />
  )
}

export default TableItemText
