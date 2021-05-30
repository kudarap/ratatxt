import {
  action,
  createGenericEntityActions,
  createGenericSearchActions,
  createGenericStatsActions,
} from './util'

import {
  APP_NOTIFY,
  APP_SETTINGS_GET,
  APP_SETTINGS_SET,
  LOGIN,
  PROFILE,
  USER,
  VERSION,
  DEVICE,
  INBOX,
  OUTBOX,
  WEBHOOK,
  APPKEY,
  STATS_MESSAGE_COUNTER,
  STATS_MESSAGE_GRAPH,
  STATS_OUTBOX_GRAPH,
} from './types'

// ---------------------------- Application Actions ----------------------------
export const notify = {
  success: text => action(APP_NOTIFY, { kind: 'success', text }),
  error: text => action(APP_NOTIFY, { kind: 'error', text }),
  info: text => action(APP_NOTIFY, { kind: 'info', text }),
  warning: text => action(APP_NOTIFY, { kind: 'warning', text }),
  clear: () => action(APP_NOTIFY, { kind: 'clear', text: '' }),
}

export const appSettings = {
  set: settings => action(APP_SETTINGS_SET, settings),
  get: () => action(APP_SETTINGS_GET),
}

// ---------------------------- Service Actions ----------------------------
export const login = {
  request: (email, password) => action(LOGIN.REQUEST, { email, password }),
  success: auth => action(LOGIN.SUCCESS, { auth }),
  failure: error => action(LOGIN.FAILURE, { error }),
}

export const profile = {
  request: () => action(PROFILE.REQUEST),
  success: data => action(PROFILE.SUCCESS, { data }),
  failure: error => action(PROFILE.FAILURE, { error }),
}

export const version = {
  request: () => action(VERSION.REQUEST),
  success: data => action(VERSION.SUCCESS, { data }),
  failure: error => action(VERSION.FAILURE, { error }),
}

export const userSearch = createGenericSearchActions(USER.SEARCH)
export const [userGet, userCreate, userUpdate, , userClear] = createGenericEntityActions(USER)

export const deviceSearch = createGenericSearchActions(DEVICE.SEARCH)
export const [deviceGet, deviceCreate, deviceUpdate, , deviceClear] = createGenericEntityActions(
  DEVICE
)

export const inboxSearch = createGenericSearchActions(INBOX.SEARCH)
export const [inboxGet, inboxCreate, , , inboxClear] = createGenericEntityActions(INBOX)

export const outboxSearch = createGenericSearchActions(OUTBOX.SEARCH)
export const [outboxGet, outboxCreate, , , outboxClear] = createGenericEntityActions(OUTBOX)

export const webhookSearch = createGenericSearchActions(WEBHOOK.SEARCH)
export const [
  webhookGet,
  webhookCreate,
  webhookUpdate,
  webhookDelete,
  webhookClear,
] = createGenericEntityActions(WEBHOOK)

export const appkeySearch = createGenericSearchActions(APPKEY.SEARCH)
export const [appkeyGet, appkeyCreate, , appkeyDelete, appkeyClear] = createGenericEntityActions(
  APPKEY
)

export const statsMessageCounter = createGenericStatsActions(STATS_MESSAGE_COUNTER)
export const statsMessageGraph = createGenericStatsActions(STATS_MESSAGE_GRAPH)
export const statsOutboxGraph = createGenericStatsActions(STATS_OUTBOX_GRAPH)
