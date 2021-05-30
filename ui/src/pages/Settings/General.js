import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

import ColorSettings from '../../containers/ColorSettings'

const useStyles = makeStyles(theme => ({
  paper: {
    overflowX: 'auto',
    marginBottom: theme.spacing(3),
  },
}))

function General() {
  const classes = useStyles()
  return (
    <>
      {/* Theme settings */}
      <Paper className={classes.paper}>
        <ColorSettings />
      </Paper>
    </>
  )
}

export default General
