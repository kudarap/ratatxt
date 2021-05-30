import React from 'react'
import { connect } from 'react-redux'

import { settingGet, settingCreate, notify } from '../actions'
import SettingsView from '../components/SettingView'

function Setting(props) {
  // Gets initial data get on open.
  const { getSettings } = props
  React.useEffect(() => {
    getSettings()
  }, [getSettings])

  // Handle error message.
  const { error, notifyError } = props
  React.useEffect(() => {
    if (error === null) {
      return
    }

    notifyError(error)
  }, [notifyError, error])

  const [submitted, setSubmitted] = React.useState(false)
  // Handle submit payload.
  function handleSubmit(payload) {
    setSettings(payload)
    setSubmitted(true)
  }
  // Handle successful update.
  const { setSettings, object, notifySuccess } = props
  React.useEffect(() => {
    if (error === null && submitted === true) {
      notifySuccess('System settings successfully updated!')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifySuccess, object])

  const { fetching } = props
  return <SettingsView data={object} loading={fetching} onSubmit={handleSubmit} />
}

const mapStateToProps = ({ setting }) => ({
  object: setting.object,
  fetching: setting.fetching,
  error: setting.error,
})

const mapDispatchToProps = dispatch => ({
  getSettings: () => dispatch(settingGet.request()),
  setSettings: payload => dispatch(settingCreate.request(payload)),
  notifyError: text => dispatch(notify.error(text)),
  notifySuccess: text => dispatch(notify.success(text)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Setting)
