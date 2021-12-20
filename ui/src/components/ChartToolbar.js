import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import IconButton from '@material-ui/core/IconButton'
import ReloadIcon from '@material-ui/icons/Refresh'
import Toolbar from '@material-ui/core/Toolbar'

import Typography from './Typography'
import { SpacedGroup } from './Spacer'

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
    paddingRight: theme.spacing(2),
  },
}))

const options = [
  { label: 'Last 8 hours', value: 'last-8-h' },
  { label: 'Last 24 hours', value: 'last-24-h' },
  { label: 'Last 7 days', value: 'last-7-d' },
  { label: 'Last 30 days', value: 'last-30-d' },
  { label: 'All time', value: 'all' },
]

function ChartToolbar(props) {
  const [scope, setScope] = React.useState(props.scope)

  function handleChange(evt) {
    props.onChangeScope(evt.target.value)
    setScope(evt.target.value)
  }

  const classes = useStyles()
  return (
    <Toolbar>
      <Typography className={classes.title} medium>
        {props.title}
        <Typography variant="caption" color="textSecondary">
          &nbsp; {props.subtitle}
        </Typography>
      </Typography>
      <SpacedGroup>
        <Select variant="standard" value={scope} onChange={handleChange}>
          {options.map((o, i) => (
            <MenuItem key={i} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
        <IconButton onClick={props.onReload}>
          <ReloadIcon />
        </IconButton>
      </SpacedGroup>
    </Toolbar>
  )
}

ChartToolbar.defaultProps = {
  scope: options[0].value,
  onChangeScope: () => {},
  onReload: () => {},
}

ChartToolbar.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  scope: PropTypes.string,
  onChangeScope: PropTypes.func,
  onReload: PropTypes.func,
}

export default ChartToolbar
