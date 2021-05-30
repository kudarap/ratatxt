import React from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import Divider from '@material-ui/core/Divider'
import Skeleton from '@material-ui/core/Skeleton'

import DataCard from './DataCard'
import DialogError from './DialogError'
import Link from './Link'
import DataScore from './DataScore'
import format from '../services/format'
import { statusBadge } from '../constants/message'
import Typography from './Typography'

export default function InboxDetails({ data, loading, errorText }) {
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
  }

  return (
    <>
      <DialogError text={errorText} />

      <Typography gutterBottom>
        <Link to={baseURL} variant="subtitle2" underline="hover">
          INBOX
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
InboxDetails.propTypes = {
  data: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  errorText: PropTypes.string,
  onClose: PropTypes.func,
}
