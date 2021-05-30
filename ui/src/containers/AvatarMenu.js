import React from 'react'
import { connect } from 'react-redux'

import { profile, notify } from '../actions'
import Menu from '../components/AvatarMenu'

function AvatarMenu(props) {
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

  const { data } = props
  return <Menu profile={data} />
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

export default connect(mapStateToProps, mapDispatchToProps)(AvatarMenu)
