import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import MuiToolbar from '@material-ui/core/Toolbar'

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
    paddingRight: theme.spacing(2),
  },
}))

function Toolbar(props) {
  const classes = useStyles()
  return (
    <MuiToolbar {...props} title="">
      <div className={classes.title}>{props.title}</div>
      {props.children}
    </MuiToolbar>
  )
}

Toolbar.propTypes = {
  title: PropTypes.any,
  children: PropTypes.node,
}

export default Toolbar
