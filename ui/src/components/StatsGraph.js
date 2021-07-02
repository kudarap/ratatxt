import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { makeStyles } from '@material-ui/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'

import Typography from './Typography'
import ChartToolbar from './ChartToolbar'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    marginTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  chart: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
  },
}))

const scopeUnitHourly = 'MMM D h:mm A'
const scopeUnitDaily = 'MMM D'
const getScopeUnit = scope => {
  if (String(scope).endsWith('h')) {
    return scopeUnitHourly
  }

  return scopeUnitDaily
}

const chartHeight = 250

function StatsGraph(props) {
  const classes = useStyles()

  const [scopeUnit, setScopeUnit] = React.useState(scopeUnitDaily)
  const handleScopeChange = scope => {
    props.onChangeScope(scope)
    setScopeUnit(getScopeUnit(scope))
  }

  const handleTickFormatter = unix => moment(unix).format(scopeUnit)

  const formattedData = (props.data || []).map(v => {
    return {
      unix: moment(v.scope).unix() * 1000,
      ...v,
    }
  })

  let subtitleText
  if (props.updated_at !== null) {
    subtitleText = 'updated ' + moment(props.updated_at).fromNow()
  }

  const Chart = props.component
  const ChartToolTip = props.tooltip
  return (
    <Paper className={classes.root}>
      <ChartToolbar
        title={props.title}
        subtitle={subtitleText}
        scope={props.scope}
        onChangeScope={handleScopeChange}
        onReload={props.onReload}
      />

      <Box style={{ width: '100%', height: chartHeight }} sx={{ pr: 2 }}>
        {props.loading && (
          <div align="center">
            <CircularProgress
              thickness={4}
              size={30}
              style={{ position: 'absolute', marginTop: chartHeight / 3 }}
            />
          </div>
        )}

        {!props.loading && formattedData.length === 0 && (
          <Typography
            align="center"
            style={{
              height: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            No data
          </Typography>
        )}

        {!props.loading && formattedData.length !== 0 && (
          <ResponsiveContainer className={classes.chart}>
            <Chart data={formattedData}>
              <CartesianGrid strokeDasharray="5 5" stroke="#aaa" />
              <XAxis
                dataKey="unix"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={handleTickFormatter}
              />
              <YAxis />
              <Legend />
              {props.tooltip && (
                <Tooltip content={<ChartToolTip formatScope={handleTickFormatter} />} />
              )}
              {props.children}
            </Chart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  )
}
StatsGraph.defaultProps = {
  data: [],
  onChangeScope: () => {},
  onReload: () => {},
}
StatsGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  onChangeScope: PropTypes.func,
  onReload: PropTypes.func,
}

export default StatsGraph
