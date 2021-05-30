import React from 'react'
import { makeStyles } from '@material-ui/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

import Typography from './Typography'
import OverviewIcon from '@material-ui/icons/Poll'
import InboxIcon from '@material-ui/icons/Message'
import OutboxIcon from '@material-ui/icons/Outbox'
// import GuardIcon from '@material-ui/icons/VerifiedUser'
// import SchedulerIcon from '@material-ui/icons/Schedule'
// import BlastIcon from '@material-ui/icons/Campaign'
// import ResponderIcon from '@material-ui/icons/SyncAlt'
// import IntegrationIcon from '@material-ui/icons/IntegrationInstructions'
import WebhookIcon from '@material-ui/icons/NotificationsActive'
import SettingIcon from '@material-ui/icons/Settings'
import DeviceIcon from '@material-ui/icons/PhoneAndroid'
import AppKeysIcon from '@material-ui/icons/VpnKey'

import SubNav from './SubNav'
import logo from '../logo.png'

const appName = 'Ratatxt'

const developNav = {
  header: 'Develop',
  items: [
    {
      label: 'Overview',
      to: '/overview',
      icon: <OverviewIcon />,
    },
    {
      label: 'Devices',
      to: '/devices',
      icon: <DeviceIcon />,
    },
    {
      label: 'Inbox',
      to: '/inbox',
      icon: <InboxIcon />,
    },
    {
      label: 'Outbox',
      to: '/outbox',
      icon: <OutboxIcon />,
    },
    {
      label: 'Webhooks',
      to: '/webhooks',
      icon: <WebhookIcon />,
    },
    // {
    //   label: 'Integration',
    //   to: '/integration',
    //   icon: <IntegrationIcon />,
    // },
    // {
    //   label: 'SMS Guard',
    //   to: '/sms-guard',
    //   icon: <GuardIcon />,
    // },
  ],
}

// const processNav = {
//   header: 'Apps',
//   items: [
//     {
//       label: 'SMS guard',
//       to: '/sms-guard',
//       icon: <GuardIcon />,
//     },
//     {
//       label: 'Scheduler',
//       to: '/scheduler',
//       icon: <SchedulerIcon />,
//     },
//     {
//       label: 'Message blast',
//       to: '/message-blast',
//       icon: <BlastIcon />,
//     },
//     {
//       label: 'Auto responder',
//       to: '/auto-responder',
//       icon: <ResponderIcon />,
//     },
//   ],
// }

const systemNav = {
  header: 'System',
  items: [
    {
      label: 'Appkeys',
      to: '/appkeys',
      icon: <AppKeysIcon />,
    },
    {
      label: 'Settings',
      to: '/settings',
      icon: <SettingIcon />,
    },
  ],
}

const useStyles = makeStyles(theme => ({
  appBar: {
    borderBottom: '1px solid ' + theme.palette.divider,
    // background: `${theme.palette.background.default} !important`,
    // backgroundColor: theme.palette.background.default,
  },
  headingText: {
    display: 'inline',
    fontSize: 22,
    letterSpacing: 1,
  },
  headingLogo: {
    height: 26,
    marginLeft: -10,
    marginRight: 14,
  },
}))

function Navigation(props) {
  const classes = useStyles()

  return (
    <>
      <AppBar elevation={0} position="sticky" color="default" className={classes.appBar}>
        <Toolbar variant="dense">
          <img src={logo} alt="logo" className={classes.headingLogo} />
          <Typography color="textSecondary" variant="h6" className={classes.headingText}>
            {appName}
          </Typography>
        </Toolbar>
      </AppBar>
      <SubNav {...developNav} />
      {/*<SubNav {...processNav} />*/}
      <SubNav {...systemNav} />
    </>
  )
}

export default Navigation
