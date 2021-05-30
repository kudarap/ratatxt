import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'

function NavItem({ label, to, icon }) {
  return (
    <ListItem button component={Link} selected={window.location.pathname.includes(to)} to={to}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  )
}

NavItem.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
}

function SubNav({ header, items, showHeader = true, dense = true }) {
  const subHead = showHeader ? <ListSubheader component="div">{header}</ListSubheader> : null

  return (
    <>
      <List component="nav" subheader={subHead} dense={dense}>
        {items.map(item => (
          <NavItem key={item.to} {...item} />
        ))}
      </List>
      <Divider />
    </>
  )
}

SubNav.propTypes = {
  header: PropTypes.string,
  items: PropTypes.array.isRequired,
  showHeader: PropTypes.bool,
  dense: PropTypes.bool,
}

export default SubNav
