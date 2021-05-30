// LocalStorage with cache mechanism.

import crypto from 'crypto'

const store = localStorage
const CACHE_KEY = 'cache'

const hash = data => crypto.createHash('md5').update(data).digest('hex')

const keyPrefix = key => `${CACHE_KEY}:${String(key).split('/').shift()}`

const cKey = key => `${keyPrefix(key)}:${hash(key)}`

const now = () => new Date().getTime()

export function get(key) {
  const item = JSON.parse(store.getItem(cKey(key)))
  if (item === null) {
    return null
  }

  const { data, ttl } = item
  // Return non expiry item.
  if (ttl === null) {
    return data
  }

  // Remove expired item.
  if (isExpired(ttl)) {
    remove(key)
    return null
  }

  return data
}

export function save(key, data, sec = null) {
  // Free up expired items.
  sweep()

  // Skip saving null data
  if (data === null) {
    return
  }

  let ttl = sec
  if (sec !== null) {
    // Converts TTL seconds to milli sec.
    ttl = Number(sec) * 1000
    // and adds now milli sec.
    ttl += now()
  }

  const item = { data, ttl }
  store.setItem(cKey(key), JSON.stringify(item))
}

// remove by exact key.
export function remove(key) {
  store.removeItem(cKey(key))
}

// remove entries with matched prefix key.
export function removeAll(key) {
  matchKeys(keyPrefix(key)).forEach(key => {
    store.removeItem(key)
  })
}

// Checks for expired items and remove them.
function sweep() {
  matchKeys(keyPrefix(CACHE_KEY)).forEach(key => {
    const { ttl } = JSON.parse(store.getItem(key))
    if (!isExpired(ttl)) {
      return
    }

    store.removeItem(key)
  })
}

function matchKeys(prefix) {
  let keys = []
  for (const key in store) {
    if (!store.hasOwnProperty(key)) {
      continue
    }

    if (!key.startsWith(prefix)) {
      continue
    }

    keys.push(key)
  }

  return keys
}

const isExpired = ttl => {
  // Immortal entry do not delete.
  if (ttl === null) {
    return false
  }

  return ttl < now()
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  get,
  save,
  remove,
  removeAll,
}
