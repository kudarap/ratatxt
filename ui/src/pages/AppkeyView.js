import React from 'react'
import Container from '@material-ui/core/Container'

import Details from '../components/AppkeyDetails'
import withDetails from '../containers/withDetails'

const View = withDetails(Details, 'appkey')

export default function AppkeyView() {
  return (
    <Container maxWidth="md" sx={{ pt: 3 }}>
      <View />
    </Container>
  )
}
