import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import Divider from '@material-ui/core/Divider'
import Box from '@material-ui/core/Box'
import Skeleton from '@material-ui/core/Skeleton'

import Typography from './Typography'

export default function DataScore({ data, loading, column }) {
  const sideMargin = column ? 0 : 3

  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        flexDirection: column ? 'column' : 'row',
        '& div': {
          mr: sideMargin,
          ml: sideMargin,
          mb: column ? 1 : 0,
        },
        '& div:first-of-type': {
          ml: 0,
        },
        '& .MuiDivider-root:last-child': {
          display: 'none',
        },
      }}>
      {map(data, (value, field) => [
        <div key={field}>
          <Typography variant="body2" color="textSecondary" component="div">
            {field}
          </Typography>
          {loading ? (
            <Skeleton width={60} />
          ) : (
            <Typography
              variant="body2"
              color="textPrimary"
              component="div"
              style={{ display: 'contents' }}>
              {value}
            </Typography>
          )}
        </div>,
        !column && <Divider key={`${field}-divider`} orientation="vertical" flexItem />,
      ])}
    </Box>
  )
}

DataScore.propTypes = {
  data: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  column: PropTypes.bool,
}

DataScore.defaultProps = {
  loading: false,
  column: false,
}
