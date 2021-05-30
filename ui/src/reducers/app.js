import * as ActionTypes from '../actions/types'
import * as Local from '../services/local'

export function notify(
  state = {
    kind: '',
    text: '',
  },
  action
) {
  switch (action.type) {
    case ActionTypes.APP_NOTIFY:
      let { kind, text } = action
      // Fixes the transition of kind when
      // closing notif.
      if (kind === 'clear') {
        kind = state.kind
      }

      return { ...state, kind, text }
    default:
      return state
  }
}

const defaultSettings = {
  appearance: 'light',
}

const APP_SETTING_KEY = 'app_settings'

// get localstorage setting.
const storedSettings = Local.get(APP_SETTING_KEY)

const settings = storedSettings || defaultSettings

export function appSettings(state = settings, action) {
  switch (action.type) {
    case ActionTypes.APP_SETTINGS_SET:
      const { appearance } = action

      const nextSettings = {
        ...state,
        appearance,
      }
      // save localstorage setting.
      Local.save(APP_SETTING_KEY, nextSettings)

      return nextSettings
    case ActionTypes.APP_SETTINGS_GET:
    default:
      return state
  }
}
