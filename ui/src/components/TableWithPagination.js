import React from 'react'
import PropTypes from 'prop-types'

import DataTable from './DataTable/DataTable'

export default function TableWithPagination({ filter, onFilterChange, meta, ...other }) {
  const handleChangePage = page => {
    page++
    let f = { ...filter, page }
    onFilterChange(f)
  }

  const handleChangeRowPerPage = limit => {
    let f = { ...filter, limit }
    onFilterChange(f)
  }

  return (
    <DataTable
      page={filter.page - 1}
      rowsPerPage={filter.limit}
      totalCount={meta.total_count}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowPerPage}
      {...other}
    />
  )
}

TableWithPagination.propTypes = {
  // Table props.
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,

  // Data source reducer states.
  data: PropTypes.arrayOf(PropTypes.object.isRequired),
  meta: PropTypes.object,
  fetching: PropTypes.bool,
  error: PropTypes.string,
}

TableWithPagination.defaultProps = {
  defaultFilter: {},
  meta: {
    total_count: 0,
    result_count: 0,
  },
  onFilterChange: () => {},
}
