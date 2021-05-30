import * as ActionTypes from '../actions/types'
import * as util from './util'

const initialObjectState = {
  id: '',
  user_id: '',
  payload_url: '',
  secret: '',
  active: null,
  last_resp_code: 0,
  last_used: null,
  created_at: '',
  updated_at: '',
}

export const webhookObject = initialObjectState

export const webhookSearch = util.createSearchReducer(ActionTypes.WEBHOOK.SEARCH)
export const webhook = util.createEntityReducer(
  initialObjectState,
  ActionTypes.WEBHOOK,
  util.formatObjectMeta
)
