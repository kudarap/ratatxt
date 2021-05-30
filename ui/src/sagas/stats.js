import { all, call, put, takeLatest } from 'redux-saga/effects'
import querystring from 'querystring'

import Local from '../services/local'
import * as Api from '../services/api'
import * as Actions from '../actions'
import { STATS_MESSAGE_COUNTER, STATS_MESSAGE_GRAPH, STATS_OUTBOX_GRAPH } from '../actions/types'

function* getStatsWithCache(cacheKey, entity, apiFn, { scope, nocache }) {
  const cacheTTL = 60 * 5
  cacheKey = `${cacheKey}/${querystring.stringify(scope)}`

  // Check for cached data.
  let result = Local.get(cacheKey)
  if (result !== null && !nocache) {
    yield put(entity.success(result))
    return
  }

  // Request for updated one.
  try {
    result = yield call(apiFn, scope, nocache)
  } catch (e) {
    yield put(entity.failure(e.message))
    return
  }

  // Save it on cache when it has result.
  if (result.data && result.data.length !== 0) {
    Local.save(cacheKey, result, cacheTTL)
  }
  yield put(entity.success(result))
}

const statsMessageCounter = getStatsWithCache.bind(
  null,
  'stats_message_counter',
  Actions.statsMessageCounter,
  Api.statsMessageCounter
)
const statsMessageGraph = getStatsWithCache.bind(
  null,
  'stats_message_graph',
  Actions.statsMessageGraph,
  Api.statsMessageGraph
)
const statsOutboxGraph = getStatsWithCache.bind(
  null,
  'stats_outbox_graph',
  Actions.statsOutboxGraph,
  Api.statsOutboxGraph
)

// eslint-disable-next-line import/no-anonymous-default-export
export default function* () {
  yield all([
    takeLatest(STATS_MESSAGE_COUNTER.REQUEST, statsMessageCounter),
    takeLatest(STATS_MESSAGE_GRAPH.REQUEST, statsMessageGraph),
    takeLatest(STATS_OUTBOX_GRAPH.REQUEST, statsOutboxGraph),
  ])
}
