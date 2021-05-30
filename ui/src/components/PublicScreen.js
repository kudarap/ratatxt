import React from 'react'
import { makeStyles, alpha } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

import Brand from './Brand'
import Footer from './Footer'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    paddingTop: theme.spacing(5),
    backgroundColor: theme.palette.background.default,
  },
  main: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    minHeight: 300,
  },
  waves: {
    position: 'absolute',
    bottom: 0,
    zIndex: 0,
  },
  wave: {
    fill: alpha(theme.palette.primary.dark, 0.8),
  },
}))

function PublicRoot(props) {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Brand />
      <Container>{props.children}</Container>

      <svg className={classes.waves} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          className={classes.wave}
          d="M0,96L34.3,112C68.6,128,137,160,206,181.3C274.3,203,343,213,411,218.7C480,224,549,224,617,213.3C685.7,203,754,181,823,165.3C891.4,149,960,139,1029,154.7C1097.1,171,1166,213,1234,202.7C1302.9,192,1371,128,1406,96L1440,64L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path>
      </svg>
      <Footer />
    </div>
  )
}

export default PublicRoot
