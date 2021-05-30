import React from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import Divider from '@material-ui/core/Divider'
import Skeleton from '@material-ui/core/Skeleton'

import Typography from './Typography'
import DataCard from './DataCard'
import DialogError from './DialogError'
import Link from './Link'
import DataScore from './DataScore'
import format from '../services/format'
import { statusBadge } from '../constants/message'

export default function OutboxDetails({ data, loading, errorText }) {
  const { pathname } = useLocation()
  const baseURL = pathname.replace(`/${data.id}`, '')

  const scoreData = {
    ID: data.id,
    Status: statusBadge[data.status],
    Device: (
      <Link to={`/devices/${data.device_id}`} variant="subtitle2" underline="hover">
        {data.device.name}
      </Link>
    ),
  }

  const viewData = {
    Date: format.datetime(data.timestamp),
    Address: data.address,
    Message: data.text,
    Created: data.created_at,
    Updated: data.updated_at,
  }

  return (
    <>
      <DialogError text={errorText} />

      <Typography gutterBottom>
        <Link to={baseURL} variant="subtitle2" underline="hover">
          OUTBOX
        </Link>
      </Typography>

      {loading ? (
        <Skeleton variant="text" height={40} width={400} />
      ) : (
        <Typography variant="h5" medium gutterBottom color="textPrimary">
          {data.address}
        </Typography>
      )}
      <Divider />

      <DataScore data={scoreData} loading={loading} />
      <br />

      <DataCard title="Overview" data={viewData} loading={loading} error={errorText} />
    </>
  )
}
OutboxDetails.propTypes = {
  data: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  errorText: PropTypes.string,
  onClose: PropTypes.func,
}
