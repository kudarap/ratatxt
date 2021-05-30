import React from 'react'
import Container from '@material-ui/core/Container'

import Table from '../containers/DeviceTable'
import ContainerHeader from '../components/ContainerHeader'

export default function DeviceList() {
  return (
    <Container maxWidth="md">
      <ContainerHeader sx={{ pt: 3, pb: 1 }} title="Devices" />
      <Table />
    </Container>
  )
}
