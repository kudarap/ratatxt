import Badge, * as badge from '../components/Badge'

export const kindInbox = 10
export const kindOutbox = 20

// Inbox message statuses.
export const statusInboxNew = 110
export const statusInboxRead = 120
export const statusInboxFailed = 140
export const statusInboxError = 150

// Outbox message statuses.
export const statusOutboxQueued = 200
export const statusOutboxSending = 210
export const statusOutboxSent = 220
export const statusOutboxFailed = 240
export const statusOutboxError = 250

export const statusText = {
  [statusInboxNew]: 'New',
  [statusInboxRead]: 'Read',
  [statusInboxFailed]: 'Failed',
  [statusInboxError]: 'Error',

  [statusOutboxQueued]: 'Queued',
  [statusOutboxSending]: 'Sending',
  [statusOutboxSent]: 'Sent',
  [statusOutboxFailed]: 'Failed',
  [statusOutboxError]: 'Error',
}

export const statusBadge = {
  [statusInboxNew]: <Badge label="New" color={badge.colorWaiting} />,
  [statusInboxRead]: <Badge label="Read" color={badge.colorVerified} />,
  [statusInboxFailed]: <Badge label="Failed" color={badge.colorDenied} />,
  [statusInboxError]: <Badge label="Error" color={badge.colorFailed} />,

  [statusOutboxQueued]: <Badge label="Queued" color={badge.colorWaiting} />,
  [statusOutboxSending]: <Badge label="Sending" color={badge.colorProcessing} />,
  [statusOutboxSent]: <Badge label="Sent" color={badge.colorVerified} />,
  [statusOutboxFailed]: <Badge label="Failed" color={badge.colorDenied} />,
  [statusOutboxError]: <Badge label="Error" color={badge.colorFailed} />,
}
