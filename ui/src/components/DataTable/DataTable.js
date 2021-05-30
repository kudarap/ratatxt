import React from 'react'
import PropTypes from 'prop-types'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import LinearProgress from '@material-ui/core/LinearProgress'

import { Pagination } from './Pagination'
import Link from '../Link'

const rowsPerPageOptions = [5, 10, 20, 50]

export default function DataTable(props) {
  const { clickRoute } = props
  const isClickableRow = Boolean(clickRoute)
  const cursor = isClickableRow ? 'pointer' : 'unset'
  const clickableRow = isClickableRow
    ? {
        component: Link,
        underline: 'none',
      }
    : null
  const handleRowClick = row => {
    if (isClickableRow) {
      return typeof clickRoute === 'function' ? clickRoute(row) : row[clickRoute]
    }

    return null
  }

  const { page, rowsPerPage } = props
  function handleChangePage(evt, page) {
    if (onPageChange === undefined) {
      return
    }
    onPageChange(page)
  }
  function handleChangeRowsPerPage(evt) {
    const rows = evt.target.value
    if (onRowsPerPageChange === undefined) {
      return
    }
    onRowsPerPageChange(rows)
  }

  const { onPageChange, onRowsPerPageChange } = props
  const { schema, data, toolbar, totalCount, fetching } = props
  return (
    <Paper sx={{ overflowX: 'auto' }}>
      {/* Table toolbar */}
      {toolbar}

      {/* Table loader */}
      {fetching && <LinearProgress style={{ height: 2, marginTop: 35, marginBottom: -37 }} />}

      <Table>
        {/* Table header */}
        <TableHead>
          <TableRow>
            {schema.map((row, i) => (
              <TableCell size="small" key={i}>
                {row.column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* Table body */}
        <TableBody>
          {data.map((row, i) => (
            <TableRow
              hover
              key={i}
              style={{
                opacity: fetching ? 0.1 : 1,
                cursor,
              }}>
              {schema.map(({ field }, i) => {
                return clickableRow ? (
                  <TableCell key={i} padding="none">
                    <Link
                      {...clickableRow}
                      to={handleRowClick(row)}
                      underline="none"
                      color="textPrimary"
                      sx={{ p: 2, display: 'block' }}>
                      {typeof field === 'function' ? field(row) : row[field]}
                    </Link>
                  </TableCell>
                ) : (
                  <TableCell key={i}>
                    {typeof field === 'function' ? field(row) : row[field]}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}

          {/* Table empty data */}
          {data.length === 0 ? (
            <TableRow style={{ opacity: fetching ? 0.1 : 1 }}>
              <TableCell align="center" colSpan={schema.length}>
                No data available
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>

      {/* Table pagination */}
      <Pagination
        rowsPerPageOptions={rowsPerPageOptions}
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

DataTable.propTypes = {
  schema: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  clickRoute: PropTypes.any,

  // Data source
  data: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  totalCount: PropTypes.number,
  fetching: PropTypes.bool,

  // Toolbar
  toolbar: PropTypes.element,
}

DataTable.propTypes = {
  page: 0,
  rowsPerPage: 10,
}
