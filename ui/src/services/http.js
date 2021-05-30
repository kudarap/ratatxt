import 'isomorphic-fetch'
import querystring from 'querystring'

import * as Auth from './auth'

export const API_HOST = window.API_HOST || process.env.REACT_APP_API_HOST

export const GET = 'GET'
export const POST = 'POST'
export const PATCH = 'PATCH'
export const DELETE = 'DELETE'

const defaultRequestOpts = {
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
}

// Base http request and handles authentication token.
export async function request(method, endpoint, data) {
  let auth = Auth.get()
  if (auth.refresh_token && (Auth.isAccessTokenExpired() || auth.token === null)) {
    const newAuth = await renewToken(auth.refresh_token)
    auth = { ...auth, ...newAuth }
    Auth.set(auth)
  }

  return baseRequest(method, endpoint, data, auth.token || null)
}

export const renewToken = refresh_token => baseRequest(POST, Auth.RENEW_ENDPOINT, { refresh_token })

export function baseRequest(method, endpoint, data, token = null) {
  if (method === '') {
    throw Error('Request method required')
  }

  let opts = { ...defaultRequestOpts, method }
  if (token) {
    opts.headers = { ...opts.headers, Authorization: `Bearer ${token}` }
  }

  if (method !== GET) {
    opts['body'] = JSON.stringify(data)
  }

  return baseFetch(API_HOST + endpoint, opts)
}

// Upload form file with authorization.
export function uploadFile(endpoint, file) {
  // Blob file handling and form data composition.
  let data = new FormData()
  if (file.constructor === Blob) {
    data.append('file', file, file.name)
  } else {
    data.append('file', file)
  }

  let opts = injectAuth({
    method: POST,
    body: data,
  })

  return baseFetch(API_HOST + endpoint, opts)
}

// Inject Authorization header when auth token is present.
function injectAuth(opts) {
  const token = Auth.getAccessToken()
  if (token !== null) {
    opts.headers = { ...opts.headers, Authorization: `Bearer ${token}` }
  }
  return opts
}

// Basic domain object request that supports all request method.
export function baseObjectRequest(endpoint) {
  return {
    [GET]: id => request(GET, `${endpoint}/${id}`),
    [POST]: obj => request(POST, endpoint, obj),
    [PATCH]: (id, obj) => request(PATCH, `${endpoint}/${id}`, obj),
    [DELETE]: id => request(DELETE, `${endpoint}/${id}`),
  }
}

// Basic domain search request.
export function baseSearchRequest(endpoint) {
  return (filter = {}) => request(GET, `${endpoint}?${querystring.stringify(filter)}`)
}

function baseFetch(endpoint, opts) {
  return fetch(endpoint, opts)
    .then(response => {
      // Catch auth error to force logout.
      if (response.status === 401) {
        // Auth.clear()
        // // eslint-disable-next-line no-undef
        // window.location = '/login'
        // throw Error('Authentication error')
        // Catch internal error.
      } else if (response.status === 500) {
        console.log(response)
        throw Error('Something went really bad')
      }

      // Good response data.
      return response.json()
    })
    .then(json => {
      // Handle user error.
      if (!!json.error) {
        throw Error(json.message)
      }

      return json
    })
}
