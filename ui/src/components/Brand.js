import React from 'react'
import { makeStyles } from '@material-ui/styles'

import Typography from './Typography'
import logo from '../logo.png'

const useStyles = makeStyles(theme => ({
  text: {
    marginTop: theme.spacing(5),
    fontSize: 32,
    fontWeight: theme.typography.fontWeightBold,
  },
  logo: {
    height: 40,
    marginRight: 10,
    marginBottom: -10,
  },
}))

function Brand(props) {
  const classes = useStyles()
  return (
    <Typography
      {...props}
      component="h1"
      variant="body"
      align="center"
      color="textSecondary"
      className={classes.text}>
      <img src={logo} alt="logo" className={classes.logo} />
      Ratatxt Console
    </Typography>
  )
}

export default Brand
