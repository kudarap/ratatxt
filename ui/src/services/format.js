// Format global data presentation.

import moment from 'moment'

export function amount(n = 0) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n)
  // return `₱${Number(n).toFixed(2)}`
}

export function datetime(date = null) {
  moment.suppressDeprecationWarnings = true
  return moment(date).format('MMM DD, YYYY - h:mm A')
}

export function calendar(date = null) {
  moment.suppressDeprecationWarnings = true
  return moment(date).format('MMM DD, YYYY')
}

export function deviceActiveState(date = null) {
  if (!date) {
    return 'never'
  }

  moment.suppressDeprecationWarnings = true
  const d = moment(date)
  const now = moment()
  if (now < d.clone().add(1, 'minute')) {
    return 'active now'
  }

  return d.fromNow()
}

export function boolean(b) {
  if (b === null) {
    return
  }

  return b ? `Yes ✅️` : 'No 🚫'
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  amount,
  datetime,
  calendar,
  boolean,
  deviceActiveState,
}
