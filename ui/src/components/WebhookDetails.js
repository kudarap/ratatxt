import React from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Skeleton from '@material-ui/core/Skeleton'

import DataCard from './DataCard'
import Link from './Link'
import DataScore from './DataScore'
import Dialog from './WebhookUpdateDialog'
import withUpdate from '../containers/withUpdate'
import Error from '../pages/Error'
import format from '../services/format'
import Typography from './Typography'

const WebhookUpdate = withUpdate(Dialog, 'webhook', 'Webhook successfully updated!')

export default function WebhookDetails({ data, loading, errorText }) {
  const scoreData = {
    Date: data.updated_at,
    ID: data.id,
    Active: format.boolean(data.active),
  }

  const viewData = {
    ID: data.id,
    URL: data.payload_url,
    Secret: data.secret,
    'Last response code': data.last_resp_code ? data.last_resp_code : '--',
    'Last used': data.last_used ? format.datetime(data.last_used) : 'never',
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
        <Link to="/webhooks" variant="subtitle2" underline="hover">
          WEBHOOK
        </Link>
      </Typography>

      {showLoader ? (
        <Skeleton variant="text" height={40} width={400} />
      ) : (
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography variant="h5" medium gutterBottom color="textPrimary">
            {data.payload_url}
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

      <DataCard title="Overview" data={viewData} error={errorText} loading={showLoader} />

      {open && <WebhookUpdate open onClose={() => setOpen(false)} />}
    </>
  )
}
WebhookDetails.propTypes = {
  data: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  errorText: PropTypes.string,
  onClose: PropTypes.func,
}
