import * as ActionTypes from '../actions/types'
import * as util from './util'
import { deviceObject } from './devices'

const initialObjectState = {
  id: '',
  user_id: '',
  device_id: '',
  kind: 0,
  status: 0,
  address: '',
  text: '',
  timestamp: null,
  retry_count: 0,
  created_at: '',
  updated_at: '',

  device: deviceObject,
}

export const messageObject = initialObjectState

export const inboxSearch = util.createSearchReducer(ActionTypes.INBOX.SEARCH)
export const inbox = util.createEntityReducer(
  initialObjectState,
  ActionTypes.INBOX,
  util.formatObjectMeta
)

export const outboxSearch = util.createSearchReducer(ActionTypes.OUTBOX.SEARCH)
export const outbox = util.createEntityReducer(
  initialObjectState,
  ActionTypes.OUTBOX,
  util.formatObjectMeta
)
