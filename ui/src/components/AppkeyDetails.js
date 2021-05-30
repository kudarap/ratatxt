import React from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Skeleton from '@material-ui/core/Skeleton'

import DataCard from './DataCard'
import Link from './Link'
import DataScore from './DataScore'
import Dialog from './AppkeyDeleteDialog'
import withDelete from '../containers/withDelete'
import Error from '../pages/Error'
import format from '../services/format'
import Typography from './Typography'

const AppkeyUpdate = withDelete(Dialog, 'appkey', 'Appkey permanently deleted!', '/appkeys')

export default function AppkeyDetails({ data, loading, errorText }) {
  const scoreData = {
    Date: data.created_at,
    ID: data.id,
  }

  const viewData = {
    ID: data.id,
    Note: data.note,
    'Last used': data.last_used ? format.datetime(data.last_used) : 'never',
    Created: data.created_at,
  }

  const [open, setOpen] = React.useState(false)

  if (errorText && !loading && !open) {
    return <Error>{errorText}</Error>
  }

  return (
    <>
      <Typography gutterBottom>
        <Link to="/appkeys" variant="subtitle2" underline="hover">
          APPKEY
        </Link>
      </Typography>

      {loading ? (
        <Skeleton variant="text" height={40} width={400} />
      ) : (
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography variant="h5" medium gutterBottom color="textPrimary">
            {data.note}
          </Typography>
          <span style={{ flexGrow: 1 }} />
          <Button
            color="error"
            variant="contained"
            size="small"
            sx={{ float: 'right' }}
            onClick={() => setOpen(true)}>
            Permanently Delete Key
          </Button>
        </div>
      )}
      <Divider />

      <DataScore data={scoreData} loading={loading} />
      <br />

      <DataCard title="Overview" data={viewData} error={errorText} loading={loading} />

      {open && <AppkeyUpdate open onClose={() => setOpen(false)} />}
    </>
  )
}
AppkeyDetails.propTypes = {
  data: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  errorText: PropTypes.string,
  onClose: PropTypes.func,
}
