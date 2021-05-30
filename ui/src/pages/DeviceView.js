import React from 'react'
import Container from '@material-ui/core/Container'

import Details from '../components/DeviceDetails'
import withDetails from '../containers/withDetails'

const View = withDetails(Details, 'device')

export default function DeviceView() {
  return (
    <Container maxWidth="md" sx={{ pt: 3 }}>
      <View />
    </Container>
  )
}
