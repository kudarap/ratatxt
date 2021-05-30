import React from 'react'
import PropTypes from 'prop-types'

import { API_HOST } from '../services/http'
import DataCard from './DataCard'

function VersionForm({ data, loading }) {
  const viewData = {
    Host: API_HOST,
    Version: data.version,
    'Build date': data.built,
    'Commit hash': data.hash,
  }

  return (
    <DataCard
      title="API information"
      titleTypographyProps={{ color: 'secondary' }}
      data={viewData}
    />
  )
}

VersionForm.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
}

export default VersionForm
