import { all, takeLatest } from 'redux-saga/effects'

import {
  getEntity,
  patchEntity,
  postEntity,
  reloadSearchEntityWithCache,
  searchEntityWithCache,
} from './util'
import * as Api from '../services/api'
import * as Actions from '../actions'
import { DEVICE } from '../actions/types'

const cacheKey = 'device-search'
const search = searchEntityWithCache.bind(null, cacheKey, Actions.deviceSearch, Api.deviceSearch)
const reloadSearch = reloadSearchEntityWithCache.bind(
  null,
  cacheKey,
  Actions.deviceSearch,
  state => state.deviceSearch
)

const get = getEntity.bind(null, Actions.deviceGet, Api.device.GET)
const create = postEntity.bind(null, Actions.deviceCreate, Api.device.POST)
const update = patchEntity.bind(null, Actions.deviceUpdate, Api.device.PATCH)

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([
    takeLatest(DEVICE.SEARCH.REQUEST, search),
    takeLatest(DEVICE.SEARCH.RELOAD, reloadSearch),
    takeLatest(DEVICE.GET.REQUEST, get),
    takeLatest(DEVICE.CREATE.REQUEST, create),
    takeLatest(DEVICE.UPDATE.REQUEST, update),
  ])
}
