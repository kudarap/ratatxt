import React from 'react'
import { Line, LineChart } from 'recharts'
import Paper from '@material-ui/core/Paper'
import { red, lightGreen, blueGrey, orange, purple } from '@material-ui/core/colors'

import StatsGraph from './StatsGraph'

function CustomToolTip(props) {
  const { active } = props
  if (!active) {
    return null
  }

  const { payload, formatScope } = props
  const object = payload[0].payload
  return (
    <Paper sx={{ p: 1 }}>
      <strong>{formatScope(object.unix)}</strong>
      <br />
      Queued: {object.outbox_queued}
      <br />
      Sending: {object.outbox_sending}
      <br />
      Sent: {object.outbox_sent}
      <br />
      Failed: {object.outbox_failed}
      <br />
      Error: {object.outbox_error}
    </Paper>
  )
}

export default function OutboxGraph(props) {
  return (
    <StatsGraph {...props} title="Outbox Activity" component={LineChart} tooltip={CustomToolTip}>
      <Line
        name="Queued"
        type="linear"
        dataKey="outbox_queued"
        stroke={blueGrey[500]}
        dot={false}
        strokeWidth={2}
      />
      <Line
        name="Sending"
        type="linear"
        dataKey="outbox_sending"
        stroke={orange[500]}
        dot={false}
        strokeWidth={2}
      />
      <Line
        name="Sent"
        type="linear"
        dataKey="outbox_sent"
        stroke={lightGreen[500]}
        dot={false}
        strokeWidth={2}
      />
      <Line
        name="Failed"
        type="linear"
        dataKey="outbox_failed"
        stroke={purple[500]}
        dot={false}
        strokeWidth={2}
      />
      <Line
        name="Error"
        type="linear"
        dataKey="outbox_error"
        stroke={red[500]}
        dot={false}
        strokeWidth={2}
      />
    </StatsGraph>
  )
}
