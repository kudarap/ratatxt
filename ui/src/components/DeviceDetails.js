import React from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Skeleton from '@material-ui/core/Skeleton'

import DataCard from './DataCard'
import Link from './Link'
import DataScore from './DataScore'
import Dialog from './DeviceUpdateDialog'
import withUpdate from '../containers/withUpdate'
import Error from '../pages/Error'
import format from '../services/format'
import Typography from './Typography'

const DeviceUpdate = withUpdate(Dialog, 'device', 'Device successfully updated!')

export default function DeviceDetails({ data, loading, errorText }) {
  const scoreData = {
    Date: data.updated_at,
    ID: data.id,
    Active: format.deviceActiveState(data.last_active),
  }

  const viewData = {
    ID: data.id,
    Name: data.name,
    Address: data.address,
    'Last active': data.last_active ? format.datetime(data.last_active) : 'never',
    Created: data.created_at,
  }

  const [open, setOpen] = React.useState(false)

  if (errorText && !loading && !open) {
    return <Error>{errorText}</Error>
  }

  const showLoader = loading && !data.id
  return (
    <>
      <Typography gutterBottom>
        <Link to="/devices" variant="subtitle2" underline="hover">
          DEVICE
        </Link>
      </Typography>

      {showLoader ? (
        <Skeleton variant="text" height={40} width={400} />
      ) : (
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography variant="h5" medium gutterBottom color="textPrimary">
            {data.name}
          </Typography>
          <span style={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            size="small"
            sx={{ float: 'right' }}
            onClick={() => setOpen(true)}>
            Edit
          </Button>
        </div>
      )}

      <Divider />

      <DataScore data={scoreData} loading={showLoader} />
      <br />

      <DataCard title="Overview" data={viewData} loading={showLoader} error={errorText} />

      {open && <DeviceUpdate open onClose={() => setOpen(false)} />}
    </>
  )
}
DeviceDetails.propTypes = {
  data: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  errorText: PropTypes.string,
  onClose: PropTypes.func,
}
