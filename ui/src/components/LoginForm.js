import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import Typography from './Typography'
import DialogError from './DialogError'
import Link from './Link'
import Preloader from './Preloader'
import useFormInput from './useFormInput'

const useStyles = makeStyles(theme => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    marginBottom: theme.spacing(1),
  },
}))

function LoginForm({ onSubmit, loading, errorText }) {
  const classes = useStyles()

  const usernameInput = useFormInput('')
  const passwordInput = useFormInput('')

  function handleSubmit(e) {
    e.preventDefault()
    if (loading) {
      return
    }

    onSubmit(usernameInput.value, passwordInput.value)
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Preloader open={loading} />
      <DialogError text={errorText} />
      <TextField
        {...usernameInput}
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username or Email"
        name="username"
        autoComplete="username"
        autoFocus
      />
      <TextField
        {...passwordInput}
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
      />
      <Typography variant="subtitle1" align="right" hidden>
        <Link to="/reset-password" tabIndex="-1">
          Forgot password?
        </Link>
      </Typography>
      <Button
        size="large"
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={loading}
        className={classes.submit}
        sx={{ mt: 2 }}>
        Go
      </Button>
    </form>
  )
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  errorText: PropTypes.string,
  loading: PropTypes.bool,
}

export default LoginForm
