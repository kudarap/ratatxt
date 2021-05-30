import { combineReducers } from 'redux'

import { appSettings, notify } from './app'
import { login, profile } from './auth'
import version from './version'
import { userSearch, user } from './users'
import { deviceSearch, device } from './devices'
import { inboxSearch, inbox, outboxSearch, outbox } from './messages'
import { webhookSearch, webhook } from './webhooks'
import { appkeySearch, appkey } from './appkeys'
import { statsMessageCounter, statsMessageGraph, statsOutboxGraph } from './stats'

const rootReducer = combineReducers({
  // Application states.
  notify,
  appSettings,
  // Service user states.
  login,
  profile,
  version,
  // Service resource states.
  userSearch,
  user,
  deviceSearch,
  device,
  inboxSearch,
  inbox,
  outboxSearch,
  outbox,
  webhookSearch,
  webhook,
  appkeySearch,
  appkey,
  statsMessageCounter,
  statsMessageGraph,
  statsOutboxGraph,
})

export default rootReducer
