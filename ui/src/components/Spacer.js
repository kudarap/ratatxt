import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
  },
}))

function Spacer() {
  const classes = useStyles()
  return <span className={classes.root}></span>
}

export default Spacer

export function SpacedGroup({ children }) {
  // Check if it has siblings.
  if (children.length === undefined) {
    return children
  }

  let group = []
  children.forEach((el, i) => {
    group.push(el)

    // Last node should not have spacer.
    if (i === children.length - 1) {
      return
    }
    group.push(<Spacer key={i} />)
  })

  return <>{group}</>
}
