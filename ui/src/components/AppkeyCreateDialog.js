import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import LinearProgress from '@material-ui/core/LinearProgress'
import TextField from '@material-ui/core/TextField'
import Alert from '@material-ui/core/Alert'

import Typography from './Typography'
import { appkeyObject } from '../reducers/appkeys'
import DialogError from './DialogError'

export default function AppkeyCreateDialog({
  data: initData,
  loading,
  error,
  open,
  onSubmit,
  onClose,
}) {
  const [data, setData] = React.useState(appkeyObject)

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
      note: String(data.note),
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

        <DialogTitle>Generate token</DialogTitle>

        <DialogContent dividers>
          <DialogError text={error} sx={{ mb: 2 }} />

          {data.token ? (
            <>
              <Alert severity="success">Appkey successfully created and ready to use!</Alert>
              <TextField
                fullWidth
                margin="dense"
                value={data.token}
                helperText="Copy this token it will only display once."
              />
            </>
          ) : (
            <>
              <Typography gutterBottom>
                Appkey tokens provides access to your resources that can be use on server scripts or
                apps.
              </Typography>
              <TextField
                fullWidth
                required
                margin="dense"
                label="note"
                placeholder="my-app or sentry-server"
                helperText="What’s this token for?"
                value={data.note}
                onChange={handleFieldChange(setData, 'note')}
              />
            </>
          )}
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions>
          <Button onClick={onClose} tabIndex="-1">
            Close
          </Button>
          {!data.token && (
            <Button type="submit" disabled={loading}>
              Generate
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  )
}
AppkeyCreateDialog.defaultProps = {
  open: false,
  onSubmit: () => {},
  onClose: () => {},
}
AppkeyCreateDialog.propTypes = {
  // Entity props
  loading: PropTypes.bool,
  error: PropTypes.string,

  // Dialog props
  open: PropTypes.bool,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
}
