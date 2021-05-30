import React from 'react'
import Container from '@material-ui/core/Container'

import Details from '../components/InboxDetails'
import withDetails from '../containers/withDetails'

const View = withDetails(Details, 'inbox')

export default function InboxView() {
  return (
    <Container maxWidth="md" sx={{ pt: 3 }}>
      <View />
    </Container>
  )
}
