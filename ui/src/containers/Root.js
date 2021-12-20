import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Theme from '../containers/Theme.js'
import PublicRoot, { getPublicPaths } from './PublicRoot'
import PrivateRoot, { getPrivatePaths } from './PrivateRoot.js'

import green from '@material-ui/core/colors/green'
import yellow from '@material-ui/core/colors/yellow'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { createTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/core'
const theme1 = createTheme({
  palette: {
    primary: {
      main: green[500]
    },
    secondary: {
      main: yellow[500]
    },
  },
});

export default function() {
  return (
  <ThemeProvider theme={theme1}>
    <Typography color="primary">primary</Typography>
    <Typography color="secondary">secondary</Typography>
    <Button variant="contained">Hello</Button>
    <Button variant="contained" color="primary">primary</Button>
    <Button variant="contained" color="secondary">secondary</Button>
  </ThemeProvider>
)
}


const t = Theme(() => (
  <BrowserRouter>
    <Switch>
      <Route path={getPrivatePaths()} component={PrivateRoot} />
      <Route path={getPublicPaths()} component={PublicRoot} />
    </Switch>
  </BrowserRouter>
))
