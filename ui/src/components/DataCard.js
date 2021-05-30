import React from 'react'
import PropTypes from 'prop-types'

import DataView from './DataView'
import XCard from './XCard'
import DialogError from './DialogError'

export default function DataCard({ data, loading, error, cols, ...other }) {
  return (
    <XCard {...other}>
      <DialogError text={null} style={{ marginBottom: 12 }} />
      <DataView data={data} cols={cols} loading={loading} />
    </XCard>
  )
}

DataCard.propTypes = {
  data: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  cols: PropTypes.number,
}

DataCard.defaultProps = {
  loading: false,
  error: null,
  cols: 1,
}
