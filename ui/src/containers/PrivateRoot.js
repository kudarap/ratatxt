import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Screen from '../components/PrivateScreen'
import NotFound from '../pages/NotFound.js'
import Notify from './Notify'
import { privateRoutes } from './routes'
import { isOk } from '../services/auth'

// Checks authenticated status when container is loaded.
const isAuthenticated = isOk()

// Gets all the routes path.
export const getPrivatePaths = () => {
  let paths = privateRoutes.map(route => route.path)
  // Tricks router to render this component on /.
  if (isAuthenticated) {
    paths = ['/', ...paths]
  }

  return paths
}

function PrivateRoot() {
  return !isAuthenticated ? (
    <Redirect to="/login" />
  ) : (
    <Screen>
      <Switch>
        <Redirect exact from="/" to="/overview" />
        {privateRoutes.map((route, i) => (
          <Route key={i} {...route} />
        ))}
        <Route component={NotFound} />
      </Switch>
      <Notify />
    </Screen>
  )
}

export default PrivateRoot
