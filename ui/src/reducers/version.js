import { VERSION } from '../actions/types'
import { formatError } from './util'

const initialObjectState = {
  production: false,
  tag: '',
  git_commit: '',
  built: '',
}

export default function version(
  state = {
    data: initialObjectState,
    fetching: false,
    error: null,
  },
  action
) {
  switch (action.type) {
    case VERSION.REQUEST:
      return {
        ...state,
        fetching: true,
        error: null,
      }
    case VERSION.SUCCESS:
      return {
        ...state,
        fetching: false,
        error: null,
        data: action.data,
      }
    case VERSION.FAILURE:
      return {
        ...state,
        fetching: false,
        error: formatError(action.error),
      }
    default:
      return state
  }
}
