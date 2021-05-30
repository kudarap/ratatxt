// WARNING!!!
// RULE! ONLY used this utility file within its folder.

// Request types
const REQUEST = 'REQUEST'
const SUCCESS = 'SUCCESS'
const FAILURE = 'FAILURE'

// Create formatted action type.
const createType = (base, type) => `${base}_${type}`

// Create request types.
// ex. LOGIN_REQUEST, and so on.
export function createRequestTypes(base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
    acc[type] = createType(base, type)
    return acc
  }, {})
}

// Adds additional RELOAD request types for SEARCH action types.
// ex. USER_SEARCH_REQUEST and USER_SEARCH_RELOAD.
const RELOAD = 'RELOAD'

export function createSearchRequestTypes(base) {
  let types = createRequestTypes(base)
  types[RELOAD] = createType(base, RELOAD)
  return types
}

// Action types
const SEARCH = 'SEARCH'
const GET = 'GET'
const CREATE = 'CREATE'
const UPDATE = 'UPDATE'
const REMOVE = 'REMOVE'
// Entity resetting state action
const CLEAR = 'CLEAR'

// Creates generic entity action types and its request types.
// ex. USER_SEARCH_REQUEST, USER_SEARCH_SUCCESS, and so on for USER_GET_*.
export function createEntityActionTypes(base) {
  return [SEARCH, GET, CREATE, UPDATE, REMOVE, CLEAR].reduce((acc, type) => {
    const baseType = createType(base, type)
    switch (type) {
      case CLEAR:
        acc[type] = createType(base, CLEAR)
        break
      // For generic search action request
      case SEARCH:
        acc[type] = createSearchRequestTypes(baseType)
        break
      default:
        acc[type] = createRequestTypes(baseType)
        break
    }

    return acc
  }, {})
}

// Creates generic search action types and its request types.
// ex. USER_SEARCH_REQUEST, USER_SEARCH_SUCCESS, and so on for USER_GET_*.
export function createSearchActionTypes(base) {
  const baseType = createType(base, SEARCH)
  return createSearchRequestTypes(baseType)
}

// Simple action creator that returns type and its payload.
// ex. { type: "USER_GET", id: "123" }
export function action(type, payload = {}) {
  return { type, ...payload }
}

// Creates generic method actions base on given entity action types.
// ex. userGet, userCreate, userUpdate, and so on.
export function createGenericEntityActions(entity) {
  const entityGet = {
    request: id => action(entity.GET.REQUEST, { id }),
    success: result => action(entity.GET.SUCCESS, { result }),
    failure: error => action(entity.GET.FAILURE, { error }),
  }
  const entityCreate = {
    request: payload => action(entity.CREATE.REQUEST, { payload }),
    success: result => action(entity.CREATE.SUCCESS, { result }),
    failure: error => action(entity.CREATE.FAILURE, { error }),
  }
  const entityUpdate = {
    request: (id, payload) => action(entity.UPDATE.REQUEST, { id, payload }),
    success: result => action(entity.UPDATE.SUCCESS, { result }),
    failure: error => action(entity.UPDATE.FAILURE, { error }),
  }
  const entityRemove = {
    request: id => action(entity.REMOVE.REQUEST, { id }),
    success: result => action(entity.REMOVE.SUCCESS, { result }),
    failure: error => action(entity.REMOVE.FAILURE, { error }),
  }
  const entityClear = () => action(entity.CLEAR)

  return [entityGet, entityCreate, entityUpdate, entityRemove, entityClear]
}

// Creates generic method actions base on given search action types.
export function createGenericSearchActions(entity) {
  return {
    reload: () => action(entity.RELOAD),
    request: filter => action(entity.REQUEST, { filter }),
    success: result => action(entity.SUCCESS, { result }),
    failure: error => action(entity.FAILURE, { error }),
  }
}

export function createGenericStatsActions(entity) {
  return {
    request: (scope, nocache = false) => action(entity.REQUEST, { scope, nocache }),
    reload: scope => action(entity.REQUEST, { scope, nocache: true }),
    success: result => action(entity.SUCCESS, { result }),
    failure: error => action(entity.FAILURE, { error }),
  }
}
