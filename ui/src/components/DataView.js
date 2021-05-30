import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'

import Typography from './Typography'

export default function DataView({ data, loading, cols, ...other }) {
  if (loading) {
    return <CircularProgress size={22} />
  }

  let fieldCol = 3 / cols
  let valueCol = 9 / cols

  return (
    <Grid spacing={0.5} {...other} container>
      {map(data, (value, field) => [
        <Grid item xs={6} md={fieldCol}>
          <Typography variant="body2" color="textSecondary">
            {field}
          </Typography>
        </Grid>,
        <Grid item xs={6} md={valueCol}>
          <Typography variant="body2">{value}</Typography>
        </Grid>,
      ])}
    </Grid>
  )
}

DataView.propTypes = {
  data: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  cols: PropTypes.number,
}

DataView.defaultProps = {
  loading: false,
  cols: 1,
}
