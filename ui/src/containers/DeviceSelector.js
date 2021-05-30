import React from 'react'
import { connect } from 'react-redux'

import { deviceSearch, notify } from '../actions'
import SelectInput from '../components/SelectInput'

function DeviceSelector(props) {
  // Dispatch actions.
  const { getDevices, notifyError } = props

  // Gets initial data on open.
  React.useEffect(() => {
    getDevices()
  }, [getDevices])

  // Handle error message.
  const { error } = props
  React.useEffect(() => {
    if (error === null) {
      return
    }

    notifyError(error)
  }, [notifyError, error])

  const { data, fetching, ...other } = props
  const opts = data.map(device => ({ label: device.name, value: device.id }))
  return (
    <SelectInput
      {...other}
      disabled={fetching}
      label={fetching ? 'Loading...' : 'Select a device'}
      options={opts}
    />
  )
}

const mapStateToProps = ({ deviceSearch }) => ({
  data: deviceSearch.data,
  fetching: deviceSearch.fetching,
  error: deviceSearch.error,
})

const mapDispatchToProps = dispatch => ({
  getDevices: () => dispatch(deviceSearch.request()),
  notifyError: text => dispatch(notify.error(text)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DeviceSelector)
