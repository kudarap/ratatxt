import { all, takeLatest } from 'redux-saga/effects'

import {
  getEntity,
  patchEntity,
  postEntity,
  deleteEntity,
  reloadSearchEntityWithCache,
  searchEntityWithCache,
} from './util'
import * as Api from '../services/api'
import * as Actions from '../actions'
import { WEBHOOK } from '../actions/types'

const cacheKey = 'webhook-search'
const search = searchEntityWithCache.bind(null, cacheKey, Actions.webhookSearch, Api.webhookSearch)
const reloadSearch = reloadSearchEntityWithCache.bind(
  null,
  cacheKey,
  Actions.webhookSearch,
  state => state.webhookSearch
)

const get = getEntity.bind(null, Actions.webhookGet, Api.webhook.GET)
const create = postEntity.bind(null, Actions.webhookCreate, Api.webhook.POST)
const update = patchEntity.bind(null, Actions.webhookUpdate, Api.webhook.PATCH)
const remove = deleteEntity.bind(null, Actions.webhookDelete, Api.webhook.DELETE)

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([
    takeLatest(WEBHOOK.SEARCH.REQUEST, search),
    takeLatest(WEBHOOK.SEARCH.RELOAD, reloadSearch),
    takeLatest(WEBHOOK.GET.REQUEST, get),
    takeLatest(WEBHOOK.CREATE.REQUEST, create),
    takeLatest(WEBHOOK.UPDATE.REQUEST, update),
    takeLatest(WEBHOOK.REMOVE.REQUEST, remove),
  ])
}
