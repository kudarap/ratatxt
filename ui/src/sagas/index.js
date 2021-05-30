import { all } from 'redux-saga/effects'

import auth from './auth'
import version from './version'
import users from './users'
import devices from './devices'
import messages from './messages'
import webhooks from './webhooks'
import appkeys from './appkeys'
import stats from './stats'

// notice how we now only export the rootSaga, single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([auth(), version(), users(), devices(), messages(), webhooks(), appkeys(), stats()])
}
