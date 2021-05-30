import React from 'react'
import Box from '@material-ui/core/Box'

import Typography from '../components/Typography'

export default function Error({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '60vh',
      }}>
      <Typography variant="h6" align="center" color="textPrimary">
        Error occurred
      </Typography>
      <Typography align="center" color="textSecondary">
        {children}
      </Typography>
    </Box>
  )
}
