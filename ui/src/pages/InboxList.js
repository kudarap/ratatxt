import React from 'react'
import Container from '@material-ui/core/Container'

import TabNav, { tabItem } from '../components/TabNav'
import TabContainer from '../components/TabContainer'
import Table from '../containers/InboxTable'
import ContainerHeader from '../components/ContainerHeader'
import {
  statusInboxError,
  statusInboxFailed,
  statusInboxNew,
  statusInboxRead,
  statusText,
} from '../constants/message'

function TabFilter(status) {
  return (function (Component) {
    return <Component defaultFilter={{ status }} />
  })(Table)
}

export default function InboxList({ match }) {
  const baseURL = match.url
  const tabItems = [
    tabItem('All', `${baseURL}/all`, TabFilter.bind(this, null)),
    tabItem(statusText[statusInboxNew], `${baseURL}/new`, TabFilter.bind(this, statusInboxNew)),
    tabItem(statusText[statusInboxRead], `${baseURL}/read`, TabFilter.bind(this, statusInboxRead)),
    tabItem(
      statusText[statusInboxFailed],
      `${baseURL}/failed`,
      TabFilter.bind(this, statusInboxFailed)
    ),
    tabItem(
      statusText[statusInboxError],
      `${baseURL}/error`,
      TabFilter.bind(this, statusInboxError)
    ),
  ]

  return (
    <Container maxWidth="md">
      <ContainerHeader sx={{ pt: 3 }} title="Inbox" />

      <TabNav items={tabItems} dense />
      <TabContainer baseUrl={baseURL} items={tabItems} />
    </Container>
  )
}
