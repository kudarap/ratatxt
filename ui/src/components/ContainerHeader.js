import React from 'react'
import PropTypes from 'prop-types'

import Typography from './Typography'

function ContainerHeader({ title, ...other }) {
  return (
    <Typography medium variant="h5" color="textPrimary" {...other}>
      {title}
    </Typography>
  )
}

ContainerHeader.propTypes = {
  title: PropTypes.string.isRequired,
}

export default ContainerHeader
