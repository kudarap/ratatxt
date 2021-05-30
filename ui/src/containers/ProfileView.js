import React from 'react'
import { connect } from 'react-redux'

import { profile, notify } from '../actions'
import ProfileForm from '../components/ProfileForm'

function ProfileView(props) {
  // Dispatch actions.
  const { getProfile, notifyError } = props

  // Gets initial data on open.
  React.useEffect(() => {
    getProfile()
  }, [getProfile])

  // Handle error message.
  const { error } = props
  React.useEffect(() => {
    if (error === null) {
      return
    }

    notifyError(error)
  }, [notifyError, error])

  const { data, fetching } = props
  return <ProfileForm data={data} loading={fetching} />
}

const mapStateToProps = ({ profile }) => ({
  data: profile.data,
  fetching: profile.fetching,
  error: profile.error,
})

const mapDispatchToProps = dispatch => ({
  getProfile: () => dispatch(profile.request()),
  notifyError: text => dispatch(notify.error(text)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView)
