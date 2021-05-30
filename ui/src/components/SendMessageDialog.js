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
import DeviceSelector from '../containers/DeviceSelector'

export default function SendMessageDialog({ open, loading, error, onSubmit, onClose }) {
  const [data, setData] = React.useState(deviceObject)

  function handleSubmit(e) {
    e.preventDefault()
    if (loading) {
      return
    }

    let payload = {
      device_id: String(data.device_id),
      text: String(data.text),
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

        <DialogTitle>Send Message</DialogTitle>
        <DialogContent dividers>
          <DialogError text={error} sx={{ mb: 2 }} />

          {/* Dialog editable form fields */}
          <DeviceSelector
            fullWidth
            required
            margin="dense"
            value={data.device_id}
            onChange={handleFieldChange(setData, 'device_id')}
            helperText="Target device to send this message"
          />
          <TextField
            fullWidth
            required
            margin="dense"
            label="Address"
            helperText="Recipient number"
            value={data.address}
            onChange={handleFieldChange(setData, 'address')}
          />
          <TextField
            fullWidth
            required
            multiline
            minRows={2}
            margin="dense"
            label="Text"
            helperText="SMS message content"
            value={data.text}
            onChange={handleFieldChange(setData, 'text')}
          />
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions>
          <Button onClick={onClose} disabled={loading} tabIndex="-1">
            Close
          </Button>
          <Button type="submit" disabled={loading}>
            Send
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
SendMessageDialog.defaultProps = {
  open: false,
  onSubmit: () => {},
  onClose: () => {},
}
SendMessageDialog.propTypes = {
  // Entity props
  loading: PropTypes.bool,
  error: PropTypes.string,

  // Dialog props
  open: PropTypes.bool,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
}
