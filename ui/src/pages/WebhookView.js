import React from 'react'
import Container from '@material-ui/core/Container'

import Details from '../components/WebhookDetails'
import withDetails from '../containers/withDetails'

const View = withDetails(Details, 'webhook')

export default function WebhookView() {
  return (
    <Container maxWidth="md" sx={{ pt: 3 }}>
      <View />
    </Container>
  )
}
