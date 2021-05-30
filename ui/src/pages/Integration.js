import React from 'react'
import Container from '@material-ui/core/Container'

import Typography from '../components/Typography'
import ContainerHeader from '../components/ContainerHeader'

export default function Integration() {
  return (
    <Container maxWidth="md">
      <ContainerHeader sx={{ pt: 3, pb: 1 }} title="Integration" />

      <Typography color="textPrimary">
        Basic demonstration of sending messages and receiving message updates.
      </Typography>
    </Container>
  )
}
