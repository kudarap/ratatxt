import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles, experimentalStyled as styled, alpha } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import UserIcon from '@material-ui/icons/AccountCircle'
import ProfileIcon from '@material-ui/icons/Person'
import LogoutIcon from '@material-ui/icons/Logout'
import Divider from '@material-ui/core/Divider'

import { appLogout } from '../services/app'
import { levelBadges } from '../constants/auth'
import Typography from './Typography'

const useStyles = makeStyles(theme => ({
  menu: {
    marginTop: theme.spacing(3),
    minWidth: 200,
  },
  profile: {
    padding: theme.spacing(1, 2),
  },
}))

function AvatarMenu({ profile }) {
  const classes = useStyles()

  const [anchorEl, setAchorEl] = useState(null)

  const handleClick = evt => {
    setAchorEl(evt.currentTarget)
  }

  const handleClose = () => {
    setAchorEl(null)
  }

  return (
    <div>
      <IconButton
        disableRipple
        aria-owns={anchorEl ? 'avatar-menu' : undefined}
        aria-haspopup="true"
        color="inherit"
        onClick={handleClick}>
        <UserIcon color="action" />
      </IconButton>

      <StyledMenu
        id="avatar-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className={classes.menu}>
        <div className={classes.profile}>
          <Typography medium component="span">
            {profile.first_name} {profile.last_name}
            <br />
            <Typography variant="body2" component="span" color="textSecondary">
              {profile.email}
            </Typography>
            <br />
            {levelBadges[profile.level]}
          </Typography>
        </div>
        <Divider />
        <MenuItem component={Link} onClick={handleClose} to="/account" disableRipple>
          <ProfileIcon />
          Account
        </MenuItem>
        <MenuItem onClick={appLogout} disableRipple>
          <LogoutIcon />
          Logout
        </MenuItem>
      </StyledMenu>
    </div>
  )
}

export default AvatarMenu

const StyledMenu = styled(props => <Menu elevation={0} {...props} />)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: 0,
    minWidth: 180,
    // color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiList-root': {
      padding: '4px 0',
    },
    '& .MuiListItem-root': {
      ...theme.typography.body1,
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        // color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}))
