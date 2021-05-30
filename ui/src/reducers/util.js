// WARNING!!!
// RULE! ONLY used this utility file within its folder.

import moment from 'moment'
import { capitalize } from '@material-ui/core'

const dateFormat = 'MMM DD, YYYY - h:mm A'

export function formatObjectMeta(obj) {
  // NOTE! suppressed warning when filling format param.
  moment.suppressDeprecationWarnings = true
  // Modify object meta formats.
  obj.created_at = moment(obj.created_at).format(dateFormat)
  obj.updated_at = moment(obj.updated_at).format(dateFormat)
  return obj
}

export function formatError(err) {
  if (err === null) {
    return 'Something went wrong!'
  }

  return capitalize(err)
}

// Creates basic entity object reducer.
export function createEntityReducer(
  initialObjectState,
  entityActionType,
  objectFormatter = o => o
) {
  const defaultState = {
    object: initialObjectState,
    fetching: false,
    error: null,
  }

  return function (state = defaultState, action) {
    switch (action.type) {
      // API call request actions
      case entityActionType.GET.REQUEST:
      case entityActionType.CREATE.REQUEST:
      case entityActionType.UPDATE.REQUEST:
      case entityActionType.REMOVE.REQUEST:
        return {
          ...state,
          fetching: true,
          error: null,
        }

      // API call success actions
      case entityActionType.GET.SUCCESS:
      case entityActionType.CREATE.SUCCESS:
      case entityActionType.UPDATE.SUCCESS:
      case entityActionType.REMOVE.SUCCESS:
        return {
          ...state,
          object: objectFormatter(action.result),
          fetching: false,
          error: null,
        }

      // API call failure actions
      case entityActionType.GET.FAILURE:
      case entityActionType.CREATE.FAILURE:
      case entityActionType.UPDATE.FAILURE:
      case entityActionType.REMOVE.FAILURE:
        return {
          ...state,
          fetching: false,
          error: formatError(action.error),
        }

      // Reset to default state.
      case entityActionType.CLEAR:
        return defaultState

      default:
        return state
    }
  }
}

// Creates basic search reducer.
export function createSearchReducer({ REQUEST, SUCCESS, FAILURE }) {
  return function (
    state = {
      filter: {},
      fetching: false,
      error: null,
      data: [],
      meta: {
        result_count: 0,
        total_count: 0,
      },
    },
    action
  ) {
    switch (action.type) {
      case REQUEST:
        const { filter } = action
        return {
          ...state,
          fetching: true,
          error: null,
          filter,
        }
      case SUCCESS:
        const { data, result_count, total_count } = action.result
        return {
          ...state,
          fetching: false,
          error: null,
          data: data,
          meta: {
            result_count,
            total_count,
          },
        }
      case FAILURE:
        return {
          ...state,
          fetching: false,
          error: action.error,
        }
      default:
        return state
    }
  }
}

// Create generic request reducer.
export function createRequestReducer(initialObjectState, actionType) {
  const defaultState = {
    object: initialObjectState,
    fetching: false,
    error: null,
  }

  return function (state = defaultState, action) {
    switch (action.type) {
      case actionType.REQUEST:
        return {
          ...state,
          fetching: true,
          error: null,
        }
      case actionType.SUCCESS:
        return {
          ...state,
          fetching: false,
          error: null,
          data: action.data,
        }
      case actionType.FAILURE:
        return {
          ...state,
          fetching: false,
          error: formatError(action.error),
        }
      default:
        return state
    }
  }
}
