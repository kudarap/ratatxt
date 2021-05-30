import React from 'react'
import { useLocation } from 'react-router-dom'
import Button from '@material-ui/core/Button'

import TableWithSearch from '../components/TableWithSearch'
import { formatDate, wrapText } from '../components/DataTable'
import { kindOutbox, statusBadge } from '../constants/message'
import Dialog from '../components/SendMessageDialog'
import withCreate from './withCreate'
import withDataTable from './withDataTable'

const SendMessage = withCreate(Dialog, 'outbox', 'Message successfully queued!')

const placeholder = 'Search id, text, address'

function Table(props) {
  const { pathname: baseURL } = useLocation()
  const schema = [
    {
      column: 'ID',
      field: 'id',
    },
    {
      column: 'Text',
      field: ({ status, text }) => (
        <span>
          {statusBadge[status]}
          {` `}
          {wrapText(text, 50)}
        </span>
      ),
    },
    {
      column: 'Device',
      field: ({ device }) => device.name,
    },
    {
      column: 'Date',
      field: ({ timestamp }) => formatDate(timestamp),
    },
  ]

  // Override filter
  let defaultFilter = props.defaultFilter
  defaultFilter.kind = kindOutbox

  const [open, setOpen] = React.useState(false)

  return (
    <>
      <TableWithSearch
        {...props}
        schema={schema}
        placeholder={placeholder}
        action={[
          <Button size="small" variant="contained" onClick={() => setOpen(true)}>
            Send Message
          </Button>,
        ]}
        clickRoute={row => `${baseURL}/${row.id}`}
        defaultFilter={defaultFilter}
      />

      <SendMessage open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export default withDataTable(Table, 'outboxSearch')
