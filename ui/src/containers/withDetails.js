import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import * as actions from '../actions'

export default function withDetails(Component, entity) {
  const getFn = actions[entity + 'Get']
  const clearFn = actions[entity + 'Clear']

  function View(props) {
    // Gets initial data on mount.
    const { get, clear } = props
    const { id } = useParams()
    React.useEffect(() => {
      if (id === undefined) {
        return
      }

      get(id)
      return () => clear()
    }, [get, clear, id])

    const { object, loading, error } = props
    return <Component data={object} loading={loading} errorText={error} />
  }

  View.propTypes = {
    object: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
  }

  View.defaultProps = {
    loading: false,
    error: null,
  }

  const mapStateToProps = reducers => ({
    object: reducers[entity].object,
    loading: reducers[entity].fetching,
    error: reducers[entity].error,
  })

  const mapDispatchToProps = dispatch => ({
    get: id => dispatch(getFn.request(id)),
    clear: () => dispatch(clearFn()),
  })

  return connect(mapStateToProps, mapDispatchToProps)(View)
}
