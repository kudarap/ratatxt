import React from 'react'
import PropTypes from 'prop-types'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { makeStyles } from '@material-ui/styles'
import Paper from '@material-ui/core/Paper'

import Typography from './Typography'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  table: {
    minWidth: 700,
  },
}))

const testData = [
  { name: 'Mon', X: 2200, Y: 3400 },
  { name: 'Tue', X: 1280, Y: 2398 },
  { name: 'Wed', X: 5000, Y: 4300 },
  { name: 'Thu', X: 4780, Y: 2908 },
  { name: 'Fri', X: 5890, Y: 4800 },
  { name: 'Sat', X: 4390, Y: 3800 },
  { name: 'Sun', X: 4490, Y: 4300 },
]

function SimpleLineChart({ title, data = testData }) {
  const classes = useStyles()
  return (
    // 99% per https://github.com/recharts/recharts/issues/172
    <Paper className={classes.root}>
      <Typography variant="h6" color="textSecondary">
        {title}
      </Typography>
      <br />
      <ResponsiveContainer width="99%" height={250}>
        <LineChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="X" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Y" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  )
}

SimpleLineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object.isRequired),
}

export default SimpleLineChart
