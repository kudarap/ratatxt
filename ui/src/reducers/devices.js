import * as ActionTypes from '../actions/types'
import * as util from './util'

const initialObjectState = {
  id: '',
  user_id: '',
  name: '',
  address: '',
  status: 0,
  last_active: null,
  created_at: '',
  updated_at: '',
}

export const deviceObject = initialObjectState

export const deviceSearch = util.createSearchReducer(ActionTypes.DEVICE.SEARCH)
export const device = util.createEntityReducer(
  initialObjectState,
  ActionTypes.DEVICE,
  util.formatObjectMeta
)
