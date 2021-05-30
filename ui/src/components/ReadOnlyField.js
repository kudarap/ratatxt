import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'

import { withStyles } from '@material-ui/core/styles'

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'grey',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'grey',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: 'grey',
      },
    },
  },
})(TextField)

function ReadOnlyField(props) {
  return <CssTextField {...props} margin="dense" InputProps={{ readOnly: true }} fullWidth />
}

ReadOnlyField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  multiline: PropTypes.bool,
}

export default ReadOnlyField
