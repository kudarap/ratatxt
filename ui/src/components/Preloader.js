import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'

function Preloader({ open }) {
  if (!open) {
    return null
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <CircularProgress style={{ visibility: open ? 'visible' : 'hidden' }} />
    </div>
  )
}

Preloader.defaultProps = {
  open: false,
}

Preloader.propTypes = {
  open: PropTypes.bool,
}

export default Preloader
