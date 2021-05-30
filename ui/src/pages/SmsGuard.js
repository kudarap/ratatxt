import React from 'react'
import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'

import Typography from '../components/Typography'
import ContainerHeader from '../components/ContainerHeader'

export default function SmsGuard() {
  return (
    <Container maxWidth="md">
      <ContainerHeader sx={{ pt: 3, pb: 1 }} title="SMS Guard" />

      <Typography color="textPrimary">
        Generates PIN code with expiration and automatically send them through SMS.
      </Typography>

      <Paper sx={{ p: 1, mt: 1 }}>
        <Typography>1. Create your token</Typography>
        <br />
        Generate your token here
      </Paper>
    </Container>
  )
}
