import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actions from '../actions'

const initDefaultFilter = {
  meta: true,
  page: 1,
  limit: 10,
  sort: 'updated_at:desc',
}

export default function withDataTable(Component, entity, disableInitFetch = false) {
  function TableWrapper(props) {
    // Default filter will be use for reset.
    const defaultFilter = { ...initDefaultFilter, ...props.defaultFilter }

    const { search } = props
    React.useEffect(() => {
      if (disableInitFetch) {
        return
      }

      search(defaultFilter)

      // return () => search({})
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { notifyError, error } = props
    React.useEffect(() => {
      if (error === null) {
        return
      }

      notifyError(error)
    }, [notifyError, error])

    const { reload, fetching } = props
    return (
      <Component
        {...props}
        onSearch={search}
        defaultFilter={defaultFilter}
        // Search toolbar props.
        fetching={fetching}
        onReload={reload}
      />
    )
  }

  TableWrapper.propTypes = {
    schema: PropTypes.arrayOf(PropTypes.object),
    filterOptions: PropTypes.arrayOf(PropTypes.object),
    defaultFilter: PropTypes.object,
  }

  TableWrapper.defaultProps = {
    filterOptions: [],
    defaultFilter: {},
  }

  const mapStateToProps = reducers => ({
    filter: reducers[entity].filter,
    data: reducers[entity].data,
    meta: reducers[entity].meta,
    fetching: reducers[entity].fetching,
    error: reducers[entity].error,
  })

  const mapDispatchToProps = dispatch => ({
    search: filter => dispatch(actions[entity].request(filter)),
    reload: () => dispatch(actions[entity].reload()),
    notifyError: text => dispatch(actions.notify.error(text)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(withRouter(TableWrapper))
}
