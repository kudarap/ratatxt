import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'

import format from '../services/format'

export default function BreakDown({ title, data }) {
  return (
    <TableContainer
      sx={{
        '& tbody tr:last-child td': {
          border: 0,
          fontWeight: 500,
        },
      }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>{title}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {map(data, (value, field) => (
            <TableRow>
              <TableCell>{field}</TableCell>
              <TableCell align="right">{format.amount(value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

BreakDown.propTypes = {
  data: PropTypes.object.isRequired,
  title: PropTypes.string,
}

BreakDown.defaultProps = {
  title: '',
}
