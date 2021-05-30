import React from 'react'
import PropTypes from 'prop-types'
// import isNumber from 'lodash/isNumber'
import { makeStyles } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import IconButton from '@material-ui/core/IconButton'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FilterListIcon from '@material-ui/icons/FilterList'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Badge from '@material-ui/core/Badge'
import { CardHeader } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
    paddingRight: theme.spacing(2),
  },
  menu: {
    // padding: theme.spacing(2, 2, 0),
    minWidth: 200,
  },
}))

// const testOpts = [
//   {
//     label: 'Status',
//     field: 'status',
//     values: [
//       { label: 'All', value: '' },
//       { label: 'Pending', value: '10' },
//       { label: 'Verified', value: '20' },
//     ],
//   },
//   {
//     label: 'Type',
//     field: 'type',
//     values: [
//       { label: 'All', value: '' },
//       { label: 'Ask', value: '10' },
//       { label: 'Bid', value: '20' },
//     ],
//   },
// ]

function TableFilter({ options, defaultValue, onChange, ...other }) {
  const classes = useStyles()

  const [count, setCount] = React.useState(0)
  React.useEffect(() => {
    options.forEach(opt => {
      if (!defaultValue[opt.field]) {
        return
      }

      setCount(count + 1)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [values, setValues] = React.useState(defaultValue)
  const handleChange = (field, evt, value) => {
    setCount(value ? count + 1 : count - 1)

    const v = { ...values, [field]: value }
    setValues(v)
    onChange(v)
  }

  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  // const handleReset = () => {
  //   const v = {}
  //   options.forEach(opt => {
  //     v[opt.field] = ''
  //   })
  //   setCount(0)
  //   onChange(v)
  //   setAnchorEl(null)
  // }

  const open = Boolean(anchorEl)
  const id = open ? 'filter-popover' : undefined

  return (
    <>
      <IconButton key="filter" onClick={handleClick} {...other}>
        <Badge color="secondary" variant="dot" invisible={!count}>
          <FilterListIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <Card className={classes.menu}>
          <CardHeader
            action={
              <Button size="small" onClick={handleClose} variant="outlined">
                Done
              </Button>
            }
            avatar="Filters"
          />
          <Divider />
          <CardContent>
            {options.map(item => (
              <FormControl variant="standard" component="fieldset">
                <FormLabel component="legend">{item.label}</FormLabel>
                <RadioGroup
                  name="radio-buttons-group"
                  defaultValue={''}
                  value={values[item.field] || ''}
                  onChange={handleChange.bind(null, item.field)}>
                  {item.values.map(opt => (
                    <FormControlLabel value={opt.value} control={<Radio />} label={opt.label} />
                  ))}
                </RadioGroup>
              </FormControl>
            ))}
          </CardContent>
        </Card>
      </Popover>
    </>
  )
}

TableFilter.propTypes = {
  options: PropTypes.object.isRequired,
  defaultValue: PropTypes.object,
  onChange: PropTypes.func,
}

export default TableFilter

export function filterValues(mapTexts) {
  return [
    { label: 'all', value: '' },
    ...Object.keys(mapTexts).map(k => ({ label: mapTexts[k], value: k })),
  ]
}
