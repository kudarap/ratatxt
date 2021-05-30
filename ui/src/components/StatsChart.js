import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'

import ChartToolbar from './ChartToolbar'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    paddingBottom: theme.spacing(2),
  },
}))

const chartHeight = 320

function StatsChart(props) {
  const classes = useStyles()
  let subtitleText
  if (props.updatedAt !== null) {
    subtitleText = 'updated ' + moment(props.updatedAt).fromNow()
  }

  const Chart = props.component
  return (
    <Paper className={classes.root}>
      {/*<LinearProgress style={{ visibility: props.loading ? 'visible' : 'hidden' }} />*/}

      {props.loading && (
        <div align="center">
          <CircularProgress
            thickness={4}
            size={30}
            style={{ position: 'absolute', marginTop: chartHeight / 2 }}
          />
        </div>
      )}

      <ChartToolbar
        title={props.title}
        subtitle={subtitleText}
        scope={props.scope}
        onChangeScope={props.onChangeScope}
        onReload={props.onReload}
      />
      <ResponsiveContainer width="99%" height={chartHeight}>
        <Chart data={props.data} style={{ opacity: props.loading ? 0.1 : 1 }}>
          <CartesianGrid vertical={false} strokeDasharray="10" />
          <XAxis dataKey="key" />
          <YAxis />
          <Tooltip />
          <Legend />
          {props.children}
        </Chart>
      </ResponsiveContainer>
    </Paper>
  )
}

StatsChart.defaultProps = {
  onChangeScope: () => {},
  onReload: () => {},
}

StatsChart.propTypes = {
  onChangeScope: PropTypes.func,
  onReload: PropTypes.func,
}

export default StatsChart
