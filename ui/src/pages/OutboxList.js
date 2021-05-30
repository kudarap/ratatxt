import React from 'react'
import Container from '@material-ui/core/Container'

import TabNav, { tabItem } from '../components/TabNav'
import TabContainer from '../components/TabContainer'
import Table from '../containers/OutboxTable'
import ContainerHeader from '../components/ContainerHeader'
import {
  statusOutboxQueued,
  statusOutboxSending,
  statusOutboxSent,
  statusOutboxFailed,
  statusOutboxError,
  statusText,
} from '../constants/message'

function TabFilter(status) {
  return (function (Component) {
    return <Component defaultFilter={{ status }} />
  })(Table)
}

export default function OutboxList({ match }) {
  const baseUrl = match.url
  const tabItems = [
    tabItem('All', `${baseUrl}/all`, TabFilter.bind(this, null)),
    tabItem(
      statusText[statusOutboxQueued],
      `${baseUrl}/queued`,
      TabFilter.bind(this, statusOutboxQueued)
    ),
    tabItem(
      statusText[statusOutboxSending],
      `${baseUrl}/sending`,
      TabFilter.bind(this, statusOutboxSending)
    ),
    tabItem(
      statusText[statusOutboxSent],
      `${baseUrl}/sent`,
      TabFilter.bind(this, statusOutboxSent)
    ),
    tabItem(
      statusText[statusOutboxFailed],
      `${baseUrl}/failed`,
      TabFilter.bind(this, statusOutboxFailed)
    ),
    tabItem(
      statusText[statusOutboxError],
      `${baseUrl}/error`,
      TabFilter.bind(this, statusOutboxError)
    ),
  ]

  return (
    <Container maxWidth="md">
      <ContainerHeader sx={{ pt: 3 }} title="Outbox" />

      <TabNav items={tabItems} dense />
      <TabContainer baseUrl={baseUrl} items={tabItems} />
    </Container>
  )
}
