import React from 'react'
import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'

import ProfileView from '../containers/ProfileView'
import ContainerHeader from '../components/ContainerHeader'

export default function Account() {
  return (
    <Container maxWidth="md">
      <ContainerHeader sx={{ pt: 3, pb: 1 }} title="Account" />

      <Paper>
        <ProfileView />
      </Paper>
    </Container>
  )
}
