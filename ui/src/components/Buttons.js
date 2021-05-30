import React from 'react'
import { experimentalStyled } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import ClearIcon from '@material-ui/icons/Clear'
import CheckIcon from '@material-ui/icons/Check'

export const RedButton = experimentalStyled(Button)({ color: red[500] })

export const GreenButton = experimentalStyled(Button)({ color: green[500] })

export const CancelButton = props => {
  return <RedButton startIcon={<ClearIcon />} {...props} />
}

export const ConfirmButton = props => {
  return <GreenButton startIcon={<CheckIcon />} {...props} />
}
