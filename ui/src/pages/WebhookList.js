import React from 'react'
import Container from '@material-ui/core/Container'

import Table from '../containers/WebhookTable'
import ContainerHeader from '../components/ContainerHeader'

export default function WebhookList() {
  return (
    <Container maxWidth="md">
      <ContainerHeader sx={{ pt: 3, pb: 1 }} title="Webhooks" />
      <Table />
    </Container>
  )
}
