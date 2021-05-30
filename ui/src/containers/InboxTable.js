import React from 'react'
import { useLocation } from 'react-router-dom'

import TableWithSearch from '../components/TableWithSearch'
import { formatDate, wrapText } from '../components/DataTable'
import withDataTable from './withDataTable'
import { kindInbox, statusBadge } from '../constants/message'

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

  // Override filter type
  let defaultFilter = props.defaultFilter
  defaultFilter.kind = kindInbox

  return (
    <TableWithSearch
      {...props}
      schema={schema}
      placeholder={placeholder}
      clickRoute={row => `${baseURL}/${row.id}`}
      defaultFilter={defaultFilter}
    />
  )
}

export default withDataTable(Table, 'inboxSearch')
