import * as ActionTypes from '../actions/types'
import { formatError, formatObjectMeta } from './util'

export function login(
  state = {
    auth: null,
    fetching: false,
    error: null,
  },
  action
) {
  switch (action.type) {
    case ActionTypes.LOGIN.REQUEST:
      return {
        ...state,
        fetching: true,
        error: null,
      }
    case ActionTypes.LOGIN.SUCCESS:
      return {
        ...state,
        fetching: false,
        error: null,
        auth: action.auth,
      }
    case ActionTypes.LOGIN.FAILURE:
      return {
        ...state,
        fetching: false,
        error: formatError(action.error),
      }
    default:
      return state
  }
}

export function profile(
  state = {
    data: {
      id: '',
      email: '',
      first_name: '',
      last_name: '',
      created_at: '',
      updated_at: '',
    },
    fetching: false,
    error: null,
  },
  action
) {
  switch (action.type) {
    case ActionTypes.PROFILE.REQUEST:
      return {
        ...state,
        fetching: true,
        error: null,
      }
    case ActionTypes.PROFILE.SUCCESS:
      return {
        ...state,
        fetching: false,
        error: null,
        data: formatObjectMeta(action.data),
      }
    case ActionTypes.PROFILE.FAILURE:
      return {
        ...state,
        fetching: false,
        error: formatError(action.error),
      }
    default:
      return state
  }
}
