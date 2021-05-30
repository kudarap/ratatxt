import React from 'react'
import { Line, LineChart } from 'recharts'
import Paper from '@material-ui/core/Paper'
import { lightGreen, lightBlue } from '@material-ui/core/colors'

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
      Inbox: {object.inbox}
      <br />
      Outbox: {object.outbox}
    </Paper>
  )
}

export default function MessageGraph(props) {
  return (
    <StatsGraph {...props} title="Message Activity" component={LineChart} tooltip={CustomToolTip}>
      <Line
        name="Inbox"
        type="linear"
        dataKey="inbox"
        stroke={lightBlue[500]}
        dot={false}
        strokeWidth={2}
      />
      <Line
        name="Outbox"
        type="linear"
        dataKey="outbox"
        stroke={lightGreen[500]}
        dot={false}
        strokeWidth={2}
      />
    </StatsGraph>
  )
}
