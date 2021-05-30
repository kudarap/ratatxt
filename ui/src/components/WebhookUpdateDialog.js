import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import LinearProgress from '@material-ui/core/LinearProgress'
import TextField from '@material-ui/core/TextField'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

import { webhookObject } from '../reducers/webhooks'
import DialogError from './DialogError'

export default function WebhookUpdateDialog({
  data: initData,
  loading,
  error,
  open,
  onSubmit,
  onClose,
}) {
  const [data, setData] = React.useState(webhookObject)

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
      payload_url: String(data.payload_url),
      secret: String(data.secret),
      active: Boolean(data.active),
    }

    onSubmit(payload)
  }

  const handleFieldChange = (setter, field) => e =>
    setter({
      ...data,
      [field]: e.target.value,
    })

  const handleSwitchChange = evt => {
    setData({ ...data, active: evt.target.checked })
  }

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

        <DialogTitle>Update webhook</DialogTitle>
        <DialogContent dividers>
          <DialogError text={error} sx={{ mb: 2 }} />

          {/* Dialog editable form fields */}
          <TextField
            fullWidth
            required
            margin="dense"
            label="URL"
            placeholder="https://example.com/sms-webhook"
            helperText="Every message updates will POST request to this URL."
            value={data.payload_url}
            onChange={handleFieldChange(setData, 'payload_url')}
          />
          <TextField
            fullWidth
            required
            margin="dense"
            label="Secret"
            placeholder="my-secret-string"
            helperText="Secret will be included on every request payload."
            value={data.secret}
            onChange={handleFieldChange(setData, 'secret')}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch checked={data.active} value={data.active} onChange={handleSwitchChange} />
              }
              label="Active"
            />
          </FormGroup>
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
WebhookUpdateDialog.defaultProps = {
  data: webhookObject,

  open: false,
  onSubmit: () => {},
  onClose: () => {},
}
WebhookUpdateDialog.propTypes = {
  // Entity props
  data: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.string,

  // Dialog props
  open: PropTypes.bool,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
}
