import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import * as actions from '../actions'

export default function withUpdate(Component, entity, successMessage = `successfully updated!`) {
  function View(props) {
    const { id } = useParams()
    const [submitted, setSubmitted] = React.useState(false)

    // Gets initial data on mount.
    const { get, reload } = props
    React.useEffect(() => {
      if (id === undefined) {
        return
      }

      return () => {
        get(id)
        reload()
      }
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [object])

    const { update } = props
    const handleSubmit = payload => {
      setSubmitted(true)
      update(id, payload)
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
  const updateFn = actions[entity + 'Update']
  const searchFn = actions[entity + 'Search']
  const mapDispatchToProps = dispatch => ({
    get: id => dispatch(getFn.request(id)),
    update: (id, payload) => dispatch(updateFn.request(id, payload)),
    reload: () => dispatch(searchFn.reload()),
    notifySuccess: text => dispatch(actions.notify.success(text)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(View)
}
