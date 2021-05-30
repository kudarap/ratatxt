import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Zelda from '@material-ui/core/Link'

import Typography from './Typography'
import Link from './Link'
import { SpacedGroup } from './Spacer'

const useStyles = makeStyles(theme => ({
  footer: {
    textAlign: 'center',
    padding: theme.spacing(2),
    marginTop: 'auto',
    zIndex: 1,
  },
}))

function FootText(props) {
  return (
    <Typography {...props} variant="caption" component="span" style={{ color: '#fff' }}>
      {props.children}
    </Typography>
  )
}

function FootLink(props) {
  return (
    <Link {...props} underline="none">
      <FootText>{props.children}</FootText>
    </Link>
  )
}

function Footer() {
  const classes = useStyles()
  return (
    <footer className={classes.footer}>
      <Container maxWidth="sm">
        <SpacedGroup>
          <FootText color="textSecondary">&copy; 2021 Ratatxt.com</FootText>
          <FootLink to="/">Console</FootLink>
          <FootText>
            <Zelda href="http://ratatxt.com" underline="none" style={{ color: '#fff' }}>
              Website
            </Zelda>
          </FootText>
        </SpacedGroup>
      </Container>
    </footer>
  )
}

export default Footer
