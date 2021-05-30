import React from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import IconButton from '@material-ui/core/IconButton'
import ReloadIcon from '@material-ui/icons/Refresh'

import TableWithPagination from './TableWithPagination'
import Toolbar from './Toolbar'
import SearchInput from './SearchInput'
import TableFilter from './TableFilter'

export default function TableWithSearch(props) {
  const { onSearch, defaultFilter } = props
  const [params, setParams] = React.useState(defaultFilter)

  // Handle keyword changes with debounce and reset to default filter.
  const handleKeywordChange = q => {
    const f = { ...defaultFilter, q }
    setParams(f)
    onSearch(f)
  }

  // Handle table filter change.
  const handleTableFilterChange = newFilter => {
    const f = { ...params, ...newFilter, page: 1 }
    setParams(f)
    onSearch(f)
  }

  // Handle table pagination change.
  const handlePageChange = pageFilter => {
    const f = { ...params, ...pageFilter }
    setParams(f)
    onSearch(f)
  }

  // Handle toolbar composition.
  let toolbarActions = []
  const { filterOptions } = props
  if (!isEmpty(filterOptions)) {
    toolbarActions.push(
      <TableFilter
        disabled={props.fetching}
        options={filterOptions}
        defaultValue={params}
        onChange={handleTableFilterChange}
      />
    )
  }
  const { action } = props
  if (action.length !== 0) {
    toolbarActions = [...action, ...toolbarActions]
  }
  const toolbar = (
    <Toolbar
      disableGutters
      sx={{ p: 2, pt: 1, pb: 0 }}
      variant="dense"
      title={<SearchInput onChange={handleKeywordChange} placeholder={props.placeholder} />}>
      {[
        ...toolbarActions,
        <IconButton key="reload" disabled={props.fetching} onClick={props.onReload}>
          <ReloadIcon />
        </IconButton>,
      ]}
    </Toolbar>
  )

  return (
    <TableWithPagination
      {...props}
      toolbar={toolbar}
      filter={params}
      onFilterChange={handlePageChange}
    />
  )
}

TableWithSearch.propTypes = {
  // TableSearch props.
  placeholder: PropTypes.string,
  fetching: PropTypes.bool,
  onReload: PropTypes.func,
  filterOptions: PropTypes.arrayOf(PropTypes.object),
  action: PropTypes.arrayOf(PropTypes.element),

  // Inherited from Table component.
  schema: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onSearch: PropTypes.func,
}

TableWithSearch.defaultProps = {
  placeholder: 'Search keyword...',
  fetching: false,
  action: [],
  onKeywordChange: () => {},
  onReload: () => {},
  onSearch: () => {},
  filterOptions: null,
}
