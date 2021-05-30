import React from 'react'
import { connect } from 'react-redux'

import { version, notify } from '../actions'
import Form from '../components/ApiVersionForm'

function VersionView(props) {
  // Dispatch actions.
  const { getVersion, notifyError } = props

  // Gets initial data on open.
  React.useEffect(() => {
    getVersion()
  }, [getVersion])

  // Handle error message.
  const { error } = props
  React.useEffect(() => {
    if (error === null) {
      return
    }

    notifyError(error)
  }, [notifyError, error])

  const { data, fetching } = props
  return <Form data={data} loading={fetching} />
}

const mapStateToProps = ({ version }) => ({
  data: version.data,
  fetching: version.fetching,
  error: version.error,
})

const mapDispatchToProps = dispatch => ({
  getVersion: () => dispatch(version.request()),
  notifyError: text => dispatch(notify.error(text)),
})

export default connect(mapStateToProps, mapDispatchToProps)(VersionView)
