import { all, takeLatest } from 'redux-saga/effects'

import { getEntity } from './util'
import * as Api from '../services/api'
import * as Actions from '../actions'
import { VERSION } from '../actions/types'

const getVersion = getEntity.bind(null, Actions.version, Api.version)

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([takeLatest(VERSION.REQUEST, getVersion)])
}
