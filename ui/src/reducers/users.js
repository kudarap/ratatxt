import * as ActionTypes from '../actions/types'
import * as util from './util'

export const userObject = {
  id: '',
  first_name: '',
  last_name: '',
  email: '',
  status: '',
  created_at: '',
  updated_at: '',
}

const initialObjectState = userObject

const formatObject = o => {
  o = util.formatObjectMeta(o)
  return o
}

export const user = util.createEntityReducer(initialObjectState, ActionTypes.USER, formatObject)

export const userSearch = util.createSearchReducer(ActionTypes.USER.SEARCH)

export default userObject
