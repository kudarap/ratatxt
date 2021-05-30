import Cookies from 'js-cookie'
import moment from 'moment'

export const RENEW_ENDPOINT = '/auth/renew'

const AUTH_KEY = 'ratatxt-console'
const userIDKey = 'user_id'

export const get = () => {
  return Cookies.getJSON(AUTH_KEY) || {}
}

export const isOk = () => {
  // eslint-disable-next-line no-prototype-builtins
  return get().hasOwnProperty(userIDKey)
}

export const set = data => {
  let opts = null
  if (navigator.userAgent.indexOf('Safari') === -1) {
    opts = { expires: 30, secure: true, sameSite: 'strict' }
  }

  Cookies.set(AUTH_KEY, data, opts)
}

export const clear = () => {
  Cookies.remove(AUTH_KEY)
}

export function getAccessToken() {
  if (!isOk()) {
    return null
  }

  return get()['token'] || null
}

const renewLeeway = 200 // seconds before expiration

export function isAccessTokenExpired() {
  const auth = get()
  return moment(auth.expires_at).diff(moment()) <= renewLeeway
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  isOk,
  set,
  get,
  clear,
}
