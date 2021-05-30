import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Theme from '../containers/Theme.js'
import PublicRoot, { getPublicPaths } from './PublicRoot'
import PrivateRoot, { getPrivatePaths } from './PrivateRoot.js'

export default Theme(() => (
  <BrowserRouter>
    <Switch>
      <Route path={getPrivatePaths()} component={PrivateRoot} />
      <Route path={getPublicPaths()} component={PublicRoot} />
    </Switch>
  </BrowserRouter>
))
