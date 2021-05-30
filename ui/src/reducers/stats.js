import * as ActionTypes from '../actions/types'
import * as util from './util'

const initialObjectState = {
  inbox: 0,
  outbox: 0,
  outbox_error: 0,
  outbox_failed: 0,
  outbox_queued: 0,
  outbox_sending: 0,
  outbox_sent: 0,
  total: 0,
}

export const statsMessageCounter = createStatsReducer(
  ActionTypes.STATS_MESSAGE_COUNTER,
  initialObjectState
)

export const statsMessageGraph = createStatsReducer(ActionTypes.STATS_MESSAGE_GRAPH)
export const statsOutboxGraph = createStatsReducer(ActionTypes.STATS_OUTBOX_GRAPH)

// Creates basic stats reducer.
function createStatsReducer({ REQUEST, SUCCESS, FAILURE }, initData = []) {
  return function (
    state = {
      scope: null,
      nocache: false,
      data: initData,
      updated_at: null,
      fetching: false,
      error: null,
    },
    action
  ) {
    switch (action.type) {
      case REQUEST:
        const { scope, nocache } = action
        return {
          ...state,
          fetching: true,
          error: null,
          scope,
          nocache,
        }
      case SUCCESS:
        const { data, updated_at } = action.result
        return {
          ...state,
          fetching: false,
          error: null,
          data,
          updated_at,
        }
      case FAILURE:
        return {
          ...state,
          fetching: false,
          error: util.formatError(action.error),
        }
      default:
        return state
    }
  }
}
