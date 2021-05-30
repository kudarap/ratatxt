import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'

import Typography from '../components/Typography'
import Link from '../components/Link'
import Login from '../containers/Login'

const useStyles = makeStyles(theme => ({
  paper: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    padding: theme.spacing(3),
  },
}))

export default function LoginPage() {
  const classes = useStyles()
  return (
    <Container maxWidth="xs">
      <br />
      <Paper className={classes.paper}>
        <Typography component="h2" variant="h6" color="textPrimary">
          Sign in with your account
        </Typography>
        <Login />
      </Paper>
      <Typography align="center" color="textPrimary" hidden>
        Don't have an account? <Link to="/register">Sign Up</Link>
      </Typography>
    </Container>
  )
}
