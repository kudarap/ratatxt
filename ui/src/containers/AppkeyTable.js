import React from 'react'
import Button from '@material-ui/core/Button'

import TableWithSearch from '../components/TableWithSearch'
import { formatDate } from '../components/DataTable'
import Dialog from '../components/AppkeyCreateDialog'
import withDataTable from './withDataTable'
import withAppkeyCreate from './withAppkeyCreate'

const AppkeyCreate = withAppkeyCreate(Dialog, 'appkey', 'Appkey successfully created!')

const placeholder = 'Search id or note'

export default withDataTable(function (props) {
  const schema = [
    {
      column: 'ID',
      field: 'id',
    },
    {
      column: 'Note',
      field: 'note',
    },
    {
      column: 'Last used',
      field: ({ last_used }) => (last_used ? formatDate(last_used) : 'never'),
    },
    {
      column: 'Created',
      field: ({ created_at }) => formatDate(created_at),
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
            Create Appkey
          </Button>,
        ]}
        clickRoute={row => `/appkeys/${row.id}`}
      />

      <AppkeyCreate open={open} onClose={() => setOpen(false)} />
    </>
  )
}, 'appkeySearch')
