import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {},
}))

export default function TabContainer({ items }) {
  const classes = useStyles()
  const match = useRouteMatch()
  return (
    <div className={classes.root}>
      <Switch>
        {items.map(item => (
          <Route key={item.path} path={item.path} component={item.component} />
        ))}
        {/* Set first item as default */}
        <Redirect from={match.url} to={items[0].path} />
      </Switch>
    </div>
  )
}

TabContainer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
}

TabContainer.defaultProps = {}
