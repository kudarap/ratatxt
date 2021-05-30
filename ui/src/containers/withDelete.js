import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import * as actions from '../actions'

export default function withDelete(
  Component,
  entity,
  successMessage = `successfully deleted!`,
  redirectURL = null
) {
  function View(props) {
    const { id } = useParams()
    const history = useHistory()
    const [submitted, setSubmitted] = React.useState(false)

    // Gets initial data on mount.
    const { reload } = props
    React.useEffect(() => {
      if (id === undefined) {
        return
      }

      return () => reload()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Handle successful update notification.
    const { object, error, onClose, notifySuccess } = props
    React.useEffect(() => {
      if (error !== null || submitted === false) {
        return
      }

      setSubmitted(false)
      notifySuccess(successMessage)
      reload()
      onClose()
      if (redirectURL) {
        history.push(redirectURL)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [object])

    const { remove } = props
    const handleSubmit = payloadID => {
      setSubmitted(true)
      remove(payloadID)
    }

    const { loading, ...other } = props
    return (
      <Component {...other} data={object} loading={loading} error={error} onSubmit={handleSubmit} />
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

  const getFn = actions[entity + 'Get']
  const deleteFn = actions[entity + 'Delete']
  const searchFn = actions[entity + 'Search']
  const mapDispatchToProps = dispatch => ({
    get: id => dispatch(getFn.request(id)),
    remove: id => dispatch(deleteFn.request(id)),
    reload: () => dispatch(searchFn.reload()),
    notifySuccess: text => dispatch(actions.notify.success(text)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(View)
}
