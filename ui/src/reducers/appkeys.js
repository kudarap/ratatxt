import * as ActionTypes from '../actions/types'
import * as util from './util'

const initialObjectState = {
  id: '',
  user_id: '',
  token: '',
  note: '',
  last_used: null,
  created_at: '',
  updated_at: '',
}

export const appkeyObject = initialObjectState

export const appkeySearch = util.createSearchReducer(ActionTypes.APPKEY.SEARCH)
export const appkey = util.createEntityReducer(
  initialObjectState,
  ActionTypes.APPKEY,
  util.formatObjectMeta
)
