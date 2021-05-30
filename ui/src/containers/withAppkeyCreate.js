import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as actions from '../actions'

export default function withAppkeyCreate(
  Component,
  entity,
  successMessage = `successfully created!`
) {
  function View(props) {
    const [submitted, setSubmitted] = React.useState(false)

    // Handle successful create
    const { object, error, onClose, clear, notifySuccess, reload } = props
    React.useEffect(() => {
      if (error !== null || submitted === false) {
        return
      }

      reload()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notifySuccess, object])

    const { create } = props
    const handleSubmit = payload => {
      setSubmitted(true)
      create(payload)
    }

    const handleClose = () => {
      onClose()
      clear()
    }

    const { loading, ...other } = props
    return (
      <Component
        {...other}
        data={object}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />
    )
  }
  View.propTypes = {
    // Entity props
    object: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,

    // Dialog props
    open: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
  }

  const mapStateToProps = reducers => ({
    object: reducers[entity].object,
    loading: reducers[entity].fetching,
    error: reducers[entity].error,
  })

  const createFn = actions[entity + 'Create']
  const clearFn = actions[entity + 'Clear']
  const searchFn = actions[entity + 'Search']
  const mapDispatchToProps = dispatch => ({
    create: payload => dispatch(createFn.request(payload)),
    clear: () => dispatch(clearFn()),
    reload: () => dispatch(searchFn.reload()),
  })

  return connect(mapStateToProps, mapDispatchToProps)(View)
}
