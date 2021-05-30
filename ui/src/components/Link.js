import React from 'react'
import PropTypes from 'prop-types'
import { Link as RLink } from 'react-router-dom'
import Zelda from '@material-ui/core/Link'

function Link(props) {
  return (
    <Zelda {...props} component={RLink}>
      {props.children}
    </Zelda>
  )
}

Link.defaultProps = {
  underline: 'always',
}

Link.propTypes = {
  underline: PropTypes.string,
}

export default Link
