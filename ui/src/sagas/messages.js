import { all, takeLatest } from 'redux-saga/effects'

import { getEntity, postEntity, reloadSearchEntityWithCache, searchEntityWithCache } from './util'
import * as Api from '../services/api'
import * as Actions from '../actions'
import { INBOX, OUTBOX } from '../actions/types'

const inboxCacheKey = 'inbox-search'
const inboxSearch = searchEntityWithCache.bind(
  null,
  inboxCacheKey,
  Actions.inboxSearch,
  Api.messageSearch
)
const inboxReloadSearch = reloadSearchEntityWithCache.bind(
  null,
  inboxCacheKey,
  Actions.inboxSearch,
  state => state.inboxSearch
)
const inboxGet = getEntity.bind(null, Actions.inboxGet, Api.message.GET)
const inboxCreate = postEntity.bind(null, Actions.inboxCreate, Api.message.POST)

const outboxCacheKey = 'outbox-search'
const outboxSearch = searchEntityWithCache.bind(
  null,
  outboxCacheKey,
  Actions.outboxSearch,
  Api.messageSearch
)
const outboxReloadSearch = reloadSearchEntityWithCache.bind(
  null,
  outboxCacheKey,
  Actions.outboxSearch,
  state => state.outboxSearch
)
const outboxGet = getEntity.bind(null, Actions.outboxGet, Api.message.GET)
const outboxCreate = postEntity.bind(null, Actions.outboxCreate, Api.sendMessage)

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([
    takeLatest(INBOX.SEARCH.REQUEST, inboxSearch),
    takeLatest(INBOX.SEARCH.RELOAD, inboxReloadSearch),
    takeLatest(INBOX.GET.REQUEST, inboxGet),
    takeLatest(INBOX.CREATE.REQUEST, inboxCreate),

    takeLatest(OUTBOX.SEARCH.REQUEST, outboxSearch),
    takeLatest(OUTBOX.SEARCH.RELOAD, outboxReloadSearch),
    takeLatest(OUTBOX.GET.REQUEST, outboxGet),
    takeLatest(OUTBOX.CREATE.REQUEST, outboxCreate),
  ])
}
