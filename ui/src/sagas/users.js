import { all, call, put, takeLatest } from 'redux-saga/effects'

import {
  // getEntity,
  patchEntity,
  postEntity,
  reloadSearchEntityWithCache,
  searchEntityWithCache,
} from './util'
import * as Api from '../services/api'
import * as Actions from '../actions'
import { USER } from '../actions/types'

const cacheKey = 'user-search'
const search = searchEntityWithCache.bind(null, cacheKey, Actions.userSearch, Api.userSearch)
const reloadSearch = reloadSearchEntityWithCache.bind(
  null,
  cacheKey,
  Actions.userSearch,
  state => state.userSearch
)

// const get = getEntity.bind(null, Actions.userGet, Api.user.GET)

function* getWithSettings({ id }) {
  try {
    const result = yield call(Api.user.GET, id)
    yield put(Actions.userGet.success(result))
  } catch (e) {
    yield put(Actions.userGet.failure(e.message))
  }
}

const create = postEntity.bind(null, Actions.userCreate, Api.user.POST)
const update = patchEntity.bind(null, Actions.userUpdate, Api.user.PATCH)

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([
    takeLatest(USER.SEARCH.REQUEST, search),
    takeLatest(USER.SEARCH.RELOAD, reloadSearch),
    takeLatest(USER.GET.REQUEST, getWithSettings),
    takeLatest(USER.CREATE.REQUEST, create),
    takeLatest(USER.UPDATE.REQUEST, update),
  ])
}
