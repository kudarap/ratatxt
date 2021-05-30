import 'isomorphic-fetch'

import * as http from './http'

const // API Endpoints
  LOGIN = '/auth/login',
  PROFILE = '/me',
  USER = '/accounts',
  DEVICE = '/devices',
  MESSAGE = '/messages',
  OUTBOX = '/outbox',
  WEBHOOK = '/webhooks',
  APPKEY = '/appkeys',
  STATS = '/stats',
  VERSION = '/version'

export const login = (username, password) =>
  http.baseRequest(http.POST, LOGIN, { username, password })

export const profile = () => http.request(http.GET, PROFILE)

export const user = http.baseObjectRequest(USER)
export const userSearch = http.baseSearchRequest(USER)

export const device = http.baseObjectRequest(DEVICE)
export const deviceSearch = http.baseSearchRequest(DEVICE)

export const message = http.baseObjectRequest(MESSAGE)
export const messageSearch = http.baseSearchRequest(MESSAGE)
export const sendMessage = payload => http.request(http.POST, OUTBOX, payload)

export const webhook = http.baseObjectRequest(WEBHOOK)
export const webhookSearch = http.baseSearchRequest(WEBHOOK)

export const appkey = http.baseObjectRequest(APPKEY)
export const appkeySearch = http.baseSearchRequest(APPKEY)

export const stats = (kind, scope) => http.request(http.GET, `${STATS}/${kind}/${scope}`)
export const statsMessageCounter = scope => stats('score', scope)
export const statsMessageGraph = scope => stats('messages', scope)
export const statsOutboxGraph = scope => stats('outbox', scope)

export const version = () => http.baseRequest(http.GET, VERSION)
