import React from 'react'
import Button from '@material-ui/core/Button'

import TableWithSearch from '../components/TableWithSearch'
import Dialog from '../components/DeviceCreateDialog'
import format from '../services/format'
import withCreate from './withCreate'
import withDataTable from './withDataTable'
import Typography from '../components/Typography'

const DeviceCreate = withCreate(Dialog, 'device', 'Device successfully created!')

const placeholder = 'Search id, name, or address'

export default withDataTable(function (props) {
  const schema = [
    {
      column: 'ID',
      field: 'id',
    },
    {
      column: 'Name',
      field: ({ name }) => (
        <Typography variant="body2" medium component="span">
          {name}
        </Typography>
      ),
    },
    {
      column: 'Address',
      field: 'address',
    },
    {
      column: 'Active',
      field: ({ last_active }) => format.deviceActiveState(last_active),
    },
  ]

  // Override filter type
  let defaultFilter = props.defaultFilter
  defaultFilter.sort = 'name'

  const [open, setOpen] = React.useState(false)

  return (
    <>
      <TableWithSearch
        {...props}
        schema={schema}
        placeholder={placeholder}
        action={[
          <Button key="create" size="small" variant="contained" onClick={() => setOpen(true)}>
            Create Device
          </Button>,
        ]}
        clickRoute={row => `/devices/${row.id}`}
        defaultFilter={defaultFilter}
      />

      <DeviceCreate open={open} onClose={() => setOpen(false)} />
    </>
  )
}, 'deviceSearch')
