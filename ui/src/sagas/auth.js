import { all, call, put, takeLatest } from 'redux-saga/effects'

import { getEntity } from './util'
import * as Api from '../services/api'
import * as Actions from '../actions'
import { LOGIN, PROFILE } from '../actions/types'

function* requestLogin({ email, password }) {
  try {
    const auth = yield call(Api.login, email, password)

    yield put(Actions.login.success(auth))
  } catch (e) {
    yield put(Actions.login.failure(e.message))
  }
}

const getProfile = getEntity.bind(null, Actions.profile, Api.profile)

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([takeLatest(LOGIN.REQUEST, requestLogin), takeLatest(PROFILE.REQUEST, getProfile)])
}
