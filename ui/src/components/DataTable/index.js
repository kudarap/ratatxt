import React from 'react'
import moment from 'moment'

import Link from '../Link'

// wrapText when max length reaches limit.
export function wrapText(text, maxLength) {
  return `${text.slice(0, maxLength)}${text.length > maxLength ? '...' : ''}`
}

// formatDate shows relative time within 1 month
// else it will show numeric format.
export function formatDate(date) {
  const d = moment(date)
  return moment() < d.clone().add(1, 'month') ? d.fromNow() : d.format('DD MMM YYYY')
}

// createLinkID returns Link with modal state and shortens ID.
export function createLinkID(to, id) {
  return (
    <Link
      to={{
        pathname: to,
        state: { modal: true },
      }}>
      {shortenID(id)}
    </Link>
  )
}

// shortenID returns last part of the id.
export function shortenID(id) {
  return id.split('-', 1)
}
