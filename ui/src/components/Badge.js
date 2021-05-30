import React from 'react'
import { alpha, useTheme } from '@material-ui/core/styles'

import Typography from './Typography'

const bgOpacity = 0.1

export default function Badge({ label, color: initColor, filled = false }) {
  const theme = useTheme()

  let border = null
  let background = alpha(initColor, bgOpacity)
  let color = initColor
  if (filled) {
    color = '#fff'
    background = alpha(initColor, 0.8)
    if (theme.palette.mode === 'dark') {
      color = alpha(initColor, 0.7)
      border = `1px solid ${color}`
      background = null
    }
  }

  return (
    <Typography
      variant="caption"
      component="span"
      medium
      style={{
        color,
        background,
        border,
        padding: '2px 8px',
        borderRadius: 4,
      }}>
      {label}
    </Typography>
  )
}

export const colorWaiting = '#607d8b'
export const colorVerified = '#4caf50'
export const colorProcessing = '#ff9800'
export const colorCompleted = '#2196f3'
export const colorDenied = '#9c27b0'
export const colorCancelled = '#9e9e9e'
export const colorFailed = '#f44336'
