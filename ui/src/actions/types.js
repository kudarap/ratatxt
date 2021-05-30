import { createEntityActionTypes, createRequestTypes } from './util'

export const APP_NOTIFY = 'APP_NOTIFY'
export const APP_SETTINGS_SET = 'APP_SETTINGS_SET'
export const APP_SETTINGS_GET = 'APP_SETTINGS_GET'

export const REGISTER = createRequestTypes('REGISTER')
export const LOGIN = createRequestTypes('LOGIN')
export const PROFILE = createRequestTypes('PROFILE')
export const VERSION = createRequestTypes('VERSION')

// Generic entity method and its action types.
export const USER = createEntityActionTypes('USER')
export const DEVICE = createEntityActionTypes('DEVICE')
export const INBOX = createEntityActionTypes('INBOX')
export const OUTBOX = createEntityActionTypes('OUTBOX')
export const WEBHOOK = createEntityActionTypes('WEBHOOK')
export const APPKEY = createEntityActionTypes('APPKEY')

export const STATS_MESSAGE_COUNTER = createRequestTypes('STATS_MESSAGE_COUNTER')
export const STATS_MESSAGE_GRAPH = createRequestTypes('STATS_MESSAGE_GRAPH')
export const STATS_OUTBOX_GRAPH = createRequestTypes('STATS_OUTBOX_GRAPH')
