// WARNING!!!
// RULE! ONLY used this utility file within its folder.

import { call, put, select } from 'redux-saga/effects'
import querystring from 'querystring'

import Local from '../services/local'

// Generic entity search fetch request.
export function* searchEntity(entity, apiFn, { filter }) {
  try {
    const result = yield call(apiFn, filter)
    yield put(entity.success(result))
  } catch (e) {
    yield put(entity.failure(e.message))
  }
}

// Generic reload entity search.
export function* reloadSearchEntity(entity, stateSelector, action) {
  const { filter } = yield select(stateSelector)
  yield put(entity.request(filter))
}

// Generic single entity get request.
export function* getEntity(entity, apiFn, { id }) {
  try {
    const result = yield call(apiFn, id)
    yield put(entity.success(result))
  } catch (e) {
    yield put(entity.failure(e.message))
  }
}

// Generic single entity post request.
export function* postEntity(entity, apiFn, { payload }) {
  try {
    const result = yield call(apiFn, payload)
    yield put(entity.success(result))
  } catch (e) {
    yield put(entity.failure(e.message))
  }
}

// Generic single entity patch request.
export function* patchEntity(entity, apiFn, { id, payload }) {
  try {
    const result = yield call(apiFn, id, payload)
    yield put(entity.success(result))
  } catch (e) {
    yield put(entity.failure(e.message))
  }
}

// Generic single entity delete request.
export function* deleteEntity(entity, apiFn, { id }) {
  try {
    const result = yield call(apiFn, id)
    yield put(entity.success(result))
  } catch (e) {
    yield put(entity.failure(e.message))
  }
}

// Generic entity search fetch request with caching support.
export function* searchEntityWithCache(cacheKey, entity, apiFn, { filter }) {
  const cacheTTL = 60 * 2 // 2 minutes
  cacheKey = `${cacheKey}/${querystring.stringify(filter)}`

  // Check for cached data.
  let result = Local.get(cacheKey)
  if (result !== null) {
    yield put(entity.success(result))
    return
  }

  // Request for updated one.
  try {
    result = yield call(apiFn, filter)
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

// Generic reload entity search with cache invalidation.
export function* reloadSearchEntityWithCache(cacheKey, entity, stateSelector) {
  const { filter } = yield select(stateSelector)

  // Invalidate cache on reload.
  cacheKey = `${cacheKey}/${querystring.stringify(filter)}`
  Local.removeAll(cacheKey)
  yield put(entity.request(filter))
}
