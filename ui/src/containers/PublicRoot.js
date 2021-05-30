import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Screen from '../components/PublicScreen'
import { publicRoutes } from './routes'

// Gets all the routes path
export const getPublicPaths = () => publicRoutes.map(route => route.path)

function PublicRoot() {
  return (
    <Screen>
      <Switch>
        <Redirect exact from="/" to="/login" />
        {publicRoutes.map((route, i) => (
          <Route key={i} {...route} />
        ))}
      </Switch>
    </Screen>
  )
}

export default PublicRoot
