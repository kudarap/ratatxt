import React from 'react'
import { makeStyles } from '@material-ui/styles'
import ExploreOff from '@material-ui/icons/ErrorOutline'

import Typography from '../components/Typography'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '60vh',
  },
}))

export default function NotFoundPage() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Typography variant="h1" align="center" color="textSecondary">
        4<ExploreOff style={{ fontSize: 78 }} />4
      </Typography>
      <Typography align="center" color="textSecondary">
        The page you requested does not exist.
      </Typography>
    </div>
  )
}
