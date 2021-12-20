import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Container from '@material-ui/core/Container'

import Typography from '../components/Typography'
import ContainerHeader from '../components/ContainerHeader'
import DataScore from '../components/DataScore'
import withStatsGraph from '../containers/withStatsGraph'
import MessageGraph from '../components/MessageGraph'
import OutboxGraph from '../components/OutboxGraph'

const StatsMessageGraph = withStatsGraph(MessageGraph, 'statsMessageGraph')
const StatsOutboxGraph = withStatsGraph(OutboxGraph, 'statsOutboxGraph')

const MessageScore = withStatsGraph(function ({ data, loading }) {
  const scoreData = {
    'Total Messages': <Typography variant="h5">{data.total}</Typography>,
    Inbox: <Typography variant="h5">{data.inbox}</Typography>,
    Outbox: <Typography variant="h5">{data.outbox}</Typography>,
  }

  return <DataScore data={scoreData} loading={loading} />
}, 'statsMessageCounter')

const OutboxScore = withStatsGraph(function ({ data, loading }) {
  const scoreData = {
    Queued: <Typography variant="h5">{data.outbox_queued}</Typography>,
    Sending: <Typography variant="h5">{data.outbox_sending}</Typography>,
    Sent: <Typography variant="h5">{data.outbox_sent}</Typography>,
    Failed: <Typography variant="h5">{data.outbox_failed}</Typography>,
    Error: <Typography variant="h5">{data.outbox_error}</Typography>,
  }

  return <DataScore data={scoreData} loading={loading} />
}, 'statsMessageCounter')

const useStyles = makeStyles(theme => ({
  header: {
    paddingTop: theme.spacing(3),
  },
  chart: {
    fontSize: theme.typography.fontSize,
    fontFamily: theme.typography.fontFamily,
  },
}))

function Overview() {
  const classes = useStyles()

  return (
    <>
      <Container maxWidth="md">
        <ContainerHeader className={classes.header} title="Overview" />

        <MessageScore defaultScope="all" />
        <StatsMessageGraph defaultScope="last-7-d" />
        <br />

        <OutboxScore defaultScope="all" />
        <StatsOutboxGraph defaultScope="last-7-d" />
        <br />
      </Container>
    </>
  )
}

export default Overview
