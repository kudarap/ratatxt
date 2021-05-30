import React from 'react'
import PropTypes from 'prop-types'
import Alert from '@material-ui/core/Alert'

export default function DialogError({ text, ...other }) {
  if (text === null) {
    return null
  }

  return (
    <Alert severity="error" {...other}>
      {text}
    </Alert>
  )
}

DialogError.propTypes = {
  text: PropTypes.string,
}
