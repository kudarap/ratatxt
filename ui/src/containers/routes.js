// public pages
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'

// misc pages
import Account from '../pages/Account'
import Settings from '../pages/Settings'
import Credits from '../pages/Credits'

// private pages
import Overview from '../pages/Overview'
import DeviceList from '../pages/DeviceList'
import DeviceView from '../pages/DeviceView'
import InboxList from '../pages/InboxList'
import InboxView from '../pages/InboxView'
import OutboxView from '../pages/OutboxView'
import OutboxList from '../pages/OutboxList'
import WebhookView from '../pages/WebhookView'
import WebhookList from '../pages/WebhookList'
import AppkeyView from '../pages/AppkeyView'
import AppkeyList from '../pages/AppkeyList'
import SmsGuard from '../pages/SmsGuard'
import Integration from '../pages/Integration'

// compose route object
const r = (path, component) => ({ path, component })

export const privateRoutes = [
  r('/overview', Overview),
  r('/devices/:id', DeviceView),
  r('/devices', DeviceList),
  r('/inbox/:status/:id', InboxView),
  r('/inbox', InboxList),
  r('/outbox/:status/:id', OutboxView),
  r('/outbox', OutboxList),
  r('/webhooks/:id', WebhookView),
  r('/webhooks', WebhookList),
  r('/appkeys/:id', AppkeyView),
  r('/appkeys', AppkeyList),
  r('/account', Account),
  r('/settings', Settings),
  r('/credits', Credits),
  r('/sms-guard', SmsGuard),
  r('/integration', Integration),
]

export const publicRoutes = [r('/login', Login), r('', NotFound)]
