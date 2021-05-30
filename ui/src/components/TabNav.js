import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { experimentalStyled as styled } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Divider from '@material-ui/core/Divider'

// tab item composition utility.
export const tabItem = (label, path, component) => ({ label, path, component })

const DenseTabs = styled(Tabs)({
  // borderBottom: '1px solid #e8e8e8',
  '& .MuiTabs-indicator': {
    backgroundColor: '#62a9af',
  },
})

const DenseTab = styled(props => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  // color: 'rgba(0, 0, 0, 0.85)',
  '&:hover': {
    opacity: 1,
  },
  '&.Mui-selected': {
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#d1eaff',
  },
}))

function TabNav({ items, dense, onChange, ...other }) {
  // Set active tab state on refresh.
  const getDefaultState = () => {
    let paths = items.map(item => item.path)
    let index = paths.indexOf(window.location.pathname)
    return index === -1 ? 0 : index
  }

  const [value, setValue] = useState(getDefaultState())

  const handleChange = (event, value) => {
    setValue(value)
    onChange(value)
  }

  if (dense) {
    return (
      <div {...other}>
        <DenseTabs value={value} onChange={handleChange}>
          {items.map(item => (
            <DenseTab
              key={item.path ? item.path : item.label}
              label={item.label}
              to={item.path ? item.path : null}
              component={item.path ? Link : null}
              disableRipple
            />
          ))}
        </DenseTabs>
        <Divider style={{ marginTop: -1 }} />
      </div>
    )
  }

  return (
    <Tabs indicatorColor="primary" textColor="inherit" value={value} onChange={handleChange}>
      {items.map(item => (
        <Tab
          key={item.path ? item.path : item.label}
          label={item.label}
          to={item.path ? item.path : null}
          component={item.path ? Link : null}
          disableRipple
        />
      ))}
    </Tabs>
  )
}

TabNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onChange: PropTypes.func,
  dense: PropTypes.bool,
}
TabNav.defaultProps = {
  dense: false,
  onChange: () => {},
}

export default TabNav
