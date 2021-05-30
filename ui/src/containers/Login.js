import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { login } from '../actions'
import { appLogin } from '../services/app'
import LoginForm from '../components/LoginForm'

function Login({ dispatch, auth, loading, error }) {
  function handleSubmit(email, password) {
    dispatch(login.request(email, password))
  }

  React.useEffect(() => {
    if (auth != null) {
      appLogin(auth)
    }
  }, [auth])

  return <LoginForm onSubmit={handleSubmit} errorText={error} loading={loading} />
}

Login.propTypes = {
  // Injected props by react-redux.
  dispatch: PropTypes.func.isRequired,
  // Login object reducer state.
  auth: PropTypes.object,
  fetching: PropTypes.bool,
  error: PropTypes.string,
}

const mapStateToProps = ({ login }) => ({
  auth: login.auth,
  loading: login.fetching,
  error: login.error,
})

export default connect(mapStateToProps)(Login)
