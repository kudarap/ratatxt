import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as actions from '../actions'

export default function withStatsGraph(Component, entity) {
  function View(props) {
    const [scope, setScope] = React.useState(props.defaultScope)

    // Gets initial data on mount.
    const { get, scope: prevScope } = props
    React.useEffect(() => {
      get(scope, scope !== prevScope)

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [get, scope])

    const { data, updated_at, loading, error, reload } = props
    return (
      <Component
        data={data}
        updated_at={updated_at}
        loading={loading}
        error={error}
        scope={scope}
        onChangeScope={s => setScope(s)}
        onReload={() => reload(scope)}
      />
    )
  }
  View.propTypes = {
    data: PropTypes.any,
    updated_at: PropTypes.any,
    loading: PropTypes.bool,
    error: PropTypes.string,
  }
  View.defaultProps = {
    data: null,
    updated_at: null,
    loading: false,
    error: null,
  }

  const mapStateToProps = reducers => ({
    scope: reducers[entity].scope,
    data: reducers[entity].data,
    updated_at: reducers[entity].updated_at,
    loading: reducers[entity].fetching,
    error: reducers[entity].error,
  })
  const mapDispatchToProps = dispatch => ({
    get: (scope, nocache = false) => dispatch(actions[entity].request(scope, nocache)),
    reload: scope => dispatch(actions[entity].reload(scope)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(View)
}
