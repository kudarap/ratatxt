import React from 'react'
import Container from '@material-ui/core/Container'

import Table from '../containers/AppkeyTable'
import ContainerHeader from '../components/ContainerHeader'

export default function AppkeyList() {
  return (
    <Container maxWidth="md">
      <ContainerHeader sx={{ pt: 3, pb: 1 }} title="Appkeys" />
      <Table />
    </Container>
  )
}
