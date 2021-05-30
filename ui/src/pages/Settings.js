import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

import TabNav, { tabItem } from '../components/TabNav'
import TabContainer from '../components/TabContainer'
import General from './Settings/General'
import About from './Settings/About'
import ContainerHeader from '../components/ContainerHeader'

const useStyles = makeStyles(theme => ({
  header: {
    paddingTop: theme.spacing(3),
  },
}))

function Settings({ match }) {
  const classes = useStyles()

  const baseUrl = match.url
  const tabItems = [
    tabItem('General', `${baseUrl}/general`, General),
    tabItem('About', `${baseUrl}/about`, About),
  ]

  return (
    <Container maxWidth="md">
      <ContainerHeader className={classes.header} title="Settings" />

      <TabNav items={tabItems} dense style={{ marginBottom: 22 }} />
      <TabContainer baseUrl={baseUrl} items={tabItems} />
    </Container>
  )
}

export default Settings
