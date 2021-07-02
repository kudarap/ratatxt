import React from 'react'
import { makeStyles } from '@material-ui/styles'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(1),
  },
}))

function CheckboxInput(props) {
  const classes = useStyles()
  return (
    <FormControl variant="standard" fullWidth className={classes.root}>
      <FormControlLabel control={<Checkbox {...props} />} label={props.label} />
    </FormControl>
  )
}

export default CheckboxInput
