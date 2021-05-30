import React from 'react'
import Button from '@material-ui/core/Button'

import TableWithSearch from '../components/TableWithSearch'
import { formatDate } from '../components/DataTable'
import Dialog from '../components/WebhookCreateDialog'
import withCreate from './withCreate'
import withDataTable from './withDataTable'
import format from '../services/format'

const WebhookCreate = withCreate(Dialog, 'webhook', 'Webhook successfully created!')

const placeholder = 'Search id, url, or response code'

export default withDataTable(function (props) {
  const schema = [
    {
      column: 'ID',
      field: 'id',
    },
    {
      column: 'URL',
      field: 'payload_url',
    },
    {
      column: 'Active',
      field: ({ active }) => format.boolean(active),
    },
    // {
    //   column: 'Last response',
    //   field: ({ last_resp_code }) => (last_resp_code ? last_resp_code : '--'),
    // },
    {
      column: 'Last used',
      field: ({ last_used }) => (last_used ? formatDate(last_used) : 'never'),
    },
  ]

  const [open, setOpen] = React.useState(false)

  return (
    <>
      <TableWithSearch
        {...props}
        schema={schema}
        placeholder={placeholder}
        action={[
          <Button key="create" size="small" variant="contained" onClick={() => setOpen(true)}>
            Create Webhook
          </Button>,
        ]}
        clickRoute={row => `/webhooks/${row.id}`}
      />

      <WebhookCreate open={open} onClose={() => setOpen(false)} />
    </>
  )
}, 'webhookSearch')
