import { all, takeLatest } from 'redux-saga/effects'

import {
  getEntity,
  postEntity,
  deleteEntity,
  reloadSearchEntityWithCache,
  searchEntityWithCache,
} from './util'
import * as Api from '../services/api'
import * as Actions from '../actions'
import { APPKEY } from '../actions/types'

const cacheKey = 'appkey-search'
const search = searchEntityWithCache.bind(null, cacheKey, Actions.appkeySearch, Api.appkeySearch)
const reloadSearch = reloadSearchEntityWithCache.bind(
  null,
  cacheKey,
  Actions.appkeySearch,
  state => state.appkeySearch
)

const get = getEntity.bind(null, Actions.appkeyGet, Api.appkey.GET)
const create = postEntity.bind(null, Actions.appkeyCreate, Api.appkey.POST)
const remove = deleteEntity.bind(null, Actions.appkeyDelete, Api.appkey.DELETE)

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([
    takeLatest(APPKEY.SEARCH.REQUEST, search),
    takeLatest(APPKEY.SEARCH.RELOAD, reloadSearch),
    takeLatest(APPKEY.GET.REQUEST, get),
    takeLatest(APPKEY.CREATE.REQUEST, create),
    takeLatest(APPKEY.REMOVE.REQUEST, remove),
  ])
}
