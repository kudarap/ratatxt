import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/styles'
import MuiTypography from '@material-ui/core/Typography'

export default function Typography({ medium, style: propStyle, ...other }) {
  const theme = useTheme()

  const style = { ...propStyle }
  if (medium) {
    style.fontWeight = theme.typography.fontWeightMedium
  }

  return <MuiTypography {...other} style={style} />
}
Typography.defaultProps = {
  medium: false,
}
Typography.propTypes = {
  medium: PropTypes.bool,
}
