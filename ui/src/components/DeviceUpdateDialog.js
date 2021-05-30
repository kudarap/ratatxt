import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import LinearProgress from '@material-ui/core/LinearProgress'
import TextField from '@material-ui/core/TextField'

import { deviceObject } from '../reducers/devices'
import DialogError from './DialogError'

export default function DeviceUpdateDialog({
  data: initData,
  loading,
  error,
  open,
  onSubmit,
  onClose,
}) {
  const [data, setData] = React.useState(deviceObject)

  // Fill initial form input values.
  React.useEffect(() => {
    setData(initData)
  }, [initData])

  function handleSubmit(e) {
    e.preventDefault()
    if (loading) {
      return
    }

    let payload = {
      name: String(data.name),
      address: String(data.address),
    }

    onSubmit(payload)
  }

  const handleFieldChange = (setter, field) => e =>
    setter({
      ...data,
      [field]: e.target.value,
    })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      disableBackdropClick>
      <form onSubmit={handleSubmit}>
        {/* Dialog loader */}
        <LinearProgress style={{ visibility: loading ? 'visible' : 'hidden' }} />

        <DialogTitle>Update device</DialogTitle>
        <DialogContent dividers>
          <DialogError text={error} sx={{ mb: 2 }} />

          {/* Dialog editable form fields */}
          <TextField
            fullWidth
            required
            margin="dense"
            label="Name"
            helperText="Unique device name."
            value={data.name}
            onChange={handleFieldChange(setData, 'name')}
          />
          <TextField
            fullWidth
            required
            margin="dense"
            label="Address"
            helperText="Number or address referencing the device."
            value={data.address}
            onChange={handleFieldChange(setData, 'address')}
          />
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions>
          <Button onClick={onClose} tabIndex="-1">
            Close
          </Button>
          <Button type="submit" disabled={loading}>
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
DeviceUpdateDialog.defaultProps = {
  data: deviceObject,

  open: false,
  onSubmit: () => {},
  onClose: () => {},
}
DeviceUpdateDialog.propTypes = {
  // Entity props
  data: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.string,

  // Dialog props
  open: PropTypes.bool,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
}
