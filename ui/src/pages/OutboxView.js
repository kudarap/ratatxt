import React from 'react'
import Container from '@material-ui/core/Container'

import Details from '../components/OutboxDetails'
import withDetails from '../containers/withDetails'

const View = withDetails(Details, 'outbox')

export default function OutboxView() {
  return (
    <Container maxWidth="md" sx={{ pt: 3 }}>
      <View />
    </Container>
  )
}
