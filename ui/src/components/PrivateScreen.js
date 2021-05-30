import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import Navigation from './Navigation'
import ElevationScroll from './ElevationScroll'
import AvatarMenu from '../containers/AvatarMenu'
import Typography from './Typography'

const drawerWidth = 240
const breakPoint = 'md'
const denseToolbarHeight = '@media (min-width:0px) and (orientation: landscape)'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.background.default,
    // backgroundColor: '#fafafa',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  drawer: {
    [theme.breakpoints.up(breakPoint)]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    borderBottom: '1px solid ' + theme.palette.divider,
    marginLeft: drawerWidth,
    [theme.breakpoints.up(breakPoint)]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginLeft: -15,
    marginRight: 15,
    [theme.breakpoints.up(breakPoint)]: {
      display: 'none',
    },
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    minHeight: '100vh',
    paddingTop: theme.mixins.toolbar[denseToolbarHeight].minHeight,
    marginBottom: theme.mixins.toolbar[denseToolbarHeight].minHeight,
  },
}))

function PrivateScreen({ container, children, ...other }) {
  const classes = useStyles()
  const theme = useTheme()

  const [open, setOpen] = useState(false)

  const handleDrawerToggle = () => setOpen(!open)

  return (
    <div className={classes.root}>
      {/* Main Toolbar */}
      <ElevationScroll {...other}>
        <AppBar position="fixed" className={classes.appBar} color="default" elevation={0}>
          <Toolbar variant="dense" disableGutters={false} className={classes.toolbar}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={handleDrawerToggle}
              className={classes.menuButton}>
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle1" color="inherit" medium noWrap className={classes.title}>
              Console
            </Typography>
            <AvatarMenu />
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      {/* Left Navigation */}
      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          sx={{ display: { md: 'none', xs: 'block' } }}
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={open}
          onClose={handleDrawerToggle}
          classes={{ paper: classes.drawerPaper }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}>
          <Navigation />
        </Drawer>

        <Drawer
          sx={{ display: { md: 'block', xs: 'none' } }}
          classes={{ paper: classes.drawerPaper }}
          variant="permanent"
          open>
          <Navigation />
        </Drawer>
      </nav>
      <main className={classes.content}>{children}</main>
    </div>
  )
}

PrivateScreen.propTypes = {
  container: PropTypes.element,
}

export default PrivateScreen
