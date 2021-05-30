import { clear, set } from './auth'

export function refreshTo(path) {
  window.location.href = path
}

// appLogin saves auth data and refresh page to /
export const appLogin = auth => {
  set(auth)
  refreshTo('/')
}

// appLogout deletes auth data and refresh page to /
export function appLogout() {
  clear()
  refreshTo('/')
}
